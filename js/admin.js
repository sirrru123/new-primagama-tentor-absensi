import { db } from "./firebase.js";
import {
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const table = document.getElementById("tentorTable");
const totalTentor = document.getElementById("totalTentor");
const totalAbsensi = document.getElementById("totalAbsensi");

const modal = document.getElementById("historyModal");
const modalTitle = document.getElementById("modalTitle");
const historyContent = document.getElementById("historyContent");

const searchInput = document.getElementById("searchInput");
const downloadBtn = document.getElementById("downloadBtn");

let semuaData = {};
// ====================
// LOGIN ADMIN
// ====================

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");
const togglePassword = document.getElementById("togglePassword");

dashboard.style.display = "none";

loginBtn.addEventListener("click", loginAdmin);

passwordInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        loginAdmin();

    }

});

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.innerHTML = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.innerHTML = "👁";

    }

});

function loginAdmin() {

    if (passwordInput.value === "adminpg123") {

        loginPage.style.display = "none";
        dashboard.style.display = "block";

    } else {

        loginError.innerHTML = "Password salah!";
        passwordInput.value = "";
        passwordInput.focus();

    }

}


// ====================
// AMBIL DATA FIREBASE
// ====================

onValue(ref(db, "tentor"), (snapshot) => {

    semuaData = snapshot.val() || {};

    renderTable(semuaData);

});

// ====================
// RENDER TABEL
// ====================

function renderTable(data) {

    table.innerHTML = "";

    let jumlahTentor = 0;
    let jumlahAbsensi = 0;

    Object.keys(data).forEach((nama) => {

        const tentor = data[nama];

        if (!tentor.history) return;

        jumlahTentor++;

        const totalHistory =
            Object.keys(tentor.history).length;

        jumlahAbsensi += totalHistory;

        table.innerHTML += `
        <tr>

            <td>${nama}</td>

            <td>${totalHistory}</td>

            <td>
                <button
                class="history-btn"
                onclick="lihatHistory('${nama}')">
                Lihat
                </button>
            </td>

            <td>
                <button
                class="delete-btn"
                onclick="hapusTentor('${nama}')">
                Hapus
                </button>
            </td>

        </tr>
        `;

    });

    totalTentor.textContent = jumlahTentor;
    totalAbsensi.textContent = jumlahAbsensi;

}

// ====================
// SEARCH
// ====================

searchInput.addEventListener("input", () => {

    const keyword =
    searchInput.value.toLowerCase();

    const hasil = {};

    Object.keys(semuaData).forEach((nama) => {

        if (
            nama.toLowerCase()
            .includes(keyword)
        ) {

            hasil[nama] =
            semuaData[nama];

        }

    });

    renderTable(hasil);

});

// ====================
// LIHAT HISTORY
// ====================

function lihatHistory(nama) {

    modal.style.display = "flex";

    modalTitle.innerText =
    `History ${nama}`;

    historyContent.innerHTML = "";

    const history =
    semuaData[nama]?.history || {};

    if (Object.keys(history).length === 0) {

        historyContent.innerHTML =
        "<p>Tidak ada data absensi.</p>";

        return;

    }

    Object.keys(history).forEach((id) => {

        const item = history[id];

        historyContent.innerHTML += `

        <div class="history-card">

            <p><b>Tanggal:</b> ${item.tanggal || "-"}</p>

            <p><b>Jam Tiba:</b> ${item.jamTiba || "-"}</p>

            <p><b>Jadwal:</b> ${item.jadwal || "-"}</p>

            <p><b>Jam Selesai:</b> ${item.jamSelesai || "-"}</p>

            <p><b>Jenjang:</b> ${item.jenjang || "-"}</p>

            <p><b>Kelas:</b> ${item.kelas || "-"}</p>

            <p><b>Mapel:</b> ${item.mapel || "-"}</p>

            <p><b>Materi:</b> ${item.materi || "-"}</p>

            <p><b>Jenis:</b> ${item.jenis || "-"}</p>

            <p><b>Kendala:</b> ${item.kendala || "-"}</p>

            <button
            class="delete-history-btn"
            onclick="hapusHistory('${nama}','${id}')">

            Hapus Data Ini

            </button>

        </div>

        `;

    });

}
// ====================
// TUTUP MODAL
// ====================

document
.getElementById("closeModal")
.addEventListener("click", () => {

    modal.style.display = "none";

});

// ====================
// HAPUS 1 HISTORY
// ====================

async function hapusHistory(
    nama,
    id
) {

    const yakin = confirm(
        "Yakin ingin menghapus data absensi ini?"
    );

    if (!yakin) return;

    try {

        await remove(
            ref(
                db,
                `tentor/${nama}/history/${id}`
            )
        );

        alert("Data berhasil dihapus");

    } catch (error) {

        console.error(error);

        alert("Gagal menghapus data");

    }

}

// ====================
// HAPUS TENTOR
// ====================

async function hapusTentor(
    nama
) {

    const yakin = confirm(
        `Yakin ingin menghapus seluruh data ${nama}?`
    );

    if (!yakin) return;

    try {

        await remove(
            ref(
                db,
                `tentor/${nama}`
            )
        );

        alert("Data tentor berhasil dihapus");

    } catch (error) {

        console.error(error);

        alert("Gagal menghapus tentor");

    }

}

// ====================
// DOWNLOAD EXCEL
// ====================

if (downloadBtn) {

    downloadBtn.addEventListener("click", downloadExcel);

}

function downloadExcel() {

    const data = [];

    Object.keys(semuaData).forEach((nama) => {

        const history =
            semuaData[nama]?.history || {};

        Object.keys(history).forEach((id) => {

            const item = history[id];

            data.push({

                "Nama Tentor": nama,
                "Tanggal": item.tanggal || "-",
                "Jam Tiba": item.jamTiba || "-",
                "Jadwal": item.jadwal || "-",
                "Jam Selesai": item.jamSelesai || "-",
                "Jenjang": item.jenjang || "-",
                "Kelas": item.kelas || "-",
                "Mapel": item.mapel || "-",
                "Materi": item.materi || "-",
                "Jenis": item.jenis || "-",
                "Kendala": item.kendala || "-"

            });

        });

    });

    if (data.length === 0) {

        alert("Belum ada data absensi.");

        return;

    }

    const workbook =
        XLSX.utils.book_new();

    const worksheet =
        XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Absensi Tentor"
    );

    XLSX.writeFile(
        workbook,
        "Absensi_Tentor.xlsx"
    );

}

// ====================
// GLOBAL BUTTON
// ====================

window.lihatHistory =
lihatHistory;

window.hapusHistory =
hapusHistory;

window.hapusTentor =
hapusTentor;
