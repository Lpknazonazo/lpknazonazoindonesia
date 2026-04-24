// Smooth scroll untuk semua link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Elements
const form = document.getElementById('pendaftaranForm');
const successMsg = document.getElementById('successMessage');
const downloadBtn = document.getElementById('downloadPdf');
const clearBtn = document.getElementById('clearForm');
const fotoInput = document.getElementById('foto');
const fotoPreview = document.getElementById('fotoPreview');

let studentData = {};
let pdfDoc = null; // Simpan PDF document
let pdfReady = false;

// 1. PREVIEW FOTO UPLOAD
fotoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Validasi ukuran file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Foto maksimal 2MB!');
            this.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoPreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview Foto">
                <small>${file.name} (${(file.size/1024/1024).toFixed(1)} MB)</small>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        fotoPreview.innerHTML = '';
    }
});

// 2. FORM SUBMIT - SIMPAN DATA & GENERATE PDF
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validasi form
    const nama = document.getElementById('nama').value.trim();
    if (!nama) {
        alert('Nama wajib diisi!');
        return;
    }
    
    // Collect semua data
    studentData = {
        nomorPendaftaran: 'PTR-' + Date.now().toString().slice(-6),
        nama: nama,
        email: document.getElementById('email').value,
        noHp: document.getElementById('noHp').value,
        jenisKursus: document.getElementById('jenisKursus').value,
        jadwal: document.getElementById('jadwal').value,
        alamat: document.getElementById('alamat').value || 'Tidak diisi',
        tanggalDaftar: new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        foto: fotoInput.files[0]
    };

    // Simpan ke localStorage
    localStorage.setItem('latestStudent', JSON.stringify(studentData));
    
    // Hide form, show success
    form.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Generate PDF
    generatePDF();
});

// 3. GENERATE PDF LENGKAP
function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        pdfDoc = doc;
        pdfReady = true;

        // HEADER - Background gradient
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('PRIME TEKIPAKI RAYA', 105, 22, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('BUKTI PENDAFTARAN SISWA BARU', 105, 35, { align: 'center' });

        // NOMOR PENDAFTARAN BESAR
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(212, 175, 55);
        doc.text(`No. Pendaftaran: ${studentData.nomorPendaftaran}`, 20, 60);
        
        // Border untuk nomor
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(1);
        doc.roundedRect(18, 55, 172, 12, 2, 2, 'S');

        // DATA SISWA
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text('DATA PENDAFTAR', 20, 85);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        const dataY = 100;
        const lines = [
            `Nama Lengkap     : ${studentData.nama}`,
            `Email            : ${studentData.email}`,
            `No. Telepon      : ${studentData.noHp}`,
            `Jenis Kursus     : ${studentData.jenisKursus}`,
            `Jadwal Kelas     : ${studentData.jadwal}`,
            `Alamat           : ${studentData.alamat}`
        ];

        lines.forEach((line, index) => {
            doc.text(line, 25, dataY + (index * 8));
        });

        // TANGGAL
        doc.setFont('helvetica', 'bold');
        doc.text(`Tanggal Daftar: ${studentData.tanggalDaftar}`, 25, dataY + 70);

        // FOTO (jika ada)
        if (studentData.foto) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imgData = e.target.result;
                    doc.addImage(imgData, 'JPEG', 140, 85, 50, 50, '', 'FAST');
                } catch (err) {
                    console.log('Gagal load foto ke PDF');
                }
                // Auto download setelah foto ready
                setTimeout(() => downloadPDF(), 500);
            };
            reader.readAsDataURL(studentData.foto);
        } else {
            // Tanpa foto, langsung download
            setTimeout(() => downloadPDF(), 300);
        }

        // Tanda tangan
        doc.line(25, 220, 185, 220);
        doc.setFontSize(10);
        doc.text('Tanda Tangan Pendaftar / Orang Tua', 105, 230, { align: 'center' });

        // Footer
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 280, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Jl. Contoh No.123, Jakarta | (021) 12345678 | info@primetekipaki.com', 105, 290, { align: 'center' });

    } catch (error) {
        console.error('Error generate PDF:', error);
        alert('Gagal generate PDF, coba lagi!');
    }
}

// 4. DOWNLOAD PDF
function downloadPDF() {
    if (pdfDoc) {
        const filename = `Pendaftaran_${studentData.nomorPendaftaran}_${studentData.nama.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        pdfDoc.save(filename);
        console.log('PDF downloaded:', filename);
    }
}

// 5. DOWNLOAD ULANG (klik link success)
downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (pdfReady && pdfDoc) {
        downloadPDF();
    } else {
        alert('Generate PDF dulu dengan submit form!');
    }
});

// 6. CLEAR FORM
clearBtn.addEventListener('click', function() {
    form.reset();
    fotoPreview.innerHTML = '';
    successMsg.style.display = 'none';
    form.style.display = 'block';
    pdfReady = false;
    pdfDoc = null;
});

// 7. AUTO FILL dari localStorage saat load
window.addEventListener('load', function() {
    const saved = localStorage.getItem('latestStudent');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            document.getElementById('nama').value = data.nama || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('noHp').value = data.noHp || '';
            document.getElementById('jenisKursus').value = data.jenisKursus || '';
            document.getElementById('jadwal').value = data.jadwal || '';
            document.getElementById('alamat').value = data.alamat || '';
            
            // Tampilkan nomor pendaftaran terakhir
            console.log('Data terakhir:', data.nomorPendaftaran);
        } catch (e) {
            console.log('Data localStorage rusak, skip');
        }
    }
});

// 8. Navbar active on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
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