package com.xhp.crowdfunding.service;

import com.xhp.crowdfunding.dao.UserMapper;
import com.xhp.crowdfunding.entity.User;
import com.xhp.crowdfunding.util.FTPUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-04-28
 * Time: 9:55
 */
@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private FTPUtil ftpUtil;

    public User login(String username, String password){
        return userMapper.selectByUsernameAndPassword(username,password);
    }

    public List<User> searchAll(){
        return userMapper.selectAll();
    }


    public void addUser(User user){
        user.setUid(UUID.randomUUID().toString().replaceAll("-","").toLowerCase());
        userMapper.insertSelective(user);
    }

    public void updateUser(User user){
        userMapper.updateByPrimaryKeySelective(user);
    }

    public boolean checkUsername(String username){
        return userMapper.selectByUsername(username);
    }


    public String upload(MultipartFile file){
        try {
            String fileName = file.getOriginalFilename();
            String fileExtensionName = fileName.substring(fileName.lastIndexOf(".")+1);
            String uploadFileName = UUID.randomUUID().toString()+"."+fileExtensionName;
            ftpUtil.uploadFile(uploadFileName,file.getInputStream());
            return uploadFileName;
        } catch (IOException e) {
            log.error("上传文件异常",e);
            return null;
        }
    }
}
