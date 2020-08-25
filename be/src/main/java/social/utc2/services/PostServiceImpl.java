package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import social.utc2.entities.Comment;
import social.utc2.entities.Post;
import social.utc2.entities.User;
import social.utc2.repositories.PostRepository;

import java.util.HashMap;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    PostRepository postRepository;

    @Override
    public Post insertPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public List<Post> getPostsByUserIds(List<Integer> userIds, Integer pageNo, Integer pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        return postRepository.getPostsByUserIds(userIds, paging);
    }

    @Override
    public boolean deletePost(Integer id) {
        try {
            Post post = postRepository.findById(id).get();
            post.setFlgDel(true);
            postRepository.save(post);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updatePost(HashMap<String, Object> payload) {
        try {
            Post post = postRepository.findById(Integer.parseInt(payload.get("id").toString())).get();
            post.setFlgUpdate(true);
            post.setContent(payload.get("content").toString());
            postRepository.save(post);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
