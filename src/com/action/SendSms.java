package com.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.opensymphony.xwork2.ActionSupport;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.SmsStruct;

public class SendSms extends ActionSupport {
	private boolean success;
	private String message;

	private int srcId;
	private int tarid;
	private int ig;
	private int slot;
	private String content;

	private ArrayList srcidList;
	private ArrayList mscidList;

	private SmsStruct struct = new SmsStruct();
	private XhMysql db = new XhMysql();
	private XhSql Sql = new XhSql();

	private MessageStruct header = new MessageStruct();
	private SendData send = new SendData();

	public String sendSms() throws Exception {
		setMessageHeader();
		Content();
		if (send.SMS(header, struct).equals("OK")) {
			this.success = true;
			this.message = "OK";
		}

		return SUCCESS;

	}

	// 获取调度台Id
	public String srcId() throws SQLException {
		String sql = "select id,name from hometerminal where type=2 and id like '"
				+ srcId + "%'";
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		ArrayList data = new ArrayList();
		Map rowData;
		while (rst.next()) {
			rowData = new HashMap(2);
			rowData.put("id", rst.getInt("id"));
			rowData.put("name", rst.getString("name"));
			data.add(rowData);
		}
		rst.close();
		stmt.close();
		conn.close();
		this.success = true;
		this.srcidList = data;
		return SUCCESS;
	}

	// 获取mscId
	public String mscId() throws SQLException {
		String sql = "select id,name from hometerminal where type=0 and id like '"
				+ srcId + "%'";
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		ArrayList data = new ArrayList();
		Map rowData;
		while (rst.next()) {
			rowData = new HashMap(2);
			rowData.put("id", rst.getInt("id"));
			rowData.put("name", rst.getString("name"));
			data.add(rowData);
		}
		rst.close();
		stmt.close();
		conn.close();
		this.success = true;
		this.mscidList = data;
		return SUCCESS;
	}

	public void setMessageHeader() {
		header.setCMDId((short) 2); // 命令id
	}

	public void Content() {
		struct.setSrcId(srcId);
		struct.setIg(ig);
		struct.setTarid(tarid);
		struct.setSlot(slot);
		struct.setContent(content);
	}

	public int getSrcId() {
		return srcId;
	}

	public void setSrcId(int srcId) {
		this.srcId = srcId;
	}

	public int getTarid() {
		return tarid;
	}

	public void setTarid(int tarid) {
		this.tarid = tarid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

	public int getIg() {
		return ig;
	}

	public void setIg(int ig) {
		this.ig = ig;
	}

	public int getSlot() {
		return slot;
	}

	public void setSlot(int slot) {
		this.slot = slot;
	}

	public ArrayList getSrcidList() {
		return srcidList;
	}

	public void setSrcidList(ArrayList srcidList) {
		this.srcidList = srcidList;
	}

	public ArrayList getMscidList() {
		return mscidList;
	}

	public void setMscidList(ArrayList mscidList) {
		this.mscidList = mscidList;
	}

}
