package com.listener;

import java.io.IOException;
import java.net.Socket;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.func.WebFun;
import com.smsnet.SendSms;
import com.smsnet.SmsTcp;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;

public class SmsHeartListener implements ServletContextListener{
	private static Timer timer=null;

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		if (timer!=null) {
			timer.cancel();
		}
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		if (timer==null) {
			timer=new Timer();
		}
		timer.scheduleAtFixedRate(new HeartBeat() ,2000,1000*50);
	}

}

class HeartBeat extends TimerTask {
	private Socket socket = null; 
	private SendSms sendSms=new SendSms();
	protected final Log log = LogFactory.getLog(HeartBeat.class);
	

	public HeartBeat() {

	}

	public void run() {
		try {
			if (SmsTcp.getSocket().isConnected()) {
				sendSms.sendAt("AT+csq\r\n");
				}
		} catch (NullPointerException e) {
			// TODO: handle exception
			e.getMessage();
			log.error("没有建立短信网关tcp连接");
		}
	
	}
}
