package com.listener;

import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.ConcurrentModificationException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.action.GpsAction;
import com.func.WebFun;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.GpsSetStruct;

public class GpsTaskListener implements ServletContextListener {
	private static Timer timer = null;
	private XhMysql xhMysql = new XhMysql();
	private XhSql xhSql = new XhSql();
	private SysSql Sql_sys = new SysSql();
	private WebFun func = new WebFun();
	private static ArrayList<GpsSetStruct> list = new ArrayList<GpsSetStruct>();
	private static HashMap<Integer, Integer> gpsMap = new HashMap<Integer, Integer>();

	private static int taskNum1 = 0;
	private static int taskNum2 = 0;

	private static int currentTimes = 0; // 毫秒
	private static ArrayList m_list1 = new ArrayList();
	private static ArrayList m_list2 = new ArrayList();

	protected final Log log4j = LogFactory.getLog(GpsTaskListener.class);

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		if (timer != null) {
			timer.cancel();
			log4j.debug("=========================================");
			log4j.debug("gpsTask任务销毁");
			log4j.debug("=========================================");

		}
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		String sql = "select id from hometerminal where onlinestatus=1 and pushgpsen=0 and (type=0 or type=1) ";
		Connection conn = xhMysql.getConn();
		Statement stmt;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			ArrayList<GpsSetStruct> gpsList = new ArrayList<GpsSetStruct>();
			while (rst.next()) {
				// gpsen,type,t_interval,d_index,pool_ch,format,slot,mask
				GpsSetStruct gps = new GpsSetStruct();
				gps.setMscId(rst.getInt("id"));
				gpsList.add(gps);
			}

			for (GpsSetStruct gpsSetStruct : gpsList) {
				String sql2 = "select id from xhdigital_gpsset_task_attr where mscid='"
						+ gpsSetStruct.getMscId() + "'";
				String sql3 = "select id from xhdigital_gpsset_task_timer where mscid='"
						+ gpsSetStruct.getMscId() + "'";
				if (!Sql_sys.exists(sql2) && !Sql_sys.exists(sql3)) {
					String sql4 = "insert into xhdigital_gpsset_task_attr(mscid)VALUES('"
							+ gpsSetStruct.getMscId() + "')";
					Sql_sys.Update(sql4);
				}
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (timer == null) {
			timer = new Timer();
			timer.scheduleAtFixedRate(new Task(), 6000,
					(long) Float.parseFloat(func.readXml("Listener",
							"emergTaskTime")) * 1000);
			log4j.debug("=========================================");
			log4j.debug("gpsTask任务启动");
			log4j.debug("=========================================");
		}

	}

	public static Timer getTimer() {
		return timer;
	}

	public static void setTimer(Timer timer) {
		GpsTaskListener.timer = timer;
	}

	public static ArrayList<GpsSetStruct> getList() {
		return list;
	}

	public static void setList(ArrayList<GpsSetStruct> list) {
		GpsTaskListener.list = list;
	}

	public static HashMap<Integer, Integer> getGpsMap() {
		return gpsMap;
	}

	public static void setGpsMap(HashMap<Integer, Integer> gpsMap) {
		GpsTaskListener.gpsMap = gpsMap;
	}

	public static int getTaskNum1() {
		return taskNum1;
	}

	public static void setTaskNum1(int taskNum1) {
		GpsTaskListener.taskNum1 = taskNum1;
	}

	public static int getTaskNum2() {
		return taskNum2;
	}

	public static void setTaskNum2(int taskNum2) {
		GpsTaskListener.taskNum2 = taskNum2;
	}

	public static int getCurrentTimes() {
		return currentTimes;
	}

	public static void setCurrentTimes(int currentTimes) {
		GpsTaskListener.currentTimes = currentTimes;
	}

	public static ArrayList<Integer> getM_list1() {
		return m_list1;
	}

	public static void setM_list1(ArrayList m_list1) {
		GpsTaskListener.m_list1 = m_list1;
	}

	public static ArrayList<Integer> getM_list2() {
		return m_list2;
	}

	public static void setM_list2(ArrayList m_list2) {
		GpsTaskListener.m_list2 = m_list2;
	}

}

class Task extends TimerTask {
	private WebFun func = new WebFun();
	private static int tag = 0;
	private MessageStruct header = new MessageStruct();
	private SendData send = new SendData();
	private SysMysql db_sys = new SysMysql();
	private SysSql Sql_sys = new SysSql();
	private XhMysql xhMysql = new XhMysql();
	private XhSql xhSql = new XhSql();
	private long time = 1;
	private static int status = 1;
	protected final Log log4j = LogFactory.getLog(Task.class);

	public void run() {
		try {

			int start = Integer.parseInt(func.readXml("gps", "gpsTaskOpen"));
			int start1 = Integer.parseInt(func.readXml("Listener", "gpsTimerTaskStart"));
			
			int start2 = Integer.parseInt(func.readXml("Listener", "gpsDateTaskStart"));
			long nowTime = new Date().getTime();
			long time = func.nowDateTime(func.readXml("Listener","gpsTaskDate2"));
			if((start1==1 || start2==1) && nowTime < time){
				runTask();
			}else{
				func.updateXML("Listener", "gpsDateTaskStart",String.valueOf(0));
				func.updateXML("Listener", "gpsTimerTaskStart",String.valueOf(0));
			}
			
			
			/*
			

			if (start == 1 && nowTime < time) {
				runTask();
			} else {
				func.updateXML("Listener", "gpsDateTaskStart",
						String.valueOf(0));
			}*/
		} catch (Exception e) {
			// TODO: handle exception
		}

	}

	public void resetPeriod(final long time) {
		Field[] fields = this.getClass().getSuperclass().getDeclaredFields();
		for (Field field : fields) {
			if (field.getName().endsWith("period")) {
				if (!field.isAccessible()) {
					field.setAccessible(true);
				}
				try {
					field.set(this, time * 1000);
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

	// 上拉所有基站gps
	public void runTask() throws Exception {

		String sql = "select * from xhdigital_gpsset_task_attr where online=1"
				+ " and mscid not in"
				+ "(select mscId from xhdigital_gps_limit) and mscid not in"
				+ "(select mscid from xhdigital_gpsset_task_timer) order by mscid asc";

		String sql2 = "select * from xhdigital_gpsset_task_timer where online=1"
				+ " and mscid not in"
				+ "(select mscId from xhdigital_gps_limit) order by mscid asc";

		long runTime = new Date().getTime();
		// 开始时间
		// log4j.info("开始时间"+runTime);

		// 一般任务列表
		Connection conn = db_sys.getConn();
		Statement stmt = conn.createStatement();
		if (GpsTaskListener.getM_list1().size() < 1) {
			ResultSet rst = stmt.executeQuery(sql);
			while (rst.next()) {
				GpsTaskListener.getM_list1().add(rst.getInt("mscid"));
			}
		}
		// log4j.info("普通任务列表"+Arrays.toString(GpsTaskListener.getM_list1().toArray()));
		// 紧急任务列表
		if (GpsTaskListener.getM_list2().size() < 1) {
			ResultSet rst2 = stmt.executeQuery(sql2);
			while (rst2.next()) {
				GpsTaskListener.getM_list2().add(rst2.getInt("mscid"));
			}
		}
		// log4j.info("紧急任务列表"+Arrays.toString(GpsTaskListener.getM_list2().toArray()));
		Float gpsTaskTime = Float.parseFloat(func.readXml("Listener",
				"gpsTaskTime"));
		Float time = gpsTaskTime * 1000;
		// 执行发送GPS数据
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			if (GpsTaskListener.getTaskNum2() >= GpsTaskListener.getM_list2()
					.size()) {
				GpsTaskListener.setTaskNum2(0);
			}
			// 紧急任务
			// if (GpsTaskListener.getCurrentTimes()<=time) {
			for (int i = GpsTaskListener.getTaskNum2(); i < GpsTaskListener
					.getM_list2().size(); i++) {
				log4j.info("紧急任务"
						+ GpsTaskListener.getM_list2().get(i).toString());
				while (TcpKeepAliveClient.getM_calling() == 1 || TcpKeepAliveClient.getM_countin()==1) {
					Thread.sleep(1000);
				}
				if (((new Date().getTime() - runTime) / 1000) >= Integer
						.parseInt(func.readXml("Listener", "emergTaskTime"))) {
					break;
				}
				int start = Integer.parseInt(func.readXml("Listener",
						"gpsTimerTaskStart"));

				if (start == 1) {
					send.setGps(
							Integer.parseInt(GpsTaskListener.getM_list2()
									.get(i).toString()), 1, 0, 0, 0, 0, 0, 0, 0);
					GpsTaskListener.setTaskNum2(GpsTaskListener.getTaskNum2() + 1);
				}
				
				Thread.sleep(Integer.parseInt(func.readXml("gps", "eachTime")));
				
			}
			
			// 一般任务
			GpsTaskListener.setCurrentTimes(GpsTaskListener.getCurrentTimes()
					+ Integer.parseInt(func
							.readXml("Listener", "emergTaskTime")) * 1000);
			if (GpsTaskListener.getTaskNum1() < GpsTaskListener.getM_list1()
					.size()) {
				// GpsTaskListener.setTaskNum1(0);
				for (int i = GpsTaskListener.getTaskNum1(); i < GpsTaskListener
						.getM_list1().size(); i++) {
					log4j.info("普通任务"
							+ GpsTaskListener.getM_list1().get(i).toString());
					while (TcpKeepAliveClient.getM_calling() == 1 || TcpKeepAliveClient.getM_countin()==1) {
						Thread.sleep(1000);
					}
					if (((new Date().getTime() - runTime) / 1000) >= Integer.parseInt(func.readXml("Listener", "emergTaskTime"))) {
						break;
					}
					int start = Integer.parseInt(func.readXml("Listener","gpsDateTaskStart"));

					if (start == 1) {
						send.setGps(
								Integer.parseInt(GpsTaskListener.getM_list1()
										.get(i).toString()), 1, 0, 0, 0, 0, 0,
								0, 0);
						GpsTaskListener
						.setTaskNum1(GpsTaskListener.getTaskNum1() + 1);
						Thread.sleep(Integer.parseInt(func.readXml("gps","eachTime")));
					}
					
					
				}
			} else {

				if (GpsTaskListener.getCurrentTimes() >= time) {
					GpsTaskListener.setTaskNum1(0);
					GpsTaskListener.setCurrentTimes(0);
					if (GpsTaskListener.getTaskNum1() < GpsTaskListener
							.getM_list1().size()) {
						// GpsTaskListener.setTaskNum1(0);
						for (int i = GpsTaskListener.getTaskNum1(); i < GpsTaskListener
								.getM_list1().size(); i++) {
							log4j.info("普通任务"
									+ GpsTaskListener.getM_list1().get(i)
											.toString());
							while (TcpKeepAliveClient.getM_calling() == 1) {
								Thread.sleep(1000);
							}
							if (((new Date().getTime() - runTime) / 1000) >= Integer
									.parseInt(func.readXml("Listener",
											"emergTaskTime"))) {
								break;
							}
							int start = Integer.parseInt(func.readXml("Listener", "gpsDateTaskStart"));

							if (start == 1) {
								send.setGps(Integer.parseInt(GpsTaskListener
										.getM_list1().get(i).toString()), 1, 0,
										0, 0, 0, 0, 0, 0);
								Thread.sleep(Integer.parseInt(func.readXml("gps",
										"eachTime")));
								// GpsTaskListener.setCurrentTimes(GpsTaskListener.getCurrentTimes()+Integer.parseInt(func.readXml("gps","eachTime")));
								GpsTaskListener.setTaskNum1(GpsTaskListener
										.getTaskNum1() + 1);
							}
							
						}
					}
				}
			}

		}

		
	}

	public static int getTag() {
		return tag;
	}

	public static void setTag(int tag) {
		Task.tag = tag;
	}

}
