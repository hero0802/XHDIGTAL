package com.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.func.Cookies;
import com.func.XhLog;
import com.func.MD5;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.sql.XhMysql;
import com.sql.XhSql;

public class TalkGroupAction extends ActionSupport{
	private boolean success;
	private String message;
	private String deleteIds; //删除ID号
	private String ids; //删除ID号
	
	private int id;
    private String alias;
    private String type;
    private String callmode;
    private String priority;
    private String slot;
    private String maxcalltime;
    private int roamen;
    private String name;
    
    //归属基站
    private String homegroupid;
    private String basestationid;
    
    private String homegroupids;
    private String bsids;
    
    private String detachmentid;
    
    private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();
	
	private MessageStruct header=new MessageStruct();
	private SendData send=new SendData();
    
  //添加通话组
	public String addTalkGroup() throws Exception{
		String sql="select id from homegroup where id="+id;
		String sql2="insert into homegroup(id,alias,type,callmode,priority,slot,maxcalltime,roamen,name)VALUES(" +
				""+id+",'"+alias+"','"+type+"','"+callmode+"','"+priority+"','"+slot+"','"+maxcalltime+"'," +
				"'"+roamen+"','"+name+"')";
		if (Sql.exists(sql)) {
			this.message="该ID已经存在";
			this.success=false;
			
		} else {
			Sql.Update(sql2);
			this.message="通话组添加成功";
			log.writeLog(1, "通话组添加成功："+this.id, "");
			this.success=true;

		}
		return SUCCESS;
	}
	//获取通话组时隙
	public int slot(String msc){
		String sql="select slot from homegroup where id="+msc;
		Connection conn=db.getConn();
		Statement stmt;
		int  a=0;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);	
			while(rst.next()){
				a=rst.getInt("slot");
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return a;
	}
	//添加归属基站
	public String addTGBS() throws Exception{
		String[] groupid=homegroupids.split(",");
		String[] tsId=bsids.split(",");
		for (int i = 0; i < groupid.length; i++) {
			for (int j = 0; j < tsId.length; j++) {
				String sql = "select * from group_basestation_static where homegroupid='"
					+ groupid[i]
					+ "' and basestationid='"
					+ tsId[j]
					+ "'";
			    String sql2 = "insert into group_basestation_static(homegroupid,basestationid)VALUES("
					+ groupid[i] + "," + tsId[j] + ")";
			    if (!Sql.exists(sql)) {
			    	
			    	String sql3="delete from  group_basestation_static where "
			    			+ "basestationid ='"+tsId[j]+"' and homegroupid in(select id from homegroup where slot='"+slot(groupid[i])+"')";
			    	Sql.Update(sql3);
			    	Sql.Update(sql2);
					this.message = "归属基站添加成功";
					log.writeLog(1, "组归属基站添加成功：" + tsId[j], "");
					
				}
			}
		}
		
		setMessageHeader();
		send.ReadDBREQ(header, "group_basestation_static");
		this.success=true;
		
		return SUCCESS;
		
	/*	
		
		String sql="select * from group_basestation_static where homegroupid='"+homegroupid+"' and basestationid='"+basestationid+"'";
		String sql2="insert into group_basestation_static(homegroupid,basestationid)VALUES("+homegroupid+",'"+basestationid+"')";
		if (Sql.exists(sql)) {
			this.message="该归属基站已经存在";
			this.success=false;
			
		} else {
			Sql.Update(sql2);
			setMessageHeader();
			send.ReadDBREQ(header, "homegroup");
			this.message="归属基站添加成功";
			log.writeLog(1, "归属基站添加成功："+homegroupid, "");
			this.success=true;

		}
		return SUCCESS;*/
	}
	//添加支队
	public String addTGDem() throws Exception{
		String[] groupid=homegroupids.split(",");
		String[] tsId=ids.split(",");
		for (int i = 0; i < groupid.length; i++) {
			for (int j = 0; j < tsId.length; j++) {
				
			    String sql = "replace into homegroup_detachment_limit(homegroupid,detachmentid)VALUES("
					+ groupid[i] + "," + tsId[j] + ")";
			    Sql.Update(sql);
			    this.message = "添加支队成功";
				log.writeLog(1, "添加支队成功：" + tsId[j], "");
			}
		}
		
		setMessageHeader();
		send.ReadDBREQ(header, "group_basestation_static");
		this.success=true;
		
		return SUCCESS;
	}
	//修改通话组
	public String updateTalkGroup() throws Exception{
		String sql="update homegroup set alias='"+alias+"',type='"+type+"',callmode='"+callmode+"'," +
				"priority='"+priority+"',slot='"+slot+"',maxcalltime='"+maxcalltime+"'," +
		        "roamen='"+roamen+"',name='"+name+"' where id="+id;
		Sql.Update(sql);
		setMessageHeader();
		send.ReadDBREQ(header, "homegroup");
		this.message="修改通话组成功";
		this.success=true;
		return SUCCESS;
		
	}
	//删除通话组
	public String delTalkGroup() throws Exception{
		String[] ids=this.deleteIds.split(",");
		for(int i=0;i<ids.length;i++){
			String sql="delete from homegroup where id="+ids[i];
			Sql.Update(sql);
		}
		setMessageHeader();
		send.ReadDBREQ(header, "homegroup");
		this.success=true;
		return SUCCESS;
	}
	
	//删除通话组归属基站
	public String delTGBS() throws Exception{
		String sql="delete from group_basestation_static where homegroupid='"+homegroupid+"' and basestationid='"+basestationid+"'";
		Sql.Update(sql);
		setMessageHeader();
		send.ReadDBREQ(header, "homegroup");
		this.success=true;
		return SUCCESS;
	}
	  //添加通话组限制支队ID
	public String delDetachment() throws Exception{
			String sql="delete from homegroup_detachment_limit where homegroupid="+homegroupid+" and detachmentid="+detachmentid;

			Sql.Update(sql);
			this.message="删除限制支队["+detachmentid+"]成功";
			log.writeLog(3, "删除限制支队："+this.detachmentid, "");
			this.success=true;
			return SUCCESS;
		}
	public void setMessageHeader()
	{		
		header.setCMDId((short)524);    //  命令id
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
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getCallmode() {
		return callmode;
	}
	public void setCallmode(String callmode) {
		this.callmode = callmode;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getSlot() {
		return slot;
	}
	public void setSlot(String slot) {
		this.slot = slot;
	}
	public String getMaxcalltime() {
		return maxcalltime;
	}
	public void setMaxcalltime(String maxcalltime) {
		this.maxcalltime = maxcalltime;
	}
	public int getRoamen() {
		return roamen;
	}
	public void setRoamen(int roamen) {
		this.roamen = roamen;
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
	public String getBasestationid() {
		return basestationid;
	}
	public void setBasestationid(String basestationid) {
		this.basestationid = basestationid;
	}
	public String getHomegroupids() {
		return homegroupids;
	}
	public void setHomegroupids(String homegroupids) {
		this.homegroupids = homegroupids;
	}
	public String getBsids() {
		return bsids;
	}
	public void setBsids(String bsids) {
		this.bsids = bsids;
	}
	public String getDetachmentid() {
		return detachmentid;
	}
	public void setDetachmentid(String detachmentid) {
		this.detachmentid = detachmentid;
	}
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
    
    
    

}
