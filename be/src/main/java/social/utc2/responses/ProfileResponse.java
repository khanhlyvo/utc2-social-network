package social.utc2.responses;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import org.hibernate.annotations.Formula;
import social.utc2.entities.Department;
import social.utc2.entities.Gender;
import social.utc2.entities.GenderConverter;
import social.utc2.entities.User;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
public class ProfileResponse {

    private Integer id;

    private String userName;

    private String firstName;

    private String lastName;

    private String fullName;

    private String email;

    private String phone;

    private String role;

    private Date birthDate;

    private Date created;

    private Gender gender;

    private Department department;

    private String avatar;

    private String background;

    public ProfileResponse(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.birthDate = user.getBirthDate();
        this.created = user.getCreated();
        this.gender = user.getGender();
        this.department = user.getDepartment();
        this.avatar = user.getAvatar();
        this.background = user.getBackground();
    }
}
