package social.utc2.responses;

import lombok.Data;

@Data
public class LoginResponse {
    private String id;

    private String username;

    private String token;

    private String role;
}
