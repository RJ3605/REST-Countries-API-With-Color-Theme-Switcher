import FetchWrapper from "./fetchwrapper.js";

const countriesList = document.querySelector(".countries-list");
const API = new FetchWrapper("https://restcountries.com/v3.1");
const page = document.querySelector(".page");
const detailsPage = document.querySelector(".country-details-page");
const region = document.querySelector(".region");
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.querySelector("#toggle-icon");
const searchInput = document.querySelector("#search");
const backButton = document.querySelector("#back-button");
let allData;

// Builds country card
function countryCard(countryData) {
  countriesList.insertAdjacentHTML(
    "beforeend",
    `<div class="country">
        <img src="${countryData.flags.png}" class="${countryData.cca3}"alt="${
      countryData.name.common
    } Flag">
        <div class="summary ${countryData.cca3}">
            <h2>${countryData.name.common}</h2>
            <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${countryData.region}</p>
            <p><strong>Capital:</strong> ${countryData.capital}</p>
        </div>
    </div>`
  );
}

// Finds the name of border countries
function findBorderCountryName(borderCountryCode) {
  allData.forEach((country) => {
    if (country.cca3 === borderCountryCode) {
      document.querySelector(`button#${borderCountryCode}`).innerText =
        country.name.common;
    }
  });
}

// Builds detailed country page
function buildDetailPage(countryData) {
  page.display = "none";
  detailsPage.innerHTML = "";
  detailsPage.insertAdjacentHTML(
    "beforeend",
    `<div id="image-div">
                    <img src="${countryData.flags.png}" alt="${
      countryData.name.official
    } Flag" class="details-flag ${countryData.cca3}">
                </div>
                <div class="country-details-page-subcontainer">
                <div class="country-details-page-sub-subcontainer">
                  <h2>${countryData.name.common}</h2>
                    <div class="country-details-page-list">
                        <p><strong>Official Name:</strong> ${
                          countryData.name.official
                        }</p>
                        <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
                        <p><strong>Region:</strong> ${countryData.region}</p>
                        <p><strong>Subregion:</strong> ${
                          countryData.subregion
                        }</p>
                        <p><strong>Capital:</strong> ${countryData.capital}</p>
                        <p><strong>Top Level Domain:</strong> ${
                          countryData.tld
                        }</p>
                        <p class="currencies"><strong>Currencies:</strong> </p>
                        <p class="languages"><strong>Languages:</strong> </p>
                    </div>
                    </div>
                    <div class="border-countries-container">
                        <p><strong>Border Countries:</strong></p>
                        <div class="border-countries">
                        </div>
                    </div>
                </div>
    `
  );
  const countryDetailsPageCurrencies = document.querySelector(".currencies");
  const countryDetailsPageLanguages = document.querySelector(".languages");
  const countryDetailsPageBorders = document.querySelector(".border-countries");

  // Populate currencies
  if (countryData.currencies) {
    const currencies = Object.values(countryData.currencies);

    currencies.forEach((currency, index) => {
      if (index === 0) {
        countryDetailsPageCurrencies.insertAdjacentHTML(
          "beforeend",
          `${currency.name}`
        );
      } else {
        countryDetailsPageCurrencies.insertAdjacentHTML(
          "beforeend",
          `, ${currency.name}`
        );
      }
    });
  } else {
    countryDetailsPageCurrencies.insertAdjacentHTML("beforeend", "None");
  }

  // Populate languages
  if (countryData.languages) {
    const languages = Object.values(countryData.languages);

    languages.forEach((language, index) => {
      if (index === 0) {
        countryDetailsPageLanguages.insertAdjacentHTML(
          "beforeend",
          `${language}`
        );
      } else {
        countryDetailsPageLanguages.insertAdjacentHTML(
          "beforeend",
          `, ${language}`
        );
      }
    });
  } else {
    countryDetailsPageLanguages.insertAdjacentHTML("beforeend", "None");
  }

  // Populate border countries
  if (countryData.borders) {
    const borderCountries = Object.values(countryData.borders);
    borderCountries.forEach((border) => {
      countryDetailsPageBorders.insertAdjacentHTML(
        "beforeend",
        `<button class="border-country" id="${border}">${border}</button>`
      );
      findBorderCountryName(border);
    });
  } else {
    countryDetailsPageBorders.insertAdjacentHTML(
      "beforeend",
      `<button class="border-country" id="none">None</button>`
    );
  }

  page.style.display = "none";
  backButton.style.display = "block";
  detailsPage.style.display = "flex";
}

// Border country button to recreate details page with border country information
document.body.addEventListener(
  "click",
  function (event) {
    if (event.target.className === "border-country") {
      allData.forEach((countryData) => {
        if (event.target.id === countryData.cca3) {
          buildDetailPage(countryData);
        }
      });
    }
  },
  false
);

//Get all data
const countriesAll = () =>
  API.get("/all").then((data) => {
    const allCountriesData = data;
    allData = data;
    allCountriesData.forEach((countryData) => {
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

// Region Filter functionality
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

// Search Bar functionality
searchInput.addEventListener("input", function (e) {
  let resultData = allData.filter(function (country) {
    let chosen = country.name.common.toLowerCase();
    let searchedCountryName = e.target.value.toLowerCase().trim();
    return chosen.includes(searchedCountryName);
  });
  countriesList.innerHTML = "";
  resultData.forEach((countryData) => {
    countryCard(countryData);
  });
});

// Build details page on click
document.body.addEventListener(
  "click",
  function (event) {
    if (
      event.target.parentElement.className === "country" ||
      event.target.parentElement.parentElement.className === "country"
    ) {
      console.log(event);
      allData.forEach((countryData) => {
        if (event.target.classList.contains(countryData.cca3)) {
          buildDetailPage(countryData);
        } else if (
          event.target.parentElement.classList.contains(countryData.cca3)
        ) {
          buildDetailPage(countryData);
        }
      });
    }
  },
  false
);

// Back button functionality
backButton.onclick = () => {
  detailsPage.style.display = "none";
  backButton.style.display = "none";
  detailsPage.innerHTML = "";
  page.style.display = "flex";
};

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
