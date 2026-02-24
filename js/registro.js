import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("registroForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const primerNombre = document.getElementById("primerNombre").value;
  const segundoNombre = document.getElementById("segundoNombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const cedula = document.getElementById("cedula").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  if (!rol) {
    alert("Seleccione un tipo de usuario");
    return;
  }

  try {

    // 🔒 Verificar si ya existe profesor
    if (rol === "profesor") {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      let profesorExiste = false;

      querySnapshot.forEach((doc) => {
        if (doc.data().rol === "profesor") {
          profesorExiste = true;
        }
      });

      if (profesorExiste) {
        alert("Ya existe un profesor registrado");
        return;
      }
    }

    // 🔥 Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 💾 Guardar en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      primerNombre,
      segundoNombre,
      apellidos,
      cedula,
      email,
      rol
    });

    alert("Registro exitoso");

    // 🚀 Redirección automática
    if (rol === "estudiante") {
      window.location.href = "./estudiante/aula.html";
    } else if (rol === "profesor") {
      window.location.href = "./profesor/panel.html";
    }

  } catch (error) {
    alert("Error: " + error.message);
  }

});