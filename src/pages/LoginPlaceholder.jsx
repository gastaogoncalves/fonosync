import { buttonClass } from '../components/buttonStyles';

export default function LoginPlaceholder({ title, nextHref }) {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center gap-4 bg-canvas px-18">
      <h1 className="text-[30px] text-navy">{title}</h1>
      <div className="flex gap-2">
        {nextHref && (
          <a href={nextHref} className={buttonClass('primary')}>
            Entrar
          </a>
        )}
        <a href="#/" className={buttonClass('secondary')}>
          Voltar ao site
        </a>
      </div>
    </main>
  );
}
