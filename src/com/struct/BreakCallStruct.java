package com.struct;

public class BreakCallStruct {
	private int srcid;//主叫ID号
	private int tarid;//被叫ID号
	private int pttid;//当前主叫ID号

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

}
