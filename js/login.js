// Dentro del éxito del login en login.js
const docRef = doc(db, "usuarios", user.uid);
const docSnap = await getDoc(docRef);
const rol = docSnap.data().rol;

if (rol === "admin") {
    window.location.href = "./administrador/dashboard.html";
} else if (rol === "profesor") {
    window.location.href = "./profesor/dashboard.html";
} else {
    window.location.href = "estudiante.html";
}
