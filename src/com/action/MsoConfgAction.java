package com.action;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.opensymphony.xwork2.ActionSupport;
import com.socket.MessageStruct;
import com.socket.SendData;
import com.sql.XhMysql;
import com.sql.XhSql;

public class MsoConfgAction extends ActionSupport {
	private boolean success;
	private String message;
	private String data;

	private int id;
	private String np;
	private String msoip;
	private String mso_domainname;
	private String msoip_vt1;
	private String msoip_vt2;
	private String port;
	private String swip;
	private String swport;
	private String swip_vt1;
	private String swip_vt2;
	private String recordip;
	private String recordport;
	private String audioconvertorip;
	private String monitorip;
	private String monitorport;
	private String msogateip;
	private String msogateport;
	private String applicationip;
	private String applicationport;
	private String tsccswitch_time;
	private String max_meet_time;
	private String max_ptton_time;
	private String max_pttoff_time;
	private String max_ptton_novoice_time;
	private String max_gcall_waittime;
	private String max_icall_waittime;
	private String max_queen_length;
	private String max_queen_waittime;
	private String pttoff_slotdelay_time;
	private String deactive_slotdelay_time;
	private String bs_reconn_center_time;
	private String voice_cache_num;
	private String groupcallmode;
	private String interfere_sampling_period;
	private String adv_authen;
	private String aucip;
	private String aucport;
	private String issimulcast;
	private String multicastip;
	private String multicastport;
	private String wait_rssi_time;
	private String rssil1_threshold;
	private String rssidiffl1_reselect;
	private String rssil2_threshold;
	private String rssidiffl2_reselect;
	private String cal_rssi_interval_time;
	private String unified_caller_number;
	private String mtuip;
	private String mtuport;
	private String e2ee_down;
	private String only_allow_encryptms;
	private String gpsen;
	private int key2;

	private XhMysql db = new XhMysql();
	private XhSql Sql = new XhSql();
	private MD5 md5 = new MD5();
	private Cookies cookie = new Cookies();
	private XhLog log = new XhLog();
	private FlexJSON json = new FlexJSON();
	private MessageStruct header = new MessageStruct();
	private SendData send = new SendData();

	// 修改配置文件
	public String updateMsoConfg() throws Exception {
		/* JSONArray jsonArray = JSONArray.fromObject(data); */
		/*
		 * JSONObject jsonObject = JSONObject.fromObject(data); MsoConfg stu =
		 * (MsoConfg)JSONObject.toBean(jsonObject, MsoConfg.class);
		 * System.out.println(stu.getId());
		 */
		String sql_s = "select id from systemconfig";
		String sql_u = "update systemconfig set msoip='" + msoip + "',"
				+ "msoip_vt1='" + msoip_vt1 + "',msoip_vt2='" + msoip_vt2
				+ "',port='" + port + "',swip='" + swip + "'," + "swport='"
				+ swport + "',swip_vt1='" + swip_vt1 + "',swip_vt2='"
				+ swip_vt2 + "',recordip='" + recordip + "'," + "recordport='"
				+ recordport + "',audioconvertorip='" + audioconvertorip
				+ "',monitorip='" + monitorip + "'," + "monitorport='"
				+ monitorport + "',msogateip='" + msogateip + "',msogateport='"
				+ msogateport + "'," + "applicationip='" + applicationip
				+ "',applicationport='" + applicationport
				+ "',tsccswitch_time='" + tsccswitch_time + "',"
				+ "max_meet_time='" + max_meet_time + "',max_ptton_time='"
				+ max_ptton_time + "',max_pttoff_time='" + max_pttoff_time
				+ "'," + "max_ptton_novoice_time='" + max_ptton_novoice_time
				+ "',max_gcall_waittime='" + max_gcall_waittime + "',"
				+ "max_icall_waittime='" + max_icall_waittime
				+ "',max_queen_length='" + max_queen_length + "',"
				+ "max_queen_waittime='" + max_queen_waittime
				+ "',pttoff_slotdelay_time='" + pttoff_slotdelay_time + "',"
				+ "deactive_slotdelay_time='" + deactive_slotdelay_time
				+ "',bs_reconn_center_time='" + bs_reconn_center_time + "',"
				+ "voice_cache_num='" + voice_cache_num + "',groupcallmode='"
				+ groupcallmode + "',interfere_sampling_period='"
				+ interfere_sampling_period + "'," + "adv_authen='"
				+ adv_authen + "',aucip='" + aucip + "',aucport='" + aucport
				+ "',issimulcast='" + issimulcast + "'," + "multicastip='"
				+ multicastip + "',multicastport='" + multicastport
				+ "',wait_rssi_time='" + wait_rssi_time + "',"
				+ "rssil1_threshold='" + rssil1_threshold
				+ "',rssidiffl1_reselect='" + rssidiffl1_reselect + "',"
				+ "rssil2_threshold='" + rssil2_threshold
				+ "',rssidiffl2_reselect='" + rssidiffl2_reselect + "',"
				+ "cal_rssi_interval_time='" + cal_rssi_interval_time + "',"
		        + "unified_caller_number='" + unified_caller_number + "',mtuip='"+mtuip+"',"
		        + "mtuport='"+mtuport+"',key2='"+key2+"',e2ee_down='"+e2ee_down+"',only_allow_encryptms='"+only_allow_encryptms+"'";

		String sql_i = "insert into systemconfig(msoip,msoip_vt1,msoip_vt2,port,swip,swport,swip_vt1,swip_vt2,recordip,recordport,"
				+ "audioconvertorip,monitorip,monitorport,msogateip,msogateport,applicationip,applicationport,"
				+ "tsccswitch_time,max_meet_time,max_ptton_time,max_pttoff_time,max_ptton_novoice_time,"
				+ "max_gcall_waittime,max_icall_waittime,max_queen_length,max_queen_waittime,"
				+ "pttoff_slotdelay_time,deactive_slotdelay_time,bs_reconn_center_time,voice_cache_num,"
				+ "groupcallmode,interfere_sampling_period,adv_authen,aucip,aucport,issimulcast,multicastip,"
				+ "multicastport,wait_rssi_time,rssil1_threshold,rssidiffl1_reselect,rssil2_threshold,"
				+ "rssidiffl2_reselect,cal_rssi_interval_time,unified_caller_number,mtuip,mtuport,key2,e2ee_down,only_allow_encryptms)VALUES('"
				+ msoip
				+ "','"
				+ msoip_vt1
				+ "','"
				+ msoip_vt2
				+ "','"
				+ port
				+ "','"
				+ swip
				+ "','"
				+ swport
				+ "','"
				+ swip_vt1
				+ "','"
				+ swip_vt2
				+ "','"
				+ recordip
				+ "','"
				+ recordport
				+ "','"
				+ audioconvertorip
				+ "','"
				+ monitorip
				+ "','"
				+ monitorport
				+ "','"
				+ msogateip
				+ "','"
				+ msogateport
				+ "','"
				+ applicationip
				+ "','"
				+ applicationport
				+ "','"
				+ tsccswitch_time
				+ "','"
				+ max_meet_time
				+ "','"
				+ max_ptton_time
				+ "','"
				+ max_pttoff_time
				+ "','"
				+ max_ptton_novoice_time
				+ "','"
				+ max_gcall_waittime
				+ "','"
				+ max_icall_waittime
				+ "','"
				+ max_queen_length
				+ "','"
				+ max_queen_waittime
				+ "','"
				+ pttoff_slotdelay_time
				+ "','"
				+ deactive_slotdelay_time
				+ "','"
				+ bs_reconn_center_time
				+ "','"
				+ voice_cache_num
				+ "','"
				+ groupcallmode
				+ "','"
				+ interfere_sampling_period
				+ "','"
				+ adv_authen
				+ "','"
				+ aucip
				+ "','"
				+ aucport
				+ "','"
				+ issimulcast
				+ "','"
				+ multicastip
				+ "','"
				+ multicastport
				+ "','"
				+ wait_rssi_time
				+ "','"
				+ rssil1_threshold
				+ "','"
				+ rssidiffl1_reselect
				+ "','"
				+ rssil2_threshold
				+ "','"
				+ rssidiffl2_reselect
				+ "','" + cal_rssi_interval_time + "','"+unified_caller_number+"','"+mtuip+"','"+mtuport+"','"+key2+"','"+e2ee_down+"','"+only_allow_encryptms+"')";

		if (Sql.exists(sql_s)) {
			Sql.Update(sql_u);
		} else {
			Sql.Update(sql_i);

		}

		setMessageHeader();
		send.ReadDBREQ(header, "systemconfig");
		this.message = "修改终端用户信息成功";
		this.success = true;
		return SUCCESS;

	}

	public String Key2(){
		String[] str1={"1","1","1","1","1","1","1","1","1","1"};
		List list = Arrays.asList(str1);
		List arrayList = new ArrayList(list);
		for (int i = 0; i < 14; i++) {
			int a=(int)(Math.random()*2);
			arrayList.add(a);
		}
		Collections.shuffle(arrayList);
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < arrayList.size(); i++) {
			sb.append(arrayList.get(i));
		}
		String afterShuffle = sb.toString();
		key2=Integer.parseInt(afterShuffle,2);
        /*System.out.println(afterShuffle);
        System.out.println(Integer.parseInt(afterShuffle,2));*/
		
		
		return SUCCESS;
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

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNp() {
		return np;
	}

	public void setNp(String np) {
		this.np = np;
	}

	public String getMsoip() {
		return msoip;
	}

	public void setMsoip(String msoip) {
		this.msoip = msoip;
	}

	public String getMso_domainname() {
		return mso_domainname;
	}

	public void setMso_domainname(String msoDomainname) {
		mso_domainname = msoDomainname;
	}

	public String getMsoip_vt1() {
		return msoip_vt1;
	}

	public void setMsoip_vt1(String msoipVt1) {
		msoip_vt1 = msoipVt1;
	}

	public String getMsoip_vt2() {
		return msoip_vt2;
	}

	public void setMsoip_vt2(String msoipVt2) {
		msoip_vt2 = msoipVt2;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getSwip() {
		return swip;
	}

	public void setSwip(String swip) {
		this.swip = swip;
	}

	public String getSwport() {
		return swport;
	}

	public void setSwport(String swport) {
		this.swport = swport;
	}

	public String getSwip_vt1() {
		return swip_vt1;
	}

	public void setSwip_vt1(String swipVt1) {
		swip_vt1 = swipVt1;
	}

	public String getSwip_vt2() {
		return swip_vt2;
	}

	public void setSwip_vt2(String swipVt2) {
		swip_vt2 = swipVt2;
	}

	public String getRecordip() {
		return recordip;
	}

	public void setRecordip(String recordip) {
		this.recordip = recordip;
	}

	public String getRecordport() {
		return recordport;
	}

	public void setRecordport(String recordport) {
		this.recordport = recordport;
	}

	public String getAudioconvertorip() {
		return audioconvertorip;
	}

	public void setAudioconvertorip(String audioconvertorip) {
		this.audioconvertorip = audioconvertorip;
	}

	public String getMonitorip() {
		return monitorip;
	}

	public void setMonitorip(String monitorip) {
		this.monitorip = monitorip;
	}

	public String getMonitorport() {
		return monitorport;
	}

	public void setMonitorport(String monitorport) {
		this.monitorport = monitorport;
	}

	public String getMsogateip() {
		return msogateip;
	}

	public void setMsogateip(String msogateip) {
		this.msogateip = msogateip;
	}

	public String getMsogateport() {
		return msogateport;
	}

	public void setMsogateport(String msogateport) {
		this.msogateport = msogateport;
	}

	public String getApplicationip() {
		return applicationip;
	}

	public void setApplicationip(String applicationip) {
		this.applicationip = applicationip;
	}

	public String getApplicationport() {
		return applicationport;
	}

	public void setApplicationport(String applicationport) {
		this.applicationport = applicationport;
	}

	public String getTsccswitch_time() {
		return tsccswitch_time;
	}

	public void setTsccswitch_time(String tsccswitchTime) {
		tsccswitch_time = tsccswitchTime;
	}

	public String getMax_meet_time() {
		return max_meet_time;
	}

	public void setMax_meet_time(String maxMeetTime) {
		max_meet_time = maxMeetTime;
	}

	public String getMax_ptton_time() {
		return max_ptton_time;
	}

	public void setMax_ptton_time(String maxPttonTime) {
		max_ptton_time = maxPttonTime;
	}

	public String getMax_pttoff_time() {
		return max_pttoff_time;
	}

	public void setMax_pttoff_time(String maxPttoffTime) {
		max_pttoff_time = maxPttoffTime;
	}

	public String getMax_ptton_novoice_time() {
		return max_ptton_novoice_time;
	}

	public void setMax_ptton_novoice_time(String maxPttonNovoiceTime) {
		max_ptton_novoice_time = maxPttonNovoiceTime;
	}

	public String getMax_gcall_waittime() {
		return max_gcall_waittime;
	}

	public void setMax_gcall_waittime(String maxGcallWaittime) {
		max_gcall_waittime = maxGcallWaittime;
	}

	public String getMax_icall_waittime() {
		return max_icall_waittime;
	}

	public void setMax_icall_waittime(String maxIcallWaittime) {
		max_icall_waittime = maxIcallWaittime;
	}

	public String getMax_queen_length() {
		return max_queen_length;
	}

	public void setMax_queen_length(String maxQueenLength) {
		max_queen_length = maxQueenLength;
	}

	public String getMax_queen_waittime() {
		return max_queen_waittime;
	}

	public void setMax_queen_waittime(String maxQueenWaittime) {
		max_queen_waittime = maxQueenWaittime;
	}

	public String getPttoff_slotdelay_time() {
		return pttoff_slotdelay_time;
	}

	public void setPttoff_slotdelay_time(String pttoffSlotdelayTime) {
		pttoff_slotdelay_time = pttoffSlotdelayTime;
	}

	public String getDeactive_slotdelay_time() {
		return deactive_slotdelay_time;
	}

	public void setDeactive_slotdelay_time(String deactiveSlotdelayTime) {
		deactive_slotdelay_time = deactiveSlotdelayTime;
	}

	public String getBs_reconn_center_time() {
		return bs_reconn_center_time;
	}

	public void setBs_reconn_center_time(String bsReconnCenterTime) {
		bs_reconn_center_time = bsReconnCenterTime;
	}

	public String getVoice_cache_num() {
		return voice_cache_num;
	}

	public void setVoice_cache_num(String voiceCacheNum) {
		voice_cache_num = voiceCacheNum;
	}

	public String getGroupcallmode() {
		return groupcallmode;
	}

	public void setGroupcallmode(String groupcallmode) {
		this.groupcallmode = groupcallmode;
	}

	public String getInterfere_sampling_period() {
		return interfere_sampling_period;
	}

	public void setInterfere_sampling_period(String interfereSamplingPeriod) {
		interfere_sampling_period = interfereSamplingPeriod;
	}

	public String getAdv_authen() {
		return adv_authen;
	}

	public void setAdv_authen(String advAuthen) {
		adv_authen = advAuthen;
	}

	public String getAucip() {
		return aucip;
	}

	public void setAucip(String aucip) {
		this.aucip = aucip;
	}

	public String getAucport() {
		return aucport;
	}

	public void setAucport(String aucport) {
		this.aucport = aucport;
	}

	public String getIssimulcast() {
		return issimulcast;
	}

	public void setIssimulcast(String issimulcast) {
		this.issimulcast = issimulcast;
	}

	public String getMulticastip() {
		return multicastip;
	}

	public void setMulticastip(String multicastip) {
		this.multicastip = multicastip;
	}

	public String getMulticastport() {
		return multicastport;
	}

	public void setMulticastport(String multicastport) {
		this.multicastport = multicastport;
	}

	public String getWait_rssi_time() {
		return wait_rssi_time;
	}

	public void setWait_rssi_time(String waitRssiTime) {
		wait_rssi_time = waitRssiTime;
	}

	public String getRssil1_threshold() {
		return rssil1_threshold;
	}

	public void setRssil1_threshold(String rssil1Threshold) {
		rssil1_threshold = rssil1Threshold;
	}

	public String getRssidiffl1_reselect() {
		return rssidiffl1_reselect;
	}

	public void setRssidiffl1_reselect(String rssidiffl1Reselect) {
		rssidiffl1_reselect = rssidiffl1Reselect;
	}

	public String getRssil2_threshold() {
		return rssil2_threshold;
	}

	public void setRssil2_threshold(String rssil2Threshold) {
		rssil2_threshold = rssil2Threshold;
	}

	public String getRssidiffl2_reselect() {
		return rssidiffl2_reselect;
	}

	public void setRssidiffl2_reselect(String rssidiffl2Reselect) {
		rssidiffl2_reselect = rssidiffl2Reselect;
	}

	public String getCal_rssi_interval_time() {
		return cal_rssi_interval_time;
	}

	public void setCal_rssi_interval_time(String calRssiIntervalTime) {
		cal_rssi_interval_time = calRssiIntervalTime;
	}

	public String getUnified_caller_number() {
		return unified_caller_number;
	}

	public void setUnified_caller_number(String unifiedCallerNumber) {
		unified_caller_number = unifiedCallerNumber;
	}

	public String getMtuip() {
		return mtuip;
	}

	public void setMtuip(String mtuip) {
		this.mtuip = mtuip;
	}

	public String getMtuport() {
		return mtuport;
	}

	public void setMtuport(String mtuport) {
		this.mtuport = mtuport;
	}

	public String getE2ee_down() {
		return e2ee_down;
	}

	public void setE2ee_down(String e2ee_down) {
		this.e2ee_down = e2ee_down;
	}

	public int getKey2() {
		return key2;
	}

	public void setKey2(int key2) {
		this.key2 = key2;
	}

	public String getOnly_allow_encryptms() {
		return only_allow_encryptms;
	}

	public void setOnly_allow_encryptms(String only_allow_encryptms) {
		this.only_allow_encryptms = only_allow_encryptms;
	}

	public String getGpsen() {
		return gpsen;
	}

	public void setGpsen(String gpsen) {
		this.gpsen = gpsen;
	}

	

}
