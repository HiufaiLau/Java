package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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


    @RequestMapping(path = "/players", method = RequestMethod.POST)
//    @OrderBy("Id asc")
    public ResponseEntity<Map<String, Object>> createPlayer(String email, String password) {

        if (email.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>(responseEntity("error", "please fill in all information"), HttpStatus.FORBIDDEN);
        }

        Player player = playerRepository.findByUserName(email);
        if (player != null) {
            return new ResponseEntity<>(responseEntity("error", "username is already exists"), HttpStatus.FORBIDDEN);
        }

        Player newPlayer = playerRepository.save(new Player(email, password));
        return new ResponseEntity<>(responseEntity("newPlayer", newPlayer.getEmail()), HttpStatus.CREATED);

    }

    private Map<String, Object> responseEntity(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    @RequestMapping("/games")
    public Map<String, Object> Games(Authentication authentication) {
        Map<String, Object> game = new HashMap<>();
        if (isGuest(authentication)) {
            game.put("isLogin", null);
        } else {
            Player loginPlayer = getLoginPlayer(authentication);
            game.put("isLogin", getPlayerInfo(loginPlayer));
        }
        List<Object> listOfGames = new ArrayList<>();
        gameRepository.findAll()
                .stream()
                .forEach(oneGame -> listOfGames.add(new LinkedHashMap<String, Object>() {{
                    put("gameId", oneGame.getGameId());
                    put("CreationDate", oneGame.getDate());
//                    put("finsihedDate", getFinishDate(oneGame));
                    put("GamePlayers", oneGame.getGamePlayers().stream()
                            .map(gp -> new LinkedHashMap<String, Object>() {{
                                put("GamePlayerID", gp.getGamePlayerId());
                                put("Player", getPlayerInfo(gp.getPlayer()));
                                put("score", gp.getScore(oneGame));
                            }}).collect(Collectors.toSet()));
                }}));
        game.put("listOfGames", listOfGames);
        return game;
    }

    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

    private Player getLoginPlayer(Authentication authentication) {
        return !isGuest(authentication)
                ? playerRepository.findByUserName(authentication.getName())
                : null;
    }

    @RequestMapping(value = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createNewGame(Authentication auth) {
        if (auth.getName().isEmpty()) {
            return new ResponseEntity<>(responseEntity("error", "No player is given"), HttpStatus.FORBIDDEN);
        } else {
            Date date = new Date();
            Game game = new Game(date);
            Player player = playerRepository.findByUserName(auth.getName());
            GamePlayer gamePlayer = new GamePlayer(date);
            gamePlayerRepository.save(gamePlayer);
            game.addGamePlayer(gamePlayer);
            player.addGamePlayer(gamePlayer);
            gameRepository.save(game);
            playerRepository.save(player);
            return new ResponseEntity<>(responseEntity("gpId", gamePlayer.getGamePlayerId()), HttpStatus.CREATED);
        }
    }

    @RequestMapping(value = "/game/{nn}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable("nn") Long gameId, Authentication auth) {
        Game game = gameRepository.findOne(gameId);
        Player player = playerRepository.findByUserName(auth.getName());
        if (auth.getName().isEmpty()) {
            return new ResponseEntity<>(responseEntity("loginStatus", "not login"), HttpStatus.UNAUTHORIZED);
        }
        if (game == null) {
            return new ResponseEntity<>(responseEntity("gameStatus", "No such game"), HttpStatus.FORBIDDEN);
        }
        if (game.getPlayers().size() > 1) {
            return new ResponseEntity<>(responseEntity("gameError", "Game is full"), HttpStatus.FORBIDDEN);
        }
        if (game.getPlayers().contains(player)) {
            return new ResponseEntity<>(responseEntity("gameError","You already joined this game"),HttpStatus.CONFLICT);
        } else {
            Date date = new Date();
            GamePlayer gamePlayer = new GamePlayer(date);

            gamePlayerRepository.save(gamePlayer);
            gameRepository.save(game);
            playerRepository.save(player);
            game.addGamePlayer(gamePlayer);
            player.addGamePlayer(gamePlayer);
            gameRepository.save(game);
            playerRepository.save(player);
            return new ResponseEntity<>(responseEntity("gpId", gamePlayer.getGamePlayerId()), HttpStatus.CREATED);
        }
    }

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
    private Map<String, Object> getOneGame(@PathVariable long gamePlayerId, Authentication auth) {
        GamePlayer gp = gamePlayerRepository.findOne(gamePlayerId);

        if (auth.getName() == gp.getPlayer().getEmail()) {
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
        } else {
            return responseEntity("Wrong user", HttpStatus.FORBIDDEN);
        }
    }
}


