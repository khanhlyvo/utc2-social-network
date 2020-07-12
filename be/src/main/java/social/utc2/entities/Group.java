package social.utc2.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
//import org.hibernate.mapping.Set;

//import javax.persistence.;
import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Group_Dep")
public class Group {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
    private String groupId;

    @Column
    private String groupName;

    @Column
    private boolean flgDel;


//    @JsonManagedReference
//    @OneToMany(mappedBy = "id", fetch = FetchType.LAZY)
//    private Set<Department> departments;
    //@JsonManagedReference
//    @OneToMany(
//            mappedBy = "group",
//            cascade = CascadeType.ALL,
//            orphanRemoval = true
//    )
//    private List<Department> departments = new ArrayList<>();
//
//    public void addDeparment(Department department) {
////        departments.add(department);
//        department.setGroup(this);
//    }
//
//    public void removeDeparment(Department department) {
//        departments.remove(department);
//        department.setGroup(null);
//    }
}
