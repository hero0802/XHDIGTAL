package data.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.StringUtil;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;

public class RadioUser extends ActionSupport{
	private boolean success;
	private String message;
	
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	private String id;
	private String name;
	private int authoritystatus;
	
	
	private String msc;
	private String startTime;
	private String endTime;
	
	private XhMysql db=new XhMysql();
	private SysMysql db2=new SysMysql();
	private XhSql Sql=new XhSql();
	private SysSql sysSql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	private StringUtil stru=new StringUtil();
	
	
	
	
	
	public void RadioUser() throws Exception
	{
		String sql ="",sql2=""; 
		String str="";
		if (!name.equals("")) {
			str=" and name like '"+name+"%' ";
		}
		if (authoritystatus!=10) {
			if (authoritystatus==0) {
				str+=" and (authoritystatus=0 or authoritystatus is null) ";
			}else {
				str+=" and authoritystatus="+authoritystatus;
			}
			
		}
		sql2="select count(id) from hometerminal where id like '"+id+"%' "+str;
		if (StringUtil.isNullOrEmpty(sort) == false)
		{
			sql="select * from hometerminal where id like '"+id+"%'" + str +
			    " order by "+sort+" "+dir+" limit "+start+","+limit;
		}
		else
		{           
			sql="select * from hometerminal where id like '"+id+"%' " +str+
		    " order by id asc limit "+start+","+limit;        
		}		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void useronline(){
		String sql="",str="";
		if(!msc.equals("")){
			str=" and mscid="+msc;
		}
		String sql2="select count(id) from xhdigital_offonline where "
				+ "time between '"+startTime+"' and '"+endTime+"'  "+str; 
		if (StringUtil.isNullOrEmpty(sort) == false)
		{
			sql="select * from xhdigital_offonline where "
					+ "time between '"+startTime+"' and '"+endTime+"'  "+str+" order by "+sort+" "+dir+" limit "+start+","+limit;
		}
		else
		{           
			sql="select * from xhdigital_offonline where "
					+ "time between '"+startTime+"' and '"+endTime+"' "+str+" order by time desc limit "+start+","+limit;       
		}
		try {
			ArrayList data = sysSql.DBList(sql);
			HashMap result=new HashMap();
			result.put("items", data);
			result.put("total", sysSql.getCount(sql2));
			String jsonstr = json.Encode(result);
			ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
			ServletActionContext.getResponse().getWriter().write(jsonstr);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public void useroffonline(){
		String str1="",str2="";
		if(!msc.equals("")){
			str1=" and mscid="+msc;
			str2=" and id="+msc;
		}
		String sql1="select mscid from xhdigital_offonline where " +
			    " time between '"+startTime+"' and '"+endTime+"' "+str1+" group by mscid"; 
		String sql2="select id,name from hometerminal where type=0 "+str2; 
		try {
			ArrayList list1=sysSql.DBList(sql1);
			ArrayList list2=Sql.DBList(sql2);
			System.out.println(Arrays.toString(list1.toArray()));
			
			for (int i = 0; i < list2.size(); i++) {
				HashMap rowData = new HashMap();
				rowData=(HashMap) list2.get(i);
				String userid=rowData.get("id").toString();
				for (int j = 0; j < list1.size(); j++) {
					HashMap rowData2 = new HashMap();
					rowData=(HashMap) list1.get(j);
					String userid2=rowData.get("mscid").toString();
					if (userid.equals(userid2)) {
						list2.remove(i);
					}
				}
			}
			
			HashMap result=new HashMap();
			result.put("items", list2);
			result.put("total", list2.size());
			String jsonstr = json.Encode(result);
			ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
			ServletActionContext.getResponse().getWriter().write(jsonstr);
			
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	public void radioOnline(){
		String sql="select mscid from xhdigital_offonline where " +
			    " time between '"+startTime+"' and '"+endTime+"' group by mscid "; 
		try {
			ArrayList list=sysSql.DBList(sql);
			for (int i = 0; i < list.size(); i++) {
				
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	
		
		 
		
		
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


	public int getAuthoritystatus() {
		return authoritystatus;
	}


	public void setAuthoritystatus(int authoritystatus) {
		this.authoritystatus = authoritystatus;
	}

	public String getMsc() {
		return msc;
	}

	public void setMsc(String msc) {
		this.msc = msc;
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
