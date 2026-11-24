const PREFIX = "+963";

/**
 * بيحوّل أي صيغة لرقم سوري للصيغة المخزّنة بالباك: +9639XXXXXXXX
 * بيقبل: 0933123456 · 933123456 · +963933123456 · 00963933123456 · مع مسافات أو شرطات
 * وبيقبل الأرقام العربية الشرقية (٠٩٣٣...).
 */
export function normalizeSyrianPhone(input: string): string {
  const western = input.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  const digits = western
    .replace(/\D/g, "")
    .replace(/^00/, "")
    .replace(/^963/, "")
    .replace(/^0+/, "");
  return digits ? `${PREFIX}${digits}` : "";
}

/** إذا النص فيه @ منعتبره إيميل، غير هيك رقم موبايل */
export function isEmailIdentifier(input: string): boolean {
  return input.includes("@");
}
