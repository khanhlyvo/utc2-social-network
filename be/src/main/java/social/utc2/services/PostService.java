package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Post;
import social.utc2.entities.User;

import java.util.HashMap;
import java.util.List;

@Service
public interface PostService {
    Post insertPost(Post post) throws Exception;

    List<Post> getPostsByUserIds(List<Integer> userIds, Integer pageNo, Integer pageSize);

    boolean deletePost(Integer id);

    boolean updatePost(HashMap<String, Object> payload);
}
