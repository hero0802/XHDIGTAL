package data.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.StringUtil;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.XhMysql;
import com.sql.XhSql;

public class TalkGroup extends ActionSupport{
	private boolean success;
	private String message;
	
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	private String id;
	private String name;
	
	private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	
	public void TalkGroup() throws Exception
	{
		String sql ="",sql2=""; 
		sql2="select count(id) from homegroup where id like '"+id+"%' ";
		if (StringUtil.isNullOrEmpty(sort) == false)
		{
			sql="select * from homegroup where id like '"+id+"%' " +
			    " order by "+sort+" "+dir+" limit "+start+","+limit;
		}
		else
		{           
			sql="select * from homegroup where id like '"+id+"%' " +
		    " order by id asc limit "+start+","+limit;        
		}
		
		ArrayList data = Sql.DBList(sql);
		
		for(int i=0;i<data.size();i++){
			Map map=(Map) data.get(i);
			map.put("count", count(map.get("id").toString()));
			map.put("bs", bs(map.get("id").toString()));
			data.remove(i);
			data.add(i, map);
		}

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public int count(String group){
		String sql="select count(*) as num from group_basestation_static where homegroupid="+group;
		Connection conn=db.getConn();
		Statement stmt;
		int  a=0;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				a=rst.getInt("num");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return a;
	}
	public String bs(String group){
		String sql="select a.basestationid,b.name from group_basestation_static as a left join "
				+ "basestation as b on a.basestationid=b.id where a.homegroupid="+group;
		Connection conn=db.getConn();
		Statement stmt;
		String str="";
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				str+="["+rst.getString("basestationid")+"]:"+rst.getString("name")+" ;";
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return str;
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
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	

}
