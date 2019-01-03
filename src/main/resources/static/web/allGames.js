var allData = new Vue({
    el: '#game',
    data: {
        //        gameUrl: 'http://localhost:8080/api/games',
        //        gameUrl: 'http://localhost:8080/api/leaderBoard',
        gameData: [],
        gameScoreData: [],
        isLoading: true,
        date: [],

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
                this.login();
                this.logout();
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

        //        fetchGame(url1, {
        //            method: 'GET',
        //        })
        //        .then(response => response.json())
        //        .then(data => {
        //            this.isLoading = false;
        //            this.gameData = data;
        //            console.log(this.gameData)
        //            allData.dateConvert();
        //        })
        //        .catch(function (error) {
        //            console.log(error);
        //        });


        //        fetchGameScore(url, {
        //            method: 'GET',
        //        })
        //        .then(response => response.json())
        //        .then(data => {
        //            this.isLoading = false;
        //            this.gameScoreData = data;
        //            console.log(this.gameScoreData)
        //
        //            this.calculateTotalScore();
        //            console.log(this.gameScoreData);
        //            this.calculateScores();
        //            console.log(this.gameScoreData);
        //
        //        });


        login(evt) {
            evt.preventDefault();
            var form = evt.target.form;
         
               $.post("/api/login", { username: "j.bauer@ctu.gov", password: "123" }).done(function() { console.log("logged in!"); })
        }

        logout(evt) {
            evt.preventDefault();
            
               $.post("/api/logout").done(function() { console.log("logged out"); })
        }

        dateConvert() {
            this.gameData.map(game => game.CreationDate = new Date(game.CreationDate).toLocaleString())
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
