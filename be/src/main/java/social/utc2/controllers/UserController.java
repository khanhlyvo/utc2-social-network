package social.utc2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import social.utc2.entities.Group;
import social.utc2.entities.User;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;
import social.utc2.responses.ProfileResponse;
import social.utc2.securities.Utc2UserDetail;
import social.utc2.services.UserService;

import java.io.File;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
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
    public ResponseEntity getAllUser(Pagination pagination) {
        try {

            PageResponse users = userService.getAllUser(pagination);
            List<ProfileResponse> profiles = users.getContent().stream().map(user -> {
                ProfileResponse profile = new ProfileResponse((User) user);
                return profile;
            }).collect(Collectors.toList());
            users.setContent(profiles);
            return new ResponseEntity<>(users, HttpStatus.OK);
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

    @RequestMapping(value = "/import", method = RequestMethod.POST)
    public ResponseEntity<?> importUser(@RequestParam("file") MultipartFile file) {
        try {
            userService.importFile(file.getInputStream());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/password-reset", method = RequestMethod.POST)
    public ResponseEntity<?> resetPassword(@RequestParam("id") String id, @RequestBody HashMap<String, String> payload) {
        try {
            String password = payload.get("password");
            userService.resetPassword(Integer.parseInt(id), password);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
