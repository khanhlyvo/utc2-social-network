package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.User;

import java.io.ByteArrayInputStream;
import java.util.List;

@Service
public interface UserService {

    User insertUser(User user) throws Exception;

    User updateUser(User user);

    User getUserById(Integer userId);

    User getUserByUserName(String userName);

    boolean deleteUsers(List<Integer> userIds);

    List<User> getAllUser();

//    PageResponse search(Pagination pagination);

//    ByteArrayInputStream exportExcelFile(String fileName) throws Exception;


}
