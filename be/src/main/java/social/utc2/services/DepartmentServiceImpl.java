package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import social.utc2.entities.Department;
import social.utc2.entities.User;
import social.utc2.repositories.DepartmentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    DepartmentRepository departmentRepository;
    
    @Override
    public Department insertDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public Department getDepartmentById(String departmentId) {
        return departmentRepository.findById(departmentId).get();
    }

    @Override
    @Transactional
    public boolean deleteDepartments(List<Department> departments) {
        try {
            for (Department expenditure : departments) {
                expenditure.setFlgDel(true);
            }
            departmentRepository.saveAll(departments);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Department> getAllDepartment() {
        return departmentRepository.findAll();
    }

}
