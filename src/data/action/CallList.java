package data.action;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;
import org.directwebremoting.convert.MapConverter;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.MD5;
import com.func.WebFun;
import com.func.fileManager;
import com.protobuf.TrunkCommon;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.struct.CallDataStruct;

public class CallList {
	private int start;
	private int limit;
	private String sort;
	private String dir;
	private String caller;
	private String called;
	private String callid;
	private String startTime;
	private String endTime;

	private int bsId;
	private String time;
	
	private int proType;
	private int tsid;
	private String groupAlias;
	private int callType;
	
	private static ArrayList dataNow = new ArrayList();
	private static List<CallDataStruct> list = new ArrayList();

	private SysMysql db = new SysMysql();
	private SysSql Sql = new SysSql();
	private MD5 md5 = new MD5();
	private Cookies cookie = new Cookies();
	private config INI = new config();
	private fileManager file = new fileManager();
	private FlexJSON json = new FlexJSON();
	private WebFun func = new WebFun();

	protected final Log log = LogFactory.getLog(CallList.class);

	private TcpKeepAliveClient tcp;

	protected final Log logger = LogFactory.getLog(CallList.class);

	public void CallList() throws Exception {
		String  str="",str2="";
		if (bsId>0) {
			str+=" and bsId="+bsId;
			str2+=" and a.bsId="+bsId;
		}
		
		
		String sql2 = "select count(*) from xhdigital_call where starttime >= '"
				+ startTime
				+ "' "
				+ "and starttime<= '"
				+ endTime
				+ "' and caller like '"
				+ caller
				+ "%' and called like '"
				+ called + "%' "+str;
		/*String sql = "select starttime,caller,person,name,called,usetime,rssi,filePath,bsId from call_view where starttime >= '"
				+ startTime + "' and starttime<= '" + endTime
				+ "' and caller like '" + caller + "%' " + "and called like '"
				+ called + "%' "+str+" order by starttime desc limit " + start + ","
				+ limit;*/
		String sql = "select a.starttime,a.caller,a.called,a.usetime,a.rssi,a.filePath,a.callid,"
				+ "a.bsId,c.bsName as name,b.person from xhdigital_call as a "
				+ "left join xhdigital_radiouser as b on a.caller=b.mscId  "
				+ "left join xhdigital_bs_sta as c on a.bsId=c.bsId where " + " a.starttime >= '"
				+ startTime + "' and a.starttime<= '" + endTime
				+ "' and a.caller like '" + caller + "%' " + "and a.called like '"
				+ called + "%' "+str2+" order by a.starttime desc limit " + start + ","
				+ limit;

		ArrayList data = Sql.DBList(sql);

		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}

	public void CallListFromCallid() throws Exception {
		String sql2 = "select count(*) from xhdigital_call where callid='"
				+ callid + "'";
		String sql = "select * from xhdigital_call where callid='" + callid
				+ "'";
		ArrayList data = Sql.DBList(sql);

		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}

	// 呼叫实时信息
	public void CallNow() throws Exception {
		/*HashMap callNowMap = new HashMap();
		String wavStr = "/resources/wav/Ring.wav";
		callNowMap.put("time", time);
		callNowMap.put("callid", callid);
		callNowMap.put("path", wavStr);
		callNowMap.put("srcId", "12345");
		callNowMap.put("caller", "12345");
		callNowMap.put("called", "12345");
		callNowMap.put("ig", 1);
		callNowMap.put("bsid", 1);
		callNowMap.put("bsName", 1);
		callNowMap.put("rssi", "");
		callNowMap.put("starttime", "2017-09-08 12:00:00");
		callNowMap.put("usetime", 10);
		TcpKeepAliveClient.getCallList().add(callNowMap);*/

		dataNow=TcpKeepAliveClient.getCallList();
		//Collections.reverse(dataNow);
		Collections.sort(dataNow,new MapComparator());
		HashMap result = new HashMap();
		result.put("items", dataNow);
		result.put("total", dataNow.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//呼叫失败统计
	public void callerror() throws Exception {
		String str="";
		if(bsId>0){
			str=" and bsId="+bsId;
		}
		String sql2 = "select count(*) from xhdigital_callerror where starttime>='"+startTime+"' and starttime<='"+endTime+"' "+str;
		String sql = "select * from xhdigital_callerror where starttime>='"+startTime+"' and starttime<='"+endTime+"' "+str+" limit " + start + ","
				+ limit;
		
		ArrayList data = Sql.DBList(sql);

		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql2));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
		

	}
	//信道机发射时间统计
	public void channelPro() throws SQLException {
		String sql="";
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		ArrayList list = new ArrayList();
		Map rowData;
		if(bsId==0){
			bsId=TcpKeepAliveClient.cbsId;
		}
		/*sql="select sum(pptTime) as time,DATE_FORMAT(createTime, '%m/%d' ) AS date from xhdigital_channel_send_count "
		  + "where bsId='"+bsId+"' group by date order by date asc limit 0,31";*/
		
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date1 = null,date2 = null;
		long time1=0;
		long time2=0;
		long time=0;
			try {
				date1 = dd.parse(startTime.replace("T", " "));
				date2 = dd.parse(endTime.replace("T", " "));
			} catch (ParseException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			time1=date1.getTime();
			time2=date2.getTime();
			time=(time2-time1)/(24*60*60*1000);
			if(time<=1){
				
				sql="select sum(pptTime) as time,DATE_FORMAT(createTime, '%m月%d-%H点' ) AS date from xhdigital_channel_send_count where createTime between '"+startTime+"' " +
				" and '"+endTime+"' and bsId='"+bsId+"' group by date order by date asc";
				
				ResultSet rs = stmt.executeQuery(sql);
				while (rs.next()) {
					rowData = new HashMap();
					rowData.put("label", rs.getString("date"));
					rowData.put("time", rs.getInt("time")/1000);
					list.add(rowData);
				}
			}

           else{
        	   sql="select sum(pptTime) as time,DATE_FORMAT(createTime, '%m月%d' ) AS date from xhdigital_channel_send_count where createTime between '"+startTime+"' " +
       				" and '"+endTime+"' and bsId='"+bsId+"' group by date order by date asc";
				ResultSet rs = stmt.executeQuery(sql);
				while (rs.next()) {
					rowData = new HashMap();
					rowData.put("label", rs.getString("date"));
					rowData.put("time", rs.getInt("time")/1000);
					list.add(rowData);
				}
		}
		HashMap data = new HashMap();
		data.put("total", list.size());
		data.put("items", list);
		String jsonstr = json.Encode(data);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		try {
			ServletActionContext.getResponse().getWriter().write(jsonstr);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}
	//呼叫统计
	public void callPro() throws SQLException {
		String sql="";
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		ArrayList list = new ArrayList();
		Map rowData;
		if (proType==0) {
			sql="select count(a.bsId) as num,sum(a.usetime) as time,a.bsid,b.bsName from xhdigital_call as a left join xhdigital_bs_sta"
					+ " as b on a.bsId=b.bsId where a.starttime between '"+startTime+"' " +
				" and '"+endTime+"' group by a.bsid order by a.bsId asc";
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				rowData = new HashMap();
				rowData.put("label", rs.getString("bsName")/*+"\n"+rs.getString("tsName")*/);
				rowData.put("time", rs.getInt("time"));
				rowData.put("num", rs.getInt("num"));
				list.add(rowData);
			}
		}
		else if(proType==1){
			SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date date1 = null,date2 = null;
			long time1=0;
			long time2=0;
			long time=0;
			try {
				date1 = dd.parse(startTime.replace("T", " "));
				date2 = dd.parse(endTime.replace("T", " "));
				time1=date1.getTime();
				time2=date2.getTime();
				time=(time2-time1)/(24*60*60*1000);
				String  str="";
				if (tsid>0) {
					str+=" and bsId="+tsid;
				}
				if (!groupAlias.equals("")) {
					str+=" and called='"+groupAlias+"' and ig=1";
				}
				if(time<=5){
					
					sql="select count(*)as num,sum(usetime) as time,DATE_FORMAT( starttime, '%m月%d-%H点' ) AS date from xhdigital_call where starttime between '"+startTime+"' " +
					" and '"+endTime+"' "+str+" group by date order by date asc";
					
					ResultSet rs = stmt.executeQuery(sql);
					while (rs.next()) {
						rowData = new HashMap();
						rowData.put("label", rs.getString("date"));
						rowData.put("time", rs.getInt("time"));
						rowData.put("num", rs.getInt("num"));
						list.add(rowData);
					}
				}
				else if(time>5 && time<=31){
					sql="select count(*)as num,sum(usetime) as time,DATE_FORMAT( starttime, '%m月%d' ) AS date from xhdigital_call where starttime between '"+startTime+"' " +
					" and '"+endTime+"' "+str+" group by date order by date asc ";
					ResultSet rs = stmt.executeQuery(sql);
					while (rs.next()) {
						rowData = new HashMap();
						rowData.put("label", rs.getString("date"));
						rowData.put("time", rs.getInt("time"));
						rowData.put("num", rs.getInt("num"));
						list.add(rowData);
					}
				}else{
					sql="select count(*)as num,sum(usetime) as time,DATE_FORMAT( starttime, '%m月' ) AS date from xhdigital_call where starttime between '"+startTime+"' " +
					" and '"+endTime+"' "+str+" group by date order by date asc ";
					ResultSet rs = stmt.executeQuery(sql);
					while (rs.next()) {
						rowData = new HashMap();
						rowData.put("label", rs.getString("date"));
						rowData.put("time", rs.getInt("time"));
						rowData.put("num", rs.getInt("num"));
						list.add(rowData);
					}
				}
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		else if(proType==2){
			sql="select count(*)as num,sum(usetime) as time,called from xhdigital_call where starttime between '"+startTime+"' " +
			" and '"+endTime+"' and ig=1 group by called order by time desc limit 20";
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				rowData = new HashMap();
				rowData.put("label", rs.getString("called")/*+"\n"+rs.getString("calledName")*/);
				rowData.put("time", rs.getInt("time"));
				rowData.put("num", rs.getInt("num"));
				list.add(rowData);
			}
		}
		else if(proType==3){
			sql="select count(*)as num,sum(usetime) as time,ig from xhdigital_call where starttime between '"+startTime+"' " +
			" and '"+endTime+"' group by ig order by time desc limit 20";
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				rowData = new HashMap();
				int ig=rs.getInt("ig");
				if (ig==0) {
					rowData.put("label", "单呼");
				}else if (ig==1) {
					rowData.put("label", "组呼");
				}else if (ig==11) {
					rowData.put("label", "紧急组呼");
				}else {
					rowData.put("label", rs.getString("ig"));
				}
				
				rowData.put("time", rs.getInt("time"));
				rowData.put("num", rs.getInt("num"));
				list.add(rowData);
			}
		}
		
		/*String[] str = startTime.split("-");
		int year = Integer.parseInt(str[0]);
		int month = Integer.parseInt(str[1]);*/
		
		
		HashMap data = new HashMap();
		data.put("total", list.size());
		data.put("items", list);
		String jsonstr = json.Encode(data);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		try {
			ServletActionContext.getResponse().getWriter().write(jsonstr);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	//呼叫者联系人
	public void CallerInfo() throws Exception {
		String sql = "select * from xhdigital_radiouser where mscId="+caller;
		ArrayList data = Sql.DBList(sql);

		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	/*public void callPro() throws SQLException {
		String[] str = time.split("-");
		int year = Integer.parseInt(str[0]);
		int month = Integer.parseInt(str[1]);
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		String sql = "", monthStr = "01";
		if (month < 10) {
			monthStr = "0" + month;
		} else {
			monthStr = String.valueOf(month);
		}
		if (bsId == 0) {
			sql = "select count(*)as num,DATE_FORMAT( starttime, '%d' ) AS date,sum(usetime) as time  "
					+ "from xhdigital_call "
					+ "where MONTH(starttime)='"
					+ str[1]
					+ "' "
					+ "and YEAR(starttime)='"
					+ str[0]
					+ "'  group by date";
		} else {
			sql = "select count(*)as num,DATE_FORMAT( starttime, '%d' ) AS date,sum(usetime) as time  "
					+ "from xhdigital_call "
					+ "where MONTH(starttime)='"
					+ str[1]
					+ "' "
					+ "and YEAR(starttime)='"
					+ str[0]
					+ "' "
					+ "and bsId='" + bsId + "' group by date";
		}

		ResultSet rs = stmt.executeQuery(sql);
		ArrayList list = new ArrayList();
		Map rowData;
		while (rs.next()) {
			rowData = new HashMap();
			rowData.put("label", rs.getString("date"));
			rowData.put("value", rs.getString("time"));
			list.add(rowData);
		}
		HashMap data = new HashMap();
		data.put("total", list.size());
		data.put("items", list);
		String jsonstr = json.Encode(data);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		try {
			ServletActionContext.getResponse().getWriter().write(jsonstr);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}*/

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

	public String getCaller() {
		return caller;
	}

	public void setCaller(String caller) {
		this.caller = caller;
	}

	public String getCalled() {
		return called;
	}

	public void setCalled(String called) {
		this.called = called;
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

	public String getCallid() {
		return callid;
	}

	public void setCallid(String callid) {
		this.callid = callid;
	}

	public int getBsId() {
		return bsId;
	}

	public void setBsId(int bsId) {
		this.bsId = bsId;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public int getProType() {
		return proType;
	}

	public int getTsid() {
		return tsid;
	}

	public int getCallType() {
		return callType;
	}

	public void setProType(int proType) {
		this.proType = proType;
	}

	public void setTsid(int tsid) {
		this.tsid = tsid;
	}

	public void setCallType(int callType) {
		this.callType = callType;
	}

	public String getGroupAlias() {
		return groupAlias;
	}

	public void setGroupAlias(String groupAlias) {
		this.groupAlias = groupAlias;
	}
	

}
class MapComparator implements Comparator<Map<String, String>> {
	 
    public int compare(Map<String, String> o1, Map<String, String> o2) {
        // TODO Auto-generated method stub
        String b1 = o1.get("starttime");
        String b2 = o2.get("starttime");
        if (b2 != null) {
            return b2.compareTo(b1);
        }
        return 0;
    }

}
