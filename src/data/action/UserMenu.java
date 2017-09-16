package data.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.sql.SysMysql;
import com.sql.SysSql;

public class UserMenu {
	private  String username;
	private  String userid;
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private FlexJSON json=new FlexJSON();
	
	/**
	 * 获取系统会员菜单
	 * @return
	 * @throws Exception
	 */
	//获取accordion 的items
	public ArrayList userMenuItem(String username) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='1' and username='"+username+"' order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			rowData.put("icon", rs.getString("icon"));
			rowData.put("iconCls", rs.getString("url"));
			rowData.put("children", userMenuItemT(username, rs.getString("vpn")));
			if(rs.getInt("hidden")==0){
			list.add(rowData);	    
			}
		}
		HashMap result=new HashMap();
		result.put("items",list);
		stmt.close();
		conn.close();
		return list;		

	}
	//[2]2级菜单
	public ArrayList userMenuItemT(String username,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and username='"+username+"' order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			//rowData.put("icon", "../../resources/images/tab/tree1.png");
			rowData.put("iconCls", rs.getString("url"));
			if(exists(username,rs.getString("vpn"))){
				//rowData.put("icon", "resources/images/tab/tree1.png");
				rowData.put("icon", rs.getString("icon"));
				rowData.put("children", userMenuItemThree(username,rs.getString("vpn")));
				}
				else
				{
					//rowData.put("icon", "resources/images/tab/tree2.png");
					rowData.put("icon", rs.getString("icon"));
					rowData.put("leaf",true);
				}
			if(rs.getInt("hidden")==0){
			list.add(rowData);	
			}
		}
		stmt.close();
		conn.close();
		return list;		

	}
	//[3]3级菜单
	public ArrayList userMenuItemThree(String username,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and username='"+username+"' order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			//rowData.put("icon", rs.getString("icon"));
			rowData.put("iconCls", rs.getString("url"));
			if(exists(username,rs.getString("vpn"))){
			//rowData.put("icon", "resources/images/tab/tree1.png");
			rowData.put("icon", rs.getString("icon"));
			rowData.put("children", userMenuItemFore(username,rs.getString("vpn")));
			}
			else
			{
				//rowData.put("icon", "resources/images/tab/tree2.png");
				rowData.put("icon", rs.getString("icon"));
				rowData.put("leaf",true);
			}
			if(rs.getInt("hidden")==0){
			list.add(rowData);	
			}
		}
		stmt.close();
		conn.close();
		return list;		

	}
	//[4]4级菜单
	public ArrayList userMenuItemFore(String username,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and username='"+username+"' order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			rowData.put("icon", rs.getString("icon"));
			rowData.put("iconCls", rs.getString("url"));
			rowData.put("leaf",true);
			if(rs.getInt("hidden")==0){
			list.add(rowData);	
			}
		}
		stmt.close();
		conn.close();
		return list;		

	}
	
	//获取会员1级菜单信息
	public void userMenu() throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='1' and userid="+userid+" and" +
				" vpn not in(select vpn from xhdigital_web_groupmenu where groupid='"+cookie.getCookie("groupid")+"' and hidden=1) order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			/*rowData.put("icon", "../../"+rs.getString("icon"));*/
			rowData.put("png", rs.getString("icon"));
			/*rowData.put("iconCls", rs.getString("url"));*/
			rowData.put("expanded",true);
			rowData.put("children",userMenuT(userid,rs.getString("vpn")));

			list.add(rowData);	    	
		}
		HashMap result=new HashMap();
		result.put("text", ".");
		result.put("children",list);
		String str = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(str);		

	}

	//获取2级菜单信息
	public ArrayList userMenuT(String userid,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and userid="+userid+" and" +
		" vpn not in(select vpn from xhdigital_web_groupmenu where groupid='"+cookie.getCookie("groupid")+"' and hidden=1) order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			/*rowData.put("icon", "../../"+rs.getString("icon"));*/
			rowData.put("png", rs.getString("icon"));
			/*rowData.put("iconCls", rs.getString("url"));*/
		    if(userMenuExists(userid,rs.getString("vpn")))
		    {
            rowData.put("children",userMenuThree(userid,rs.getString("vpn")));
		    }
		    else
		    {
		    	rowData.put("leaf", true);
		    }
		

			list.add(rowData);	    	
		}
		return list;		

	}
	//获取3级菜单信息
	public ArrayList userMenuThree(String userid,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and userid="+userid+" and" +
		" vpn not in(select vpn from xhdigital_web_groupmenu where groupid='"+cookie.getCookie("groupid")+"' and hidden=1) order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			/*rowData.put("icon", "../../"+rs.getString("icon"));*/
			rowData.put("png", rs.getString("icon"));
			/*rowData.put("iconCls", rs.getString("url"));*/
			if(userMenuExists(userid,rs.getString("vpn")))
		    {
            rowData.put("children",userMenuFore(userid,rs.getString("vpn")));
		    }
		    else
		    {
		    	rowData.put("leaf", true);
		    }
			list.add(rowData);	    	
		}
		return list;		

	}
	//获取4级菜单信息
	public ArrayList userMenuFore(String userid,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and userid="+userid+" and" +
		" vpn not in(select vpn from xhdigital_web_groupmenu where groupid='"+cookie.getCookie("groupid")+"' and hidden=1) order by sort asc";	
		ResultSet rs = stmt.executeQuery(sql);	
		ArrayList list = new ArrayList();		
		Map rowData;
		
		while(rs.next()){
			rowData = new HashMap();
			rowData.put("id", rs.getString("id"));
			rowData.put("vpn", rs.getString("vpn"));
			rowData.put("text", rs.getString("text"));
			rowData.put("hidden", rs.getString("hidden"));
			/*rowData.put("icon", "../../"+rs.getString("icon"));*/
			rowData.put("png", rs.getString("icon"));
			/*rowData.put("iconCls", rs.getString("url"));*/
			rowData.put("leaf", true);
			list.add(rowData);	    	
		}
		return list;		

	}
	
	
	//判断子菜单是否存在
	public boolean exists(String username,String pmenu)throws Exception{
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and username='"+username+"'";
		Connection conn = db.getConn();	
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		boolean bl=false;
		while(rst.next())
		{
			bl=true;
		}
		
		return bl;
	}
	public boolean userMenuExists(String userid,String pmenu)throws Exception{
		String sql="select * from xhdigital_web_usermenu where pmenu='"+pmenu+"' and userid="+userid+" and" +
		" vpn not in(select vpn from xhdigital_web_groupmenu where groupid='"+cookie.getCookie("groupid")+"' and hidden=1)";
		Connection conn = db.getConn();	
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		boolean bl=false;
		while(rst.next())
		{
			bl=true;
		}
		
		return bl;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	

}
