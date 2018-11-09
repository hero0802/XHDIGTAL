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
import com.func.WebFun;
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
	private String mscType;
	private String startTime;
	private String endTime;
	private String lastId;
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
	private WebFun func = new WebFun();
	
	
	
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
    
    //支队
    public void RadioUserDetm()throws Exception{
    	String sql="select detachment_id as id,detachment_name as name from detachment";
    	
    	ArrayList data = Sql.DBList(sql);
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
		StringBuilder sqlparam=new StringBuilder();
		if(mscType!=null && !mscType.equals("") && !mscType.equals("0")){
			int a=Integer.parseInt(mscType);
			sqlparam.append(" and id like '"+a+"%'");
		}
		if(lastId!=null && !lastId.equals("")){
			sqlparam.append(" and right(id,1)="+lastId);
		}
		if (!name.equals("")) {
			sqlparam.append(" and name like '"+name+"%'");
		}
		if(!id.equals("")){
			sqlparam.append(" and id like '"+id+"%'");
		}
	
		
		
		
		if (authoritystatus!=10) {
			if (authoritystatus==0) {
				sqlparam.append("and (authoritystatus=0 or authoritystatus is null)");
			}else {
				sqlparam.append(" and authoritystatus="+authoritystatus);
			}
			
		}
		str=sqlparam.toString();
		sql2="select count(id) from hometerminal where 1=1  "+str;
		if (StringUtil.isNullOrEmpty(sort) == false)
		{
			sql="select * from hometerminal where 1=1 " + str +
			    " order by "+sort+" "+dir+" limit "+start+","+limit;
		}
		else
		{           
			sql="select * from hometerminal where 1=1 " +str+
		    " order by id asc limit "+start+","+limit;        
		}	
		
		System.out.println("sql->"+sql);
		System.out.println("sql2->"+sql2);
		
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void useronline(){
		String sql="",str="",str2="",sql2 = null;
		if (func.StringToInt(mscType) > 0) {
			str += " and mscid like '" + func.StringToInt(mscType) + "%'";
			str2 += " and a.mscid like '" + func.StringToInt(mscType) + "%'";
		}
		if(!msc.equals("")){
			str=" and mscid like '"+msc+"%'";
			str2=" and a.mscid like '"+msc+"%'";
		}
		
		if(tag==0){
			sql2="select count(id) from xhdigital_offonline where "
					+ "time between '"+startTime+"' and '"+endTime+"'  "+str; 
			if (StringUtil.isNullOrEmpty(sort) == false)
			{
				sql="select a.mscid,a.online,a.time,b.person as name from xhdigital_offonline as a "
						+ "left join xhdigital_radiouser as b on a.mscid=b.mscId where "
						+ "a.time between '"+startTime+"' and '"+endTime+"'  "+str2+" order by a."+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           
				sql="select a.mscid,a.online,a.time,b.person as name from xhdigital_offonline as a "
						+ " left join xhdigital_radiouser as b on a.mscid=b.mscId where "
						+ "a.time between '"+startTime+"' and '"+endTime+"' "+str2+" order by a.time desc limit "+start+","+limit;       
			}
		}else if(tag==1){
			sql2="select count(DISTINCT mscid) from xhdigital_offonline where "
					+ "time between '"+startTime+"' and '"+endTime+"'  "+str; 
			if (StringUtil.isNullOrEmpty(sort) == false)
			{
				sql="select a.mscid,a.online,a.time,b.person as name from xhdigital_offonline as a"
						+ "left join xhdigital_radiouser as b on a.mscid=b.mscId  where "
						+ "a.time between '"+startTime+"' and '"+endTime+"'  "+str2+" group by a.mscid  order by a."+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           
				sql="select a.mscid,a.online,a.time,b.person as name from xhdigital_offonline as a "
						+ "left join xhdigital_radiouser as b on a.mscid=b.mscId where   a.time between '"+startTime+"' and '"+endTime+"' "+str2+" group by a.mscid order by a.mscid asc limit "+start+","+limit; 
				
			}
		}else if(tag==2){
			sql2="select count(*) from now_user_online ";
			sql="select userId as mscid,online,time,name from now_user_online";
			/*
			
			sql2="select count(DISTINCT mscid) from xhdigital_offonline where "
					+ "online=1 and time between '"+startTime+"' and '"+endTime+"'  "+str; 
			if (StringUtil.isNullOrEmpty(sort) == false)
			{
				sql="select * from xhdigital_offonline where "
						+ "time between '"+startTime+"' and '"+endTime+"'  "+str+" group by mscid  order by "+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           
				sql="select * from xhdigital_offonline where "
						+ "time between '"+startTime+"' and '"+endTime+"' "+str+" group by mscid order by mscid asc limit "+start+","+limit; 
				
			}*/
		}
		
		
		try {
			ArrayList data=new ArrayList();
			System.out.println(sql);
			System.out.println(sql2);
			int count=0;
			data = sysSql.DBList(sql);
			count=sysSql.getCount(sql2);
			/*if(tag!=2){
				data = sysSql.DBList(sql);
				count=sysSql.getCount(sql2);
			}else{
				data = Sql.DBList(sql);
				count=Sql.getCount(sql2);
			}*/
			HashMap result=new HashMap();
			result.put("items", data);
			result.put("total", count);
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


	public String getMscType() {
		return mscType;
	}


	public void setMscType(String mscType) {
		this.mscType = mscType;
	}

	public String getLastId() {
		return lastId;
	}

	public void setLastId(String lastId) {
		this.lastId = lastId;
	}
	
	

}
