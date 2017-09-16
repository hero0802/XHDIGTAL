package com.dwr;
import java.io.IOException;
import java.util.Collection;  

import javax.servlet.http.HttpServletResponse;

import org.directwebremoting.ScriptBuffer;  
import org.directwebremoting.ScriptSession;  
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;  
import org.directwebremoting.WebContextFactory;  
import org.directwebremoting.proxy.dwr.Util; 


public class sendMsg {
	
	@SuppressWarnings("deprecation")  
	public static WebContext wctx = null;
    public static void sendMsg(String msg){  
    	 if (wctx == null) {
             wctx = WebContextFactory.get();
         }
    	 ServerContext sctx = ServerContextFactory.get(wctx.getServletContext());
        //得到上下文  
        WebContext contex = WebContextFactory.get();  
          
        //得到要推送到 的页面  dwr3为项目名称 ， 一定要加上。  
        Collection<ScriptSession> scriptSessions = sctx.getScriptSessionsByPage(wctx.getCurrentPage());
        Util util = new Util(scriptSessions);  
          
        //下面是创建一个javascript脚本 ， 相当于在页面脚本中添加了一句  show(msg);   
        ScriptBuffer sb = new ScriptBuffer();  
        sb.appendScript("show(");  
        sb.appendData(msg);  
        sb.appendScript(")");  
          
        //推送  
        util.addScript(sb);  
    }  

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		sendMsg.sendMsg("12346+6");
		if(sendMsg.wctx!=null){
			System.out.println("开始执行指定任务");
			sendMsg.sendMsg("123569");
		}else {
			System.out.println("开始");
		}

	}

}
