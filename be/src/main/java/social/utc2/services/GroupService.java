package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Group;

import java.util.List;

@Service
public interface GroupService {
    Group insertGroup(Group group) throws Exception;

    Group updateGroup(Group group);

    Group getGroupById(String id);

    boolean deleteGroups(List<Group> groups);

    List<Group> getAllGroup();
}
