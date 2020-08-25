package social.utc2.responses;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

import javax.persistence.Column;

@Data
public class NotiResponse {
    private Integer id;

    private String type;

    private Integer toId;

    private String toUserName;

    private Integer fromId;

    private String fromUserName;

    private Integer idPost;

    private Date date;

    private boolean seen;

    private String fromFullName;

    private String fromAvatar;
}
