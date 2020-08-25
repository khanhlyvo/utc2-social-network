package social.utc2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import social.utc2.entities.Notification;
import social.utc2.responses.NotiResponse;
import social.utc2.services.NotificationService;
import social.utc2.services.UserService;

import social.utc2.entities.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RequestMapping("/api/notification")
@Controller
public class NofiticationController {

    @Autowired
    NotificationService notificationService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getGroupById(@PathVariable("id") int id) {
        try {
            List<NotiResponse> notiRes = new ArrayList<>();
            List<Notification> notifications = notificationService.getNotifications(id);
            notifications.forEach(notification -> {
                NotiResponse notiResponse = new NotiResponse();
                User user = userService.getUserById(notification.getFromId());
                if(user.getAvatar() != null && user.getAvatar().indexOf("data:image/jpg;base64") ==-1) {

                    notiResponse.setFromAvatar(encoder(user.getAvatar()));
                }
                notiResponse.setId(notification.getId());
                notiResponse.setDate(notification.getDate());
                notiResponse.setFromFullName(user.getFullName());
                notiResponse.setFromId(notification.getFromId());
                notiResponse.setFromUserName(notification.getFromUserName());
                notiResponse.setIdPost(notification.getIdPost());
                notiResponse.setToId(notification.getToId());
                notiResponse.setToUserName(notification.getToUserName());
                notiResponse.setSeen(notification.isSeen());
                notiResponse.setType(notification.getType());

                notiRes.add(notiResponse);
            });
            return new ResponseEntity<>(notiRes, HttpStatus.OK);
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
}
