package com.codeoftheweb.salvo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface PlayerRepository extends JpaRepository<Player, Long>  {
//    Player findByName(@Param("name") String name);
    Player findByUserName( @Param("email") String email);
    Player findById(@Param("id") long id);
}

