const searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
    event.preventDefault();
    const city = document.querySelector('#search-input').value;
    if (!city) {
        console.error('You need a search input value!');
        return;
    }
    const queryString = './index.html?q=' + city;
    saveCity(event);
    createDashbord(city);
}


searchFormEl.addEventListener('submit', handleSearchFormSubmit);


let ApiKey = "7fc9d77b14850aa63687bceb59bba5b6";
const currentWeather = $("#current");
const forecastWeather = $("#forecast-content");


function createCurrent(response) {
    const city = response.city.name;
    const now = dayjs().format('ddd, MMM D, YYYY');
    const icon = response.list[0].weather[0].icon;
    const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    const temp = Math.floor(response.list[0].main.temp - 273.15);
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;

    $("#current").append(`
    <h2>${city} <img src="${iconURL}"></img></h2>
    <h3>${now}</h3>
    <p>Temp: ${temp} °C</p>
    <p>Wind: ${windSpeed} mph</p>
    <p>Humidity: ${humidity} %</p>
  `);
}

function createForecast(response) {
    $("#forecast-title").append("Weather for next five days:");
    // Iteration throuth API responce, to take correct data for each day
    for (var i = 7; i < response.list.length; i += 8) {
        const date = dayjs().add(i / 8, 'day').format('ddd, MMM D');
        const forecastIcon = response.list[i].weather[0].icon;
        const forecastIconURL = "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
        const forecastTemp = Math.floor(response.list[i].main.temp - 273.15);
        const forecastWind = response.list[i].wind.speed;
        const forecastHumidity = response.list[i].main.humidity;
        forecastWeather.append(
            ` <div class="col-sm-2 forecastfuture">
                    <h3>${date}</h3>
                    <img src="${forecastIconURL}"></img>
                    <p>Temp: ${forecastTemp} °C</p>
                    <p>Wind: ${forecastWind} mph</p>
                    <p>Humidity: ${forecastHumidity} %</p>
                </div>`);
    }
}


function createDashbord(city) {
    currentWeather.empty();
    $("#forecast-title").empty();
    forecastWeather.empty();

    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + ApiKey;
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        createCurrent(response);
        createForecast(response);
    })
}

function saveCity(event) {
    const city = $("#search-input").val();
    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];

    if (!savedCities.includes(city)) {
        savedCities.push(city)
    }

    localStorage.setItem("cities", JSON.stringify(savedCities))


    showCity()

}

function showCity() {
    const historySection = $("#history");

    historySection.empty()

    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];

    for (const city of savedCities) {
        historySection.append(`<button class="btnHistory displayflex flexcolumn" onclick="createDashbord('${city}')">${city}</button>`)
    }
}

$("#clear-history").on("click", function () {
    localStorage.clear();
})

showCity()