package social.utc2.securities;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenJWTUltils {
    @Value("${app.jwtSecret}")
    private String SECRET;

    @Value("${app.jwtExpirationInMs}")
    private int EXPIRED_TIME;

    private static final Logger logger = LoggerFactory.getLogger(TokenJWTUltils.class);

    public String generateJWT(Authentication authentication) {
        Utc2UserDetail userPrincipal = (Utc2UserDetail) authentication.getPrincipal();
        return Jwts.builder()
                .setId(userPrincipal.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRED_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    public String getAuthenticationFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
        return claims.getId();
    }

    public boolean validateToken(String authoToken) {
        try {
            Jwts.parser().setSigningKey(SECRET)
                    .parseClaimsJws(authoToken);
            return true;
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}
