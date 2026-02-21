// Guardar estudiantes en memoria
let estudiantes = [];

// Cuando se envía el formulario
document.getElementById("formEstudiante").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const cedula = document.getElementById("cedula").value;
    const seccion = document.getElementById("seccion").value;
    const correo = document.getElementById("correo").value;

    const estudiante = {
        nombre,
        cedula,
        seccion,
        correo
    };

    estudiantes.push(estudiante);

    mostrarEstudiantes();

    document.getElementById("formEstudiante").reset();
});

function mostrarEstudiantes() {
    const tabla = document.querySelector("#tablaEstudiantes tbody");
    tabla.innerHTML = "";

    estudiantes.forEach(est => {
        tabla.innerHTML += `
            <tr>
                <td>${est.nombre}</td>
                <td>${est.cedula}</td>
                <td>${est.seccion}</td>
                <td>${est.correo}</td>
            </tr>
        `;
    });
}

function descargarPDF() {
    alert("El PDF lo activamos en el siguiente paso.");
}
