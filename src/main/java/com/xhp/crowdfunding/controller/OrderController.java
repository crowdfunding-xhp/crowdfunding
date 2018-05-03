package com.xhp.crowdfunding.controller;

import com.xhp.crowdfunding.entity.Order;
import com.xhp.crowdfunding.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-05-02
 * Time: 9:48
 */
@RestController
@RequestMapping("/manage")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("listOrder.do")
    public List<Order> listOrder(){
        return orderService.searchAll();
    }
}
