package com.socket;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;

import javax.jms.JMSException;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.activemq.ActiveMqImpl;
import com.func.WebFun;



public class VoiceUdpListener implements ServletContextListener{
	private VoiceUDP udp;
	private static Timer timer = null;

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
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 1); // 凌晨1点
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		Date date = calendar.getTime();
		/*if (date.before(new Date())) {
			date = WebFun.addDay(date, 1);
		}*/
		if (timer == null) {
			timer = new Timer();
			timer.scheduleAtFixedRate(new ManageUDP(), date,  20*60 * 1000);
		}
		
	}
	
	class ManageUDP extends TimerTask{
		protected final Log log = LogFactory.getLog(ManageUDP.class);

		@Override
		public void run() {
			// TODO Auto-generated method stub
			//System.out.println("UDP状态："+VoiceUDP.getSocket().isConnected());
			if(VoiceUDP.getSocket()!=null){
				System.out.println("UDP状态："+(VoiceUDP.getSocket().isClosed()==false?"正常":"关闭"));
				int h=WebFun.nowHour();
				int m=WebFun.nowMin();
				if(h==3){
					if(VoiceUDP.getSocket()!=null && TcpKeepAliveClient.getM_calling()==0){
						if(VoiceUDP.getSocket().isClosed()==false){
							VoiceUDP.getSocket().close();
							VoiceUDP.setIsconnected(false);
						}
					}
				}
			}else{
				log.info("语音监听还未启动");
			}
			
			
			
			
		}
		
		
	}

	

}
