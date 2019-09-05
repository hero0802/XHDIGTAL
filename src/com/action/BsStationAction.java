package com.action;

import java.awt.List;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.swing.event.TreeExpansionEvent;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.json.annotations.JSON;

import com.dwr.IndexDwr;
import com.dwr.SocketDwr;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.WebFun;
import com.opensymphony.xwork2.ActionSupport;
import com.protobuf.TrunkCommon;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.BreakCallStruct;
import com.struct.bsStatusStruct;

public class BsStationAction extends ActionSupport {
	/**
	 * 
	 */
	private static final long serialVersionUID = 9021620094491030667L;
	private boolean success;
	private String message;
	private String deleteIds; // 删除ID号
	private String table;

	private String id;
	private String sysidcode;
	private String colorcode;
	private String sleepen;
	private String ip;
	private String startwatchdog;
	private String channelno;
	private String slot0authority;
	private String slot1authority;
	private String aietype;
	private String up;
	private String mask;
	private String sf;
	private String wt;
	private String reg;
	private String backoff;
	private String np;
	private String name;
	private String rf_transmit_en;
	private String rf_receive_en;
	private String offlinech;
	private String offlinerepeaten;
	private String admode;
	private String aduiorecvport;
	
	private int wan_en;
	private int wan_centerport;
	private int wan_switchport;
	private int issimulcast;
	private int gpsnum_delay;
	private String wan_centerip;
	private String wan_switchip;
	private String mcsrcen;
	private String gpsunlock_worken;
	private String msodisconn_worken;
	private String bsdisconn_worken;
	private String rssi_ceiling;
	

	private int number;
	private int power;
	
	private double lng;
	private double lat;

	private int bsId;
	private int bsType;
	
	private String bsIds;
	private int bsmang=2;
	private int ignore;
	
	
	private String callid;
	private int srcid;//主叫ID号
	private int tarid;//被叫ID号
	private int pttid;//当前主叫ID号

	private XhMysql db = new XhMysql();
	private XhSql Sql = new XhSql();
	private SysMysql db_sys = new SysMysql();
	private SysSql Sql_sys = new SysSql();
	private MD5 md5 = new MD5();
	private Cookies cookie = new Cookies();
	private XhLog log = new XhLog();
	private String inputPath;
    private String fileName;
    private static Map<String, String> monitorMap=new HashMap<String, String>();
    private static ArrayList<Map<String, Object>> monitorList=new ArrayList<Map<String,Object>>();
    protected final Log log4j = LogFactory.getLog(BsStationAction.class);
    private  int allNetStopSendSwitch; //全网禁发开关
    private  static int moniSwitch=0; //模拟接入开关
    
    private int a2denable=0;

	private MessageStruct header = new MessageStruct();
	private SendData send = new SendData();
	private WebFun func=new WebFun();
	private FlexJSON json = new FlexJSON();
	

	//系统告警
	public void systemAlarm() throws Exception{
		String sql="select * from xhdigital_alarm order by time desc";
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
		
	}
	//系统告警
	public void ignoreSystemAlarm() throws Exception{
		String sql="select * from xhdigital_alarm where `ignore`=0";
		ArrayList data = Sql_sys.DBList(sql);

		HashMap result = new HashMap();
		result.put("items", data);
		result.put("total", data.size());
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType(
				"text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
		
	}
	public void addLimitBs(int tag,int bs){
		
		String sql="";
		if(tag==0){
			sql="delete from xhdigital_smsbsnotalarm where bsId="+bs;
		}else{
			sql="insert into xhdigital_smsbsnotalarm(bsId)values("+bs+")";
		}
		
		
		try {
			Sql_sys.Update(sql);
			this.success=true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	//忽略告警
	public String ignoreBtn() throws Exception{
		String sql="update xhdigital_alarm set `ignore`='"+ignore+"' where type='"+bsType+"' and alarmId='"+bsId+"'";
		Sql_sys.Update(sql);
		addLimitBs(ignore, bsId);
		IndexDwr.alarmDwr();
		this.success=true;
		return SUCCESS;
	}
	//删除告警
	public String delAlarmBtn() throws Exception{
		String sql="delete from xhdigital_alarm where alarmId='"+bsId+"'";
		Sql_sys.Update(sql);
		this.success=true;
		IndexDwr.alarmDwr();
		return SUCCESS;
	}	
	//强拆
	public String breakCall(){
		header.setCallID(callid);
		pttid=Integer.parseInt(func.readXml("call", "pptId"));
		BreakCallStruct breakCallStruct=new BreakCallStruct();
		breakCallStruct.setSrcid(srcid);
		breakCallStruct.setTarid(tarid);
		breakCallStruct.setPttid(pttid);
		try {
			if(TcpKeepAliveClient.getSocket().isConnected()){
			TcpKeepAliveClient.setM_calling(1);
			send.CallREQ(header,TrunkCommon.CallType.F_DISCONNECT,breakCallStruct);
			
		    /*Thread.sleep(3000);*/
		   /* TcpKeepAliveClient.setM_calling(0);*/
			this.success=true;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
	public String breakAndKill(){
		header.setCallID(callid);
		pttid=Integer.parseInt(func.readXml("call", "pptId"));
		BreakCallStruct breakCallStruct=new BreakCallStruct();
		breakCallStruct.setSrcid(srcid);
		breakCallStruct.setTarid(tarid);
		breakCallStruct.setPttid(pttid);
		try {
			if(TcpKeepAliveClient.getSocket().isConnected()){
			/*send.CallREQ(header,TrunkCommon.CallType.F_DISCONNECT,breakCallStruct);
			Thread.sleep(3000);*/
			send.DataREQ(header, srcid,0,TrunkCommon.DeviceType.MS,TrunkCommon.DataType.STUN);
			log.writeLog(4, "遥晕电台：" + srcid, "");
			this.success=true;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String ReadDBREQ() {
		setMessageHeader();
		try {
			send.ReadDBREQ(header, table);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.success = true;
		return SUCCESS;
	}
	public String startMonitor(){
		HttpServletRequest request =ServletActionContext.getRequest();
		ArrayList list=new ArrayList();
		Map map=new HashMap();
		
		map.put("ip", func.getIpAddr(request));
		map.put("group", tarid);
		
		monitorList.add(map);
		log4j.info("monitor-open:"+monitorList);
		return SUCCESS;
	}
	public String closeMonitor(){
		HttpServletRequest request =ServletActionContext.getRequest();
		String ip=func.getIpAddr(request);
		if(monitorList!=null){
			Iterator<Map<String,Object>> it=monitorList.iterator();
			while(it.hasNext()){
				Map<String,Object> map=it.next();
				if(map.get("ip").toString().equals(ip)){
					it.remove();
				}
			}
		}
		log4j.info("monitor-close:"+monitorList);
		return SUCCESS;
	}

	// 添加集群基站
	public String addBsStation() throws Exception {
		String sql = "select id from basestation where id=" + id;
		String sql2 = "insert into basestation(id,sysidcode,colorcode,sleepen,ip,startwatchdog,channelno,"
				+ "slot0authority,slot1authority,aietype,up,mask,sf,wt,reg,backoff,name,rf_transmit_en,"
				+ "rf_receive_en,offlinech,offlinerepeaten,admode,aduiorecvport,wan_en,wan_centerip,wan_centerport,"
				+ "wan_switchip,wan_switchport,gpsnum_delay,issimulcast,gpsunlock_worken,"
				+ "mcsrcen,msodisconn_worken,bsdisconn_worken,rssi_ceiling)VALUES("
				+ id+ ",'"+ sysidcode+ "','"+ colorcode+ "','"+ sleepen
				+ "','"+ ip+ "',"+ "'"+ startwatchdog
				+ "','"+ (Integer.parseInt(channelno)-1)
				+ "','"+ slot0authority+ "','"+ slot1authority+ "',"+ "'"+ aietype
				+ "','"+ up+ "','"+ mask+ "','"+ sf+ "','"+ wt
				+ "','"+ reg+ "','"+ backoff+ "',"+ "'"+ name
				+ "','"+ rf_transmit_en + "','" + rf_receive_en + "','"+(Integer.parseInt(offlinech)-1)+"','"+offlinerepeaten+"','"+admode+"','"+aduiorecvport+"',"
				+ "'"+wan_en+"','"+wan_centerip+"','"+wan_centerport+"','"+wan_switchip+"',"
				+ "'"+wan_switchport+"','"+gpsnum_delay+"','"+issimulcast+"','"+gpsunlock_worken+"',"
				+ "'"+mcsrcen+"','"+msodisconn_worken+"','"+bsdisconn_worken+"','"+rssi_ceiling+"')";
		if (Sql.exists(sql)) {
			this.message = "该ID已经存在";
			this.success = false;

		} else {
			Sql.Update(sql2);
			this.message = "集群基站添加成功";
			log.writeLog(1, "集群基站添加成功：" + this.id, "");
			if (TcpKeepAliveClient.getSocket().isConnected()) {
				Thread.sleep(100);
				send.UpdateBSREQ(header, id,0);
				Thread.sleep(200);
				BSStatusREQ(func.StringToInt(id));
			}
			this.success = true;

		}
		return SUCCESS;
	}

	// 修改集群基站
	public String updateBsStation() throws Exception {
		String sql = "update basestation set sysidcode='" + sysidcode
				+ "',colorcode='" + colorcode + "'," + "sleepen=" + sleepen
				+ ",ip='" + ip + "',startwatchdog='" + startwatchdog
				+ "',channelno='" +(Integer.parseInt(channelno)-1) + "'," + "slot0authority='"
				+ slot0authority + "',slot1authority='" + slot1authority + "',"
				+ "aietype='" + aietype + "',up='" + up + "',mask='" + mask
				+ "',sf='" + sf + "',wt='" + wt + "',reg='" + reg + "',"
				+ "backoff='" + backoff + "',name='" + name
				+ "',rf_transmit_en='" + rf_transmit_en + "',"
				+ "rf_receive_en='" + rf_receive_en + "',offlinech='"+(Integer.parseInt(offlinech)-1) +"',"
				+ "offlinerepeaten='"+offlinerepeaten+"',admode='"+admode+"',aduiorecvport='"+aduiorecvport+"',"
				+ "gpsnum_delay='"+gpsnum_delay+"',wan_en='"+wan_en+"',wan_centerip='"+wan_centerip+"',"
				+ "wan_centerport='"+wan_centerport+"',wan_switchip='"+wan_switchip+"',wan_switchport='"
				+wan_switchport+"',issimulcast='"+issimulcast+"',gpsnum_delay='"+gpsnum_delay+"',"
				+ "gpsunlock_worken='"+gpsunlock_worken+"',mcsrcen='"+mcsrcen+"',"
				+ "msodisconn_worken='"+msodisconn_worken+"',bsdisconn_worken='"+bsdisconn_worken+"',rssi_ceiling='"+rssi_ceiling+"'  where id=" + id;
		//String sql2="update";
		Sql.Update(sql);

		//setMessageHeader();
		//send.ReadDBREQ(header, "basestation");
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			send.UpdateBSREQ(header, id,2);
			BSStatusREQ(func.StringToInt(id));
		}
		this.message = "修改集群基站成功";
		this.success = true;
		return SUCCESS;

	}
	//全网禁发
	public String AllNetStopSendBtnSta(){
		allNetStopSendSwitch=Integer.parseInt(func.readXml("option", "net-stopsend-en"));
		if(TcpKeepAliveClient.getSocket().isConnected()){
			try {
				send.A2DEnableREQ(header);
				Thread.sleep(1000);
				a2denable=this.moniSwitch;
				log4j.info("模拟接入回执："+a2denable);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		/*moniSwitch=Integer.parseInt(func.readXml("option", "monien"));*/
		this.success = true;
		return SUCCESS;
	}
	//允许模拟接入
	public String OpenMoni() throws Exception{	
		if(TcpKeepAliveClient.getSocket().isConnected()){
			send.SetA2DEnable(header,1);
			this.success=true;
		}else{
			this.success=false;
		}
		
		
		return SUCCESS;
	}
	//禁止模拟接入
	public String CloseMoni() throws Exception{		
		if(TcpKeepAliveClient.getSocket().isConnected()){
			send.SetA2DEnable(header,0);
			this.success=true;
		}else{
			this.success=false;
		}
		return SUCCESS;
	}
	public String OpenAllNetStopSend() throws Exception{
		String sql = "update basestation set sleepen=0";
		String sql2 = "update xhdigital_bs_sta set rf_send=0";
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			Sql.Update(sql);
			Sql_sys.Update(sql2);
			//send.UpdateBSREQ(header, Sql.BsId(),2);
			String[] str=Sql.BsId().split(",");
			for (String string : str) {
				send.BSControl(header, Integer.parseInt(string), "0",
						TrunkCommon.BSControl.TYPE.SLEEP);
			}
			log.writeLog(4, "开启全网禁发", "");
			func.updateXML("option", "net-stopsend-en","1");
			this.success = true;
		}
		
		return SUCCESS;
	}
	public String CloseAllNetStopSend() throws Exception{
		String sql = "update basestation set sleepen=1";
		String sql2 = "update xhdigital_bs_sta set rf_send=1";
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			Sql.Update(sql);
			Sql_sys.Update(sql2);
			//send.UpdateBSREQ(header, Sql.BsId(),2);
			String[] str=Sql.BsId().split(",");
			for (String string : str) {
				send.BSControl(header, Integer.parseInt(string), "1",
						TrunkCommon.BSControl.TYPE.SLEEP);
			}
			func.updateXML("option", "net-stopsend-en","0");
			log.writeLog(4, "关闭全网禁发", "");
			this.success = true;
		}
		
		return SUCCESS;
	}
	//修改基站射频仅上行
	public String updateBsRfup() throws Exception {
		String sql = "update basestation set sleepen=0,rf_receive_en=1  where id=" + id;
		Sql.Update(sql);

		//setMessageHeader();
		//send.ReadDBREQ(header, "basestation");
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			send.UpdateBSREQ(header, id,2);
			BSStatusREQ(func.StringToInt(id));
		}
		this.message = "设置成功";
		this.success = true;
		return SUCCESS;

	}
	//修改基站射频仅下行
	public String updateBsRfdown() throws Exception,NullPointerException {
		String sql="",sql1="",sql3="",sql4="";
		String[]  idstr=bsIds.split(",");
		ArrayList<Integer> list1=new ArrayList<Integer>();
		ArrayList<Integer> list2=bsa();
		ArrayList<Integer> list3=new ArrayList<Integer>();
		ArrayList<Integer> list11=new ArrayList<Integer>();
		 String bsid="";
		if (bsIds.length()>0) {
			for (int i = 0; i < idstr.length; i++) {
				list1.add(Integer.parseInt(idstr[i]));
				list11.add(Integer.parseInt(idstr[i]));
			}
			list1.removeAll(list2);
			list2.addAll(list1);
			list11.retainAll(bsa());
			list2.removeAll(list11);
			 for (int i = 0; i < list2.size(); i++) {
				 bsid+=list2.get(i)+",";
			}
			sql = "update basestation set rf_receive_en=0  where id in("+bsIds+")";
			sql1 = "update basestation set  rf_receive_en=1  where id not in("+bsIds+")";
			sql3 = "update xhdigital_bs_sta set rf_recv=0  where bsId in("+bsIds+")";
			sql4 = "update xhdigital_bs_sta set rf_recv=1  where bsId not in("+bsIds+")";
			Sql.Update(sql);Sql.Update(sql1);Sql_sys.Update(sql3);Sql_sys.Update(sql4);
			log.writeLog(4, "禁止基站发射："+bsIds, "");
		}else {
			
			list1.removeAll(list2);
			list2.addAll(list1);
			list11.retainAll(bsa());
			list2.removeAll(list11);
			
			 for (int i = 0; i < list2.size(); i++) {
				 bsid+=list2.get(i)+",";
			}
			sql1 = "update basestation set  rf_receive_en=1 ";
			sql4 = "update xhdigital_bs_sta set rf_recv=1 ";
			Sql.Update(sql1);Sql_sys.Update(sql4);
		}
		
	

		if (TcpKeepAliveClient.getSocket().isConnected()) {
			send.UpdateBSREQ(header, bsid,2);
			log4j.debug("bsid-->"+bsid);
			//BSStatusREQ(func.StringToInt(id));
		}
		
		 //并集
		  //list1.addAll(list2);
		  //交集
		  //list1.retainAll(list2);
		  //差集
		  //list1.removeAll(list2);
		  //无重复并集
		   // list2.removeAll(list1);
		   // list1.addAll(list2);
		
		
		/*if (bsIds!="") {
			if (bsmang==0) {				
				sql = "update basestation set sleepen=0,rf_receive_en=1  where id in("+bsIds+")";
				sql1 = "update basestation set sleepen=1  where id not in("+bsIds+")";
				sql3 = "update xhdigital_bs_sta set rf_send=0,rf_recv=1  where bsId in("+bsIds+")";
				sql4 = "update xhdigital_bs_sta set rf_recv=1  where bsId not in("+bsIds+")";
				Sql.Update(sql);Sql.Update(sql1);Sql_sys.Update(sql3);Sql_sys.Update(sql4);
				log.writeLog(4, "禁止基站发射："+bsIds, "");
			
			}else if (bsmang==1) {
				sql = "update basestation set sleepen=1,rf_receive_en=0  where id in("+bsIds+")";
				sql1 = "update basestation set  rf_receive_en=1  where id not in("+bsIds+")";
				sql3 = "update xhdigital_bs_sta set rf_send=1,rf_recv=0  where bsId in("+bsIds+")";
				sql4 = "update xhdigital_bs_sta set rf_send=1  where bsId not in("+bsIds+")";
				Sql.Update(sql);Sql.Update(sql1);Sql_sys.Update(sql3);Sql_sys.Update(sql4);
				log.writeLog(4, "禁止基站接收："+bsIds, "");
			}else {
				sql = "update basestation set sleepen=1,rf_receive_en=1  where id in("+bsIds+")";
				sql3 = "update xhdigital_bs_sta set rf_send=1,rf_recv=1  where bsId in("+bsIds+")";
				Sql.Update(sql);Sql_sys.Update(sql3);
				log.writeLog(4, "允许基站发射，接收："+bsIds, "");
			}
			
			
			//log.writeLog(4, "限制基站" + bsIds+":"+bsmang, "");
		}*/
		
		
		this.message = "设置成功";
		this.success = true;
		return SUCCESS;

	}
	public ArrayList<Integer> bsa(){
		String sql="select id from basestation where rf_receive_en=0"; 
		Connection conn=db.getConn();
		Statement stmt;
		ArrayList<Integer> list=new ArrayList<Integer>();
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				list.add(rst.getInt("id"));
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}
	//修改基站射频上下行
	public String updateBsRfupdown() throws Exception {
		String sql = "update basestation set sleepen=1,rf_receive_en=1  where id=" + id;
		Sql.Update(sql);

		//setMessageHeader();
		//send.ReadDBREQ(header, "basestation");
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			send.UpdateBSREQ(header, id,2);
			BSStatusREQ(func.StringToInt(id));
		}
		this.message = "设置成功";
		this.success = true;
		return SUCCESS;

	}

	// 删除集群基站
	public String delBsStation() throws Exception {
		String[] ids = this.deleteIds.split(",");
		for (int i = 0; i < ids.length; i++) {
			String sql = "delete from basestation where id=" + ids[i];
			String sql2 = "delete from xhdigital_bs_sta where bsId=" + ids[i];
			//String sql3 = "delete from xhdigital_bs_control where bsId="+ ids[i];
			Sql.Update(sql);
			Sql_sys.Update(sql2);
			//Sql_sys.Update(sql3);
		}
		/*setMessageHeader();
		send.ReadDBREQ(header, "basestation");*/
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			Thread.sleep(200);
			send.UpdateBSREQ(header,this.deleteIds,1);
			
		}
		this.success = true;
		return SUCCESS;
	}

	//同步基站状态
	public String BsStatusAll(){
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			try {
				send.BSStatusREQ(header, -1);
				try {
					Thread.sleep(4000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				this.success=true;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return SUCCESS;
	}
	// 遥测基站
	public String bs_status() throws Exception, IOException {
		int model=Sql.bsId_model(Integer.parseInt(id));
		int chan=Sql.bsId_channelno(Integer.parseInt(id));
		String u1="update xhdigital_bs_sta set bsName='"+Sql.bsId_bsName(Integer.parseInt(id)) +"'"
				+ " ,model='"+model+"',channelno='"+chan+"' where bsId="+id;
		try {
			Sql_sys.Update(u1);
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		if(TcpKeepAliveClient.getSocket().isConnected()){
			clearConData();
			send.BSControl(header, Integer.parseInt(id),"cmdsetptt:1;", TrunkCommon.BSControl.TYPE.STATUS);
			Thread.sleep(1500);
			send.BSControl(header, Integer.parseInt(id),"cmdgetstatus;", TrunkCommon.BSControl.TYPE.STATUS);
			Thread.sleep(500);
			send.BSControl(header, Integer.parseInt(id),"cmdsetptt:0;", TrunkCommon.BSControl.TYPE.STATUS);
			this.success = true;
			//SocketDwr.BsControlDwr();
		}else {
			this.success =false;
		}
		return SUCCESS;
	}

	// 遥测所有基站
	public String bs_status_all() throws Exception, IOException {
		String sql = "select bsId from xhdigital_bs_sta  order by bsId asc";
		Connection conn = db_sys.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		if(TcpKeepAliveClient.getSocket().isConnected()){
			   clearConData();
				ArrayList<bsStatusStruct> list=new ArrayList<bsStatusStruct>();
				while(rst.next()){
					bsStatusStruct bStruct=new bsStatusStruct();
					bStruct.setBsId(rst.getInt("bsId"));
					list.add(bStruct);
				}
				
				//打开PPT
				for (bsStatusStruct bsStatusStruct : list) {				
					send.BSControl(header,bsStatusStruct.getBsId(),"cmdsetptt:1;", TrunkCommon.BSControl.TYPE.STATUS);
				}
				Thread.sleep(300);
				//遥测所有基站
				for (bsStatusStruct bsStatusStruct : list) {				
					send.BSControl(header,bsStatusStruct.getBsId(),"cmdgetstatus;",TrunkCommon.BSControl.TYPE.STATUS);
				}
				//关闭PPT
				for (bsStatusStruct bsStatusStruct : list) {				
					send.BSControl(header,bsStatusStruct.getBsId(),"cmdsetptt:0;", TrunkCommon.BSControl.TYPE.STATUS);
				}
				
			}	
		//SocketDwr.BsControlDwr();
		rst.close();
		stmt.close();
		conn.close();
		this.success = true;
		return SUCCESS;
	}

	// 设置信道号
	public String bsCHNum() throws Exception, IOException {
		String[] ids=bsIds.split(",");
		String sql="",sql2="";
		for (int i = 0; i < ids.length; i++) {
			String str = send.BSControl(header, Integer.parseInt(ids[i]), "cmdsetch:"
					+ (number - 1) + ";", TrunkCommon.BSControl.TYPE.STATUS);
			sql="update basestation set  channelno='"+(number-1)+"' where id="+ids[i];
			sql2="update xhdigital_bs_sta set  channelno='"+number+"' where bsId="+ids[i];
			Sql.Update(sql);
			Sql_sys.Update(sql2);
			HashMap result = new HashMap();
			result.put("bsId", Integer.parseInt(ids[i]));
			result.put("channelno", number);
			String jsonstr = json.Encode(result);
			log4j.info("设置信道号："+ids[i]+":"+number);
			SocketDwr.BsChannelno(jsonstr);
			
			HashMap info = new HashMap();
			info.put("content", "操作：设置"+ids[i]+"号基站联网信道号为"+(number));
			info.put("status", 2);
			info.put("time", func.nowDate());
			TcpKeepAliveClient.getBsInfoList().add(info);
			SocketDwr.bsInfoDwr();
			
			log.writeLog(4, "操作：设置"+ids[i]+"号基站联网信道号为"+(number), "");
			
			Thread.sleep(200);
		}
		
		this.success = true;
		return SUCCESS;
	}
	// 复位基站
    public String resetBs() throws Exception, IOException {
			String[] ids=bsIds.split(",");
			String sql="",sql2="";
			if(TcpKeepAliveClient.getSocket().isConnected()){
				for (int i = 0; i < ids.length; i++) {
					String str = send.BSControl(header, Integer.parseInt(ids[i]), "cmdsetrst:"
							+ ";", TrunkCommon.BSControl.TYPE.STATUS);
					HashMap result = new HashMap();
					result.put("bsId", Integer.parseInt(ids[i]));
					String jsonstr = json.Encode(result);
					log4j.info("复位基站："+ids[i]+":"+number);
					//SocketDwr.BsChannelno(jsonstr);
					
					HashMap info = new HashMap();
					info.put("content", "操作：复位"+ids[i]+"号基站");
					info.put("status", 2);
					info.put("time", func.nowDate());
					TcpKeepAliveClient.getBsInfoList().add(info);
					SocketDwr.bsInfoDwr();
					
					log.writeLog(4, "操作：复位"+ids[i]+"号基站", "");
					
					Thread.sleep(200);
				}
				this.success = true;
				
			}else{
				this.success=false;
				this.message="TCP连接中断";
			}
			
			
			
			return SUCCESS;
		}
/*	public String bsCHNum() throws Exception, IOException {
		String str = send.BSControl(header, Integer.parseInt(id), "cmdsetch:"
				+ (number - 1) + ";", TrunkCommon.BSControl.TYPE.STATUS);
		if (str.equals("OK")) {
			this.success = true;
			String sql="update basestation set  channelno='"+(number-1)+"' where id="+Integer.parseInt(id);
			Sql.Update(sql);
			HashMap result = new HashMap();
			result.put("bsId", Integer.parseInt(id));
			result.put("channelno", number);
			String jsonstr = json.Encode(result);
			log4j.info("设置信道号："+id+":"+number);
			SocketDwr.BsChannelno(jsonstr);
			
			HashMap info = new HashMap();
			info.put("content", "操作：设置"+id+"号基站联网信道号为"+(number));
			info.put("status", 2);
			info.put("time", func.nowDate());
			TcpKeepAliveClient.getBsInfoList().add(info);
			SocketDwr.bsInfoDwr();
			
			log.writeLog(4, "操作：设置"+id+"号基站联网信道号为"+(number), "");
			
			
			
		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}*/

	// 设定功率
	public String bs_power_set() throws Exception, IOException {
		String str = send.BSControl(header, Integer.parseInt(id), String
				.valueOf(power), TrunkCommon.BSControl.TYPE.PWSET);
		if (str.equals("OK")) {
			this.success = true;
			HashMap info = new HashMap();
			info.put("content", "操作：设置"+id+"号基站功率为"+power+"W");
			info.put("status", 2);
			info.put("time", func.nowDate());
			TcpKeepAliveClient.getBsInfoList().add(info);
			SocketDwr.bsInfoDwr();
			log.writeLog(4, "操作：设置"+id+"号基站功率为"+power+"W", "");
		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}

	// 功率标定
	public String bs_power_flag() throws Exception, IOException {
		send.getBsStruct().setNumber(number);
		String str = send.BSControl(header, Integer.parseInt(id), "",
				TrunkCommon.BSControl.TYPE.PWRELOAD);
		if (str.equals("OK")) {
			this.success = true;

		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}
	// 4G基站软件更新
	public String bs_update() throws Exception, IOException {
		send.getBsStruct().setNumber(number);
		String str = send.BSControl(header, Integer.parseInt(id), "",
				TrunkCommon.BSControl.TYPE.WANFTP);
		if (str.equals("OK")) {
			this.success = true;
			log.writeLog(4, "操作：更新4G基站"+id+"", "");
		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}

	// 获取基站经纬度
	public String bs_Lon_lat(int bsId) throws Exception, IOException {

		String str = send.BSControl(header, bsId, "",
				TrunkCommon.BSControl.TYPE.GPSDATA);
		if (str.equals("OK")) {
			this.success = true;

		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}

	// 打开基站电源
	public String bs_pow_on() throws Exception, IOException {

		String str = send.BSControl(header, Integer.parseInt(id),
				"cmdsetpow:1;", TrunkCommon.BSControl.TYPE.STATUS);
		if (str.equals("OK")) {
			this.success = true;
			HashMap info = new HashMap();
			info.put("content", "操作：打开"+id+"号基站电源");
			info.put("status", 2);
			info.put("time", func.nowDate());
			TcpKeepAliveClient.getBsInfoList().add(info);
			SocketDwr.bsInfoDwr();
			log.writeLog(4,  "操作：打开"+id+"号基站电源", "");
			send.BSControl(header, Integer.parseInt(id),
					"cmdgetstatus;", TrunkCommon.BSControl.TYPE.STATUS);
			

		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}

	// 关闭基站电源
	public String bs_pow_off() throws Exception, IOException {
		String str = send.BSControl(header, Integer.parseInt(id),
				"cmdsetpow:2;", TrunkCommon.BSControl.TYPE.STATUS);
		if (str.equals("OK")) {
			this.success = true;
			HashMap info = new HashMap();
			info.put("content", "操作：关闭"+id+"号基站电源");
			info.put("status", 2);
			info.put("time", func.nowDate());
			TcpKeepAliveClient.getBsInfoList().add(info);
			SocketDwr.bsInfoDwr();
			log.writeLog(4,  "操作：关闭"+id+"号基站电源", "");
			send.BSControl(header, Integer.parseInt(id),
					"cmdgetstatus;", TrunkCommon.BSControl.TYPE.STATUS);
		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}

	// 基站联网
	public String bs_net_on() throws Exception, IOException {

		String str = send.BSControl(header, Integer.parseInt(id), "1",
				TrunkCommon.BSControl.TYPE.SLEEP);
		if (str.equals("OK")) {
			this.success = true;
			String sql="update basestation set offlinerepeaten=0 where id="+id;
			String sql2="update xhdigital_bs_sta set offlinerepeaten=0";
			send.UpdateBSREQ(header, id,2);
			Sql.Update(sql);
			BSStatusREQ(func.StringToInt(id));
			//Sql_sys.Update(sql2);
		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}
	
	// 获取组播源
	public String mutiCastBsId() throws Exception, IOException {

		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log4j.info("获取组播源");
			send.MuticastSrcBSREQ(header, -1);
			this.success=true;
		}	
		return SUCCESS;
	}
	// 设置组播源
		public String updateMutiCastBsId() throws Exception, IOException {

			if (TcpKeepAliveClient.getSocket().isConnected()) {
				
				if (bsId>0) {
					send.MuticastSrcBSREQ(header, bsId);
					log4j.info("设置组播源基站："+bsId);
					this.success=true;
				}
				
			}	
			return SUCCESS;
		}


	// 基站脱网
	public String bs_net_off() throws Exception, IOException {
		String str = send.BSControl(header, Integer.parseInt(id), "0",
				TrunkCommon.BSControl.TYPE.SLEEP);
		if (str.equals("OK")) {
			this.success = true;
			String sql="update basestation set offlinerepeaten=1 where id="+id;
			Sql.Update(sql);
			send.UpdateBSREQ(header, id,2);
			BSStatusREQ(func.StringToInt(id));

		} else {
			this.success = false;
			this.message = str;
		}
		return SUCCESS;
	}
	//设置脱网信道
	public String bs_offnet_chan() throws Exception, IOException {
		String str="";
		if (bsType==0) {
			
			String sql="update basestation set  offlinech='"+(number-1)+"' where id="+Integer.parseInt(id);
			Sql.Update(sql);
			str = send.UpdateBSREQ(header, String.valueOf(id),2);
		}else {
		
			String sql="update basestation set  offlinech="+(number-1);
			Sql.Update(sql);
			str = send.UpdateBSREQ(header, Sql.BsId(),2);
		}
		
		if (str.equals("OK")) {
			this.success = true;

		} else {
			this.success = false;
			this.message = "TCP连接失败";
		}
		return SUCCESS;
	}
	
	//设置模数工作模式
	public String bs_admodel() throws Exception, IOException {
		String str="";
		ArrayList list=new ArrayList();
		
		if (bsType==0) {
			
			String sql="update basestation set  admode='"+number+"' where id="+Integer.parseInt(id);
			String sql2="update xhdigital_bs_sta set  model='"+number+"' where bsId="+Integer.parseInt(id);
			Sql.Update(sql);
			Sql_sys.Update(sql2);
			Thread.sleep(100);
			send.UpdateBSREQ(header,String.valueOf(id),2);
			HashMap result = new HashMap();
			HashMap tempmMap= new HashMap();
		
			result.put("bsId", id);
			result.put("model", number);
			result.put("linkModel", Sql_sys.bsId_linkModel(func.StringToInt(id)));
			result.put("online", Sql_sys.bsId_online(Integer.parseInt(id)));	
			result.put("status", Sql_sys.bsId_status(func.StringToInt(id)));
			result.put("offlinerepeaten", Sql_sys.bsId_offlinerepeaten(func.StringToInt(id)));
			list.add(result);
			
			tempmMap.put("items", list);
			String jsonstr = json.Encode(tempmMap);
			
			log4j.info("模数转换："+id+":"+number);
			log.writeLog(4, "操作：设置"+id+"号基站为"+(number==0?"模拟基站":"数字基站"), "");
			bsModelC(Integer.parseInt(id),number);
			this.success = true;
			this.message = "模数转换成功";
			SocketDwr.BsModel(jsonstr);
			
			HashMap info = new HashMap();
			info.put("content", "操作：设置"+id+"号基站为"+(number==0?"模拟基站":"数字基站"));
			info.put("status", 2);
			info.put("time", func.nowDate());
			TcpKeepAliveClient.getBsInfoList().add(info);
			SocketDwr.bsInfoDwr();
			
			
		}else {
			
			String sql="update basestation set  admode="+number;
			Sql.Update(sql);
			Thread.sleep(100);
			String bsIdString=Sql.BsId();
			str = send.UpdateBSREQ(header,bsIdString,2);
			String[] bsidStr=bsIdString.split(",");
			HashMap tempmMap= new HashMap();
			for (int i=0;i<bsidStr.length;i++) {
				HashMap result = new HashMap();			
				result.put("bsId",bsidStr[i]);
				result.put("model", number);
				result.put("linkModel", Sql_sys.bsId_linkModel(func.StringToInt(bsidStr[i])));
				result.put("online", Sql_sys.bsId_online(Integer.parseInt(bsidStr[i])));
				result.put("status", Sql_sys.bsId_status(func.StringToInt(bsidStr[i])));
				result.put("offlinerepeaten", Sql_sys.bsId_offlinerepeaten(func.StringToInt(id)));
				list.add(result);
				bsModelC(Integer.parseInt(bsidStr[i]),number);
			}
			tempmMap.put("items", list);
			String jsonstr = json.Encode(tempmMap);
			log4j.info("模数转换："+bsIdString+":"+number);
			this.success = true;
			this.message = "模数转换成功";
			SocketDwr.BsModel(jsonstr);
			
		
			
			
			
		}
		return SUCCESS;
	}
	public void bsModelC(int bsId,int model) throws Exception{
		String str="";
		if (model==0) {
			str="切换基站为模拟基站";
		}else {
			str+="切换基站为数字基站";
		}
		String sql="insert into xhdigital_bs_status(bsId,content,gps,time)"
				+ "values('"+bsId+"','"+str+"',2,'"+func.nowDate()+"')";
		Sql_sys.Update(sql);
	}
	//标记经度纬度
	public String LngLat(){
		String sql="update xhdigital_bs_sta set lng='"+lng+"',lat='"+lat+"' where bsId="+id;
		try {
			Sql_sys.Update(sql);
			this.success=true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
		
	}
	

	// 获取基站状态
	public String BSStatusREQ(int bsid) {
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			try {
				send.BSStatusREQ(header, bsid);
				this.success=true;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return SUCCESS;

	}
	public String bs_gps() throws Exception, IOException {
		String sql = "select id from basestation order by id asc";
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		
		if(TcpKeepAliveClient.getSocket().isConnected()){
				ArrayList<bsStatusStruct> list=new ArrayList<bsStatusStruct>();
				while(rst.next()){
					bsStatusStruct bStruct=new bsStatusStruct();
					bStruct.setBsId(rst.getInt("id"));
					list.add(bStruct);
				}
				for (bsStatusStruct bsStatusStruct : list) {
					send.BSControl(header, bsStatusStruct.getBsId(), "",TrunkCommon.BSControl.TYPE.GPSDATA);
					Thread.sleep(50);
				}
				//SocketDwr.BsControlDwr();
			}	
		rst.close();
		stmt.close();
		conn.close();
		this.success = true;
		return SUCCESS;
	}
	//删除基站通话记录
	public String delCallList(){
		String[] ids = this.deleteIds.split(",");
		for (int i = 0; i < ids.length; i++) {
			String sql = "delete from xhdigital_call where id=" + ids[i];
			try {
				Sql_sys.Update(sql);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		this.success = true;
		return SUCCESS;
		
	}
	//清空遥测数据
	public String clearConData(){
		String sql = "truncate table xhdigital_bs_control";
		try {
			Sql_sys.Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.success = true;
		return SUCCESS;
		
	}
    public String downFile() throws Exception {
    /*String path=this.inputPath.substring(1, this.inputPath.length());
    String[] dir=path.split("/");
    String downDir="/"+dir[0];*/
    String downloadDir = ServletActionContext.getServletContext().getRealPath("/resources/data");	 // 文件下载路径
    String downloadFile = ServletActionContext.getServletContext().getRealPath(inputPath); 
    File file = new File(downloadFile);	
    if(!file.exists())
    {
    	return null;
    }
    downloadFile = file.getCanonicalPath();// 真实文件路径,去掉里面的..等信息	 // 安全性
    if (!downloadFile.startsWith(downloadDir)) {
    return null;
    }
    return SUCCESS;
    }	/**
     * 提供转换编码后的供下载用的文件名
     * 
     * @return
     */
 
    @JSON(serialize=false) 
    public String getDownloadFileName() {
    String downFileName = fileName;
    try {
    downFileName = new String(downFileName.getBytes(), "ISO8859-1");
    } catch (UnsupportedEncodingException e) {
    e.printStackTrace();
    }
    return downFileName;
    }

	public void setMessageHeader() {
		header.setCMDId((short) 524); // 命令id
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

	public String getDeleteIds() {
		return deleteIds;
	}

	public void setDeleteIds(String deleteIds) {
		this.deleteIds = deleteIds;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSysidcode() {
		return sysidcode;
	}

	public void setSysidcode(String sysidcode) {
		this.sysidcode = sysidcode;
	}

	public String getColorcode() {
		return colorcode;
	}

	public void setColorcode(String colorcode) {
		this.colorcode = colorcode;
	}

	public String getSleepen() {
		return sleepen;
	}

	public void setSleepen(String sleepen) {
		this.sleepen = sleepen;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getStartwatchdog() {
		return startwatchdog;
	}

	public void setStartwatchdog(String startwatchdog) {
		this.startwatchdog = startwatchdog;
	}

	public String getChannelno() {
		return channelno;
	}

	public void setChannelno(String channelno) {
		this.channelno = channelno;
	}

	public String getSlot0authority() {
		return slot0authority;
	}

	public void setSlot0authority(String slot0authority) {
		this.slot0authority = slot0authority;
	}

	public String getSlot1authority() {
		return slot1authority;
	}

	public void setSlot1authority(String slot1authority) {
		this.slot1authority = slot1authority;
	}

	public String getAietype() {
		return aietype;
	}

	public void setAietype(String aietype) {
		this.aietype = aietype;
	}

	public String getUp() {
		return up;
	}

	public void setUp(String up) {
		this.up = up;
	}

	public String getMask() {
		return mask;
	}

	public void setMask(String mask) {
		this.mask = mask;
	}

	public String getSf() {
		return sf;
	}

	public void setSf(String sf) {
		this.sf = sf;
	}

	public String getWt() {
		return wt;
	}

	public void setWt(String wt) {
		this.wt = wt;
	}

	public String getReg() {
		return reg;
	}

	public void setReg(String reg) {
		this.reg = reg;
	}

	public String getBackoff() {
		return backoff;
	}

	public void setBackoff(String backoff) {
		this.backoff = backoff;
	}

	public String getNp() {
		return np;
	}

	public void setNp(String np) {
		this.np = np;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRf_transmit_en() {
		return rf_transmit_en;
	}

	public void setRf_transmit_en(String rfTransmitEn) {
		rf_transmit_en = rfTransmitEn;
	}

	public String getRf_receive_en() {
		return rf_receive_en;
	}

	public void setRf_receive_en(String rfReceiveEn) {
		rf_receive_en = rfReceiveEn;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public int getBsId() {
		return bsId;
	}

	public void setBsId(int bsId) {
		this.bsId = bsId;
	}

	public int getPower() {
		return power;
	}

	public void setPower(int power) {
		this.power = power;
	}

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
	}

	public String getAduiorecvport() {
		return aduiorecvport;
	}

	public void setAduiorecvport(String aduiorecvport) {
		this.aduiorecvport = aduiorecvport;
	}

	public String getOfflinech() {
		return offlinech;
	}

	public void setOfflinech(String offlinech) {
		this.offlinech = offlinech;
	}

	public String getOfflinerepeaten() {
		return offlinerepeaten;
	}

	public void setOfflinerepeaten(String offlinerepeaten) {
		this.offlinerepeaten = offlinerepeaten;
	}

	public String getAdmode() {
		return admode;
	}

	public void setAdmode(String admode) {
		this.admode = admode;
	}

	public int getBsType() {
		return bsType;
	}

	public void setBsType(int bsType) {
		this.bsType = bsType;
	}

	public String getInputPath() {
		return inputPath;
	}

	public void setInputPath(String inputPath) {
		this.inputPath = inputPath;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public InputStream getInputStream() throws Exception {	
		return ServletActionContext.getServletContext().getResourceAsStream(inputPath);
		
    }
	public static Map<String, String> getMonitorMap() {
		return monitorMap;
	}
	public static void setMonitorMap(Map<String, String> monitorMap) {
		BsStationAction.monitorMap = monitorMap;
	}
	public double getLng() {
		return lng;
	}
	public void setLng(double lng) {
		this.lng = lng;
	}
	public double getLat() {
		return lat;
	}
	public void setLat(double lat) {
		this.lat = lat;
	}
	public int getWan_en() {
		return wan_en;
	}
	public void setWan_en(int wan_en) {
		this.wan_en = wan_en;
	}
	public int getWan_centerport() {
		return wan_centerport;
	}
	public void setWan_centerport(int wan_centerport) {
		this.wan_centerport = wan_centerport;
	}
	public int getWan_switchport() {
		return wan_switchport;
	}
	public void setWan_switchport(int wan_switchport) {
		this.wan_switchport = wan_switchport;
	}
	public int getGpsnum_delay() {
		return gpsnum_delay;
	}
	public void setGpsnum_delay(int gpsnum_delay) {
		this.gpsnum_delay = gpsnum_delay;
	}
	public String getWan_centerip() {
		return wan_centerip;
	}
	public void setWan_centerip(String wan_centerip) {
		this.wan_centerip = wan_centerip;
	}
	public String getWan_switchip() {
		return wan_switchip;
	}
	public void setWan_switchip(String wan_switchip) {
		this.wan_switchip = wan_switchip;
	}
	public String getBsIds() {
		return bsIds;
	}
	public void setBsIds(String bsIds) {
		this.bsIds = bsIds;
	}
	public int getBsmang() {
		return bsmang;
	}
	public void setBsmang(int bsmang) {
		this.bsmang = bsmang;
	}
	public int getAllNetStopSendSwitch() {
		return allNetStopSendSwitch;
	}
	public void setAllNetStopSendSwitch(int allNetStopSendSwitch) {
		this.allNetStopSendSwitch = allNetStopSendSwitch;
	}
	public int getIssimulcast() {
		return issimulcast;
	}
	public void setIssimulcast(int issimulcast) {
		this.issimulcast = issimulcast;
	}

	public String getCallid() {
		return callid;
	}

	public void setCallid(String callid) {
		this.callid = callid;
	}

	public int getSrcid() {
		return srcid;
	}

	public void setSrcid(int srcid) {
		this.srcid = srcid;
	}

	public int getTarid() {
		return tarid;
	}

	public void setTarid(int tarid) {
		this.tarid = tarid;
	}

	public int getPttid() {
		return pttid;
	}

	public void setPttid(int pttid) {
		this.pttid = pttid;
	}

	public String getGpsunlock_worken() {
		return gpsunlock_worken;
	}

	public void setGpsunlock_worken(String gpsunlock_worken) {
		this.gpsunlock_worken = gpsunlock_worken;
	}

	public static int getMoniSwitch() {
		return moniSwitch;
	}

	public static void setMoniSwitch(int moniSwitch) {
		BsStationAction.moniSwitch = moniSwitch;
	}

	public int getA2denable() {
		return a2denable;
	}

	public void setA2denable(int a2denable) {
		this.a2denable = a2denable;
	}
	public int getIgnore() {
		return ignore;
	}
	public void setIgnore(int ignore) {
		this.ignore = ignore;
	}
	public String getMcsrcen() {
		return mcsrcen;
	}
	public void setMcsrcen(String mcsrcen) {
		this.mcsrcen = mcsrcen;
	}
	public String getMsodisconn_worken() {
		return msodisconn_worken;
	}
	public void setMsodisconn_worken(String msodisconn_worken) {
		this.msodisconn_worken = msodisconn_worken;
	}
	public String getBsdisconn_worken() {
		return bsdisconn_worken;
	}
	public void setBsdisconn_worken(String bsdisconn_worken) {
		this.bsdisconn_worken = bsdisconn_worken;
	}
	public String getRssi_ceiling() {
		return rssi_ceiling;
	}
	public void setRssi_ceiling(String rssi_ceiling) {
		this.rssi_ceiling = rssi_ceiling;
	}
	public static ArrayList<Map<String, Object>> getMonitorList() {
		return monitorList;
	}
	public static void setMonitorList(ArrayList<Map<String, Object>> monitorList) {
		BsStationAction.monitorList = monitorList;
	}


	
	

}
