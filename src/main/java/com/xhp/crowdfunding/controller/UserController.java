package com.xhp.crowdfunding.controller;

import com.google.gson.Gson;
import com.xhp.crowdfunding.entity.User;
import com.xhp.crowdfunding.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.net.URLEncoder;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-04-28
 * Time: 13:54
 */
@RestController
@RequestMapping("manage")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Value("${ftp.server.http.prefix}")
    private String IMG_URL_PREFIX;
    @Autowired
    private UserService userService;

    @PostMapping("login.do")
    public String login(HttpServletResponse response, @RequestParam("signin_username") String username, @RequestParam("signin_password") String password) throws Exception {
        User user = userService.login(username, password);
        if (null != user) {
            Gson gson = new Gson();
            String userInfo = URLEncoder.encode(gson.toJson(user), "UTF-8");
            Cookie cookie = new Cookie("userInfo", userInfo);
            cookie.setMaxAge(60 * 50);
            cookie.setSecure(false);
            response.addCookie(cookie);
            return "1";
        }
        return "0";
    }

    @PostMapping("UpdateUser.do")
    public void updateUser(HttpServletResponse response, String uid, String unickname, String usex, String uphone, MultipartFile uimage) throws Exception {
        log.info(uid + "---" + unickname + "---" + usex + "---" + uphone + "---" + uimage.getOriginalFilename());
        String targetFileName = userService.upload(uimage);
        String url = IMG_URL_PREFIX + targetFileName;
        User user = new User();
        user.setUid(uid);
        user.setUnickname(unickname);
        user.setUsex(usex);
        user.setUphone(uphone);
        user.setUimage(url);
        userService.updateUser(user);
        Gson gson = new Gson();
        String userInfo = URLEncoder.encode(gson.toJson(user), "UTF-8");
        //  重置cookie
        Cookie cookie = new Cookie("userInfo", userInfo);
        cookie.setMaxAge(60 * 50);
        cookie.setSecure(false);
        response.addCookie(cookie);
    }
    @PostMapping("signUpUserNameCheck.do")
    public String signUpUserNameCheck(@RequestParam("signup_username")String username){
        if (userService.checkUsername(username))
            return "false";
        return "true";
    }

    @PostMapping("signUpUser.do")
    public String signUpUser(@RequestParam("signup_username")String username,@RequestParam("signup_email")String email,
                             @RequestParam("signup_password")String password){
        User user = new User();
        user.setUnickname(username);
        user.setUemail(email);
        user.setUpassword(password);
        user.setUimage("http://images.yuchu.ac.cn/c1e619c8-ef4e-449e-9aa8-7d7512002a45.jpg");//默认头像
        try {
            userService.addUser(user);
            return "true";
        }catch (Exception e){
            log.error(e.getMessage());
        }
        return "false";

    }
}
