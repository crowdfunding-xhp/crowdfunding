package com.xhp.crowdfunding;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@MapperScan("com.xhp.crowdfunding.dao")
public class CrowdfundingApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrowdfundingApplication.class, args);
    }
}
