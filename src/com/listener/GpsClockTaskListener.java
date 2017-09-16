package com.listener;

import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.ConcurrentModificationException;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.export.Data;

import com.func.WebFun;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.GpsSetStruct;

public class GpsClockTaskListener implements ServletContextListener {
	private static Timer timer = null;
	private WebFun func = new WebFun();
	private static ArrayList<GpsSetStruct> list = new ArrayList<GpsSetStruct>();
	private static ArrayList clockList = new ArrayList();
	protected final Log log4j = LogFactory.getLog(GpsClockTaskListener.class);

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		if (timer != null) {
			timer.cancel();
			log4j.debug("=========================================");
			log4j.debug("gpsTask定时任务销毁");
			log4j.debug("=========================================");

		}

	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub

		if (timer == null) {
			timer = new Timer();
			timer.scheduleAtFixedRate(new ClockTask(), 2000, 2 * 60 * 1000);
			log4j.debug("=========================================");
			log4j.debug("gpsTask定时任务启动");
			log4j.debug("=========================================");
		}

	}

	public static Timer getTimer() {
		return timer;
	}

	public static void setTimer(Timer timer) {
		GpsClockTaskListener.timer = timer;
	}

	public static ArrayList<GpsSetStruct> getList() {
		return list;
	}

	public static void setList(ArrayList<GpsSetStruct> list) {
		GpsClockTaskListener.list = list;
	}

	public static ArrayList getClockList() {
		return clockList;
	}

	public static void setClockList(ArrayList clockList) {
		GpsClockTaskListener.clockList = clockList;
	}

}

class ClockTask extends TimerTask {
	private WebFun func = new WebFun();
	private static int tag=0;
	private MessageStruct header = new MessageStruct();
	private SendData send = new SendData();
	private SysMysql db_sys = new SysMysql();
	private SysSql Sql_sys = new SysSql();
	private XhMysql xhMysql = new XhMysql();
	private XhSql xhSql = new XhSql();
	private static int status = 1;
	private long time = 1;
	protected final Log log4j = LogFactory.getLog(GpsClockTaskListener.class);

	@Override
	public void run() {

		// TODO Auto-generated method stub

		try {
			int start = Integer.parseInt(func.readXml("Listener","gpsTimerTaskStart"));
			if (start == 1) {
				try {
					Task();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
		}

	}

	public void Task() throws Exception {
		String[] str = func.nowHoureMini().split(":");
		
		long nowTime = Integer.parseInt(str[0]) * 60 + Integer.parseInt(str[1]);
		log4j.debug("nowHour:" + nowTime);
		if (GpsClockTaskListener.getClockList().size() == 0) {
			clockList();
		}
		userList();
		if (GpsClockTaskListener.getClockList().size() > 0) {
			log4j.debug(Arrays.toString(GpsClockTaskListener.getClockList()
					.toArray()));
			if (status==1) {
				for (int i = 0; i < GpsClockTaskListener.getClockList().size(); i++) {
					long time = Integer.parseInt(GpsClockTaskListener
							.getClockList().get(i).toString()) * 60;
					log4j.debug("time:" + time);
					if (nowTime - time >= 0 && nowTime - time <= 1) {
						try {
							/*for (GpsSetStruct s : GpsClockTaskListener.getList()) {
								int start = Integer.parseInt(func.readXml("Listener","gpsTimerTaskStart"));
								if (s.getOnline() == 1 && start==1) {
									send.setGps(s.getMscId(), s.getGpsen(),
											s.getType(), s.getT_interval(),
											s.getD_index(), s.getPool_ch(),
											s.getFormat(), s.getSlot(), 0);
									Thread.sleep(Integer.parseInt(func.readXml("gps","timerTime")));
								}
								status = 0;
							}*/
							
							for(int j=tag;j<GpsClockTaskListener.getClockList().size();j++){
								GpsSetStruct s=(GpsSetStruct) GpsClockTaskListener.getClockList().get(j);
								int start = Integer.parseInt(func.readXml("Listener","gpsTimerTaskStart"));
								int m_calling=TcpKeepAliveClient.getM_calling();
								if (m_calling==1) {
									continue;
								}
								
								if (s.getOnline() == 1 && start==1) {
									send.setGps(s.getMscId(), s.getGpsen(),
											s.getType(), s.getT_interval(),
											s.getD_index(), s.getPool_ch(),
											s.getFormat(), s.getSlot(), 0);
									Thread.sleep(Integer.parseInt(func.readXml("gps","timerTime")));
								}
								status = 0;
							}
							
							
							
							// GpsClockTaskListener.getList().remove(0);
						} catch (ConcurrentModificationException e) {
							// TODO: handle exception
							log4j.error(e.fillInStackTrace());
						}
						status = 1;
					}/*
					 * else { GpsClockTaskListener.getClockList().remove(0); }
					 */

				}
			}
		} 
	}

	public void userList() throws SQLException {
		String sql = "select * from xhdigital_gpsset_task_timer";
		Connection conn = db_sys.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		if (GpsClockTaskListener.getList().size() < 1) {
			while (rst.next()) {
				GpsSetStruct gps = new GpsSetStruct();
				gps.setMscId(rst.getInt("mscid"));
				gps.setGpsen(rst.getInt("gpsen"));
				gps.setType(rst.getInt("type"));
				gps.setT_interval(rst.getInt("t_interval"));
				gps.setD_index(rst.getInt("d_index"));
				gps.setPool_ch(rst.getInt("pool_ch"));
				gps.setFormat(rst.getInt("format"));
				gps.setSlot(rst.getInt("slot"));
				gps.setSlot(rst.getInt("slot"));
				gps.setOnline(rst.getInt("online"));
				GpsClockTaskListener.getList().add(gps);
			}
		}

	}

	@SuppressWarnings("unchecked")
	public void clockList() throws SQLException {
		String sql = "select * from xhdigital_gpsset_task_clock";
		Connection conn = db_sys.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		while (rst.next()) {
			int a = 0;
			a = Integer.parseInt(rst.getString("time").split(":")[0]);
			GpsClockTaskListener.getClockList().add(a);
		}
		if (GpsClockTaskListener.getClockList().size() > 0) {
			Collections.sort(GpsClockTaskListener.getClockList());
		}
	}

	public static int getTag() {
		return tag;
	}

	public static void setTag(int tag) {
		ClockTask.tag = tag;
	}
	

}
