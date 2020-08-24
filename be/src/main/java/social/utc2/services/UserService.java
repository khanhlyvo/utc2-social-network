package social.utc2.services;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.stereotype.Service;
import social.utc2.entities.User;
import social.utc2.request.Pagination;
import social.utc2.responses.PageResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
public interface UserService {

    User insertUser(User user) throws Exception;

    User updateUser(User user) throws IOException;

    User getUserById(Integer userId);

    User getUserByUserName(String userName);

    boolean deleteUsers(List<Integer> userIds);

    PageResponse getAllUser(Pagination pagination);

    List<User> getUserByIdOrName(String name, Integer pageNo, Integer pageSize);

//    PageResponse search(Pagination pagination);

//    ByteArrayInputStream exportExcelFile(String fileName) throws Exception;

    void importFile(InputStream is) throws IOException, InvalidFormatException;

    void resetPassword(Integer id, String password);
}
