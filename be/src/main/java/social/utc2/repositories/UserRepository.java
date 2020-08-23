package social.utc2.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.entities.Message;
import social.utc2.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    User findByUserName(String userName);

    Optional<User> findById(String id);

    Page<User> findAllByFlgDelFalse(Pageable pageable);

    List<User> findByIdIn(List<Integer> ids);

    @Autowired
    @Query("SELECT m " +
            "FROM User m " +
            "WHERE m.userName like %:name% OR m.fullName like %:name% ")
    List<User> searchUser(@Param("name") String name, Pageable pageable);
//    Optional<User> findFirst10ByUserNameOrFullName(String name);

    @Query("select u from User u where (u.userName like %:searchValue% or u.fullName like %:searchValue% or u.department.departName like %:searchValue%) and flgDel = 0")
    Page<User> search(Pageable pageable, @Param("searchValue") String searchValue);
}
