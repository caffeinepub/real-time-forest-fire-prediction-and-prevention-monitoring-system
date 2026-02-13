/**
 * Constructs an SMS deep link with URL-encoded message body
 * @param phoneNumber - The recipient's phone number
 * @param message - The message text to prefill
 * @returns SMS deep link string
 */
export function buildSmsLink(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters from phone number
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
