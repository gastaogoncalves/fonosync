import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  session: null,
  login: async () => null,
  register: async () => null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
