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
        placedShip: null,
        shipOrientation: null,
        shipLength: null,
        checkShip: [],
        //        isAbleToPlace: true,
        shipArray: [
            {
                "type": "",
                "locations": []
            }
        ],
        placingShipLocation: [],
        errorLocation: [],
        //        checkShipList: [],
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
        isLoading: true,
        date: [],
        allShipsLocation: [],
        oneShip: {}
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
            //            let ships = {}
            if (this.placedShip == "carrier") {
                this.shipLength = 5
                this.oneShip = this.carrier
                this.placingShipLocation = []
            }
            if (this.placedShip == "battleship") {
                this.shipLength = 4
                this.oneShip = this.battleship
                this.placingShipLocation = []
            }
            if (this.placedShip == "destroyer") {
                this.shipLength = 3
                this.oneShip = this.destroyer
                this.placingShipLocation = []
            }
            if (this.placedShip == "submarine") {
                this.shipLength = 3
                this.oneShip = this.submarine
                this.placingShipLocation = []
            }
            if (this.placedShip == "patrol") {
                this.shipLength = 2
                this.oneShip = this.patrol
                this.placingShipLocation = []
            }
            console.log(this.carrier)
            this.hoverShipHorizontal(hoverLocation, this.shipLength)
        },

        hoverShipHorizontal(location, shipLength) {
            if (this.placedShip != null && this.shipOrientation != null) {
                let locationNumber = [];
                let asciiToNumber = [];
                var locationAlphabet = [];

                for (var i = 0; i < shipLength; i++) {
                    locationNumber.push(parseInt(location.substr(1, 2)) + i);
                    asciiToNumber.push(location.charCodeAt(location.substr(0, 1)) + i);
                    locationAlphabet.push(String.fromCharCode(asciiToNumber[i]))
                }
                if (this.shipOrientation == "horizontal") {
                    if (locationNumber[locationNumber.length - 1] < 11) {
                        locationNumber
                            .forEach(oneNumber => this.placingShipLocation.push(location.split("")[0] + oneNumber))
                        this.placingShipLocation
                            .map(oneCell => document.querySelector(`.${oneCell}`).classList.add("ship_hover"))

                        console.log("placeShip" + this.placingShipLocation)
                        if (this.isAbleToPlace() == false) {
                            this.placingShipLocation
                                .forEach(loc => {
                                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                                        .classList.add('error_hover')
                                })

                        } else {
                            this.placingShipLocation
                                .forEach(loc => {
                                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                                        .classList.add('ship_hover')
                                })
                        }
                    } else {
                        var numberOutGrid = locationNumber.filter(oneLocation => oneLocation < 11)
                        numberOutGrid.forEach(oneNumber => this.errorLocation.push(location.split("")[0] + oneNumber))
                        this.errorLocation
                            .map(oneCell => {
                                document.querySelector(`.${oneCell}`).classList.add("error_hover")
                            })
                    }
                }


                if (this.shipOrientation == "vertical") {
                    //                    console.log("hi")
                    if (asciiToNumber[asciiToNumber.length - 1] < 75) {
                        console.log(locationAlphabet)
                        locationAlphabet.forEach(alphabet => this.placingShipLocation.push(alphabet + location.substr(1, 2)))
                        if (this.isAbleToPlace() == true) {
                            this.placingShipLocation
                                .forEach(loc => {
                                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                                        .classList.add('ship_hover')
                                })

                        } else {
                            //                            console.log("hi")
                            this.placingShipLocation
                                .forEach(loc => {
                                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                                        .classList.add('error_hover')
                                })
                        }
                    } else {
                        //                        console.log("hi")
                        var asciiOutGrid = asciiToNumber.filter(oneLocation => oneLocation < 75)
                        var letterOutGrid = []
                        for (var i = 0; i < asciiOutGrid.length; i++) {
                            letterOutGrid.push(String.fromCharCode(asciiOutGrid[i]))
                        }
                        console.log(letterOutGrid)
                        //                        console.log(letterOutGrid)
                        letterOutGrid.forEach(oneLetter => this.errorLocation.push(oneLetter + location.substr(1, 2)))
                        console.log(this.errorLocation)
                        this.errorLocation
                            .map(oneCell => {
                                document.querySelector(`.${oneCell}`).classList.add("error_hover")
                            })
                        console.log(letterOutGrid)
                    }
                }
            }
        },

        isAbleToPlace() {
            //checking location
            if (this.ships.length == 0 || (this.ships.length == 1 && this.ships[0].locations.length == 0)) {
                return true
            } else {

                this.allShipsLocation = [].concat.apply([], this.ships.map(oneShip => oneShip.locations))
                for (var i = 0; i < this.allShipsLocation.length; i++) {
                    if (this.placingShipLocation.includes(this.allShipsLocation[i])) {
                        console.log("no")
                        return false
                    }
                }
                console.log("yes")
                return true
            }
        },

        removeHover(location) {
            if (this.placedShip != null && this.shipOrientation != null) {
                this.placingShipLocation
                    .map(oneCell => document.querySelector(`.${oneCell}`).classList.remove("ship_hover"))

                this.placingShipLocation
                    .map(oneCell => document.querySelector(`.${oneCell}`).classList.remove("error_hover"))
                this.placingShipLocation = []
                this.errorLocation
                    .map(oneCell => document.querySelector(`.${oneCell}`).classList.remove("error_hover"))
                this.errorLocation = []
            }
        },

        placeShipOnGrid(location) {
            if (this.placingShipLocation.length == this.shipLength && this.isAbleToPlace() == true) {

                if (this.placedShip == 'carrier') {
                    this.oneShip.locations = this.placingShipLocation;
                    this.oneShip.type = this.placedShip;
                    this.ships.push(this.carrier)
                    document.getElementById("carrier").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null

                } else if (this.placedShip == 'battleship') {
                    this.oneShip.locations = this.placingShipLocation;
                    this.oneShip.type = this.placedShip;
                    this.ships.push(this.battleship)
                    document.getElementById("battleship").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null

                } else if (this.placedShip == 'destroyer') {
                    this.oneShip.locations = this.placingShipLocation;
                    this.oneShip.type = this.placedShip;
                    this.ships.push(this.destroyer)
                    document.getElementById("destroyer").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null

                } else if (this.placedShip == 'submarine') {
                    this.oneShip.locations = this.placingShipLocation;
                    this.oneShip.type = this.placedShip;
                    this.ships.push(this.submarine)
                    document.getElementById("submarine").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null

                } else if (this.placedShip == 'patrol') {
                    this.oneShip.locations = this.placingShipLocation;
                    this.oneShip.type = this.placedShip;
                    this.ships.push(this.patrol)
                    document.getElementById("patrol").disabled = true;
                    this.placedShip = null
                    this.shipOrientation = null
                }

                this.placingShipLocation.forEach(loc => {
                    let removeCell = document.querySelector(`.${loc}`).classList.remove('ship_hover')
                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                        .classList.add('ships')


                })

             
            } else {
                alert("Sorry, this is a wrong move ")
            }
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
