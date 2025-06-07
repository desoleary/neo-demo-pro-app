import React from 'react';

export interface ColumnConfig<T> {
  key: keyof T;
  header: string;
}

export function DynamicTable<T extends Record<string, any>>({
  columns,
  data,
}: {
  columns: ColumnConfig<T>[];
  data: T[];
}) {
  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="border px-2 py-1 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-2 py-1">
                {String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
