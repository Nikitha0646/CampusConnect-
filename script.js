import { auth, db } from "./firebase.js";
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// 🔐 SIGNUP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      console.log(user);
      alert("Signup successful");
    })
    .catch((error) => {
      console.error(error);
      alert(error.message); // 👈 THIS WILL SHOW ERROR
    });
}


// 🔐 LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}


// ➕ ADD TASK
async function addTask() {
  const task = document.getElementById("task").value;

  await addDoc(collection(db, "assignments"), {
    text: task
  });

  alert("Saved!");
  loadTasks();
}


async function loadTasks() {
  const querySnapshot = await getDocs(collection(db, "assignments"));
  const list = document.getElementById("list");

  list.innerHTML = "";

  querySnapshot.forEach((item) => {
    const li = document.createElement("li");

    // Task text
    li.innerText = item.data().text + " ";

    // Create delete button
    const btn = document.createElement("button");
    btn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    // Delete function
    btn.onclick = async () => {
      await deleteDoc(doc(db, "assignments", item.id));
      loadTasks(); // refresh list
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}


// 🚪 LOGOUT
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}


// 🌐 MAKE FUNCTIONS GLOBAL
window.signup = signup;
window.login = login;
window.addTask = addTask;
window.logout = logout;


// 🔄 AUTO LOAD TASKS (only on dashboard)
if (window.location.pathname.includes("dashboard.html")) {
  loadTasks();
}