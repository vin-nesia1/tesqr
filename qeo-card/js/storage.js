// Storage Management Functions

// Save card data to localStorage
function saveCardData() {
    const cardData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        website: document.getElementById('website').value,
        address: document.getElementById('address').value,
        template: document.getElementById('template-select').value,
        theme: document.getElementById('theme-select').value,
        size: document.getElementById('size-select').value,
        qrColor: document.getElementById('qr-color').value,
        qrBgColor: document.getElementById('qr-bg-color').value,
        qrDotStyle: document.getElementById('qr-dot-style').value
    };
    
    localStorage.setItem('qeo-card-data', JSON.stringify(cardData));
    return cardData;
}

// Load card data from localStorage
function loadCardData() {
    const savedData = localStorage.getItem('qeo-card-data');
    if (!savedData) return null;
    
    try {
        const cardData = JSON.parse(savedData);
        
        // Populate form fields
        Object.keys(cardData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = cardData[key];
            }
        });
        
        return cardData;
    } catch (error) {
        console.error('Error loading saved data:', error);
        return null;
    }
}

// Export card data to JSON file
function exportCardData() {
    const cardData = saveCardData();
    
    const blob = new Blob([JSON.stringify(cardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    const name = document.getElementById('name').value || 'qeo-card';
    a.download = `${name.replace(/\s+/g, '_')}_data.json`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data kartu berhasil diekspor!', 'success');
}

// Import card data from JSON file
function importCardData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const cardData = JSON.parse(event.target.result);
                
                // Validate card data
                if (!cardData.name || !cardData.email) {
                    throw new Error('Invalid card data');
                }
                
                // Populate form fields
                Object.keys(cardData).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = cardData[key];
                    }
                });
                
                // Apply template, theme, and size
                if (cardData.template) {
                    selectTemplate(cardData.template);
                }
                
                if (cardData.theme) {
                    selectTheme(cardData.theme);
                }
                
                if (cardData.size) {
                    selectSize(cardData.size);
                }
                
                // Update preview
                updateCard();
                
                // Save to localStorage
                localStorage.setItem('qeo-card-data', JSON.stringify(cardData));
                
                showNotification('Data kartu berhasil diimpor!', 'success');
            } catch (error) {
                showNotification('Format file tidak valid!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear all saved data
function clearSavedData() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data tersimpan?')) {
        localStorage.removeItem('qeo-card-data');
        
        // Reset form
        document.getElementById('vcard-form').reset();
        
        // Reset preview
        document.getElementById('preview-name').textContent = 'Nama Anda';
        document.getElementById('preview-title').textContent = 'Jabatan Anda';
        document.getElementById('preview-company').textContent = 'Perusahaan Anda';
        document.getElementById('preview-phone').textContent = '+62 812 3456 7890';
        document.getElementById('preview-email').textContent = 'email@example.com';
        document.getElementById('preview-website').textContent = 'https://example.com';
        document.getElementById('preview-address').textContent = 'Jl. Example No. 123, Jakarta';
        
        // Reset to default template, theme, and size
        selectTemplate('modern-business');
        selectTheme('standard');
        selectSize('iso');
        
        // Reset QR options
        document.getElementById('qr-color').value = '#6a0dad';
        document.getElementById('qr-bg-color').value = '#ffffff';
        document.getElementById('qr-dot-style').value = 'square';
        
        // Regenerate QR code
        generateQRCode();
        
        showNotification('Semua data berhasil dihapus!', 'success');
    }
}

// Check if there's saved data
function hasSavedData() {
    return localStorage.getItem('qeo-card-data') !== null;
}

// Get saved data
function getSavedData() {
    const savedData = localStorage.getItem('qeo-card-data');
    if (!savedData) return null;
    
    try {
        return JSON.parse(savedData);
    } catch (error) {
        console.error('Error getting saved data:', error);
        return null;
    }
}
