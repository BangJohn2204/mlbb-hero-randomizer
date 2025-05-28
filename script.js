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
    setRole("All");
  });

function filterHeroes() {
  filtered = currentRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(currentRole));
  
  // Jangan langsung panggil setHero di sini
}

function setRole(role) {
  currentRole = role;

  roleButtons.forEach(btn => {
    const match = btn.textContent.includes(role) || (role === "All" && btn.textContent.includes("Semua"));
    btn.classList.toggle("active", match);
  });

  filterHeroes();
  // Reset hero tampilan awal
  heroImg.src = "";
  heroName.textContent = "🎯 Klik SPIN untuk memilih hero!";
  heroRole.textContent = "";
}

// SPIN function
spinBtn.onclick = () => {
  if (filtered.length === 0) return;

  loadingText.style.display = "block";
  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  let interval = 100;
  let spinDuration = 2000;
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
    const finalHero = filtered[Math.floor(Math.random() * filtered.length)];

    // Delay sedikit untuk kasih waktu hero terakhir tampil
    setTimeout(() => {
      loadingText.style.display = "none";
      setHero(finalHero);
    }, 300);
  }, spinDuration);
};

function setHero(hero) {
  heroImg.src = hero.img;
  heroName.textContent = `🎮 ${hero.name}`;
  heroRole.textContent = `Role: ${hero.role.join(", ")}`;

  // Animasi masuk kembali
  setTimeout(() => {
    heroImg.classList.add("show");
    heroName.classList.add("show");
    heroRole.classList.add("show");
  }, 50);
}
