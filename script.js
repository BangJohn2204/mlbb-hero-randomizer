let heroes = [];
let filtered = [];
let currentRole = "All";

const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const loadingText = document.getElementById("loading-text");
const roleButtons = document.querySelectorAll("#role-buttons button");

fetch("hero_mlbb_with_images.json")
  .then(response => response.json())
  .then(data => {
    heroes = data;
    setRole("All"); // Inisialisasi awal
  });

// Tampilkan 1 hero
function setHero(hero) {
  heroImg.src = hero.img;
  heroName.textContent = `🎮 ${hero.name}`;
  heroRole.textContent = `Role: ${hero.role.join(", ")}`;
  
  // Efek muncul
  heroImg.classList.add("show");
  heroName.classList.add("show");
  heroRole.classList.add("show");
}

// Filter berdasarkan role
function filterHeroes() {
  filtered = currentRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(currentRole));

  if (filtered.length > 0) {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(random);
  } else {
    heroImg.src = "";
    heroName.textContent = "Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

// Pilih Role
function setRole(role) {
  currentRole = role;

  roleButtons.forEach(btn => {
    if (btn.textContent.includes(role) || (role === "All" && btn.textContent.includes("Semua"))) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  filterHeroes();
}

// Fungsi SPIN
spinBtn.onclick = () => {
  if (filtered.length === 0) return;

  loadingText.style.display = "block";
  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  let interval = 100;
  let spinTime = 2000;
  let counter = 0;

  const spinInterval = setInterval(() => {
    const tempHero = filtered[Math.floor(Math.random() * filtered.length)];
    heroImg.src = tempHero.img;
    heroName.textContent = `🎮 ${tempHero.name}`;
    heroRole.textContent = `Role: ${tempHero.role.join(", ")}`;
    counter += interval;
  }, interval);

  setTimeout(() => {
    clearInterval(spinInterval);
    loadingText.style.display = "none";
    const finalHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(finalHero);
  }, spinTime);
};
