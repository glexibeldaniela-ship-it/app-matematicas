import { db, auth } from "./firebase-config.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btnSend = document.getElementById("btn-send");
const msgInput = document.getElementById("msg-input");
const chatBox = document.getElementById("chat-box");

// Cargar mensajes en tiempo real
const q = query(collection(db, "mensajes"), orderBy("fecha", "asc"));
onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        chatBox.innerHTML += `<p><strong>${data.usuario}:</strong> ${data.texto}</p>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});

btnSend.addEventListener("click", async () => {
    if (msgInput.value.trim() !== "") {
        await addDoc(collection(db, "mensajes"), {
            usuario: auth.currentUser.email,
            texto: msgInput.value,
            fecha: serverTimestamp()
        });
        msgInput.value = "";
    }
});
