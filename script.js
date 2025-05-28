let heroes = [];
let filtered = [];
const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const roleFilter = document.getElementById("role-filter");
const loadingText = document.getElementById("loading-text");

// Ambil data hero dari file JSON
fetch("hero_mlbb_with_images.json")
  .then(response => response.json())
  .then(data => {
    // Normalisasi role agar semuanya jadi array
    heroes = data.map(hero => {
      let roles = [];

      if (Array.isArray(hero.role)) {
        roles = hero.role;
      } else if (typeof hero.role === "string") {
        roles = hero.role.split("/").map(r => r.trim());
      }

      return {
        name: hero.name,
        img: hero.img,
        role: roles
      };
    });

    filterHeroes(); // jalankan filter pertama kali
  });

// Menampilkan 1 hero
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

// Filter berdasarkan role
function filterHeroes() {
  const selectedRole = roleFilter.value;

  filtered = selectedRole === "All"
    ? heroes
    : heroes.filter(h => h.role.includes(selectedRole));

  if (filtered.length > 0) {
    setHero(filtered[0]);
  } else {
    heroImg.src = "";
    heroName.textContent = "Tidak ada hero dalam role ini";
    heroRole.textContent = "";
  }
}

// Spin hero secara acak
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

// Saat role berubah
roleFilter.onchange = filterHeroes;
