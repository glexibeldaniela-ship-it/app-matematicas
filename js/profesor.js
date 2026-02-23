import { auth, db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Elementos de la interfaz (Asegúrate de que los IDs coincidan en panel.html y evaluar.html)
const btnActivar = document.getElementById("btn-activar-examen");
const listaEstudiantes = document.getElementById("lista-calificar");

// 1. FUNCIÓN PARA CREAR EVALUACIÓN CON TEMPORIZADOR Y REPASO
if (btnActivar) {
    btnActivar.addEventListener("click", async () => {
        const tema = document.getElementById("tema").value;
        const repaso = document.getElementById("repaso").value;
        const tiempo = document.getElementById("tiempo").value;

        if (!tema || !repaso || !tiempo) {
            alert("Por favor, rellene todos los campos de la evaluación.");
            return;
        }

        try {
            await addDoc(collection(db, "evaluaciones"), {
                titulo: tema,
                contenidoRepaso: repaso,
                tiempoMinutos: parseInt(tiempo),
                creadoPor: auth.currentUser.uid,
                fecha: serverTimestamp(),
                estado: "activo"
            });
            alert("✅ Evaluación activada con éxito. Los alumnos ya pueden verla.");
            // Limpiar campos
            document.getElementById("tema").value = "";
            document.getElementById("repaso").value = "";
            document.getElementById("tiempo").value = "";
        } catch (error) {
            console.error("Error al crear evaluación:", error);
            alert("Hubo un error al guardar.");
        }
    });
}

// 2. FUNCIÓN PARA CARGAR ESTUDIANTES Y CALIFICAR (1 al 20)
if (listaEstudiantes) {
    const cargarEstudiantes = async () => {
        const q = query(collection(db, "usuarios"), where("rol", "==", "estudiante"));
        const querySnapshot = await getDocs(q);
        
        listaEstudiantes.innerHTML = "";
        querySnapshot.forEach((docUsuario) => {
            const user = docUsuario.data();
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${user.nombreCompleto}<br><small>${user.cedula}</small></td>
                <td><input type="number" id="l1-${user.uid}" value="${user.notaL1 || 0}" min="0" max="20" style="width:50px"></td>
                <td><input type="number" id="l2-${user.uid}" value="${user.notaL2 || 0}" min="0" max="20" style="width:50px"></td>
                <td><input type="number" id="l3-${user.uid}" value="${user.notaL3 || 0}" min="0" max="20" style="width:50px"></td>
                <td><button class="btn-principal" data-id="${user.uid}" style="padding:5px 10px; font-size:12px">Guardar</button></td>
            `;
            listaEstudiantes.appendChild(fila);

            // Evento para el botón guardar de cada fila
            fila.querySelector("button").addEventListener("click", () => {
                guardarNota(user.uid);
            });
        });
    };
    cargarEstudiantes();
}

// 3. FUNCIÓN PARA ACTUALIZAR NOTAS EN FIREBASE
async function guardarNota(userId) {
    const n1 = document.getElementById(`l1-${userId}`).value;
    const n2 = document.getElementById(`l2-${userId}`).value;
    const n3 = document.getElementById(`l3-${userId}`).value;

    if (n1 > 20 || n2 > 20 || n3 > 20) {
        alert("⚠️ La nota máxima es 20.");
        return;
    }

    try {
        const userRef = doc(db, "usuarios", userId);
        await updateDoc(userRef, {
            notaL1: parseInt(n1),
            notaL2: parseInt(n2),
            notaL3: parseInt(n3)
        });
        alert("⭐ Notas actualizadas correctamente.");
    } catch (error) {
        alert("Error al actualizar notas.");
    }
}
