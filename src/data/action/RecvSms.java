package data.action;

import java.util.ArrayList;
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

public class RecvSms extends ActionSupport{
	private boolean success;
	private String message;
	
	
	private String srcId;
	private String dstId;
	private String Ftime;
	private String Etime;
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	
	public void RecvSms() throws Exception
	{
		String sql ="",sql2=""; 
		sql2="select count(id) from xhdigital_recvsms where srcId like '"+srcId+"%' and dstId like '"+dstId+"%'" +
				" and writeTime>='"+Ftime+"' and writeTime<='"+Etime+"' ";
		if (StringUtil.isNullOrEmpty(sort) == false)
		{
			sql="select * from xhdigital_recvsms where srcId like '"+srcId+"%' and dstId like '"+dstId+"%'" +
				" and writeTime>='"+Ftime+"' and writeTime<='"+Etime+"' " +
			    " order by "+sort+" "+dir+" limit "+start+","+limit;
		}
		else
		{           
			sql="select * from xhdigital_recvsms where srcId like '"+srcId+"%' and dstId like '"+dstId+"%'" +
				" and writeTime>='"+Ftime+"' and writeTime<='"+Etime+"' " +
		    " order by writeTime desc limit "+start+","+limit;        
		}
		
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
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
