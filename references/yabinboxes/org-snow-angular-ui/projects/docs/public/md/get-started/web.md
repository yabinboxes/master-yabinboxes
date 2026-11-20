# <a id="web-hosted-dashboard"></a>Web (hosted dashboard)

Use the SnowMonkeys web dashboard to manage deployments without running the stack locally. Sign in with GitHub and access clusters, services, and applications from the browser.

**Dashboard URL:** `https://snow-monkeys.com` (or your deployed host)

---

## <a id="web-flow-overview"></a>Web flow overview

| Step | Action |
|---|---|
| 1 | Open the dashboard in your browser |
| 2 | Sign in with **Continue with GitHub** |
| 3 | Snow loads your profile and license |
| 4 | Use the dashboard to view and manage deployments |

---

## <a id="1-open-the-login-page"></a>1) Open the login page

Navigate to the dashboard URL. You should see the SnowMonkeys login screen:

![SnowMonkeys login — Continue with GitHub](/images/login-dashboard.png)

The login page offers:

- **Continue with GitHub** — primary sign-in (Firebase GitHub OAuth)
- **Browse documentation** — opens the docs site if you need setup guides first

---

## <a id="2-sign-in-with-github"></a>2) Sign in with GitHub

1. Click **Continue with GitHub**.
2. Authorize SnowMonkeys in the GitHub OAuth prompt (first time only).
3. After a successful sign-in, you are redirected to the dashboard **Sources** view.

Snow Monkeys loads your user profile and license from the API (`snow-monkeys.com:8080`) in the background.

---

## <a id="3-use-the-dashboard"></a>3) Use the dashboard

After sign-in you land on the **Sources** view — the main dashboard for browsing deployments:

![SnowMonkeys dashboard — Resources and filters](/images/dashboard-sources.png)

From here you can:

- Browse **Resources** (applications, services, clusters) in the card list
- Filter by **type**, **provider**, and **color** in the left sidebar
- Search deployments with the search bar
- Select a card to see details (repository, application URL, owner, timestamps)
- Open **Settings**, **Reports**, and **Easy deployment** from the top nav (depending on your license)
- Access **Docs** from the navbar

---

## <a id="prerequisites"></a>Prerequisites

- A GitHub account with access to the repositories you deploy
- Firebase GitHub OAuth configured for the dashboard (see `projects/dashboard/FIREBASE_SETUP.md`)

---

## <a id="troubleshooting"></a>Troubleshooting

| Issue | What to check |
|---|---|
| GitHub sign-in fails | Firebase OAuth app settings and authorized domains |
| Profile or license missing | Backend profile endpoint and `SNOW_TOKEN` / Snow tokens |

---

## <a id="related"></a>Related

- [Local installation (Docker Compose)](/docs/get-started/local) — run the full stack on your machine
- [Hetzner VM (server)](/docs/provider/hetzner/hetzner-vm) — provision your first host
