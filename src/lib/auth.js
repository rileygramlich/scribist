// The login token (a JWT) lives in localStorage; its payload holds the user.
const KEY = "token";

function payload(token) {
    try {
        return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        return null;
    }
}

export function getToken() {
    let token = null;
    try { token = localStorage.getItem(KEY); } catch { return null; }
    const data = token && payload(token);
    if (!data || data.exp * 1000 < Date.now()) {
        try { localStorage.removeItem(KEY); } catch {}
        return null;
    }
    return token;
}

export function getUser() {
    const token = getToken();
    return token ? payload(token).user : null;
}

export function saveToken(token) {
    localStorage.setItem(KEY, token);
    return getUser();
}

export function logout() {
    try { localStorage.removeItem(KEY); } catch {}
}
