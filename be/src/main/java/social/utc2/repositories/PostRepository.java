package social.utc2.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import social.utc2.entities.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query("select p from Post p where p.userId in :userIds and p.flgDel=0 ORDER BY p.created DESC")
    List<Post> getPostsByUserIds(@Param("userIds") List<Integer> userIds, Pageable paging);
}
