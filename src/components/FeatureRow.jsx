export default function FeatureRow({ title, description, badge, reverse = false }) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-24">
      <div className={reverse ? 'md:order-2' : ''}>
        {badge && <div className="mb-4 text-primary">{badge}</div>}
        <h3 className="mb-4 text-3xl text-navy">{title}</h3>
        <p className="mb-6 text-lg leading-relaxed text-muted">{description}</p>
        <button
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-md px-1 text-primary hover:underline"
        >
          Saiba mais <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Placeholder para os gráficos de aderência e fluência */}
      <div className={`rounded-md border border-line bg-white p-6 ${reverse ? 'md:order-1' : ''}`}>
        <div className="flex aspect-4/3 items-center justify-center rounded-md bg-mist text-primary">
          Ilustração / Gráfico do Painel
        </div>
      </div>
    </div>
  );
}
