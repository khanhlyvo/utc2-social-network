package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;

import java.util.List;

@Service
public interface GroupService {
    Group insertGroup(Group group) throws Exception;

    Group updateGroup(Group group);

    Group getGroupById(Integer id);

    boolean deleteGroups(List<Integer> groups);

    PageResponse getAllGroup(Pagination pagination);

    List<Department> getDepartByGroupId(Integer id);
}
