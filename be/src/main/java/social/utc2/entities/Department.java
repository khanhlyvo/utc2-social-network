package social.utc2.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Department")
public class Department {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column(length = 60)
    private String departId;

    @Column(length = 60)
    private String departName;

    @Column
    private boolean flgDel;

    @Column
    private Integer groupId;

//    @JsonBackReference
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "group_id", referencedColumnName = "id")
//    @Getter @Setter
//    private Group group;
//    @JsonBackReference
//    @ManyToOne(fetch = FetchType.LAZY)
//    private Group group;


    @JsonManagedReference
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();


}
