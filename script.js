document.getElementById("pendaftaranForm").addEventListener("submit", function(e) {
    e.preventDefault(); // biar tidak reload

    // ambil data dari form
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const noHp = document.getElementById("noHp").value;
    const kursus = document.getElementById("jenisKursus").value;
    const jadwal = document.getElementById("jadwal").value;
    const alamat = document.getElementById("alamat").value;

    // buat isi PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("DATA PENDAFTARAN SISWA", 20, 20);

    pdf.setFontSize(12);
    pdf.text("Nama: " + nama, 20, 40);
    pdf.text("Email: " + email, 20, 50);
    pdf.text("No HP: " + noHp, 20, 60);
    pdf.text("Kursus: " + kursus, 20, 70);
    pdf.text("Jadwal: " + jadwal, 20, 80);
    pdf.text("Alamat: " + alamat, 20, 90);

    // download PDF
    pdf.save("data-pendaftaran.pdf");

    // tampilkan pesan sukses
    document.getElementById("successMessage").style.display = "block";
});