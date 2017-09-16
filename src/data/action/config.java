package data.action;

import java.net.Socket;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.func.FlexJSON;
import com.func.WebFun;
import com.func.XhLog;
import com.listener.BScontrolListener;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.GpsSetStruct;

public class config extends ActionSupport{
	private boolean success;
	
	private String xh_ip;
	private int xh_port;
	private String xh_root;
	private String xh_password;
	private String xh_dbname;
	private String center_ip;
	private int center_port;
	private int udp_port;
	private int pptId;
	private String multicast_ip;
	private int multicast_port;
	private int time;
	private int start;
	
	private int tcp_status;
	private int adgroup;
	
	private WebFun func=new WebFun();
	private TcpKeepAliveClient tcp;
	private Socket socket=tcp.getSocket();
	private SendData send = new SendData();
	private MessageStruct header = new MessageStruct();
	
	private XhMysql db = new XhMysql();
	private XhSql Sql = new XhSql();
	private FlexJSON json = new FlexJSON();
	private XhLog log = new XhLog();
	
	
	public String loadXML(){
		xh_ip=func.readXml("centerDataBase", "xh_ip");
		xh_port=Integer.parseInt(func.readXml("centerDataBase", "xh_port"));
		xh_root=func.readXml("centerDataBase", "xh_root");
		xh_password=func.readXml("centerDataBase", "xh_password");
		xh_dbname=func.readXml("centerDataBase", "xh_dbname");
		center_ip=func.readXml("centerNet", "center_ip");
		center_port=Integer.parseInt(func.readXml("centerNet", "center_port"));
		udp_port=Integer.parseInt(func.readXml("centerNet", "udp_port"));
		start=Integer.parseInt(func.readXml("Listener", "start"));
		time=Integer.parseInt(func.readXml("Listener", "time"));
		pptId=Integer.parseInt(func.readXml("call", "pptId"));
		if(socket.isConnected()){tcp_status=1;}else {
			tcp_status=0;
		}
		this.success=true;
		return SUCCESS;
	}
	public String updateXML() throws Exception{
		func.updateXML("centerDataBase", "xh_ip",xh_ip);
		func.updateXML("centerDataBase", "xh_port",String.valueOf(xh_port));
		func.updateXML("centerDataBase", "xh_root",xh_root);
		func.updateXML("centerDataBase", "xh_password",xh_password);
		func.updateXML("centerDataBase", "xh_dbname",xh_dbname);
		func.updateXML("centerNet", "center_ip",center_ip);
		func.updateXML("centerNet", "center_port",String.valueOf(center_port));
		func.updateXML("centerNet", "udp_port",String.valueOf(udp_port));
		func.updateXML("call", "pptId",String.valueOf(pptId));
		func.updateXML("Listener", "start",String.valueOf(start));
		func.updateXML("Listener", "time",String.valueOf(time));
		if (BScontrolListener.getTimer()!=null) {
			
			BScontrolListener.getTimer().cancel();
			BScontrolListener listener=new BScontrolListener();
			listener.contextDestroyed(null);
			BScontrolListener.setTimer(null);
			listener.contextInitialized(null);
			
		}
		this.success=true;
		return SUCCESS;
	}
	public String netSave() throws Exception{
		func.updateXML("centerNet", "center_ip",center_ip);
		func.updateXML("centerNet", "center_port",String.valueOf(center_port));
		func.updateXML("centerNet", "udp_port",String.valueOf(udp_port));
		func.updateXML("call", "pptId",String.valueOf(pptId));
		/*func.updateXML("Multicast", "multicast_ip",multicast_ip);
		func.updateXML("Multicast", "multicast_port",String.valueOf(multicast_port));*/
		
		if(socket!=null || !socket.isClosed()){
			socket.close();
		}
		this.success=true;
		return SUCCESS;
	}
	//组列表
	public void groupList() throws Exception{
		String sql="select id,name from homegroup";
		ArrayList data = Sql.DBList(sql);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
		
	}
	//获取模数互联组
	public String HasAdGroup() throws SQLException{
		String sql="select adgroup from systemconfig limit 1";
		Connection conn = db.getConn();
		Statement stmt= conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		while (rst.next()) {
			adgroup=rst.getInt("adgroup");
		}
		this.success=true;
		return SUCCESS;
	}
	//修改模数互联组
	public String ChangeAdGroup() throws Exception{
		String sql="update systemconfig set adgroup="+adgroup;
		Sql.Update(sql);
		send.SetADGroup(header, adgroup);
		log.writeLog(4, "操作：设置模数互联组为"+adgroup, "");
		this.success=true;
		return SUCCESS;
	}
	
	
	public String getXh_ip() {
		return xh_ip;
	}
	public void setXh_ip(String xhIp) {
		xh_ip = xhIp;
	}
	public int getXh_port() {
		return xh_port;
	}
	public void setXh_port(int xhPort) {
		xh_port = xhPort;
	}
	public String getXh_root() {
		return xh_root;
	}
	public void setXh_root(String xhRoot) {
		xh_root = xhRoot;
	}
	public String getXh_password() {
		return xh_password;
	}
	public void setXh_password(String xhPassword) {
		xh_password = xhPassword;
	}
	public String getXh_dbname() {
		return xh_dbname;
	}
	public void setXh_dbname(String xhDbname) {
		xh_dbname = xhDbname;
	}
	public String getCenter_ip() {
		return center_ip;
	}
	public void setCenter_ip(String centerIp) {
		center_ip = centerIp;
	}
	public int getCenter_port() {
		return center_port;
	}
	public void setCenter_port(int centerPort) {
		center_port = centerPort;
	}
	public int getUdp_port() {
		return udp_port;
	}
	public void setUdp_port(int udpPort) {
		udp_port = udpPort;
	}
	public String getMulticast_ip() {
		return multicast_ip;
	}
	public void setMulticast_ip(String multicastIp) {
		multicast_ip = multicastIp;
	}
	public int getMulticast_port() {
		return multicast_port;
	}
	public void setMulticast_port(int multicastPort) {
		multicast_port = multicastPort;
	}
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public int getTcp_status() {
		return tcp_status;
	}
	public void setTcp_status(int tcpStatus) {
		tcp_status = tcpStatus;
	}
	public int getTime() {
		return time;
	}
	public void setTime(int time) {
		this.time = time;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getPptId() {
		return pptId;
	}
	public void setPptId(int pptId) {
		this.pptId = pptId;
	}
	public int getAdgroup() {
		return adgroup;
	}
	public void setAdgroup(int adgroup) {
		this.adgroup = adgroup;
	}
	
	
	
	
	

}
