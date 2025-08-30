// QR Code Generator

let qrCode = null;

// Generate QR code
function generateQRCode() {
    const name = document.getElementById('name').value || 'Nama Anda';
    const title = document.getElementById('title').value || 'Jabatan Anda';
    const company = document.getElementById('company').value || 'Perusahaan Anda';
    const phone = document.getElementById('phone').value || '+62 812 3456 7890';
    const email = document.getElementById('email').value || 'email@example.com';
    const website = document.getElementById('website').value || 'https://example.com';
    const address = document.getElementById('address').value || 'Jl. Example No. 123, Jakarta';
    
    // Create vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TITLE:${title}
TEL:${phone}
EMAIL:${email}
URL:${website}
ADR:;;${address};;;;
END:VCARD`;
    
    // QR Code options
    const qrColor = document.getElementById('qr-color').value;
    const qrBgColor = document.getElementById('qr-bg-color').value;
    const qrDotStyle = document.getElementById('qr-dot-style').value;
    
    // Clear previous QR code
    const qrCodeContainer = document.getElementById('qr-code');
    if (qrCodeContainer) {
        qrCodeContainer.innerHTML = '';
    }
    
    // Create new QR code
    try {
        qrCode = new QRCodeStyling({
            width: 150,
            height: 150,
            type: "svg",
            data: vCardData,
            image: document.getElementById('qr-logo').files.length > 0 ? 
                URL.createObjectURL(document.getElementById('qr-logo').files[0]) : "",
            dotsOptions: {
                color: qrColor,
                type: qrDotStyle
            },
            backgroundOptions: {
                color: qrBgColor
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5
            },
            cornersSquareOptions: {
                type: "extra-rounded"
            },
            cornersDotOptions: {
                type: "dot"
            }
        });
        
        if (qrCodeContainer) {
            qrCode.append(qrCodeContainer);
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        showNotification('Gagal membuat QR code', 'error');
    }
}
