var eachGameData = new Vue({
    el: '#eachGame',
    data: {
        gameUrl: "",
        gameViewData: [],
        gamePlayerId: null,
        rows: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        columns: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        localPlayer: "",
        opponentPlayer: "",
//        
//        shipArray: [
//            {
//                "type": "destroyer",
//                "locations": ["H5", "I5", "J5"]
//            },
//            {
//                "type": "patrolboat",
//                "locations": ["D1", "D2"]
//            },
//            {
//                "type": "carrier",
//                "locations": ["B2", "B3", "B4", "B5", "B6"]
//            },
//            {
//                "type": "submarine",
//                "locations": ["F4", "F5", "F6"]
//            },
//            {
//                "type": "battleship",
//                "locations": ["C8", "D8", "E8", "F8"]
//            },


                  ],
        isLoading: true,
        date: [],
    },


    created() {
        this.getRelatedId()
        this.gameUrl = 'http://localhost:8080/api/game_view/' + this.gamePlayerId
        console.log(this.gameUrl)
        this.fetchGameView(this.gameUrl)
        this.createShipTable("shipTable", "ship")
        this.createShipTable("salvoTable", "salvo")
    },


    methods: {
        fetchGameView(url) {
            fetch(url, {
                    method: 'GET',
                })
                .then(response => response.json())
                .then(data => {
                    this.gameViewData = data;
                    console.log(this.gameViewData)
                    this.showTheShips("shipTable")
                    this.showLocalPalyerSalvos("salvoTable")
                    this.showOpponentSalvos("shipTable")
                    this.showShipType("shipType")
                    this.showPlayers()
                    eachGameData.dateConvert();
                    this.isLoading = false;
                })
        },
        logOut() {
            fetch('http://localhost:8080/api/logout', {
                method: 'POST',
            }).then(response => {
                if (response.status === 200) {
                    window.location.reload()
                } else if (response.status === 401) {
                    alert("Can't login: wrong user or pass");
                } else {
                    alert("A problem has occurred: " + response.status);
                }
            }).catch(error => console.log("An error has ocurred: ", error))
        },


        getRelatedId() {
            var url = window.location.href.split('=');
            // console.log(url[1])
            this.gamePlayerId = url[1]
            console.log(this.gamePlayerId);

        },



        placeShip() {
            fetch("/api/games/players/" + this.gamePlayerId + "/ships", {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.shipArray)
                })
                .then(response => {
                    console.log(response)
                    if (response.status == 403) {
                        alert("ship is alredy placed")
                    }
                    if (response.status == 401) {
                        alert("You are not logged in")
                    }
                    return response.json()

                }).then(data => {
                    if (response.status === 201) {
                        window.location.reload();
                        console.log(data)
                    }
                })
                .catch(error => {
                    console.log('Request failure: ', error);
                    alert("Failure");
                });
        },

        createShipTable(tableId, tableName) {
            let table = document.getElementById(tableId);
            let tbody = document.createElement("tbody");
            let thead = document.createElement("thead");
            let row = "";
            let col = "";
            let salvoCol = "";

            for (let i = 0; i < this.rows.length; i++) {
                row += `<th>${this.rows[i]}</th>`
            }

            table.appendChild(thead).innerHTML = row;
            for (let c = 0; c < this.columns.length; c++) {
                col += `<tr class="grids ${tableName}">
                            <td>${this.columns[c]}</td>   
                            <td class="${this.columns[c]}1" ></td>
                            <td class="${this.columns[c]}2"></td>
                            <td class="${this.columns[c]}3"></td>
                            <td class="${this.columns[c]}4"></td>
                            <td class="${this.columns[c]}5"></td>
                            <td class="${this.columns[c]}6"></td>
                            <td class="${this.columns[c]}7"></td>
                            <td class="${this.columns[c]}8"></td>
                            <td class="${this.columns[c]}9"></td>
                            <td class="${this.columns[c]}10"></td>
                        </tr>`
            }
            table.appendChild(tbody).innerHTML = col;
        },


        showTheShips(tableId) {
            let shipLocations = [];
            let ships = this.gameViewData.ships
            console.log(ships)
            //            if (ships.length > 0)
            ships.forEach(ship => {
                ship.locations.forEach(location => {
                    shipLocations.push(location)
                })
            })
            console.log("shipsLocation:" + shipLocations)

            shipLocations.forEach(loc => {
                let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                    .classList.add('ships')
                //                console.log(loc)
            })
        },

        showShipType(tableId) {
            let shipLength = this.shipArray[0].locations;
            let ships = this.gameViewData.ships[3].locations;
            console.log(shipLength)
            console.log(ships)
//            ships.forEach(ship=>ship.shipLength.forEach(location => shipLength.push(location)));
//            console.log(shipLength);

        },

        showOpponentSalvos(tableId) {
            var shipLocations = [];
            let ships = this.gameViewData.ships
            console.log(ships)
            ships.forEach(ship => {
                ship.locations.forEach(location => {
                    shipLocations.push(location)
                })
            })
            console.log(shipLocations)
            let salvos = this.gameViewData.salvos
            console.log(salvos)
            salvos.forEach(oneSalvo => {
                if (this.gamePlayerId != oneSalvo.gamePlayerId) {
                    oneSalvo.locations.forEach(oneLoc => {
                        shipLocations.forEach(loc => {
                            if (oneLoc == loc) {
                                //                                console.log( document.getElementById("shipTable").querySelector(`.${loc}`)
                                //                                .classList)
                                document.getElementById("shipTable").querySelector(`.${loc}`)
                                    .classList.add('hit');
                                document.getElementById("shipTable").querySelector(`.${oneLoc}`).innerHTML = oneSalvo.turn;
                                console.log(document.querySelector(`.${oneLoc}`).innerHTML = oneSalvo.turn)
                            } else {
                                document.getElementById("shipTable").querySelector(`.${oneLoc}`)
                                    .classList.add('salvo3');
                                document.getElementById("shipTable").querySelector(`.${oneLoc}`).innerHTML = oneSalvo.turn;
                            }
                        })
                    })
                }
            })
        },


        showLocalPalyerSalvos(tableId) {
            let salvos = this.gameViewData.salvos
            console.log(salvos)
            salvos.forEach(oneSalvo => {
                if (this.gamePlayerId == oneSalvo.gamePlayerId) {
                    oneSalvo.locations.forEach(oneSalvoLocation => {
                        document.getElementById("salvoTable").querySelector(`.${oneSalvoLocation}`)
                            .classList.add('salvo2');
                        document.getElementById("salvoTable").querySelector(`.${oneSalvoLocation}`).innerHTML = oneSalvo.turn;
                        //                        console.log(document.querySelector(`.${oneSalvoLocation}`).innerHTML = oneSalvo.turn;)z
                    })
                }
            })
        },


        showPlayers() {
            for (var i = 0; i < this.gameViewData.gamePlayers[0].players.length; i++) {
                if (this.gamePlayerId == this.gameViewData.gamePlayers[0].players[i].gamePlayerID) {
                    this.localPlayer = this.gameViewData.gamePlayers[0].players[i].player.email
                } else {
                    this.opponentPlayer = this.gameViewData.gamePlayers[0].players[i].player.email
                }
            }
            console.log(this.localPlayer);
            console.log(this.opponentPlayer);
        },


        dateConvert() {
            this.gameViewData.created = new Date(this.gameViewData.created).toLocaleString()
        }
    }
})
