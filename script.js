const heroImage = document.getElementById("hero-image");
const heroName = document.getElementById("hero-name");
const spinBtn = document.getElementById("spin-button");
const roleFilter = document.getElementById("role-filter");

let heroes = [];

// Ambil data dari JSON
fetch("hero_mlbb_with_images_cleaned.json")
  .then(res => res.json())
  .then(data => {
    heroes = data;
  });

function getFilteredHeroes(role) {
  if (role === "All") return heroes;

  return heroes.filter(hero => {
    if (Array.isArray(hero.role)) {
      // role dalam bentuk array
      return hero.role.includes(role);
    } else if (typeof hero.role === "string") {
      // role dalam bentuk string: "Fighter/Assassin"
      return hero.role.split("/").map(r => r.trim()).includes(role);
    }
    return false;
  });
}

spinBtn.addEventListener("click", () => {
  const selectedRole = roleFilter.value;
  const filtered = getFilteredHeroes(selectedRole);

  if (filtered.length === 0) {
    alert("Tidak ada hero dengan role tersebut.");
    return;
  }

  let index = 0;
  let totalSpin = 20 + Math.floor(Math.random() * 10);
  let spinSpeed = 80;

  const spinInterval = setInterval(() => {
    const hero = filtered[index % filtered.length];
    heroImage.src = hero.img;
    heroName.textContent = hero.name;
    index++;

    if (index >= totalSpin) {
      clearInterval(spinInterval);
    }
  }, spinSpeed);
});
