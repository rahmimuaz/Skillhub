// SessionManager.js

const SESSION_KEY = "skillhub_user_session";

/**
 * Save user session to localStorage.
 * @param {Object} userData - Object containing user session info.
 */
export const saveSession = (userData) => {
  if (userData && typeof userData === "object") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  } else {
    console.warn("Invalid session data. Must be an object.");
  }
};

/**
 * Get current session data from localStorage.
 * @returns {Object|null} - Parsed session object or null if not found.
 */
export const getSession = () => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (err) {
    console.error("Failed to parse session data:", err);
    return null;
  }
};

/**
 * Clear the current user session from localStorage.
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Check whether a user session exists.
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  const session = getSession();
  return session && session.email ? true : false;
};
