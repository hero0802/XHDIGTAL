package com.socket;

public class VoiceStruct {
	private short Header;   //帧头
	private String callid;  //会议ID  8
	private int srcid;   //主叫ID  3
	private int tarid;   //被叫   3
	private int pttid;   //当前呼叫ID  3
	private int ig;      //单呼/组呼  1
	private int frameid;  //音频帧号 1
	private String voice; // 27
	
	private String starttime;
	public short getHeader() {
		return Header;
	}
	public void setHeader(short header) {
		Header = header;
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
	public int getIg() {
		return ig;
	}
	public void setIg(int ig) {
		this.ig = ig;
	}
	public int getFrameid() {
		return frameid;
	}
	public void setFrameid(int frameid) {
		this.frameid = frameid;
	}
	public String getVoice() {
		return voice;
	}
	public void setVoice(String voice) {
		this.voice = voice;
	}
	public String getStarttime() {
		return starttime;
	}
	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}
	
	
	
	
	
	
	
	

}
