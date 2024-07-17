import FetchWrapper from "./fetchwrapper.js";

const countriesList = document.querySelector(".countries-list");
const API = new FetchWrapper("https://restcountries.com/v3.1");
const page = document.querySelector(".page");
const countries = document.querySelectorAll(".country");
const region = document.querySelector(".region");
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.querySelector("#toggle-icon");
const searchInput = document.querySelector("#search");
let allData;

/*Built country card*/
function countryCard(countryData) {
  countriesList.insertAdjacentHTML(
    "beforeend",
    `<div class="country">
        <img src="${countryData.flags.png}" alt="${
      countryData.name.official
    } Flag">
        <div class="details">
            <h2>${countryData.name.official}</h2>
            <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${countryData.region}</p>
            <p><strong>Capital:</strong> ${countryData.capital}</p>
        </div>
    </div>`
  );
}

/*Get all data */
const countriesAll = () =>
  API.get("/all").then((data) => {
    const countriesData = data;
    allData = data;
    countriesData.forEach((countryData) => {
      countryCard(countryData);
    });
  });

countriesAll();

// Get Region Data
const countriesByRegion = (currentRegion) =>
  API.get("/region/" + currentRegion).then((data) => {
    const countriesData = data;
    allData = data;
    countriesData.forEach((countryData) => {
      countryCard(countryData);
    });
  });

// Region Filter
function filterByRegion(selectedRegion) {
  selectedRegion = region.value;
  if (selectedRegion !== "") {
    countriesList.innerHTML = "";
    countriesByRegion(selectedRegion);
  } else {
    countriesList.innerHTML = "";
    countriesAll();
  }
}

region.addEventListener("change", function () {
  filterByRegion();
});

// Search Bar
searchInput.addEventListener("input", function (e) {
  let resultData = allData.filter(function (country) {
    let chosen = country.name.common.toLowerCase();
    let searchCountryName = e.target.value.toLowerCase();
    ;
    return chosen.includes(searchCountryName.trim());
  });
  countriesList.innerHTML = "";
  console.log(resultData);
  resultData.forEach((countryData) => {
    countryCard(countryData);
  });
});

/* Create a function that loads a page for each country when their summary is clicked. */

// Dark Mode
function toggleDarkLightMode(isLight) {
  toggleIcon.children[0].textContent = isLight ? "Light Mode" : "Dark Mode";
  isLight
    ? toggleIcon.children[1].classList.replace("fa-moon", "fa-sun")
    : toggleIcon.children[1].classList.replace("fa-sun", "fa-moon");
}

// Switch Theme Dynamically
function switchTheme(event) {
  if (event.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    toggleDarkLightMode(false);
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    toggleDarkLightMode(true);
  }
}

// Theme Event Listener
toggleSwitch.addEventListener("change", switchTheme);

// Check local storage for theme
const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
    toggleDarkLightMode();
  }
}
