package social.utc2.services;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import social.utc2.constants.Constant.ERROR;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import social.utc2.entities.Department;
import social.utc2.entities.Group;
import social.utc2.entities.User;
import social.utc2.repositories.DepartmentRepository;
import social.utc2.repositories.UserRepository;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;
import social.utc2.responses.ProfileResponse;

import javax.imageio.ImageIO;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
//import java.util.Base64;
import java.util.*;

@Service
public class UserServiceImpl implements UserService{
   @Autowired
   private UserRepository userRepository;

   @Autowired
   PasswordEncoder passwordEncoder;

   @Autowired
   private DepartmentRepository departmentRepository;

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
      currentUtc2User.setDepartment(user.getDepartment());
      currentUtc2User.setGender(user.getGender());
      currentUtc2User.setPhone(user.getPhone());
      currentUtc2User.setRole(user.getRole());

//      currentUtc2User.setUserMobileNumber(user.getUserMobileNumber());
//      currentUtc2User.setDtUpdDate(LocalDateTime.now());

      return userRepository.save(currentUtc2User);
   }

   @Override
   public User getUserById(Integer userId) {
       User user = userRepository.findById(userId).get();
      if(user.getAvatar() != null) {
         user.setAvatar(encoder(user.getAvatar()));
      }
      if(user.getBackground() != null) {
         user.setBackground(encoder(user.getBackground()));
      }
      return user;
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
   public PageResponse getAllUser(Pagination pagination) {
      Pageable paging = null;
      if (Optional.of(pagination.getSize()).isPresent() && pagination.getSize() > 0) {
         paging = PageRequest.of(pagination.getPage() - 1, pagination.getSize());
      }
      PageResponse pageResponse = new PageResponse();
      Page<User> page = null;
      if (StringUtils.isEmpty(pagination.getSearchValue())) {
         page = userRepository.findAllByFlgDelFalse(paging);
      } else {
         page = userRepository.search(paging, pagination.getSearchValue());
      }
      pageResponse.setContent(page.getContent());
      pageResponse.setTotalElements((int) page.getTotalElements());
      return pageResponse;
   }

   @Override
   public List<User> getUserByIdOrName(String name, Integer pageNo, Integer pageSize) {

      Pageable paging = PageRequest.of(pageNo, pageSize);
      return userRepository.searchUser(name, paging);}
//    public Optional<User> getById(String id) {
//        return userRepository.getOne(id);
//    }

   @Override
   @Transactional
   public void importFile(InputStream is) throws IOException, InvalidFormatException {

      Workbook workbook = WorkbookFactory.create(is);

      try {
         Sheet sheet = workbook.getSheetAt(0);
         // Create a DataFormatter to format and get each cell's value as String
         DataFormatter dataFormatter = new DataFormatter();
         SimpleDateFormat formatter = new SimpleDateFormat("yyyy-mm-dd");

         // 1. You can obtain a rowIterator and columnIterator and iterate over them
         System.out.println("\n\nIterating over Rows and Columns using Iterator\n");
         Iterator<Row> rowIterator = sheet.rowIterator();
         boolean firstRow = true;
         List<User> users = new ArrayList<>();
         List<String> departmentIds = new ArrayList<>();
         while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if (firstRow) {
               firstRow = false;
               continue;
            } else {
               String password = "";
               User user = new User();
               // Now let's iterate over the columns of the current row
               Iterator<Cell> cellIterator = row.cellIterator();
               int count = 0;
               while (cellIterator.hasNext()) {
                  Cell cell = cellIterator.next();
                  String cellValue = dataFormatter.formatCellValue(cell);
                  count++;
                  switch (count) {
                     case 1:
                        if (cellValue != null && !StringUtils.isEmpty(cellValue)) {
                           user.setUserName(cellValue);
                        }
                        break;
                     case 2:
                        if (cellValue != null && !StringUtils.isEmpty(cellValue)) {
                           String[] names = cellValue.split(" ");
                           String firstName = "";
                           for (int i = 0; i < names.length; i++) {
                              if (i != names.length - 1) {
                                 firstName += names[i] + " ";
                              } else {
                                 user.setLastName(names[i]);
                              }
                           }
                           user.setFirstName(firstName);
                        }
                        break;
                     case 3:
                        if (cellValue != null && !StringUtils.isEmpty(cellValue)) {
                           user.setBirthDate(formatter.parse(cellValue));
                           password = cellValue.replace("-", "");
                           user.setPassWord(passwordEncoder.encode(password));
                        }
                        break;
                     case 5:
                        if (cellValue != null && !StringUtils.isEmpty(cellValue)) {
                           if (cellValue.equals("FALSE")) {
                              continue;
                           }
                           if (!departmentIds.contains(cellValue)) {
                              departmentIds.add(cellValue);
                           }
                           user.setDepartment(new Department());
                           user.getDepartment().setDepartName(cellValue);
                        }
                        break;
                     default: continue;
                  }
               }
               user.setRole("User");
               if (user.getBirthDate() != null && user.getFirstName() != null && user.getLastName() != null && user.getUserName() != null) {
                  users.add(user);
               }
            }
         }
         List<Department> departments = departmentRepository.search(null, "").getContent();
         List<Department> departmentInsert = new ArrayList<>();
         for (String s : departmentIds) {
            for (Department department : departments) {
               if (!department.getDepartName().contains(s)) {
                  Department de = new Department();
                  de.setDepartName(s);
                  de.setDepartId(s);
                  de.setGroupId(1);
                  departmentInsert.add(de);
                  break;
               }
            }
         }

         List<Department> deInsert = departmentRepository.saveAll(departmentInsert);
         users.forEach(user -> {
            for (Department department : deInsert) {
               if (user.getDepartment() != null && user.getDepartment().getDepartName().equals(department.getDepartName())) {
                  user.setDepartment(department);
                  break;
               }
            }
         });
         userRepository.saveAll(users);
      } catch (Exception e) {
         e.printStackTrace();
      } finally {
         // Closing the workbook
         workbook.close();
      }
   }

   @Override
   public void resetPassword(Integer id, String password) {
      Optional<User> user = userRepository.findById(id);
      if (user.isPresent()) {
         user.get().setPassWord(passwordEncoder.encode(password));
         userRepository.save(user.get());
      } else {
         throw new UsernameNotFoundException("");
      }
   }
}
