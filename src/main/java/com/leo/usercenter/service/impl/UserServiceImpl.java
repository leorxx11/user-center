package com.leo.usercenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leo.usercenter.model.domain.User;
import com.leo.usercenter.mapper.UserMapper;
import com.leo.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import static com.leo.usercenter.constant.UserConstant.USER_LOGIN_STATE;

/**
* @author leo
* @description 针对表【user(用户表)】的数据库操作Service实现
* @createDate 2026-03-09 20:54:20
*/
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{

    @Resource
    private UserMapper userMapper;


    /**
     * 盐值，混淆加密
     */
    private static final String SALT = "leo";



    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword){

        //检验
        if(StringUtils.isAllBlank(userAccount, userPassword,checkPassword)) return -1;
        if(userAccount.length() < 4) return -1;
        if(userPassword.length() < 8 || checkPassword.length() < 8 ) return  -1;

        //特殊字符
        String validPattern = ".*[ _`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？].*";
        if (userAccount.matches(validPattern)) return -1;

        //密码与校验码相同
        if(!userPassword.equals(checkPassword)) return -1;

        //查重
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount",userAccount);
        long count = this.count(queryWrapper);
        if(count > 0) return -1;

        //加密
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());

        //插入数据
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword);
        boolean result = this.save(user);
        if(!result) return -1;
        return user.getId();
    }


    @Override
    public User userLogin(String userAccount, String userPassword, HttpServletRequest request){
        //检验
        if(StringUtils.isAllBlank(userAccount, userPassword)) return null;
        if(userAccount.length() < 4) return null;
        if(userPassword.length() < 8  ) return  null;

        //特殊字符
        String validPattern = ".*[ _`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？].*";
        if (userAccount.matches(validPattern)) return null;

        //加密
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());

        //查重
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount",userAccount);
        queryWrapper.eq("userPassword",encryptPassword);
        User user = userMapper.selectOne(queryWrapper);

        //用户不存在
        if(user == null) {
            log.info("user login failed, userAccount cannot match userPassword");
            return null;
        }

        //用户脱敏
        User safetyUser = getSafetyUser(user);

        //记录用户登录态
        request.getSession().setAttribute(USER_LOGIN_STATE, safetyUser);


        return safetyUser;
    }

    @Override
    public User getSafetyUser(User OriginUser){
        User safetyUser =  new User();
        safetyUser.setId(OriginUser.getId());
        safetyUser.setUsername(OriginUser.getUsername());
        safetyUser.setUserAccount(OriginUser.getUserAccount());
        safetyUser.setAvatarUrl(OriginUser.getAvatarUrl());
        safetyUser.setGender(OriginUser.getGender());
        safetyUser.setPhone(OriginUser.getPhone());
        safetyUser.setEmail(OriginUser.getEmail());
        safetyUser.setUserStatus(OriginUser.getUserStatus());
        safetyUser.setUserRole (OriginUser.getUserRole());
        safetyUser.setCreateTime(OriginUser.getCreateTime());

        return safetyUser;
    }

    @Override
    public int userLogout(HttpServletRequest request) {
        request.getSession().removeAttribute(USER_LOGIN_STATE);
        return 1;
    }

}




