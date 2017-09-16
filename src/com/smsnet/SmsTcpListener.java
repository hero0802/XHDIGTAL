package com.smsnet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class SmsTcpListener  implements ServletContextListener{
	private  SmsTcp smsTcp;
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if (smsTcp.isInterrupted()||smsTcp!=null) {
			smsTcp.interrupt();
		}
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if (smsTcp==null) {
			smsTcp=new SmsTcp();
			smsTcp.start();
		}
	}

}
