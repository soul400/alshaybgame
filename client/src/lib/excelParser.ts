import * as XLSX from "xlsx";
import { ExcelData, excelDataSchema } from "@shared/schema";
import { z } from "zod";

export async function parseExcelFile(file: File): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("Failed to read file");
        }

        // Parse workbook
        const workbook = XLSX.read(data, { type: "binary" });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        // Map Excel columns to our expected format
        const mappedData = jsonData.map((row) => {
          const categoryField = row.category || row.Category || row.فئة || row.الفئة;
          const clue1Field = row.clue1 || row.Clue1 || row.تلميح1 || row.التلميح_الأول;
          const clue2Field = row.clue2 || row.Clue2 || row.تلميح2 || row.التلميح_الثاني;
          const answerField = row.answer || row.Answer || row.الجواب || row.الإجابة;
          const letterCountField = row.letterCount || row.LetterCount || row.عدد_الحروف;

          return {
            category: categoryField,
            clue1: clue1Field,
            clue2: clue2Field,
            answer: answerField,
            letterCount: letterCountField,
          };
        });

        // Validate with Zod schema
        try {
          const validatedData = excelDataSchema.parse(mappedData);
          resolve(validatedData);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            console.error("Excel data validation error:", validationError.errors);
            reject(new Error(`Invalid Excel data format: ${validationError.errors[0].message}`));
          } else {
            reject(validationError);
          }
        }
      } catch (error) {
        console.error("Failed to parse Excel file:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
}
