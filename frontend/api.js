/* api.js
   Small, robust API wrapper for the frontend.
   - BASE_URL points to backend API root.
   - request() handles JSON parse errors and throws readable Errors.
   - get/post helpers simplify usage in pages.
*/

/* Change this if your backend is elsewhere. For example:
  const BASE_URL = 'https://my-server.example.com/api';
  You can also set a meta tag in your HTML: <meta name="api-base" content="https://api.example.com/api">
*/
const metaApiBase = (typeof document !== 'undefined') && document.querySelector('meta[name="api-base"]');
const BASE_URL = window.__API_BASE__ || (metaApiBase && metaApiBase.content) || 'http://localhost:4000/api';

/**
 * Low-level request helper.
 * Throws Error with message from server or generic message.
 */
async function request(path, opts = {}) {
  const url = BASE_URL + path;
  const options = {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  };

  try {
    // Helper to run a single fetch attempt and parse response
    async function doFetch(targetUrl) {
      const res = await fetch(targetUrl, options);
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        const msg = data.error || data.message || res.statusText || 'Request failed';
        throw new Error(msg);
      }
      return data;
    }

    try {
      return await doFetch(url);
    } catch (err) {
      // If the request failed due to network (e.g. tunnel down) and the configured
      // BASE_URL looks like a localtunnel (temporary), try a localhost fallback.
      const isNetworkErr = err instanceof TypeError || /failed to fetch/i.test(err.message || '');
      const looksLikeLocalTunnel = typeof BASE_URL === 'string' && /loca\.lt|localtunnel\.me|ngrok\.io/.test(BASE_URL);

      if (isNetworkErr && looksLikeLocalTunnel) {
        const fallback = 'http://localhost:4000/api' + path;
        try {
          return await doFetch(fallback);
        } catch (err2) {
          // If fallback also fails, surface clear message combining both errors
          const m1 = err.message || String(err);
          const m2 = err2.message || String(err2);
          throw new Error(`Request failed to ${url} (network). Tried fallback ${fallback} and failed: ${m2}. Original: ${m1}`);
        }
      }

      // If it's a JSON parse error, surface a friendly message
      if (err instanceof SyntaxError) throw new Error('Server returned invalid JSON.');
      throw err;
    }
  } catch (err) {
    // rethrow with a friendly message
    if (err instanceof SyntaxError) throw new Error('Server returned invalid JSON.');
    throw err;
  }
}

/* GET helper */
async function apiGet(path) {
  return request(path, { method: 'GET' });
}

/* POST helper, body will be JSON-stringified */
async function apiPost(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

/* Export to window so pages can use without modules */
window.api = { apiGet, apiPost, BASE_URL };
