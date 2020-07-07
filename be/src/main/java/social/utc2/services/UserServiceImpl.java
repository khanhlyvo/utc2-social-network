package social.utc2.services;

import social.utc2.constants.Constant.ERROR;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import social.utc2.entities.User;
import social.utc2.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
//        currentUtc2User.setPassWord(passwordEncoder.encode(user.getPassWord()));
      currentUtc2User.setFirstName(user.getFirstName());
      currentUtc2User.setLastName(user.getLastName());
      currentUtc2User.setBirthDate(user.getBirthDate());
      currentUtc2User.setEmail(user.getEmail());
//      currentUtc2User.setDepartment(user.getDepartment());
      currentUtc2User.setGender(user.getGender());
      currentUtc2User.setPhone(user.getPhone());
      currentUtc2User.setRole(user.getRole());

//      currentUtc2User.setUserMobileNumber(user.getUserMobileNumber());
//      currentUtc2User.setDtUpdDate(LocalDateTime.now());
      return userRepository.save(currentUtc2User);
   }

   @Override
   public User getUserById(Integer userId) {
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

//    public Optional<User> getById(String id) {
//        return userRepository.getOne(id);
//    }
}
