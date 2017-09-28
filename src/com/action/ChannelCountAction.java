package com.action;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.func.FlexJSON;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;

public class ChannelCountAction extends ActionSupport{
	private boolean success;
	private String message;
	private int bsId;

	private FlexJSON json = new FlexJSON();
	private MessageStruct header=new MessageStruct();
	
	//获取当前bsId
	public void nowBs() throws SQLException {
		HashMap data = new HashMap();
		data.put("bsId",TcpKeepAliveClient.cbsId);
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
	//设置基站
	public String changeBsId(){
		if(TcpKeepAliveClient.getSocket().isConnected()){
			try {
				SendData.SetPTTStatsBS(header, bsId);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			this.success=true;
		}else{
			this.success=false;
			this.message="与中心连接断开，设置失败";
		}
		return SUCCESS;
	}
	public int getBsId() {
		return bsId;
	}
	public void setBsId(int bsId) {
		this.bsId = bsId;
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


}
