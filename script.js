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
}

function filterHeroes() {
  filtered = currentRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(currentRole));

  if (filtered.length > 0) {
    const firstHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(firstHero);
  } else {
    heroImg.src = "";
    heroName.textContent = "Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

function setRole(role) {
  currentRole = role;

  roleButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });

  filterHeroes();
}

spinBtn.onclick = () => {
  if (filtered.length === 0) return;

  loadingText.style.display = "block";

  let interval = 100;
  let spinTime = 2000;
  let counter = 0;

  const spinInterval = setInterval(() => {
    const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(randomHero);
    counter += interval;
  }, interval);

  setTimeout(() => {
    clearInterval(spinInterval);
    loadingText.style.display = "none";
    const finalHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(finalHero);
  }, spinTime);
};

roleButtons.forEach(button => {
  button.addEventListener("click", () => {
    setRole(button.dataset.role);
  });
});
