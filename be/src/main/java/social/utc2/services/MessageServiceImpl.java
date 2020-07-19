package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import social.utc2.entities.Group;
import social.utc2.entities.Message;
import social.utc2.repositories.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    MessageRepository messageRepository;


    @Override
    public Message insertMessage(Message message) {
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessages(String toId, String fromId, int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        return messageRepository.getMessages(toId, fromId, paging);
    }
}
