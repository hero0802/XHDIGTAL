package com.listener;

import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.socket.TcpKeepAliveClient;

public class ClearCacheListen  implements ServletContextListener{
	private static Timer timer=null;

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(timer!=null){
			timer.cancel();
		}
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(timer==null){
			timer=new Timer();
		}
		timer.schedule(new CacheClear(), 3000,1000*60*30);
		
	}

}
class CacheClear extends TimerTask{
	protected final Log log = LogFactory.getLog(CacheClear.class);
	@Override
	public void run() {
		log.info("getColorMap:"+(TcpKeepAliveClient.getColorMap()==null?0:TcpKeepAliveClient.getColorMap().size()));
		log.info("getBsInfoList:"+(TcpKeepAliveClient.getBsInfoList()==null?0:TcpKeepAliveClient.getBsInfoList().size()));
		log.info("getCallList:"+(TcpKeepAliveClient.getCallList()==null?0:TcpKeepAliveClient.getCallList().size()));
		log.info("getCallMap:"+(TcpKeepAliveClient.getCallMap()==null?0:TcpKeepAliveClient.getCallMap().size()));
		log.info("getRssi_map:"+(TcpKeepAliveClient.getRssi_map()==null?0:TcpKeepAliveClient.getRssi_map().size()));
		log.info("GpsTaskListener-list:"+(GpsTaskListener.getList()==null?0:GpsTaskListener.getList().size()));
		log.info("GpsTaskListener-gpsmap:"+(GpsTaskListener.getGpsMap()==null?0:GpsTaskListener.getGpsMap().size()));
		
		/*int calling=TcpKeepAliveClient.getM_calling();
		
		if(calling!=1){
			if(TcpKeepAliveClient.getColorMap()!=null){
				TcpKeepAliveClient.getColorMap().clear();
			}
			if(TcpKeepAliveClient.getBsInfoList()!=null){
				TcpKeepAliveClient.getBsInfoList().clear();
			}
			if(TcpKeepAliveClient.getRssi_map()!=null){
				TcpKeepAliveClient.getRssi_map().clear();
			}
		}*/
		
		
		
	}
	
}
