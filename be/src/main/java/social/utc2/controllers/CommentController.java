package social.utc2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import social.utc2.entities.Comment;
import social.utc2.entities.Group;
import social.utc2.entities.Post;
import social.utc2.entities.User;
import social.utc2.responses.ProfileResponse;
import social.utc2.services.CommentService;
import social.utc2.services.UserService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RequestMapping("/api/comment")
@Controller
public class CommentController {
    @Autowired
    CommentService commentService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> insertComment(@RequestBody HashMap<String, Object> payload) {
        try {
            if (ObjectUtils.isEmpty(payload)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Comment comment = new Comment();
            comment.setContent(payload.get("content").toString());
            Post post = new Post();
            post.setId(Integer.parseInt(payload.get("postId").toString()));
            comment.setPost(post);
            User user = new User();
            user.setId(Integer.parseInt(payload.get("userId").toString()));
            comment.setUser(user);
            return new ResponseEntity<>(commentService.insertComment(comment), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping(value = "/{postId}", method = RequestMethod.GET)
    public ResponseEntity<?> getCommentById(@PathVariable("postId") String postId) {
        try {
            int id = Integer.parseInt(postId);
            List<Comment> comments = commentService.getCommentsByPostId(id);
            comments.forEach(e -> {
                User user = e.getUser();
                if(user.getAvatar() != null && user.getAvatar().indexOf("data:image/jpg;base64") ==-1) {
                    user.setAvatar(encoder(user.getAvatar()));
                }
                if(user.getBackground() != null) {
                    user.setBackground(encoder(user.getBackground()));
                }
                e.setUser(user);
            });
            return new ResponseEntity<>(commentService.getCommentsByPostId(id), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static String encoder(String imagePath) {
        String base64Image = "";
        File file = new File(imagePath);
        try (FileInputStream imageInFile = new FileInputStream(file)) {
            // Reading a Image file from file system
            byte imageData[] = new byte[(int) file.length()];
            imageInFile.read(imageData);
            base64Image = java.util.Base64.getEncoder().encodeToString(imageData);
        } catch (FileNotFoundException e) {
            System.out.println("Image not found" + e);
        } catch (IOException ioe) {
            System.out.println("Exception while reading the Image " + ioe);
        }
        return  "data:image/jpg;base64," + base64Image;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteComment(@PathVariable("id") String commentId) {
        try {
            int id = Integer.parseInt(commentId);
            return new ResponseEntity<>(commentService.deleteComment(id), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseEntity<?> updateComment(@RequestBody HashMap<String, Object> payload) {
        try {
            if (ObjectUtils.isEmpty(payload)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(commentService.updateComment(payload), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
