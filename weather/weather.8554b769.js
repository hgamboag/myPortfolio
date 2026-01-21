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
  cloudy: './cloudy.1d79b19c.png',
  rain: './rain.4075ccc0.png',
  snow: './snow.a7c89914.png',
  sunny: './sunny.ae415e12.png'
};
const defaultIcon = './default.1d79b19c.png';

zipForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  resetForecast();

  const zipCode = document.getElementById('zipCode').value;

  try {
    // First API
    const response = await fetch(`https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zipCode}`);
    if (!response.ok) throw new Error('Failed the first call to the API Zipcode');

    const geoData = await response.json();
    const { region, regionCode, latitude, longitude } = geoData;

    regionTitle.textContent = `WEATHER FORECAST FOR ${region.toUpperCase()} (${regionCode.toUpperCase()})`;

    // Second API: forecast
    const forecastResponse = await fetch(`https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${latitude}&longitude=${longitude}&date=${formattedDate}`);
    if (!forecastResponse.ok) throw new Error('Failed the second call for the forecast data');

    const forecastData = await forecastResponse.json();
    renderForecast(forecastData);

    forecastContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('There was an error fetching the weather data. Please check the zip code and try again.');
  }
});

refreshButton.addEventListener('click', function() {
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
    const formattedDay = index === 0
      ? 'Today:'
      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()] + ':';

    const dayName = day.icon.charAt(0).toUpperCase() + day.icon.slice(1);
    const iconUrl = iconImages[day.icon] || defaultIcon;
    const highTemperature = day.temperatureHigh ?? 'N/A';
    const lowTemperature = day.temperatureLow ?? 'N/A';

    forecastElement.innerHTML = `
      <div class="day" style="background-color: lightblue; text-align: left; color:white; padding: 5px">${formattedDay}</div>
      <div>
        <div class="image" style="display: inline-block;">
          <img src="${iconUrl}" alt="${day.icon} icon" class="icon">
        </div>
        <div class="details" style="width: 50%; display: inline-block; margin-right:5px;">
          <div class="summary">${dayName}</div>
          <div class="temperature">${highTemperature}/${lowTemperature}°F</div>
        </div>
      </div>
    `;
  });
}
