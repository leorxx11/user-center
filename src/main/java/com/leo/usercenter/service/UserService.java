package com.leo.usercenter.service;

import com.leo.usercenter.model.domain.User;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author leo
* @description 针对表【user(用户表)】的数据库操作Service
* @createDate 2026-03-09 20:54:20
*/
public interface UserService extends IService<User> {
    /**
     * 用户注册
     * @param userAccount 账户
     * @param userPassword 密码
     * @param checkPassword 校验码
     * @return 新用户 id
     */
    long userRegister(String userAccount, String userPassword, String checkPassword);

    /**
     *  用户登录
     * @param userAccount 账户
     * @param userPassword 密码
     * @return 脱敏后的用户信息
     */
    User doLogin(String userAccount, String userPassword);
}
