package com.xhp.crowdfunding.service;

import com.xhp.crowdfunding.dao.ManagerMapper;
import com.xhp.crowdfunding.entity.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-04-28
 * Time: 15:18
 */
@Service
public class ManagerService {
    @Autowired
    private ManagerMapper managerMapper;

    public Manager login(String username,String password){
        return managerMapper.selectByUsernameAndPassword(username,password);
    }
}
