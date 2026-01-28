// =============================
// CONFIG
// =============================
alert("JS CONNECTED");
console.log("SCRIPT LOADED");
const API = "http://127.0.0.1:5000";

// =============================
// ELEMENTS
// =============================

const signupCard = document.getElementById("signupCard");
const loginCard = document.getElementById("loginCard");
const profileCard = document.getElementById("profileCard");
const uploadCard = document.getElementById("uploadCard");
const videoGrid = document.getElementById("videoGrid");

const userEmail = document.getElementById("userEmail");

const sname = document.getElementById("sname");
const semail = document.getElementById("semail");
const spassword = document.getElementById("spassword");

const lemail = document.getElementById("lemail");
const lpassword = document.getElementById("lpassword");

const profileBox = document.getElementById("profileBox");

const videoTitle = document.getElementById("videoTitle");
const videoFile = document.getElementById("videoFile");

// =============================
// INIT
// =============================

checkAuth();

// =============================
// UI HELPERS
// =============================

function showProfileUI() {
  signupCard.classList.add("hidden");
  loginCard.classList.add("hidden");
  profileCard.classList.remove("hidden");
  uploadCard.classList.remove("hidden");
  videoGrid.classList.remove("hidden");
}

function showAuthUI() {
  signupCard.classList.remove("hidden");
  loginCard.classList.remove("hidden");
  profileCard.classList.add("hidden");
  uploadCard.classList.add("hidden");
  videoGrid.classList.add("hidden");
}

// =============================
// AUTH
// =============================

async function signup() {
  const name = sname.value;
  const email = semail.value;
  const password = spassword.value;

  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  alert(data.message || "Signup completed");
}

async function login() {
  const email = lemail.value;
  const password = lpassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    userEmail.textContent = email;
    showProfileUI();
    loadVideos();
  } else {
    alert("Login failed");
  }
}

function logout() {
  localStorage.removeItem("token");
  userEmail.textContent = "Guest";
  showAuthUI();
}

// =============================
// PROFILE
// =============================

async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  profileBox.textContent = JSON.stringify(data, null, 2);
}

// =============================
// VIDEOS
// =============================

async function uploadVideo() {
  const title = videoTitle.value;
  const file = videoFile.files[0];

  if (!title || !file) {
    alert("Please select title and video file");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("video", file);

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/auth/videos/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  await res.json();
  alert("Video uploaded!");

  videoTitle.value = "";
  videoFile.value = "";

  loadVideos();
}

async function loadVideos() {
  const res = await fetch(`${API}/videos`);
  const videos = await res.json();

  videoGrid.innerHTML = "bmw";

  videos.forEach((v) => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <video controls src="${v.url}"></video>
      <h4>${v.title}</h4>
    `;

    videoGrid.appendChild(card);
  });
}

// =============================
// CHECK LOGIN ON LOAD
// =============================

function checkAuth() {
  const token = localStorage.getItem("token");

  if (token) {
    showProfileUI();
    loadVideos();
  } else {
    showAuthUI();
  }
}