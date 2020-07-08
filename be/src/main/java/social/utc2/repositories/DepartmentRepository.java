package social.utc2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.entities.User;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Department findByDepartName(String departName);

    Optional<Department> findById(String id);

    List<Department> findByIdIn(List<Integer> ids);

    List<Department> findAllByFlgDelFalse();
}
