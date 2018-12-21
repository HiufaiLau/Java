package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String email;

    @OneToMany(mappedBy="player", fetch= FetchType.EAGER)
    @OrderBy("id asc")
    Set<GamePlayer> gamePlayers = new HashSet<>();

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    private Set<Score> scores = new HashSet<>();


    public Player() {
    }

    public Player(String email) {
        this.email = email;
    }

    @JsonIgnore
    public Long getPlayerId() {
        return id;
    }

    public void setPlayerId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void addGamePlayer(GamePlayer gamePlayer){
        gamePlayer.setPlayer(this);
        gamePlayers.add(gamePlayer);
    }

    @JsonIgnore
    public List<Game> getGames() {
        return gamePlayers.stream().map(gamePlayer -> gamePlayer.getGame()).collect(toList());
    }

    public void addScore(Score score){
        score.setPlayer(this);
        scores.add(score);
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

}




