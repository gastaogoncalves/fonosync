// Botões conforme o guia de design (Figma → 01 Foundations → Botões):
// 44px de altura mínima, 16px nas laterais, cantos de 6px e texto de 14px.
// O contorno de foco vem da regra global :focus-visible do index.css.
const variants = {
  primary: 'border-primary bg-primary text-white active:bg-navy',
  secondary: 'border-primary bg-white text-navy hover:bg-mist',
  tertiary: 'border-transparent bg-transparent text-navy hover:bg-mist',
  danger: 'border-danger bg-danger text-white',
};

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm transition-colors disabled:cursor-not-allowed disabled:border-line disabled:bg-mist disabled:text-navy disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
