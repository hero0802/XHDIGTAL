package com.socket;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ClientListener implements ServletContextListener{
	private LongClient clientThread;

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		 if(null!=clientThread){
			 clientThread.close();
		 }
		
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		 if(null == clientThread){
			 clientThread.getInstance().sendHeartBeat();
	        }
		
	}

}
