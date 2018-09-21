package com.dwr;

import java.io.IOException;
import java.util.Collection;

import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;

import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;

public class IndexDwr {
	public static WebContext wctx = null;
	private static SendData send=new SendData();
	private static MessageStruct header = new MessageStruct();
	
	//中心通讯
	public static void centerStatus(int status){
		
		 if (wctx == null) {
	         wctx = WebContextFactory.get();
	     }
		 if (wctx == null) {
				return ;
			}
		 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
	    //得到上下文  
	    WebContext contex = WebContextFactory.get();  	      
	    //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
	    Collection<ScriptSession> scriptSessions = sctx.getScriptSessionsByPage(wctx.getCurrentPage());;
	    Util util = new Util(scriptSessions);  	      
	    //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
	    ScriptBuffer sb = new ScriptBuffer();  
	    sb.appendScript("statusUtil(");  
	    sb.appendData(status);  
	    sb.appendScript(")");   
	    //推送  
	    util.addScript(sb); 
	}
	//交换通信
	public static void swStatus(int status){
		
		 if (wctx == null) {
	         wctx = WebContextFactory.get();
	     }
		 if (wctx == null) {
				return ;
			}
		 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
	    //得到上下文  
	    WebContext contex = WebContextFactory.get();  	      
	    //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
	    Collection<ScriptSession> scriptSessions = sctx.getScriptSessionsByPage(wctx.getCurrentPage());;
	    Util util = new Util(scriptSessions);  	      
	    //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
	    ScriptBuffer sb = new ScriptBuffer();  
	    sb.appendScript("swStatus(");  
	    sb.appendData(status);  
	    sb.appendScript(")");   
	    //推送  
	    util.addScript(sb); 
	}
	//数据库通讯
	public static void DBStatus(int status){
		
		 if (wctx == null) {
	         wctx = WebContextFactory.get();
	     }
		 if (wctx == null) {
				return ;
			}
		 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
	    //得到上下文  
	    WebContext contex = WebContextFactory.get();  	      
	    //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
	    Collection<ScriptSession> scriptSessions =  sctx.getScriptSessionsByPage(wctx.getCurrentPage());;
	    Util util = new Util(scriptSessions);  	      
	    //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
	    ScriptBuffer sb = new ScriptBuffer();  
	    sb.appendScript("dbStatus(");  
	    sb.appendData(status);  
	    sb.appendScript(")");   
	    //推送  
	    util.addScript(sb); 
	}
	public static void alarmDwr() {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("alarmIcon(");
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	public static void MuticastsrcBsid(String str) {
		if (wctx == null) {
			wctx = WebContextFactory.get();
		}
		if (wctx == null) {
			return;
		}
		ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
		// 得到上下文
		WebContext contex = WebContextFactory.get();
		// 得到要推送到 的页面 dwr3为项目名称 ， 一定要加上。
		Collection<ScriptSession> scriptSessions = sctx
				.getScriptSessionsByPage(wctx.getCurrentPage());
		Util util = new Util(scriptSessions);
		// 下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句 show(msg);
		ScriptBuffer sb = new ScriptBuffer();
		sb.appendScript("muticastsrc_bsid(");
		 sb.appendData(str);
		sb.appendScript(")");
		// 推送
		util.addScript(sb);

	}
	//用户总数
	public static void userAll(int num){
		
		 if (wctx == null) {
	         wctx = WebContextFactory.get();
	     }
		 if (wctx == null) {
				return ;
			}
		 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
	    //得到上下文  
	    WebContext contex = WebContextFactory.get();  	      
	    //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
	    Collection<ScriptSession> scriptSessions =  sctx.getScriptSessionsByPage(wctx.getCurrentPage());;
	    Util util = new Util(scriptSessions);  	      
	    //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
	    ScriptBuffer sb = new ScriptBuffer();  
	    sb.appendScript("userAllCount(");  
	    sb.appendData(num);  
	    sb.appendScript(")");   
	    //推送  
	    util.addScript(sb); 
	}
	//在线用户总数
	public static void userOnline(int num){
		
		 if (wctx == null) {
	         wctx = WebContextFactory.get();
	     }
		 if (wctx == null) {
				return ;
			}
		 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
	    //得到上下文  
	    WebContext contex = WebContextFactory.get();  	      
	    //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
	    Collection<ScriptSession> scriptSessions =  sctx.getScriptSessionsByPage(wctx.getCurrentPage());;
	    Util util = new Util(scriptSessions);  	      
	    //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
	    ScriptBuffer sb = new ScriptBuffer();  
	    sb.appendScript("userOnlineCount("); 
	    sb.appendData(num);  
	    sb.appendScript(")");   
	    //推送  
	    util.addScript(sb); 
	}
	//全网告警推送
	public static void alarmRefresh(){
		
		 if (wctx == null) {
	         wctx = WebContextFactory.get();
	     }
		 if (wctx == null) {
				return ;
			}
		 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
	    //得到上下文  
	    WebContext contex = WebContextFactory.get();  	      
	    //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
	    Collection<ScriptSession> scriptSessions =  sctx.getScriptSessionsByPage(wctx.getCurrentPage());;
	    Util util = new Util(scriptSessions);  	      
	    //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
	    ScriptBuffer sb = new ScriptBuffer();  
	    sb.appendScript("alarmrefresh("); 
	    sb.appendScript(")");   
	    //推送  
	    util.addScript(sb); 
	}

}
