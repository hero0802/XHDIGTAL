package data.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.fileManager;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhSql;

public class MemberGroupAction extends ActionSupport{
	private int start;
	private int limit;
	private String sortField;
	private String sortOrder;
	
	private String vpn;
	private int hidden;
	private int groupid;
	private boolean success;
	private String message;
	
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	//获取会员组
	public void MemberGroup() throws Exception{
		String sqlCount="select count(*) from xhdigital_web_membergroup";
		String sqlData="select * from xhdigital_web_membergroup";
		ArrayList data = Sql.DBList(sqlData);
		
		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sqlCount));
		
		String str = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(str);
	}
	//显示会员组
	public void GroupList() throws Exception{
		String sqlCount="";
		String sqlData="",str="";
	/*	if(Level()==10){
			str+=" where level <=" +
				"(select level from webuser_view where username='"+cookie.getCookie("username")+"')";
		}else {
			str+=" where level <" +
			"(select level from webuser_view where username='"+cookie.getCookie("username")+"')";
		}*/
		
		if(Integer.parseInt(cookie.getCookie("groupid"))>=10000){
			sqlData="select * from xhdigital_web_membergroup order by id asc limit "+start+","+limit;
			sqlCount="select count(*) from xhdigital_web_membergroup";
		}else{
			sqlData="select * from xhdigital_web_membergroup where id<='"+Integer.parseInt(cookie.getCookie("groupid"))+"' order by id asc limit "+start+","+limit;
			sqlCount="select count(*) from xhdigital_web_membergroup where id<='"+Integer.parseInt(cookie.getCookie("groupid"))+"'";
		}
		
		
		
		ArrayList data = Sql.DBList(sqlData);
		
		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sqlCount));
		
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//获取会员组Level
	public int Level() throws Exception{
		int level=0;
		String sql="select level from xhdigital_web_membergroup where id="+cookie.getCookie("groupid");
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		while(rst.next())
		{
			level=rst.getInt("level");
		}
		rst.close();
		stmt.close();
		conn.close();
		return level;
	}
	//修改会员组菜单
	public String updateShowMenu() throws Exception{
		String sql="update xhdigital_web_groupmenu set hidden="+hidden+" where vpn='"+vpn+"' and groupid="+groupid;
		Sql.Update(sql);
		if(hidden==1){
			String sql2="update xhdigital_web_usermenu set hidden=1 where vpn='"+vpn+"' and userid in ("+userID()+")";
			Sql.Update(sql2);
			String[] str=userName().split(",");
		    for (int i = 0; i < str.length; i++) {
		    	createUserMenuJson(str[i]);
			}
			
		}
		log.writeLog(2, log.time()+" 修改了会员菜单", "");
		this.success=true;
		return SUCCESS;
	}
	public void createUserMenuJson(String user) throws Exception{			
		ArrayList data=new ArrayList();
	    data=new UserMenu().userMenuItem(user);
		String str = json.Encode(file.menuList(data));		
		file.creatTxtFile(user);
		file.writeTxtFile (user,str);
	}
	//获取会员组下的用户id
	 public String userID() throws Exception{
	    	String sql="select id from xhdigital_web_user where groupid='"+groupid+"'";
	    	String idstr="";
	    	Connection conn=db.getConn();
			Statement stmt=conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while(rst.next())
			{
				idstr+=rst.getInt("id")+",";
			}
			rst.close();
			stmt.close();
			conn.close();
			return idstr.substring(0,idstr.lastIndexOf(","));
	    }
	 //获取会员组下的用户名
	  public String userName() throws Exception{
	    	String sql="select username from xhdigital_web_user where groupid='"+groupid+"'";
	    	String idstr="";
	    	Connection conn=db.getConn();
			Statement stmt=conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			while(rst.next())
			{
				idstr+=rst.getString("username")+",";
			}
			rst.close();
			stmt.close();
			conn.close();
			return idstr.substring(0,idstr.lastIndexOf(","));
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
	public String getSortField() {
		return sortField;
	}
	public void setSortField(String sortField) {
		this.sortField = sortField;
	}
	public String getSortOrder() {
		return sortOrder;
	}
	public void setSortOrder(String sortOrder) {
		this.sortOrder = sortOrder;
	}
	public String getVpn() {
		return vpn;
	}
	public void setVpn(String vpn) {
		this.vpn = vpn;
	}
	public int getHidden() {
		return hidden;
	}
	public void setHidden(int hidden) {
		this.hidden = hidden;
	}
	public int getGroupid() {
		return groupid;
	}
	public void setGroupid(int groupid) {
		this.groupid = groupid;
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
	
	

}
