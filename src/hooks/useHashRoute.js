import { useEffect, useState } from 'react';

// #/profissional/agenda -> /profissional/agenda
function readRoute() {
  const hash = window.location.hash.slice(1);
  return hash.startsWith('/') ? hash : '/';
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    function handleChange() {
      setRoute(readRoute());
    }
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return route;
}
