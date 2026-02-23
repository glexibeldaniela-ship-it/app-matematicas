// ✅ 1. IMPORTACIONES: Agregamos 'collection' y 'getDocs' para poder leer la lista de usuarios
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ 2. EL GUARDIÁN: Verifica quién entra a MateEduPro2026
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  // Seguridad pura: Si no es admin, lo mandamos de vuelta
  if (!docSnap.exists() || docSnap.data().rol !== "admin") {
    alert("Acceso denegado: No tienes permisos de administrador.");
    window.location.href = "../index.html";
    return;
  }

  const datos = docSnap.data();
  console.log("Administrador autenticado:", datos.nombre);

  // Ponemos el nombre del jefe en el saludo si el elemento existe
  const saludo = document.getElementById("nombreAdmin");
  if(saludo) saludo.innerText = "Bienvenido, " + datos.nombre;

  // 🚀 LANZAMIENTO: Una vez que confirmamos que es admin, cargamos la lista
  mostrarUsuarios();
});

// ✅ 3. LA MÁQUINA DE DATOS: Función para traer a toda la gente de la base de datos
async function mostrarUsuarios() {
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const tabla = document.getElementById("cuerpoTabla");

    // Si no conseguimos la tabla en el HTML, frenamos para no dar error
    if (!tabla) return; 

    tabla.innerHTML = ""; // Limpiamos la tabla antes de meter datos nuevos

    querySnapshot.forEach((doc) => {
      const persona = doc.data();
      
      // Creamos la fila (tr) con los datos de cada persona
      const fila = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${persona.nombre}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${persona.correo}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;">
              ${persona.rol}
            </span>
          </td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error al cargar la lista de usuarios:", error);
  }
}

// ✅ 4. SALIDA DE EMERGENCIA: Cerrar sesión
const btnCerrar = document.getElementById("btnCerrarSesion");
if(btnCerrar) {
    btnCerrar.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "../index.html";
    });
}
