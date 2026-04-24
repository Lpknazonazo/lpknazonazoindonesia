document.addEventListener("DOMContentLoaded", function () {

    console.log("JS KELOAD ✅");

    // Elements
    const form = document.getElementById('pendaftaranForm');
    const successMsg = document.getElementById('successMessage');
    const clearBtn = document.getElementById('clearForm');
    const fotoInput = document.getElementById('foto');
    const fotoPreview = document.getElementById('fotoPreview');

    // ❗ Stop kalau form tidak ada
    if (!form) {
        console.error("❌ Form tidak ditemukan!");
        return;
    }

    let studentData = {};

    // =========================
    // PREVIEW FOTO
    // =========================
    if (fotoInput) {
        fotoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            if (!file) {
                if (fotoPreview) fotoPreview.innerHTML = '';
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert('Foto maksimal 2MB!');
                this.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                if (fotoPreview) {
                    fotoPreview.innerHTML = `
                        <img src="${e.target.result}" style="width:100px;border-radius:10px;">
                    `;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // =========================
    // SUBMIT FORM
    // =========================
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("Submit ditekan ✅");

        // 🔥 CEK JSPDF
        if (!window.jspdf) {
            alert("❌ jsPDF belum kebaca!");
            console.error("jspdf undefined");
            return;
        }

        const nama = document.getElementById('nama').value.trim();
        if (!nama) {
            alert("Nama wajib diisi!");
            return;
        }

        studentData = {
            nomor: 'PTR-' + Date.now().toString().slice(-6),
            nama: nama,
            email: document.getElementById('email').value,
            noHp: document.getElementById('noHp').value,
            kursus: document.getElementById('jenisKursus').value,
            jadwal: document.getElementById('jadwal').value,
            alamat: document.getElementById('alamat').value,
            foto: fotoInput && fotoInput.files ? fotoInput.files[0] : null
        };

        generatePDF();
    });

    // =========================
    // GENERATE PDF
    // =========================
    function generatePDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.text("DATA PENDAFTARAN", 20, 20);

            doc.setFontSize(12);
            doc.text("No: " + studentData.nomor, 20, 40);
            doc.text("Nama: " + studentData.nama, 20, 50);
            doc.text("Email: " + studentData.email, 20, 60);
            doc.text("No HP: " + studentData.noHp, 20, 70);
            doc.text("Kursus: " + studentData.kursus, 20, 80);
            doc.text("Jadwal: " + studentData.jadwal, 20, 90);
            doc.text("Alamat: " + studentData.alamat, 20, 100);

            // FOTO
            if (studentData.foto) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    doc.addImage(e.target.result, 'JPEG', 140, 40, 40, 40);
                    finish(doc);
                };
                reader.readAsDataURL(studentData.foto);
            } else {
                finish(doc);
            }

        } catch (err) {
            console.error("ERROR PDF:", err);
            alert("Gagal buat PDF!");
        }
    }

    // =========================
    // FINISH & DOWNLOAD
    // =========================
    function finish(doc) {
        doc.save("pendaftaran.pdf");

        if (form) form.style.display = "none";
        if (successMsg) successMsg.style.display = "block";
    }

    // =========================
    // RESET
    // =========================
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            form.reset();
            if (fotoPreview) fotoPreview.innerHTML = '';
        });
    }

});
// TAMBAH KAKAK / ADEK
document.getElementById("tambahKeluarga").addEventListener("click", function () {

    const container = document.getElementById("keluargaContainer");

    const div = document.createElement("div");
    div.classList.add("keluarga-item");

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Hubungan</label>
                <select name="keluargaHubungan[]">
                    <option>Kakak</option>
                    <option>Adik</option>
                </select>
            </div>

            <div class="form-group">
                <label>Nama</label>
                <input type="text" name="keluargaNama[]">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Umur</label>
                <input type="number" name="keluargaUmur[]">
            </div>

            <div class="form-group">
                <label>Pekerjaan</label>
                <input type="text" name="keluargaPekerjaan[]">
            </div>
        </div>

        <div class="form-group">
            <label>Penghasilan</label>
            <input type="number" name="keluargaGaji[]">
        </div>

        <button type="button" class="btn-remove">❌ Hapus</button>
    `;

    container.appendChild(div);
});