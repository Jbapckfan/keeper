import Tesseract from 'tesseract.js';
import path from 'path';

export interface OCRResult {
  rawText: string;
  confidence: number;
  merchantName?: string;
  totalAmount?: number;
  taxAmount?: number;
  purchaseDate?: Date;
  lineItems: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

// Common patterns for receipt parsing
const TOTAL_PATTERNS = [
  /total[:\s]*\$?([\d,]+\.?\d*)/i,
  /grand\s*total[:\s]*\$?([\d,]+\.?\d*)/i,
  /amount\s*due[:\s]*\$?([\d,]+\.?\d*)/i,
  /balance\s*due[:\s]*\$?([\d,]+\.?\d*)/i,
];

const TAX_PATTERNS = [
  /tax[:\s]*\$?([\d,]+\.?\d*)/i,
  /sales\s*tax[:\s]*\$?([\d,]+\.?\d*)/i,
  /vat[:\s]*\$?([\d,]+\.?\d*)/i,
];

const DATE_PATTERNS = [
  /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
  /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
  /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{1,2}[\s,]+\d{2,4})/i,
];

function parseAmount(text: string): number | undefined {
  const cleaned = text.replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

function parseDate(text: string): Date | undefined {
  try {
    const date = new Date(text);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch {
    // Ignore parsing errors
  }
  return undefined;
}

function extractMerchantName(lines: string[]): string | undefined {
  // Usually the merchant name is in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Skip empty lines and lines that look like addresses/phone numbers
    if (
      line.length > 2 &&
      !line.match(/^\d/) && // Doesn't start with number
      !line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) && // Not a phone number
      !line.match(/^\d+\s+\w/) // Not an address
    ) {
      return line;
    }
  }
  return undefined;
}

function extractTotal(text: string): number | undefined {
  for (const pattern of TOTAL_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return parseAmount(match[1]);
    }
  }
  return undefined;
}

function extractTax(text: string): number | undefined {
  for (const pattern of TAX_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return parseAmount(match[1]);
    }
  }
  return undefined;
}

function extractDate(text: string): Date | undefined {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return parseDate(match[1]);
    }
  }
  return undefined;
}

function extractLineItems(text: string): OCRResult['lineItems'] {
  const items: OCRResult['lineItems'] = [];
  const lines = text.split('\n');

  // Look for lines that have a price at the end
  const itemPattern = /^(.+?)\s+(\d+)?\s*[@x]?\s*\$?([\d,]+\.?\d*)\s*$/i;
  const simpleItemPattern = /^(.+?)\s+\$?([\d,]+\.?\d*)$/;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip common non-item lines
    if (
      trimmed.toLowerCase().includes('total') ||
      trimmed.toLowerCase().includes('tax') ||
      trimmed.toLowerCase().includes('subtotal') ||
      trimmed.toLowerCase().includes('change') ||
      trimmed.toLowerCase().includes('cash') ||
      trimmed.toLowerCase().includes('credit') ||
      trimmed.toLowerCase().includes('visa') ||
      trimmed.toLowerCase().includes('mastercard')
    ) {
      continue;
    }

    let match = trimmed.match(itemPattern);
    if (match) {
      const price = parseAmount(match[3]);
      if (price && price > 0 && price < 10000) {
        items.push({
          name: match[1].trim(),
          quantity: match[2] ? parseInt(match[2], 10) : 1,
          unitPrice: price,
          totalPrice: price,
        });
      }
      continue;
    }

    match = trimmed.match(simpleItemPattern);
    if (match) {
      const price = parseAmount(match[2]);
      if (price && price > 0 && price < 10000) {
        items.push({
          name: match[1].trim(),
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
        });
      }
    }
  }

  return items;
}

export async function processReceiptOCR(imagePath: string): Promise<OCRResult> {
  console.log(`[OCR] Processing image: ${imagePath}`);

  const result = await Tesseract.recognize(imagePath, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  const rawText = result.data.text;
  const confidence = result.data.confidence;
  const lines = rawText.split('\n').filter((l) => l.trim());

  console.log(`[OCR] Completed with ${confidence}% confidence`);
  console.log(`[OCR] Raw text:\n${rawText.substring(0, 500)}...`);

  const merchantName = extractMerchantName(lines);
  const totalAmount = extractTotal(rawText);
  const taxAmount = extractTax(rawText);
  const purchaseDate = extractDate(rawText);
  const lineItems = extractLineItems(rawText);

  return {
    rawText,
    confidence,
    merchantName,
    totalAmount,
    taxAmount,
    purchaseDate,
    lineItems,
  };
}
