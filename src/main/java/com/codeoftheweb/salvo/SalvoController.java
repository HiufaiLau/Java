package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.OrderBy;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    private ShipRepository shipRepository;
    @Autowired
    private SalvoRepository salvoRepository;
    @Autowired
    private ScoreRepository scoreRepository;


    @RequestMapping("/players")
    @OrderBy("Id asc")
    public List<Player> getPlayerId() {
        return playerRepository.findAll();
    }

    @RequestMapping("/games")
    public Set<LinkedHashMap<String, Object>> Games() {
//        new HashMap<String, Object>(){{
////            put("id", 2);
////        }};
        return gameRepository.findAll()
                .stream()
                .map(game -> new LinkedHashMap<String, Object>() {{
                    put("GameID", game.getGameId());
                    put("CreationDate", game.getDate());
                    put("finsihed date", getFinishDate(game));
                    put("GamePlayers", game.getGamePlayers().stream()
                            .map(gp -> new LinkedHashMap<String, Object>() {{
                                put("GamePlayerID", gp.getGamePlayerId());
                                put("Player", getPlayerInfo(gp.getPlayer()));
                                put("score", gp.getScore(game));
                            }}).collect(Collectors.toSet()));
                }}).collect(Collectors.toSet());
    }
    //or use this structure
//    return new LinkedHashMap<String, Object>() {
//        {
//            put("gameId", gp.getGame().getGameId());
//            put("created", gp.getGame().getDate());
//            put("gamePlayers",getAllGameplayers(gp.getGame()));
//            put("ships", getAllships(gp.getShips()));
//            put("salvos", getAllSalvos(gp.getGame().getGamePlayers()));
//        }
//    };


    @RequestMapping("/leaderBoard")
    public List<HashMap<String, Object>> getPlayersScore() {
        return playerRepository.findAll()
                .stream()
                .map(player -> new LinkedHashMap<String, Object>() {{
                    put("player", player.getEmail());
                    put("scores", player.getScores()
                            .stream()
                            .map(score -> score.getScore()).collect(toList()));
                }}).collect(toList());
    }


    private Map<String, Object> getGamePlayerInfo(GamePlayer gamePlayer) {
        return new LinkedHashMap<String, Object>() {{
            put("gamePlayerID", gamePlayer.getGamePlayerId());
        }};
    }


    private Map<String, Object> getPlayerInfo(Player player) {
        return new LinkedHashMap<String, Object>() {{
            put("playerID", player.getPlayerId());
//            put("name",player.getName());
            put("email", player.getEmail());
        }};
    }

    private List<LinkedHashMap<String, Object>> getAllGameplayers(Game game) {
        return game.getGamePlayers()
                .stream()
                .map(gamePlayer -> new LinkedHashMap<String, Object>() {{
                    put("gamePlayerID", gamePlayer.getGamePlayerId());
                    put("player", getPlayerInfo(gamePlayer.getPlayer()));

                }}).collect(toList());
    }

    private List<Map<String, Object>> getAllships(Set<Ship> ships) {
        return ships.stream()
                .map(ship -> new LinkedHashMap<String, Object>() {{
                    put("type", ship.getType());
                    put("locations", ship.getLocations());
                }})
                .collect(toList());
    }

    //    @RequestMapping("/salvos")
    private List<Map<String, Object>> getAllSalvos(Set<GamePlayer> gps) {
        return gps.stream()
                .flatMap(gp -> gp.getSalvoes().stream()
                        .map(salvo -> new LinkedHashMap<String, Object>() {{
                            put("gamePlayerId", salvo.getGamePlayer().getPlayer().getPlayerId());
                            put("turn", salvo.getTurn());
                            put("locations", salvo.getSalvoLocations());
                        }})
                ).collect(toList());
    }

    private Map<String, Object> getScores(GamePlayer gp) {
        List<Score> scores = scoreRepository.findAll()
                .stream()
                .filter(score -> score.getPlayer().equals(gp.getPlayer()))
                .collect(toList());

        if (scores.size() == 0) return null;
        Double WON_SCORE = 1.0;
        Double TIE_SCORE = 0.5;
        Double LOST_SCORE = 0.0;

        return new LinkedHashMap<String, Object>() {{
            put("name", gp.getPlayer().getEmail());
            put("total", getTotalScore(scores));
            put("won", countScore(scores, WON_SCORE));
            put("lost", countScore(scores, LOST_SCORE));
            put("tied", countScore(scores, TIE_SCORE));
        }};
    }

    private Long countScore(List<Score> allScores, Double scores) {
        return allScores
                .stream()
                .filter(score -> scores.equals(score.getScore()))
                .count();
    }

    private Double getTotalScore(List<Score> scores) {
        return scores
                .stream()
                .mapToDouble(Score::getScore)
                .sum();
    }


    private Map<String, Object> showAllScores(Player p) {
        return new LinkedHashMap<String, Object>() {{
            put("id", p.getPlayerId());
            put("player", p.getEmail());
//            put("finsihed date",p.getScores());
            put("score", p.getScores());
        }};
    }

    public Date getFinishDate(Game game) {
        return game.getScores()
                .stream()
                .findFirst()
                .map(score -> score.getFinishDate())
                .orElse(null);
    }

    @RequestMapping("/game_view/{gamePlayerId}")
    private Map<String, Object> getOneGame(@PathVariable long gamePlayerId) {
        GamePlayer gp = gamePlayerRepository.findOne(gamePlayerId);
        return new LinkedHashMap<String, Object>() {
            {
                put("gameId", gp.getGame().getGameId());
                put("created", gp.getGame().getDate());
                put("gamePlayers", new ArrayList<LinkedHashMap<String, Object>>() {{
                    add(new LinkedHashMap<String, Object>() {{
                        gp.getGame().getGamePlayers().stream()
                                .forEach(gamePlayer -> put("players", getAllGameplayers(gp.getGame())));
                    }});
                }});
                put("ships", getAllships(gp.getShips()));
                put("salvos", getAllSalvos(gp.getGame().getGamePlayers()));
            }
        };
    }

    public Player currentUser(Authentication authentication) {
        if (userIsLogged(authentication)) {
            return playerRepository.findByUserName(authentication.getName());
        }
        return null;
    }

    public Boolean userIsLogged (Authentication authentication) {
        if (authentication == null) {
            return false;
        } else {
            return true;
        }
    }
}