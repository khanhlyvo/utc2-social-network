package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import social.utc2.entities.Comment;
import social.utc2.entities.Post;
import social.utc2.repositories.CommentRepository;

import java.util.HashMap;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    CommentRepository commentRepository;

    @Override
    public Comment insertComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentRepository.findAllByPostId(postId);
    }

    @Override
    public boolean deleteComment(Integer id) {
        try {
            Comment comment = commentRepository.findById(id).get();
            comment.setFlgDel(true);
            commentRepository.save(comment);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateComment(HashMap<String, Object> payload) {
        try {
            Comment comment = commentRepository.findById(Integer.parseInt(payload.get("id").toString())).get();
            comment.setFlgUpdate(true);
            comment.setContent(payload.get("content").toString());
            commentRepository.save(comment);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
