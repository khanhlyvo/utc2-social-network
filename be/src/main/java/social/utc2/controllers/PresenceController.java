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
import social.utc2.entities.Presence;
import social.utc2.entities.User;
import social.utc2.responses.ProfileResponse;
import social.utc2.services.PresenceService;
import social.utc2.services.UserService;

import java.util.ArrayList;
import java.util.List;


@RequestMapping("/api/presence")
@Controller
public class PresenceController {
    @Autowired
    PresenceService presenceService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> insertFollow(@RequestBody Presence presence) {
        try {
            if (ObjectUtils.isEmpty(presence)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(presenceService.insertPresence(presence), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> getPresence() {
        try {
//            List<ProfileResponse> res = new ArrayList<>();
            List<Presence> presences = presenceService.getPresences();
//            follows.forEach(e -> {
//                User user = userService.getUserByUserName(e.getFollowee());
//                ProfileResponse profile = new ProfileResponse(user);
//                res.add(profile);
//            });
            return new ResponseEntity<>(presences, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/delete", method = RequestMethod.PUT)
    public ResponseEntity<?> deleteFollow(@RequestBody Presence presence) {
        try {
            return new ResponseEntity<>(presenceService.deletePresence(presence), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
