package social.utc2.entities;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "group_id")
    @Getter @Setter
    private Group group;

    @OneToMany(mappedBy = "department")
    private List<User> users = new ArrayList<>();

}
