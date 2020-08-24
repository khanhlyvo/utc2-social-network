package social.utc2.repositories;

import org.hibernate.Hibernate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import social.utc2.entities.Follow;

import java.util.List;

@Repository
public interface FollowRepository extends CrudRepository<Follow, Integer> {
    List<Follow> findAllByFollower(String follower);

    @Transactional
    @Modifying
    @Query("delete from Follow d where d.follower=:follower and d.followee=:followee")
    void delete1(@Param("follower") String follower, @Param("followee") String followee);
}
