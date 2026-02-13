/**
 * Sanitizes and normalizes a phone number for WhatsApp deep links
 * Strips spaces, dashes, parentheses; preserves leading + when present
 * @param phoneNumber - Raw phone number string
 * @returns Sanitized phone number suitable for WhatsApp URLs
 */
export function sanitizePhoneNumber(phoneNumber: string): string {
  // Remove spaces, dashes, parentheses, and other common formatting characters
  // Preserve + at the start if present
  const cleaned = phoneNumber.replace(/[\s\-()]/g, '');
  return cleaned;
}

/**
 * Builds a WhatsApp chat deep link with optional prefilled text
 * @param phoneNumber - The recipient's phone number (will be sanitized)
 * @param text - Optional message text to prefill (will be URL-encoded)
 * @returns WhatsApp deep link URL
 */
export function buildWhatsAppChatLink(phoneNumber: string, text?: string): string {
  const sanitized = sanitizePhoneNumber(phoneNumber);
  const baseUrl = `https://wa.me/${sanitized}`;
  
  if (text) {
    const encodedText = encodeURIComponent(text);
    return `${baseUrl}?text=${encodedText}`;
  }
  
  return baseUrl;
}

/**
 * Attempts to open WhatsApp Web/app with the specified phone number and optional message
 * @param phoneNumber - The recipient's phone number
 * @param text - Optional message text to prefill
 * @returns Promise that resolves to true if window.open succeeded, false otherwise
 */
export async function openWhatsAppChat(phoneNumber: string, text?: string): Promise<boolean> {
  try {
    const url = buildWhatsAppChatLink(phoneNumber, text);
    const opened = window.open(url, '_blank');
    
    // Check if popup was blocked
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to open WhatsApp:', err);
    return false;
  }
}
