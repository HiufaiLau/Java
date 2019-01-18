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
        //        orientationOption: false,
        //        selectedShip: null,
        //        selectedOrientation: null,
        //        placingShipLocation: [],
        //        shipLength: null,
        //        errorLocation: [],
        //        aircraftCarrier: {
        //            "type": "",
        //            "location": []
        //        },
        //        shipList: []


        placedShip: null,
        shipOrientation: null,
        shipLength: null,
        shipArray: [
            {
                "type": "",
                "locations": []
            }
        ],
        placingShipLocation: [],
        errorLocation: [],
        shipList: [],
        ships: [],


        carrier: {
            type: "",
            locations: []
        },
        battleship: {
            type: "",
            locations: []
        },
        destroyer: {
            type: "",
            locations: []
        },
        submarine: {
            type: "",
            locations: []
        },
        patrol: {
            type: "",
            locations: []
        },
        selectedCell: null,
        cellNumber: null,
        cellAlpha: null,
        //          shipArray: [
        //                    {
        //                        "type": "destroyer",
        //                        "locations": ["H5", "I5", "J5"]
        //                    },
        //                    {
        //                        "type": "patrolboat",
        //                        "locations": ["D1", "D2"]
        //                    },
        //                    {
        //                        "type": "carrier",
        //                        "locations": ["B2", "B3", "B4", "B5", "B6"]
        //                    },
        //                    {
        //                        "type": "submarine",
        //                        "locations": ["F4", "F5", "F6"]
        //                    },
        //                    {
        //                        "type": "battleship",
        //                        "locations": ["C8", "D8", "E8", "F8"]
        //                    }
        //                           ],
        //        

        //                  ],
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
                    this.ships = this.gameViewData.ships
                    console.log(this.ships)
                    this.showTheShips("shipTable")
                    this.showLocalPalyerSalvos("salvoTable")
                    this.showOpponentSalvos("shipTable")
                    //                    this.showShipType("shipType")
                    //                    this.defineShips("shipTable")
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
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}1" class="${this.columns[c]}1"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}2" class="${this.columns[c]}2"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}3" class="${this.columns[c]}3"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}4" class="${this.columns[c]}4"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}5" class="${this.columns[c]}5"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}6" class="${this.columns[c]}6"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}7" class="${this.columns[c]}7"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}8" class="${this.columns[c]}8"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}9" class="${this.columns[c]}9"></td>
                            <td @mouseover="defineShips" @mouseout="removeHover" @click="placeShipOnGrid" data-className="${this.columns[c]}10" class="${this.columns[c]}10"></td>
                        </tr>`
            }
            table.appendChild(tbody).innerHTML = col;
        },


        showTheShips(tableId) {
            let shipLocations = [];

            //            console.log(ships)
            //            if (ships.length > 0)
            this.ships.forEach(ship => {
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

        showShipType(event) {
            console.log(event)
            this.placedShip = event.toElement.value
        },

        defineShips(event) {
            let hoverLocation = event.currentTarget.getAttribute("data-className");
            let ships = {}
            if (this.placedShip == "carrier") {
                this.shipLength = 5
                ships = this.carrier
                this.placingShipLocation = []
            }
            if (this.placedShip == "battleship") {
                this.shipLength = 4
                ships = this.battleship
                this.placingShipLocation = []
            }
            if (this.placedShip == "destroyer") {
                this.shipLength = 3
                ships = this.destroyer
                this.placingShipLocation = []
            }
            if (this.placedShip == "submarine") {
                this.shipLength = 3
                ships = this.submarine
                this.placingShipLocation = []
            }
            if (this.placedShip == "patrol") {
                this.shipLength = 2
                ships = this.patrol
                this.placingShipLocation = []
            }
            console.log(this.carrier)
            this.hoverShipHorizontal(hoverLocation, this.shipLength, ships)
            //            console.log("hi");
        },

        hoverShipHorizontal(location, shipLength, ship) {
            if (this.placedShip != null && this.shipOrientation == "horizontal") {

                var locationNumber = [];
                for (var i = 0; i < shipLength; i++) {
                    locationNumber.push(parseInt(location.substr(1, 2)) + i)
                }
                if (locationNumber[locationNumber.length - 1] < 11) {
                    locationNumber
                        .forEach(oneNumber => this.placingShipLocation.push(location.split("")[0] + oneNumber))
                    this.placingShipLocation
                        .map(oneCell => document.querySelector(`.${oneCell}`).classList.add("ship_hover"))
                    ship.locations = this.placingShipLocation;
                    ship.type = this.placedShip;
                    console.log(ship)
                } else {
                    var numberOutGrid = locationNumber.filter(oneLocation => oneLocation < 11)
                    numberOutGrid.forEach(oneNumber => this.errorLocation.push(location.split("")[0] + oneNumber))
                    this.errorLocation
                        .map(oneCell => {
                            document.querySelector(`.${oneCell}`).classList.add("error_hover")
                        })
                }
                console.log(locationNumber, shipLength)
            }
        },

        removeHover(location) {
            if (this.placedShip != null && this.shipOrientation != null) {
                this.placingShipLocation
                    .map(oneCell => document.querySelector(`.${oneCell}`).classList.remove("ship_hover"))
                this.placingShipLocation = []
                this.errorLocation
                    .map(oneCell => document.querySelector(`.${oneCell}`).classList.remove("error_hover"))
                this.errorLocation = []
            }
        },

        placeShipOnGrid(location) {
            if (this.placingShipLocation.length == this.shipLength) {
                if (this.placedShip == 'carrier') {
                    this.ships.push(this.carrier)
                    document.getElementById("carrier").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null
                    

                } else if (this.placedShip == 'battleship') {
                    this.ships.push(this.battleship)
                    document.getElementById("battleship").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null
                    this.removeHover

                } else if (this.placedShip == 'destroyer') {
                    this.ships.push(this.destroyer)
                    document.getElementById("destroyer").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null
                    this.removeHover
                    
                } else if (this.placedShip == 'submarine') {
                    this.ships.push(this.submarine)
                    document.getElementById("submarine").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null
                    this.removeHover
                    
                } else if (this.placedShip == 'patrol') {
                    this.ships.push(this.patrol)
                    document.getElementById("patrol").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null
                    this.removeHover
                }
            } else {
                alert("Sorry, this is a wrong move ")
            }
            //            else if (this.placingShipLocation.length!=this.shipLength) {
            //                this.ships.remove(this.placedShip)
            //                 document.getElementById("patrol").disabled = false;
            //                alert("Sorry, the ship is outside the table!")
            //            }

            console.log(this.ships)
            //            console.log(this.placingShipLocation)

            //            this.pacingShipCondition()
                this.placingShipLocation.forEach(loc => {
                    let removeCell = document.querySelector(`.${loc}`).classList.remove("ship_hover")
                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                        .classList.add('ships')
                })
            console.log(this.placingShipLocation)
            //                this.showTheShips("shipTable")
        },

        //        pacingShipCondition() {
        //            console.log('hi')
        //            let checkShipLoc = [];
        //            let shipInData = this.ships
        ////            console.log(this.ships[0].locations)
        //            console.log(shipInData)
        // console.log(checkShipLoc)
        //            shipInData.forEach(ship => {
        //                console.log("ship") 
        //                if(checkShipLoc.includes(ship.locations)){
        //                    checkShipLoc.push(ship.locations)
        //                }
        //                 console.log(checkShipLoc)   
        //                })
        //
        //        
        //
        //        },

        //        showShipType(tableId) {
        //            let shipLength = this.shipArray[0].locations;
        //            let ships = this.gameViewData.ships[3].locations;
        //            console.log(shipLength)
        //            console.log(ships)
        ////            ships.forEach(ship=>ship.shipLength.forEach(location => shipLength.push(location)));
        ////            console.log(shipLength);
        //
        //        },

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
