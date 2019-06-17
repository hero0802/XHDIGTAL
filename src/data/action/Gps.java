package data.action;

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

public class Gps extends ActionSupport{
	private int start;
	private int limit;
	private int type;
	private String sort;
	private String dir;
	
	String bsId;
	String srcId;
	String dstId;
	String Ftime;
	String Etime;
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();		
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	
	public void Gps() throws Exception
	{
		String sql2="select count(id) from xhdigital_gpsinfo where srcId like'"+srcId+"%' and dstId like '"+dstId+"%' and infoTime between '"+Ftime+"' and '"+Etime+"' ";
		String sql ="select * from xhdigital_gpsinfo where srcId like'"+srcId+"%' and dstId like '"+dstId+"%' and infoTime between '"+Ftime+"' and '"+Etime+"' order by infoTime desc limit "+start+","+limit;    
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public void user_push_gps() throws Exception
	{
		StringBuilder sql=new StringBuilder();
		sql.append("select a.*,b.person as name from radio_push_gps as a ");
		sql.append("left join xhdigital_radiouser as b on a.radio_id=b.mscId where 1=1 ");
		if(type!=0){
			sql.append(" and a.info_type="+type);
		}
		sql.append(" limit "+start+","+limit);
		
		StringBuilder count_sql=new StringBuilder();
		count_sql.append("select count(*) from radio_push_gps where 1=1 ");
		if(type!=0){
			count_sql.append(" and info_type="+type);
		}
		ArrayList data = Sql.DBList(sql.toString());

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(count_sql.toString()));
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
	public String getBsId() {
		return bsId;
	}
	public void setBsId(String bsId) {
		this.bsId = bsId;
	}
	public String getSrcId() {
		return srcId;
	}
	public void setSrcId(String srcId) {
		this.srcId = srcId;
	}
	public String getDstId() {
		return dstId;
	}
	public void setDstId(String dstId) {
		this.dstId = dstId;
	}
	public String getFtime() {
		return Ftime;
	}
	public void setFtime(String ftime) {
		Ftime = ftime;
	}
	public String getEtime() {
		return Etime;
	}
	public void setEtime(String etime) {
		Etime = etime;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	

}
