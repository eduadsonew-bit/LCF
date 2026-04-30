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

        // Remove column A and show from column B onwards, process merges
        const cleanedSheets = singleSheet.map(sheet => {
          const newData = sheet.data.map(row => row.slice(1));
          const newWidths = (sheet.columnWidths || []).slice(1);
          const newCount = (sheet.columnCount || 1) - 1;

          // Adjust merges: shift left by 1, skip merges entirely in col A
          const newMerges = (sheet.merges || [])
            .map(m => ({ top: m.top, left: m.left - 1, bottom: m.bottom, right: m.right - 1 }))
            .filter(m => m.right >= 0);

          const skipCells = new Set<string>();
          for (const m of newMerges) {
            for (let r = m.top; r <= m.bottom; r++) {
              for (let c = m.left; c <= m.right; c++) {
                if (r === m.top && c === m.left) continue;
                skipCells.add((r - 1) + '-' + c);
              }
            }
          }

          // Apply rowSpan/colSpan to master cells
          for (const m of newMerges) {
            const masterIdx = m.top - 1;
            const masterCol = m.left;
            if (newData[masterIdx] && newData[masterIdx][masterCol]) {
              newData[masterIdx][masterCol] = {
                ...newData[masterIdx][masterCol],
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
            if (newData[r] && newData[r][c]) {
              newData[r][c] = { ...newData[r][c], isMergedSkip: true };
            }
          }

          // Merge row 1 across all remaining columns and set height equal to row 2
          if (newData.length >= 2 && newData[0].length >= 2) {
            const totalCols = newData[0].length;
            for (let c = 1; c < totalCols; c++) {
              newData[0][c] = { ...newData[0][c], isMergedSkip: true };
            }
            newData[0][0] = { ...newData[0][0], colSpan: totalCols };
            if (sheet.rowHeights && sheet.rowHeights.length >= 2) {
              const row2Height = sheet.rowHeights[1] || 25;
              sheet.rowHeights[0] = row2Height;
            }
          }

          // Merge specified rows across all columns with height equal to row 2
          const mergeRows = [6, 9, 14, 19, 23, 26, 33, 35, 38, 45, 50, 57, 60, 66, 72, 78, 84, 91, 98, 103, 108, 113, 118, 130, 133, 139, 147];
          if (sheet.rowHeights && sheet.rowHeights.length >= 2) {
            const row2Height = sheet.rowHeights[1] || 25;
            for (const rowIdx of mergeRows) {
              if (newData.length > rowIdx && newData[rowIdx].length >= 2) {
                const totalCols = newData[rowIdx].length;
                for (let c = 1; c < totalCols; c++) {
                  newData[rowIdx][c] = { ...newData[rowIdx][c], isMergedSkip: true };
                }
                newData[rowIdx][0] = { ...newData[rowIdx][0], colSpan: totalCols };
                sheet.rowHeights[rowIdx] = row2Height;
              }
            }
          }

          return {
            ...sheet,
            data: newData,
            columnWidths: newWidths,
            columnCount: newCount,
            merges: newMerges,
          };
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
  // First column needs wider minimum to fit time format like "10:00 a.m." on one line
  const FIRST_COL_MIN = 90;
  const totalRawWidth = (currentSheet.columnWidths || []).reduce((sum, w, i) => {
    return sum + Math.max(w, i === 0 ? FIRST_COL_MIN : 50);
  }, 0) + 42;

  const colGroup = (
    <colgroup>
      <col style={{ width: '42px', minWidth: '42px', maxWidth: '42px' }} />
      {currentSheet.data[0]?.map((_, i) => {
        const minW = i === 0 ? FIRST_COL_MIN : 50;
        const raw = Math.max(currentSheet.columnWidths?.[i] || 100, minW);
        const pct = (raw / totalRawWidth * 100).toFixed(2);
        return <col key={i} style={{ width: pct + '%', minWidth: minW + 'px' }} />;
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
        <table className="border-collapse w-full" style={{ borderSpacing: 0, tableLayout: 'fixed', border: '1px solid #a0a0a0' }}>
          {colGroup}
          <thead className="sticky top-0 z-10">
            <tr>
              <th
                className="sticky left-0 z-20 bg-gray-100 border-b border-r border-gray-300 text-center p-0"
                style={{ width: '42px', minWidth: '42px', height: '22px', borderTop: '1px solid #a0a0a0' }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" className="text-gray-400 inline-block">
                  <path d="M0 0h10v10H0z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </th>
              {currentSheet.data[0]?.map((_, colIndex) => {
                const isLastThCol = colIndex === (currentSheet.data[0]?.length || 1) - 1;
                return (
                <th
                  key={colIndex}
                  className={"border-b border-r border-gray-300 text-center text-[11px] font-medium select-none p-0 " + (
                    hoveredCell?.col === colIndex ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  )}
                  style={{ height: '22px', borderTop: '1px solid #a0a0a0', borderRight: isLastThCol ? '1px solid #a0a0a0' : undefined }}
                >
                  {getColumnLetter(colIndex)}
                </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {currentSheet.data.map((row, rowIndex) => {
              const rowHeight = currentSheet.rowHeights?.[rowIndex] || 0;
              const isFirstRow = rowIndex === 0;
              const isLastRow = rowIndex === currentSheet.data.length - 1;
              const totalCols = row.length;
              return (
                <tr key={rowIndex} style={rowHeight > 0 ? { height: rowHeight + 'px' } : undefined}>
                  <td
                    className={"sticky left-0 z-10 border-b border-r border-gray-300 text-center text-[11px] font-medium select-none p-0 " + (
                      hoveredCell?.row === rowIndex ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400'
                    )}
                    style={{
                      width: '42px',
                      minWidth: '42px',
                      borderTop: isFirstRow ? '1px solid #a0a0a0' : undefined,
                      borderBottom: isLastRow ? '1px solid #a0a0a0' : undefined
                    }}
                  >
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => {
                    if (cell.isMergedSkip) return null;

                    const style = getCellStyle(cell);
                    const isHighlighted = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;

                    // Remove background fill for rows 39-51
                    if (rowIndex >= 39 && rowIndex <= 51) {
                      delete style.backgroundColor;
                    }

                    if (!cell.style?.border) {
                      style.borderRight = '1px solid #e0e0e0';
                      style.borderBottom = '1px solid #e0e0e0';
                      if (colIndex === 0) {
                        style.borderLeft = '1px solid #a0a0a0';
                      }
                    } else {
                      // Ensure first column always has a visible left border
                      if (colIndex === 0 && !cell.style.border?.left) {
                        style.borderLeft = '1px solid #a0a0a0';
                      }
                    }

                    // Outer borders: top on first row, bottom on last row
                    if (isFirstRow) {
                      style.borderTop = '1px solid #a0a0a0';
                    }
                    if (isLastRow) {
                      style.borderBottom = '1px solid #a0a0a0';
                    }

                    // Right border on last visible column
                    const effectiveColSpan = cell.colSpan || 1;
                    const isLastCol = (colIndex + effectiveColSpan) >= totalCols;
                    if (isLastCol) {
                      style.borderRight = '1px solid #a0a0a0';
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

                    // Force nowrap on first column cells that contain time values (AM/PM or a.m./p.m.)
                    if (colIndex === 0 && !cell.colSpan) {
                      const strVal = String(cell.value ?? '');
                      if (/^\d{1,2}:\d{2}\s*(a\.?m\.?|p\.?m\.?|AM|PM)/i.test(strVal)) {
                        style.whiteSpace = 'nowrap';
                        delete style.wordWrap;
                        delete style.overflowWrap;
                      }
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
