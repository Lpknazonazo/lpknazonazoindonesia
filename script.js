document.addEventListener("DOMContentLoaded", function () {

    console.log("JS KELOAD ✅");

    // ELEMENTS
    const form = document.getElementById('pendaftaranForm');
    const successMsg = document.getElementById('successMessage');
    const clearBtn = document.getElementById('clearForm');
    const fotoInput = document.getElementById('foto');
    const fotoPreview = document.getElementById('fotoPreview');
    const tambahBtn = document.getElementById("tambahKeluarga");

    if (!form) {
        console.error("❌ Form tidak ditemukan!");
        return;
    }

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
                    fotoPreview.innerHTML = `<img src="${e.target.result}" style="width:100px;border-radius:10px;">`;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // =========================
    // TAMBAH KELUARGA 🔥
    // =========================
    if (tambahBtn) {
        tambahBtn.addEventListener("click", function () {

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
    } else {
        console.error("❌ Tombol tambahKeluarga tidak ditemukan");
    }

    // =========================
    // HAPUS ITEM
    // =========================
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-remove")) {
            e.target.closest(".keluarga-item").remove();
        }
    });

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