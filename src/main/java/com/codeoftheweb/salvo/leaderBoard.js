var scoreData = new Vue({

    el: '#leaderBoard',
    data: {
        // urlGame:"",
        gameScoreData: [],
        top25score: [],
        won: 0,
        lost: 0,
        tied: 0,
        gameUrl: 'http://localhost:8080/api/leaderBoard',
        isLoading: true,

    },
    created() {

        this.fetchGameScore(this.gameUrl)

    },
    methods: {
        fetchGameScore(url) {
            fetch(url, {
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
        },
    }
})
