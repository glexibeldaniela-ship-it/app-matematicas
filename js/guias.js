import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("guiaForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const anio = document.getElementById("anio").value;
  const seccion = document.getElementById("seccion").value;
  const contenidoTexto = document.getElementById("contenidoTexto").value;
  let pdfLink = document.getElementById("pdfLink").value;

  try {

    // Convertir enlace de Drive a descarga directa
    if (pdfLink.includes("drive.google.com")) {
      const match = pdfLink.match(/\/d\/(.*?)\//);
      if (match && match[1]) {
        const fileId = match[1];
        pdfLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }

    await addDoc(collection(db, "guias"), {
      titulo: titulo,
      anio: anio,
      seccion: seccion,
      contenidoTexto: contenidoTexto,
      pdfURL: pdfLink || "",
      fechaCreacion: serverTimestamp(),
      estado: "publicada"
    });

    mensaje.innerHTML = "✅ Guía publicada correctamente";
    form.reset();

  } catch (error) {
    mensaje.innerHTML = "❌ Error: " + error.message;
    console.error(error);
  }

});