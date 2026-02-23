import { auth, db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const btnActivar = document.getElementById("btn-activar-examen");
const listaEstudiantes = document.getElementById("tabla-estudiantes"); // ID Corregido
const profeNombreText = document.getElementById("profe-nombre");
const btnLogout = document.getElementById("btn-logout");

// 1. Mostrar nombre del Profesor (José Fernández)
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Forzamos o usamos el nombre del registro
            profeNombreText.innerText = "Docente: José Fernández";
        }
    } else {
        window.location.href = "../index.html";
    }
});

// 2. Activar Evaluación
if (btnActivar) {
    btnActivar.addEventListener("click", async () => {
        const tema = document.getElementById("tema").value;
        const repaso = document.getElementById("repaso").value;
        const tiempo = document.getElementById("tiempo").value;

        if (!tema || !repaso || !tiempo) {
            alert("Por favor, rellene todos los campos.");
            return;
        }

        try {
            await addDoc(collection(db, "evaluaciones"), {
                titulo: tema,
                contenidoRepaso: repaso,
                tiempoMinutos: parseInt(tiempo),
                estado: "activo",
                fecha: serverTimestamp()
            });
            alert("✅ Evaluación activada.");
        } catch (e) { alert("Error al activar"); }
    });
}

// 3. Cargar y Calificar Estudiantes
if (listaEstudiantes) {
    const cargar = async () => {
        const q = query(collection(db, "usuarios"), where("rol", "==", "estudiante"));
        const snap = await getDocs(q);
        listaEstudiantes.innerHTML = "";
        snap.forEach((docUsuario) => {
            const u = docUsuario.data();
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${u.nombreCompleto}<br><small>${u.cedula}</small></td>
                <td><input type="number" id="l1-${u.uid}" value="${u.notaL1 || 0}" min="0" max="20"></td>
                <td><input type="number" id="l2-${u.uid}" value="${u.notaL2 || 0}" min="0" max="20"></td>
                <td><input type="number" id="l3-${u.uid}" value="${u.notaL3 || 0}" min="0" max="20"></td>
                <td><button class="btn-principal" style="padding:5px" data-id="${u.uid}">Guardar</button></td>
            `;
            listaEstudiantes.appendChild(fila);
            fila.querySelector("button").addEventListener("click", () => guardarNota(u.uid));
        });
    };
    cargar();
}

async function guardarNota(id) {
    const n1 = document.getElementById(`l1-${id}`).value;
    const n2 = document.getElementById(`l2-${id}`).value;
    const n3 = document.getElementById(`l3-${id}`).value;
    await updateDoc(doc(db, "usuarios", id), {
        notaL1: parseInt(n1), notaL2: parseInt(n2), notaL3: parseInt(n3)
    });
    alert("Nota guardada.");
}

if(btnLogout) {
    btnLogout.addEventListener("click", () => signOut(auth).then(() => window.location.href = "../index.html"));
}
