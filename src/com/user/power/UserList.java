package com.user.power;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;

public class UserList {
    private Cookies cookie=new Cookies();
    private FlexJSON json=new FlexJSON();
    private UserMenu m_usermenu=new UserMenu();
	
	//获取登录会员菜单
	public void userMenu(){
		String userName=cookie.getCookie("username");
		
		ArrayList data = null;
		try {
			data = m_usermenu.userMenuItem(userName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		try {
			ServletActionContext.getResponse().getWriter().write(jsonstr);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
