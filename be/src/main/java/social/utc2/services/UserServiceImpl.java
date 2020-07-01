package social.utc2.services;

import com.sun.corba.se.spi.ior.ObjectId;
import social.utc2.constants.Constant.ERROR;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import social.utc2.entities.User;
import social.utc2.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{
   @Autowired
   private UserRepository userRepository;


   @Autowired
   PasswordEncoder passwordEncoder;

   @Override
   public User insertUser(User user) throws Exception {
      if (ObjectUtils.isEmpty(userRepository.findByUserName(user.getUserName()))) {
         user.setPassWord(passwordEncoder.encode(user.getPassWord()));
//         user.setCreated(LocalDateTime.now());
         return userRepository.save(user);
      }
      throw new Exception(ERROR.USERNAME_EXIST);
   }

   @Override
   public User updateUser(User user) {
      User currentUtc2User = userRepository.findById(user.getId()).get();
        currentUtc2User.setPassWord(passwordEncoder.encode(user.getPassWord()));
      currentUtc2User.setFirstName(user.getFirstName());
      currentUtc2User.setEmail(user.getEmail());
//      currentUtc2User.setUserMobileNumber(user.getUserMobileNumber());
//      currentUtc2User.setDtUpdDate(LocalDateTime.now());
      return userRepository.save(currentUtc2User);
   }

   @Override
   public User getUserById(String userId) {
      return userRepository.findById(userId).get();
   }

   @Override
   public boolean deleteUser(String userId) {
      User user = userRepository.findById(userId).get();
      if (!ObjectUtils.isEmpty(user)) {
         user.setFlagDel(true);
         user = userRepository.save(user);
         return !ObjectUtils.isEmpty(user);
      }
      return false;
   }

   @Override
   public List<User> getAllUser() {
      return userRepository.findAll();
   }

//    public Optional<UserEntity> getById(UserEntity id) {
//        return userRepository.getOne(id);
//    }
}
