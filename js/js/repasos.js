import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqSVoNR5y3kXb-Aihf1UwmvTwo1T0xm_8",
  authDomain: "mateedupro2026-897fa.firebaseapp.com",
  projectId: "mateedupro2026-897fa",
  storageBucket: "mateedupro2026-897fa.firebasestorage.app",
  messagingSenderId: "242144964491",
  appId: "1:242144964491:web:04eb900f523a91ef66498e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("formRepaso");
const lista = document.getElementById("listaRepasos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const anio = document.getElementById("anio").value;
  const contenido = document.getElementById("contenido").value;

  try {

    await addDoc(collection(db, "repasos"), {
      titulo: titulo,
      anio: anio,
      contenido: contenido,
      activo: true,
      creado: new Date()
    });

    alert("Repaso guardado correctamente");

    form.reset();
    cargarRepasos();

  } catch (error) {
    alert("Error al guardar");
  }

});

async function cargarRepasos() {
  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "repasos"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    lista.innerHTML += `
      <div style="background:white; color:black; padding:10px; margin:10px 0; border-radius:10px;">
        <strong>${data.titulo}</strong><br>
        Año: ${data.anio}
      </div>
    `;
  });
}

cargarRepasos();
