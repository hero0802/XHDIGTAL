package com.func;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Cookie;
import org.apache.struts2.ServletActionContext;

public class Cookies {
	
	//设置cookie
	public void addCookie(String name,String value){
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(60*60*24*7*36);	
		cookie.setPath("/");
		ServletActionContext.getResponse().addCookie(cookie);
	}
	//获取cookie
	public String getCookie(String name){
		HttpServletRequest request = ServletActionContext.getRequest();
		Cookie[] cookies = request.getCookies();
		for(Cookie cookie : cookies)
		{
			if(cookie.getName().equals(name))
			{
				return cookie.getValue();
			
			}
		}
        return null;
    }

}
