// ... (Aquí va tu código anterior de signInWithEmailAndPassword)

try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🕵️ BUSCAMOS EL ROL EN LA BASE DE DATOS
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const datos = docSnap.data();
        const rol = datos.rol; // Sacamos el rol: admin, profesor o estudiante

        console.log("Rol detectado:", rol);

        // 🚀 REPARTICIÓN DE USUARIOS (Rutas corregidas)
        if (rol === "admin") {
            // Si el index.html está afuera, y el dashboard en una carpeta:
            window.location.href = "administrador/dashboard.html"; 
        } else if (rol === "profesor") {
            window.location.href = "profesor/dashboard.html";
        } else {
            window.location.href = "estudiante.html";
        }

    } else {
        // Si el usuario existe en Auth pero no le creaste el documento en Firestore
        alert("Error: No se encontraron datos de perfil para este usuario.");
        console.error("No hay documento en la colección 'usuarios' con el UID:", user.uid);
    }

} catch (error) {
    console.error("Error en el login:", error.message);
    alert("Correo o contraseña incorrectos");
}
