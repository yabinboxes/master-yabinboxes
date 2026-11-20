const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');

/**
 * Same-origin stand-in for https://github.com/login/oauth/access_token.
 * GitHub does not send Access-Control-Allow-Origin, so the browser cannot
 * exchange the code itself. The dev server forwards the request.
 * GITHUB_CLIENT_SECRET is added here and is never written into config.ts.
 */
function readBody(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

function readClientSecret() {
  const fromEnv = stripSecret(process.env.GITHUB_CLIENT_SECRET || '');
  if (fromEnv) return fromEnv;
  try {
    return stripSecret(fs.readFileSync(path.join(__dirname, 'github.client-secret'), 'utf8'));
  } catch {
    return '';
  }
}

function stripSecret(value) {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function allowAllCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');
}

async function exchangeToken(req, res) {
  allowAllCors(res);
  const secret = readClientSecret();
  if (!secret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'missing_client_secret',
      error_description: 'GitHub requires the OAuth app client secret. Save it in github.client-secret (one line) or set GITHUB_CLIENT_SECRET, then restart ng serve.',
    }));
    return;
  }

  const raw = await readBody(req);
  const params = new URLSearchParams(raw.toString());
  if (!params.has('client_secret')) {
    params.set('client_secret', secret);
  }
  const body = params.toString();

  const githubResponse = await new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
          'User-Agent': 'snow-dashboard',
        },
      },
      resolve,
    );
    request.on('error', reject);
    request.write(body);
    request.end();
  });

  const responseBody = await readBody(githubResponse);
  res.statusCode = githubResponse.statusCode || 502;
  res.setHeader('Content-Type', githubResponse.headers['content-type'] || 'application/json');
  res.end(responseBody);
}

module.exports = {
  '/github-oauth/access_token': {
    target: 'https://github.com',
    secure: true,
    changeOrigin: true,
    pathRewrite: { '^/github-oauth': '/login/oauth' },
    bypass(req, res) {
      if (!res) {
        return;
      }
      allowAllCors(res);
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return req.url;
      }
      if (req.method !== 'POST') {
        return;
      }
      return exchangeToken(req, res)
        .catch(() => {
          if (!res.writableEnded) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'github_token_proxy_failed',
              error_description: 'GitHub token request failed.',
            }));
          }
        })
        .then(() => req.url);
    },
  },
};
