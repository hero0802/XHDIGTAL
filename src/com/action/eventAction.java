package com.action;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.func.XhLog;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;

public class eventAction extends ActionSupport {
	private String event_scheduler;
	private SysSql e=new SysSql();
	private boolean success;
	
	private String type;
	private String dbname;
	private String rule;
	private String time;
	
	private String deleteNames;
	private XhLog log=new XhLog();
	

	/**
	 * @return the deleteNames
	 */
	public String getDeleteNames() {
		return deleteNames;
	}

	/**
	 * @param deleteNames the deleteNames to set
	 */
	public void setDeleteNames(String deleteNames) {
		this.deleteNames = deleteNames;
	}

	/**
	 * @return the event_scheduler
	 */
	public String getEvent_scheduler() {
		return event_scheduler;
	}

	/**
	 * @param eventScheduler the event_scheduler to set
	 */
	public void setEvent_scheduler(String eventScheduler) {
		event_scheduler = eventScheduler;
	}

	/**
	 * @return the success
	 */
	public boolean isSuccess() {
		return success;
	}

	/**
	 * @param success the success to set
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}
	
	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the dbname
	 */
	public String getDbname() {
		return dbname;
	}

	/**
	 * @param dbname the dbname to set
	 */
	public void setDbname(String dbname) {
		this.dbname = dbname;
	}

	/**
	 * @return the rule
	 */
	public String getRule() {
		return rule;
	}

	/**
	 * @param rule the rule to set
	 */
	public void setRule(String rule) {
		this.rule = rule;
	}

	/**
	 * @return the time
	 */
	public String getTime() {
		return time;
	}

	/**
	 * @param time the time to set
	 */
	public void setTime(String time) {
		this.time = time;
	}

	//获取事件调度器状态
	public String get_scheduler() throws Exception
	{
		String scheduler=e.getScheduler();
		this.setEvent_scheduler(scheduler);
		
		this.success=true;
		return SUCCESS;
	}
    //开启事件调度
	public String on_scheduler() throws Exception
	{
		e.OnScheduler();
		get_scheduler();
		log.writeLog(4, "开启事件调度器", "");
		this.success=true;
		return SUCCESS;
	}
	//关闭事件调度
	public String off_scheduler() throws Exception
	{
		e.OffScheduler();
		get_scheduler();
		log.writeLog(4, "关闭事件调度器", "");
		this.success=true;
		return SUCCESS;
	}
	//添加事件
	public String add_event() throws Exception
	{
		SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date=dd.format(new Date());
		String sql="";
		String db="";
		String timeChar="createtime";
		if(dbname.equals("xhgmnet_alarm_sys_info")){db="报警信息";timeChar="Alarm_Time";}
		else if(dbname.equals("xhdigital_call")){db="呼叫列表";timeChar="starttime";}
		else if(dbname.equals("xhdigital_gpsinfo")){db="GPS信息";timeChar="infoTime";}
		else if(dbname.equals("xhdigital_bs_status")){db="基站遥测记录";timeChar="time";}
		else if(dbname.equals("xhdigital_gpsoperation")){db="GPS操作记录";timeChar="writeTime";}
		else if(dbname.equals("xhdigital_recvsms")){db="短信收件箱";timeChar="writeTime";}
		else if(dbname.equals("xhdigital_sendsms")){db="短信发件箱";timeChar="writeTime";}
		else if(dbname.equals("xhdigital_log")){db="系统日志";timeChar="time";}
		else if(dbname.equals("xhdigital_offonline")){db="设备上下线";timeChar="time";}
		else {db="未知数据表";}
		if(type.equals("delete"))
		{
			String name="删除【"+db+"】"+this.time+"天以前的数据";
			//String name="delete";
			sql="CREATE EVENT "+name
			+" ON SCHEDULE "
			+"EVERY "+this.rule+" DAY  "
			+"DO "
			+"DELETE FROM `xhdigital`.`"+this.dbname+"` where TO_DAYS(now())-TO_DAYS("+timeChar+")>="+this.time;
			e.addEvent(sql);

		}
		else if(type.equals("repair"))
		{
			String name="修复【"+this.dbname+"】表单";
			sql="CREATE EVENT "+name
			+" ON SCHEDULE "
			+"EVERY "+this.rule+" DAY  "
			+" DO"
			+" REPAIR TABLE `xhdigital`.`"+this.dbname+"`";
			e.addEvent(sql);
		}
		log.writeLog(1, "添加计划任务", "");
		this.success=true;
		return SUCCESS;
		
	}
	//删除事件
	public String delete_event() throws Exception
	{
		String[] names=this.deleteNames.split("#");
		for(int i=0,l=names.length;i<l;i++)
		{
			String sql="delete from event where name='"+names[i]+"'";
			e.deleteEvent(sql);
		}
		log.writeLog(3, "删除计划任务 ID->"+this.deleteNames, "");
		this.success=true;
		return SUCCESS;
	}
	
	
}
