var allData = new Vue({
    el: '#game',
    data: {
        //        gameUrl: 'http://localhost:8080/api/games',
        //        gameUrl: 'http://localhost:8080/api/leaderBoard',
        gameData: [],
        gameUrl: ['http://localhost:8080/api/games', 'http://localhost:8080/api/leaderBoard'],
        gameScoreData: [],
        isLoading: true,
        date: [],
        email: "",
        password: "",
        createEmail: "",
        createPassword: "",
        response: [],
        signIn: true,
//        top25score: [],
        won: 0,
        lost: 0,
        tied: 0,

    },
    beforeCreate(urlArr) {
        //            fetch('http://localhost:8080/api/games', {
        //                    method: 'GET',
        //                })
        //                .then(response => response.json())
        //                .then(data => {
        //                    this.isLoading = false;
        //                    this.gameData = data;
        //                    console.log(this.gameData)
        //    
        //                    console.log(data.listOfGames[0].GamePlayers[0].GamePlayerID)
        //                    console.log(data.listOfGames[0].GamePlayers[1].GamePlayerID)
        //    //                this.backToGame()
        //    
        //                    allData.dateConvert();
        //                    return fetch('http://localhost:8080/api/leaderBoard', {
        //                        method: 'GET',
        //                    })
        //    
        //                })
        //                .then(response => response.json())
        //                .then(data => {
        //                    this.isLoading = false;
        //                    this.gameScoreData = data;
        //                    console.log(this.gameScoreData)
        //                    this.calculateTotalScore();
        //                    console.log(this.gameScoreData);
        //                    this.calculateScores();
        //                    console.log(this.gameScoreData);
        //                })
        //                .catch(function (error) {
        //                    console.log(error);
        //                });

        //        },

        fetch('http://localhost:8080/api/games', {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
                this.isLoading = false;
                this.gameData = data;
                console.log(this.gameData)
                allData.dateConvert();
            })
            .catch(function (error) {
                console.log(error);
            });

        fetch('http://localhost:8080/api/leaderBoard', {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
                this.isLoading = false;
                this.gameScoreData = data;
                console.log(this.gameScoreData)
                this.calculateTotalScore();
                console.log(this.gameScoreData);
                this.calculateScores();
                console.log(this.gameScoreData);
            })
            .catch(function (error) {
                console.log(error);
            });
    },


    //    created() {
    //        this.fetchGame(this.gameUrl);
    //    },

    methods: {
        //        fetchGame(gameUrlArr) {
        //            Promise.all(gameUrlArr.map(url => fetch(url)
        //                    .then(response => response.json())))
        //                .then(data => {
        //                    this.isLoading = false;
        //                    this.gameData = data;
        //                    console.log(this.gameData)
        //                    console.log(data.listOfGames[0].GamePlayers[0].GamePlayerID)
        //                    console.log(data.listOfGames[0].GamePlayers[1].GamePlayerID)
        //                    allData.dateConvert();
        //                    this.gameScoreData = data;
        //                    console.log(this.gameScoreData)
        //                    this.calculateTotalScore();
        //                    console.log(this.gameScoreData);
        //                    this.calculateScores();
        //                    console.log(this.gameScoreData);
        //                })
        //                .catch(function (error) {
        //                    console.log(error);
        //                });
        //        },

        loginForm() {
            fetch('http://localhost:8080/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "email=" + this.email + "&password=" + this.password
            }).then(response => {
                if (response.status === 200) {
                    window.location.reload()
                } else if (response.status === 401) {
                    alert("Can't login: please register first");
                } else {
                    alert("Sorry !! No Authurization");
                }
            }).catch(error => console.log("An error has ocurred: ", error))

        },
        
        alert(){
        
            alert("Success !! Your are registered ")
        },

        getPlayer() {
            fetch('http://localhost:8080/api/players', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "email=" + this.createEmail + "&password=" + this.createPassword
            }).then(response => {
                if (response.status === 200) {
                    window.location.reload();
                    gameData.userEmail = gameData.addEmail;
                    gameData.userPassword = gameData.addPassword;
                    this.loginForm();
                    console.log(response)
                } 
//                else if (response.status === 401) {
//                    alert("Can't login: please register first");
//                };
                
            }).catch(error => console.log("An error has ocurred: ", error))

        },

        showSignin() {
            this.signIn = false;
        },
        hideSignin() {
            this.signIn = true;
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
        
        backToGame(gpId){
            location.assign(`http://localhost:8080/web/game.html?gp=${gpId}`);
        },

        createNewGame() {
            fetch("http://localhost:8080/api/games", {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(repsonse => repsonse.json())
                .then(data => {
                    console.log(data)
                    //                        location.href=`http://localhost:8080/web/game.html?gp=${data.gamePlayerId}`
                    location.assign(`http://localhost:8080/web/game.html?gp=${data.gpId}`);

                })
                .catch(error => {
                    console.log('Request failure: ', error);
                    alert("Failure");
                });
        },

        joinGame(gameId) {
            fetch("/api/game/" + gameId + "/players", {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    console.log(response)
                    if (response.status == 403) {
                        alert("The game is full")
                    }
                    if (response.status == 401) {
                        alert("You are not logged in")
                    }
                    if (response.status == 409) {
                        alert("You are already in this game")
                    }
                    return response.json()

                })
                .then(data => {
                    //                    window.location.reload()
                    location.assign(`http://localhost:8080/web/game.html?gp=${data.gpId}`);
                })

        },

        checkGamePlayer(game) {
//            console.log(game)
            if (game.GamePlayers.length > 1) {
                return false
            }
            if (this.gameData.isLogin.playerID == game.GamePlayers[0].Player.playerID) {
                return false
            }
            return true
            
        },
     
        
        
        dateConvert() {
            this.gameData.listOfGames.map(game => game.CreationDate = new Date(game.CreationDate).toLocaleString())
        },

        calculateTotalScore() {
            for (var i = 0; i < this.gameScoreData.length; i++) {
                this.gameScoreData[i]["totalScore"] =
                    this.gameScoreData[i].scores
                    .reduce((a, b) => a + b, 0) || "No Score";
            }
        },

        calculateScores() {
            for (var i = 0; i < this.gameScoreData.length; i++) {
                let won = 0;
                let tied = 0;
                let lost = 0;
                if (this.gameScoreData[i].scores.length > 0) {
                    this.gameScoreData[i].scores.map(score => {
                        if (score == 1) {
                            won++
                        } else if (score >= 0.5) {
                            tied++
                        } else if (score == 0) {
                            lost++
                        } else {
                            "No game!"
                        }
                        this.gameScoreData[i]["won"] = won;
                        this.gameScoreData[i]["tied"] = tied;
                        this.gameScoreData[i]["lost"] = lost;
                    })
                } else {
                    this.gameScoreData[i]["won"] = "/";
                    this.gameScoreData[i]["tied"] = "/";
                    this.gameScoreData[i]["lost"] = "/";
                }
            }
        }
    }
})
