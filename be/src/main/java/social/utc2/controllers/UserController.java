package social.utc2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import social.utc2.entities.Group;
import social.utc2.entities.User;
import social.utc2.responses.ProfileResponse;
import social.utc2.securities.Utc2UserDetail;
import social.utc2.services.UserService;

import java.io.File;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/user")
@Controller
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity insertUser(@RequestBody User user, @AuthenticationPrincipal Utc2UserDetail userLogin) {
        try {
            if (ObjectUtils.isEmpty(user)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity(userService.insertUser(user), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        try {
            if (ObjectUtils.isEmpty(user)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(userService.updateUser(user), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity getAllUser() {
        try {

            List<User> users = userService.getAllUser();
            List<ProfileResponse> profiles = users.stream().map(user -> {
                ProfileResponse profile = new ProfileResponse(user);
                return profile;
            }).collect(Collectors.toList());

            return new ResponseEntity<>(profiles, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/search-name/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserByIdOrName(@PathVariable("name") String name) {
        try {
            List<User> users = userService.getUserByIdOrName(name, 0, 10);
            List<ProfileResponse> profiles = users.stream().map(user -> {
                ProfileResponse profile = new ProfileResponse(user);
                return profile;
            }).collect(Collectors.toList());

            return new ResponseEntity<>(profiles, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{userId}", method = RequestMethod.GET)
    public ResponseEntity<?> getGroupById(@PathVariable("userId") String userId) {
        try {
            int id = Integer.parseInt(userId);
            User user = userService.getUserById(id);
            ProfileResponse profile = new ProfileResponse(user);
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

        @RequestMapping(value = "/username/{userName}", method = RequestMethod.GET)
    public ResponseEntity<?> getGroupByUsername(@PathVariable("userName") String userName) {
        try {

            User user = userService.getUserByUserName(userName);
            ProfileResponse profile = new ProfileResponse(user);
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.PUT)
    public ResponseEntity<?> deleteGroups(@RequestBody List<Integer> userIds) {
        try {
            return new ResponseEntity<>(userService.deleteUsers(userIds), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
