// PSEUDOCODE FOR WEATHER APP
// 
// CITY SELECTOR
// I should have a search bar that allows me to search up a city to find the weather forecast
// Beneath the search bar I could have a search history of recently searched cities that is added to whenever a city is searched
//
// CURRENT WEATHER FORECAST
// I need to create a component that calls on the weather API and populates the element with the relevant information and print it on the screen
//
// 5 DAY FORECAST
// For the selected city, I'll also need to present the weather forecast for the following 5 days
// This follows a similar approach to getting the current weather forecast but I'm calling on different API data

function fetchWeatherData(city) {
    const apiKey = 'aa57fc75af5a470d19c3d65bd59460fa';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
            console.error('Error fetching weather data:', error);
            return null;
        });
}

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];


function updateSearchHistory() {
  $('#history').empty(); 

  for (let i = 0; i < Math.min(searchHistory.length, 5); i++) {
    const listItem = $('<a>')
      .addClass('list-group-item list-group-item-action')
      .attr('href', '#')
      .text(searchHistory[i])
      .on('click', function () {
        const cityName = $(this).text();
        $('#search-input').val(cityName);
        $('#search-form').submit();
      });

    $('#history').append(listItem);
  }

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

}

// Handle form submission
$('#search-form').submit(function (event) {
    event.preventDefault();
  
    const city = $('#search-input').val();
  
    if (city) {
      // Check if the location already exists in the search history
      const existingIndex = searchHistory.indexOf(city);
  
      if (existingIndex !== -1) {
        // If it exists, remove it from its current position
        searchHistory.splice(existingIndex, 1);
      }
  
      // Add the searched city to the beginning of the search history array
      searchHistory.unshift(city);
  
      // Keep only the latest 5 search history items
      if (searchHistory.length > 5) {
        searchHistory.pop();
      }
  
      // Update the search history list
      updateSearchHistory();
  
      fetchWeatherData(city)
        .then((data) => {
          if (data) {
            // Create elements to display weather information (as before)
            const weatherInfo = `
              <div class="list-group-item">
                <h4>${data.name}, ${data.sys.country}</h4>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
              </div>
            `;
  
            // Insert weather information into the #today section (as before)
            $('#today').html(weatherInfo);
          }
        });
    }
  });
  

updateSearchHistory();



