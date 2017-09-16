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
import com.func.fileManager;
import com.sql.SysMysql;
import com.sql.SysSql;

public class GroupMenu {
	//参数
	private String groupid;
	private boolean success;
	private String message;
	
	private SysMysql db=new SysMysql();
	private SysSql sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	//获取会员组菜单
	public void GroupMenu() throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_groupmenu where pmenu='1' and groupid="+groupid+" order by sort asc";	
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
			rowData.put("children",Get2Menu(groupid,rs.getString("vpn")));

			list.add(rowData);	    	
		}
		HashMap result=new HashMap();
		result.put("text", ".");
		result.put("children",list);
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);		

	}

	//获取2级菜单信息
	public ArrayList Get2Menu(String groupid,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_groupmenu where pmenu='"+pmenu+"' and groupid="+groupid+" order by sort asc";		
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
		    if(exists(groupid,rs.getString("vpn")))
		    {
            rowData.put("children",Get3Menu(groupid,rs.getString("vpn")));
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
	public ArrayList Get3Menu(String groupid,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_groupmenu where pmenu='"+pmenu+"' and groupid="+groupid+" order by sort asc";		
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
			if(exists(groupid,rs.getString("vpn")))
		    {
            rowData.put("children",Get4Menu(groupid,rs.getString("vpn")));
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
	public ArrayList Get4Menu(String groupid,String pmenu) throws Exception
	{
		Connection conn = db.getConn();		
		Statement stmt = conn.createStatement();
		String sql="select * from xhdigital_web_groupmenu where pmenu='"+pmenu+"' and groupid="+groupid+" order by sort asc";		
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
	public boolean exists(String groupid,String pmenu)throws Exception{
		String sql="select * from xhdigital_web_groupmenu where pmenu='"+pmenu+"' and groupid="+groupid+" order by sort asc";
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

	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
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
