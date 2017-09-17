package com.sql;

import java.sql.Clob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.record.PageBreakRecord.Break;

import com.func.WebFun;
import com.smsnet.Sms;
import com.sql.*;
import com.struct.MarkStruct;

public class SysSql {
	private SysMysql db=new SysMysql();
	private Mysql   mysqlDb=new Mysql();
	private WebFun func = new WebFun();
	private XhSql xhsql=new XhSql();
	//protected final Log log = LogFactory.getLog(WebFun.class);
	protected final Log log4j=LogFactory.getLog(SysSql.class);
	
	//数据库处理
	public void Update(String sql) throws Exception{
		try {
			Connection conn=db.getConn();
			Statement stmt =conn.createStatement();
			stmt.executeUpdate(sql);
			conn.close();
			stmt.close();	
		} catch (NullPointerException e) {
			// TODO: handle exception
			log4j.error(e.fillInStackTrace());
			//return;
		}
			
	}
	public void Select(String sql) throws Exception{
		Connection conn=db.getConn();
		Statement stmt =conn.createStatement();
		stmt.executeQuery(sql);
		conn.close();
		stmt.close();		
	}
	public void mysqlSelect(String sql) throws Exception{
		Connection conn=mysqlDb.getConn();
		Statement stmt =conn.createStatement();
		stmt.executeQuery(sql);
		conn.close();
		stmt.close();		
	}
	//获取数据数目
	public int getCount(String sql) throws Exception{
		Connection conn=db.getConn();		
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);	
		rst.next();
		int count=rst.getInt(1);
		rst.close();
		stmt.close();
		conn.close();
		return count;
	}
	//获取数据列表
	public ArrayList DBList(String sql) throws Exception{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();

		ResultSet rst = stmt.executeQuery(sql);		
		ArrayList list = ResultSetToList(rst);

		rst.close();
		stmt.close();
		conn.close();

		return list;
	}
	//查找联系人
		public String radioPerson(int userId){
			String sql="select person from xhdigital_radiouser where mscId="+userId;
			Connection conn=db.getConn();
			Statement stmt;
			String user="";
			try {
				stmt = conn.createStatement();
				ResultSet rst = stmt.executeQuery(sql);	
				while(rst.next()){
					user=rst.getString("person");
				}
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return user;
		}
	public ArrayList mysqlDBList(String sql) throws Exception{
		Connection conn = mysqlDb.getConn();		
		Statement stmt = conn.createStatement();

		ResultSet rst = stmt.executeQuery(sql);		
		ArrayList list = ResultSetToList(rst);

		rst.close();
		stmt.close();
		conn.close();

		return list;
	}
	public void smsAlarm(int type,int id,int status){
		String sql="select deviceId from xhdigital_smsalarm where type='"+type+"' and deviceId="+id;
		String sql2="insert into xhdigital_smsalarm(type,deviceId,status,time)VALUES('"+type+"','"+id+"',"
				+ "'"+status+"','"+func.nowDate()+"')";
		String sql3="update xhdigital_smsalarm set type='"+type+"',deviceId='"+id+"',status='"+status+"',"
				+ "time='"+func.nowDate()+"' where type='"+type+"' and deviceId="+id;
		try {
			if (exists(sql)) {
				Update(sql3);
			}else {
				Update(sql2);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	//遥测基站
	public void gpsLostAlarm(int id){
		String sql="select bsId from xhdigital_bs_control_gps where   bsId="+id;
		String sql2="insert into xhdigital_bs_control_gps(bsId,gps,time)VALUES('"+id+"',"+ "0,'"+func.nowDate()+"')";
		String sql3="update xhdigital_bs_control_gps set gps=0,number=number+1,time='"+func.nowDate()+"' where bsId="+id;
		try {
			if (exists(sql)) {
				Update(sql3);
			}else {
				Update(sql2);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	/*public void updateGpsLostAlarm(int id){
		String sql="select bsId from xhdigital_bs_control_gps where    bsId="+id;
		String sql3="update xhdigital_bs_control_gps set number=0,gps=1,time='"+func.nowDate()+"' where bsId="+id;
		try {
			if (exists(sql)) {
				Update(sql3);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}*/
	public void updategpsLost(int id){
		//String sql3="delete from xhdigital_bs_control_gps  where bsId="+id;
		String sql="update xhdigital_bs_control_gps set gps=1,number=0,status=0,time='"+func.nowDate()+"' where bsId="+id;
		try {
			Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	public ArrayList<Map> bsgpslost(){
		String sql="select a.bsId,b.bsName from xhdigital_bs_control_gps as a left join "
				+ "xhdigital_bs_sta as b on a.bsId=b.bsId where a.gps=0 and a.number>=3 and a.status=0 and "
				+ " a.bsId not in (select bsId from xhdigital_smsbsnotalarm)";
		ArrayList<Map> list=new ArrayList<Map>();
		
		Connection conn=db.getConn();		
		Statement stmt;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while (rst.next()) {
				HashMap map=new HashMap();
				map.put("bsId", rst.getInt("bsId"));
				map.put("bsName", rst.getString("bsName"));
				list.add(map);
				
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}

	public ArrayList<Map> bsAlarmList(){
		String sql="select * from xhdigital_alarm where type=1 and flag=0 and alarmId"
				+ " not in (select bsId from xhdigital_smsbsnotalarm)  "
				+ "and time<'"+func.DateMinus(func.StringToInt(func.readXml("sms", "bsofftime")))+"'";
		ArrayList<Map> list=new ArrayList<Map>();
		
		Connection conn=db.getConn();		
		Statement stmt;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while (rst.next()) {
				HashMap map=new HashMap();
				map.put("bsId", rst.getInt("alarmId"));
				map.put("content", rst.getString("content"));

				list.add(map);
				
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}
	public ArrayList<Map> sysAlarmList(){
		String sql="select * from xhdigital_alarm where type!=1 and type!=5 and flag=0 and alarmId"
				+ " not in (select bsId from xhdigital_smsbsnotalarm)";
		ArrayList<Map> list=new ArrayList<Map>();
		
		Connection conn=db.getConn();		
		Statement stmt;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while (rst.next()) {
				HashMap map=new HashMap();
				map.put("bsId", rst.getInt("alarmId"));
				map.put("type", rst.getInt("type"));
				map.put("content", rst.getString("content"));

				list.add(map);
				
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}
	
	public ArrayList<Sms> personList(){
		String sql="select * from xhdigital_phonebook";
		ArrayList<Sms> list=new ArrayList<Sms>();
		
		Connection conn=db.getConn();		
		Statement stmt;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while (rst.next()) {
				Sms sms=new Sms();
				sms.setPhoneNumber(rst.getString("phoneNumber"));
				sms.setPerson(rst.getString("person"));
				list.add(sms);
				
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}
	//获取事件调度状态
	public String getScheduler() throws Exception
	{
		Connection conn=mysqlDb.getConn();
		Statement stmt=conn.createStatement();
		String sql="SHOW VARIABLES LIKE 'event_scheduler'";
		ResultSet rst = stmt.executeQuery(sql);
		String value="";
		while(rst.next())
		{
			value=rst.getString("Value");
		}
		if(value.equals("ON")){
			value="已开启";
		}
		else if(value.equals("OFF")){
			value="已关闭";
		}
		else {
			value="未知状态";
		}
		return value;
	}
	//开启事件状态
	public void OnScheduler() throws Exception
	{
		Connection conn=mysqlDb.getConn();
		Statement stmt=conn.createStatement();
		String sql="SET GLOBAL event_scheduler = 'ON'";
		stmt.executeQuery(sql);
		
		conn.close();
		stmt.close();
		
	}
	//关闭事件状态
	public void OffScheduler() throws Exception
	{
		Connection conn=mysqlDb.getConn();
		Statement stmt=conn.createStatement();
		String sql="SET GLOBAL event_scheduler = 'OFF'";
		stmt.executeQuery(sql);
		
		conn.close();
		stmt.close();
		
	}
	//添加事件
	public void addEvent(String sql) throws Exception
	{
		Connection conn=mysqlDb.getConn();
		Statement stmt=conn.createStatement();
		stmt.executeUpdate(sql);
		
		conn.close();
		stmt.close();
			
	}
	//设备上下线
	public void offonline(int type,int deviceId,int online){
		String sql="insert into  xhdigital_offonline(type,deviceId,online,time)VALUES('"+type+"',"
				+ "'"+deviceId+"','"+online+"','"+func.nowDate()+"')";
		try {
			Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	public int bsId_online(int id){
		String sql="select online from xhdigital_bs_sta where bsId="+id;
		Connection conn=db.getConn();
		Statement stmt;
		int model=-1;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				model=rst.getInt("online");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return model;
		
	}
	public int bsId_linkModel(int id){
		int model=-1;
		try {
		String sql="select linkModel from xhdigital_bs_sta where bsId="+id;
		Connection conn=db.getConn();
		Statement stmt;
		
		
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				model=rst.getInt("linkModel");
			}
			stmt.close();
			conn.close();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return model;
		
	}
	public int bsId_status(int id){
		int model=-1;
		try {
		String sql="select bsChannel_status from xhdigital_bs_sta where bsId="+id;
		Connection conn=db.getConn();
		Statement stmt;
		
		
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				model=rst.getInt("bsChannel_status");
			}
			stmt.close();
			conn.close();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return model;
		
	}
	
	public int NetStopSendSwitch(){
		int model=0;
		try {
		String sql="select AllNetStopSendSwitch from xhdigital_variables limit 1";
		Connection conn=db.getConn();
		Statement stmt;
		stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				model=rst.getInt("AllNetStopSendSwitch");
			}
			stmt.close();
			conn.close();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return model;
		
	}
	public void  updateNetStopSendSwitch(int result){
		String sql="update  xhdigital_variables  set AllNetStopSendSwitch="+result;
		try {
			Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public String bsId_bsName(int id){
		String sql="select bsName from xhdigital_bs_sta where bsId="+id;
		Connection conn=db.getConn();
		Statement stmt;
		String name="";
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				name=rst.getString("bsName");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return name;
		
	}
	public MarkStruct bsInfo(int bsId){
		String sql="select * from xhdigital_bs_sta where bsId="+bsId;
		ArrayList<MarkStruct> list=new ArrayList<MarkStruct>();
		
		Connection conn=db.getConn();		
		Statement stmt;
		MarkStruct markStruct=new MarkStruct();
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while (rst.next()) {
				
				markStruct.setBsId(rst.getInt("bsId"));
				markStruct.setBsName(rst.getString("bsName"));
				markStruct.setModel(rst.getInt("model"));
				markStruct.setLinkModel(rst.getInt("linkModel"));
				markStruct.setStatus(rst.getInt("bsChannel_status"));
				//list.add(markStruct);
				
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return markStruct;
	}
	
	//删除事件
	public void deleteEvent(String sql) throws Exception
	{
		Connection conn=mysqlDb.getConn();
		Statement stmt=conn.createStatement();
		stmt.executeUpdate(sql);
		
		conn.close();
		stmt.close();
		
	}
	//判断
	public boolean exists(String sql)throws Exception{
		Connection conn=db.getConn();
		if (conn==null) {
			return false;
		}
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		boolean bl=false;
		while(rst.next())
		{
			bl=true;
		}
		rst.close();
		stmt.close();
		conn.close();
		
		return bl;
	}
	
	public boolean mysql_exists(String sql)throws Exception{
		Connection conn=mysqlDb.getConn();
		if (conn==null) {
			return false;
		}
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		boolean bl=false;
		while(rst.next())
		{
			bl=true;
		}
		rst.close();
		stmt.close();
		conn.close();
		
		return bl;
	}
	private static ArrayList ResultSetToList(ResultSet   rs) throws Exception{    	
		ResultSetMetaData md = rs.getMetaData();
		int columnCount = md.getColumnCount();
		ArrayList list = new ArrayList();
		Map rowData;
		while(rs.next()){
			rowData = new HashMap(columnCount);
			for(int i = 1; i <= columnCount; i++)   {	 	    		
				Object v = rs.getObject(i);	    		

				if(v != null && (v.getClass() == Date.class || v.getClass() == java.sql.Date.class)){
					//Timestamp ts= rs.getTimestamp(i);
					//v = new java.util.Date(ts.getTime());
					//v = ts;
					if(v.equals("0000-00-00 00:00:00")){
						v="";
					}
				}
				if(v==null || "".equals(v))
				{
					v="";
				}
				if(v != null && v.getClass() == Clob.class){
					v = clob2String((Clob)v);
				}
				rowData.put(md.getColumnName(i),v);
			}
			list.add(rowData);	    	
		}
		return list;
	} 	
	private static String clob2String(Clob clob) throws Exception {
		return (clob != null ? clob.getSubString(1, (int) clob.length()) : null);
	}  		    
	private int ToInt(Object o){
		if(o == null) return 0;
		double d = Double.parseDouble(o.toString());
		int i = 0;
		i -= d;
		return -i;			
	}    
	private String ToString(Object o){
		if(o == null) return "";
		return o.toString();
	}    
	private Timestamp ToDate(Object o){
		try{
			if(o.getClass() == String.class){


				DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				o = format.parse(o.toString());  
				return new java.sql.Timestamp(((Date)o).getTime());
			}
			return o != null ? new java.sql.Timestamp(((Date)o).getTime()) : null;
		}catch(Exception ex){
			return null;
		}
	}

}
