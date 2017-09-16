package data.action;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.XhMysql;
import com.sql.XhSql;

public class RadioUserBs extends ActionSupport{
	private String hometerminalid;
	
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	
	//终端归属基站
	public void RadioUserBs() throws Exception
	{
		String sql ="",sql2=""; 
		sql2="select count(*) from hometerminal_basestation where hometerminalid ='"+hometerminalid+"' ";
		sql="select a.*,b.name from hometerminal_basestation a left join basestation b on a.basestationid=b.id" +
			" where a.hometerminalid='"+hometerminalid+"' " +
	        " order by a.basestationid asc limit "+start+","+limit;
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//组归属基站筛选
	public void BsRadioUserList() throws Exception
	{
		String sql ="",sql2=""; 
		sql2="select count(id) from basestation where id not in(select basestationid from hometerminal_basestation" +
				" where hometerminalid='"+hometerminalid+"') ";
		sql="select id,name from basestation where id not in(select basestationid from hometerminal_basestation" +
				" where hometerminalid='"+hometerminalid+"')  order by id asc";
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public String getHometerminalid() {
		return hometerminalid;
	}
	public void setHometerminalid(String hometerminalid) {
		this.hometerminalid = hometerminalid;
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
