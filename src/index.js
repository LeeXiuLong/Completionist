const Chart = require("chart.js");
console.log(Chart.defaults.global.defaultColor);
Chart.defaults.global.defaultColor = "rgba(255,255,255, 0)";

document.addEventListener("DOMContentLoaded", () => {

    //different datasets
    const json = require("../gameData.json");
    const allGamesData = Object.values(json);

    //filter datasets
    let getGamesByGenre = genre => {
        return Object.values(json).filter(gameData => {
            return gameData.genres.includes(genre);
        })
    }

    let getGamesByPricepoint = pricepoint => {
        return Object.values(json).filter(gameData => {
            return gameData.price_overview.final <= pricepoint;
        })
    }

    //functions for getting different types of data
    let getGameNames = (gameDataset) => {
        return gameDataset.map(gameData => {
            return gameData.name
        })
    }

    let getGamePrices = (gameDataset) => {
        return gameDataset.map(gameData => {
            if (!gameData.price_overview) {
                return 0;
            } else {
                return gameData.price_overview.final / 100
            }
        })
    }

    let getGameRatings = (gameDataset) => {
        return gameDataset.map(gameData => {
            return (gameData.review_info.total_positive / gameData.review_info.total_reviews * 10).toFixed(2);
        })
    }

    let getGameRatingPerDollar = (gameDataset) => {
        return gameDataset.map(gameData => {
            let yAxes;
            if (gameData.price_overview) {
                yAxes = gameData.price_overview.final / 100;
            } else {
                yAxes = 0;
            }
            return {
                x: (gameData.review_info.total_positive / gameData.review_info.total_reviews * 10).toFixed(2),
                y: yAxes
            }
        })
    }

    let getGamePics = (gameDataset) => {
        return gameDataset.map(gameData => {
            let img = new Image();
            img.src = gameData.header_image;
            img.width = 100;
            img.height = 50;
            return img;
        })
    }


    //Charts
    //PriceChart
    let myPriceChart = document.getElementsByClassName("price-chart");
    let priceChart = new Chart(myPriceChart, {
        type: "bar", //bar, horizontal bar ,pie, line, doughnut, radar, polarArea
        data: {
            labels: getGameNames(allGamesData),
            datasets: [{
                label: "Price",
                data: getGamePrices(allGamesData),
                backgroundColor: "#76d7c4",
                borderColor: "#666468",
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBorderColor: "black"
            },
            ],
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                }
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        color: "grey",
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 18,
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        color: "black",
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 18
                    }
                }]
            }
        }

    });

    //Rating Chart
    let myRatingChart = document.getElementsByClassName("rating-chart");
    let ratingChart = new Chart(myRatingChart, {
        type: "bar",
        data: {
            labels: getGameNames(allGamesData),
            datasets: [{
                label: "Rating",
                data: getGameRatings(allGamesData),
                backgroundColor: "#76d7c4",
                borderColor: "#666468",
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBorderColor: "black"
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                }
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        color: "grey",
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 18,
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        color: "none",
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 18
                    }
                }]
            }
        }
    })


    //Rating Per Dollar Chart
    let myRatingPerDollarChart = document.getElementsByClassName("rating-per-dollar-chart");
    let scatterChart = new Chart(myRatingPerDollarChart, {
        type: 'scatter',
        data: {
            labels: getGameNames(allGamesData),
            datasets: [{
                label: "Rating/$",
                data: getGameRatingPerDollar(allGamesData),
                backgroundColor: "#76d7c4",
                pointStyle: getGamePics(allGamesData),
                pointHitRadius: 50,
                pointHoverRadius: 50,
            }]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return `${data.labels[tooltipItem.index]} \n Price: $${tooltipItem.value} \n Rating: ${tooltipItem.label}/10`;
                    }
                }
            },
            legend: {
                labels: {
                    fontColor: "white",
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "grey",
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 18
                    },
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: "Rating",
                        fontColor: "white"
                    },
                    position: 'bottom'
                }],
                yAxes: [{
                    gridLines: {
                        color: "grey",
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 18,
                        reverse: true,
                        callback: function (value, index, values) {
                            return "$" + value
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Price in $",
                        fontColor: "white"
                    }
                }]
            }
        }
    });

    //DOM Elements
    //chart buttons
    const priceChartButton = document.getElementsByClassName("price-chart-button")[0];
    const ratingChartButton = document.getElementsByClassName("rating-chart-button")[0];
    const ratingPerDollarButton = document.getElementsByClassName("rating-per-dollar-button")[0];

    //DOM Charts
    const priceChartDOM = document.getElementsByClassName("price-chart")[0];
    const ratingChartDOM = document.getElementsByClassName("rating-chart")[0];
    const ratingPerDollarChartDOM = document.getElementsByClassName("rating-per-dollar-chart")[0];

    //filter buttons
    const allFilterButton = document.getElementsByClassName("all-filter-button")[0];
    const actionFilterButton = document.getElementsByClassName("action-filter-button")[0];
    const adventureFilterButton = document.getElementsByClassName("adventure-filter-button")[0];
    const indieFilterButton = document.getElementsByClassName("indie-filter-button")[0];
    const casualFilterButton = document.getElementsByClassName("casual-filter-button")[0];
    const strategyFilterButton = document.getElementsByClassName("strategy-filter-button")[0];
    const rpgFilterButton = document.getElementsByClassName("rpg-filter-button")[0];
    const multiplayerFilterButton = document.getElementsByClassName("multiplayer-filter-button")[0];
    const singleplayerFilterButton = document.getElementsByClassName("singleplayer-filter-button")[0];
    const sportsFilterButton = document.getElementsByClassName("sports-filter-button")[0];

    let filterChartByGenre = genre => {
        let gamesData;
        if(genre === "All"){
            gamesData = allGamesData;
        } else{
            gamesData = getGamesByGenre(genre);
        }
        priceChart.data.labels = getGameNames(gamesData);
        priceChart.data.datasets[0].data = getGamePrices(gamesData);
        priceChart.update();
        ratingChart.data.labels = getGameNames(gamesData);
        ratingChart.data.datasets[0].data = getGameRatings(gamesData);
        ratingChart.update();
        scatterChart.data.labels = getGameNames(gamesData);
        scatterChart.data.datasets[0].pointStyle = getGamePics(gamesData);
        scatterChart.data.datasets[0].data = getGameRatingPerDollar(gamesData);
        scatterChart.update();
    }

    //Show Rating/$ Chart
    const showRatingPerDollarChart = () => {
        priceChartDOM.style.display = "none";
        ratingChartDOM.style.display = "none";
        ratingPerDollarChartDOM.style.display = "block";
    }

    //Show Price Chart
    const showPriceChart = () => {
        priceChartDOM.style.display = "block";
        ratingChartDOM.style.display = "none";
        ratingPerDollarChartDOM.style.display = "none";
    }

    //Show Rating Chart
    const showRatingChart = () => {
        priceChartDOM.style.display = "none";
        ratingChartDOM.style.display = "block";
        ratingPerDollarChartDOM.style.display = "none";
    }
    //Make sure that Rating/$ Chart is shown by default
    showRatingPerDollarChart();

    //EventListeners
    //ChartButtonEventListeners
    priceChartButton.addEventListener("click", showPriceChart);
    ratingChartButton.addEventListener("click", showRatingChart);
    ratingPerDollarButton.addEventListener("click", showRatingPerDollarChart);

    //Filter Button Event Listeners
    allFilterButton.addEventListener("click", () => filterChartByGenre("All"));
    actionFilterButton.addEventListener("click", () => filterChartByGenre("Action"));
    adventureFilterButton.addEventListener("click", () => filterChartByGenre("Adventure"));
    indieFilterButton.addEventListener("click", () => filterChartByGenre("Indie"));
    casualFilterButton.addEventListener("click", () => filterChartByGenre("Casual"));
    strategyFilterButton.addEventListener("click", () => filterChartByGenre("Strategy"));
    rpgFilterButton.addEventListener("click", () => filterChartByGenre("RPG"));
    multiplayerFilterButton.addEventListener("click", () => filterChartByGenre("Multi-player"));
    singleplayerFilterButton.addEventListener("click", () => filterChartByGenre("Single-player"));
    sportsFilterButton.addEventListener("click", () => filterChartByGenre("Sports"));


})




