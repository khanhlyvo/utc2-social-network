package social.utc2.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "User")
public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
//            (length = 60, nullable = false)
    private String userName;

    @Column
//            (length = 60, nullable = false)
    private String passWord;

    @Column
//            (length = 60, nullable = false)
    private String firstName;

    @Column
//            (length = 60, nullable = false)
    private String lastName;

    @Column(insertable = false)
    @Formula(value = "concat(first_name, ' ', last_name)")
    private String fullName;

    @Column
//            (unique = true, nullable = false)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 15)
    private String role;

    @Column
    private boolean flagDel;

    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Column
//            (updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created = new Date();

    @Convert(converter = GenderConverter.class)
    private Gender gender = Gender.UNDEFINED;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

}
