"use client";
import { IClient, ITask, IWorker } from '@/types/sheets';
import { Dispatch, SetStateAction } from 'react';

export function DataGrid<T extends IClient | IWorker | ITask>({
  data,
  setData,
  label,
}: {
  data: T[];
  setData: Dispatch<SetStateAction<T[]>>;
  label: string;
}) {
  const handleChange = (
    rowIdx: number,
    key: keyof T,
    value: T[keyof T]
  ) => {
    const updated = [...data];
    updated[rowIdx][key] = value;
    setData(updated);
  };

  if (data.length === 0) return null;

  const headers = Object.keys(data[0]) as (keyof T)[];

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-800">{label}</h2>
        <span className="text-sm text-gray-500">
          {data.length} {data.length === 1 ? 'row' : 'rows'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center justify-between">
                    {String(h)}
                    <span className="text-gray-400">↕</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map((key, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap">
                    <input
                      className={`w-full text-gray-500 px-2 py-1 rounded border border-transparent focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none transition ${
                        row[key] ? 'bg-white' : 'bg-gray-100'
                      }`}
                      value={String(row[key] ?? '')}
                      onChange={(e) =>
                        handleChange(i, key, e.target.value as T[keyof T])
                      }
                      placeholder="Enter value"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t bg-gray-50 text-sm text-gray-500">
        Showing {data.length} entries
      </div>
    </div>
  );
}
