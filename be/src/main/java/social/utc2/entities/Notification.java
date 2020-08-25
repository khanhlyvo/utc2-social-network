package social.utc2.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class Notification {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
    private String type;

    @Column
    private Integer toId;

    @Column
    private String toUserName;

    @Column
    private Integer fromId;

    @Column
    private String fromUserName;

    @Column
    private Integer idPost;

    @Column
    private boolean seen;

    @Column
    Date date = new Date();
}
