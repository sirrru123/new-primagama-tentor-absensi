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

let semuaData = {};

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
// GLOBAL BUTTON
// ====================

window.lihatHistory =
lihatHistory;

window.hapusHistory =
hapusHistory;

window.hapusTentor =
hapusTentor;