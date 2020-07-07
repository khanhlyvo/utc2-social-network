package social.utc2.request;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Pagination {
    private Integer page;

    private Integer size;

    private String fields;

    private String searchValue;

    private String orderBy;

    private boolean asc;

    private String type;

    private LocalDateTime fromDate;

    private LocalDateTime toDate;
}
