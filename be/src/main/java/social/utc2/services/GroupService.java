package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Department;
import social.utc2.entities.Group;

import java.util.List;

@Service
public interface GroupService {
    Group insertGroup(Group group) throws Exception;

    Group updateGroup(Group group);

    Group getGroupById(Integer id);

    boolean deleteGroups(List<Integer> groups);

    List<Group> getAllGroup();

    List<Department> getDepartByGroupId(Integer id);
}
