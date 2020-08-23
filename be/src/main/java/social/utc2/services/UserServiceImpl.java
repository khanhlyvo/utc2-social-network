package social.utc2.services;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import social.utc2.constants.Constant.ERROR;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import social.utc2.entities.Group;
import social.utc2.entities.User;
import social.utc2.repositories.UserRepository;

import javax.imageio.ImageIO;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
//import java.util.Base64;
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
         return userRepository.save(user);
      }
      throw new Exception(ERROR.USERNAME_EXIST);
   }

   @Override
   public User updateUser(User user) throws IOException {

      String path = "C:/Users/Lilly/Pictures/profile/" + user.getUserName();


      User currentUtc2User = userRepository.findById(user.getId()).get();

      if(user.getAvatar() != null) {
         File file = new File(path + "-avatar.jpg");
         byte[] data = Base64.decodeBase64(user.getAvatar().split(",")[1]);
         try (OutputStream stream = new FileOutputStream(path + "-avatar.jpg")) {
            stream.write(data);
         }

         currentUtc2User.setAvatar(path+"-avatar.jpg");
      }
      if(user.getBackground() != null) {

         File file = new File(path + "-cover.jpg");
         byte[] data1 = Base64.decodeBase64(user.getBackground().split(",")[1]);
         try (OutputStream stream = new FileOutputStream(path + "-cover.jpg")) {
            stream.write(data1);
         }
         currentUtc2User.setBackground(path+"-cover.jpg");
      }
//        currentUtc2User.setPassWord(passwordEncoder.encode(user.getPassWord()));
      currentUtc2User.setFirstName(user.getFirstName());
      currentUtc2User.setLastName(user.getLastName());
      currentUtc2User.setBirthDate(user.getBirthDate());
      currentUtc2User.setEmail(user.getEmail());
      currentUtc2User.setUserName(user.getUserName());
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
   public User getUserByUserName(String userName) {
      User user =  userRepository.findByUserName(userName);
      if(user.getAvatar() != null) {
         user.setAvatar(encoder(user.getAvatar()));
      }
      if(user.getBackground() != null) {
         user.setBackground(encoder(user.getBackground()));
      }
      return user;
   }

   public static String encoder(String imagePath) {
      String base64Image = "";
      File file = new File(imagePath);
      try (FileInputStream imageInFile = new FileInputStream(file)) {
         // Reading a Image file from file system
         byte imageData[] = new byte[(int) file.length()];
         imageInFile.read(imageData);
         base64Image = java.util.Base64.getEncoder().encodeToString(imageData);
      } catch (FileNotFoundException e) {
         System.out.println("Image not found" + e);
      } catch (IOException ioe) {
         System.out.println("Exception while reading the Image " + ioe);
      }
      return  "data:image/jpg;base64," + base64Image;
   }

   @Override
   @Transactional
   public boolean deleteUsers(List<Integer> ids) {
      try {
         List<User> users = userRepository.findByIdIn(ids);
         for (User user : users) {
            user.setFlgDel(true);
         }
         userRepository.saveAll(users);
         return true;
      } catch (Exception e) {
         e.printStackTrace();
         return false;
      }
   }

   @Override
   public List<User> getAllUser() {
      return userRepository.findAllByFlgDelFalse();
   }

   @Override
   public List<User> getUserByIdOrName(String name, Integer pageNo, Integer pageSize) {

      Pageable paging = PageRequest.of(pageNo, pageSize);
      return userRepository.searchUser(name, paging);}
//    public Optional<User> getById(String id) {
//        return userRepository.getOne(id);
//    }
}
