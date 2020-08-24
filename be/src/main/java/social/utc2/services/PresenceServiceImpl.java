package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import social.utc2.entities.Presence;
import social.utc2.repositories.PresenceRepository;

import java.util.List;

@Service
public class PresenceServiceImpl implements PresenceService {
    @Autowired
    PresenceRepository presenceRepository;

    @Override
    public Presence insertPresence(Presence presence) {
        return presenceRepository.save(presence);
    };

    @Override
    public boolean deletePresence(Presence presence) {
        try {
            presenceRepository.delete(presence);
            return true;
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    };

    @Override
    public List<Presence> getPresences() {
        return presenceRepository.getAll();
    };

    @Override
    public void updateBySession(String session) {
        presenceRepository.updateBySession(session);
    }

}
