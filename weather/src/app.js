const zipForm = document.getElementById('zipForm');
const forecastContainer = document.getElementById('forecastContainer');
const forecastDay1 = document.getElementById('forecastDay1');
const forecastDay2 = document.getElementById('forecastDay2');
const forecastDay3 = document.getElementById('forecastDay3');
const refreshButton = document.getElementById('refreshButton');
const regionTitle = document.getElementById('regionTitle');

const currentDate = new Date();
const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

const iconImages = {
  cloudy: './cloudy.png',
  rain: './rain.png',
  snow: './snow.png',
  sunny: './sunny.png'
};
const defaultIcon = './default.png';

zipForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  resetForecast();

  const zipCode = document.getElementById('zipCode').value;

  try {
    const geoRes = await fetch(`https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zipCode}`);
    if (!geoRes.ok) throw new Error('Error fetching geo data');
    const geoData = await geoRes.json();
    const { region, regionCode, latitude, longitude } = geoData;

    regionTitle.textContent = `WEATHER FORECAST FOR ${region.toUpperCase()} (${regionCode.toUpperCase()})`;

    const forecastRes = await fetch(`https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${latitude}&longitude=${longitude}&date=${formattedDate}`);
    if (!forecastRes.ok) throw new Error('Error fetching forecast data');
    const forecastData = await forecastRes.json();

    renderForecast(forecastData);
    forecastContainer.style.display = 'block';
  } catch (err) {
    console.error(err);
    alert('Error fetching weather data. Please check the zip code.');
  }
});

refreshButton.addEventListener('click', () => {
  resetForecast();
  document.getElementById('zipCode').value = '';
  regionTitle.textContent = 'WEATHER FORECAST';
});

function resetForecast() {
  forecastDay1.innerHTML = '';
  forecastDay2.innerHTML = '';
  forecastDay3.innerHTML = '';
  forecastContainer.style.display = 'none';
}

function renderForecast(data) {
  const forecastData = data?.daily?.data?.slice(0, 3) || [];

  forecastData.forEach((day, index) => {
    const forecastElement = document.getElementById(`forecastDay${index + 1}`);
    if (!forecastElement) return;

    const date = new Date(day.time * 1000);
    const dayName = index === 0
      ? 'Today'
      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];

    const iconUrl = iconImages[day.icon] || defaultIcon;
    const highTemp = day.temperatureHigh ?? 'N/A';
    const lowTemp = day.temperatureLow ?? 'N/A';

    forecastElement.innerHTML = `
      <div class="day" style="background-color: lightblue; color:white; padding: 5px">${dayName}:</div>
      <div style="display:flex; align-items:center;">
        <img src="${iconUrl}" alt="${day.icon}" class="icon" style="width:50px;height:50px;margin-right:10px;">
        <div>
          <div class="summary">${day.icon.charAt(0).toUpperCase() + day.icon.slice(1)}</div>
          <div class="temperature">${highTemp}/${lowTemp}°F</div>
        </div>
      </div>
    `;
  });
}
