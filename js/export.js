// Export Functions

// Download as PNG
async function downloadPNG() {
    const element = document.getElementById('vcard-preview');
    if (!element) return;
    
    try {
        showNotification('Memproses gambar...', 'success');
        
        // Get current zoom level
        const zoomLevel = document.getElementById('zoom-level').textContent;
        const zoomValue = parseInt(zoomLevel) / 100;
        
        // Temporarily reset zoom for export
        element.style.transform = 'scale(1)';
        
        // Options for high quality
        const options = {
            scale: 4, // 4x resolution for print quality
            useCORS: true,
            backgroundColor: null,
            logging: false,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        
        const canvas = await html2canvas(element, options);
        
        // Restore zoom
        element.style.transform = `scale(${zoomValue})`;
        
        // Convert to blob with high quality
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const name = document.getElementById('name').value || 'qeo-card';
            a.download = `${name.replace(/\s+/g, '_')}_card.png`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Kartu berhasil diunduh dalam format PNG!', 'success');
        }, 'image/png', 1.0); // Maximum quality
    } catch (error) {
        console.error('Error downloading PNG:', error);
        showNotification('Gagal mengunduh kartu', 'error');
    }
}

// Download as PDF
async function downloadPDF() {
    const element = document.getElementById('vcard-preview');
    if (!element) return;
    
    try {
        showNotification('Memproses PDF...', 'success');
        
        // Get current zoom level
        const zoomLevel = document.getElementById('zoom-level').textContent;
        const zoomValue = parseInt(zoomLevel) / 100;
        
        // Temporarily reset zoom for export
        element.style.transform = 'scale(1)';
        
        // Get card size
        const sizeClass = Array.from(element.classList).find(cls => cls.startsWith('size-'));
        let width = 90; // Default ISO width in mm
        let height = 54; // Default ISO height in mm
        
        switch (sizeClass) {
            case 'size-us':
                width = 89;
                height = 51;
                break;
            case 'size-japan':
                width = 91;
                height = 55;
                break;
            case 'size-europe':
                width = 85;
                height = 55;
                break;
        }
        
        // Create canvas
        const canvas = await html2canvas(element, { 
            scale: 3, // High resolution
            useCORS: true,
            backgroundColor: null
        });
        
        // Restore zoom
        element.style.transform = `scale(${zoomValue})`;
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: width > height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [width, height]
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        
        const name = document.getElementById('name').value || 'qeo-card';
        pdf.save(`${name.replace(/\s+/g, '_')}_card.pdf`);
        
        showNotification('Kartu berhasil diunduh dalam format PDF!', 'success');
    } catch (error) {
        console.error('Error downloading PDF:', error);
        showNotification('Gagal mengunduh kartu', 'error');
    }
}

// Download as SVG
async function downloadSVG() {
    const element = document.getElementById('vcard-preview');
    if (!element) return;
    
    try {
        showNotification('Memproses SVG...', 'success');
        
        // Get QR code SVG
        const qrCodeElement = document.querySelector('#qr-code svg');
        if (!qrCodeElement) {
            showNotification('QR code tidak ditemukan', 'error');
            return;
        }
        
        const qrSvg = qrCodeElement.outerHTML;
        
        // Create SVG for the entire card
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        
        // Get card dimensions
        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        // Get computed styles for the card
        const styles = window.getComputedStyle(element);
        
        // Create background
        const background = document.createElementNS(svgNS, 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', styles.backgroundColor);
        svg.appendChild(background);
        
        // This is a simplified SVG export
        // In a real implementation, you would need to recreate all card elements in SVG
        
        // For now, we'll just create a simple SVG with the QR code
        const foreignObject = document.createElementNS(svgNS, 'foreignObject');
        foreignObject.setAttribute('width', '100%');
        foreignObject.setAttribute('height', '100%');
        
        const div = document.createElement('div');
        div.innerHTML = element.innerHTML;
        foreignObject.appendChild(div);
        svg.appendChild(foreignObject);
        
        // Serialize SVG
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        
        // Create blob and download
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        
        const name = document.getElementById('name').value || 'qeo-card';
        a.download = `${name.replace(/\s+/g, '_')}_card.svg`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Kartu berhasil diunduh dalam format SVG!', 'success');
    } catch (error) {
        console.error('Error downloading SVG:', error);
        showNotification('Gagal mengunduh kartu', 'error');
    }
}

// Download as vCard
function downloadVCard() {
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
    
    // Create blob and download
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.vcf`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Kartu berhasil diunduh dalam format vCard!', 'success');
}

// Print card
function printVCard() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get card HTML
    const cardElement = document.getElementById('vcard-preview');
    const cardHTML = cardElement.outerHTML;
    
    // Create print HTML
    const printHTML = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kartu Digital - ${document.getElementById('name').value || 'Nama Anda'}</title>
        <style>
            body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }
            .print-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            @media print {
                body {
                    background-color: white;
                    padding: 0;
                }
                .print-container {
                    padding: 0;
                }
            }
        </style>
        <link rel="stylesheet" href="/qeo-card/css/style.css">
        <link rel="stylesheet" href="/qeo-card/css/themes.css">
        <link rel="stylesheet" href="/qeo-card/css/templates.css">
        <link rel="stylesheet" href="/qeo-card/css/print.css">
    </head>
    <body>
        <div class="print-container">
            ${cardHTML}
        </div>
        <script>
            window.onload = function() {
                window.print();
                setTimeout(function() {
                    window.close();
                }, 100);
            }
        </script>
    </body>
    </html>`;
    
    // Write to new window
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    showNotification('Membuka dialog cetak...', 'success');
}
