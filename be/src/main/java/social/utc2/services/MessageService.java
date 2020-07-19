package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Message;

import java.util.List;

@Service
public interface MessageService {
    Message insertMessage(Message message) throws Exception;
    List<Message> getMessages(String toId, String fromId, int pageNo, int pageSize);
}
