package data.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.StringUtil;
import com.func.fileManager;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;

public class WebUser extends ActionSupport{
	private boolean success;
	private String message;
	
	private int start;
	private int limit;
	private String sort;
	private String dir;
	private String username;
	private String groupid;
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	private StringUtil stru=new StringUtil();
	
	//获取会员菜单
	public void WebUsers() throws Exception
	{
		String sql ="",sql2="";  
		if (Level()<10) {
			sql2="select * from xhdigital_web_user where username like'%"+username+"%' and groupid ='"+cookie.getCookie("groupid")+"'";
			if (StringUtil.isNullOrEmpty(dir) == false)
			{
				sql ="select a.*,b.groupname from xhdigital_web_user a left  join xhdigital_web_membergroup b on  a.groupid=b.id " +
						" where a.username like'%"+username+"%' and a.groupid ='"+cookie.getCookie("groupid")+"'" +
						" order by "+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           
				sql ="select a.*,b.groupname from xhdigital_web_user a left  join xhdigital_web_membergroup b on  a.groupid=b.id " +
				" where a.username like'%"+username+"%' and a.groupid ='"+cookie.getCookie("groupid")+"'" +
				" order by id desc limit "+start+","+limit;         
			}
		} else {
			sql2="select * from xhdigital_web_user where username like'%"+username+"%' and groupid like '%"+groupid+"%'";
			if (StringUtil.isNullOrEmpty(sort) == false)
			{
				sql ="select a.*,b.groupname from xhdigital_web_user a left  join xhdigital_web_membergroup b on  a.groupid=b.id " +
						" where a.username like'%"+username+"%' and a.groupid like '%"+groupid+"%' " +
						" order by "+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           
				sql ="select a.*,b.groupname from xhdigital_web_user a left  join xhdigital_web_membergroup b on  a.groupid=b.id " +
				" where a.username like'%"+username+"%' and a.groupid like '%"+groupid+"%' " +
				" order by id desc limit "+start+","+limit;         
			}
		}
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public int Level()throws Exception{
		String sql="select level from xhdigital_web_membergroup where id="+cookie.getCookie("groupid");
		Connection conn = db.getConn();	
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		int level=-1;
		while(rst.next())
		{
			level=rst.getInt("level");
		}
		
		return level;
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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	
	
	
	

}
