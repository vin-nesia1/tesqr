// Main App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initApp();
    
    // Matrix background effect
    initMatrixEffect();
    
    // Template filtering
    initTemplateFiltering();
    
    // FAQ accordion
    initFAQAccordion();
    
    // Dark mode toggle
    initDarkMode();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Form submissions
    initFormSubmissions();
    
    // Animation on scroll
    initScrollAnimations();
    
    // Stats counter animation
    initStatsCounter();
});

// Initialize app
function initApp() {
    // Load saved data from localStorage
    loadSavedData();
    
    // Initialize QR code
    generateQRCode();
    
    // Set up event listeners
    setupEventListeners();
}

// Matrix background effect
function initMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    // Set interval for matrix effect
    const matrixInterval = setInterval(drawMatrix, 35);
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Template filtering
function initTemplateFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Filter templates
            templateCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('animate-fadeIn');
                    }, 100);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-fadeIn');
                }
            });
        });
    });
}

// FAQ accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// Dark mode toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    if (localStorage.getItem('dark-mode') === 'true') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update icon
        if (body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('dark-mode', 'true');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('dark-mode', 'false');
        }
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form submissions
function initFormSubmissions() {
    // vCard form
    const vcardForm = document.getElementById('vcard-form');
    if (vcardForm) {
        vcardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateCard();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactForm();
        });
    }
}

// Animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe template cards
    document.querySelectorAll('.template-card').forEach(card => {
        observer.observe(card);
    });
}

// Stats counter animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Template selection
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const template = card.dataset.template;
            selectTemplate(template);
        });
    });
    
    // Template select dropdown
    const templateSelect = document.getElementById('template-select');
    if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
            selectTemplate(e.target.value);
        });
    }
    
    // Size select dropdown
    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', (e) => {
            selectSize(e.target.value);
        });
    }
    
    // Theme select dropdown
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            selectTheme(e.target.value);
        });
    }
    
    // Profile picture upload
    const profilePicInput = document.getElementById('profile-pic');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
            handleProfilePicUpload(e);
        });
    }
    
    // QR logo upload
    const qrLogoInput = document.getElementById('qr-logo');
    if (qrLogoInput) {
        qrLogoInput.addEventListener('change', (e) => {
            handleQRLogoUpload(e);
        });
    }
    
    // Update QR button
    const updateQRBtn = document.getElementById('update-qr');
    if (updateQRBtn) {
        updateQRBtn.addEventListener('click', () => {
            generateQRCode();
            showNotification('QR code berhasil diperbarui!', 'success');
        });
    }
    
    // Zoom controls
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomLevel = document.getElementById('zoom-level');
    
    if (zoomInBtn && zoomOutBtn && zoomLevel) {
        let currentZoom = 100;
        
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 150) {
                currentZoom += 10;
                updateZoom(currentZoom);
            }
        });
        
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 50) {
                currentZoom -= 10;
                updateZoom(currentZoom);
            }
        });
        
        function updateZoom(level) {
            currentZoom = level;
            zoomLevel.textContent = `${level}%`;
            
            const vcard = document.getElementById('vcard-preview');
            if (vcard) {
                vcard.style.transform = `scale(${level / 100})`;
            }
        }
    }
    
    // View controls
    const viewFrontBtn = document.getElementById('view-front');
    const viewBackBtn = document.getElementById('view-back');
    
    if (viewFrontBtn && viewBackBtn) {
        viewFrontBtn.addEventListener('click', () => {
            viewFrontBtn.classList.add('active');
            viewBackBtn.classList.remove('active');
            // In a real app, this would show the front of the card
            showNotification('Menampilkan sisi depan kartu', 'success');
        });
        
        viewBackBtn.addEventListener('click', () => {
            viewBackBtn.classList.add('active');
            viewFrontBtn.classList.remove('active');
            // In a real app, this would show the back of the card
            showNotification('Menampilkan sisi belakang kartu', 'success');
        });
    }
    
    // Export buttons
    const downloadPNGBtn = document.getElementById('download-png');
    const downloadPDFBtn = document.getElementById('download-pdf');
    const downloadSVGBtn = document.getElementById('download-svg');
    const downloadVCardBtn = document.getElementById('download-vcard');
    const printVCardBtn = document.getElementById('print-vcard');
    
    if (downloadPNGBtn) {
        downloadPNGBtn.addEventListener('click', downloadPNG);
    }
    
    if (downloadPDFBtn) {
        downloadPDFBtn.addEventListener('click', downloadPDF);
    }
    
    if (downloadSVGBtn) {
        downloadSVGBtn.addEventListener('click', downloadSVG);
    }
    
    if (downloadVCardBtn) {
        downloadVCardBtn.addEventListener('click', downloadVCard);
    }
    
    if (printVCardBtn) {
        printVCardBtn.addEventListener('click', printVCard);
    }
    
    // Share buttons
    const shareLinkBtn = document.getElementById('share-link');
    const shareWhatsAppBtn = document.getElementById('share-whatsapp');
    const shareEmailBtn = document.getElementById('share-email');
    const saveDataBtn = document.getElementById('save-data');
    const loadDataBtn = document.getElementById('load-data');
    
    if (shareLinkBtn) {
        shareLinkBtn.addEventListener('click', shareLink);
    }
    
    if (shareWhatsAppBtn) {
        shareWhatsAppBtn.addEventListener('click', shareWhatsApp);
    }
    
    if (shareEmailBtn) {
        shareEmailBtn.addEventListener('click', shareEmail);
    }
    
    if (saveDataBtn) {
        saveDataBtn.addEventListener('click', saveCardData);
    }
    
    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', loadCardData);
    }
}

// Select template
function selectTemplate(templateName) {
    const vcard = document.getElementById('vcard-preview');
    if (!vcard) return;
    
    // Remove all template classes
    vcard.className = 'vcard cyber-border';
    
    // Add selected template class
    vcard.classList.add(`template-${templateName}`);
    
    // Update template select dropdown
    const templateSelect = document.getElementById('template-select');
    if (templateSelect) {
        templateSelect.value = templateName;
    }
    
    // Show notification
    showNotification(`Template ${templateName.replace('-', ' ')} berhasil diterapkan!`, 'success');
    
    // Scroll to editor
    document.getElementById('editor').scrollIntoView({ behavior: 'smooth' });
}

// Select size
function selectSize(sizeName) {
    const vcard = document.getElementById('vcard-preview');
    if (!vcard) return;
    
    // Remove all size classes
    vcard.classList.remove('size-iso', 'size-us', 'size-japan', 'size-europe');
    
    // Add selected size class
    vcard.classList.add(`size-${sizeName}`);
    
    // Show notification
    const sizeLabels = {
        'iso': 'ISO/Internasional (90 × 54 mm)',
        'us': 'US/Canada (89 × 51 mm)',
        'japan': 'Jepang (91 × 55 mm)',
        'europe': 'Eropa (85 × 55 mm)'
    };
    
    showNotification(`Ukuran kartu diubah ke ${sizeLabels[sizeName]}`, 'success');
}

// Select theme
function selectTheme(themeName) {
    const vcard = document.getElementById('vcard-preview');
    if (!vcard) return;
    
    // Remove all theme classes
    vcard.classList.remove('theme-standard', 'theme-vip', 'theme-tech', 'theme-creative', 'theme-nature');
    
    // Add selected theme class
    vcard.classList.add(`theme-${themeName}`);
    
    // Show notification
    const themeLabels = {
        'standard': 'Standar',
        'vip': 'VIP',
        'tech': 'Canggih',
        'creative': 'Kreatif',
        'nature': 'Alam'
    };
    
    showNotification(`Tema warna diubah ke ${themeLabels[themeName]}`, 'success');
}

// Handle profile picture upload
function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Ukuran file maksimal 2MB!', 'error');
        e.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const previewAvatar = document.getElementById('preview-avatar');
        if (previewAvatar) {
            previewAvatar.src = event.target.result;
            showNotification('Foto profil berhasil diunggah!', 'success');
        }
    };
    reader.readAsDataURL(file);
}

// Handle QR logo upload
function handleQRLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
        showNotification('Ukuran file logo maksimal 1MB!', 'error');
        e.target.value = '';
        return;
    }
    
    showNotification('Logo QR code berhasil diunggah!', 'success');
}

// Update card
function updateCard() {
    // Update preview
    const name = document.getElementById('name').value;
    const title = document.getElementById('title').value;
    const company = document.getElementById('company').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const website = document.getElementById('website').value;
    const address = document.getElementById('address').value;
    
    // Update preview elements
    document.getElementById('preview-name').textContent = name || 'Nama Anda';
    document.getElementById('preview-title').textContent = title || 'Jabatan Anda';
    document.getElementById('preview-company').textContent = company || 'Perusahaan Anda';
    document.getElementById('preview-phone').textContent = phone || '+62 812 3456 7890';
    document.getElementById('preview-email').textContent = email || 'email@example.com';
    document.getElementById('preview-website').textContent = website || 'https://example.com';
    document.getElementById('preview-address').textContent = address || 'Jl. Example No. 123, Jakarta';
    
    // Update QR code
    generateQRCode();
    
    // Save to localStorage
    saveCardData();
    
    // Show notification
    showNotification('Kartu digital berhasil diperbarui!', 'success');
}

// Handle contact form
function handleContactForm() {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    // In a real app, this would send the form data to a server
    // For this static site, we'll just show a notification
    
    // Reset form
    document.getElementById('contact-form').reset();
    
    // Show notification
    showNotification('Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load saved data
function loadSavedData() {
    const savedData = localStorage.getItem('qeo-card-data');
    if (!savedData) return;
    
    try {
        const cardData = JSON.parse(savedData);
        
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
        
        // Show notification
        showNotification('Data kartu berhasil dimuat!', 'success');
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Save card data
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
        size: document.getElementById('size-select').value
    };
    
    localStorage.setItem('qeo-card-data', JSON.stringify(cardData));
    showNotification('Data kartu tersimpan di browser!', 'success');
}

// Load card data from file
function loadCardData() {
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
                
                // Show notification
                showNotification('Data kartu berhasil dimuat dari file!', 'success');
            } catch (error) {
                showNotification('Format file tidak valid!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Share link
function shareLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link disalin ke clipboard!', 'success');
            })
            .catch(err => {
                showNotification('Gagal menyalin link', 'error');
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link disalin ke clipboard!', 'success');
    }
}

// Share to WhatsApp
function shareWhatsApp() {
    const name = document.getElementById('name').value || 'Nama Anda';
    const url = window.location.href;
    const text = `Lihat kartu digital saya: ${name} - ${url}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

// Share via email
function shareEmail() {
    const name = document.getElementById('name').value || 'Nama Anda';
    const url = window.location.href;
    const subject = `Kartu Digital dari ${name}`;
    const body = `Halo, saya ingin membagikan kartu digital saya dengan Anda.\n\nNama: ${name}\nLink: ${url}\n\nTerima kasih!`;
    
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
}

// Download functions will be implemented in export.js
function downloadPNG() {
    // Implementation in export.js
    showNotification('Mengunduh kartu dalam format PNG...', 'success');
}

function downloadPDF() {
    // Implementation in export.js
    showNotification('Mengunduh kartu dalam format PDF...', 'success');
}

function downloadSVG() {
    // Implementation in export.js
    showNotification('Mengunduh kartu dalam format SVG...', 'success');
}

function downloadVCard() {
    // Implementation in export.js
    showNotification('Mengunduh kartu dalam format vCard...', 'success');
}

function printVCard() {
    // Implementation in export.js
    showNotification('Membuka dialog cetak...', 'success');
}

// Generate QR code will be implemented in qr-generator.js
function generateQRCode() {
    // Implementation in qr-generator.js
}
