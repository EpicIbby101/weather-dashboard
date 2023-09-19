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
  const apiKey = "aa57fc75af5a470d19c3d65bd59460fa";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      return null;
    });
}

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function updateSearchHistory() {
  $("#history").empty();

  for (let i = 0; i < Math.min(searchHistory.length, 5); i++) {
    const listItem = $("<a>")
      .addClass("list-group-item list-group-item-action")
      .attr("href", "#")
      .text(searchHistory[i])
      .on("click", function () {
        const cityName = $(this).text();
        $("#search-input").val(cityName);
        $("#search-form").submit();
      });

    $("#history").append(listItem);
  }

  if (searchHistory.length > 0) {
    $("#clear-history-button").show();
  } else {
    $("#clear-history-button").hide();
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

$("#search-form").submit(function (event) {
  event.preventDefault();

  const city = $("#search-input").val();

  if (city) {
    const existingIndex = searchHistory.indexOf(city);

    if (existingIndex !== -1) {
      searchHistory.splice(existingIndex, 1);
    }

    searchHistory.unshift(city);

    if (searchHistory.length > 5) {
      searchHistory.pop();
    }

    updateSearchHistory();

    fetchWeatherData(city).then((data) => {
      if (data) {
        const weatherInfo = `
              <div class="list-group-item">
                <h4>${data.name}, ${data.sys.country}</h4>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
              </div>
            `;

        $("#today").html(weatherInfo);
      }
    });
  }
});

updateSearchHistory();

function clearSearchHistory() {
  searchHistory = [];
  localStorage.removeItem("searchHistory");

  updateSearchHistory();
}

$("#clear-history-button").click(function () {
  if (confirm("Are you sure you want to clear the search history?")) {
    clearSearchHistory();
  }
});
