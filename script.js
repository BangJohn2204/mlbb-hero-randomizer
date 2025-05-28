let heroes = [];
let filtered = [];
const heroImg = document.getElementById("hero-img");
const heroName = document.getElementById("hero-name");
const heroRole = document.getElementById("hero-role");
const spinBtn = document.getElementById("spin-btn");
const roleFilter = document.getElementById("role-filter");
const loadingText = document.getElementById("loading-text");

// Ambil dan normalisasi data JSON
fetch("hero_mlbb_with_images.json")
  .then(response => response.json())
  .then(data => {
    heroes = data.map(hero => {
      let roles = Array.isArray(hero.role)
        ? hero.role
        : String(hero.role).split("/").map(r => r.trim());

      return {
        name: hero.name,
        img: hero.img,
        role: roles
      };
    });
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

spinBtn.onclick = () => {
  if (filtered.length === 0) {
    alert("Tidak ada hero dengan role ini!");
    return;
  }

  loadingText.style.display = "block";
  let spinCount = 0;
  const totalSpins = 25 + Math.floor(Math.random() * 10);

  const spinInterval = setInterval(() => {
    const randomHero = filtered[Math.floor(Math.random() * filtered.length)];
    heroImg.src = randomHero.img;
    heroName.textContent = `🎮 ${randomHero.name}`;
    heroRole.textContent = `Role: ${randomHero.role.join(", ")}`;

    spinCount++;
    if (spinCount >= totalSpins) {
      clearInterval(spinInterval);
      setTimeout(() => {
        loadingText.style.display = "none";
        setHero(randomHero); // terakhir ditampilkan dengan animasi
      }, 200);
    }
  }, 100);
};

roleFilter.onchange = filterHeroes;
