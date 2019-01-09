package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long scoreId;
    private double score;
    private Date finishDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    public Score() { }
    public Score(Date finishDate, double score){
        this.finishDate = finishDate;
        this.score = score;
    }

    public long getScoreId() {
        return scoreId;
    }

    public void setScoreId(long scoreId) {
        this.scoreId = scoreId;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public Date getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(Date finishDate) {
        this.finishDate = finishDate;
    }

    @JsonIgnore
    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    @JsonIgnore
    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }
}

//@Entity
//public class Score {
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
//    @GenericGenerator(name = "native", strategy = "native")
//    private Long id;
//
//    @CreationTimestamp
//    private Date finishdate;
//
//    private double playersScore;
//
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name="player_id")
//    private Player player;
//
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name="game_id")
//    private Game game;
//
//    public Score() {}
//
//    public Score(double playersScore, Game game, Player player) {
//        this.playersScore += playersScore;
//        this.game = game;
//        this.player = player;
//    }
//
//    public Long getScoreId() {
//        return id;
//    }
//
//    public void setScoreId(Long id) {
//        this.id = id;
//    }
//
//    public Date getFinishdate() {
//        return finishdate;
//    }
//
//    public void setFinishdate(Date finishdate) {
//        this.finishdate = finishdate;
//    }
//
//    public double getPlayersScore() {
//        return playersScore;
//    }
//
//    public void setPlayersScore(double playersScore) {
//        this.playersScore = playersScore;
//    }
//
//    public Player getPlayer() {
//        return player;
//    }
//
//    public void setPlayer(Player player) {
//        this.player = player;
//    }
//
//    public Game getGame() {
//        return game;
//    }
//
//    public void setGame(Game game) {
//        this.game = game;
//    }
//}
