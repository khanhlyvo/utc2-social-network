package social.utc2.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "User")
public class User implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
//            (length = 60, nullable = false)
    private String userName;

    @Column
//    @JsonIgnore
//            (length = 60, nullable = false)
    private String passWord;

    @Column
//            (length = 60, nullable = false)
    private String firstName;

    @Column
//            (length = 60, nullable = false)
    private String lastName;

    @Column(insertable = false)
    @Formula(value = "concat(last_name, ' ', first_name)")
    private String fullName;

    @Column
//            (unique = true, nullable = false)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 15)
    private String role;

    @Column
    private boolean flgDel;

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

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column
    private String avatar;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column
    private String background;
//
//    @JsonManagedReference
//    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
//    private List<Message> messages = new ArrayList<>();
}
