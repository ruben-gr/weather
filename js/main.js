let searchedCity 
let requestLink
let receivedData
let imageTag
let previouslist
let timeAndLocation
let weatherConditions

const townDiv = document.getElementById("town");
const timeDiv = document.getElementById("time");
const temperatureDiv = document.getElementById("temperature");
const weatherDescriptionDiv = document.getElementById("weatherDescription");
const weatherIconDiv = document.getElementById("weatherImage");
const searchInput = document.querySelector(".search-town");
const searchForm = document.querySelector(".search-form");
const searchButton = document.querySelector(".search-form-button");
const APP_URL = "http://api.apixu.com/v1/";
const API_KEY = "227551ccf5ee4d4c874103644190304";

searchInput.addEventListener("input", (e)=>{
    requestLink = `${APP_URL}search.json?key=${API_KEY}&q=${e.target.value}`
    getPossibleTownsNames(e.target.value);
})

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchedCity = searchInput.value
    requestLink = `${APP_URL}current.json?key=${API_KEY}&q=${searchedCity}`
    getWeatherInfo();
})

function getWeatherInfo() {
    const request = new XMLHttpRequest();
    request.open('GET', requestLink, true); // described the request
    request.onreadystatechange = function (event) {
        if (request.readyState === 4 && request.status === 200) {
            receivedData = JSON.parse(request.response);
            timeAndLocation = receivedData.location 
            weatherConditions = receivedData.current
            renderReceivedData(timeAndLocation, weatherConditions);
        }
    };
    request.send(); // sent request
}

function renderReceivedData(timeAndLocation, weatherConditions) {
    townDiv.innerHTML = timeAndLocation.name;
    timeDiv.innerHTML = timeAndLocation.localtime;
    temperatureDiv.innerHTML = "Temperature:  " + "<br>" + weatherConditions.temp_c + " °C";
    weatherDescriptionDiv.innerHTML = "<br>" + weatherConditions.condition.text;
    weatherIconDiv.innerHTML = "";
    imageTag = document.createElement("img");
    imageTag.setAttribute("src", "http:"+ weatherConditions.condition.icon);
    imageTag.setAttribute("alt", "weather icon");
    imageTag.setAttribute("height", "100px");
    weatherIconDiv.appendChild(imageTag);
}

function getPossibleTownsNames(inputtedTownNameLetters) {
    const request = new XMLHttpRequest();
    request.open('GET', requestLink, true);
    request.onreadystatechange = function (event) {
        if (request.readyState === 4 && request.status === 200) {
            receivedData = JSON.parse(request.response);
            if (receivedData[0] !== undefined) {
            renderPossibleTownsList(receivedData);
            }
        }
    };
    request.send();
}

function renderPossibleTownsList(receivedData) {
    removePreviousList()
    let listOfPossibleTowns = document.createElement("div")
    listOfPossibleTowns.setAttribute("class", "possible-town-list")
    searchForm.appendChild(listOfPossibleTowns)
    for (let i = 0; i < 5; i++) {
        let possibleTownDiv = document.createElement("div")
        listOfPossibleTowns.appendChild(possibleTownDiv)
        possibleTownDiv.innerHTML = receivedData[i].name
        possibleTownDiv.addEventListener("click", e => {
            requestLink = `${APP_URL}current.json?key=${API_KEY}&q=${e.target.innerHTML}`
            getWeatherInfo()
            removePreviousList()
        })
        possibleTownDiv.setAttribute("class", "possible-town")                 
    };
}

function removePreviousList () {
    previouslist = document.querySelector(".possible-town-list") 
    if (previouslist !== undefined && previouslist !== null) {
        searchForm.removeChild(previouslist)
    };
}