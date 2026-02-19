const auth = window.firebaseAuth;
const db = window.firebaseDB;
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc
} = window.fbFunctions;

let modoRegistro = false;
let currentUser = null;

// Cambiar entre login y registro
function toggleAuth() {
  modoRegistro = !modoRegistro;
  document.getElementById('register-only').classList.toggle('hidden');
  document.getElementById('auth-title').innerText =
    modoRegistro ? "Crear Cuenta Estudiante" : "Iniciar Sesión";
}

// Manejo del formulario
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  // LOGIN PROFESOR FIJO
  if (email === "profe@matematicas.com" && pass === "admin2024") {
    showView('admin-panel');
    return;
  }

  // REGISTRO
  if (modoRegistro) {

    const nombres = document.getElementById('reg-nombres').value;
    const apellidos = document.getElementById('reg-apellidos').value;
    const cedula = document.getElementById('reg-cedula').value;
    const grado = document.getElementById('reg-grado').value;
    const seccion = document.getElementById('reg-seccion').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombres,
        apellidos,
        cedula,
        grado,
        seccion,
        email,
        role: "estudiante"
      });

      alert("Registro exitoso 🎉");
      toggleAuth();

    } catch (error) {
      alert("Error: " + error.message);
    }

  } else {

    // LOGIN ESTUDIANTE
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      const docSnap = await getDoc(doc(db, "usuarios", user.uid));

      if (docSnap.exists()) {
        currentUser = docSnap.data();
        showView('student-panel');
        document.getElementById('student-welcome').innerText =
          "Hola, " + currentUser.nombres;
      } else {
        alert("No se encontraron datos del usuario.");
      }

    } catch (error) {
      alert("Correo o contraseña incorrectos");
    }

  }
});

// Mostrar panel
function showView(viewId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(viewId).classList.remove('hidden');
}

// Cerrar sesión
function logout() {
  location.reload();
}                  
