import { createPortal } from 'react-dom';
import AccessibilityPanel from './AccessibilityPanel';

// fora do header, porque o backdrop-blur dele quebra o position: fixed
export default function A11yModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <AccessibilityPanel onClose={onClose} className="fixed top-20 right-4 sm:right-6" />,
    document.body,
  );
}