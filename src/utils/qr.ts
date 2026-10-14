import QRCode from 'qrcode';

/**
 * Generates an offline, high-contrast QR Code data URL (PNG) completely locally
 * in the client browser without any external network or server calls.
 */
export async function generateQrDataUrl(
  text: string,
  size: number = 240
): Promise<string> {
  const safeText = text || 'https://github.com/mehdi-fakhraei60/dbax-releases';
  try {
    return await QRCode.toDataURL(safeText, {
      width: size,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Error generating QR Data URL locally:', error);
    // Return empty string to allow component-level fallback
    return '';
  }
}

/**
 * Generates an SVG string representation of the QR code locally.
 */
export async function generateQrSvgString(text: string): Promise<string> {
  const safeText = text || 'https://github.com/mehdi-fakhraei60/dbax-releases';
  try {
    return await QRCode.toString(safeText, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Error generating QR SVG string locally:', error);
    return '';
  }
}
