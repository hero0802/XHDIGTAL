package com.action;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.func.FlexJSON;
import com.func.WebFun;
import com.opensymphony.xwork2.ActionSupport;
import com.smsnet.SmsTcp;
import com.sql.SysSql;

public class SmsAlarm extends ActionSupport{
	private boolean success;
	private String message;
	private String deleteIds; // 删除ID号
	
	private int id;
	private String bsids;
	private String phoneNumber;
	private String person;
	private int open;
	private String ip;
	private int port;
	private String centerNumber;
	private int bsoffTime;
	
	private FlexJSON json=new FlexJSON();
	private SysSql Sql=new SysSql();
	private WebFun func=new WebFun();
	
	//告警开关
	public String load(){
		open=func.StringToInt(func.readXml("Alarm", "open"));
		ip=func.readXml("sms", "ip");
		port=func.StringToInt(func.readXml("sms", "port"));
		centerNumber=func.readXml("sms", "number");
		bsoffTime=func.StringToInt(func.readXml("sms", "bsofftime"));
		this.success=true;
		return SUCCESS;
		
	}
	public String save(){
		if (bsoffTime<1) {
			bsoffTime=10;
		}		
		try {
			func.updateXML("Alarm", "open",String.valueOf(open));
			func.updateXML("sms", "ip",ip);
			func.updateXML("sms", "port",String.valueOf(port));
			func.updateXML("sms", "number",centerNumber);
			func.updateXML("sms", "bsofftime",String.valueOf(bsoffTime));
			this.success=true;
			if(SmsTcp.getSocket()!=null || !SmsTcp.getSocket().isClosed()){
				SmsTcp.getSocket().close();
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
		
	}
	
	//联系人列表
	public void poneList() throws Exception{
		String sql="select count(id) from xhdigital_phonebook";
		String sql2="select * from xhdigital_phonebook";
		ArrayList data = Sql.DBList(sql2);

		HashMap result=new HashMap();
		result.put("items", data);
		result.put("total", Sql.getCount(sql));
		String jsonstr = json.Encode(result);
		ServletActionContext.getResponse().setContentType("text/html;charset=UTF-8");
		ServletActionContext.getResponse().getWriter().write(jsonstr);
	}
	//添加联系人
	public String add(){
		String sql="select * from xhdigital_phonebook where phoneNumber="+phoneNumber;
		String sql2="insert into xhdigital_phonebook(phoneNumber,person)VALUES('"+phoneNumber+"','"+person+"')";
		try {
			if (Sql.exists(sql)) {
				this.message="手机号码已经存在";
				this.success=false;
			}else {
				Sql.Update(sql2);
				this.success=true;
				this.message="添加联系人成功";
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}
	//修改联系人
	public String update(){
		String sql="select * from xhdigital_phonebook where phoneNumber='"+phoneNumber+"' and id!="+id;
		String sql2="update xhdigital_phonebook set person='"+person+"',phoneNumber='"+phoneNumber+"' where id="+id;
		try {
			if (Sql.exists(sql)) {
				this.message="手机号码已经存在";
				this.success=false;
			}else {
				Sql.Update(sql2);
				this.message="修改联系人成功";
				this.success=true;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}
	//删除联系人
	public String del(){
		String[] ids=deleteIds.split(",");
		for (String string : ids) {
			String sql="delete from xhdigital_phonebook where id="+string;
			try {
				Sql.Update(sql);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		this.success=true;
		this.message="删除联系人成功";
	
		
		return SUCCESS;
	}
	//添加限制告警基站
	public String addLimitBs(){
		String[] bsIds=bsids.split(",");
		String sql="";
		String str="";
		for (int i=0;i<bsIds.length;i++) {
			if (i<bsIds.length-1) {
				str+="('"+bsIds[i]+"'),";
			}else {
				str+="('"+bsIds[i]+"')";
			}
		}
		sql="insert into xhdigital_smsbsnotalarm(bsId)values"+str;
		try {
			Sql.Update(sql);
			this.success=true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return SUCCESS;
	}
	//添加限制告警基站
		public String delLimitBs(){
			String sql="";
		
			sql="delete from xhdigital_smsbsnotalarm where bsId in ("+bsids+")";
			try {
				Sql.Update(sql);
				this.success=true;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return SUCCESS;
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
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getPerson() {
		return person;
	}
	public void setPerson(String person) {
		this.person = person;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getOpen() {
		return open;
	}
	public void setOpen(int open) {
		this.open = open;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getCenterNumber() {
		return centerNumber;
	}
	public void setCenterNumber(String centerNumber) {
		this.centerNumber = centerNumber;
	}
	public int getBsoffTime() {
		return bsoffTime;
	}
	public void setBsoffTime(int bsoffTime) {
		this.bsoffTime = bsoffTime;
	}
	public String getBsids() {
		return bsids;
	}
	public void setBsids(String bsids) {
		this.bsids = bsids;
	}
	
	

}
