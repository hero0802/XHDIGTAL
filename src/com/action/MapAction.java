package com.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

import javassist.expr.NewArray;

import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.StringUtil;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;


public class MapAction extends ActionSupport{
	private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private SysSql Sql_sys=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	
	private boolean success;
	private String message;
	private String alias;
	private String startTime;
	private String endTime;
	
	public void MapData() throws Exception
	{
		String sql =""; 
		sql="select id,name,lat,lng,authoritystatus,workgroupid,visittsid from hometerminal where lat>0 and lng>0";
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public String  ClearPhoneMarker() throws Exception
	{
		String sql ="update hometerminal set lat=0 , lng=0 where lat>0 or lng>0";
		Sql.Update(sql);
		this.success=true;
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
	public void MapRadioUser() throws Exception
	{
		String sql =""; 
		Date() ;
		sql="select srcId,longitude,latitude,infoTime from xhdigital_gpsinfo where srcId='"+alias+"' "
				+ " and longitude>116.702 and longitude<118.062 and latitude>38.555 and latitude<40.252"
				+ " and infoTime between '"+startTime+"' and '"+endTime+"' group by longitude order by infoTime asc limit 0,500";
		
		ArrayList data = Sql_sys.DBList(sql);

		
		HashMap result=new HashMap();
		result.put("items", removeDuplicateWithOrder(data));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public ArrayList removeDuplicateWithOrder(ArrayList arlList)
	 {
	 Set set = new HashSet();
	 List newList = new ArrayList();
	 for (Iterator iter = arlList.iterator();    iter.hasNext(); ) {
	 Object element = iter.next();
	   if (set.add(element))
	      newList.add(element);
	    }
	    arlList.clear();
	    arlList.addAll(newList);
	    
	    return arlList;
	}
	
	public int mscId(String str){
		Connection conn=db.getConn();		
		Statement stmt;
		int count=0;
		try {
			stmt = conn.createStatement();
			String sql="select id from hometerminal where alias='"+str+"'";
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				count=rst.getInt("id");
			}
		
			rst.close();
			stmt.close();
			conn.close();
			
			return count;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return 0;
	}
	@SuppressWarnings("deprecation")
	public void Date() {
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
	    startTime=dd.format(new Date(startTime));
	    endTime=dd.format(new Date(endTime));
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

}
