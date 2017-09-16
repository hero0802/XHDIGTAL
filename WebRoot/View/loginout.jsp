<%@ page language="java" import="java.util.*,com.func.XhLog" pageEncoding="UTF-8"%>
    <%
    	request.setCharacterEncoding("GB18030");
        Cookie cookie1=new Cookie("username",null);
        cookie1.setMaxAge(0);
        cookie1.setPath("/");
        response.addCookie(cookie1);
        
        Cookie cookie2=new Cookie("groupname",null);
        cookie2.setMaxAge(0);
        cookie2.setPath("/");
        response.addCookie(cookie2);
        
        Cookie cookie3=new Cookie("xhgmpass",null);
        cookie3.setMaxAge(0);
        cookie3.setPath("/");
        response.addCookie(cookie3);
        
        Cookie cookie4=new Cookie("XHGMPASS",null);
        cookie4.setMaxAge(0);
        cookie4.setPath("/");
        response.addCookie(cookie4);
        
        Cookie cookie5=new Cookie("XHGMUSERNAME",null);
        cookie5.setMaxAge(0);
        cookie5.setPath("/");
        response.addCookie(cookie5);
        
        Cookie cookie6=new Cookie("groupid",null);
        cookie6.setMaxAge(0);
        cookie6.setPath("/");
        response.addCookie(cookie6);
        
        Cookie cookie7=new Cookie("userid",null);
        cookie7.setMaxAge(0);
        cookie7.setPath("/");
        response.addCookie(cookie7);
        
        /*Cookie cookie3=new Cookie("level",null);
        cookie3.setMaxAge(0);
        cookie3.setPath("/");
        response.addCookie(cookie3);*/
        
        //session.removeAttribute("user");
        XhLog log=new XhLog();
        log.writeLog(4, log.time()+" 退出系统","");
        
        response.sendRedirect("login.html");
    %>
