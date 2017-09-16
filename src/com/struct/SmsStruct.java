package com.struct;

public class SmsStruct {
	private int srcId;
	private int tarid;
	private int ig;
	private String content;
	private int slot=1;
	private int sendseqnum=135;
	private int msgseqnum=135;
	
	
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
	public int getSendseqnum() {
		return sendseqnum;
	}
	public void setSendseqnum(int sendseqnum) {
		this.sendseqnum = sendseqnum;
	}
	public int getMsgseqnum() {
		return msgseqnum;
	}
	public void setMsgseqnum(int msgseqnum) {
		this.msgseqnum = msgseqnum;
	}
	
	

}
