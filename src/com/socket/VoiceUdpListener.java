package com.socket;

import java.util.Timer;

import javax.jms.JMSException;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.activemq.ActiveMqImpl;



public class VoiceUdpListener implements ServletContextListener{
	private VoiceUDP udp;

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		VoiceUDP udp=new VoiceUDP();
		/*try {
			ActiveMqImpl.CreateConnection();
		} catch (JMSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		udp.start();
		
	}

	

}
