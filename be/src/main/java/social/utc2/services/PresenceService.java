package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Presence;

import java.util.List;

@Service
public interface PresenceService {
    Presence insertPresence(Presence presence) throws Exception;
    boolean deletePresence(Presence presence);
    List<Presence> getPresences();
    void updateBySession(String session) throws Exception;
}
