package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String type;
    private Integer hit = 0;
    //    private Integer shipLength;
    private Integer countSunk = 0;
    private Boolean sunk = false;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayer_id")
    private GamePlayer gamePlayer;


    @ElementCollection
    private List<String> locations = new ArrayList<>();

    @ElementCollection
    @Column(name = "shipHit")
    private Set<String> hits = new HashSet<>();



    public Ship() {
    }

    public Ship(String type, List<String> locations) {
        this.type = type;
        this.locations = locations;
//        this.hit=0;
//        this.shipLength = locations.size();
        this.countSunk = 0;
        this.sunk = false;
    }

    public Long getShipId() {
        return id;
    }

    public void setShipId(Long id) {
        this.id = id;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public List<String> getLocations() {
        return locations;
    }

    public void setLocations(List<String> locations) {
        this.locations = locations;
    }

    @JsonIgnore
    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public Integer getHit() {
        return hit;
    }

    public void setHit(Integer hit) {
        this.hit = hit;
    }

//    public Integer getShipLength() {
//        return shipLength;
//    }
//
//    public void setShipLength(Integer shipLength) {
//        this.shipLength = shipLength;
//    }

    public Boolean getSunk() {
        return sunk;
    }

    public void setSunk(Boolean sunk) {
        this.sunk = sunk;
    }

    public Integer getCountSunk() {
        return countSunk;
    }

    public void setCountSunk(Integer countSunk) {
        this.countSunk = countSunk;
    }

    public Set<String> getHits() {
        return hits;
    }

    public void setHits(Set<String> hits) {
        this.hits = hits;
    }

}