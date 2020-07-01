package social.utc2.securities;

import social.utc2.constants.*;
//import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    TokenJWTUltils tokenJWTUltils;

    @Autowired
    Utc2UserDetailService utc2UserDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJWTFromRequest(request);
            if (StringUtils.hasText(jwt) && tokenJWTUltils.validateToken(jwt)) {
                String userId = tokenJWTUltils.getAuthenticationFromJWT(jwt);
                Utc2UserDetail userDetails = utc2UserDetailService.loadUserById(userId);
                String clientIp = request.getHeader("X-FORWARDED-FOR");
                if (StringUtils.isEmpty(clientIp)) {
                    clientIp = request.getRemoteAddr();
                }
                userDetails.setClientIP(clientIp);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (Exception ex) {
            logger.error("Failed on set user authentication.");
        }
        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {

        }

    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String token = request.getHeader(Constant.WEB_CONSTANT.TOKEN);
        Cookie[] cookies = request.getCookies();
        if (!StringUtils.hasText(token)) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(Constant.WEB_CONSTANT.TOKEN)) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (StringUtils.hasText(token)) {
            return token;
        }
        return null;
    }
}
