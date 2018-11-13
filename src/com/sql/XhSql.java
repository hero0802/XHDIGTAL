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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sql.*;

public class XhSql {
    private XhMysql db=new XhMysql();
    protected final Log log4j=LogFactory.getLog(XhSql.class);
    
	
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
		}
		
	}
	public void Select(String sql) throws Exception{
		Connection conn=db.getConn();
		Statement stmt =conn.createStatement();
		stmt.executeQuery(sql);
		conn.close();
		stmt.close();		
	}
	public int MscId_Authoritystatus(int msc){
		String sql="select authoritystatus from hometerminal where id="+msc;
		Connection conn=db.getConn();
		Statement stmt;
		int  a=0;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				a=rst.getInt("authoritystatus");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return a;
	}
	public Map<String,Object> radioUserMap(int id){
		String sql="select * from hometerminal where id="+id;
		Connection conn=db.getConn();
		Statement stmt;
		Map<String,Object> map=new HashMap<String, Object>();
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				
				map.put("id",rst.getInt("id"));
				map.put("name",rst.getString("name"));
				map.put("authoritystatus",rst.getInt("authoritystatus"));
				map.put("workgroupid",rst.getString("workgroupid"));
				map.put("visittsid",rst.getString("visittsid"));
				map.put("onlinestatus",rst.getInt("onlinestatus"));
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
	}
	public int radioType(int userId){
		String sql="select type from hometerminal where id="+userId;
		Connection conn=db.getConn();
		Statement stmt;
		int  a=-1;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				a=rst.getInt("type");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return a;
	}
	
	//获取基站ID
	public String BsId(){
		String sql="select id from basestation";
		Connection conn=db.getConn();
		Statement stmt;
		String bsid="";
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				
				bsid+=rst.getString("id")+",";
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return bsid;
	}
	public String bsId_bsName(int id){
		String sql="select name from basestation where id="+id;
		Connection conn=db.getConn();
		Statement stmt;
		String name="";
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				name=rst.getString("name");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return name;
		
	}
	public String bsId_rf_send(int id){
		String sql="select sleepen from basestation where id="+id;
		Connection conn=db.getConn();
		Statement stmt;
		String name="";
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				name=rst.getString("sleepen");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return name;
		
	}
	public String bsId_rf_recv(int id){
		String sql="select rf_receive_en from basestation where id="+id;
		Connection conn=db.getConn();
		Statement stmt;
		String name="";
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				name=rst.getString("rf_receive_en");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return name;
		
	}
	public int bsId_model(int id){
		String sql="select admode from basestation where id="+id;
		Connection conn=db.getConn();
		Statement stmt;
		int model=-1;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				model=rst.getInt("admode");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return model;
		
	}
	public int bsId_channelno(int id){
		String sql="select channelno from basestation where id="+id;
		Connection conn=db.getConn();
		Statement stmt;
		int model=-1;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				model=rst.getInt("channelno")+1;
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return model;
		
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
	//判断
	public boolean exists(String sql)throws Exception{
		Connection conn=db.getConn();
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
