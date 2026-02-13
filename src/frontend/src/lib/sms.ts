/**
 * Constructs an SMS deep link with URL-encoded message body
 * @param phoneNumber - The recipient's phone number
 * @param message - The message text to prefill
 * @returns SMS deep link string
 */
export function buildSmsLink(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters except + from phone number
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  
  // URL-encode the message body
  const encodedMessage = encodeURIComponent(message);
  
  // iOS uses a semicolon separator, Android uses a question mark
  // Using ? is more widely supported
  return `sms:${cleanNumber}?body=${encodedMessage}`;
}

/**
 * Attempts to open the device SMS app with prefilled content
 * @param phoneNumber - The recipient's phone number
 * @param message - The message text to prefill
 * @returns Promise that resolves to true if navigation appears successful, false otherwise
 */
export async function sendSms(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const smsLink = buildSmsLink(phoneNumber, message);
    
    // Attempt to navigate to the SMS link
    window.location.href = smsLink;
    
    // We can't reliably detect if the SMS app opened successfully
    // Return true optimistically after a short delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 100);
    });
  } catch (err) {
    console.error('Failed to initiate SMS:', err);
    return false;
  }
}

/**
 * Generates a default SMS message for officer contact from directory
 * @param officerName - The officer's name
 * @returns Default SMS message text
 */
export function generateDefaultSmsMessage(officerName: string): string {
  return `Hello ${officerName},\n\nThis is a message from the Forest Fire Monitoring System.\n\nPlease respond at your earliest convenience.`;
}

/**
 * Checks if SMS deep links are likely to work in the current environment
 * @returns true if SMS links are likely supported, false otherwise
 */
export function isSmsSupported(): boolean {
  // SMS links work on mobile devices and some desktop environments
  // We can't reliably detect support, so we return true optimistically
  // The UI will provide fallback copy functionality
  return true;
}
