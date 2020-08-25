package social.utc2.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import social.utc2.entities.Message;
import social.utc2.entities.Notification;
import social.utc2.services.MessageService;
import social.utc2.services.NotificationService;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/message")
@CrossOrigin("*")
public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    MessageService messageService;

    @Autowired
    NotificationService notificationService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> useSimpleRest(@RequestBody Message message){

//        if(message.containsKey("message")){
//            //if the toId is present the message will be sent privately else broadcast it to all users
//            if(message.containsKey("toId") && message.get("toId")!=null && !message.get("toId").equals("")){
//                this.simpMessagingTemplate.convertAndSend("/socket-publisher/"+message.get("toId"),message);
//                this.simpMessagingTemplate.convertAndSend("/socket-publisher/"+message.get("fromId"),message);
//            }else{
//                this.simpMessagingTemplate.convertAndSend("/socket-publisher",message);
//            }

        try {
            if (ObjectUtils.isEmpty(message)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            this.simpMessagingTemplate.convertAndSend("/socket-publisher",message);
            this.simpMessagingTemplate.convertAndSend("/socket-publisher/message/"+message.getToId(),message);

            Notification notification = new Notification();
            notification.setFromId(message.getFromUserId());
            notification.setFromUserName(message.getFromId());
            notification.setToId(message.getToUserId());
            notification.setToUserName(message.getToId());
            notification.setType("message");
            notificationService.insertNotification(notification);

            return new ResponseEntity<>(messageService.insertMessage(message), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{toId}/{fromId}/{pageNo}/{pageSize}", method = RequestMethod.GET)
    public ResponseEntity<?> getGroupById(@PathVariable("toId") String toId, @PathVariable("fromId") String fromId, @PathVariable int pageNo,
                                          @PathVariable int pageSize) {
        try {
//            int id = Integer.parseInt(groupId);
            return new ResponseEntity<>(messageService.getMessages(toId, fromId, pageNo, pageSize), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @MessageMapping("/send")
    public Map<String, String> useSocketCommunication(String message){
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> messageConverted = null;
        try {
            messageConverted = mapper.readValue(message, Map.class);
        } catch (IOException e) {
            messageConverted = null;
        }
        if(messageConverted!=null){
            if(messageConverted.containsKey("toId") && messageConverted.get("toId")!=null && !messageConverted.get("toId").equals("")){
                this.simpMessagingTemplate.convertAndSend("/socket-publisher/"+messageConverted.get("toId"),messageConverted);
                this.simpMessagingTemplate.convertAndSend("/socket-publisher/"+messageConverted.get("fromId"),message);
            }else{
                this.simpMessagingTemplate.convertAndSend("/socket-publisher",messageConverted);
            }
        }
        return messageConverted;
    }
}
