package com.listener;

import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.func.WebFun;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;

public class BsStatusListener implements ServletContextListener{
	private static Timer timer=null;

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if (timer!=null) {
			timer.cancel();
		}
		
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		
		if (timer==null) {
			timer=new Timer();
		}
		timer.scheduleAtFixedRate(new BsStatus() ,2000, 24*60* 1000*60);
		
	}

}

class BsStatus extends TimerTask{
	private WebFun func=new WebFun();
	private MessageStruct header=new MessageStruct();
	private SendData send=new SendData();
    private SysMysql db_sys=new SysMysql();
	private SysSql Sql_sys=new SysSql();
	private XhMysql xhMysql=new XhMysql();
	private XhSql xhSql=new XhSql();
	private long time=1;

	public void run() {
		bs_status_all();
		
	}	
	//遥测所有基站
	public void bs_status_all(){
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			try {
				send.BSStatusREQ(header, -1);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
