package com.socket;

import java.util.Timer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class UdpServerListenner  implements ServletContextListener{

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		Timer timer = new Timer(); 
	    timer.schedule(new UdpServer() , 3 * 1000);
	}

}
