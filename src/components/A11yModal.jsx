import { createPortal } from 'react-dom';
import AccessibilityPanel from './AccessibilityPanel';

/*
  Mantém a assinatura antiga (isOpen / onClose) para Footer, TriagemGame, AccessArea,
  PatientDashboard e ProfessionalDashboard continuarem funcionando sem mudança.
  O painel aparece fixo no canto superior direito, abaixo do cabeçalho, e fica fora
  do <header>/<footer> (portal) para o `backdrop-blur` deles não atrapalhar o `fixed`.
*/
export default function A11yModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <AccessibilityPanel onClose={onClose} className="fixed top-20 right-4 sm:right-6" />,
    document.body,
  );
}