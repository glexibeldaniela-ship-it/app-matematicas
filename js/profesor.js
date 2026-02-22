import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    window.location.href = "../index.html";
    return;
  }

  const datos = docSnap.data();

  if (datos.rol !== "profesor") {
    window.location.href = "../index.html";
    return;
  }

});

document.getElementById("logout").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../index.html";
});