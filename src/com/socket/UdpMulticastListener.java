package com.socket;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class UdpMulticastListener implements ServletContextListener{
	private UdpMulticast uml;

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(uml.isInterrupted()|| uml!=null){
			uml.start();
		}
		
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(uml==null){
			uml=new UdpMulticast();
			uml.start();
		}
		
	}

}
