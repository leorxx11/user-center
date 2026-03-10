package com.leo.usercenter.service;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.leo.usercenter.model.domain.User;




@SpringBootTest
public class UserServiceTest {

    @Resource
    private UserService userService;

    @Test
    public void testAddUser(){

        User user = new User();
        user.setUsername("leorxx");
        user.setUserAccount("2233198920");
        user.setAvatarUrl("https://example.com/avatar.png");
        user.setGender(0);
        user.setUserPassword("12345678");
        user.setPhone("13800138000");
        user.setEmail("test@example.com");
        user.setUserRole(1);

        boolean result = userService.save(user);
        System.out.println(user.getId());
        org.junit.jupiter.api.Assertions.assertTrue(result);
    }

    @Test
    public void userRegister() {
        // 非空
        long result = userService.userRegister("testAccount", "", "12345678");
        Assertions.assertEquals(-1, result);

        // 账户长度不小于 4
        result = userService.userRegister("abc", "12345678", "12345678");
        Assertions.assertEquals(-1, result);

        // 密码长度不小于 8
        result = userService.userRegister("testAccount", "1234567", "1234567");
        Assertions.assertEquals(-1, result);

        // 账户不能包含特殊字符
        result = userService.userRegister("test@Account", "12345678", "12345678");
        Assertions.assertEquals(-1, result);

        // 密码与校验密码相同
        result = userService.userRegister("testAccount456", "12345678", "123456789");
        Assertions.assertEquals(-1, result);

        // 账户不重复：第一次成功，第二次失败
        String userAccount = "testAccount123";
        String userPassword = "12345678";
        String checkPassword = "12345678";
        long firstResult = userService.userRegister(userAccount, userPassword, checkPassword);
        long secondResult = userService.userRegister(userAccount, userPassword, checkPassword);
        Assertions.assertTrue(firstResult > 0);
        Assertions.assertEquals(-1, secondResult);

        // 正常注册
        result = userService.userRegister("testAccount789", "12345678", "12345678");
        Assertions.assertTrue(result > 0);
    }
}