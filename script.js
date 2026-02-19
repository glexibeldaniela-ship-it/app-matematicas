// Firebase
const db = window.firebaseDB;
const auth = window.firebaseAuth;


let currentUser = null;
let modoRegistro = false;

// --- FUNCIONES DE NAVEGACIÓN ---
function toggleAuth() {
    modoRegistro = !modoRegistro;
    document.getElementById('register-only').classList.toggle('hidden');
    document.getElementById('auth-title').innerText = modoRegistro ? "Crear Cuenta Estudiante" : "Iniciar Sesión";
}

document.getElementById('auth-form').onsubmit = async (e) => {
    .onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    // Login Profesor (Acceso Fijo)
    if (email === "profe@matematicas.com" && pass === "admin2024") {
        currentUser = { nombre: "Profesor Admin", role: "admin" };
        showView('admin-panel');
        cargarListaAlumnos();
        return;
    }

    if (modoRegistro) {

    const nombres = document.getElementById('reg-nombres').value;
    const apellidos = document.getElementById('reg-apellidos').value;
    const cedula = document.getElementById('reg-cedula').value;
    const grado = document.getElementById('reg-grado').value;
    const seccion = document.getElementById('reg-seccion').value;

    try {

        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        const user = userCredential.user;

        await db.collection("usuarios").doc(user.uid).set({
            nombres: nombres,
            apellidos: apellidos,
            cedula: cedula,
            grado: grado,
            seccion: seccion,
            email: email,
            role: "estudiante",
            examenesRealizados: []
        });

        alert("Registro exitoso 🎉");
        toggleAuth();

    } catch (error) {
        alert("Error: " + error.message);
    }
    }
        );

        alert("Registro exitoso 🎉");
        toggleAuth();

    } catch (error) {
        alert("Error: " + error.message);
    }
    }
    else {
        const user = db.usuarios.find(u => u.email === email && u.pass === pass);
        if (user) {
            currentUser = user;
            showView('student-panel');
            cargarDashboardEstudiante();
        } else {
            alert("Usuario no encontrado o datos incorrectos");
        }
    }
};

// --- LÓGICA DEL PROFESOR ---
function guardarExamen() {
    const examen = {
        id: Date.now(),
        titulo: document.getElementById('ex-nombre').value,
        tiempo: parseInt(document.getElementById('ex-tiempo').value),
        preguntas: [] // Aquí podrías añadir un prompt para preguntas
    };
    db.examenes.push(examen);
    saveDB();
    alert("Examen publicado.");
}

function cargarListaAlumnos() {
    const tbody = document.getElementById('lista-alumnos-body');
    tbody.innerHTML = "";
    db.usuarios.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.nombres} ${u.apellidos}</td>
                <td>${u.grado}° ${u.seccion}</td>
                <td>${u.notaFinal || 'S/N'}</td>
                <td><button onclick="resetearEstudiante(${u.id})">Resetear</button></td>
            </tr>
        `;
    });
}

// --- LÓGICA DEL ESTUDIANTE ---
function cargarDashboardEstudiante() {
    document.getElementById('student-welcome').innerText = `Hola, ${currentUser.nombres}`;
    const container = document.getElementById('available-exams');
    container.innerHTML = "";

    db.examenes.forEach(ex => {
        const yaHecho = currentUser.examenesRealizados.includes(ex.id);
        container.innerHTML += `
            <div class="card">
                <h5>${ex.titulo} (${ex.tiempo} min)</h5>
                <button onclick="iniciarExamen(${ex.id})" ${yaHecho ? 'disabled' : ''}>
                    ${yaHecho ? 'Realizado' : 'Comenzar Examen'}
                </button>
            </div>
        `;
    });
}

function iniciarExamen(id) {
    if (!confirm("¿Deseas comenzar? Una vez dentro no podrás salir.")) return;
    
    const ex = db.examenes.find(e => e.id === id);
    showView('active-exam-room');
    document.getElementById('current-exam-title').innerText = ex.titulo;
    
    // Marcar como iniciado para que no pueda volver a entrar
    currentUser.examenesRealizados.push(id);
    saveDB();

    // Lógica del Temporizador
    let segundos = ex.tiempo * 60;
    const timer = setInterval(() => {
        segundos--;
        let min = Math.floor(segundos / 60);
        let sec = segundos % 60;
        document.getElementById('timer-display').innerText = `Tiempo: ${min}:${sec < 10 ? '0'+sec : sec}`;
        
        if (segundos <= 0) {
            clearInterval(timer);
            finalizarExamen();
        }
    }, 1000);
}

// --- UTILIDADES ---
function saveDB() { localStorage.setItem('mathEduDB', JSON.stringify(db)); }

function showView(viewId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function logout() { location.reload(); }

function subirFoto(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('profile-img').src = reader.result;
        currentUser.foto = reader.result;
        saveDB();
    };
    reader.readAsDataURL(event.target.files[0]);
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Listado de Calificaciones - MathEdu", 10, 10);
    let y = 20;
    db.usuarios.forEach(u => {
        doc.text(`${u.nombres} ${u.apellidos} - Cédula: ${u.cedula} - Nota: ${u.notaFinal || '0'}`, 10, y);
        y += 10;
    });
    doc.save("Reporte_Notas.pdf");
                  }
                  
