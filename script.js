let heroes = [];
let filtered = [];
let currentRole = "All";

const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const loadingText = document.getElementById("loading-text");
const roleButtons = document.querySelectorAll("#role-buttons button");

// Load audio
const spinSound = new Audio("spin.mp3");
const resultSound = new Audio("result.mp3");

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
    const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(randomHero);
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
  spinSound.currentTime = 0;
  spinSound.play();

  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  let spinDuration = 9000; // 9 detik
  let spinStart = Date.now();
  let spinInterval = 120;
  let spinTimer = setInterval(() => {
    if (Date.now() - spinStart >= spinDuration) {
      clearInterval(spinTimer);
      loadingText.style.display = "none";
      spinSound.pause();
      spinSound.currentTime = 0;

      const finalHero = filtered[Math.floor(Math.random() * filtered.length)];
      setHero(finalHero);
      resultSound.play();
    } else {
      const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
      setHero(randomHero);
    }
  }, spinInterval);
};
