package social.utc2.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Blob;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    @Column
    private Integer roomId;

    @Column
    private String fromId;

    @Column
    private String toId;

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

}
