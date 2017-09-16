package data.action;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.fileManager;
import com.sql.SysMysql;
import com.sql.SysSql;

public class GpsOperation {
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	private String srcId;
	private String dstId;
	private String Ftime;
	private String Etime;
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();		
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	
	public void GpsOperation() throws Exception
	{
		String sql2="select count(id) from xhdigital_gpsoperation where srcId like'"+srcId+"%' and dstId like '"+dstId+"%' and writeTime  between'"+Ftime+"' and '"+Etime+"' ";
		String sql ="select * from xhdigital_gpsoperation where srcId like'"+srcId+"%' and dstId like '"+dstId+"%' and writeTime  between'"+Ftime+"' and '"+Etime+"'  order by writeTime desc limit "+start+","+limit;
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
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
	
	
	

}
