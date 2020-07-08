package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import social.utc2.entities.Group;
import social.utc2.repositories.GroupRepository;

import java.util.List;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    GroupRepository groupRepository;

    @Override
    public Group insertGroup(Group group) {
        return groupRepository.save(group);
    }

    @Override
    public Group updateGroup(Group group) {
        return groupRepository.save(group);
    }

    @Override
    public Group getGroupById(Integer groupId) {
        return groupRepository.findById(groupId).get();
    }

    @Override
    @Transactional
    public boolean deleteGroups(List<Integer> groupIds) {
        try {
            List<Group> groups = groupRepository.findByIdIn(groupIds);
            for (Group group : groups) {
                group.setFlgDel(true);
            }
            groupRepository.saveAll(groups);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Group> getAllGroup() {
        return groupRepository.findAllByFlgDelFalse();
    }
}
