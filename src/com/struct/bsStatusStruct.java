package com.struct;

public class bsStatusStruct {
	/**
	 *
	 * 返回数据： 命令错误返回：COMMANDERROR; 
	 * 命令正确返回：
	 *  BS_Status:
	 *  1[信道机电源控制状态]:
	 *  2[交流 电源状态]:
	 *  3[信道机加电状态]:
	 *  4[信道机告警状 态]: 
	 *  5[BUSY 状态]:
	 *  6[PTT 状态]:
	 *  7[REP 状态]:
	 *  8[信 道]:
	 *  9[板上温度]:
	 *  10[直流电压]:
	 *  11[直流电流]:
	 *  12[发 射功率]:
	 *  13[接收场强]:
	 *  14[交流电压]:
	 *  15[反向功 率]:
	 *  16[外部温度]; 
	 *  返回值说明： [信道机电源控制状态]： 1 -- 开机； 2 -- 关机； 3 --手动控制。 
	 *  [交流电源状态]： 0 -- 无效； 1 – 有效。 
	 *  [信道机加电状态]： 0 -- 无效； 1 – 有效。 
	 *  [信道机告警状态]： 0 -- 无效； 1 – 有效。 
	 *  [BUSY 状态]： 0 -- 无效； 1 – 有效。 
	 *  [PTT 状态]：0。 [REP 状态]：0。 [信道]：    0 – 15。 
	 *  [直流电压]：以 100mV 为单位。
	 *   [直流电流]：以 A 为单位。 
	 *   [发射功率]：以 W 为单位。 
	 *   [接收场强]：以 dBm 为单位。
	 *    [交流电压]：以 V 为单位。 [反向功率]：以 W 为单位*/
	private int bsId;
	private int bsChannel_status;//1
	private int jI_status;//2
	private int channel_add_I_status;//3
	private int channel_alarm_status;//4
	private int busy_status;//5
	private int ptt_status;//6
	private int rep_status;//7
	private int channel_number;//8
	private int temp1;//9
	private int zV;//10
	private int zI;//11
	private int send_power;//12
	private int dB;//13
	private int jV;//14
	private int back_power;//15
	private int temp2;//16
	private int gps;
	private int sleep;
	private float longitude;
	private float latitude;
	private float height;
	private int starNum;
	
	private int number;
	public int getBsChannel_status() {
		return bsChannel_status;
	}
	public void setBsChannel_status(int bsChannelStatus) {
		bsChannel_status = bsChannelStatus;
	}
	public int getjI_status() {
		return jI_status;
	}
	public void setjI_status(int jIStatus) {
		jI_status = jIStatus;
	}
	public int getChannel_add_I_status() {
		return channel_add_I_status;
	}
	public void setChannel_add_I_status(int channelAddIStatus) {
		channel_add_I_status = channelAddIStatus;
	}
	public int getChannel_alarm_status() {
		return channel_alarm_status;
	}
	public void setChannel_alarm_status(int channelAlarmStatus) {
		channel_alarm_status = channelAlarmStatus;
	}
	public int getBusy_status() {
		return busy_status;
	}
	public void setBusy_status(int busyStatus) {
		busy_status = busyStatus;
	}
	public int getPtt_status() {
		return ptt_status;
	}
	public void setPtt_status(int pttStatus) {
		ptt_status = pttStatus;
	}
	public int getRep_status() {
		return rep_status;
	}
	public void setRep_status(int repStatus) {
		rep_status = repStatus;
	}
	public int getChannel_number() {
		return channel_number;
	}
	public void setChannel_number(int channelNumber) {
		channel_number = channelNumber;
	}
	public int getzV() {
		return zV;
	}
	public void setzV(int zV) {
		this.zV = zV;
	}
	public int getzI() {
		return zI;
	}
	public void setzI(int zI) {
		this.zI = zI;
	}
	public int getSend_power() {
		return send_power;
	}
	public void setSend_power(int sendPower) {
		send_power = sendPower;
	}
	public int getdB() {
		return dB;
	}
	public void setdB(int dB) {
		this.dB = dB;
	}
	public int getjV() {
		return jV;
	}
	public void setjV(int jV) {
		this.jV = jV;
	}
	public int getBack_power() {
		return back_power;
	}
	public void setBack_power(int backPower) {
		back_power = backPower;
	}
	
	public int getTemp1() {
		return temp1;
	}
	public void setTemp1(int temp1) {
		this.temp1 = temp1;
	}
	public int getTemp2() {
		return temp2;
	}
	public void setTemp2(int temp2) {
		this.temp2 = temp2;
	}
	public int getGps() {
		return gps;
	}
	public void setGps(int gps) {
		this.gps = gps;
	}
	public int getSleep() {
		return sleep;
	}
	public void setSleep(int sleep) {
		this.sleep = sleep;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public float getLongitude() {
		return longitude;
	}
	public void setLongitude(float longitude) {
		this.longitude = longitude;
	}
	public float getLatitude() {
		return latitude;
	}
	public void setLatitude(float latitude) {
		this.latitude = latitude;
	}
	public float getHeight() {
		return height;
	}
	public void setHeight(float height) {
		this.height = height;
	}
	public int getStarNum() {
		return starNum;
	}
	public void setStarNum(int starNum) {
		this.starNum = starNum;
	}
	public int getBsId() {
		return bsId;
	}
	public void setBsId(int bsId) {
		this.bsId = bsId;
	}
	
	

}
