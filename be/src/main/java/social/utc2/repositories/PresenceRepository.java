package social.utc2.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import social.utc2.entities.Message;
import social.utc2.entities.Presence;

import java.util.List;

@Repository
public interface PresenceRepository extends CrudRepository<Presence, Integer> {
    List<Presence> findAll();

//    @Transactional
//    @Modifying
//    @Query("delete from Presence d where d.userName=:userName")
//    void delete1(@Param("userName") String userName);
    @Transactional
    @Modifying
    @Query("update Presence p set p.state = 'logout' WHERE p.session = :session")
    void updateBySession(@Param("session") String session);

    @Autowired
    @Query("SELECT p " +
            "FROM Presence p " +
            "WHERE  p.state = 'login'")
    List<Presence> getAll();
}
