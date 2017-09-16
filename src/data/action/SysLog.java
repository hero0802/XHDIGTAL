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

public class SysLog extends ActionSupport{
	
	private int start;
	private int limit;
	private String sort;
	private String dir;
	private String Ftime;
	private String Etime;
	private int type;
	private String content;
	private String operator;
	
	
		private SysMysql db=new SysMysql();
		private SysSql Sql=new SysSql();
		private MD5 md5=new MD5();
		private Cookies cookie=new Cookies();
		private XhLog log=new XhLog();		
		private config INI=new config();
		private fileManager file=new fileManager();
		private FlexJSON json=new FlexJSON();
		
		public void SLog() throws Exception
		{
			String sql ="",sql2="",str="";
			if(type==0){str="";}else{str="and type="+type;}
			if (!content.equals("")) {
				str+=" and content like '%"+content+"%'";
			}
			sql2="select count(*) from xhdigital_log where operator like '"+operator+"%' "+str+" and time between '"+Ftime+"'" +
			" and '"+Etime+"'";
			
			if (StringUtil.isNullOrEmpty(sort) == false)
			{
				sql ="select * from xhdigital_log where operator like '"+operator+"%' "+str+" and time between '"+Ftime+"'" +
						" and '"+Etime+"'  order by "+sort+" "+dir+" limit "+start+","+limit;
			}
			else
			{           

				sql ="select * from xhdigital_log where operator like '"+operator+"%' "+str+" and time between '"+Ftime+"'" +
						" and '"+Etime+"'  order by time desc limit "+start+","+limit;           
			}
			
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

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	
	

}
