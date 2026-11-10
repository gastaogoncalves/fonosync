import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={className}
      {...rest}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}