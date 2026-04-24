// Load jsPDF library
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
document.head.appendChild(script);

let studentData = {};

// Navbar Mobile Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Form Pendaftaran Handler
const form = document.getElementById('pendaftaranForm');
const successMessage = document.getElementById('successMessage');
const downloadPdfLink = document.getElementById('downloadPdf');
const clearFormBtn = document.getElementById('clearForm');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect form data
    studentData = {
        nama: document.getElementById('nama').value,
        email: document.getElementById('email').value,
        noHp: document.getElementById('noHp').value,
        jenisKursus: document.getElementById('jenisKursus').value,
        jadwal: document.getElementById('jadwal').value,
        alamat: document.getElementById('alamat').value,
        tanggalDaftar: new Date().toLocaleDateString('id-ID'),
        nomorPendaftaran: 'LPK-' + Date.now().toString().slice(-6)
    };

    // Simulasi save to localStorage (bisa diganti dengan API)
    localStorage.setItem('latestStudent', JSON.stringify(studentData));
    
    // Show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });
});

// Download PDF function
downloadPdfLink.addEventListener('click', function(e) {
    e.preventDefault();
    generatePDF();
});

// Generate PDF
function generatePDF() {
    // Wait for jsPDF to load
    if (typeof window.jspdf === 'undefined') {
        setTimeout(generatePDF, 100);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LPK KREASI MANDIRI', 105, 22, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('FORM PENDAFTARAN SISWA BARU', 105, 30, { align: 'center' });

    // Nomor Pendaftaran
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`No. Pendaftaran: ${studentData.nomorPendaftaran}`, 20, 50);

    // Data Siswa
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA PENDAFTAR', 20, 70);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const dataLines = [
        `Nama Lengkap     : ${studentData.nama}`,
        `Email            : ${studentData.email}`,
        `No. Telepon      : ${studentData.noHp}`,
        `Jenis Kursus     : ${studentData.jenisKursus}`,
        `Jadwal           : ${studentData.jadwal}`,
        `Alamat           : ${studentData.alamat || 'Tidak diisi'}`
    ];

    dataLines.forEach((line, index) => {
        doc.text(line, 20, 90 + (index * 8));
    });

    // Tanggal
    doc.setFont('helvetica', 'bold');
    doc.text(`Tanggal Pendaftaran: ${studentData.tanggalDaftar}`, 20, 170);

    // Footer
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 280, 210, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Jl. Contoh No. 123, Jakarta | (021) 12345678 | info@lpkkreasimandiri.com', 105, 290, { align: 'center' });

    // Tanda Tangan
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.line(20, 230, 190, 230);
    doc.text('Tanda Tangan Pendaftar', 105, 240, { align: 'center' });

    // Save PDF
    const fileName = `Pendaftaran_${studentData.nomorPendaftaran}_${studentData.nama.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
}

// Clear Form
clearFormBtn.addEventListener('click', function() {
    form.reset();
    successMessage.style.display = 'none';
    form.style.display = 'block';
});

// Navbar active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Auto-hide success message after 10 seconds (optional)
setTimeout(() => {
    if (successMessage.style.display === 'block') {
        successMessage.style.display = 'none';
        form.style.display = 'block';
    }
}, 30000);

// Load previous data if available
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('latestStudent');
    if (savedData) {
        const data = JSON.parse(savedData);
        // Auto-fill form
        Object.keys(data).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = data[key];
        });
    }
});