// Handle incoming doc requests here

import { sendRequest } from "./send-request";
const BASE_URL = "/api/docs";

export async function create() {
  return sendRequest(`${BASE_URL}/create`, 'POST');
}

export async function getDoc(docId) {
  return sendRequest(`${BASE_URL}/${docId}`, 'GET');
}

export async function update(docId, name, content) {
  return sendRequest(`${BASE_URL}/${docId}/update`, 'POST', { name, content});
}

export async function deleteDoc(docId) {
  return sendRequest(`${BASE_URL}/delete`, 'POST', { docId });
}

export function getAllDocs() {
  return sendRequest(BASE_URL);
}

// export async function login(credentials) {
//   // Fetch uses an options object as a second arg to make requests
//   // other than basic GET requests, include data, headers, etc.
//   const res = await fetch(`${BASE_URL}/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     // Fetch requires data payloads to be stringified
//     // and assigned to a body property on the options object
//     body: JSON.stringify(credentials)
//   });
//   // Check if request was successful
//   if (res.ok) {
//     // res.json() will resolve to the JWT
//     return res.json();
//   } else {
//     throw new Error('Invalid Login');
//   }
// }

// export function checkToken() {
//   return sendRequest(BASE_URL + '/check-token')
// }
