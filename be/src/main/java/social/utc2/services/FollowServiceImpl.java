package social.utc2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import social.utc2.entities.Follow;
import social.utc2.entities.Group;
import social.utc2.repositories.FollowRepository;

import java.util.List;

@Service
public class FollowServiceImpl implements FollowService {
    @Autowired
    FollowRepository followRepository;

    @Override
    public Follow insertFollow(Follow follow) {
        return followRepository.save(follow);
    };

    @Override
    public boolean deleteFollow(Follow follow) {
        try {
            followRepository.delete1(follow.getFollower(), follow.getFollowee());
            return true;
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    };

    @Override
    public List<Follow> getFollows(String follower) {
        return followRepository.findAllByFollower(follower);
    };
}
