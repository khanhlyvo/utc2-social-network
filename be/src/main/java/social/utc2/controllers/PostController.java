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
import social.utc2.entities.Post;
import social.utc2.services.PostService;

import java.util.HashMap;
import java.util.List;

@RequestMapping("/api/post")
@Controller
public class PostController {
    @Autowired
    PostService postService;

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public ResponseEntity<?> insertPost(@RequestBody HashMap<String, Object> payload) {
        try {
            if (ObjectUtils.isEmpty(payload)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Post post = new Post();
            post.setContent(payload.get("content").toString());
            post.setUserId(Integer.parseInt(payload.get("userId").toString()));
            return new ResponseEntity<>(postService.insertPost(post), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @RequestMapping(value = "", method = RequestMethod.PUT)
//    public ResponseEntity<?> insertPost1(@RequestBody Post payload) {
//        try {
//            if (ObjectUtils.isEmpty(payload)) {
//                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//            }
//            return new ResponseEntity<>(postService.insertPost(payload), HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @RequestMapping(value = "/get/{pageSize}/{pageNo}", method = RequestMethod.PUT)
    public ResponseEntity<?> getPosts(@RequestBody List<Integer> userIds, @PathVariable int pageNo,
                                      @PathVariable int pageSize) {
        try {
            if (ObjectUtils.isEmpty(userIds)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(postService.getPostsByUserIds(userIds, pageNo, pageSize), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{postId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deletePost(@PathVariable("postId") String postId) {
        try {
            int id = Integer.parseInt(postId);
            return new ResponseEntity<>(postService.deletePost(id), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseEntity<?> updatePost(@RequestBody HashMap<String, Object> payload) {
        try {
            if (ObjectUtils.isEmpty(payload)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(postService.updatePost(payload), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
