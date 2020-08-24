package social.utc2.services;

import org.springframework.stereotype.Service;
import social.utc2.entities.Department;
import social.utc2.entities.Follow;

import java.util.List;


@Service
public interface FollowService {
    Follow insertFollow(Follow follow) throws Exception;
    boolean deleteFollow(Follow follow);
    List<Follow> getFollows(String follower);
}
