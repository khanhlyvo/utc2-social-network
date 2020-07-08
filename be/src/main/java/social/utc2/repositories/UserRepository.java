package social.utc2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import social.utc2.entities.Group;
import social.utc2.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String userName);

    Optional<User> findById(String id);

    List<User> findAllByFlgDelFalse();

    List<User> findByIdIn(List<Integer> ids);
}
