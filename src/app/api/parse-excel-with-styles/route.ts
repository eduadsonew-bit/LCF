import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

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

export async function POST(request: NextRequest) {
  try {
    const { fileData } = await request.json();

    if (!fileData) {
      return NextResponse.json({ error: 'No se proporcionó el archivo' }, { status: 400 });
    }

    const base64Data = fileData.split(',')[1] || fileData;
    const buffer = Buffer.from(base64Data, 'base64');

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheets: SheetData[] = [];

    for (const sheetName of Object.keys(workbook.worksheets)) {
      const worksheet = workbook.worksheets[sheetName];
      const data: CellData[][] = [];
      const columnWidths: number[] = [];
      const rowHeights: number[] = [];
      const merges: { top: number; left: number; bottom: number; right: number }[] = [];

      const rowCount = worksheet.rowCount;
      const columnCount = worksheet.columnCount;

      // Extract column widths (ExcelJS width is in character units ~7px each)
      for (let c = 1; c <= columnCount; c++) {
        const col = worksheet.getColumn(c);
        const charWidth = col.width || 8;
        columnWidths.push(Math.round(charWidth * 7.5 + 5));
      }

      // Extract row heights (ExcelJS height is in points, 1pt ~1.33px)
      for (let r = 1; r <= rowCount; r++) {
        const row = worksheet.getRow(r);
        rowHeights.push(row.height ? Math.round(row.height * 1.33) : 0);
      }

      // Extract merges
      if (worksheet.model && Array.isArray(worksheet.model.merges)) {
        for (const merge of worksheet.model.merges) {
          if (merge && merge.model) {
            merges.push({
              top: merge.model.top,
              left: merge.model.left,
              bottom: merge.model.bottom,
              right: merge.model.right,
            });
          }
        }
      }

      // Build merge lookup structures
      const mergedSkipCells = new Set<string>();
      const mergeMap: Record<string, { rowSpan: number; colSpan: number }> = {};

      for (const merge of merges) {
        const masterKey = `${merge.top}-${merge.left}`;
        mergeMap[masterKey] = {
          rowSpan: merge.bottom - merge.top + 1,
          colSpan: merge.right - merge.left + 1,
        };
        for (let r = merge.top; r <= merge.bottom; r++) {
          for (let c = merge.left; c <= merge.right; c++) {
            if (r === merge.top && c === merge.left) continue;
            mergedSkipCells.add(`${r}-${c}`);
          }
        }
      }

      // Process each row
      for (let rowNumber = 1; rowNumber <= rowCount; rowNumber++) {
        const rowData: CellData[] = [];

        for (let colNumber = 1; colNumber <= columnCount; colNumber++) {
          const cellKey = `${rowNumber}-${colNumber}`;

          if (mergedSkipCells.has(cellKey)) {
            rowData.push({ value: null, isMergedSkip: true });
            continue;
          }

          const cell = worksheet.getCell(rowNumber, colNumber);
          const cellData: CellData = { value: null };

          // Get cell value
          if (cell.value !== null && cell.value !== undefined) {
            // Handle Date objects (time/date cells in Excel)
            if (cell.value instanceof Date) {
              const d = cell.value;
              // Check if it's a time-only value (same day as Excel epoch)
              const isTimeOnly = d.getFullYear() === 1899 && d.getMonth() === 11 && d.getDate() === 30;
              if (isTimeOnly) {
                const hours = d.getHours();
                const minutes = d.getMinutes();
                const period = hours >= 12 ? 'p.m.' : 'a.m.';
                const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                cellData.value = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
              } else {
                cellData.value = d.toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
              }
            } else if (typeof cell.value === 'object' && cell.value !== null) {
              if ('richText' in (cell.value as object)) {
                const rt = (cell.value as { richText: { text: string }[] }).richText;
                cellData.value = rt.map(r => r.text).join('');
              } else if ('formula' in (cell.value as object)) {
                const f = cell.value as { result?: unknown };
                cellData.value = f.result !== null && f.result !== undefined ? String(f.result) : null;
              } else if ('text' in (cell.value as object)) {
                cellData.value = String((cell.value as { text: string }).text);
              } else if ('hyperlink' in (cell.value as object)) {
                cellData.value = String((cell.value as { text?: string; hyperlink: string }).text || (cell.value as { hyperlink: string }).hyperlink);
              } else {
                cellData.value = String(cell.value);
              }
            } else {
              cellData.value = cell.value;
            }
          }

          // Get cell styles
          const style: CellData['style'] = {};

          // Background color
          if (cell.fill && cell.fill.type === 'pattern' && cell.fill.fgColor) {
            const argb = cell.fill.fgColor.argb;
            if (argb && argb.length >= 6) {
              style.fill = `#${argb.substring(2)}`;
            }
          }

          // Font styles
          if (cell.font) {
            style.font = {};
            if (cell.font.color && cell.font.color.argb) {
              const argb = cell.font.color.argb;
              if (argb.length >= 6) {
                style.font.color = `#${argb.substring(2)}`;
              }
            }
            if (cell.font.bold !== undefined) style.font.bold = cell.font.bold;
            if (cell.font.italic !== undefined) style.font.italic = cell.font.italic;
            if (cell.font.underline !== undefined && cell.font.underline) style.font.underline = true;
            if (cell.font.size) style.font.size = cell.font.size;
            if (cell.font.name) style.font.name = cell.font.name;
          }

          // Border styles
          if (cell.border) {
            style.border = {};
            if (cell.border.top && cell.border.top.style) {
              const c = cell.border.top.color?.argb ? '#' + cell.border.top.color.argb.substring(2) : '#000';
              style.border.top = `${cell.border.top.style === 'thin' ? '1' : cell.border.top.style === 'medium' ? '2' : cell.border.top.style === 'thick' ? '3' : '1'}px solid ${c}`;
            }
            if (cell.border.right && cell.border.right.style) {
              const c = cell.border.right.color?.argb ? '#' + cell.border.right.color.argb.substring(2) : '#000';
              style.border.right = `${cell.border.right.style === 'thin' ? '1' : cell.border.right.style === 'medium' ? '2' : cell.border.right.style === 'thick' ? '3' : '1'}px solid ${c}`;
            }
            if (cell.border.bottom && cell.border.bottom.style) {
              const c = cell.border.bottom.color?.argb ? '#' + cell.border.bottom.color.argb.substring(2) : '#000';
              style.border.bottom = `${cell.border.bottom.style === 'thin' ? '1' : cell.border.bottom.style === 'medium' ? '2' : cell.border.bottom.style === 'thick' ? '3' : '1'}px solid ${c}`;
            }
            if (cell.border.left && cell.border.left.style) {
              const c = cell.border.left.color?.argb ? '#' + cell.border.left.color.argb.substring(2) : '#000';
              style.border.left = `${cell.border.left.style === 'thin' ? '1' : cell.border.left.style === 'medium' ? '2' : cell.border.left.style === 'thick' ? '3' : '1'}px solid ${c}`;
            }
          }

          // Alignment
          if (cell.alignment) {
            style.alignment = {};
            if (cell.alignment.horizontal) style.alignment.horizontal = cell.alignment.horizontal;
            if (cell.alignment.vertical) style.alignment.vertical = cell.alignment.vertical;
            if (cell.alignment.wrapText !== undefined) style.alignment.wrapText = cell.alignment.wrapText;
            if (cell.alignment.indent !== undefined) style.alignment.indent = cell.alignment.indent;
          }

          cellData.style = Object.keys(style).length > 0 ? style : undefined;

          // Merged cells - apply rowSpan/colSpan to master cell
          if (mergeMap[cellKey]) {
            cellData.rowSpan = mergeMap[cellKey].rowSpan;
            cellData.colSpan = mergeMap[cellKey].colSpan;
          }

          rowData.push(cellData);
        }

        data.push(rowData);
      }

      sheets.push({
        name: sheetName,
        data,
        rowCount,
        columnCount,
        columnWidths,
        rowHeights,
        merges,
      });
    }

    return NextResponse.json({ sheets });
  } catch (error) {
    console.error('Error parsing Excel:', error);
    return NextResponse.json({ error: 'Error al procesar el archivo Excel' }, { status: 500 });
  }
}
