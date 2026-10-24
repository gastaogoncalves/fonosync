export default function Panel({ title, aside, className = '', children }) {
  return (
    <section className={`flex flex-col gap-3 border border-line bg-surface p-4 ${className}`}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[28px] text-navy">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
