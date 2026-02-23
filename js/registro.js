<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Registro - MateEduPro</title>
    <style>
        body { font-family: sans-serif; background-color: #f0f2f5; padding: 15px; margin: 0; }
        .contenedor { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 400px; margin: auto; }
        h2 { text-align: center; color: #1a73e8; }
        input, select { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px; } /* Tamaño de letra cómodo para móvil */
        button { width: 100%; background-color: #1a73e8; color: white; padding: 14px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 10px; }
        .grupo { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        label { font-size: 14px; font-weight: bold; color: #555; }
    </style>
</head>
<body>

<div class="contenedor">
    <h2>Crear Cuenta</h2>
    <form id="form-registro">
        <div class="grupo">
            <label>Datos Personales</label>
            <input type="text" id="cedula" placeholder="Cédula de Identidad" required>
            <input type="text" id="nombre1" placeholder="Primer Nombre" required>
            <input type="text" id="nombre2" placeholder="Segundo Nombre">
            <input type="text" id="apellido1" placeholder="Primer Apellido" required>
            <input type="text" id="apellido2" placeholder="Segundo Apellido" required>
        </div>

        <div class="grupo">
            <label>Rol y Ubicación</label>
            <select id="tipo-usuario" onchange="cambiarVista()">
                <option value="estudiante">Soy Estudiante</option>
                <option value="profesor">Soy Profesor</option>
            </select>
            
            <div id="seccion-estudiante">
                <select id="año">
                    <option value="1">1er Año</option>
                    <option value="2">2do Año</option>
                    <option value="3">3er Año</option>
                </select>
                <select id="seccion">
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                </select>
            </div>
        </div>

        <div class="grupo">
            <label>Seguridad</label>
            <input type="email" id="email" placeholder="Correo electrónico" required>
            <input type="password" id="password" placeholder="Contraseña (mínimo 6 caracteres)" required>
        </div>

        <button type="submit">Registrarme</button>
    </form>
</div>

<script>
    // Función para ocultar Año/Sección si es Profesor
    function cambiarVista() {
        const rol = document.getElementById('tipo-usuario').value;
        const divEstudiante = document.getElementById('seccion-estudiante');
        divEstudiante.style.display = (rol === 'estudiante') ? 'block' : 'none';
    }
</script>
<script type="module" src="js/registro.js"></script>

</body>
</html>
