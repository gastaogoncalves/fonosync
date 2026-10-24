import { createContext, useContext } from 'react';

export const A11yContext = createContext(null);

export function useA11y() {
  return useContext(A11yContext);
}
