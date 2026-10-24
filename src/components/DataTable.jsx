export default function DataTable({ caption, columns, rows, emptyMessage = 'Nenhum registro encontrado.' }) {
  return (
    <div className="w-full overflow-x-auto border border-line bg-surface">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-mist text-navy uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="h-10 px-3 font-normal">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line">
              {columns.map((column, index) => (
                <td key={column.key} className={`h-11.5 px-3 ${index === 0 ? 'text-ink' : 'text-muted'}`}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr className="border-t border-line">
              <td colSpan={columns.length} className="h-11.5 px-3 text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
