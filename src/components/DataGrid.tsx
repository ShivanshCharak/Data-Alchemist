"use client";

export function DataGrid({ data, setData, label }: any) {
  const handleChange = (rowIdx: number, key: string, value: any) => {
    const updated = [...data];
    updated[rowIdx][key] = value;
    setData(updated);
  };
  
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

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
                    {h}
                    <span className="text-gray-400">↕</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, i: number) => (
              <tr 
                key={i} 
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {headers.map((key, j) => (
                  <td 
                    key={j} 
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <input
                      className={`w-full text-gray-500 px-2 py-1 rounded border border-transparent focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none transition ${
                        row[key] ? 'bg-white' : 'bg-gray-100'
                      }`}
                      value={row[key] || ""}
                      onChange={(e) => handleChange(i, key, e.target.value)}
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