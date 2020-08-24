package social.utc2.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import social.utc2.entities.Message;

import java.util.List;

@Repository
public interface MessageRepository extends CrudRepository<Message, Integer> {
    @Autowired
    @Query("SELECT m " +
            "FROM Message m " +
            "WHERE m.toId = :toId AND m.fromId = :fromId " +
            "   OR m.toId = :fromId AND m.fromId = :toId " +
            "ORDER BY m.date DESC")
    List<Message> getMessages(@Param("toId") String toId, @Param("fromId") String fromId, Pageable paging);

}