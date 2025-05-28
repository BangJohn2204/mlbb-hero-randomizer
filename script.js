let heroes = [];
let filtered = [];
let currentRole = "All";

const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const loadingText = document.getElementById("loading-text");

// Fetch file JSON
fetch("hero_mlbb_with_images.json")
  .then(res => res.json())
  .then(data => {
    heroes = data;
    filterHeroes();
  });

function setHero(hero) {
  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  setTimeout(() => {
    heroImg.src = hero.img;
    heroName.textContent = `🎮 ${hero.name}`;
    heroRole.textContent = `Role: ${hero.role.join(", ")}`;
    heroImg.classList.add("show");
    heroName.classList.add("show");
    heroRole.classList.add("show");
  }, 100);
}

function filterHeroes() {
  filtered = currentRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(currentRole));
  if (filtered.length > 0) {
    setHero(filtered[0]);
  } else {
    heroImg.src = "";
    heroName.textContent = "⚠️ Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

function setRole(role) {
  currentRole = role;

  // Atur tombol aktif
  const buttons = document.querySelectorAll("#role-buttons button");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });

  filterHeroes();
}

spinBtn.onclick = () => {
  if (filtered.length === 0) return;

  loadingText.style.display = "block";
  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  // Animasi bergantian
  let spinTime = 2000;
  let interval = 100;
  let spinInterval = setInterval(() => {
    const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
    heroImg.src = randomHero.img;
    heroName.textContent = `🎮 ${randomHero.name}`;
    heroRole.textContent = `Role: ${randomHero.role.join(", ")}`;
  }, interval);

  setTimeout(() => {
    clearInterval(spinInterval);
    loadingText.style.display = "none";
    const finalHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(finalHero);
  }, spinTime);
};
