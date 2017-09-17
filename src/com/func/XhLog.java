package com.func;

import java.sql.Connection;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.sql.SysMysql;

public class XhLog {
	private SysMysql db=new SysMysql();
	private Cookies cookie=new Cookies();
	private WebFun fun=new WebFun();
	//记录日志
	public void writeLog(int type,String content,String user)throws Exception{
		HttpServletRequest request =ServletActionContext.getRequest();
		if(user.equals("")|| user.equals(null)){
			user=cookie.getCookie("username");
		}
		Connection conn=db.getConn();
		Statement stmt =conn.createStatement();
		String sql="insert into xhdigital_log(operator,type,content,time,ip)VALUES('"+user+"'," +
				""+type+",'"+content+"','"+time()+"','"+getIpAddr(request)+"')";
		stmt.executeUpdate(sql);
		conn.close();
		stmt.close();
	}
	public void writeLogNoSevlet(int type,String content,String user)throws Exception{
		
		if(user.equals("")|| user.equals(null)){
			user=cookie.getCookie("username");
		}
		Connection conn=db.getConn();
		Statement stmt =conn.createStatement();
		String sql="insert into xhdigital_log(operator,type,content,time,ip)VALUES('"+user+"'," +
				""+type+",'"+content+"','"+time()+"','"+fun.readXml("sms", "ip")+"')";
		stmt.executeUpdate(sql);
		conn.close();
		stmt.close();
	}
	//获取时间
	public String time(){
		SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date=dd.format(new Date());
		return date;
	}
	public String getIpAddr(HttpServletRequest request) {
		 String ip = request.getHeader("x-forwarded-for");
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("Proxy-Client-IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("WL-Proxy-Client-IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("HTTP_CLIENT_IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getRemoteAddr();
		    }
		    return ip;
		}

}
