package social.utc2.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
    private String fromId;

    @Column
    private Integer toUserId;

    @Column
    private String toId;

    @Column
    private Integer fromUserId;

    @Column
    private String type;

    @Column
    private Boolean seen;

    @Column
    private String message;

    @Column
    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column
    Date date = new Date();

//    @JsonBackReference
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "fromId", referencedColumnName = "userName")
//    private User user;
}
