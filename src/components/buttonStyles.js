const variants = {
  primary: 'border-primary bg-primary text-on-primary hover:brightness-[0.82] active:brightness-75',
  secondary: 'border-primary bg-surface text-navy hover:bg-primary hover:text-on-primary',
  tertiary: 'border-transparent bg-transparent text-navy hover:bg-primary/15 hover:text-primary',
  danger: 'border-danger bg-danger text-on-primary hover:brightness-[0.82]',
};

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm transition-colors disabled:pointer-events-none disabled:border-line disabled:bg-mist disabled:text-navy disabled:opacity-55';

export function buttonClass(variant = 'primary') {
  return `${base} ${variants[variant]}`;
}
