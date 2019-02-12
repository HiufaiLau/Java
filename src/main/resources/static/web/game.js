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
        //        shipArray: [
        //            {
        //                "type": "",
        //                "locations": []
        //            }
        //        ],
        placingShipLocation: [],
        errorLocation: [],
        //        checkShipList: [],
        ships: [],

        opponentShips: [
            {
                "type": "carrier",
                "locations": ["J3", "J4", "J5", "J6", "J7"]
            },
            {
                "type": "battleship",
                "locations": ["I3", "I4", "I5", "I6"]
            },
            {
                "type": "submarine",
                "locations": ["H3", "H4", "H5"]
            },
            {
                "type": "destroyer",
                "locations": ["G3", "G4", "G5"]
            },
            {
                "type": "patrol",
                "locations": ["F3", "F4"]
            }
        ],
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
        allShipLocation: [],
        oneShip: {},

        //        salvoLocations: [],
        sendAllsalvos: [],
        salvos: [],
        turn: 1,
        placingSalvoLocation: [],
        allSalvos: [],
        //        getHit: [
        //            {
        //                "gamePlayerId": 4,
        //
        //                "hit": [
        //                    {
        //                        "turn": 1,
        //                        "shiptype": "carrier",
        //                        "hitLocations": ["G3", "G4", "G5", "G6"],
        //                        "hits": 4,
        //                        "sunk": 0,
        //                    },
        //                    
        //                    {
        //                        "turn": 2,
        //                        "shiptype": "battleship",
        //                        "hitLocations": ["H4", "H5", "H6", "H7"],
        //                        "hits": 4,
        //                        "sunk": 1,
        //                    }
        //                ]
        //            },
        //
        //
        //            {
        //                "gamePlayerId": 3,
        //
        //                "hit": [
        //                    {
        //                        "turn": 1,
        //                        "shiptype": "carrier",
        //                        "hitLocations": ["G3"],
        //                        "hits": 1,
        //                        "sunk": 0,
        //                    },
        //                    {
        //                        "turn": 2,
        //                        "shiptype": "carrier",
        //                        "hitLocations": ["G4"],
        //                        "hits": 1,
        //                        "sunk": 0,
        //                    }
        //                ]
        //            },
        //
        //
        //        ],;
        hitData: [],
        localPlayerHit: [],
        opponentPlayerHit: [],

    },

    created() {
        this.getRelatedId()
        this.gameUrl = 'http://localhost:8080/api/game_view/' + this.gamePlayerId
        console.log(this.gameUrl)
        this.fetchGameView(this.gameUrl)
        this.createTable("shipTable", "ship")
        this.createTable("salvoTable", "salvo")
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
                    this.salvos = this.gameViewData.salvos
                    console.log(this.salvos)
                    console.log(this.ships)

                    this.showTheShips("shipTable")
                    this.showLocalPalyerSalvos("salvoTable")
                    this.showOpponentSalvos("shipTable")
                    this.showPlayers()
                    this.hitData = this.gameViewData.hits
                    console.log(this.hitData)
                    this.hitData.forEach(gp => {
                        if (gp.gamePlayerId == this.gamePlayerId) {
                            this.opponentPlayerHit = gp.hit
                        } else {
                            this.localPlayerHit = gp.hit
                        }
                    })
                    //                this.showHitLocation()
                    console.log(this.opponentPlayerHit)
                    console.log(this.localPlayerHit)
                    //                    console.log(this.localPlayerHit)
                    //                    console.log(this.getHit[1].gamePlayerId)

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
                    body: JSON.stringify(this.ships)
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

                    window.location.reload();
                    console.log(data)

                })
                .catch(error => {
                    console.log('Request failure: ', error);
                    alert("Failure");
                });
        },

        placeSalvo() {
            if (this.sendAllsalvos.length == 5) {

//                alert(JSON.stringify({
//                            turn: this.turn,
//                            salvoLocations: this.sendAllsalvos
//                        }))
                
                fetch("/api/games/players/" + this.gamePlayerId + "/salvos", {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            turn: this.turn,
                            salvoLocations: this.sendAllsalvos
                        })
                    })
                    .then(response => {
                        console.log(response)
                        if (response.status == 403) {
                            //                        alert("ship is alredy placed")
                        }
                        if (response.status == 401) {
                            alert("You are not logged in")
                        }
                        return response.json()

                    }).then(data => {

//                        window.location.reload();
                        console.log(data)

                    })
                    .catch(error => {
                        console.log('Request failure: ', error);
                        alert("Failure");
                    })
                //this.turn = this.salvos.turn+1
            } else {
                alert("You still have some salvos!")
            }
        },



        createTable(tableId, tableName) {
            let functionName = tableName.charAt(0).toUpperCase() + tableName.slice(1)
            console.log(functionName)
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
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}1" class="${this.columns[c]}1"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}2" class="${this.columns[c]}2"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}3" class="${this.columns[c]}3"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}4" class="${this.columns[c]}4"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}5" class="${this.columns[c]}5"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}6" class="${this.columns[c]}6"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}7" class="${this.columns[c]}7"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}8" class="${this.columns[c]}8"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}9" class="${this.columns[c]}9"></td>
                            <td @mouseover="define${functionName}" @mouseout="remove${functionName}Hover" @click="place${functionName}OnGrid" data-className="${this.columns[c]}10" class="${this.columns[c]}10"></td>
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
//            this.turn = this.salvos.length + 1
                        this.disableAllbuttons()

        },

        showShipType(event) {
            console.log(event)
            this.placedShip = event.currentTarget.getAttribute("data-shiptype");
        },

        defineShip(event) {
            let hoverLocation = event.currentTarget.getAttribute("data-className");
            //            let getShipType = event.currentTarget.getAttribute("data-shiptype");  
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
            //            console.log(this.oneShip)
            //            console.log(hoverLocation)
            this.hoverShipHorizontal(hoverLocation, this.shipLength)
        },

        hoverShipHorizontal(location, shipLength) {
            if (this.placedShip != null && this.shipOrientation != null) {
                let locationNumber = [];
                let asciiToNumber = [];
                let locationAlphabet = [];

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

                this.allShipLocation = [].concat.apply([], this.ships.map(oneShip => oneShip.locations))
                for (var i = 0; i < this.allShipLocation.length; i++) {
                    if (this.placingShipLocation.includes(this.allShipLocation[i])) {
                        console.log("no")
                        return false
                    }
                }
                console.log("yes")
                return true
            }


        },

        removeShipHover(location) {
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
            //            this.removeSalvoHover(location)
        },

        placeShipOnGrid(location) {


            if (this.placingShipLocation.length == this.shipLength && this.isAbleToPlace() == true) {

                //this.reLocateShip(location)
                this.ships.forEach((ship, i) => {
                    if (ship.type == this.placedShip) {
                        this.ships.splice(i, 1);
                    }
                })
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
                    let removeCell = document.querySelector(`.${loc}`).classList.remove("ship_hover")
                    let cell = document.getElementById("shipTable").querySelector(`.${loc}`)
                        .classList.add('ships')
                })

            } else {
                let hoverLocation = location.currentTarget.getAttribute("data-className");
                let shouldBeRemoved = false;

                this.ships.forEach((ship, i) => {
                    ship.locations.forEach(location => {
                        if (location.includes(hoverLocation)) {
                            shouldBeRemoved = true;
                        }
                    })
                })
                // after place ships button is pressed , could not place ships again.
                if (shouldBeRemoved && this.placedShip == null && this.ships.length < 6 && this.allShipLocation.length != 0) {
                    this.reLocateShip(location)
                } else if (this.ships.length < 6 && this.allShipLocation.length == 0) {
                    alert("Sorry, could not place ships anymore ")

                } else {
                    alert("Sorry, this is a wrong move")
                }
                shouldBeRemoved = false;

            }


        },
        
                disableAllbuttons() {
                    //after the place ship button is pressed, no ships could be chosen.
        //            if (this.ships.length < 6 && this.allShipLocation.length == 0) {
                    if (this.ships.length ==5 && this.allShipLocation.length == 0) {
                        document.getElementById("carrier").disabled = true;
                        document.getElementById("battleship").disabled = true;
                        document.getElementById("destroyer").disabled = true;
                        document.getElementById("patrol").disabled = true;
                        document.getElementById("submarine").disabled = true;
                    }
                },


        reLocateShip(location) {


            let hoverLocation = location.currentTarget.getAttribute("data-className");
            let shouldBeRemoved = false;
            console.log(this.ships)
            this.ships.forEach((ship, i) => {
                ship.locations.forEach(location => {
                    if (location.includes(hoverLocation)) {
                        //                        alert("relocated")
                        shouldBeRemoved = true;
                    }
                })
                if (shouldBeRemoved) {
                    ship.locations.forEach(location => {
                        let cell = document.getElementById("shipTable").querySelector(`.${location}`).classList.remove('ships')
                    })
                    //                    alert(ship.type)
                    ship.locations.splice(i, 1)
                    ship.locations = []
                    //                    this[ship.type].locations =[]
                    this.placedShip = ship.type
                    this.shipOrientation = "horizontal"

                }
                shouldBeRemoved = false;
            })
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

        defineSalvo(location) {
            let hoverLocation = location.currentTarget.getAttribute("data-className");
            this.placingSalvoLocation = location
            console.log(location)
            if (this.isAbletoPlaceSalvo(location) == false) {
                document.getElementById("salvoTable").querySelector(`.${hoverLocation}`).classList.add("salvo3")
            } else {
                document.getElementById("salvoTable").querySelector(`.${hoverLocation}`).classList.add("error_hover")
            }

        },

        removeSalvoHover(location) {
            let hoverLocation = location.currentTarget.getAttribute("data-className");
            document.getElementById("salvoTable").querySelector(`.${hoverLocation}`).classList.remove("salvo3")
            document.getElementById("salvoTable").querySelector(`.${hoverLocation}`).classList.remove("error_hover")
        },

        placeSalvoOnGrid(location) {
            this.changeTurn();
            let hoverLocation = location.currentTarget.getAttribute("data-className");
            this.sendAllsalvos.turn = this.turn
            this.sendAllsalvos.locations = hoverLocation
            console.log(this.salvos)
            console.log(this.turn)
            console.log(hoverLocation)
            let noOverlap = true;
            this.allSalvos.forEach(salvo => {
                if (salvo.includes(hoverLocation)) {
                    alert("Warning!! could not place here.")
                    noOverlap = false
                }
            })
            //            else {
            if (this.sendAllsalvos.length < 5 && noOverlap) {

                console.log(location.toElement.attributes[0].nodeValue)
                //                        console.log( document.getElementById("salvoTable").querySelector(`.${location.toElement.attributes[0].nodeValue}`))
                document.getElementById("salvoTable").querySelector(`.${location.toElement.attributes[0].nodeValue}`).classList.add("salvo2")
                document.getElementById("salvoTable").querySelector(`.${location.toElement.attributes[0].nodeValue}`).innerHTML = this.sendAllsalvos.turn;
                console.log(hoverLocation)
                
                if(!this.isAbletoPlaceSalvo(location)) {
                     this.sendAllsalvos.push(hoverLocation)
                }
               

            } else if (noOverlap) {

                alert("Warning!! No more salovs in this turn!!!!")
            }
            //            }
        },
        
        changeTurn(){
//                        this.turn = this.salvos.length + 1;
        let currentPlayerTotalTurn = this.salvos.filter(salvo=>salvo.gamePlayerId==this.gamePlayerId);
        this.turn = currentPlayerTotalTurn .length + 1;
        },

        isAbletoPlaceSalvo(location) {
             let hoverLocation = location.currentTarget.getAttribute("data-className");
            this.allSalvos = []
            for (var i = 0; i < this.salvos.length; i++) {
                if (this.salvos[i].gamePlayerId == this.gamePlayerId) {
                    for (var j=0 ; j < this.salvos[i].locations.length; j++) {
                        this.allSalvos.push(this.salvos[i].locations[j])
                    }
                    //                    this.allSalvos.filter()
                }
            }

            //            this.allSalvos = [].concat.apply([], this.salvos.map(oneSalvo => oneSalvo.locations))
            if (this.allSalvos.length == 0) {
                return false
            } else {
                //nomore placingSalvoLocation 
                if (this.allSalvos.includes(hoverLocation) || this.sendAllsalvos.includes(hoverLocation) ) {
                    return true
                }
                return false
            }

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
