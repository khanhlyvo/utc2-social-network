package social.utc2.socket;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.support.NativeMessageHeaderAccessor;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import social.utc2.entities.Presence;
import social.utc2.services.PresenceService;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/socket")
@CrossOrigin("*")
public class SocketRest {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    PresenceService presenceService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> useSimpleRest(@RequestBody  Map<String, String> message){
        if(message.containsKey("message")){
            //if the toId is present the message will be sent privately else broadcast it to all users
            if(message.containsKey("toId") && message.get("toId")!=null && !message.get("toId").equals("")){
                this.simpMessagingTemplate.convertAndSend("/socket-publisher/"+message.get("toId"),message);
                this.simpMessagingTemplate.convertAndSend("/socket-publisher/"+message.get("fromId"),message);
            }else{
                this.simpMessagingTemplate.convertAndSend("/socket-publisher",message);
            }
            return new ResponseEntity<>(message, new HttpHeaders(), HttpStatus.OK);
        }
        return new ResponseEntity<>(new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @MessageMapping("/send/message")
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

    @EventListener
    public void onConnectEvent(SessionConnectedEvent event) {
//        System.out.println("Client with username {} connected" + event );
//        System.out.println("Source" +  event.getMessage().getHeaders().);

        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());

        System.out.println("~~~~~~"+ sha.getSessionId());
        MessageHeaderAccessor accessor = NativeMessageHeaderAccessor.getAccessor(
                event.getMessage(), SimpMessageHeaderAccessor.class);
        // Get the Native Headers from simpConnectMessage header
        GenericMessage<?> simpConnectMessageHeader = (GenericMessage<?>) accessor.getHeader("simpConnectMessage");
        if (simpConnectMessageHeader==null) {
            return;
        }
        if (!simpConnectMessageHeader.getHeaders().containsKey("nativeHeaders")) {
            return;
        }
        Map<String, LinkedList> nativeHeaders = (Map)simpConnectMessageHeader.getHeaders().get("nativeHeaders");
        if (!nativeHeaders.containsKey("name")) {
            return;
        }
        List<String> name = nativeHeaders.get("name");
        System.out.println(name);
        if (name.isEmpty()) {
            return;
        }
        String username = ((LinkedList<String>) name).getFirst();
        Presence presence = new Presence();
        presence.setSession(sha.getSessionId());
        presence.setUserName(username);
        presence.setState("login");
        try {
            presenceService.insertPresence(presence);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent event) {
        System.out.println("Client with username {} disconnected" + event);
        event.getSessionId();
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("~~"+ sha.getSessionId());
        try {
            presenceService.updateBySession(sha.getSessionId());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
