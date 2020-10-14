const ITADAPIKEY = "365e685f89f6f91a5ffef6a8e4a9b12d249c07ae";
const getAllSteamApps = new URL("https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/");
const getGameDetail = appId => {
    return new URL(`https://cors-anywhere.herokuapp.com/http://store.steampowered.com/api/appdetails?appids=${appId}`)
}

const Chart = require("chart.js");

document.addEventListener("DOMContentLoaded", () => {
    let gameDataUL = document.getElementById("game-list");

    const json = require("../gameData.json");

    const gamesData = Object.values(json);

    let gameNames = gamesData.map(gameData => {
        return gameData.name
    })

    let gamePrices = gamesData.map(gameData => {
        return gameData.price_overview.final/100
    })

    let gameRatings = gamesData.map(gameData => {
        return (gameData.review_info.total_positive/gameData.review_info.total_reviews * 10).toFixed(2);
    })

    let gameRatingPerDollar = gamesData.map(gameData => {
        return {
            x: (gameData.review_info.total_positive/gameData.review_info.total_reviews * 10).toFixed(2),
            y: gameData.price_overview.final/100
        }
    })

    let gamePics = gamesData.map(gameData => {
        return gameData.header_image;
    })

    let myPriceChart = document.getElementsByClassName("my-price-chart");
    let priceChart = new Chart(myPriceChart, {
        type: "bar", //bar, horizontal bar ,pie, line, doughnut, radar, polarArea
        data:{
            labels: gameNames,
            datasets: [{
                label: "Price",
                data: gamePrices, 
                backgroundColor: "#00d2e6",
                borderColor: "#666468",
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBorderColor: "black"
            }],
        },
        options:{}

    });

    let myRatingChart = document.getElementsByClassName("my-rating-chart");
    let ratingChart = new Chart(myRatingChart, {
        type: "bar",
        data: {
            labels: gameNames,
            datasets: [{
                label: "Rating",
                data: gameRatings,
                backgroundColor: "#00d2e6",
                borderColor: "#666468",
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBorderColor: "black"
            }]
        }
    })
    

    let myRatingPerDollarChart = document.getElementsByClassName("rating-per-dollar-chart");
    let scatterChart = new Chart(myRatingPerDollarChart, {
        type: 'scatter',
        data: {
            pics: gamePics,
            labels: gameNames,
            datasets: [{
                data: gameRatingPerDollar,
                backgroundColor: "#00d2e6",
            }]
        },
        options: {
            tooltips: {
                callbacks:{
                    label: function(tooltipItem, data){
                        return `${data.labels[tooltipItem.index]} \n Price: $${tooltipItem.value} \n Rating: ${tooltipItem.label}/10`;
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: "Rating",
                    },
                    position: 'bottom'
                }],
                yAxes: [{
                    ticks: {
                        reverse: true,
                        callback: function(value, index, values){
                            return "$" + value
                        }
                    },
                    scaleLabel:{
                        display: true,
                        labelString: "Price in $"
                    }
                }]
            }
        }
    });
})




