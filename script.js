const apiUrl = 'https://restcountries.com/v3.1/all';
let countries = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
    document.getElementById('search').addEventListener('input', handleSearch);
    document.getElementById('show-more').addEventListener('click', showMore);
    document.getElementById('back-btn').addEventListener('click', () => window.history.back());
    renderFavorites();
});

async function fetchCountries() {
    try {
        const response = await fetch(apiUrl);
        countries = await response.json();
        renderCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function renderCountries(countries, startIndex = 0, pageSize = 10) {
    const countriesList = document.getElementById('countries-list');
    countriesList.innerHTML = '';

    const endIndex = Math.min(startIndex + pageSize, countries.length);
    for (let i = startIndex; i < endIndex; i++) {
        const country = countries[i];
        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `<img src="${country.flags.png}" alt="${country.name.common} flag" /><h3>${country.name.common}</h3>`;
        card.onclick = () => showCountryDetails(country);
        countriesList.appendChild(card);
    }

    document.getElementById('show-more').classList.toggle('hidden', endIndex >= countries.length);
}

function showMore() {
    const countriesList = document.getElementById('countries-list');
    const startIndex = countriesList.children.length;
    renderCountries(countries, startIndex);
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(query));
    renderCountries(filteredCountries);
    renderSuggestions(filteredCountries);
}

function renderSuggestions(countries) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    countries.slice(0, 5).forEach(country => {
        const suggestion = document.createElement('div');
        suggestion.innerText = country.name.common;
        suggestion.onclick = () => showCountryDetails(country);
        suggestions.appendChild(suggestion);
    });
}

function showCountryDetails(country) {
    localStorage.setItem('countryDetails', JSON.stringify(country));
    window.location.href = 'details.html';
}

function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
        document.getElementById('favorites-section').classList.add('hidden');
        return;
    }

    favorites.forEach(country => {
        const li = document.createElement('li');
        li.innerText = country.name.common;
        favoritesList.appendChild(li);
    });
    document.getElementById('favorites-section').classList.remove('hidden');
}

// Details page functionality
if (document.getElementById('country-name')) {
    const country = JSON.parse(localStorage.getItem('countryDetails'));
    document.getElementById('country-name').innerText = country.name.common;
    document.getElementById('country-details').innerHTML = `
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Area:</strong> ${country.area} km²</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
        <button id="favorite-btn">${favorites.some(fav => fav.name.common === country.name.common) ? 'Unfavorite' : 'Favorite'}</button>
    `;
    document.getElementById('favorite-btn').addEventListener('click', () => toggleFavorite(country));
}

function toggleFavorite(country) {
    const index = favorites.findIndex(fav => fav.name.common === country.name.common);
    if (index > -1) {
        favorites.splice(index, 1);
    } else if (favorites.length < 5) {
        favorites.push(country);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}
