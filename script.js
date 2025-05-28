
let heroes = [];
let filtered = [];
const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const roleFilter = document.getElementById("role-filter");
const loadingText = document.getElementById("loading-text");

fetch("hero_mlbb_with_images.json")
  .then(response => response.json())
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
  }, 200);
}

function filterHeroes() {
  const selectedRole = roleFilter.value;
  filtered = selectedRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(selectedRole));
  if (filtered.length > 0) setHero(filtered[0]);
  else {
    heroImg.src = "";
    heroName.textContent = "Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

spinBtn.onclick = () => {
  if (filtered.length > 0) {
    loadingText.style.display = "block";
    heroImg.classList.remove("show");
    heroName.classList.remove("show");
    heroRole.classList.remove("show");

    setTimeout(() => {
      loadingText.style.display = "none";
      const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
      setHero(randomHero);
    }, 2000);
  }
};

roleFilter.onchange = filterHeroes;
