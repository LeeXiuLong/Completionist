const ITADAPIKEY = "365e685f89f6f91a5ffef6a8e4a9b12d249c07ae";
const getAllSteamApps = new URL("https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/");
const getGameDetail = appId => {
    return new URL(`https://cors-anywhere.herokuapp.com/http://store.steampowered.com/api/appdetails?appids=${appId}`)
}

let allgames;

const getGames = (games) => {
    return games
}

const getAllSteamGames = () => {
    fetch(getAllSteamApps)
        .then(res => {
            return res.json()
        }).then(data => {
            let gameIds = data.applist.apps.map(datum=>{
                return datum.appid;
            }).slice(0,300);
            let gameNames = data.applist.apps.map(datum => {
                return datum.name;
            })
            const ul = document.getElementById("game-list");
            const gamePrices = [];
            gameIds.forEach((id, i) => {
                fetch(getGameDetail(id)).then(res => {
                    return res.json()})
                    .then(data => {
                        if(data[id].success && data[id].data.type === "game"){
                            console.log(data[id]);
                            let newGame = {
                                id: {
                                    name: data[id].data.name,
                                    price: data[id].data.price_overview ? data[id].data.price_overview.final : 0,                        
                                }
                            }
                            let li = document.createElement("li");
                            let p = document.createElement("p");
                            let p2 = document.createElement("p")
                            li.appendChild(p);
                            li.appendChild(p2);
                            p.innerHTML = newGame.id.name;
                            p2.innerHTML = newGame.id.price;
                            ul.appendChild(li);
                            gamePrices.push(newGame);
                        }
                    })
            })
            // gameIds.forEach(gameId => {
            //     fetch(getGameDetail(gameId)).then(res => {
            //         return res.json()
            //     }).then(data => {
            //         ;
            //     })
            // })
        })
        .catch(error => console.log(error));
}

getAllSteamGames();

