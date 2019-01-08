var allData = new Vue({
    el: '#game',
    data: {
        //        gameUrl: 'http://localhost:8080/api/games',
        //        gameUrl: 'http://localhost:8080/api/leaderBoard',
        gameData: [],
        gameScoreData: [],
        isLoading: true,
        date: [],
        email: "",
        password: "",
        createEmail: "",
        createPassword: "",
        signIn: true,
        //        loginOrSignUp: true,
        //        loginOrBody: true,
        top25score: [],
        won: 0,
        lost: 0,
        tied: 0,

    },
    beforeCreate() {

        fetch('http://localhost:8080/api/games', {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
                this.isLoading = false;
                this.gameData = data;
                console.log(this.gameData)
                allData.dateConvert();
                return fetch('http://localhost:8080/api/leaderBoard', {
                    method: 'GET',
                })

            })
            .then(response => response.json())
            .then(data => {
                this.isLoading = false;
                //                this.login();
                //                this.logout();
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


        //               fetch('http://localhost:8080/api/games', {
        //                    method: 'GET',
        //                })
        //                .then(response => response.json())
        //                .then(data => {
        //                    this.isLoading = false;
        //                    this.gameData = data;
        //                    console.log(this.gameData)
        //                    allData.dateConvert();
        //                })
        //                .catch(function (error) {
        //                    console.log(error);
        //                });
        //               
        //               fetch('http://localhost:8080/api/leaderBoard', {
        //                    method: 'GET',
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
        //               });



    },
    methods: {


        loginForm() {
            //            let email = () => document.getElementById("email-login").value
            //            let password = () => document.getElementById("pass-login").value


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
                    alert("Can't login: wrong user or pass");
                } else {
                    alert("A problem has occurred: " + response.status);
                }
            }).catch(error => console.log("An error has ocurred: ", error))

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
                } else if (response.status === 401) {
                    alert("Can't login: wrong user or pass");
                }
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

        dateConvert() {
            this.gameData.listOfGames.map(game => game.CreationDate = new Date(game.CreationDate).toLocaleString())
        },

        calculateTotalScore() {
            for (var i = 0; i < this.gameScoreData.length; i++) {
                this.gameScoreData[i]["totalScore"] =
                    this.gameScoreData[i].scores
                    .reduce((a, b) => a + b, 0) || "Not Finish";
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
