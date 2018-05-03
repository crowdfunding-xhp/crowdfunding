package com.xhp.crowdfunding.service;

import com.xhp.crowdfunding.dao.OrderMapper;
import com.xhp.crowdfunding.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-05-02
 * Time: 9:49
 */
@Service
public class OrderService {
    @Autowired
    private OrderMapper orderMapper;

    public List<Order> searchAll(){
        return orderMapper.searchAll();
    }
}
