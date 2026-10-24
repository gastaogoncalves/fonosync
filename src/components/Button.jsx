import { buttonClass } from './buttonStyles';

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`${buttonClass(variant)} ${className}`} {...props}>
      {children}
    </button>
  );
}
