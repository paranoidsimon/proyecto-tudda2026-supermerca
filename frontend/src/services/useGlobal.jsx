import { createContext, useContext, useState } from 'react';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const clearSession = () => {
    setUsername(null);
    setRole(null);
  };

  return <GlobalContext.Provider
    value={{
      username, setUsername,
      role, setRole,
      clearSession,
    }}
  >
    {children}
  </GlobalContext.Provider>;
}

export default function useGlobal() {
  return useContext(GlobalContext);
}