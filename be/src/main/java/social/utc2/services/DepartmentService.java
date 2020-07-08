package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Department;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface DepartmentService {

    Department insertDepartment(Department department) throws Exception;

    Department updateDepartment(Department department);

    Department getDepartmentById(String id);

    boolean deleteDepartments(List<Integer> departments);

    List<Department> getAllDepartment();

}
