package com.socket;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.config.config;
import com.func.WebFun;

public class TCPListener implements ServletContextListener{
	private TcpKeepAliveClient tcp;
	public config config=new config();
	 private String ip;
	 private int port;
	 private  WebFun func=new WebFun();

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(tcp.isInterrupted()||tcp!=null){
			tcp.interrupt();
		}
		
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(tcp==null){
			ip=func.readXml("centerNet", "center_ip");
            port=Integer.parseInt(func.readXml("centerNet", "center_port"));
			tcp=new TcpKeepAliveClient(ip, port);
			tcp.start();
			
		}
	
		
	}

}
