package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.repositories.DepartmentRepository;
import social.utc2.repositories.GroupRepository;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;

import java.util.List;
import java.util.Optional;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    GroupRepository groupRepository;

    @Autowired
    DepartmentRepository departmentRepository;

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
    public List<Department> getDepartByGroupId(Integer groupId) {
        return departmentRepository.findAllByGroupId(groupId);
    }

    @Override
    public PageResponse getAllGroup(Pagination pagination) {
        Pageable paging = null;
        if (Optional.of(pagination.getSize()).isPresent() && pagination.getSize() > 0) {
            paging = PageRequest.of(pagination.getPage() - 1, pagination.getSize());
        }
        PageResponse pageResponse = new PageResponse();
        Page<Group> page = null;
        if (StringUtils.isEmpty(pagination.getSearchValue())) {
            page = groupRepository.findAllByFlgDelFalse(paging);
        } else {
            page = groupRepository.search(paging, pagination.getSearchValue());
        }
        pageResponse.setContent(page.getContent());
        pageResponse.setTotalElements((int) page.getTotalElements());
        return pageResponse;
    }
}
