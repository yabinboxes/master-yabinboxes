/*import { test, expect } from '@playwright/test';

const email = 'yabin.monroy.1@gmail.com';
const type = 'ALL';
let snowDeploymentId = 0;

const apiList = [
  {
    snowToken: "1234",
    actor: "yabinboxes",
    email: email,
    sha: "123aaaabbd",
    snowType: "CLUSTER",
    snowName: "k8s-civo-updated2",
    provider: "civo",
    repositoryOwner: "yabinboxes/hello-app-image-3",
    url: "",
    urlPath: "",
    port: "",
    image: "",
    registry: "",
    status: "string",
    payload: "string",
    notes: "string",
    processed: 0,
    extras: "string",
    description: "string",
    healthCheckPath: "string",
    healthCheckTime: "string"
  },
  {
    snowToken: "1234",
    actor: "yabinboxes",
    email: email,
    sha: "123aaaabbd",
    snowType: "APPLICATION",
    snowName: "k8s-civo-updated2",
    provider: "civo",
    repositoryOwner: "yabinboxes/hello-app-image-3",
    url: "",
    urlPath: "",
    port: "",
    image: "",
    registry: "",
    status: "string",
    payload: "string",
    notes: "string",
    processed: 0,
    extras: "string",
    description: "string",
    healthCheckPath: "string",
    healthCheckTime: "string"
  },
  {
    snowToken: "1234",
    actor: "yabinboxes",
    email: email,
    sha: "123aaaabbd",
    snowType: "SERVICE",
    snowName: "k8s-civo-updated2",
    provider: "civo",
    repositoryOwner: "yabinboxes/hello-app-image-3",
    url: "",
    urlPath: "",
    port: "",
    image: "",
    registry: "",
    status: "string",
    payload: "string",
    notes: "string",
    processed: 0,
    extras: "string",
    description: "string",
    healthCheckPath: "string",
    healthCheckTime: "string"
  },
  {
    snowToken: "1234",
    actor: "yabinboxes",
    email: email,
    sha: "123aaaabbd",
    snowType: "CLUSTER",
    snowName: "k8s-civo-updated2",
    provider: "civo",
    repositoryOwner: "yabinboxes/hello-app-image-3",
    url: "",
    urlPath: "",
    port: "",
    image: "",
    registry: "",
    status: "string",
    payload: "string",
    notes: "string",
    processed: 0,
    extras: "string",
    description: "string",
    healthCheckPath: "string",
    healthCheckTime: "string"
  },
  {
    snowToken: "1234",
    actor: "yabinboxes",
    email: email,
    sha: "123aaaabbd",
    snowType: "CLUSTER",
    snowName: "k8s-civo-updated2",
    provider: "civo",
    repositoryOwner: "yabinboxes/hello-app-image-3",
    url: "",
    urlPath: "",
    port: "",
    image: "",
    registry: "",
    status: "string",
    payload: "string",
    notes: "string",
    processed: 0,
    extras: "string",
    description: "string",
    healthCheckPath: "string",
    healthCheckTime: "string"
  }
  
];

test('GET request to health endpoint', async ({ request }) => {
  const url = 'http://localhost:8080/health';
  
  // Make GET request
  const response = await request.get(url);
  
  // Assert response status is successful (200-299)
  expect(response.ok()).toBeTruthy();
  
  // Get response text
  const responseText = await response.text();
  
  // Assert response text equals "Healthy"
  expect(responseText).toBe('Healthy');
});

// 1. truncate snow tables
test('DELETE request to truncate snow deployments', async ({ request }) => {
  const url = 'http://localhost:8080/connectors/publish-snow-deployment/truncate';
  
  // Make DELETE request
  const response = await request.delete(url);
  
  // Assert response status is successful (200-299)
  expect(response.ok()).toBeTruthy();
  
  // Log the response for debugging (optional)
  console.log('Delete Response Status:', response.status());
  const responseText = await response.text();
  if (responseText) {
    console.log('Delete Response:', responseText);
  }
});

test('POST request to get profile - new user', async ({ request }) => {
  const url = 'http://localhost:8080/connectors/profile';
  
  // Request body - get profile, if doesnt exist, create it
  const requestBody = {
    email: email,
    snowToken: "",
    license: "",
    org: ""
  };
  
  // Make POST request
  const response = await request.post(url, {
    data: requestBody,
  });
  
  // Assert response status is successful (200-299)
  expect(response.ok()).toBeTruthy();
  
  // Parse response body as JSON
  const profile = await response.json();
  
  // Assert response is a JSON object (not array, not null, not primitive)
  expect(typeof profile).toBe('object');
  expect(profile).not.toBeNull();
  expect(Array.isArray(profile)).toBeFalsy();
  
  // Log the profile for debugging (optional)
  console.log('Profile:', JSON.stringify(profile, null, 2));
});

test('POST request to get profile', async ({ request }) => {
  const url = 'http://localhost:8080/connectors/profile';
  
  // Request body - get profile, if doesnt exist, create it
  const requestBody = {
    email: email,
    snowToken: "",
    license: "",
    org: ""
  };
  
  // Make POST request
  const response = await request.post(url, {
    data: requestBody,
  });
  
  // Assert response status is successful (200-299)
  expect(response.ok()).toBeTruthy();
  
  // Parse response body as JSON
  const profile = await response.json();
  
  // Assert response is a JSON object (not array, not null, not primitive)
  expect(typeof profile).toBe('object');
  expect(profile).not.toBeNull();
  expect(Array.isArray(profile)).toBeFalsy();
  
  // Log the profile for debugging (optional)
  console.log('Profile:', JSON.stringify(profile, null, 2));
});

test('POST request to publish snow deployment', async ({ request }) => {
  const url = 'http://localhost:8080/connectors/publish-snow-deployment';
  
  // Request body - modify as needed for your API requirements

  for (const api of apiList) {  
    const requestBody = api;
    const response = await request.post(url, {
      data: requestBody,
    });
    expect(response.ok()).toBeTruthy();
    const responseText = await response.text();
    expect(responseText).toBe('completed');
  }
  
});


test('GET request for snow deployments', async ({ request }) => {
  const url = 'http://localhost:8080/connectors/get-snow-deployments';
  
  // Make GET request
  const response = await request.get(url);
  
  // Assert response status is successful (200-299)
  expect(response.ok()).toBeTruthy();
  
  // Parse response body as JSON
  const responseBody = await response.json();
  
  // Assert response is an array
  expect(Array.isArray(responseBody)).toBeTruthy();
  
  // Assert array contains objects (if array is not empty)
  if (responseBody.length > 0) {
    expect(typeof responseBody[0]).toBe('object');
    expect(responseBody[0]).not.toBeNull();
    // Ensure it's not an array (to confirm it's an object)
    expect(Array.isArray(responseBody[0])).toBeFalsy();
    
    // Set snowDeploymentId from first element
    snowDeploymentId = responseBody[0].snowDeploymentId;
    console.log('Set snowDeploymentId:', snowDeploymentId);
  }
  
  // Log the response for debugging (optional)
  console.log('Response:', JSON.stringify(responseBody, null, 2));
});

test('PUT request to update snow deployment color', async ({ request }) => {
  await new Promise(resolve => setTimeout(resolve, 15000));
  console.log('snowDeploymentId:', snowDeploymentId);
  const url = 'http://localhost:8080/connectors/publish-snow-deployment/color/1?color=blue';
  
  // Make PUT request
  const response = await request.put(url);
  
  // Assert response status is successful (200-299)
  expect(response.ok()).toBeTruthy();
  
  // Log the response for debugging (optional)
  console.log('PUT Response Status:', response.status());
  const responseText = await response.text();
  if (responseText) {
    console.log('PUT Response:', responseText);
  }
});

*/