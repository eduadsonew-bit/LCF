import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

interface CellData {
  value: string | number | null;
  style?: {
    fill?: string;
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

export async function POST(request: NextRequest) {
  try {
    const { fileData } = await request.json();

    if (!fileData) {
      return NextResponse.json({ error: 'No se proporcionó el archivo' }, { status: 400 });
    }

    // Decode base64 to buffer
    const base64Data = fileData.split(',')[1] || fileData;
    const buffer = Buffer.from(base64Data, 'base64');

    // Load Excel file with styles
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheets: SheetData[] = [];

    // Process each sheet
    for (const sheetName of Object.keys(workbook.worksheets)) {
      const worksheet = workbook.worksheets[sheetName];
      const data: CellData[][] = [];

      // Get the actual used range
      const rowCount = worksheet.rowCount;
      const columnCount = worksheet.columnCount;

      // Process each row
      for (let rowNumber = 1; rowNumber <= rowCount; rowNumber++) {
        const rowData: CellData[] = [];

        for (let colNumber = 1; colNumber <= columnCount; colNumber++) {
          const cell = worksheet.getCell(rowNumber, colNumber);

          // Skip if this cell is part of a merge (not the top-left)
          if (cell.isMerged && cell.master !== cell) {
            rowData.push({
              value: null,
              rowSpan: 0,
              colSpan: 0,
            });
            continue;
          }

          const cellData: CellData = {
            value: cell.value === null ? null : String(cell.value),
          };

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
            if (cell.font.bold !== undefined) {
              style.font.bold = cell.font.bold;
            }
            if (cell.font.italic !== undefined) {
              style.font.italic = cell.font.italic;
            }
            if (cell.font.size) {
              style.font.size = cell.font.size;
            }
            if (cell.font.name) {
              style.font.name = cell.font.name;
            }
          }

          // Border styles
          if (cell.border) {
            style.border = {};
            if (cell.border.top && cell.border.top.style) {
              style.border.top = `1px ${cell.border.top.style} ${cell.border.top.color?.argb ? '#' + cell.border.top.color.argb.substring(2) : '#000'}`;
            }
            if (cell.border.right && cell.border.right.style) {
              style.border.right = `1px ${cell.border.right.style} ${cell.border.right.color?.argb ? '#' + cell.border.right.color.argb.substring(2) : '#000'}`;
            }
            if (cell.border.bottom && cell.border.bottom.style) {
              style.border.bottom = `1px ${cell.border.bottom.style} ${cell.border.bottom.color?.argb ? '#' + cell.border.bottom.color.argb.substring(2) : '#000'}`;
            }
            if (cell.border.left && cell.border.left.style) {
              style.border.left = `1px ${cell.border.left.style} ${cell.border.left.color?.argb ? '#' + cell.border.left.color.argb.substring(2) : '#000'}`;
            }
          }

          // Alignment
          if (cell.alignment) {
            style.alignment = {};
            if (cell.alignment.horizontal) {
              style.alignment.horizontal = cell.alignment.horizontal;
            }
            if (cell.alignment.vertical) {
              style.alignment.vertical = cell.alignment.vertical;
            }
            if (cell.alignment.wrapText !== undefined) {
              style.alignment.wrapText = cell.alignment.wrapText;
            }
          }

          cellData.style = Object.keys(style).length > 0 ? style : undefined;

          // Check for merged cells
          if (cell.isMerged && cell.master === cell) {
            const range = worksheet.model.merges.find(
              (m: any) => m.model && m.model.top === rowNumber && m.model.left === colNumber
            );

            if (range && range.model) {
              cellData.rowSpan = range.model.bottom - range.model.top + 1;
              cellData.colSpan = range.model.right - range.model.left + 1;
            }
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
      });
    }

    return NextResponse.json({ sheets });
  } catch (error) {
    console.error('Error parsing Excel:', error);
    return NextResponse.json({ error: 'Error al procesar el archivo Excel' }, { status: 500 });
  }
}
