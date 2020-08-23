package social.utc2.services;

import org.hibernate.Criteria;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.entities.User;
import social.utc2.repositories.DepartmentRepository;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;

import javax.persistence.criteria.CriteriaBuilder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    DepartmentRepository departmentRepository;
    
    @Override
    public Department insertDepartment(Department department) {
//        Group group = new Group();
//        group.addDeparment(department);
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public Department getDepartmentById(Integer departmentId) {
        return departmentRepository.findById(departmentId).get();
    }

    @Override
    @Transactional
    public boolean deleteDepartments(List<Integer> departmentIds) {
        try {
            List<Department> departments = departmentRepository.findByIdIn(departmentIds);
            for (Department department : departments) {
                department.setFlgDel(true);
            }
            departmentRepository.saveAll(departments);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public PageResponse getAllDepartment(Pagination pagination) {
        Pageable paging = null;
        if (Optional.of(pagination.getSize()).isPresent() && pagination.getSize() > 0) {
            paging = PageRequest.of(pagination.getPage() - 1, pagination.getSize());
        }
        PageResponse pageResponse = new PageResponse();
        Page<Department> page = null;
        if (StringUtils.isEmpty(pagination.getSearchValue())) {
            page = departmentRepository.findAllByFlgDelFalse(paging);
        } else {
            page = departmentRepository.search(paging, pagination.getSearchValue());
        }
        pageResponse.setContent(page.getContent());
        pageResponse.setTotalElements((int) page.getTotalElements());
        return pageResponse;
    }

}
