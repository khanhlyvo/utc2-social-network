package social.utc2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import social.utc2.entities.Follow;
import social.utc2.entities.Group;
import social.utc2.entities.User;
import social.utc2.request.Pagination;
import social.utc2.responses.ProfileResponse;
import social.utc2.services.FollowService;
import social.utc2.services.GroupService;
import social.utc2.services.UserService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
    @Autowired
    FollowService followService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> insertFollow(@RequestBody Follow follow) {
        try {
            if (ObjectUtils.isEmpty(follow)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(followService.insertFollow(follow), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public ResponseEntity<?> getFollows(@PathVariable String username) {
        try {
            List<ProfileResponse> res = new ArrayList<>();
            List<Follow> follows = followService.getFollows(username);
            follows.forEach(e -> {
                User user = userService.getUserByUserName(e.getFollowee());
                ProfileResponse profile = new ProfileResponse(user);
                res.add(profile);
            });
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/delete", method = RequestMethod.PUT)
    public ResponseEntity<?> deleteFollow(@RequestBody Follow follow) {
        try {
            return new ResponseEntity<>(followService.deleteFollow(follow), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
