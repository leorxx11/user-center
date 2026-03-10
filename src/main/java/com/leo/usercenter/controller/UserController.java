package com.leo.usercenter.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.leo.usercenter.constant.UserConstant;
import com.leo.usercenter.model.domain.User;
import com.leo.usercenter.model.domain.request.UserLoginRequest;
import com.leo.usercenter.model.domain.request.UserRegisterRequest;
import com.leo.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


/**
 * 用户接口
 * @author leo
 */
@RestController
@RequestMapping("/user")
public class UserController implements UserConstant {

    @Resource
    private UserService userService;

    @PostMapping("/register")
    public Long userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) return null;

        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        if(StringUtils.isAllBlank(userAccount,userPassword,checkPassword)) return null;


        return userService.userRegister(userAccount,userPassword,checkPassword);
    }

    @PostMapping("/login")
    public User userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) return null;

        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if(StringUtils.isAllBlank(userAccount,userPassword)) return null;


        return userService.userLogin(userAccount,userPassword,request);
    }

    /**
     * 是否为管理员
     * @param request 请求
     * @return 布尔
     */
    private boolean isAdmin(HttpServletRequest request) {
        //鉴权
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;
        return user != null && user.getRole() == ADMIN_ROLE;
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String username, HttpServletRequest request) {

        if(!isAdmin(request)) return new ArrayList<>();

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotEmpty(username)){
            queryWrapper.like("username",username);
        }
        return userService.list(queryWrapper);
    }

    @PostMapping("/delete")
    public boolean deleteUsers(@RequestBody long id, HttpServletRequest request) {

        if(!isAdmin(request)) return false;

        if(id <= 0) return false;
        return userService.removeById(id);
    }
}
