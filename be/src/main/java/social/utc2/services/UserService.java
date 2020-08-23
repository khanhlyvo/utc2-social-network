package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.User;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public interface UserService {

    User insertUser(User user) throws Exception;

    User updateUser(User user) throws IOException;

    User getUserById(Integer userId);

    User getUserByUserName(String userName);

    boolean deleteUsers(List<Integer> userIds);

    List<User> getAllUser();

    List<User> getUserByIdOrName(String name, Integer pageNo, Integer pageSize);

//    PageResponse search(Pagination pagination);

//    ByteArrayInputStream exportExcelFile(String fileName) throws Exception;


}
