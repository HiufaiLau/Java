package com.codeoftheweb.salvo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository) {
		return (args) -> {
			playerRepository.save(new Player("omg@gmail.com"));
			playerRepository.save(new Player("jake@gmail.com"));
			playerRepository.save(new Player("namie@gmail.com"));
			playerRepository.save(new Player("ottavia@gmail.com"));
			playerRepository.save(new Player("hiu@gmail.com"));

			Date date = new Date();
//			SimpleDateFormat ft = new SimpleDateFormat("yyyy/MM/dd ',' hh:mm a ");
			Date date1= Date.from(date.toInstant().plusSeconds(3600));
			Date date2= Date.from(date.toInstant().plusSeconds(7200));
			Date date3= Date.from(date.toInstant().plusSeconds(10800));
			gameRepository.save(new Game(date1));
			gameRepository.save(new Game(date2));
			gameRepository.save(new Game(date3));

		};
	}
}

