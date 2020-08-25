package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Group;
import social.utc2.entities.Notification;

import java.util.List;

@Service
public interface NotificationService {
    Notification insertNotification(Notification notification) throws Exception;

    List<Notification> getNotifications(Integer id) throws Exception;
}
