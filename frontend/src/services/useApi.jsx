import { useState, createContext, useContext } from 'react';

// oxlint-disable-next-line react/only-export-components
export const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [urlBase, setUrlBase] = useState('http://localhost:3000/api');
  const [authorization, setAuthorization] = useState('');

  async function request(url, options) {
    options = { ...options };

    if (options.body) {
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);

        options.headers ??= {};
        options.headers['Content-Type'] = 'application/json';
      }
    }

    if (options.json) {
      options.headers ??= {};
      options.headers['Accept'] = 'application/json';
    }

    if (authorization) {
      options.headers ??= {};
      options.headers['Authorization'] = authorization;
    }

    const res = await fetch(urlBase + url, {
      ...options,
    });

    if (!res.ok) {
      let message = `Error en la petición: ${res.status} ${res.statusText}`;
      try {
        const payload = await res.json();
        if (payload.error)
          message = payload.error;
      } catch {
        // Keep the HTTP status message when the server does not return JSON.
      }
      throw new Error(message);
    }

    if (options.json && res.status !== 204)
      return await res.json();

    return options.json ? null : await res.text();
  }

  async function post(url, body) {
    return await request(url, {
      method: 'POST',
      body,
    });
  }

  async function postJson(url, body) {
    return await request(url, {
      method: 'POST',
      body,
      json: true,
    });
  }

  async function getJson(url, options = {}) {
    return await request(url, {
      method: 'GET',
      json: true,
      ...options,
    });
  }

  async function deleteJson(url, options = {}) {
    return await request(url, {
      method: 'DELETE',
      json: true,
      ...options,
    });
  }

  async function patchJson(url, body, options = {}) {
    return await request(url, {
      method: 'PATCH',
      body,
      json: true,
      ...options,
    });
  }

  async function putJson(url, body, options = {}) {
    return await request(url, {
      method: 'PUT',
      body,
      json: true,
      ...options,
    });
  }

  return <ApiContext.Provider
    value={{
      urlBase,
      setUrlBase,
      authorization,
      setAuthorization,
      post,
      postJson,
      getJson,
      deleteJson,
      patchJson,
      putJson,
    }}
  >
    {children}
  </ApiContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export default function useApi() {
  return useContext(ApiContext);
}