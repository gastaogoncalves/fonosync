const sidebarItems = [
  { label: 'Dashboard', dot: 'bg-primary', active: true },
  { label: 'Pacientes', dot: 'bg-emerald-500' },
  { label: 'Agenda', dot: 'bg-primary' },
  { label: 'Relatórios', dot: 'bg-orange-500' },
];

const kpis = [
  { value: '24', label: 'Pacientes' },
  { value: '8', label: 'Hoje' },
  { value: '92%', label: 'Aderência' },
];

const bars = [
  { day: 'S', height: 55 },
  { day: 'T', height: 70 },
  { day: 'Q', height: 90, active: true },
  { day: 'Q', height: 65 },
  { day: 'S', height: 80 },
  { day: 'S', height: 45 },
  { day: 'D', height: 30 },
];

export default function HeroMockup() {
  return (
    <div className="relative">
      {/* Janela do navegador: inclinada e com hover que "endireita" */}
      <div className="overflow-hidden rounded-2xl bg-[#1a2535] shadow-[0_40px_100px_rgba(13,30,46,0.35)] ring-1 ring-white/10 transition-transform duration-500 lg:[transform:perspective(1000px)_rotateY(-4deg)_rotateX(2deg)] lg:hover:[transform:perspective(1000px)_rotateY(-1deg)_rotateX(1deg)]">
        <div className="flex items-center gap-2 bg-[#0f1820] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 flex-1 rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-white/35">
            fonosync.app/dashboard
          </span>
        </div>

        <div className="flex min-h-96 bg-[#f4f7fb]">
          <aside className="hidden w-40 shrink-0 bg-navy p-3 sm:block">
            <div className="mb-5 px-2 font-serif text-base text-white">FonoSync</div>
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`mb-0.5 flex items-center gap-2 rounded-lg px-2 py-2 text-xs ${
                  item.active ? 'bg-white/10 text-white' : 'text-white/50'
                }`}
              >
                <span className={`size-2 shrink-0 rounded-full ${item.dot}`} />
                {item.label}
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-navy">Visão Geral</div>
              <div className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                + Novo Paciente
              </div>
            </div>

            <div className="mb-3 grid grid-cols-3 gap-2">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-lg border border-primary/15 bg-white p-3">
                  <div className="text-2xl font-bold text-navy">{kpi.value}</div>
                  <div className="text-xs text-muted">{kpi.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-primary/15 bg-white p-4">
              <div className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">
                Sessões por semana
              </div>
              <div className="flex h-28 items-end gap-2">
                {bars.map((bar, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <div
                      className={`w-full rounded-t ${bar.active ? 'bg-primary' : 'bg-primary/20'}`}
                      style={{ height: `${bar.height}%` }}
                    />
                    <span className="text-[10px] text-muted">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge flutuante */}
      <div className="absolute -bottom-5 right-2 flex min-w-44 items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-xl sm:-right-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-lg">
          🎯
        </div>
        <div>
          <div className="text-sm font-semibold text-navy">Evolução registrada</div>
          <div className="text-xs text-muted">Ana Lima — fonema /r/ ↑ 12%</div>
        </div>
      </div>
    </div>
  );
}