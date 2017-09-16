package data.action;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.func.FlexJSON;
import com.sql.SysSql;

public class DeviceOffOnline {
	private SysSql Sql=new SysSql();
	private FlexJSON json=new FlexJSON();
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	public void OffOnline() throws Exception{
       String sql="select * from xhdigital_offonline where type!='LINK' and type!='DB' " +
       		"order by time desc limit "+start+","+limit;   
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public void DBCenter() throws Exception{
	       String sql="select * from xhdigital_offonline where type='LINK' or type='DB' " +
	       		"order by time desc limit "+start+","+limit;   
			
			ArrayList data = Sql.DBList(sql);

			HashMap result=new HashMap();
			result.put("items", data);
			result.put("total", data.size());
			String jsonstr = json.Encode(result);
			ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
			ServletActionContext.getResponse().getWriter().write(jsonstr);
		}
	//告警列表
	public void AlarmData() throws Exception{
	       String sql="select * from (select * from xhdigital_offonline where type='LINK' or type='DB'" +
	       		" or type='SW' or type='BS'  order by id desc) as a where a.flag!=1 and a.online!=1" +
	       		"  group by a.deviceId order by a.time desc limit "+start+","+limit;   
			
			ArrayList data = Sql.DBList(sql);

			HashMap result=new HashMap();
			result.put("items", data);
			result.put("total", data.size());
			String jsonstr = json.Encode(result);
			ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
			ServletActionContext.getResponse().getWriter().write(jsonstr);
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
	

}
