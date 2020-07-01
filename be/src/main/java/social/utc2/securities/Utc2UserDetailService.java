package social.utc2.securities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import social.utc2.entities.User;
import social.utc2.repositories.UserRepository;

import java.util.Optional;

@Service
public class Utc2UserDetailService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Utc2UserDetail loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username);
        if (user == null) throw new UsernameNotFoundException(username);
        return new Utc2UserDetail(user);
    }
    public Utc2UserDetail loadUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        if (ObjectUtils.isEmpty(user)) return null;
        return new Utc2UserDetail(user.get());
    }
}
