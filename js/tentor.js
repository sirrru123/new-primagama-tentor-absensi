import { db } from "./firebase.js";
import {
  ref,
  push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const jenjang = document.getElementById("jenjang");
const kelas = document.getElementById("kelas");

jenjang.addEventListener("change", () => {

  kelas.innerHTML =
  '<option value="">Pilih Kelas</option>';

  if (jenjang.value === "SD") {

    for (let i = 1; i <= 6; i++) {
      kelas.innerHTML +=
      `<option value="${i}">Kelas ${i}</option>`;
    }

  }

  else if (jenjang.value === "SMP") {

    for (let i = 7; i <= 9; i++) {
      kelas.innerHTML +=
      `<option value="${i}">Kelas ${i}</option>`;
    }

  }

  else if (jenjang.value === "SMA") {

    for (let i = 10; i <= 12; i++) {
      kelas.innerHTML +=
      `<option value="${i}">Kelas ${i}</option>`;
    }

  }

});

const form = document.getElementById("absensiForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nama =
  document.getElementById("nama").value;

  const data = {

    tanggal:
    document.getElementById("tanggal").value,

    nama,

    jamTiba:
    document.getElementById("jamTiba").value,

    jadwal:
    document.getElementById("jadwal").value,

    jamSelesai:
    document.getElementById("jamSelesai").value,

    jenjang:
    document.getElementById("jenjang").value,

    kelas:
    document.getElementById("kelas").value,

    mapel:
    document.getElementById("mapel").value,

    materi:
    document.getElementById("materi").value,

    jenis:
    document.getElementById("jenis").value,

    kendala:
    document.getElementById("kendala").value

  };

  try {

    await push(
      ref(db, `tentor/${nama}/history`),
      data
    );

    alert(
      "Absensi berhasil disimpan!"
    );

    form.reset();

    kelas.innerHTML =
    '<option value="">Pilih Kelas</option>';

  }

  catch(error){

    console.error(error);

    alert(
      "Gagal menyimpan data!"
    );

  }

});