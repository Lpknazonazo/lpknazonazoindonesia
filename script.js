// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form handler
const form = document.getElementById('pendaftaranForm');
const successMsg = document.getElementById('successMessage');
const downloadBtn = document.getElementById('downloadPdf');
const clearBtn = document.getElementById('clearForm');
const fotoInput = document.getElementById('foto');
const fotoPreview = document.getElementById('fotoPreview');

let studentData = {};
let pdfReady = false;

// Preview foto
fotoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Form submit
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect data
    studentData = {
        nomorPendaftaran: 'PTR-' + Date.now().toString().slice(-6),
        nama: document.getElementById('nama').value,
        email: document.getElementById('email').value,
        noHp: document.getElementById('noHp').value,
        jenisKursus: document.getElementById('jenisKursus').value,
        jadwal: document.getElementById('jadwal').value,
        alamat: document.getElementById('alamat').value,
        tanggalDaftar: new Date().toLocaleDateString('id-ID'),
        foto: fotoInput.files[0]
    };

    // Hide form, show success
    form.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth' });
    
    // Generate PDF
    generatePDF();
});

// Download PDF
downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (pdfReady) {
        // PDF sudah siap, download ulang
        downloadPDF();
    }
});

clearBtn.addEventListener('click', function() {
    form.reset();
    fotoPreview.innerHTML = '';
    successMsg.style.display = 'none';
    form.style.display = 'block';
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(22);
    doc.text('PRIME TEKIPAKI RAYA', 105, 22, { align: 'center' });
    doc.setFontSize(14);
    doc.text('BUKTI PENDAFTARAN SISWA', 105, 32, { align: 'center' });

    // Nomor pendaftaran
    doc.setTextColor(0,0,0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`No. Pendaftaran: ${studentData.nomorPendaftaran}`, 20, 55);

    // Data siswa
    doc.setFontSize(14);
    doc.text('DATA PENDAFTAR', 20, 75);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const lines = [
        `Nama