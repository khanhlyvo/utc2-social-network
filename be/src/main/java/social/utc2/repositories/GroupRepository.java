package social.utc2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import social.utc2.entities.Group;
import social.utc2.entities.Group;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Integer> {
    Group findByGroupName(String groupName);
    Optional<Group> findById(String id);

    List<Group> findByIdIn(List<Integer> ids);

    List<Group> findAllByFlgDelFalse();

}
