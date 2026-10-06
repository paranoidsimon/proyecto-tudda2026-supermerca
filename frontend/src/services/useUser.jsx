import useApi from './useApi';

export default function useUser() {
  const api = useApi();

  return {
    getUsers: (options) => api.getJson('/users', options),
    getUser: (username, options) => api.getJson(`/users/${username}`, options),
    deleteUser: (username, options) => api.deleteJson(`/users/${username}`, options),
    updateUser: (username, data, options) => api.patchJson(`/users/${username}`, data, options),
    addUser: (data, options) => api.postJson('/users', data, options),
    register: (data, options) => api.postJson('/register', data, options),
  }
}