let searchedCity 
let daysNumber
let requestLink
let receivedData
let previouslist
let weatherConditions

const townDiv = document.getElementById("town");
const searchInput = document.querySelector(".search-town");
const daysInput = document.querySelector(".number-of-days")
const searchForm = document.querySelector(".search-form");
const searchButton = document.querySelector(".search-form-button");
const resultTable = document.querySelector(".result");

searchInput.addEventListener("input", (e)=>{               
    requestLink = `http://api.apixu.com/v1/search.json?key=227551ccf5ee4d4c874103644190304&q=${e.target.value}`
    renderPossibleTowns(e.target.value);
})

searchForm.addEventListener("submit", (e) => {          
    e.preventDefault();
    searchedCity = searchInput.value
    daysNumber = +daysInput.value
    requestLink = `http://api.apixu.com/v1/forecast.json?key=227551ccf5ee4d4c874103644190304&q=${searchedCity}&days=${daysNumber}`
    getWeatherInfo();
})

function getWeatherInfo() {
    const request = new XMLHttpRequest();

    request.open('GET', requestLink);
    request.onreadystatechange = function (event) {
        if (request.readyState === 4 && request.status === 200) {
            
            receivedData = JSON.parse(request.response);
            weatherConditions = receivedData.forecast.forecastday
            
            
            renderReceivedData(searchedCity, weatherConditions);
        }
    };
    request.send();
}

function renderReceivedData(searchedCity, weatherConditions) {
    townDiv.innerHTML = searchedCity;
    resultTable.innerHTML = ""

    for (let i of weatherConditions) {
        let foundDayBox = document.createElement("div")
        foundDayBox.setAttribute("class", "foundDayInfo")
        resultTable.appendChild(foundDayBox)

        let dateDiv = document.createElement("div")
        let date = new Date(i.date)
        date = String(date).substring(4, 10)
        date = date.substring(4) + " " + date.substring(0, 3)     
        dateDiv.innerHTML = date 
        dateDiv.setAttribute("class", "dayInfoInnerDiv")
        foundDayBox.appendChild(dateDiv)

        let temp = document.createElement("div")
        temp.innerHTML = `${i.day.avgtemp_c}°C`
        temp.setAttribute("class", "dayInfoInnerDiv")
        temp.setAttribute("id", "temperature")
        foundDayBox.appendChild(temp)

        let imgDiv = document.createElement("div")
        imgDiv.setAttribute("class", "dayInfoInnerDiv")
        foundDayBox.appendChild(imgDiv)

        let weathImg = document.createElement("img")
        weathImg.setAttribute("src", `http:${i.day.condition.icon}`)
        weathImg.setAttribute("alt", `weather image`)
        weathImg.setAttribute("height", `100px`)
        imgDiv.appendChild(weathImg)
         
        let weathDescript = document.createElement("div")
        weathDescript.innerHTML = i.day.condition.text
        weathDescript.setAttribute("class", "dayInfoInnerDiv")
        weathDescript.setAttribute("id", "weatherDescription")    
        foundDayBox.appendChild(weathDescript)        
    }
}

function renderPossibleTowns(inputtedTownNameLetters) {
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

    let possibleTownNames = []
    for (let i = 0; i < 5; i++) {
        possibleTownNames.push(receivedData[i].name);

    };


    let possibleTownNamesList = document.createElement("datalist")
    possibleTownNamesList.setAttribute("id", "cityname")
    for (let name of possibleTownNames) {
        let option = document.createElement("option");
        option.setAttribute("value", name);
        possibleTownNamesList.appendChild(option);
    }
    searchForm.insertBefore(possibleTownNamesList, searchForm.childNodes[2]);
}







function removePreviousList () {
    previouslist = searchForm.getElementsByTagName("datalist")
    if (previouslist[0] !== undefined && previouslist[0] !== null) {
        searchForm.removeChild(previouslist[0])
    };
}