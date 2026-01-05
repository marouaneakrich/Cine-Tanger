const QRCode = require('qrcode');

exports.generateQRCode = async (text) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return `QR-CODE-${text}`;
  }
};
