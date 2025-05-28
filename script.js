let heroes = [];
let filtered = [];
const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const roleFilter = document.getElementById("role-filter");
const loadingText = document.getElementById("loading-text");

// Load hero data dari JSON
fetch("hero_mlbb_with_images.json")
  .then(response => response.json())
  .then(data => {
    heroes = data;
    filterHeroes(); // awal: tampilkan 1 hero dari semua
  });

// Tampilkan hero ke layar
function setHero(hero) {
  heroImg.src = hero.img;
  heroName.textContent = `🎮 ${hero.name}`;
  heroRole.textContent = `Role: ${hero.role.join(", ")}`;

  // Tambahkan animasi show
  heroImg.classList.add("show");
  heroName.classList.add("show");
  heroRole.classList.add("show");
}

// Filter hero berdasarkan role
function filterHeroes() {
  const selectedRole = roleFilter.value;
  filtered = selectedRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(selectedRole));

  if (filtered.length > 0) {
    setHero(filtered[Math.floor(Math.random() * filtered.length)]);
  } else {
    heroImg.src = "";
    heroName.textContent = "❌ Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

// Tombol SPIN ditekan
spinBtn.onclick = () => {
  if (filtered.length === 0) return;

  loadingText.style.display = "block";

  // Hapus animasi sebelumnya
  heroImg.classList.remove("show");
  heroName.classList.remove("show");
  heroRole.classList.remove("show");

  let interval = 100;     // kecepatan animasi hero berganti
  let spinTime = 2000;    // total durasi spin
  let spinInterval = setInterval(() => {
    const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
    heroImg.src = randomHero.img;
    heroName.textContent = `🎮 ${randomHero.name}`;
    heroRole.textContent = `Role: ${randomHero.role.join(", ")}`;
  }, interval);

  // Setelah selesai spin, tampilkan hero final dengan animasi
  setTimeout(() => {
    clearInterval(spinInterval);
    loadingText.style.display = "none";

    const finalHero = filtered[Math.floor(Math.random() * filtered.length)];
    setHero(finalHero); // tampilkan hero dengan animasi show
  }, spinTime);
};

// Saat filter role berubah
roleFilter.onchange = () => {
  filterHeroes();
};
