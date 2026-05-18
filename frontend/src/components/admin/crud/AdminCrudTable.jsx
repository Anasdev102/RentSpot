import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

export default function AdminCrudTable({ columns, rows, highlightedId, onEdit, onRemove }) {
  return (
    <section className="card mt-6 overflow-x-auto">
      <table className="admin-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column.replaceAll('_', ' ')}</th>)}<th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={String(row.id) === highlightedId ? 'bg-primary/10 ring-1 ring-inset ring-primary/20' : ''}>
              {columns.map((column) => (
                <td key={column}>
                  {['status', 'role'].includes(column) ? <StatusBadge status={String(row[column])} /> : String(row[column] ?? '')}
                </td>
              ))}
              <td>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(row)} className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary" aria-label="Edit"><Pencil size={15} /></button>
                  <button onClick={() => onRemove(row.id)} className="grid h-8 w-8 place-items-center rounded-md bg-red-50 text-red-700" aria-label="Delete"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
