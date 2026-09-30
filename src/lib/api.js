import { getToken } from "./auth";

/** JSON in, JSON out, with the login token attached. Throws an Error with the server's message. */
export async function api(path, { method = "GET", body } = {}) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    let res;
    try {
        res = await fetch(`/api${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
        throw new Error("Can't reach Scribist. Check your connection.");
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const err = new Error((data && data.error) || `Something went wrong (${res.status}).`);
        err.status = res.status;
        throw err;
    }
    return data;
}

export const users = {
    config: () => api("/users/config"),
    signUp: (form) => api("/users", { method: "POST", body: form }),
    login: (form) => api("/users/login", { method: "POST", body: form }),
    google: (credential) => api("/users/google", { method: "POST", body: { credential } }),
};

export const docs = {
    list: () => api("/docs"),
    create: (fields = {}) => api("/docs", { method: "POST", body: fields }),
    get: (id, share) => api(`/docs/${id}${share ? `?share=${encodeURIComponent(share)}` : ""}`),
    rename: (id, name) => api(`/docs/${id}`, { method: "PATCH", body: { name } }),
    remove: (id) => api(`/docs/${id}`, { method: "DELETE" }),
};
