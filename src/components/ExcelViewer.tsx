"use client";

import { useEffect, useState, useRef } from "react";
import { FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExcelViewerProps {
  fileData: string;
  fileName: string;
}

interface CellData {
  value: string | number | boolean | null;
  style?: {
    fill?: string;
    font?: {
      color?: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
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
      indent?: number;
    };
  };
  rowSpan?: number;
  colSpan?: number;
  isMergedSkip?: boolean;
}

interface SheetData {
  name: string;
  data: CellData[][];
  rowCount: number;
  columnCount: number;
  columnWidths: number[];
  rowHeights: number[];
  merges: { top: number; left: number; bottom: number; right: number }[];
}

function getColumnLetter(index: number): string {
  let result = '';
  let num = index;
  while (num >= 0) {
    result = String.fromCharCode((num % 26) + 65) + result;
    num = Math.floor(num / 26) - 1;
  }
  return result;
}

function getCellStyle(cell: CellData): React.CSSProperties {
  const s: React.CSSProperties = {};

  if (cell.style?.fill) s.backgroundColor = cell.style.fill;

  if (cell.style?.font) {
    if (cell.style.font.color) s.color = cell.style.font.color;
    if (cell.style.font.bold) s.fontWeight = 'bold';
    if (cell.style.font.italic) s.fontStyle = 'italic';
    if (cell.style.font.underline) s.textDecoration = 'underline';
    if (cell.style.font.size) s.fontSize = (cell.style.font.size * 0.75) + 'pt';
    if (cell.style.font.name) s.fontFamily = cell.style.font.name;
  }

  if (cell.style?.alignment) {
    if (cell.style.alignment.horizontal) s.textAlign = cell.style.alignment.horizontal;
    if (cell.style.alignment.vertical) s.verticalAlign = cell.style.alignment.vertical;
    if (cell.style.alignment.wrapText) {
      s.whiteSpace = 'pre-wrap';
      s.wordWrap = 'break-word';
      s.overflowWrap = 'break-word';
    }
    if (cell.style.alignment.indent) {
      s.paddingLeft = (cell.style.alignment.indent * 8) + 'px';
    }
  }

  if (cell.style?.border) {
    const b = cell.style.border;
    if (b.top) s.borderTop = b.top;
    if (b.right) s.borderRight = b.right;
    if (b.bottom) s.borderBottom = b.bottom;
    if (b.left) s.borderLeft = b.left;
  }

  s.padding = '4px 6px';
  s.lineHeight = '1.3';
  s.whiteSpace = 'pre-wrap';
  s.wordWrap = 'break-word';
  s.overflowWrap = 'break-word';

  return s;
}

export default function ExcelViewer({ fileData, fileName }: ExcelViewerProps) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/parse-excel-with-styles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData }),
        });
        if (!response.ok) throw new Error('Error al procesar el archivo Excel');
        const data = await response.json();
        const parsedSheets: SheetData[] = data.sheets || [];

        // Keep only the first sheet
        const singleSheet = parsedSheets.length > 0 ? [parsedSheets[0]] : [];

        // Show all columns as-is from the original Excel, process merges only
        const cleanedSheets = singleSheet.map(sheet => {
          const skipCells = new Set<string>();
          for (const m of (sheet.merges || [])) {
            for (let r = m.top; r <= m.bottom; r++) {
              for (let c = m.left; c <= m.right; c++) {
                if (r === m.top && c === m.left) continue;
                skipCells.add((r - 1) + '-' + c);
              }
            }
          }

          // Apply rowSpan/colSpan to master cells
          for (const m of (sheet.merges || [])) {
            const masterIdx = m.top - 1;
            const masterCol = m.left;
            if (sheet.data[masterIdx] && sheet.data[masterIdx][masterCol]) {
              sheet.data[masterIdx][masterCol] = {
                ...sheet.data[masterIdx][masterCol],
                rowSpan: m.bottom - m.top + 1,
                colSpan: m.right - m.left + 1,
              };
            }
          }

          // Mark merged skip cells
          for (const key of skipCells) {
            const parts = key.split('-');
            const r = parseInt(parts[0]);
            const c = parseInt(parts[1]);
            if (sheet.data[r] && sheet.data[r][c]) {
              sheet.data[r][c] = { ...sheet.data[r][c], isMergedSkip: true };
            }
          }

          // Merge row 1 across all columns and set height equal to row 2
          if (sheet.data.length >= 2 && sheet.data[0].length >= 2) {
            const totalCols = sheet.data[0].length;
            // Find first non-empty cell in row 1
            let firstContentCol = -1;
            for (let c = 0; c < totalCols; c++) {
              if (sheet.data[0][c] && sheet.data[0][c].value !== null && sheet.data[0][c].value !== undefined && String(sheet.data[0][c].value).trim() !== '') {
                firstContentCol = c;
                break;
              }
            }
            // Merge from column A (index 0) to last column
            if (firstContentCol >= 0) {
              for (let c = 0; c < totalCols; c++) {
                if (c !== 0) {
                  sheet.data[0][c] = { ...sheet.data[0][c], isMergedSkip: true };
                }
              }
              // Merge content into column A cell (index 0) if not already there
              if (firstContentCol > 0) {
                sheet.data[0][0] = {
                  ...sheet.data[0][firstContentCol],
                  value: sheet.data[0][firstContentCol].value,
                  colSpan: totalCols,
                };
              } else {
                sheet.data[0][0] = {
                  ...sheet.data[0][0],
                  colSpan: totalCols,
                };
              }
            }
            // Set row 1 height equal to row 2
            if (sheet.rowHeights && sheet.rowHeights.length >= 2) {
              const row2Height = sheet.rowHeights[1] || 25;
              sheet.rowHeights[0] = row2Height;
            }
          }

          return sheet;
        });

        setSheets(cleanedSheets);
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando archivo Excel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const currentSheet = sheets[activeSheet];
  if (!currentSheet) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos para mostrar</p>
      </div>
    );
  }

  const handlePrevSheet = () => { if (activeSheet > 0) setActiveSheet(activeSheet - 1); };
  const handleNextSheet = () => { if (activeSheet < sheets.length - 1) setActiveSheet(activeSheet + 1); };

  // Calculate proportional column widths that fit within the container
  const totalRawWidth = (currentSheet.columnWidths || []).reduce((sum, w) => sum + Math.max(w, 50), 0) + 42;

  const colGroup = (
    <colgroup>
      <col style={{ width: '42px', minWidth: '42px', maxWidth: '42px' }} />
      {currentSheet.data[0]?.map((_, i) => {
        const raw = Math.max(currentSheet.columnWidths?.[i] || 100, 50);
        const pct = (raw / totalRawWidth * 100).toFixed(2);
        return <col key={i} style={{ width: pct + '%' }} />;
      })}
    </colgroup>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col" style={{ maxHeight: '80vh' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px] sm:max-w-[300px]" title={fileName}>
            {fileName}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{currentSheet.rowCount} filas</span>
          <span className="text-gray-300 mx-1">|</span>
          <span>{currentSheet.columnCount} columnas</span>
        </div>
      </div>

      {/* Formula bar */}
      <div className="flex items-center px-2 py-1 bg-gray-50 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-center w-8 text-xs font-medium text-gray-500 bg-gray-100 rounded-l border border-gray-300 h-7 mr-px shrink-0">
          fx
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-r h-7 px-2 flex items-center text-sm text-gray-700 overflow-hidden">
          <span className="truncate">{currentSheet.name}</span>
        </div>
      </div>

      {/* Sheet tabs */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200 shrink-0 overflow-x-auto">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-gray-400 hover:text-gray-600" onClick={handlePrevSheet} disabled={activeSheet === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center overflow-x-auto">
          {sheets.map((sheet, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              className={"px-4 h-8 text-xs font-medium whitespace-nowrap transition-colors border-b-2 shrink-0 " + (
                index === activeSheet
                  ? 'bg-white text-green-700 border-green-600'
                  : 'text-gray-600 border-transparent hover:bg-gray-100'
              )}
            >
              {sheet.name}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-gray-400 hover:text-gray-600" onClick={handleNextSheet} disabled={activeSheet === sheets.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Spreadsheet grid */}
      <div ref={tableRef} className="flex-1 overflow-auto bg-white">
        <table className="border-collapse w-full" style={{ borderSpacing: 0, tableLayout: 'fixed' }}>
          {colGroup}
          <thead className="sticky top-0 z-10">
            <tr>
              <th
                className="sticky left-0 z-20 bg-gray-100 border-b border-r border-gray-300 text-center p-0"
                style={{ width: '42px', minWidth: '42px', height: '22px' }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" className="text-gray-400 inline-block">
                  <path d="M0 0h10v10H0z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </th>
              {currentSheet.data[0]?.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className={"border-b border-r border-gray-300 text-center text-[11px] font-medium select-none p-0 " + (
                    hoveredCell?.col === colIndex ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  )}
                  style={{ height: '22px' }}
                >
                  {getColumnLetter(colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentSheet.data.map((row, rowIndex) => {
              const rowHeight = currentSheet.rowHeights?.[rowIndex] || 0;
              return (
                <tr key={rowIndex} style={rowHeight > 0 ? { height: rowHeight + 'px' } : undefined}>
                  <td
                    className={"sticky left-0 z-10 border-b border-r border-gray-300 text-center text-[11px] font-medium select-none p-0 " + (
                      hoveredCell?.row === rowIndex ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400'
                    )}
                    style={{ width: '42px', minWidth: '42px' }}
                  >
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => {
                    if (cell.isMergedSkip) return null;

                    const style = getCellStyle(cell);
                    const isHighlighted = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;

                    if (!cell.style?.border) {
                      style.borderRight = '1px solid #e0e0e0';
                      style.borderBottom = '1px solid #e0e0e0';
                    }

                    if (isHighlighted) {
                      style.outline = '2px solid #4caf50';
                      style.outlineOffset = '-1px';
                      style.position = 'relative';
                      style.zIndex = '1';
                    }

                    if (cell.colSpan && cell.colSpan > 1 && !cell.style?.alignment?.wrapText) {
                      style.whiteSpace = 'pre-wrap';
                      style.wordWrap = 'break-word';
                      style.overflowWrap = 'break-word';
                    }

                    const displayValue = cell.value !== null && cell.value !== undefined && cell.value !== ''
                      ? String(cell.value)
                      : '';

                    return (
                      <td
                        key={colIndex}
                        style={style}
                        rowSpan={cell.rowSpan && cell.rowSpan > 1 ? cell.rowSpan : undefined}
                        colSpan={cell.colSpan && cell.colSpan > 1 ? cell.colSpan : undefined}
                        className="cursor-default"
                        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                        title={displayValue}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-t border-gray-200 shrink-0">
        <span className="text-xs text-gray-500">
          Hoja: <strong className="text-gray-700">{currentSheet.name}</strong>
        </span>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {hoveredCell && (
            <span><strong className="text-gray-700">{getColumnLetter(hoveredCell.col)}{hoveredCell.row + 1}</strong></span>
          )}
          <span>{currentSheet.rowCount} filas x {currentSheet.columnCount} cols</span>
        </div>
      </div>
    </div>
  );
}
