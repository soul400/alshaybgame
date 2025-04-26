import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * دالة لخلط المصفوفة بشكل عشوائي (خوارزمية Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  // نسخ المصفوفة لتجنب تعديل المصفوفة الأصلية
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    // اختيار عنصر عشوائي من المصفوفة
    const j = Math.floor(Math.random() * (i + 1));
    // تبديل العناصر
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
