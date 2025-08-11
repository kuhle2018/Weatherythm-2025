const apiKey = '1e9cd8209abab1efa4cbc8c260b94509';
let currentAudio = null;

function getWeather() {
  const city = document.getElementById('city-input').value;
  if (!city) return alert('Please enter a city name.');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const name = data.name;
      const weather = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;

      document.getElementById('city-name').textContent = name;
      document.getElementById('weather-description').textContent = `Condition: ${weather}`;
      document.getElementById('temperature').textContent = `Temperature: ${temp}°C`;

      updateBackground(weather);
      playWeatherSound(weather);
    })
    .catch(err => {
      console.error(err);
      alert('City not found or API error.');
    });
}

function updateBackground(weather) {
  const body = document.body;
  if (weather.includes('rain')) {
    body.style.backgroundImage = "url('images/rainy.jpg')";
  } else if (weather.includes('clear')) {
    body.style.backgroundImage = "url('images/sunny.jpg')";
  } else if (weather.includes('snow')) {
    body.style.backgroundImage = "url('images/snowy.jpg')";
  } else {
    body.style.backgroundImage = "url('images/default.jpg')";
  }
}

function playWeatherSound(weather) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio();
  if (weather.includes('rain')) {
    currentAudio.src = 'sounds/rain.mp3';
  } else if (weather.includes('clear')) {
    currentAudio.src = 'sounds/sunny.mp3';
  } else if (weather.includes('snow')) {
    currentAudio.src = 'sounds/snow.mp3';
  } else {
    return;
  }

  currentAudio.loop = true;
  currentAudio.play();
}

function saveJournal() {
  const entry = document.getElementById('journal').value;
  const date = new Date().toLocaleDateString();
  const weather = document.getElementById('weather-description').textContent;
  const journalEntry = `${date} - ${weather}\n${entry}\n\n`;

  const existing = localStorage.getItem('weatherJournal') || '';
  localStorage.setItem('weatherJournal', journalEntry + existing);
  alert('Journal entry saved!');
  document.getElementById('journal').value = '';
}

