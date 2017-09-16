package com.listener;

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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.func.WebFun;
import com.protobuf.TrunkCommon;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.bsStatusStruct;

public class BScontrolListener implements ServletContextListener{
	private WebFun func=new WebFun();
	private static Timer timer=null;
	private XhSql Sql = new XhSql();
	private SysMysql db_sys = new SysMysql();
	private SysSql Sql_sys = new SysSql();
	protected final Log log4j = LogFactory.getLog(BScontrolListener.class);
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if (Integer.parseInt(func.readXml("Listener", "start"))==0) {
			if (timer!=null) {
				timer.cancel();
				log4j.debug("=========================================");
				log4j.debug("自动遥测基站任务销毁");
				log4j.debug("=========================================");
			}
			
		}
		
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if (Integer.parseInt(func.readXml("Listener", "start"))==1) {
			if (timer==null) {
				timer=new Timer();
				timer.scheduleAtFixedRate(new BsCon() ,8000, Integer.parseInt(func.readXml("Listener", "time")) * 1000*60);
				log4j.debug("=========================================");
				log4j.debug("自动遥测基站任务启动！");
				log4j.debug("=========================================");
			}
			
			
		}
		
	}

	public static Timer getTimer() {
		return timer;
	}

	public static void setTimer(Timer timer) {
		BScontrolListener.timer = timer;
	}
	

}
class BsCon extends TimerTask{
	private WebFun func=new WebFun();
	private MessageStruct header=new MessageStruct();
	private SendData send=new SendData();
    private SysMysql db_sys=new SysMysql();
	private SysSql Sql_sys=new SysSql();
	private XhMysql xhMysql=new XhMysql();
	private XhSql xhSql=new XhSql();
	private long time=1;

	public void run() {
		 long newTime = Integer.parseInt(func.readXml("Listener", "time"));// 这个时间是动态加载的 
		 if(time!=newTime){
			 resetPeriod(newTime);
		     time=newTime;
		 }
		 
		// TODO Auto-generated method stub
		if (Integer.parseInt(func.readXml("Listener", "start"))==1) {
			bs_status_all();
		}
		      
	}
	public void resetPeriod(final long time)  
    {  
        Field[] fields = this.getClass().getSuperclass()  
                .getDeclaredFields();  
        for (Field field : fields)  
        {  
            if (field.getName().endsWith("period"))  
            {  
                if (!field.isAccessible())  
                {  
                    field.setAccessible(true);  
                }  
                try {
					field.set(this, time * 60 * 1000);
				} catch (IllegalArgumentException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}  
            }  
        }  
    }  
	//遥测所有基站
	public void bs_status_all(){
		String sql="select bsId from xhdigital_bs_sta  order by bsId asc";
		Connection conn=db_sys.getConn();		
		try {
			Statement stmt = conn.createStatement();
		    ResultSet rst = stmt.executeQuery(sql);
		   if(TcpKeepAliveClient.getSocket().isConnected()){
			ArrayList<bsStatusStruct> list=new ArrayList<bsStatusStruct>();
			while(rst.next()){
				bsStatusStruct bStruct=new bsStatusStruct();
				bStruct.setBsId(rst.getInt("bsId"));
				list.add(bStruct);
			}
			//打开PPT
			for (bsStatusStruct bsStatusStruct : list) {				
				send.BSControl(header,bsStatusStruct.getBsId(),"cmdsetptt:1;", TrunkCommon.BSControl.TYPE.STATUS);
			}
			Thread.sleep(300);
			//遥测所有基站
			for (bsStatusStruct bsStatusStruct : list) {				
				send.BSControl(header,bsStatusStruct.getBsId(),"cmdgetstatus;",TrunkCommon.BSControl.TYPE.STATUS);
			}
			//关闭PPT
			for (bsStatusStruct bsStatusStruct : list) {				
				send.BSControl(header,bsStatusStruct.getBsId(),"cmdsetptt:0;", TrunkCommon.BSControl.TYPE.STATUS);
			}
			//SocketDwr.BsControlDwr();
		}	
		rst.close();
		stmt.close();
		conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
		
		}catch (NullPointerException e) {
		
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
