package com.action;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.validator.Var;
import org.apache.struts2.ServletActionContext;

import com.bean.UserOnlineBean;
import com.func.FlexJSON;
import com.func.GsonUtil;
import com.func.WebFun;
import com.func.XhLog;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.listener.BScontrolListener;
import com.listener.GpsClockTaskListener;
import com.listener.GpsTaskListener;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysSql;
import com.sql.XhSql;
import com.struct.GpsSetStruct;

public class GpsAction extends ActionSupport {
	private boolean success;
	private String message;
	private String deleteIds;
	
	private String userJson;

	private int start;
	private int limit;
	private String sort;
	private String dir;
	/* private int ig; */
	private int id;
	private String number;
	private int gpsen;
	private int type;
	private int t_interval;
	private int d_index;
	private int pool_ch;
	private int format;
	private int slot;
	private int mask;
	private int online;
	
	private int pushgpsen;

	private String mscType;
	private String mscId;
	private String taskId;
	private String name;
	private int timeout;
	
	private float gpsTaskTime;
	private int gpsTimerTaskStart;
	private int gpsDateTaskStart;
	private String gpsTaskDate2;
	private String clock;
	private int eachTime;
	private int timerTime;
	private int emergTaskTime;
	private int gpsTaskOpen;

	private SendData send = new SendData();
	private XhSql Sql = new XhSql();
	private SysSql Sql_sys = new SysSql();
	private WebFun func = new WebFun();
	private FlexJSON json = new FlexJSON();
	protected final Log log4j = LogFactory.getLog(GpsAction.class);
	private XhLog log = new XhLog();

	public void user() throws Exception {
		String str = "", sql = "", sql2 = "";
		if (!mscId.equals("")) {
			str += " and (id like '" + func.StringToInt(mscId) + "%' or name like '"+mscId+"%')";
		}
		if (func.StringToInt(mscType) > 0) {
			if (func.StringToInt(mscType)==16) {
				str += " and isLeader=1";
			}else {
				str += " and id like '" + func.StringToInt(mscType) + "%'";
			}
		}
		if(online!=2){ 
			if (online==1) {
				str+=" and onlinestatus="+online;
			}else {
				str+=" and (onlinestatus=0 or onlinestatus is NULL)";
			}
		}

		sql2 = "select count(id) from hometerminal where (type=1  or  type=0 ) "
				+ str + "";
		sql = "select id,name,onlinestatus,pushgpsen,lat,lng from hometerminal where (type=1  or  type=0 )" + str
				+ "  order by id asc limit " + start + "," + limit;
		ArrayList data = Sql.DBList(sql);
		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void userGps() throws Exception {
		String str = "", sql = "", sql2 = "";
		if (!mscId.equals("")) {
			str += " and id like '" + func.StringToInt(mscId) + "%'";
		}
		if (func.StringToInt(mscType) > 0) {
			if (func.StringToInt(mscType)==16) {
				str += " and isLeader=1";
			}else {
				str += " and id like '" + func.StringToInt(mscType) + "%'";
			}
		}
		if(online!=2){ 
			if (online==1) {
				str+=" and onlinestatus="+online;
			}else {
				str+=" and (onlinestatus=0 or onlinestatus is NULL)";
			}
		}
		if(pushgpsen!=2){ 
			str+=" and pushgpsen="+pushgpsen;
		}

		sql2 = "select count(id) from hometerminal where (type=1  or  type=0 ) "
				+ str + "";
		sql = "select id,name,onlinestatus,pushgpsen,lat,lng from hometerminal where (type=1  or  type=0 )" + str
				+ "  order by id asc limit " + start + "," + limit;
		ArrayList data = Sql.DBList(sql);
		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}

	// gps自动任务列表
	public void taskList() throws Exception {

		String sql = "select * from xhdigital_gpsset_task";
		ArrayList data = Sql_sys.DBList(sql);
		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//gps定时自动任务手台列表
	public void gpsTimerktaskUserList() throws Exception {

		String sql = "select * from xhdigital_gpsset_task_timer";
		ArrayList data = Sql_sys.DBList(sql);
		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//gps定时自动任务时钟列表
	public void gpsTimerktaskClockList() throws Exception {

		String sql = "select * from xhdigital_gpsset_task_clock order by time asc";
		ArrayList data = Sql_sys.DBList(sql);
		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public String loadGpsXML(){
		gpsTaskTime=Float.parseFloat(func.readXml("Listener", "gpsTaskTime"));
		gpsTimerTaskStart=Integer.parseInt(func.readXml("Listener", "gpsTimerTaskStart"));
		gpsDateTaskStart=Integer.parseInt(func.readXml("Listener", "gpsDateTaskStart"));
		gpsTaskDate2=func.readXml("Listener", "gpsTaskDate2");
		eachTime=Integer.parseInt(func.readXml("gps", "eachTime"));
		gpsTaskOpen=Integer.parseInt(func.readXml("gps", "gpsTaskOpen"));
		emergTaskTime=Integer.parseInt(func.readXml("Listener", "emergTaskTime"));
		this.success=true;
		return SUCCESS;
	}
	
	public String updateGpsXML(){
		try {
			func.updateXML("Listener", "gpsTaskTime",String.valueOf(gpsTaskTime));
			func.updateXML("gps", "eachTime",String.valueOf(eachTime));
			func.updateXML("gps", "timerTime",String.valueOf(timerTime));
			if (GpsTaskListener.getTimer()!=null) {
				
				GpsTaskListener.getTimer().cancel();
				GpsTaskListener listener=new GpsTaskListener();
				//listener.contextDestroyed(null);
				GpsTaskListener.setTimer(null);
				listener.contextInitialized(null);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.success=true;
		return SUCCESS;
	}
	//开始执行任务
	public String taskOpen() throws Exception{
		func.updateXML("gps", "gpsTaskOpen",String.valueOf(1));
		GpsTaskListener listener=new GpsTaskListener();
		if (GpsTaskListener.getTimer()!=null) {
			
			GpsTaskListener.getTimer().cancel();
			
			//listener.contextDestroyed(null);
			GpsTaskListener.setTimer(null);
			listener.contextInitialized(null);
		}else {
			listener.contextInitialized(null);
		}		
		this.success=true;
		return SUCCESS;
	}
	//停止执行任务
	public String taskClose() throws Exception{
		func.updateXML("gps", "gpsTaskOpen",String.valueOf(0));		
		if (GpsTaskListener.getTimer()!=null) {			
			GpsTaskListener.getTimer().cancel();
			GpsTaskListener.setTimer(null);
		}
		this.success=true;
		return SUCCESS;
	}
	//开始执行时间段gps任务
	public String startDateTask() throws Exception{
		func.updateXML("Listener", "gpsTaskTime",String.valueOf(gpsTaskTime));
		func.updateXML("Listener", "gpsTaskDate2",String.valueOf(gpsTaskDate2).replace("T", " "));
		func.updateXML("Listener", "gpsDateTaskStart",String.valueOf(1));
		func.updateXML("gps", "eachTime",String.valueOf(eachTime));
		func.updateXML("Listener", "emergTaskTime",String.valueOf(emergTaskTime));
		GpsTaskListener listener=new GpsTaskListener();
		if (GpsTaskListener.getTimer()!=null) {
			
			GpsTaskListener.getTimer().cancel();
			
			//listener.contextDestroyed(null);
			GpsTaskListener.setTimer(null);
			listener.contextInitialized(null);
		}else {
			listener.contextInitialized(null);
		}	
		this.success=true;
		return SUCCESS;
	}
	//停止时间段gps任务
	public String stopDateTask() throws Exception{
		func.updateXML("Listener", "gpsDateTaskStart",String.valueOf(0));		
		/*if (GpsTaskListener.getTimer()!=null) {			
			GpsTaskListener.getTimer().cancel();
			GpsTaskListener.setTimer(null);
		}*/
		
		this.success=true;
		return SUCCESS;
	}
	
	//开始执行定时gps任务
	public String startTimerTask() throws Exception{
		func.updateXML("Listener", "gpsTimerTaskStart",String.valueOf(1));
		func.updateXML("Listener", "emergTaskTime",String.valueOf(emergTaskTime));
		GpsTaskListener listener=new GpsTaskListener();
		if (GpsTaskListener.getTimer()!=null) {
			
			GpsTaskListener.getTimer().cancel();
			
			//listener.contextDestroyed(null);
			GpsTaskListener.setTimer(null);
			listener.contextInitialized(null);
		}else {
			listener.contextInitialized(null);
		}		
		this.success=true;
		return SUCCESS;
	}
	//停止执行定时gps任务
	public String stopTimerTask() throws Exception{
		func.updateXML("Listener", "gpsTimerTaskStart",String.valueOf(0));
		/*if (GpsClockTaskListener.getTimer()!=null) {			
			GpsClockTaskListener.getTimer().cancel();
			GpsClockTaskListener.setTimer(null);
		}*/
		this.success=true;
		return SUCCESS;
	}

	// gps自动任务详细列表
	public void taskUserList() throws Exception {

		// String
		// sql="select * from xhdigital_gpsset_task_attr where taskId="+taskId;
		String sql = "select * from xhdigital_gpsset_task_attr where mscid not in"
				+ "(select mscId from xhdigital_gps_limit) order by mscid asc";
		ArrayList data = Sql_sys.DBList(sql);
		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//添加定时时钟
	public String addGpsClock() throws Exception{
		String sql="select * from xhdigital_gpsset_task_clock where time='"+clock+"'";
		String sql2="insert into xhdigital_gpsset_task_clock(time)values('"+clock+"')";
		if (!Sql_sys.exists(sql)) {
			Sql_sys.Update(sql2);
			this.success=true;
			GpsClockTaskListener.getClockList().add(Integer.parseInt(clock.split(":")[0]));
		}
		return SUCCESS;
	}
	//删除定时时钟
	public String delGpsClock() throws Exception{
		String sql="delete from xhdigital_gpsset_task_clock where time='"+clock+"'";
		for (int i = 0; i < GpsClockTaskListener.getClockList().size(); i++) {
			int time=Integer.parseInt(GpsClockTaskListener.getClockList().get(i).toString());
			int cl=Integer.parseInt(clock.split(":")[0]);
			if (time==cl) {
				GpsClockTaskListener.getClockList().remove(i);
			}
		}
		Sql_sys.Update(sql);
		this.success=true;
		return SUCCESS;
	}

	// 添加时间段自动任务
	public String addTask() throws Exception {
		String[] mscids = mscId.split(",");
		for (int i = 0; i < mscids.length; i++) {
			//GpsTaskListener.getGpsMap().put(Integer.parseInt(mscids[i]), Integer.parseInt(mscids[i]));
			
			
			String sql = "select * from xhdigital_gpsset_task_attr where mscid='"
					+ mscids[i] + "'";
			if (!Sql_sys.exists(sql)) {
				String sql3 = "insert into xhdigital_gpsset_task_attr(taskId,mscid,gpsen,type,"
						+ "t_interval,d_index,pool_ch,format,slot)VALUES('"
						+ taskId
						+ "','"
						+ mscids[i]
						+ "','"
						+ gpsen
						+ "','"
						+ type
						+ "','"
						+ t_interval
						+ "',"
						+ "'"
						+ d_index
						+ "','"
						+ pool_ch
						+ "','"
						+ format
						+ "','"
						+ slot
						+ "')";
				Sql_sys.Update(sql3);
				log.writeLog(1, "添加gps自动上拉任务：" + mscids[i], "");
				GpsTaskListener.getM_list1().add(func.StringToInt(mscids[i]));
			}

		}
		//GpsTaskListener.getList().clear();

		this.success = true;

		return SUCCESS;

	}
	// 添加定时自动任务
		public String addGpsTimerTask() throws Exception {
			String[] mscids = mscId.split(",");
			String sql2="delete from xhdigital_gpsset_task_attr where mscid in("+mscId+")";
			for (int i = 0; i < mscids.length; i++) {
				String sql = "select * from xhdigital_gpsset_task_timer where mscid='"
						+ mscids[i] + "'";
				String sqll = "select * from xhdigital_gps_push where mscId='"
						+ mscids[i] + "'";
				
				if (!Sql_sys.exists(sql) && !Sql_sys.exists(sqll)) {
					String sql3 = "insert into xhdigital_gpsset_task_timer(taskId,mscid,gpsen,type,"
							+ "t_interval,d_index,pool_ch,format,slot)VALUES('"
							+ taskId
							+ "','"
							+ mscids[i]
							+ "','"
							+ gpsen
							+ "','"
							+ type
							+ "','"
							+ t_interval
							+ "',"
							+ "'"
							+ d_index
							+ "','"
							+ pool_ch
							+ "','"
							+ format
							+ "','"
							+ slot
							+ "')";
					Sql_sys.Update(sql3);
					log.writeLog(1, "添加gps定时自动上拉任务：" + mscids[i], "");
					GpsTaskListener.getM_list2().add(func.StringToInt(mscids[i]));
					Sql_sys.Update(sql2);
					
				}

			}
			GpsTaskListener.getM_list1().clear();

			this.success = true;

			return SUCCESS;

		}
	//手动上拉gps
	public String gpsTask() throws Exception {
		gpsTimerTaskStart=Integer.parseInt(func.readXml("Listener", "gpsTimerTaskStart"));
		gpsDateTaskStart=Integer.parseInt(func.readXml("Listener", "gpsDateTaskStart"));
		
		if (gpsTimerTaskStart==1 || gpsDateTaskStart==1) {
			this.success=false;
			this.message="请先停止自动上拉任务";
		}else {
			String[] mscids = mscId.split(",");
			ArrayList<GpsSetStruct>list=new ArrayList<GpsSetStruct>();
			for (int i = 0; i < mscids.length; i++) {
				send.setGps(Integer.parseInt(mscids[i]),gpsen,type,t_interval,d_index,pool_ch,format,slot,0);
				Thread.sleep(Integer.parseInt(func.readXml("gps","eachTime")));
			    log.writeLog(4, "手动上拉Gps任务：" + mscids[i], "");
				}
			this.success = true;
		}
		return SUCCESS;

	}
	//手动上拉GPS
	public String handleTask() throws Exception {		
		/*String[] mscids = mscId.split(",");*/
		if(TcpKeepAliveClient.getSocket().isConnected()){
			if(TcpKeepAliveClient.getM_calling()==0){
				send.setGps(Integer.parseInt(mscId), 1, 0, 0, 0, 0, 0, 0, 0);
				
				this.success = true;
			}else{
				this.success = false;
			}
		}
		
		
		return SUCCESS;

	}

	/*
	 * public String addTask() throws Exception{ String[]
	 * mscids=mscId.split(","); String sqlstr=""; String
	 * sql="select * from xhdigital_gpsset_task where taskId='"
	 * +taskId+"' or name='"+name+"'"; String
	 * sql2="insert into xhdigital_gpsset_task(taskId,name,timeout)" +
	 * "VALUES('"+taskId+"','"+name+"','"+timeout+"')"; String
	 * sql3="insert into xhdigital_gpsset_task_attr(taskId,mscid,gpsen,type," +
	 * "t_interval,d_index,pool_ch,format,slot)VALUES"; if
	 * (!Sql_sys.exists(sql)) { Sql_sys.Update(sql2); for(int
	 * i=0;i<mscids.length;i++){ if (i<mscids.length-1) {
	 * sqlstr+="('"+taskId+"','"
	 * +mscids[i]+"','"+gpsen+"','"+type+"','"+t_interval+"'," +
	 * "'"+d_index+"','"+pool_ch+"','"+format+"','"+slot+"'),"; }else {
	 * sqlstr+="('"
	 * +taskId+"','"+mscids[i]+"','"+gpsen+"','"+type+"','"+t_interval+"'," +
	 * "'"+d_index+"','"+pool_ch+"','"+format+"','"+slot+"')"; } } sql3+=sqlstr;
	 * log4j.debug("user:"+sql3); Sql_sys.Update(sql3); this.success=true; }else
	 * { this.success=false; this.message="任务ID，或者名称已经存在"; }
	 * 
	 * return SUCCESS;
	 * 
	 * 
	 * }
	 */
	// 删除自动任务
	public String delTask() throws Exception {
		
		//String sql = "delete from xhdigital_gpsset_task where taskId=" + taskId;
		String sql = "delete from xhdigital_gpsset_task_attr where mscid in("+deleteIds+")";
		Sql_sys.Update(sql);
		//GpsTaskListener.getList().clear();
		
		
		String[] mscid=deleteIds.split(",");
		for (String str : mscid) {
			log.writeLog(3, "删除gps自动上拉任务：" + str, "");
			
			/*if (GpsTaskListener.getGpsMap().get(Integer.parseInt(str))!=null) {
				GpsTaskListener.getGpsMap().remove(Integer.parseInt(str));
			}*/
			for (int i = 0; i <GpsTaskListener.getM_list1().size(); i++) {
				if (GpsTaskListener.getM_list1().get(i).toString().equals(str)) {
					GpsTaskListener.getM_list1().remove(i);
				}
			}
			
			/*for (GpsSetStruct s : GpsTaskListener.getList()) {
				if (s.getMscId()==Integer.parseInt(str)) {
				   GpsTaskListener.getList().remove(s);
				}
			}*/
		}
		this.success = true;
		return SUCCESS;

	}
	// 删除定时自动任务
		public String delTimerTask() throws Exception {
			
			//String sql = "delete from xhdigital_gpsset_task where taskId=" + taskId;
			String sql = "delete from xhdigital_gpsset_task_timer where mscid in("+deleteIds+")";
			Sql_sys.Update(sql);
			//GpsTaskListener.getList().clear();
			
			
			String[] mscid=deleteIds.split(",");
			for (String str : mscid) {
				log.writeLog(3, "删除gps定时自动上拉任务：" + str, "");
				/*for (GpsSetStruct s : GpsTaskListener.getList()) {
					if (s.getMscId()==Integer.parseInt(str)) {
					   GpsTaskListener.getList().remove(s);
					}
				}*/
				for (int i = 0; i <GpsTaskListener.getM_list2().size(); i++) {
					if (GpsTaskListener.getM_list2().get(i).toString().equals(str)) {
						GpsTaskListener.getM_list2().remove(i);
					}
				}
			}
			//GpsClockTaskListener.getList().clear();
			this.success = true;
			return SUCCESS;

		}

	// 设置GPS
	public String setGps() {
		id = Integer.parseInt(number);
		try {
			if (TcpKeepAliveClient.getSocket().isConnected()) {
				send.setGps(id, gpsen, type, t_interval, d_index, pool_ch,
						format, slot, mask);
				this.success = true;
			} else {
				this.success = false;
				this.message = "网络未连接";
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return SUCCESS;
	}
	public String addOnlineUser(){
		Type type = new TypeToken<List<UserOnlineBean>>(){}.getType();
		List<UserOnlineBean> user=new Gson().fromJson(userJson,type);
		StringBuilder sql=new StringBuilder();
		sql.append("replace into now_user_online (userId,name,time) values");
		for (UserOnlineBean userOnlineBean : user) {
			sql.append("("+userOnlineBean.getUserId()+",'"+userOnlineBean.getName()+"','"+func.nowDate()+"')");
			sql.append(",");
		}
		sql.deleteCharAt(sql.length()-1);
		try {
			Sql_sys.Update(sql.toString());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return SUCCESS;
	}
	public String truncateOnlineUser(){
		String sql1="truncate table now_user_online";
		try {
			Sql_sys.Update(sql1);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return SUCCESS;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public int getGpsen() {
		return gpsen;
	}

	public void setGpsen(int gpsen) {
		this.gpsen = gpsen;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getT_interval() {
		return t_interval;
	}

	public void setT_interval(int t_interval) {
		this.t_interval = t_interval;
	}

	public int getD_index() {
		return d_index;
	}

	public void setD_index(int d_index) {
		this.d_index = d_index;
	}

	public int getPool_ch() {
		return pool_ch;
	}

	public void setPool_ch(int pool_ch) {
		this.pool_ch = pool_ch;
	}

	public int getFormat() {
		return format;
	}

	public void setFormat(int format) {
		this.format = format;
	}

	public int getSlot() {
		return slot;
	}

	public void setSlot(int slot) {
		this.slot = slot;
	}

	public int getMask() {
		return mask;
	}

	public void setMask(int mask) {
		this.mask = mask;
	}

	public String getMscType() {
		return mscType;
	}

	public void setMscType(String mscType) {
		this.mscType = mscType;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}

	public String getMscId() {
		return mscId;
	}

	public void setMscId(String mscId) {
		this.mscId = mscId;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getTimeout() {
		return timeout;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	public String getDeleteIds() {
		return deleteIds;
	}

	public void setDeleteIds(String deleteIds) {
		this.deleteIds = deleteIds;
	}

	public float getGpsTaskTime() {
		return gpsTaskTime;
	}

	public void setGpsTaskTime(float gpsTaskTime) {
		this.gpsTaskTime = gpsTaskTime;
	}

	public int getGpsTimerTaskStart() {
		return gpsTimerTaskStart;
	}

	public void setGpsTimerTaskStart(int gpsTimerTaskStart) {
		this.gpsTimerTaskStart = gpsTimerTaskStart;
	}

	public int getGpsDateTaskStart() {
		return gpsDateTaskStart;
	}

	public void setGpsDateTaskStart(int gpsDateTaskStart) {
		this.gpsDateTaskStart = gpsDateTaskStart;
	}

	public String getClock() {
		return clock;
	}

	public void setClock(String clock) {
		this.clock = clock;
	}

	public String getGpsTaskDate2() {
		return gpsTaskDate2;
	}

	public void setGpsTaskDate2(String gpsTaskDate2) {
		this.gpsTaskDate2 = gpsTaskDate2;
	}

	public int getOnline() {
		return online;
	}

	public void setOnline(int online) {
		this.online = online;
	}

	public int getEachTime() {
		return eachTime;
	}

	public void setEachTime(int eachTime) {
		this.eachTime = eachTime;
	}

	public int getTimerTime() {
		return timerTime;
	}

	public void setTimerTime(int timerTime) {
		this.timerTime = timerTime;
	}

	public int getEmergTaskTime() {
		return emergTaskTime;
	}

	public void setEmergTaskTime(int emergTaskTime) {
		this.emergTaskTime = emergTaskTime;
	}

	public int getGpsTaskOpen() {
		return gpsTaskOpen;
	}

	public void setGpsTaskOpen(int gpsTaskOpen) {
		this.gpsTaskOpen = gpsTaskOpen;
	}

	public int getPushgpsen() {
		return pushgpsen;
	}

	public void setPushgpsen(int pushgpsen) {
		this.pushgpsen = pushgpsen;
	}

	public String getUserJson() {
		return userJson;
	}

	public void setUserJson(String userJson) {
		this.userJson = userJson;
	}

	
	

}
