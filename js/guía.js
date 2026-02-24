import { db, storage } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const form = document.getElementById("guiaForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const anio = document.getElementById("anio").value;
  const seccion = document.getElementById("seccion").value;
  const contenidoTexto = document.getElementById("contenidoTexto").value;
  const pdfFile = document.getElementById("pdfFile").files[0];

  try {

    let pdfURL = "";

    // 📄 Si hay PDF lo subimos
    if (pdfFile) {
      const storageRef = ref(storage, "guias/" + Date.now() + "_" + pdfFile.name);
      await uploadBytes(storageRef, pdfFile);
      pdfURL = await getDownloadURL(storageRef);
    }

    // 💾 Guardar guía en Firestore
    await addDoc(collection(db, "guias"), {
      titulo,
      anio,
      seccion,
      contenidoTexto,
      pdfURL,
      fechaCreacion: serverTimestamp(),
      estado: "publicada"
    });

    mensaje.innerHTML = "✅ Guía publicada correctamente";
    form.reset();

  } catch (error) {
    mensaje.innerHTML = "❌ Error: " + error.message;
  }

});