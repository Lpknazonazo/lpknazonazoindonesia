document.getElementById("pendaftaranForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const noHp = document.getElementById("noHp").value;
    const kursus = document.getElementById("jenisKursus").value;
    const jadwal = document.getElementById("jadwal").value;
    const alamat = document.getElementById("alamat").value;

    const file = document.getElementById("foto").files[0];

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

    // 🔥 kalau ada foto
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imgData = event.target.result;

            // masukin foto ke PDF
            pdf.addImage(imgData, 'JPEG', 150, 20, 30, 30);

            pdf.save("data-pendaftaran.pdf");
        };

        reader.readAsDataURL(file);
    } else {
        pdf.save("data-pendaftaran.pdf");
    }

    document.getElementById("successMessage").style.display = "block";
});