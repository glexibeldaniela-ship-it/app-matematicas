const { createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc, getDoc } = window.fb;
const auth = window.auth;
const db = window.db;

let modoRegistro = false;

function toggleAuth() {
  modoRegistro = !modoRegistro;
  document.getElementById('register-only').classList.toggle('hidden');
  document.getElementById('auth-title').innerText =
    modoRegistro ? "Crear cuenta" : "Iniciar sesión";
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (modoRegistro) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nombres: reg-nombres.value,
        apellidos: reg-apellidos.value,
        cedula: reg-cedula.value,
        grado: reg-grado.value,
        seccion: reg-seccion.value
      });

      alert("Registro exitoso");
      toggleAuth();
    } catch (e) {
      alert(e.message);
    }

  } else {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "usuarios", userCred.user.uid));
      document.getElementById("student-welcome").innerText =
        "Hola " + snap.data().nombres;
      show("student-panel");
    } catch (e) {
      alert("Error al iniciar sesión");
    }
  }
});

function show(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function logout() {
  location.reload();
}
