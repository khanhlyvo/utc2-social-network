package social.utc2.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
public class Post implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
    private String userName;

    @Column
    private String content;

    @Column
    private  boolean flgDel;

    @Column
//            (updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created = new Date();

}
