package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private Date date;


    @OneToMany(mappedBy="game", fetch= FetchType.EAGER)
    @OrderBy("id asc")
    Set<GamePlayer> gamePlayers = new HashSet<>();

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    private Set<Score> scores = new HashSet<>();

    public Game() {}

    public Game(Date date){
        this.date = date;
    }

    @JsonIgnore
    public Long getGameId() {
        return id;
    }

    public void setGameId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }


    @JsonIgnore
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

    public void addGamePlayer(GamePlayer gamePlayer){
        gamePlayer.setGame(this);
        gamePlayers.add(gamePlayer);
    }

    @JsonIgnore
    public List<Player> getPlayers() {
        return gamePlayers.stream().map(gamePlayer -> gamePlayer.getPlayer()).collect(toList());
    }

    public void addScore(Score score){
        score.setGame(this);
        scores.add(score);
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }
}
