package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.Date;
import java.util.List;


@SpringBootApplication
public class SalvoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalvoApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository,
                                      GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository,
                                      SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
        return (args) -> {

            Player player1 = new Player("jake@gmail.com","j");
            Player player2 = new Player("micheal@gmail.com","m");
            Player player3 = new Player("namie@gmail.com", "n");
            Player player4 = new Player("ottavia@gmail.com", "o");
            Player player5 = new Player("yuri@gmail.com", "y");

            Date date = new Date();
            Date date1 = Date.from(date.toInstant().plusSeconds(3600));
            Date date2 = Date.from(date.toInstant().plusSeconds(7200));
            Date date3 = Date.from(date.toInstant().plusSeconds(10800));


            Game game1 = new Game(date1);
            Game game2 = new Game(date2);
            Game game3 = new Game(date3);
            Game game4 = new Game(date3);


            List<String> location1 = Arrays.asList("E3", "E4", "E5", "E6", "E7");
            List<String> location2 = Arrays.asList("A9", "B9", "C9", "D9");
            List<String> location3 = Arrays.asList("H1", "H2", "H3");
            List<String> location4 = Arrays.asList("I6", "I7", "I8");
            List<String> location5 = Arrays.asList("H4", "H5");
            List<String> location6 = Arrays.asList("I2", "H2", "G2", "F2", "E2");
            List<String> location7 = Arrays.asList("B6", "B7", "B8", "B9");
            List<String> location8 = Arrays.asList("D5", "D6", "D7");
            List<String> location9 = Arrays.asList("G5", "G6");
            List<String> location10 = Arrays.asList("E9", "F9", "G9");


            Ship ship1 = new Ship("carrier", location1);
            Ship ship2 = new Ship("battleship", location2);
            Ship ship3 = new Ship("destroyer", location3);
            Ship ship4 = new Ship("submarine", location4);
            Ship ship5 = new Ship("patrol", location5);
            Ship ship6 = new Ship("carrier", location6);
            Ship ship7 = new Ship("battleship", location7);
            Ship ship8 = new Ship("destroyer", location8);
            Ship ship9 = new Ship("patrol", location9);
            Ship ship10 = new Ship("submarine", location10);


            List<String> salvoLocation1 = Arrays.asList("E6", "C8", "A2");
            List<String> salvoLocation2 = Arrays.asList("H1", "H2", "H3");
            List<String> salvoLocation3 = Arrays.asList("A4", "E4", "F7");
            List<String> salvoLocation4 = Arrays.asList("I4", "A9", "D3");
            List<String> salvoLocation5 = Arrays.asList("E2", "F2", "G2");

            Salvo salvo1 = new Salvo(1, salvoLocation1);
            Salvo salvo2 = new Salvo(1, salvoLocation2);
            Salvo salvo3 = new Salvo(2, salvoLocation3);
            Salvo salvo4 = new Salvo(2, salvoLocation4);
            Salvo salvo5 = new Salvo(3, salvoLocation5);

            Date creationDate1 = Date.from(date.toInstant().plusSeconds(3600));
            Date creationDate2 = Date.from(date.toInstant().plusSeconds(7200));
            Date creationDate3 = Date.from(date.toInstant().plusSeconds(10800));

            GamePlayer gamePlayer = new GamePlayer(creationDate1);
            GamePlayer gamePlayer5 = new GamePlayer(creationDate1);
            player1.addGamePlayer(gamePlayer);
            game1.addGamePlayer(gamePlayer);
            player1.addGamePlayer(gamePlayer5);
            game3.addGamePlayer(gamePlayer5);

            GamePlayer gamePlayer2 = new GamePlayer(creationDate2);
            GamePlayer gamePlayer6 = new GamePlayer(creationDate2);
            player2.addGamePlayer(gamePlayer2);
            game1.addGamePlayer(gamePlayer2);
            player2.addGamePlayer(gamePlayer6);
            game4.addGamePlayer(gamePlayer6);


            GamePlayer gamePlayer3 = new GamePlayer(creationDate3);
            GamePlayer gamePlayer7 = new GamePlayer(creationDate3);
            player3.addGamePlayer(gamePlayer3);
            game2.addGamePlayer(gamePlayer3);
            player3.addGamePlayer(gamePlayer7);
            game3.addGamePlayer(gamePlayer7);

            GamePlayer gamePlayer4 = new GamePlayer(creationDate3);
            GamePlayer gamePlayer8 = new GamePlayer(creationDate3);
            player4.addGamePlayer(gamePlayer4);
            game2.addGamePlayer(gamePlayer4);
            player4.addGamePlayer(gamePlayer8);
            game4.addGamePlayer(gamePlayer8);


            gamePlayer.addShip(ship1);
            gamePlayer.addShip(ship2);
            gamePlayer.addShip(ship3);
            gamePlayer.addShip(ship4);
            gamePlayer.addShip(ship5);
            gamePlayer2.addShip(ship6);
            gamePlayer2.addShip(ship7);
            gamePlayer2.addShip(ship8);
            gamePlayer2.addShip(ship9);
            gamePlayer2.addShip(ship10);

            gamePlayer.addSalvo(salvo1);
            gamePlayer2.addSalvo(salvo2);
            gamePlayer.addSalvo(salvo3);
            gamePlayer2.addSalvo(salvo4);
            gamePlayer.addSalvo(salvo5);

            Date finishDate = Date.from(date.toInstant().plusSeconds(1800));
            Date finishDate1 = Date.from(date1.toInstant().plusSeconds(1800));

            Score score1 = new Score(finishDate, 1.0);
            Score score2 = new Score(finishDate, 0.5);
            Score score3 = new Score(finishDate, 0.0);
            Score score4 = new Score(finishDate, 1.0);
            Score score5 = new Score(finishDate, 0.5);
            Score score6 = new Score(finishDate, 0.0);
            Score score7 = new Score(finishDate, 1.0);
            Score score8 = new Score(finishDate, 0.5);
            Score score9 = new Score(finishDate, 0.0);
            Score score10 = new Score(finishDate, 1.0);

            //game1
            player1.addScore(score5);
            game1.addScore(score5);
            player1.addScore(score4);
            game3.addScore(score4);

            //game2
            player2.addScore(score2);
            game1.addScore(score2);
            player2.addScore(score9);
            game4.addScore(score9);

            //game3
//            player3.addScore(score3);
//            game2.addScore(score3);
//            player3.addScore(score6);
//            game3.addScore(score6);

            //game4
//            player4.addScore(score7);
//            game2.addScore(score7);
//            player4.addScore(score10);
//            game4.addScore(score10);


            playerRepository.save(player1);
            playerRepository.save(player2);
            playerRepository.save(player3);
            playerRepository.save(player4);


            gameRepository.save(game1);
            gameRepository.save(game2);
            gameRepository.save(game3);
            gameRepository.save(game4);
//			gameRepository.save(game5);


            gamePlayerRepository.save(gamePlayer);
            gamePlayerRepository.save(gamePlayer2);
            gamePlayerRepository.save(gamePlayer3);
            gamePlayerRepository.save(gamePlayer4);
            gamePlayerRepository.save(gamePlayer5);
            gamePlayerRepository.save(gamePlayer6);
            gamePlayerRepository.save(gamePlayer7);
            gamePlayerRepository.save(gamePlayer8);
//			gamePlayerRepository.save(gamePlayer9);
//			gamePlayerRepository.save(gamePlayer10);

            shipRepository.save(ship1);
            shipRepository.save(ship2);
            shipRepository.save(ship3);
            shipRepository.save(ship4);
            shipRepository.save(ship5);
            shipRepository.save(ship6);
            shipRepository.save(ship7);
            shipRepository.save(ship8);
            shipRepository.save(ship9);
            shipRepository.save(ship10);


            salvoRepository.save(salvo1);
            salvoRepository.save(salvo2);
            salvoRepository.save(salvo3);
            salvoRepository.save(salvo4);
            salvoRepository.save(salvo5);

            scoreRepository.save(score1);
            scoreRepository.save(score2);
//            scoreRepository.save(score3);
            scoreRepository.save(score4);
            scoreRepository.save(score5);
//            scoreRepository.save(score6);
//            scoreRepository.save(score7);
            scoreRepository.save(score8);
            scoreRepository.save(score9);
//            scoreRepository.save(score10);

        };
    }
}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

    @Autowired
    PlayerRepository playerRepository;

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(inputName -> {
            Player player = playerRepository.findByUserName(inputName);
            if (player != null) {
                return new User(player.getEmail(), player.getPassword(),
                        AuthorityUtils.createAuthorityList("USER"));
            } else {
                throw new UsernameNotFoundException("Unknown user: " + inputName);
            }
        });
    }
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/api/game_view/*").hasAnyAuthority("USER")
//                .antMatchers("/**").permitAll()
                .antMatchers("/web/allGames.html").permitAll()
                .antMatchers("/web/allGames.css").permitAll()
                .antMatchers("/web/allGames.js").permitAll()
                .antMatchers("/web/game.html").permitAll()
                .antMatchers("/api/leaderBoard").permitAll()
                .antMatchers("/api/players").permitAll()
                .antMatchers("/rest/*").denyAll()
                .anyRequest().fullyAuthenticated()
                .and()
                .formLogin()
                .usernameParameter("email")
                .passwordParameter("password")
                .loginPage("/api/login");

        http.logout().logoutUrl("/api/logout");

        // turn off checking for CSRF tokens
        http.csrf().disable();

        // if user is not authenticated, just send an authentication failure response
        http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if login is successful, just clear the flags asking for authentication
        http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

        // if login fails, just send an authentication failure response
        http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if logout is successful, just send a success response
        http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
    }

    private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        }
    }


}
