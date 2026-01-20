const zipForm = document.getElementById('zipForm');
const forecastContainer = document.getElementById('forecastContainer');
const forecastDay1 = document.getElementById('forecastDay1');
const forecastDay2 = document.getElementById('forecastDay2');
const forecastDay3 = document.getElementById('forecastDay3');
const refreshButton = document.getElementById('refreshButton');
const regionTitle = document.getElementById('regionTitle');
const currentDate = new Date();
const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
import cloudyIcon from '../img/cloudy.png';
import rainIcon from '../img/rain.png';
import snowIcon from '../img/snow.png';
import sunnyIcon from '../img/sunny.png';
import defaultIcon from '../img/default.png';

zipForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  resetForecast(); // Reset forecast elements before fetching new data
  const zipCode = document.getElementById('zipCode').value;

  try {
    const response = await fetch(`https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zipCode}`); //calls the first API using the zipcode
    if (!response.ok) {
      throw new Error('Failed the first call to the API Zipcode');
    }
    const geoData = await response.json();
    const { region, regionCode } = geoData;
    regionTitle.textContent = `WEATHER FORECAST FOR ${region.toUpperCase()} (${regionCode.toUpperCase()})`; // Update title with region and regionCode
    const { latitude, longitude } = geoData;
    const forecastResponse = await fetch(`https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${latitude}&longitude=${longitude}&date=${formattedDate}`); //calls the second API using the information we get from the first API
    if (!forecastResponse.ok) {
      throw new Error('Failed the second call for the forecast data');
    }
    const forecastData = await forecastResponse.json();
    renderForecast(forecastData);
    forecastContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

refreshButton.addEventListener('click', function() {
  resetForecast(); // Reset forecast elements
  document.getElementById('zipCode').value = ''; // Clear zip code input field
  regionTitle.textContent = 'WEATHER FORECAST'; // Reset title
});

// Function to reset forecast elements
function resetForecast() {
  forecastDay1.innerHTML = '';
  forecastDay2.innerHTML = '';
  forecastDay3.innerHTML = '';
  forecastContainer.style.display = 'none';
}

// Function to render the forecast here
function renderForecast(data) {
  const forecastData = data?.daily?.data?.slice(0, 3) || [];
  forecastData.forEach((day, index) => {
    const forecastElement = document.getElementById(`forecastDay${index + 1}`);
    if (forecastElement) {
      const date = new Date(day.time * 1000);
      const formattedDay = index === 0 ? 'Today:' : ['Sunday:', 'Monday:', 'Tuesday:', 'Wednesday:', 'Thursday:', 'Friday:', 'Saturday:'][date.getDay()];
      const dayName = (day.icon).charAt(0).toUpperCase() + (day.icon).slice(1);
      const iconImages = {
        cloudy: '../img/cloudy.png',
        rain: '../img/rain.png',
        snow: '../img/snow.png',
        sunny: '../img/sunny.png'
      };

      const iconUrl = iconImages[day.icon] ? iconImages[day.icon] : 'img/default.png'; // If there is no corresponding icon, use a default one
      const highTemperature = day.temperatureHigh ? day.temperatureHigh : 'N/A'; // If there is no high temperature, display "N/A"
      const lowTemperature = day.temperatureLow ? day.temperatureLow : 'N/A'; // If there is no low temperature, display "N/A"

      forecastElement.innerHTML = `
        <div class="day" style="background-color: lightblue; text-align: left; color:white; padding: 5px">${formattedDay}</div>
        <div>
          <div class="image" style="display: inline-block;" >
            <img src="${iconUrl}" alt="icon" class="icon">
          </div>
          <div class="details" style="width: 50%; display: inline-block; margin-right:5px;">
            <div class="summary">${dayName}</div>
            <div class="temperature">${highTemperature}/${lowTemperature}°F</div>
          </div>
        </div>
      `;
    }
  });
}
