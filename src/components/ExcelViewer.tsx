"use client";

import { useEffect, useRef, useState } from "react";

interface ExcelViewerProps {
  fileData: string; // Base64 encoded Excel file
  fileName: string;
}

interface CellData {
  value: string | number | null;
  style?: {
    fill?: string; // Background color
    font?: {
      color?: string;
      bold?: boolean;
      italic?: boolean;
      size?: number;
      name?: string;
    };
    border?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    alignment?: {
      horizontal?: 'left' | 'center' | 'right';
      vertical?: 'top' | 'middle' | 'bottom';
      wrapText?: boolean;
    };
  };
  rowSpan?: number;
  colSpan?: number;
}

interface SheetData {
  name: string;
  data: CellData[][];
  rowCount: number;
  columnCount: number;
}

export default function ExcelViewer({ fileData, fileName }: ExcelViewerProps) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert base64 to ArrayBuffer
        const binaryString = atob(fileData.split(',')[1]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Use the backend API to parse Excel with styles
        const response = await fetch('/api/parse-excel-with-styles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileData }),
        });

        if (!response.ok) {
          throw new Error('Error al procesar el archivo Excel');
        }

        const data = await response.json();
        setSheets(data.sheets || []);
      } catch (err) {
        console.error('Error loading Excel:', err);
        setError('Error al cargar el archivo Excel');
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, [fileData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando archivo Excel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const currentSheet = sheets[activeSheet];

  if (!currentSheet) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-gray-500">
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sheet tabs */}
      {sheets.length > 1 && (
        <div className="flex gap-2 flex-wrap border-b pb-2">
          {sheets.map((sheet, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              className={`px-4 py-2 rounded-t-lg transition-colors ${
                index === activeSheet
                  ? 'bg-green-600 text-white font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      {/* Excel grid */}
      <div className="border border-gray-300 overflow-auto rounded-lg bg-white">
        <table className="border-collapse" style={{ minWidth: '100%' }}>
          <tbody>
            {currentSheet.data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ height: '25px' }}>
                {row.map((cell, colIndex) => {
                  const cellStyle: React.CSSProperties = {};

                  // Apply background color
                  if (cell.style?.fill) {
                    cellStyle.backgroundColor = cell.style.fill;
                  }

                  // Apply font styles
                  if (cell.style?.font) {
                    if (cell.style.font.color) {
                      cellStyle.color = cell.style.font.color;
                    }
                    if (cell.style.font.bold) {
                      cellStyle.fontWeight = 'bold';
                    }
                    if (cell.style.font.italic) {
                      cellStyle.fontStyle = 'italic';
                    }
                    if (cell.style.font.size) {
                      cellStyle.fontSize = `${cell.style.font.size}pt`;
                    }
                    if (cell.style.font.name) {
                      cellStyle.fontFamily = cell.style.font.name;
                    }
                  }

                  // Apply alignment
                  if (cell.style?.alignment) {
                    if (cell.style.alignment.horizontal) {
                      cellStyle.textAlign = cell.style.alignment.horizontal;
                    }
                    if (cell.style.alignment.vertical) {
                      cellStyle.verticalAlign = cell.style.alignment.vertical;
                    }
                    if (cell.style.alignment.wrapText) {
                      cellStyle.whiteSpace = 'pre-wrap';
                      cellStyle.wordWrap = 'break-word';
                    }
                  }

                  // Apply borders
                  if (cell.style?.border) {
                    const borders: string[] = [];
                    if (cell.style.border.top) borders.push(cell.style.border.top);
                    if (cell.style.border.right) borders.push(cell.style.border.right);
                    if (cell.style.border.bottom) borders.push(cell.style.border.bottom);
                    if (cell.style.border.left) borders.push(cell.style.border.left);
                    if (borders.length > 0) {
                      cellStyle.border = borders.join(' ');
                    }
                  }

                  // Cell padding
                  cellStyle.padding = '4px 8px';

                  return (
                    <td
                      key={colIndex}
                      style={cellStyle}
                      rowSpan={cell.rowSpan || 1}
                      colSpan={cell.colSpan || 1}
                    >
                      {cell.value !== null && cell.value !== undefined && cell.value !== ''
                        ? String(cell.value)
                        : '\u00A0'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="text-sm text-gray-500 text-right">
        {currentSheet.rowCount} filas × {currentSheet.columnCount} columnas
      </div>
    </div>
  );
}
