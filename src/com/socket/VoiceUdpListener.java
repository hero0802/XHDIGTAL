package com.socket;

import java.util.Timer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;



public class VoiceUdpListener implements ServletContextListener{
	private VoiceUDP udp;

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		VoiceUDP udp=new VoiceUDP();
		udp.start();
		
	}

	

}
