package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Comment;

import java.util.HashMap;
import java.util.List;

@Service
public interface CommentService {
    Comment insertComment(Comment comment) throws Exception;

    List<Comment> getCommentsByPostId(Integer postId);

    boolean deleteComment(Integer id);

    boolean updateComment(HashMap<String, Object> payload);
}
