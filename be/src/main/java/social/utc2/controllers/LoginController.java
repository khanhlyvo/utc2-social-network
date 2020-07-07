    package social.utc2.controllers;

    import social.utc2.constants.Constant.API;
    import social.utc2.constants.Constant.WEB_CONSTANT;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestMethod;
    import org.springframework.web.bind.annotation.RestController;
    import social.utc2.entities.User;
    import social.utc2.repositories.UserRepository;
    import social.utc2.responses.LoginResponse;
    import social.utc2.securities.TokenJWTUltils;

    import javax.servlet.http.Cookie;
    import javax.servlet.http.HttpServletResponse;

    @RestController
    @RequestMapping("/login")
    public class LoginController {

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TokenJWTUltils tokenProvider;

        @RequestMapping(value = "", method = RequestMethod.POST)
        public ResponseEntity<?> login(@RequestBody User loginRequest, HttpServletResponse response) {
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUserName(),
                                loginRequest.getPassWord()
                        )
                );
                // Set  authentication info to Security Context
                SecurityContextHolder.getContext().setAuthentication(authentication);
                // return jwt to client
                String jwt = tokenProvider.generateJWT(authentication);
                User user = userRepository.findByUserName(loginRequest.getUserName());

                Cookie token = new Cookie(WEB_CONSTANT.TOKEN, jwt);
                response.addCookie(token);
                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setId(user.getId().toString());
                loginResponse.setToken(jwt);
                loginResponse.setUsername(user.getUserName());
                loginResponse.setRole(user.getRole());

//                User userEntity = new User();
//                userEntity.setId(user.getId());
//                userEntity.setUserName(user.getUserName());
                return new ResponseEntity<>(loginResponse,HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }
    }
