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
    filterHeroes();
  });

function setHero(hero) {
  heroImg.src = hero.img;
  heroName.textContent = `🎮 ${hero.name}`;
  heroRole.textContent = `Role: ${hero.role.join(", ")}`;
  heroImg.classList.add("show");
  heroName.classList.add("show");
  heroRole.classList.add("show");
}

function filterHeroes() {
  filtered = currentRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(currentRole));
  if (filtered.length > 0) {
    setHero(filtered[Math.floor(Math.random() * filtered.length)]);
  } else {
    heroImg.src = "";
    heroName.textContent = "Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

function setRole(role) {
  currentRole = role;

  // Highlight tombol aktif
  roleButtons.forEach(btn => {
    if (btn.textContent.includes(role) || (role === "All" && btn.textContent.includes("Semua"))) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  filterHeroes();
}

spinBtn.onclick = () => {
  if (filtered.length === 0) return;

  loadingText.style.display = "block";
  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  let interval = 100;
  let spinTime = 5000;
  let counter = 0;

  const spinInterval = setInterval(() => {
    const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
    heroImg.src = randomHero.img;
    heroName.textContent = `🎮 ${randomHero.name}`;
    heroRole.textContent = `Role: ${randomHero.role.join(", ")}`;
    counter += interval;
  }, interval);

  setTimeout(() => {
    clearInterval(spinInterval);
    loadingText.style.display = "none";
    const finalHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(finalHero);
  }, spinTime);
};
