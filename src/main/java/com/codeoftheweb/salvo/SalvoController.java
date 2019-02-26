package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    private Boolean gameOverCall = false;

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
            return new ResponseEntity<>(responseEntity("loginStatus", "please login"), HttpStatus.UNAUTHORIZED);
        }
        if (game == null) {
            return new ResponseEntity<>(responseEntity("gameStatus", "No such game"), HttpStatus.FORBIDDEN);
        }
        if (game.getPlayers().size() > 1) {
            return new ResponseEntity<>(responseEntity("gameError", "Game is full"), HttpStatus.FORBIDDEN);
        }
        if (game.getPlayers().contains(player)) {
            return new ResponseEntity<>(responseEntity("gameError", "You already joined this game"), HttpStatus.CONFLICT);
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

    @RequestMapping(value = "/games/players/{gpId}/ships", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> addShips(Authentication auth, @PathVariable long gpId,
                                                        @RequestBody ArrayList<Ship> shipArray) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(gpId);
        Player player = playerRepository.findByUserName(auth.getName());
        GamePlayer opponent = getOpponent(gamePlayer);
        if (auth.getName().isEmpty()) {
            return new ResponseEntity<>(responseEntity("loginStatus", "please login"), HttpStatus.UNAUTHORIZED);
        }
        if (!gamePlayerRepository.existsById(gpId)) {
            return new ResponseEntity<>(responseEntity("error", "GamePlayer doesn't exist."), HttpStatus.FORBIDDEN);
        }

        if (gamePlayer.getPlayer().getPlayerId() != player.getPlayerId()) {
            return new ResponseEntity<>(responseEntity("error", "You are not in this game."), HttpStatus.UNAUTHORIZED);
        }
        if (gamePlayer.getShips().size() > 0) {
            return new ResponseEntity<>(responseEntity("gameStatus", "Ships are already placed."), HttpStatus.FORBIDDEN);
        }
//

//        Map<String,Object>placeShips = new HashMap<>();
        shipArray.forEach(ship -> {

            gamePlayer.addShip(ship);
            shipRepository.save(ship);
//            placeShips.put("shipId",ship.getShipId());
//            placeShips.put("type", ship.getType());
//            placeShips.put("locations", ship.getLocations());
//            gamePlayerRepository.save(gamePlayer);

        });
        return new ResponseEntity<>(responseEntity("success", "Ships are placed"), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/games/players/{gamePlayerId}/salvos", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> getSalvoLocation(@PathVariable Long gamePlayerId, Authentication auth, @RequestBody Salvo salvo) {
//            System.out.println(salvo);
        GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId);
        Player player = playerRepository.findByUserName(auth.getName());
        GamePlayer opponent = getOpponent(gamePlayer);

        if (auth.getName().isEmpty()) {
            return new ResponseEntity<>(responseEntity("loginStatus", "please login"), HttpStatus.UNAUTHORIZED);
        }
        if (gamePlayer.getPlayer().getPlayerId() != player.getPlayerId()) {
            return new ResponseEntity<>(responseEntity("error", "You are not in this game."), HttpStatus.UNAUTHORIZED);
        }
        if (gamePlayer == null) {
            return new ResponseEntity<>(responseEntity("gameStatus", "No such game"), HttpStatus.FORBIDDEN);
        }
        if (!gamePlayerRepository.existsById(gamePlayerId)) {
            return new ResponseEntity<>(responseEntity("error", "GamePlayer doesn't exist."), HttpStatus.FORBIDDEN);
        }
        if (ifSalvoIsPlaced(gamePlayer, salvo)) {
            return new ResponseEntity<>(responseEntity("error", "Sorry, could not place salvos."), HttpStatus.FORBIDDEN);
        }

        if (opponent.getSalvoes().size() < gamePlayer.getSalvoes().size()) {
            return new ResponseEntity<>(responseEntity("gameStatus", "Sorry, please wait for the opponent to place salvos"), HttpStatus.FORBIDDEN);
        }

//        System.out.println("before " + getHitResults(gamePlayer));
//        if(getHitResults(gamePlayer).size()>0 && getHitResults(gamePlayer).get(getHitResults(gamePlayer).size()-1).get("gameIsOver").equals(true)){
//            System.out.println("after " + getHitResults(gamePlayer).get(getHitResults(gamePlayer).size()-1).get("gameIsOver"));
//            return new ResponseEntity<>(responseEntity("gameStatus","Gameover !!!"),HttpStatus.FORBIDDEN);
//        }
        if (gameOverCall == true && getHitResults(gamePlayer).size()==5 || getHitResults(getOpponent(opponent)).size()==5) {
            return new ResponseEntity<>(responseEntity("gameStatus", "Gameover !!!"), HttpStatus.FORBIDDEN);
        }


        if (opponent != null && opponent.getShips().size() != 5) {
            return new ResponseEntity<>(responseEntity("error", "Please wait for the opponent to place ships."), HttpStatus.FORBIDDEN);
        }
        gamePlayer.addSalvo(salvo);
        salvoRepository.save(salvo);

        return new ResponseEntity<>(responseEntity("success", "The salvos are added"), HttpStatus.CREATED);
    }

    private boolean ifSalvoIsPlaced(GamePlayer gamePlayer, Salvo salvo) {
        if (gamePlayer.getSalvoes().size() > 0) {
            gamePlayer.getSalvoes().stream().map(salvos -> {
                if (salvos.getTurn() == salvo.getTurn()) {
                    return true;
                }
                return false;
            });
        }
        return false;
    }

    @RequestMapping("/leaderBoard")
    public List<HashMap<String, Object>> getPlayersScore() {
        return playerRepository.findAll()
                .stream()
                .map(player -> new LinkedHashMap<String, Object>() {{
                    put("player", player.getEmail());
//                    put("scores", showAllScores());
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
                    put("shipId", ship.getShipId());
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
                            put("gamePlayerId", salvo.getGamePlayer().getGamePlayerId());
                            put("turn", salvo.getTurn());
                            put("locations", salvo.getSalvoLocations());
                        }})
                ).collect(toList());
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
                    put("hits", getHitData(gp));
                    put("lastTurn", getTurns(gp));
                    put("winner", checkIfGameIsOver(gp));
                }
            };
        } else {
            return responseEntity("Wrong user", HttpStatus.FORBIDDEN);
        }
    }

    private GamePlayer getOpponent(GamePlayer gamePlayer) {
        Game game = gamePlayer.getGame();
        LinkedHashMap<String, GamePlayer> opponentMap = new LinkedHashMap<>();
        game.getGamePlayers()
                .forEach
                        (gp -> {
                            if (gp.getGamePlayerId() != gamePlayer.getGamePlayerId()) {
                                opponentMap.put("opponentPlayer", gp);
                            }
                        });
        return opponentMap.get("opponentPlayer");
    }


    private List<HashMap<String, Object>> getHitResults(GamePlayer gamePlayer) {
        List<Salvo> salvoList = gamePlayer.getSalvoes().stream().collect(toList());
        Comparator<Salvo> compareSalvo = new Comparator<Salvo>() {
            @Override
            public int compare(Salvo o1, Salvo o2) {
                return o1.getTurn().compareTo(o2.getTurn());
            }
        };

        Collections.sort(salvoList, compareSalvo);

        List<String> sunkShipList = new ArrayList<>();
        List<HashMap<String, Object>> hitList = new ArrayList<>();

        if (!salvoList.isEmpty()) {
            salvoList.forEach(salvo -> {
                HashMap<String, Object> hitMap = new LinkedHashMap<>();
                hitMap.put("turn", salvo.getTurn());
                hitMap.put("hits", getOneHit(salvo.getSalvoLocations(), gamePlayer, sunkShipList));
                hitMap.put("sunkShips", sunkShipList);

                if (sunkShipList.size() == 5) {
                    hitMap.put("gameIsOver", gameOver());
                } else {
                    hitMap.put("gameIsOver", gameIsNotOver());
                }

                hitList.add(hitMap);

            });
            System.out.println(hitList.get(hitList.size() - 1).get("gameIsOver"));
        }

        return hitList;
    }

    private Boolean gameOver() {
        gameOverCall = true;
        return true;
    }

    private Boolean gameIsNotOver() {
        gameOverCall = false;
        return false;
    }


    //
    public List<Map<String, Object>> getOneHit(List<String> salvoLocations, GamePlayer gamePlayer, List<String> sunkShipList) {
        List<Map<String, Object>> hitInfo = new ArrayList<>();

        getOpponent(gamePlayer).getShips().stream().forEach(ship -> {
            getOneHit2(salvoLocations, ship);
            LinkedHashMap<String, Object> oneHit = new LinkedHashMap<>();
//            for (int i = 0; i < salvoLocations.size(); i++) {
//                if (ship.getLocations().contains(salvoLocations.get(i))) {

                    oneHit.put("hitShipType", ship.getType());
//                    ship.getHits().add(salvoLocations.get(i));
                    oneHit.put("hitLocation", ship.getHits().toString());
//                    oneHit.put("hitLocation", salvoLocations.get(i));
//                    ship.setHit(ship.getHit() + 1);
//                    oneHit.put("totalHits", ship.getHit());
                    oneHit.put("totalHits", ship.getHits().size());
                    if (ship.getLocations().size() == ship.getHits().size()) {
                        ship.setSunk(true);
//                        checkTotalSunk();
                        oneHit.put("sunk", ship.getSunk());
                        if(ship.getSunk() == true && !sunkShipList.contains(ship.getType())){
                            sunkShipList.add(ship.getType());
                        }
//                        oneHit.put("sunkShip", sunkShipList);
//                        ship.setCountSunk(ship.getCountSunk() + 1);
//                        oneHit.put("countOneSunk", ship.getCountSunk());
//                        if (ship.getCountSunk() == 1) {
//                            sunkShipList.add(ship.getType());
////                            oneHit.put("sunkShips", sunkShipList);
//                        }
                    } else {
                        oneHit.put("sunk", ship.getSunk());
//                        oneHit.put("countOneSunk", ship.getCountSunk());
//                        oneHit.put("sunkShips", sunkShipList);
                    }
                    hitInfo.add(oneHit);
//                }
//            }
        });
        return hitInfo;
    }

    private void getOneHit2(List<String> salvoLocations, Ship ship){
        for (int i = 0; i < salvoLocations.size(); i++){
            if(ship.getLocations().contains(salvoLocations.get(i))){
                ship.getHits().add(salvoLocations.get(i));
            }
        }
    }


    private List<HashMap<String, Object>> getHitData(GamePlayer gamePlayer) {
        List<HashMap<String, Object>> hits = new ArrayList<>();
        HashMap<String, Object> localPlayer = new LinkedHashMap<>();
        localPlayer.put("gamePlayerId", gamePlayer.getGamePlayerId());
        localPlayer.put("hit", getHitResults(gamePlayer));
        hits.add(0, localPlayer);
        if(gamePlayer.getGame().getGamePlayers().size() == 2){
            HashMap<String, Object> opponentPlayer = new LinkedHashMap<>();
            opponentPlayer.put("gamePlayerId", getOpponent(gamePlayer).getGamePlayerId());
            opponentPlayer.put("hit", getHitResults(getOpponent(gamePlayer)));
            hits.add(1, opponentPlayer);
        }
        return hits;
    }


    private boolean checkSalvoTurn(GamePlayer gamePlayer, Salvo salvoLocations) {
        List<Integer> myTurnList = gamePlayer.getSalvoes().stream().map(salvo -> salvo.getTurn()).collect(Collectors.toList());
        if (myTurnList.contains(salvoLocations.getTurn())) {
            return true;
        } else {
            return false;
        }
    }

    private Map<String, Integer> getTurns(GamePlayer gamePlayer) {
        Map<String, Integer> turns = new LinkedHashMap<>();
        if (gamePlayer.getSalvoes().size() > 0) {
            turns.put("myLastTurn", checkLastTurn(gamePlayer));
        } else {
            turns.put("myLastTurn", null);
        }
        if (getOpponent(gamePlayer) != null && getOpponent(gamePlayer).getSalvoes().size() > 0) {
            turns.put("opponentLastTurn", checkLastTurn(getOpponent(gamePlayer)));
        } else {
            turns.put("opponentLastTurn", null);
        }
        return turns;
    }

    private Object checkIfGameIsOver(GamePlayer gamePlayer) {
        if (getOpponent(gamePlayer) != null) {
            Score score = new Score();
        if (checkLastTurn(gamePlayer) != null && checkLastTurn(getOpponent(gamePlayer)) != null && checkLastTurn(gamePlayer) == checkLastTurn(getOpponent(gamePlayer))) {
            System.out.println(getHitResults(gamePlayer).get(getHitResults(gamePlayer).size() - 1).get("gameIsOver"));
            if ((boolean) getHitResults(gamePlayer).get(getHitResults(gamePlayer).size() - 1).get("gameIsOver") == true &&
                    (boolean) getHitResults(getOpponent(gamePlayer)).get(getHitResults(getOpponent(gamePlayer)).size() - 1).get("gameIsOver") == true) {
                System.out.println("game is tie");
                score.setScore(0.5);
                score.setFinishDate(new Date());
                gamePlayer.getGame().addScore(score);
                gamePlayer.getPlayer().addScore(score);
                scoreRepository.save(score);
                return "tie";
            } else if((boolean) getHitResults(getOpponent(gamePlayer)).get(getHitResults(getOpponent(gamePlayer)).size() - 1).get("gameIsOver") == true){
                score.setScore(1.0);
                score.setFinishDate(new Date());
                gamePlayer.getGame().addScore(score);
                gamePlayer.getPlayer().addScore(score);
                scoreRepository.save(score);
                return gamePlayer.getPlayer().getEmail();
            }else if((boolean) getHitResults(gamePlayer).get(getHitResults(gamePlayer).size() - 1).get("gameIsOver") == true) {
                System.out.println("game is over");
                System.out.println();
                return getOpponent(gamePlayer).getPlayer().getEmail();
            }
            else {
                System.out.println("game is not over");
                return null;
            }
        }else{
            return null;
        }

        }
        else {
            System.out.println("i am not checking if the game is over yet");
            return null;
        }
    }
//
//    private String getWinner(GamePlayer gamePlayer) {
//        if (getOpponent(gamePlayer) != null) {
//            Score score = new Score();
//            if(checkIfGameIsOver(gamePlayer) != null){
//                if (checkIfGameIsOver(gamePlayer) == "tie" && checkIfGameIsOver(getOpponent(gamePlayer)) == "tie") {
//                    if (checkIfScoreAdded(gamePlayer)) {
//                        score.setScore(0.5);
//                        score.setFinishDate(new Date());
//                        gamePlayer.getGame().addScore(score);
//                        gamePlayer.getPlayer().addScore(score);
//                        scoreRepository.save(score);
//                    }
//                    return "tie";
//                }
////                else if ((boolean) checkIfGameIsOver(gamePlayer)) {
//////                if (checkIfScoreAdded(gamePlayer)) {
//////                    score.setScore(1.0);
//////                    score.setFinishDate(new Date());
//////                    gamePlayer.getGame().addScore(score);
//////                    gamePlayer.getPlayer().addScore(score);
//////                    scoreRepository.save(score);
//////                }
////                    return getOpponent(gamePlayer).getPlayer().getEmail();
////                } else if ((boolean) checkIfGameIsOver(getOpponent(gamePlayer))) {
//////                if (checkIfScoreAdded(gamePlayer)) {
//////                    score.setScore(0.0);
//////                    score.setFinishDate(new Date());
//////                    gamePlayer.getGame().addScore(score);
//////                    gamePlayer.getPlayer().addScore(score);
//////                    scoreRepository.save(score);
//////                }
////                    return gamePlayer.getPlayer().getEmail();
////                }
//                else {
//                    return checkIfGameIsOver(gamePlayer).toString();
//                }
//            }else{
//                return null;
//            }
//
//        } else {
//            return null;
//        }
//    }

    private boolean checkIfScoreAdded(GamePlayer gamePlayer) {
        if (gamePlayer.getGame().getScores().size() == 0) {
            return true;
        } else {
            List<Score> scoreList = gamePlayer.getPlayer().getScores().stream().filter(score -> score.getGame() == gamePlayer.getGame()).collect(Collectors.toList());
            if (scoreList.size() > 0) {
                return false;
            } else {
                return true;
            }
        }
    }


    private Integer checkLastTurn(GamePlayer gamePlayer) {
        if (gamePlayer.getSalvoes().size() > 0) {
            List<Integer> turnList = gamePlayer.getSalvoes().stream().map(salvo -> salvo.getTurn()).collect(Collectors.toList());
            Comparator<Integer> compareTurn = new Comparator<Integer>() {
                @Override
                public int compare(Integer o1, Integer o2) {
                    return o1.compareTo(o2);
                }
            };
            Collections.sort(turnList, compareTurn);
            return turnList.get(turnList.size() - 1);
        } else {
            return null;
        }

    }
//    private Map<String, Object> getScores(GamePlayer gp, Player p) {
//
//        List<Score> scores = scoreRepository.findAll()
//                .stream()
//                .filter(score -> score.getPlayer().equals(gp.getPlayer()))
//                .collect(toList());
//
//        if (scores.size() == 0) return null;
//        Double WON_SCORE = 1.0;
//        Double TIE_SCORE = 0.5;
//        Double LOST_SCORE = 0.0;
//
//        return new LinkedHashMap<String, Object>() {{
//            put("name", gp.getPlayer().getEmail());
//            put("total", getTotalScore(scores));
//            put("won", countScore(scores, WON_SCORE));
//            put("lost", countScore(scores, LOST_SCORE));
//            put("tied", countScore(scores, TIE_SCORE));
//        }};
//
//    }
//
//    //    private String findWinner (GamePlayer gp){
////        if(getOpponent(gp)!= null){
////            if(gameOver() && gp.getPlayer().getPlayerId() || gameOver() && getOpponent().getPlayer().getPlayerId())
////        }
////    }
//    private Long countScore(List<Score> allScores, Double scores) {
//        return allScores
//                .stream()
//                .filter(score -> scores.equals(score.getScore()))
//                .count();
//    }
//
//    private Double getTotalScore(List<Score> scores) {
//        return scores
//                .stream()
//                .mapToDouble(Score::getScore)
//                .sum();
//    }
//
//    private Map<String, Object> showAllScores(Player p, GamePlayer gamePlayer) {
//
//        return new LinkedHashMap<String, Object>() {{
//            put("id", p.getPlayerId());
//            put("player", p.getEmail());
////            put("finsihed date",p.getScores());
//            put("score", p.getScores());
//        }};
//    }
//
//    public Date getFinishDate(Game game) {
//        return game.getScores()
//                .stream()
//                .findFirst()
//                .map(score -> score.getFinishDate())
//                .orElse(null);
//    }

}