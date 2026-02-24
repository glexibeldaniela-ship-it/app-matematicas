import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("registroForm");
const rolSelect = document.getElementById("rol");
const datosAcademicos = document.getElementById("datosAcademicos");

rolSelect.addEventListener("change", () => {
  if (rolSelect.value === "estudiante") {
    datosAcademicos.style.display = "block";
  } else {
    datosAcademicos.style.display = "none";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const primerNombre = document.getElementById("primerNombre").value;
  const segundoNombre = document.getElementById("segundoNombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const cedula = document.getElementById("cedula").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = rolSelect.value;
  const anio = document.getElementById("anio").value;
  const seccion = document.getElementById("seccion").value;

  if (!rol) {
    alert("Seleccione un tipo de usuario");
    return;
  }

  if (rol === "estudiante" && (!anio || !seccion)) {
    alert("Seleccione Año y Sección");
    return;
  }

  try {

    // 🔒 Verificar profesor único
    if (rol === "profesor") {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      let profesorExiste = false;

      querySnapshot.forEach((docSnap) => {
        if (docSnap.data().rol === "profesor") {
          profesorExiste = true;
        }
      });

      if (profesorExiste) {
        alert("Ya existe un profesor registrado");
        return;
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let datosUsuario = {
      primerNombre,
      segundoNombre,
      apellidos,
      cedula,
      email,
      rol
    };

    if (rol === "estudiante") {
      datosUsuario.anio = anio;
      datosUsuario.seccion = seccion;
    }

    await setDoc(doc(db, "usuarios", user.uid), datosUsuario);

    alert("Registro exitoso");

    if (rol === "estudiante") {
      window.location.href = "./estudiante/aula.html";
    } else {
      window.location.href = "./profesor/panel.html";
    }

  } catch (error) {
    alert("Error: " + error.message);
  }

});