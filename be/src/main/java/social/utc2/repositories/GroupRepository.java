package social.utc2.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import social.utc2.entities.Department;
import social.utc2.entities.Group;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    Group findByGroupName(String groupName);
    Optional<Group> findById(String id);

    List<Group> findByIdIn(List<Integer> ids);

    Page<Group> findAllByFlgDelFalse(Pageable pageable);

    @Query("select g from Group g where (g.groupId like %:searchValue% or g.groupName like %:searchValue%) and flgDel = 0")
    Page<Group> search(Pageable pageable, @Param("searchValue") String searchValue);
}
