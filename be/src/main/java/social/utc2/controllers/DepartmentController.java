package social.utc2.controllers;

import com.sun.corba.se.spi.ior.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import social.utc2.entities.Department;
import social.utc2.services.DepartmentService;

import java.util.List;

@RestController
@RequestMapping(value = "api/department")
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> insertDepartment(@RequestBody Department department) {
        try {
            if (ObjectUtils.isEmpty(department)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(departmentService.insertDepartment(department), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseEntity<?> updateDepartment(@RequestBody Department department) {
        try {
            if (ObjectUtils.isEmpty(department)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(departmentService.updateDepartment(department), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/{departmentId}", method = RequestMethod.GET)
    public ResponseEntity<?> getDepartmentById(@PathVariable("departmentId") String departmentId) {
        try {
            return new ResponseEntity<>(departmentService.getDepartmentById(departmentId), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<?> getAllDepartment() {
        try {
            return new ResponseEntity<>(departmentService.getAllDepartment(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.PUT)
    public ResponseEntity<?> deleteDepartments(@RequestBody List<Department> departments) {
        try {
            return new ResponseEntity<>(departmentService.deleteDepartments(departments), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
