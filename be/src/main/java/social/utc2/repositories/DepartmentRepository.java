package social.utc2.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.entities.User;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Department findByDepartName(String departName);

    Optional<Department> findById(Integer id);

    List<Department> findByIdIn(List<Integer> ids);

    Page<Department> findAllByFlgDelFalse(Pageable pageable);

    @Query("select d from Department d where (d.departId like %:searchValue% or d.departName like %:searchValue%) and flgDel = 0")
    Page<Department> search(Pageable pageable, @Param("searchValue") String searchValue);

    List<Department> findAllByGroupId(Integer id);
}
