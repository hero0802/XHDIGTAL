package data.action;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.StringUtil;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.TcpKeepAliveClient;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;

public class BsStation extends ActionSupport{
	private boolean success;
	private String message;
	
	private int start;
	private int limit;
	private String sort;
	private String dir;
	
	private String id;
	private String name;
	private int bsId;
	private int gpsen;
	private String Ftime;
	private String Etime;
	
	private String homegroupid;
	
	private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private SysSql Sql_sys=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private FlexJSON json=new FlexJSON();
	
	
	//基站列表
	public void bsList() throws Exception{
		String sql="select * from xhdigital_bs_sta order by bsId asc";
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//基站遥测历史记录
	public void bscontrollList() throws Exception{
		String checkstr="",checkstr2="";
		if (gpsen!=2) {
			checkstr+=" and gps="+gpsen;
			checkstr2+=" and a.gps="+gpsen;
		}
		if (bsId!=0) {
			checkstr+=" and bsId="+bsId;
			checkstr2+=" and a.bsId="+bsId;
		}
		
		String sql="select a.*,b.bsName from xhdigital_bs_status  as a left join xhdigital_bs_sta as b on a.bsId=b.bsId"
				+ " where time between '"+Ftime+"' and '"+Etime+"' "+checkstr2+"   order by a.time desc limit "+start+","+limit;
		String sql2="select count(*) from xhdigital_bs_status where time between '"+Ftime+"' and '"+Etime+"' "+checkstr;
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql_sys.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void BsStation() throws Exception
	{
		String sql ="",sql2=""; 
		sql2="select count(id) from basestation where id like '"+id+"%' ";
		if (StringUtil.isNullOrEmpty(sort) == false)
		{
			sql="select * from basestation where id like '"+id+"%' " +
			    " order by "+sort+" "+dir+" limit "+start+","+limit;
		}
		else
		{           
			sql="select * from basestation where id like '"+id+"%' " +
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
	public void BsView() throws Exception
	{
		String sql ="",sql2=""; 
		sql2="select count(id) from xhdigital_bs_sta ";
		sql="select a.*,b.channel_number from xhdigital_bs_sta as a left join xhdigital_bs_control as b"
				+ " on a.bsId=b.bsId order by bsId asc";
		
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql_sys.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	public void BsControl() throws Exception
	{
		String sql ="",sql2=""; 
		if (Integer.parseInt(id)==-1) {
			sql2="select count(id) from xhdigital_bs_sta";
			sql="select a.bsId as bs,a.bsName,a.model,a.linkModel,a.online,a.longitude,a.latitude,a.height,a.star"
					+ ",b.* from xhdigital_bs_sta a left join " +
					"xhdigital_bs_control b on a.bsId=b.bsId order by a.bsId asc";
		}else {
			sql2="select count(id) from xhdigital_bs_sta where bsId="+id;
			sql="select a.bsId as bs,a.bsName,a.model,a.linkModel,a.online,a.longitude,a.latitude,a.height,a.star"
					+ ",b.* from xhdigital_bs_sta a left join " +
					"xhdigital_bs_control b on a.bsId=b.bsId where a.bsId='"+id+"' order by a.bsId asc";
		}
		
		
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql_sys.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//系统信息
	
	public void Info() throws Exception {
		ArrayList info = new ArrayList();
		info=TcpKeepAliveClient.getBsInfoList();
		//Collections.reverse(dataNow);
		Collections.sort(info,new MapCompa());
		HashMap result = new HashMap();
		result.put("items", info);
		result.put("total", info.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void rf_transmit() throws Exception
	{
		String sql ="select id from basestation where rf_transmit_en=0";
		
		ArrayList data = Sql.DBList(sql);
		HashMap result=new HashMap();
		result.put("items", data);
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void rf_receive() throws Exception
	{
		String sql ="select id from basestation where rf_receive_en=0";
		
		ArrayList data = Sql.DBList(sql);
		HashMap result=new HashMap();
		result.put("items", data);
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	
	public void rf_updown() throws Exception
	{
		String sql ="select id from basestation where rf_receive_en=0 or rf_transmit_en=0";
		
		ArrayList data = Sql.DBList(sql);
		HashMap result=new HashMap();
		result.put("items", data);
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//限制基站告警列表
	public void smsNotAlarmList() throws Exception
	{
		String sql ="select a.bsId,b.bsName from xhdigital_smsbsnotalarm as a left join xhdigital_bs_sta as b"
				+ " on a.bsId=b.bsId order by a.bsId asc";
		
		ArrayList data = Sql_sys.DBList(sql);
		HashMap result=new HashMap();
		result.put("items", data);
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//限制基站告警列表
	public void smsBsList() throws Exception
	{
		String sql ="select bsId,bsName from xhdigital_bs_sta where bsId not in(select bsId from xhdigital_smsbsnotalarm) order by bsId asc";
		
		ArrayList data = Sql_sys.DBList(sql);
		HashMap result=new HashMap();
		result.put("items", data);
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
	public String getHomegroupid() {
		return homegroupid;
	}
	public void setHomegroupid(String homegroupid) {
		this.homegroupid = homegroupid;
	}
	public int getBsId() {
		return bsId;
	}
	public void setBsId(int bsId) {
		this.bsId = bsId;
	}
	public int getGpsen() {
		return gpsen;
	}
	public void setGpsen(int gpsen) {
		this.gpsen = gpsen;
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

class MapCompa implements Comparator<Map<String, String>> {
	 
    public int compare(Map<String, String> o1, Map<String, String> o2) {
        // TODO Auto-generated method stub
        String b1 = o1.get("time");
        String b2 = o2.get("time");
        if (b2 != null) {
            return b2.compareTo(b1);
        }
        return 0;
    }

}
