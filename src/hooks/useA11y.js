// Antes este arquivo criava um segundo contexto (vazio), diferente do usado pelo A11yProvider.
// Quem importava daqui recebia `null`. Agora é só um atalho para o contexto real.
export { useA11y } from '../context/A11yContext';