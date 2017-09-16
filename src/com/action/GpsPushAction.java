package com.action;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.MD5;
import com.func.WebFun;
import com.func.XhLog;
import com.listener.GpsTaskListener;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;

public class GpsPushAction extends ActionSupport {
	private boolean success;
	private String message;
	private String deleteIds;
	private int start;
	private int limit;
	private String sort;
	private String dir;
	private String mscType;
	private String mscId;
	private int online;
	
	private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private SysSql Sql_sys=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	
	private SendData send = new SendData();
	private WebFun func = new WebFun();
	protected final Log log4j = LogFactory.getLog(GpsAction.class);
	private MessageStruct header=new MessageStruct();

	public void user() throws Exception {
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

		sql2 = "select count(id) from hometerminal where  type=0 "
				+ str + "";
		sql = "select id,name,onlinestatus from hometerminal where type=0 " + str
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
	
	
	//博康限制手台ID列表
	public void bkMscIdList() throws Exception{
		String sql="select a.*,b.person from xhdigital_gps_push as a left join xhdigital_radiouser as b"
				+ " on a.mscId=b.mscId where a.mscId like '"+mscId+"%' order by a.mscId asc";
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//添加手台到限制列表
	public String stopPushGpsList() throws Exception{
		String[] mscIds=deleteIds.split(",");
		for (String str : mscIds) {
			String sql="insert into xhdigital_gps_push(mscId) values('"+str+"') ";
			String sql2="select id from xhdigital_gps_push where mscId="+str;
			if (!Sql_sys.exists(sql2)) {
				Sql_sys.Update(sql);
			}
		}
		send.UpdateGPSFileterTable(header, mscIds,0);
		this.success=true;
		return SUCCESS;
	}
	public String openPushGps(){
		String sql="delete from xhdigital_gps_push where mscId in ("+deleteIds+")";
		try {
			Sql_sys.Update(sql);
			send.UpdateGPSFileterTable(header, deleteIds.split(","),1);
			this.success=true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}
	public String addMscId() throws Exception{
		String[] mscIds=deleteIds.split(",");
		/*String sql="insert into xhdigital_gps_push(mscId) values ";
		String sql2="select id from xhdigital_gps_push where mscId="+;
		String str="";
		if (mscIds.length>1) {
			for (int i = 0; i < mscIds.length-1; i++) {
				str+="('"+mscIds[i]+"'),";
			}
			str+="('"+mscIds[mscIds.length-1]+"')";
		}else {
			str+="('"+mscIds[0]+"')";
		}
		sql+=str;
		try {
			Sql_sys.Update(sql);
			this.success=true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		for (String str : mscIds) {
			String sql="insert into xhdigital_gps_limit(mscId) values('"+str+"') ";
			String sql2="select id from xhdigital_gps_limit where mscId="+str;
			if (!Sql_sys.exists(sql2)) {
				Sql_sys.Update(sql);
				/*if (GpsTaskListener.getGpsMap().get(Integer.parseInt(str))!=null) {
					GpsTaskListener.getGpsMap().remove(Integer.parseInt(str));
				}*/
			}
		}
		String sql3="update hometerminal set pushgpsen=1 where id in("+deleteIds+")";
		Sql.Update(sql3);
		String sql="delete from xhdigital_gpsset_task_timer where mscid in ("+deleteIds+")";
		Sql_sys.Update(sql);
		GpsTaskListener.getM_list1().clear();GpsTaskListener.getM_list2().clear();
		this.success=true;
		return SUCCESS;
	}
	public String delMscId(){
		String sql="delete from xhdigital_gps_limit where mscId in ("+deleteIds+")";
		String[] mscs=deleteIds.split(",");
		try {
			Sql_sys.Update(sql);
			for (String string : mscs) {
				GpsTaskListener.getGpsMap().put(Integer.parseInt(string), Integer.parseInt(string));
			}
			String sql3="update hometerminal set pushgpsen=0 where id in("+deleteIds+")";
			Sql.Update(sql3);
			GpsTaskListener.getM_list1().clear();GpsTaskListener.getM_list2().clear();
			this.success=true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}
	public String UpdateGPSFileterTable(){
		String[] msc={"0"};
		try {
			if (TcpKeepAliveClient.getSocket().isConnected()) {
				send.UpdateGPSFileterTable(header, msc,1);
			}
			
			this.success=true;
		} catch (IOException e) {
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

	public String getDeleteIds() {
		return deleteIds;
	}

	public void setDeleteIds(String deleteIds) {
		this.deleteIds = deleteIds;
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


	public String getMscType() {
		return mscType;
	}


	public void setMscType(String mscType) {
		this.mscType = mscType;
	}


	public int getOnline() {
		return online;
	}


	public void setOnline(int online) {
		this.online = online;
	}

	
	
}
