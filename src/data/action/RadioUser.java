package data.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

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
	private int tag=0;
	
	private XhMysql db=new XhMysql();
	private SysMysql db2=new SysMysql();
	private XhSql Sql=new XhSql();
	private SysSql sysSql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	private StringUtil stru=new StringUtil();
	
	
	
	//手台基站下定位
    public void OneRadioMaker()throws Exception{
    	String sql="select * from xhdigital_gpsinfo where srcId='"+msc+"' and infoTime>'"+endTime+"' limit 1";
    	
    	ArrayList data = sysSql.DBList(sql);
		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
    }
	
	
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
		String sql="",str="",sql2 = null;
		if(!msc.equals("")){
			str=" and mscid="+msc;
		}
		
		if(tag==0){
			sql2="select count(id) from xhdigital_offonline where "
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
		}else{
			sql2="select count(DISTINCT mscid) from xhdigital_offonline where "
					+ "time between '"+startTime+"' and '"+endTime+"'  "+str; 
			if (StringUtil.isNullOrEmpty(sort) == false)
			{
				sql="select * from xhdigital_offonline where "
						+ "time between '"+startTime+"' and '"+endTime+"'  "+str+" group by mscid  order by "+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           
				sql="select * from xhdigital_offonline where "
						+ "time between '"+startTime+"' and '"+endTime+"' "+str+" group by mscid order by mscid asc limit "+start+","+limit; 
				
				
				
				/*select * from (select * from `test` order by `date` desc) `temp`  group by category_id order by `date` desc*/
			}
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
		String sql1="select distinct(mscid)  from xhdigital_offonline where " +
			    " time between '"+startTime+"' and '"+endTime+"' "+str1+" "; 
		String sql2="select id,name from hometerminal where  type=0 "+str2; 
		try {
			ArrayList list2=Sql.DBList(sql2);
			
			Map map=usermap(sql1);
			
			 Iterator<Map> list = list2.iterator();
			    while (list.hasNext()) {
			    	Map map1=list.next();
			    	if(map.get(map1.get("id").toString())!=null){
						list.remove();
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
	public Map usermap(String sql)throws Exception{
		Connection conn=db2.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		Map map=new HashMap();
		while(rst.next())
		{
			map.put(rst.getString("mscid"), 0);
		}
		rst.close();
		stmt.close();
		conn.close();
		
		return map;
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


	public int getTag() {
		return tag;
	}


	public void setTag(int tag) {
		this.tag = tag;
	}
	
	

}
