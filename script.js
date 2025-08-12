const apiKey = '1e9cd8209abab1efa4cbc8c260b94509';
let currentAudio = null;

// 🌍 Redirect from index.html to weather.html
function redirectToWeather() {
  const cityInput = document.getElementById('city-input');
  if (!cityInput) return;

  const city = cityInput.value.trim();
  if (city !== "") {
    window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
  }
}

// 🌗 Theme Toggle Setup (index.html only)
function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const dot = document.querySelector(".dot");

  if (!toggle || !dot) return;

  const isDark = localStorage.getItem("theme") === "dark";
  if (isDark) {
    toggle.checked = true;
    document.body.classList.add("bg-black", "text-white");
    document.body.classList.remove("bg-gradient-to-r", "from-pink-100", "to-blue-100");
    dot.classList.add("translate-x-8");
  }

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;

    document.body.classList.toggle("bg-black");
    document.body.classList.toggle("text-white");
    document.body.classList.toggle("bg-gradient-to-r");
    document.body.classList.toggle("from-pink-100");
    document.body.classList.toggle("to-blue-100");

    dot.classList.toggle("translate-x-8");

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// 🔊 Play Weather Sound
function playWeatherSound(weather) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  let soundSrc = '';
  if (weather.includes('rain')) soundSrc = 'sounds/rain.mp3';
  else if (weather.includes('clear')) soundSrc = 'sounds/sunny.mp3';
  else if (weather.includes('snow')) soundSrc = 'sounds/snow.mp3';

  if (!soundSrc) return;

  currentAudio = new Audio(soundSrc);
  currentAudio.loop = true;
  currentAudio.volume = 0.5;
  currentAudio.play().catch(err => console.warn('Autoplay blocked:', err));
}

const cityBackgrounds = {
  "Cape Town": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1575311373934-1b4d7b2f3f3c"
  ],
  "Johannesburg": [
    "https://images.unsplash.com/photo-1580656016211-7f9f3b6c3c3b",
    "https://images.unsplash.com/photo-1575311373934-1b4d7b2f3f3c"
  ],
  "Durban": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ],
  "Pretoria": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ],
  "Port Elizabeth": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ],
  "Soweto": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ],
  "East London": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ]
};

let fadeReady = true;

function rotateCityBackground() {
  const overlay = document.getElementById('background-overlay');
  const citySelect = document.getElementById('city-select');
  const selectedCity = citySelect?.value || 'Cape Town';
  const images = cityBackgrounds[selectedCity] || cityBackgrounds['Cape Town'];

  if (!overlay || !fadeReady || images.length === 0) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const newImage = images[randomIndex];

  fadeReady = false;
  overlay.style.transition = 'opacity 1s ease-in-out';
  overlay.style.opacity = 0;

  setTimeout(() => {
    overlay.style.backgroundImage = `url('${newImage}')`;
    overlay.style.opacity = 1;
    fadeReady = true;
  }, 1000); // Match transition duration
}

setInterval(rotateCityBackground, 3000);
document.addEventListener('DOMContentLoaded', rotateCityBackground);






document.addEventListener('click', () => {
  const sound = document.getElementById('weather-sound');
  if (sound) {
    sound.volume = 0.8;
    sound.play().catch(err => console.warn('Autoplay blocked:', err));
  }
}); 




// 🌦️ Fetch Weather from Input (index.html)
function getWeather() {
  const cityInput = document.getElementById('city-input');
  if (!cityInput) return;

  const city = cityInput.value.trim();
  if (!city) return alert('Please enter a city name.');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const name = data.name;
      const weather = data.weather[0].main.toLowerCase();
      const temp = Math.round(data.main.temp);

      const nameEl = document.getElementById('city-name');
      const descEl = document.getElementById('weather-description');
      const tempEl = document.getElementById('temperature');

      if (nameEl) nameEl.textContent = name;
      if (descEl) descEl.textContent = `Condition: ${weather}`;
      if (tempEl) tempEl.textContent = `Temperature: ${temp}°C`;

      updateBackground(weather);
      playWeatherSound(weather);
    })
    .catch(err => {
      console.error(err);
      alert('City not found or API error.');
    });
}

// 📓 Save Journal Entry
function saveJournal() {
  const journalEl = document.getElementById('journal');
  const descEl = document.getElementById('weather-description');
  if (!journalEl || !descEl) return;

  const entry = journalEl.value.trim();
  if (!entry) return alert('Please write something before saving.');

  const date = new Date().toLocaleDateString();
  const weather = descEl.textContent;
  const journalEntry = `${date} - ${weather}\n${entry}\n\n`;

  const existing = localStorage.getItem('weatherJournal') || '';
  localStorage.setItem('weatherJournal', journalEntry + existing);

  alert('Journal entry saved!');
  journalEl.value = '';
}

// 📅 Convert Date to Weekday Name
function getWeekdayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// 🌈 Emoji Mapper
function getWeatherEmoji(condition) {
  const map = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Snow: '❄️',
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Mist: '🌫️',
    Smoke: '💨',
    Haze: '🌁',
    Dust: '🌬️',
    Fog: '🌫️',
    Sand: '🏜️',
    Ash: '🌋',
    Squall: '🌪️',
    Tornado: '🌪️'
  };
  return map[condition] || '🌈';
}

// 🖼️ Update Background Based on Weather
function updateBackground(weather) {
  const body = document.body;
  if (!body) return;

  let image = 'images/default.jpg';
  if (weather.includes('rain')) image = 'images/rainy.jpg';
  else if (weather.includes('clear')) image = 'images/sunny.jpg';
  else if (weather.includes('snow')) image = 'images/snowy.jpg';

  body.style.backgroundImage = `url('${image}')`;
  body.classList.add('fade-bg');
  setTimeout(() => body.classList.remove('fade-bg'), 1000);
}

// 📅 Fetch Forecast
function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const forecastEl = document.getElementById('forecast');
      const days = {};

      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) days[date] = item;
      });

      forecastEl.innerHTML = '';
      Object.keys(days).slice(0, 5).forEach(date => {
        const item = days[date];
        const icon = item.weather[0].icon;
        const temp = Math.round(item.main.temp);
        const description = item.weather[0].description;
        const weekday = getWeekdayName(date);

        forecastEl.innerHTML += `
          <div class="bg-white bg-opacity-20 p-2 rounded-lg text-center">
            <p class="font-semibold">${weekday}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="mx-auto w-10 h-10" />
            <p>${description}</p>
            <p class="text-lg font-bold">${temp}°C</p>
          </div>
        `;
      });

      forecastEl.classList.remove('hidden');
    });
}

// 🧠 Load Saved City & Setup
window.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();

  const savedCity = localStorage.getItem('selectedCity');
  const citySelect = document.getElementById('city-select');
  if (savedCity && citySelect) {
    citySelect.value = savedCity;
    fetchWeather(savedCity);
  }

  const sound = document.getElementById('weather-sound');
  if (sound) {
    sound.volume = 0.5;
    sound.play().catch(err => console.warn('Autoplay blocked:', err));
  }

  const btn = document.getElementById('get-weather-btn');
  if (btn) {
    btn.addEventListener('click', redirectToWeather);
  }
});

// 🌦️ Fetch Weather for Select

// 🌦️ Fetch Weather for Select Dropdown (weather.html)
function fetchWeather(city) {
  localStorage.setItem('selectedCity', city);

  const loading = document.getElementById('loading');
  const info = document.getElementById('weather-info');
  const forecastEl = document.getElementById('forecast');
  const particles = document.getElementById('particles');

  if (loading) loading.classList.remove('hidden');
  if (info) info.classList.add('hidden');
  if (forecastEl) forecastEl.classList.add('hidden');
  if (particles) particles.innerHTML = '';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const emoji = getWeatherEmoji(data.weather[0].main);
      document.getElementById('weather-description').textContent = `${data.weather[0].description} ${emoji}`;

      const tempEl = document.getElementById('temperature');
      tempEl.textContent = `${Math.round(data.main.temp)}°C`;
      tempEl.classList.add('bounce');
      setTimeout(() => tempEl.classList.remove('bounce'), 600);

      const iconCode = data.weather[0].icon;
      document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      info.classList.remove('hidden');
      loading.classList.add('hidden');

      if (data.weather[0].main.toLowerCase().includes('rain')) createParticles('rain');
      if (data.weather[0].main.toLowerCase().includes('snow')) createParticles('snow');

      fetchForecast(city);
    })
    .catch(err => {
      console.error('Error fetching weather:', err);
      alert('Could not load weather data.');
      loading.classList.add('hidden');
    });
}



