const { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  updateDoc
} = window.fb;

const auth = window.auth;
const db = window.db;

let modoRegistro = false;

const ADMIN_EMAIL = "joseagustinfernandezpalmar@gmail.com";

function toggleAuth() {
  modoRegistro = !modoRegistro;
  document.getElementById('register-only').classList.toggle('hidden');
  document.getElementById('auth-title').innerText =
    modoRegistro ? "Crear Cuenta" : "Iniciar Sesión";
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (modoRegistro) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      let role = "estudiante";
      if (email === ADMIN_EMAIL) {
        role = "admin";
      }

      await setDoc(doc(db, "usuarios", uid), {
        nombres: document.getElementById('reg-nombres').value,
        apellidos: document.getElementById('reg-apellidos').value,
        cedula: document.getElementById('reg-cedula').value,
        grado: document.getElementById('reg-grado').value,
        seccion: document.getElementById('reg-seccion').value,
        role: role,
        bloqueado: false,
        examenesRealizados: []
      });

      alert("Registro exitoso");
      toggleAuth();

    } catch (error) {
      alert(error.message);
    }

  } else {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const snap = await getDoc(doc(db, "usuarios", uid));
      const data = snap.data();

      if (data.role === "admin") {
        showView("admin-panel");
      } else {
        document.getElementById("student-welcome").innerText =
          "Hola " + data.nombres;
        showView("student-panel");
      }

    } catch (error) {
      alert("Error al iniciar sesión");
    }
  }
});

function showView(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function logout() {
  location.reload();
}
window.toggleAuth = toggleAuth;
window.logout = logout;
window.showView = showView;
