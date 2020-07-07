package social.utc2.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

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

    @JsonManagedReference
    @OneToMany(mappedBy = "group")
    private List<Department> departments;
}
