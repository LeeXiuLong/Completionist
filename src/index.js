const Chart = require("chart.js");
Chart.defaults.global.defaultColor = "rgba(255,255,255, 0)";

document.addEventListener("DOMContentLoaded", () => {

    //different datasets
    const json = require("../gameData.json");
    const allGamesData = Object.values(json);

    //filter games by genre
    let getGamesByGenre = genre => {
        return Object.values(json).filter(gameData => {
            if(genre === "All"){
                return allGamesData;
            }else{
                return gameData.genres.includes(genre);
            }
        })
    }

    //filter game by pricepoint
    let getGamesByPricepoint = (pricepoint, gamesDatas) => {
        return gamesDatas.filter(gameData => {
            if(pricepoint === "All"){
                return true
            }else if(pricepoint === "free"){
                return !gameData.price_overview
            }else{
                    return !gameData.price_overview || (gameData.price_overview.final / 100) <= parseInt(pricepoint)
            }
            
        })
    }

    //functions for getting different types of data

    //get the Names of the games
    let getGameNames = (gameDataset) => {
        return gameDataset.map(gameData => {
            return gameData.name
        })
    }

    //get the prices of the games
    let getGamePrices = (gameDataset) => {
        return gameDataset.map(gameData => {
            if (!gameData.price_overview) {
                return 0;
            } else {
                return gameData.price_overview.final / 100
            }
        })
    }

    //get the ratings for the games
    let getGameRatings = (gameDataset) => {
        return gameDataset.map(gameData => {
            return (gameData.review_info.total_positive / gameData.review_info.total_reviews * 10).toFixed(2);
        })
    }

    //get the Rating per dollar for a game
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

    //get the pics for games
    let getGamePics = (gameDataset) => {
        return gameDataset.map(gameData => {
            let img = new Image();
            img.src = gameData.header_image;
            img.width = 80;
            img.height = 40;
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
                pointHitRadius: 30,
                pointHoverRadius: 10,
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
    
    
    //Charts
    const priceChartDOM = document.getElementsByClassName("price-chart")[0];
    const ratingChartDOM = document.getElementsByClassName("rating-chart")[0];
    const ratingPerDollarChartDOM = document.getElementsByClassName("rating-per-dollar-chart")[0];

    //filter selects
    const selectGenre = document.getElementById("genre-filter");
    const selectChart = document.getElementById("data-selector");
    const selectDataStyleLabel = document.getElementById("select-data-style-label");
    const selectDataStyle = document.getElementById("select-data-style");
    const selectPricePoint = document.getElementById("price-filter");

    //About and Modal
    const aboutTheApp = document.getElementsByClassName("about-modal")[0];
    const modal = document.getElementsByClassName("modal-background")[0];
    const closeButton = document.getElementsByClassName("close-button")[0];

    //Functions For Event Handlers

    //Change the Data Style of the Rating/$ Chart
    const changeDataStyle = style => {
        if (style === "dot") {
            scatterChart.data.datasets[0].pointStyle = "circle";
            scatterChart.data.datasets[0].pointHitRadius = 5;
        } else if (style === "images") {
            let genreGamesData;
            if (selectGenre.options[selectGenre.selectedIndex].value === "All") {
                genreGamesData = allGamesData;
            } else {
                genreGamesData = getGamesByGenre(selectGenre.options[selectGenre.selectedIndex].value);
            }
            scatterChart.data.datasets[0].pointStyle = getGamePics(getGamesByPricepoint(selectPricePoint.options[selectPricePoint.selectedIndex].value, genreGamesData ));
            scatterChart.data.datasets[0].pointHitRadius = 30;
        }
        scatterChart.update();
    }

    //Filter
    let filterChart = pricepoint => {
        let genreGamesData;
        if (selectGenre.options[selectGenre.selectedIndex].value === "All"){
            genreGamesData = allGamesData;
        }else{
            genreGamesData = getGamesByGenre(selectGenre.options[selectGenre.selectedIndex].value);
        }
        let gamesData = getGamesByPricepoint(pricepoint, genreGamesData);
        priceChart.data.labels = getGameNames(gamesData);
        priceChart.data.datasets[0].data = getGamePrices(gamesData);
        priceChart.update();
        ratingChart.data.labels = getGameNames(gamesData);
        ratingChart.data.datasets[0].data = getGameRatings(gamesData);
        ratingChart.update();
        scatterChart.data.labels = getGameNames(gamesData);
        if (selectDataStyleLabel.style.display !== "none") {
            changeDataStyle(selectDataStyle.options[selectDataStyle.selectedIndex].value);
        }
        scatterChart.data.datasets[0].data = getGameRatingPerDollar(gamesData);
        scatterChart.update();
        return gamesData;
    }

    

    //Show the Data you would like to see
    const showChart = chartType => {
        if(chartType === "RatingPerDollar"){
            priceChartDOM.style.display = "none";
            ratingChartDOM.style.display = "none";
            ratingPerDollarChartDOM.style.display = "block";
            selectDataStyleLabel.style.display = "flex";
        } else if( chartType === "Price"){
            priceChartDOM.style.display = "block";
            ratingChartDOM.style.display = "none";
            ratingPerDollarChartDOM.style.display = "none";
            selectDataStyleLabel.style.display = "none";
        } else{
            priceChartDOM.style.display = "none";
            ratingChartDOM.style.display = "block";
            ratingPerDollarChartDOM.style.display = "none";
            selectDataStyleLabel.style.display = "none";
        }
    }

    //Make sure that Rating/$ Chart is shown by default
    showChart("RatingPerDollar");

    //EventListeners

    //Filter Button Event Listeners
    selectGenre.addEventListener("change", (event) => {
        filterChart(selectPricePoint.options[selectPricePoint.selectedIndex].value);
    })

    selectChart.addEventListener("change", (event) => {
        showChart(event.target.value);
    })

    selectDataStyle.addEventListener("change", (event) => {
        changeDataStyle(event.target.value);
    })

    selectPricePoint.addEventListener("change", (event) => {
        filterChart(event.target.value);
    })

    //About Modal
    aboutTheApp.onclick = () => {
        modal.style.display = "block";
    }
    closeButton.onclick = () => {
        modal.style.display = "none";
    }


})




