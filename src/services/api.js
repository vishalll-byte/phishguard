
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function requestJSON(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, options);

  const responseText = await response.text();
  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Server returned HTML or invalid JSON. HTTP ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export const signup = async (userData) => {
  return requestJSON("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
};

export const login = async (userData) => {
  return requestJSON("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
};

export const scanURL = async (url) => {
  return requestJSON("/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
};