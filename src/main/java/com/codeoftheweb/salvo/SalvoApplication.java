package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository repository) {
		return (args) -> {
			repository.save(new Player("omg@gmail.com"));
			repository.save(new Player("jake@gmail.com"));
			repository.save(new Player("namie@gmail.com"));
			repository.save(new Player("ottavia@gmail.com"));
			repository.save(new Player("hiu@gmail.com"));
		};
	}
}

