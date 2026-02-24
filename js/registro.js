import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("registroForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "usuarios", userCredential.user.uid), {
      nombre: nombre,
      email: email,
      rol: "estudiante"
    });

    alert("Usuario registrado correctamente");
    console.log("✅ Usuario creado y guardado en Firestore");

  } catch (error) {
    console.error("❌ Error:", error.message);
    alert(error.message);
  }
});