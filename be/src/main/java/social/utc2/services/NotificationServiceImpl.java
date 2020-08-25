package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import social.utc2.entities.Group;
import social.utc2.entities.Notification;
import social.utc2.repositories.NotificationRepository;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    @Override
    public Notification insertNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotifications(Integer id) {
        return notificationRepository.findAllByToId(id);
    }
}
