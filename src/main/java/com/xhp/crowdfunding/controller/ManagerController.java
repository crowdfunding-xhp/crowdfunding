//package com.xhp.crowdfunding.controller;
//
//import com.xhp.crowdfunding.entity.Manager;
//import com.xhp.crowdfunding.service.ManagerService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.SessionAttributes;
//
///**
// * Created with IntelliJ IDEA.
// * Description:
// * User: luqinglin
// * Date: 2018-04-28
// * Time: 14:56
// */
//@Controller
//@RequestMapping("/manager")
//@SessionAttributes("Mname")
//public class ManagerController {
//
//    @Autowired
//    private ManagerService managerService;
//
//    @GetMapping("login.html")
//    public String loginView(Model model){
//        model.addAttribute("message",null);
//        return "manager/login";
//    }
//    @GetMapping("top.html")
//    public String topView(Model model){
//        return "manager/top";
//    }
//    @GetMapping("userManager.html")
//    public String userManagerView(Model model){
//        return "manager/userManager";
//    }
//    @GetMapping("left.html")
//    public String leftView(Model model){
//        return "manager/left";
//    }
//    @PostMapping("managerLogin.do")
//    public String login(String  Mname,String Mpassword,Model model){
//        Manager manager = managerService.login(Mname,Mpassword);
//        if (manager!=null){
//            model.addAttribute("Mname",manager.getMname());
//            return "manager/manager";
//        }else {
//            model.addAttribute("message","用户名或密码不正确");
//            return "manager/login";
//        }
//    }
//}
