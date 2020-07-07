package social.utc2.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class PageResponse {
    private int totalElements;

    private List<?> content;

    public PageResponse(int totalElements, List<?> content) {
        this.totalElements = totalElements;
        this.content = content;
    }
}
