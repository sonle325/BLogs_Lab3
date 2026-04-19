/**
 * fetchModel – issue a GET request to the backend and return parsed JSON.
 *
 * Because the frontend's package.json sets "proxy": "http://localhost:3001",
 * we can use relative paths (e.g. "/user/list") in development.
 * In production, replace the empty string with the real backend base URL.
 *
 * @param {string} url  Relative path to the backend endpoint (e.g. "/user/list")
 * @returns {Promise<any>}  Resolves with parsed JSON, rejects with an Error.
 */
function fetchModel(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      return response.json().then((body) => {
        throw new Error(body.error || `HTTP error: ${response.status}`);
      });
    }
    return response.json();
  });
}

export default fetchModel;
