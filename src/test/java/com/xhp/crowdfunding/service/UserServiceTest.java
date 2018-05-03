package com.xhp.crowdfunding.service;

import com.xhp.crowdfunding.CrowdfundingApplication;
import com.xhp.crowdfunding.entity.User;
import lombok.Data;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrowdfundingApplication.class)
public class UserServiceTest {

    @Autowired
    private UserService userService;
    @Test
    public void login() {
        User user = userService.login("张三","123456");
        Assert.assertNotNull(user);
    }

    @Test
    public void searchAll(){
        List<User> userList = userService.searchAll();
        Assert.assertNotNull(userList);
    }

    @Test
    public void checkUsername(){
        String username="张三";
        Assert.assertTrue(userService.checkUsername(username));
        username="张三123";
        Assert.assertFalse(userService.checkUsername(username));
    }


    @Test
    public void streamTest(){


    }

}