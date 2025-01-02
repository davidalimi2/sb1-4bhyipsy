import React from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Select } from '../../../../shared/ui/Select';
import type { StructureElement } from '../../../../../types/template';

interface TableElementProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function TableElement({ element, onUpdate }: TableElementProps) {
  const rows = element.properties.rows || 2;
  const columns = element.properties.columns || 2;
  const data = element.content ? JSON.parse(element.content) : Array(rows).fill(Array(columns).fill(''));

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = data.map((row: string[], i: number) =>
      i === rowIndex
        ? row.map((cell: string, j: number) =>
            j === colIndex ? value : cell
          )
        : row
    );
    onUpdate({
      ...element,
      content: JSON.stringify(newData)
    });
  };

  const updateDimensions = (newRows: number, newColumns: number) => {
    const newData = Array(newRows).fill(null).map((_, rowIndex) =>
      Array(newColumns).fill(null).map((_, colIndex) =>
        data[rowIndex]?.[colIndex] || ''
      )
    );
    onUpdate({
      ...element,
      content: JSON.stringify(newData),
      properties: {
        ...element.properties,
        rows: newRows,
        columns: newColumns
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={rows}
          onChange={(e) => updateDimensions(parseInt(e.target.value), columns)}
          label="Rows"
        >
          {[2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </Select>

        <Select
          value={columns}
          onChange={(e) => updateDimensions(rows, parseInt(e.target.value))}
          label="Columns"
        >
          {[2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {data.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, colIndex: number) => (
                  <td key={colIndex} className="p-2">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      placeholder={`Cell ${rowIndex + 1},${colIndex + 1}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}