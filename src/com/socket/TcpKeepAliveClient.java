package com.socket;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.ConcurrentModificationException;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.action.BsStationAction;
import com.action.RadioUserAction;
import com.config.config;
import com.dwr.IndexDwr;
import com.dwr.RadioDwr;
import com.dwr.SocketDwr;
import com.func.FlexJSON;
import com.func.WebFun;
import com.func.XhLog;
import com.google.protobuf.InvalidProtocolBufferException;
import com.listener.GpsTaskListener;
import com.protobuf.TrunkCommon;
import com.protobuf.TrunkMsoBs;
import com.protobuf.TrunkMsoDs;
import com.sql.SysSql;
import com.sql.XhSql;
import com.struct.MarkStruct;
import com.struct.SmsStruct;
import com.struct.WavHeaderStruct;
import com.struct.bsStatusStruct;

public class TcpKeepAliveClient extends Thread {
	public static config config = new config();
	private WebFun func = new WebFun();
	protected final Log log = LogFactory.getLog(TcpKeepAliveClient.class);
	private XhLog xhlog = new XhLog();
	private String ip;
	private int port;
	private static Socket socket;
	private static int timeout = 10 * 1000;
	private SysSql Sql = new SysSql();
	private XhSql xhSql = new XhSql();
	private static byte[] result;
	private static byte[] bufferFlag = {};
	private static int slot;
	private static long timeStart;
	private static String date;
	private static String fileName;
	private static String filePath;
	private static int comID = -1;
	private static int bufLen = -1;
	private static int usetime = -1;
	private static String callId;
	private static byte[] readBuf;
	private static int dataLen = 0;
	private static String callType;
	private static int m_calling = 0;
	private static int m_countin = 0;
	private static byte[] writeBuf = {};
	private static long time = 0;
	private static int m_rssi = 0;
	private static int muticastsrc_bsid;
	public static int cbsId=0;
	private static ArrayList colorList;
	private static HashMap<String, ArrayList> colorMap = new HashMap<String, ArrayList>();
	private static ArrayList<HashMap<String, Object>> callList = new ArrayList<HashMap<String, Object>>();
	private static ArrayList<HashMap<String, Object>> bsInfoList = new ArrayList<HashMap<String, Object>>();
	private static HashMap<String, Object> startTimeMap = new HashMap<String, Object>();
	private static HashMap<String, Map> callMap = new HashMap<String, Map>();
	private static HashMap<String, String> rssi_map = new HashMap<String, String>();

	private boolean connected = false;
	private NetDataTypeTransform dd = new NetDataTypeTransform();
	private FlexJSON json = new FlexJSON();
	private WavHeaderStruct wavHeaderStruct = new WavHeaderStruct(0);	

	public enum BsControlType {
		STATUS, // 获取状态
		REBOOT, // 重启系统
		INTERFERE, // 干扰
		RSSI, // 获取RSSI
		SLEEP, // 基站联网/脱网
		GPSDATA, // 获取GPS
		PWSET, // 功率设置(content为功率值,范围1-50)
		PWRELOAD
		// 功率标定
	}

	public void run() {

		receive();
	}

	public void connect() {
		if (socket == null || socket.isClosed() || !socket.isConnected()) {
			socket = new Socket();
			ip = func.readXml("centerNet", "center_ip");
			port = Integer.parseInt(func.readXml("centerNet", "center_port"));
			InetSocketAddress addr = new InetSocketAddress(ip, port);
			try {
				socket.connect(addr, timeout);
				socket.setTcpNoDelay(true);
			} catch (IOException e) {
			}
			try {
				socket.setKeepAlive(true);
			} catch (SocketException e) {
				/* log.info("KeepAlive SocketException"); */
			}
			try {
				socket.setSoTimeout(timeout);
			} catch (SocketException e) {
				/* log.info("timeout SocketException"); */
				//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
				log.debug("recvData timeout 10s,socket is closed and reconnecting!");
				alarm(2, 0, -1);
				IndexDwr.alarmDwr();
				try {
					socket.close();
					IndexDwr.centerStatus(0);
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				connected = false;
			}

		}
	}

	public void receive() {
		InputStream input = null;
		NetDataTypeTransform dd = new NetDataTypeTransform();

		while (!connected) {

			try {
				System.setProperty("java.net.preferIPv4Stack", "true");
				connect();
				input = socket.getInputStream();
				if (socket.isConnected()) {
					connected = true;
					log.debug("TCP Connected success!!");
					SendData.PTTStatsBSREQ();
					IndexDwr.centerStatus(1);
					
					//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
					alarm(2, 1, -1);
					IndexDwr.alarmDwr();

					try {
						Timer timer = new Timer();
						timer.schedule(new HeartBeat(socket), 2000, 3 * 1000);
					} catch (IOException e) {
						log.info("Timer");
					}
				}
				// read body
				byte[] buf = new byte[4096];// 收到的包字节数组
				byte[] bufH = new byte[2];// 收到的包字节数组
				byte[] realBuf = new byte[10240];

				while (connected) {
					int len = input.read(buf);
					int recvLen = len;
					if (len > 0 && len + writeBuf.length >= 4) {
						readBuf = new byte[len + writeBuf.length];
						System.arraycopy(writeBuf, 0, readBuf, 0,
								writeBuf.length);
						System.arraycopy(buf, 0, readBuf, writeBuf.length, len);
						len = len + writeBuf.length;

						System.arraycopy(readBuf, 0, bufH, 0, 2);
						String packageHeader = HexString(bufH);
						
						/*log.info("TCP数据：->writebuf="+func.BytesToHexS(writeBuf));
						log.info("TCP数据：->readBuf="+func.BytesToHexS(readBuf));*/
						if (!packageHeader.equals("c4d7")) {
							log.error("SocketError1111:>>!c4d7");
							log.info(packageHeader);
							this.writeBuf=new byte[0];
							
							/* writeBuf=null; */
						} else {
							int length = dd.BigByteArrayToShort(readBuf, 2);
							if (length + 4 > len) {
								byte[] temp = new byte[writeBuf.length];
								System.arraycopy(writeBuf, 0, temp, 0,
										writeBuf.length);
								writeBuf = new byte[recvLen + temp.length];
								System.arraycopy(temp, 0, writeBuf, 0,
										temp.length);
								System.arraycopy(buf, 0, writeBuf, temp.length,
										recvLen);
								// break;
							} else if (length + 4 == len) {
								int comId = dd.BigByteArrayToShort(readBuf, 4);
								String callid = dd.ByteArraytoString(readBuf,
										6, 8);
								comID = comId;

								callId = dd.ByteArraytoString(readBuf, 6, 8);
								handler(comId, length + 4, callid, readBuf, len);
							} else if (len > length + 4) {

								for (int i = 0; i <= len;) {

									System.arraycopy(readBuf, i, realBuf, 0,
											len - i);
									length = dd.BigByteArrayToShort(realBuf, 2);
									dataLen = length + 4;
									System.arraycopy(realBuf, 0, bufH, 0, 2);
									packageHeader = HexString(bufH);
									if (!packageHeader.equals("c4d7")) {
										log.error("SocketError2:>>!c4d7");
										this.writeBuf=new byte[0];
									}
									if (dataLen > len - i) {
										writeBuf = new byte[len - i];
										System.arraycopy(realBuf, 0, writeBuf,
												0, len - i);
										break;
									} else {
										int comId = dd.BigByteArrayToShort(
												realBuf, 4);
										String callid = dd.ByteArraytoString(
												realBuf, 6, 8);
										length = dd.BigByteArrayToShort(
												realBuf, 2);
										comID = comId;

										callId = dd.ByteArraytoString(realBuf,
												6, 8);
										handler(comId, dataLen, callid,
												realBuf, len);
										i += length + 4;
										writeBuf = null;
									}

								}
							}
						}

					} else {
						socket.close();
						log.debug("====TCP connection is closed!!====");
						log.debug("====reconnection now!!====");
						IndexDwr.centerStatus(0);
						connected = false;
					}
				}

			} catch (SocketException e) {
				log.debug("TCP connection trying");
				if (socket.isConnected() || socket != null) {
					try {
						socket.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
					connected = false;
				}
				try {
					sleep(5000);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} catch (UnknownHostException e) {
			} catch (IOException e) {
				log.debug("recvData timeout 10s,socket is closed and reconnecting!");
				try {
					socket.close();

				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				connected = false;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

	public void handler(int comId, int len, String callid, byte[] buf,
			int length) throws Exception {

		try {
			switch (comId) {
			case 1:
				Call(len, callid, buf);// 呼叫信息
				break;
			case 2:
				senSms(len, buf, callid);
				break;
			case 3:
				Gps(len, callid, buf);// 接收GPS信息
				break;

			case 9:
				BsControl(len, buf);
				break;
			case 13:
				OnOffStatus(len, buf);// 设备上线下线通知
				break;
			case 21:
				RSSI(len, buf);// 基站场强信息
				break;
			case 25:
				PTTStats(len, buf);// ppt统计
				break;
			//case 513: HeartBeatOUT(len, buf);// 心跳 break;
			 
			case 519:
				UpdateBSRES(len, buf);
				break;
			case 521:
				bsStatus(len, buf);// 获取基站状态
				break;
			case 538:
				MuticastSrcBSRES(len, buf);// 获取基站状态
				break;
			case 545:
				A2DEnableRES(len, buf);// 71)应答设置模拟到数字通道使能开关
				break;	
			case 548:
				PTTStatsBSRES(len, buf);// 71)应答设置模拟到数字通道使能开关
				break;
			default:
				break;
			}
		} catch (NullPointerException e) {
			// TODO: handle exception
			log.error(e.getMessage(), e);
		} catch (NumberFormatException e) {
			// TODO: handle exception
			log.error(e.getMessage(), e);
		} catch (StringIndexOutOfBoundsException e) {
			// TODO: handle exception
			log.error(e.getMessage(), e);
		} catch (ArrayIndexOutOfBoundsException e) {
			// TODO: handle exception
			log.error(e.getMessage(), e);
		} catch (ConcurrentModificationException e) {
			// TODO: handle exception
			log.error(e.getMessage(), e);
		}catch(NoSuchMethodError e){
			log.error(e.getMessage(), e);
		} catch (Exception e) {
			// TODO: handle exception
			log.error(e.getMessage(), e);
		}
	}

	@SuppressWarnings("unchecked")
	public void Call(int len, String callid, byte[] buf) {
		result = new byte[len - 26];
		date = func.nowDate();
		callId = callid;
		time = func.nowTimeMill(func.nowDateMill());

		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.CallRES res = null;
		try {
			res = TrunkCommon.CallRES.parseFrom(result);
		} catch (InvalidProtocolBufferException e) {

		}

		String type = res.getType().toString();

		log.info("DS<-MSO[Call]----ACK=" + res.getAck().toString()+";"
				+ "callid="+callid+";"
				+ "type="+res.getType()+";"
				+ "bsId="+res.getBsidList().toString()+";"
				+ "caller="+res.getSrcid()+";called="+res.getTaridList().toString());
		

		if ((type.equals("PTT_ON") || type.equals("F_CUTIN")) && res.getAck().toString().equals("OK")) {
			if(type.equals("F_CUTIN")){
				PTT_OFF(callid);
			}
			colorList = new ArrayList();
			callType = "PTT_ON";
			m_calling = 1;
			usetime = -1;
			
			String[] str = date.split(" ")[0].split("-");
			slot = res.getSlot(0);
			fileName = str[0] + "/" + str[1] + "/" + str[2] + "/" +time;
			String pathname = func.webPath()+ "/resources/wav/" + fileName + ".wav";
			File file = new File(pathname);
			if (!file.exists()) {
				try {
					func.createVoiceFile(pathname);
					WavHeaderStruct wav = new WavHeaderStruct(0);
					func.writeVoiceFile(pathname,wav.getHeader(), false);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
			}
			Map call = new HashMap();
			call.put("startTime", time);
			call.put("startDate", date);
			call.put("bsId", res.getBsid(0));
			call.put("bsIds",
					res.getBsidList()
							.toString()
							.substring(1,
									res.getBsidList().toString().length() - 1));
			call.put("fileName", fileName);
			call.put("caller", res.getSrcid());
			call.put("called", res.getTarid(0));
			call.put("ig", res.getIg());

			callMap.put(callid, call);

			HashMap callNowMap = new HashMap();
			String wavStr = "/resources/wav/" + callMap.get(callid).get("fileName")+ ".wav";
			callNowMap.put("time", time);
			callNowMap.put("callid", callid);
			callNowMap.put("path", wavStr);
			callNowMap.put("srcId", res.getSrcid());
			callNowMap.put("caller", Sql.radioPerson(res.getSrcid()).equals("")?res.getSrcid():Sql.radioPerson(res.getSrcid()));
			callNowMap.put("called", res.getTarid(0));
			callNowMap.put("ig", res.getIg());
			callNowMap.put("bsid", res.getBsid(0));
			callNowMap.put("bsName", Sql.bsId_bsName(res.getBsid(0)));
			callNowMap.put("rssi", "");
			callNowMap.put("starttime", date);
			callNowMap.put("usetime", -1);
			callList.add(callNowMap);
			if (callList.size() > 100) {
				for (int i = 10; i < callList.size(); i++) {
					callList.remove(i);
				}
			}

			if (res.getBsid(0) <= 65535) {
				SocketDwr.refresh();
				for (int i = 0; i < res.getBsidList().size(); i++) {
					
					MarkStruct mark = new MarkStruct();
					mark = Sql.bsInfo(res.getBsid(i));
					Map colorMap = new HashMap();
					colorMap.put("bsId", res.getBsid(i));
					colorMap.put("model", mark.getModel());
					colorMap.put("linkModel", mark.getLinkModel());
					colorMap.put("status", mark.getStatus());

					if (mark.getModel() == 1 && mark.getStatus() == 1) {
						colorList.add(colorMap);
					}
				}
				colorMap.put(callid, colorList);

				HashMap result = new HashMap();
				result.put("items", colorMap.get(callid));
				result.put("flag", true);
				String jsonstr = json.Encode(result);
				SocketDwr.callColor(jsonstr);
			}

		} else if (type.equals("CALL_SWITCH")) {
			colorList.clear();

			if (callMap != null && callMap.get(callid) != null) {
				HashMap result1 = new HashMap();
				result1.put("items", colorMap.get(callid));
				result1.put("flag", false);
				String jsonstr = json.Encode(result1);
				SocketDwr.callColor(jsonstr);

			}
			for (int i = 0; i < res.getBsidList().size(); i++) {
				int model = xhSql.bsId_model(res.getBsid(i));
				Map map = new HashMap();
				map.put("bsId", res.getBsid(i));
				map.put("model", model);
				map.put("linkModel", Sql.bsId_linkModel(res.getBsid(i)));
				map.put("status", Sql.bsId_status(res.getBsid(i)));
				if (model == 1) {
					colorList.add(map);
				}
			}
			colorMap.put(callid, colorList);
			HashMap result = new HashMap();
			result.put("items", colorMap.get(callid));
			result.put("flag", true);
			String jsonstr = json.Encode(result);
			SocketDwr.callColor(jsonstr);

			if (callMap != null && callMap.get(callid) != null) {
				callMap.get(callid).put("bsId", res.getBsid(0));
				callMap.get(callid)
						.put("bsIds",res.getBsidList().toString().substring(1,res.getBsidList().toString().length() - 1));
			}

		} else if ((type.equals("PTT_OFF") || type.equals("F_DISCONNECT"))) {
			long timeStart = 0;
			String bsid = "";
			try {
				timeStart = Long.parseLong(callMap.get(callid).get("startTime").toString());
				bsid = callMap.get(callid).get("bsId").toString();
			} catch (NullPointerException e) {
				// TODO: handle exception
			}
			double time2 = Math.ceil((float)(func.nowDateTime(func.nowDate()) - timeStart) / 1000);
			int usetime = (int) time2;
			callType = "PTT_OFF";
			m_calling = 0;
			String filestr = callMap.get(callid).get("fileName").toString();
			String wavStr = "/resources/wav/" + filestr + ".wav";
			if (rssi_map.get(callMap.get(callid).get("bsId").toString()) != null) {
				m_rssi = Integer.parseInt(rssi_map.get(callMap.get(callid).get("bsId").toString()));
			}

			if (time2 >0) {
				String sql = "insert into xhdigital_call(starttime,caller,called,callid,rssi,ig,bsId,filePath,slot,usetime)"
						+ "VALUES('"
						+ callMap.get(callid).get("startDate").toString()
						+ "','"
						+ res.getSrcid()
						+ "','"
						+ res.getTarid(0)
						+ "','"
						+ callid
						+ "','"
						+ m_rssi
						+ "','"
						+ res.getIg()
						+ "','"
						+ callMap.get(callid).get("bsId").toString()
						+ "','"
						+ wavStr
						+ "','"
						+ slot
						+ "','"
						+ time2+ "')";

				try {
					Sql.Update(sql);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} else {

			}
			for (int i = 0; i < callList.size(); i++) {
				HashMap<String, Object> map = new HashMap<String, Object>();
				map = callList.get(i);

				if (map.get("callid").toString().equals(callid)) {
					if (Long.parseLong(map.get("time").toString()) == timeStart) {
						HashMap callL = new HashMap();
						callL.put("time", timeStart);
						callL.put("callid", callid);
						callL.put("path", map.get("path").toString());
						callL.put("srcId", res.getSrcid());
						callL.put("caller",map.get("caller").toString());
						callL.put("called", res.getTarid(0));
						callL.put("ig", res.getIg());
						callL.put("bsid", bsid);
						callL.put("bsName", map.get("bsName").toString());
						callL.put("rssi", m_rssi);
						callL.put("starttime", func.Time(timeStart));
						callL.put("usetime", usetime);
						callList.set(i, callL);
					}
				}

			}
			HashMap result = new HashMap();
			result.put("items", colorMap.get(callid));
			result.put("flag", false);
			String jsonstr = json.Encode(result);
			SocketDwr.callColor(jsonstr);
			SocketDwr.refresh();
			SocketDwr.rssi(null);

			if (callMap != null) {
				if (callMap.get(callid) != null) {
					callMap.remove(callid);
				}
			}
			if (colorMap.get(callid) != null) {
				callMap.remove(callid);
			}
			String fileRealPath = func.webPath() + "/resources/wav/" + filestr+ ".wav";
			File file = new File(fileRealPath);
			if (file.exists()) {
				/*if(VoiceUDP.index>0 && VoiceUDP.index<2000){
					log.info("语音数据测试-->index-3:"+VoiceUDP.index);
					byte[] udpData = new byte[VoiceUDP.index];
					System.arraycopy(VoiceUDP.getData(), 0, udpData, 0, VoiceUDP.index);
					try {
						func.writeVoiceFile(filestr, udpData);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					VoiceUDP.index=0;
				}*/
				byte[] voice = func.readVoiceFile(filestr);
				WavHeaderStruct wav = new WavHeaderStruct(voice.length - 44);
				try {
					System.arraycopy(wav.getHeader(), 0, voice, 0, 44);
					func.writeVoiceFile(fileRealPath, voice, false);
				} catch (ArrayIndexOutOfBoundsException e) {
					log.info("ArrayIndexOutOfBoundsException");
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		} else if (type.equals("END")) {
			m_calling = 0;
			if (callMap != null) {
				if (callMap.get(callid) != null) {
					callMap.remove(callid);
				}
			}
			SocketDwr.rssi(null);
			rssi_map.clear();
			usetime = -2;
			if (colorMap.get(callid) != null) {
				callMap.remove(callid);
			}
		} else if(type.equals("PTT_ON") && !res.getAck().toString().equals("OK")) {
			String errorMsg = "";
			String ack=res.getAck().toString();
			if (ack.equals("TS_NS")) {
				errorMsg = "系统服务不支持";
			} else if (ack.equals("TS_PUR")) {
				errorMsg = "服务未授权";
			} else if (ack.equals("TS_TUR")) {
				errorMsg = "服务临时未被授权";
			} else if (ack.equals("TS_TSR")) {
				errorMsg = "呼叫临时不支持";
			} else if (ack.equals("TS_NMR	")) {
				errorMsg = "被叫未登记";
			} else if (ack.equals("TS_MR")) {
				errorMsg = "被叫无线不可达";
			} else if (ack.equals("TS_DCF")) {
				errorMsg = "被叫已转移而拒绝业务";
			} else if (ack.equals("TS_SBR")) {
				errorMsg = "系统过载而拒绝业务";
			} else if (ack.equals("TS_SNR")) {
				errorMsg = "系统未准备好而临时拒绝业务";
			} else if (ack.equals("TS_CCR")) {
				errorMsg = "取消呼叫拒绝";
			} else if (ack.equals("TS_RR")) {
				errorMsg = "登记临时拒绝";
			} else if (ack.equals("TS_RD")) {
				errorMsg = "登记永久拒绝";
			} else if (ack.equals("TS_ICF")) {
				errorMsg = "IP激活失败";
			} else if (ack.equals("TS_NR")) {
				errorMsg = "主叫未登记";
			} else if (ack.equals("TS_BSY")) {
				errorMsg = "被叫忙";
			} else if (ack.equals("TS_NE")) {
				errorMsg = "被叫用户不存在";
			} else {
				errorMsg = "呼叫拒绝，原因未知";
			}
			date = func.nowDate();			
			HashMap callerror = new HashMap();
			String bsName=Sql.bsId_bsName(res.getBsid(0));
			callerror.put("errorMsg",errorMsg);
			callerror.put("caller", res.getSrcid());
			callerror.put("called", res.getTarid(0));
			callerror.put("ig", res.getIg());
			callerror.put("bsid", res.getBsid(0));
			
			callerror.put("bsName", bsName);
			callerror.put("starttime", date);
			String jsonstr = json.Encode(callerror);
			SocketDwr.CallError(jsonstr);
			String sql="insert into xhdigital_callerror(caller,called,bsId,message,bsName)"
					+ "values('"+res.getSrcid()+"','"+res.getTarid(0)+"','"+res.getBsid(0)+"','"+errorMsg+"','"+bsName+"')";
			try {
				Sql.Update(sql);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if(type.equals("F_CUTIN")){
			m_calling=1;
			m_countin=1;
			try {
				Thread.sleep(5000);
				m_calling=0;
				m_countin=0;
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}
	
	public void PTT_OFF(String callid){
		long timeStart = 0;
		String bsid = "";
		try {
			timeStart = Long.parseLong(callMap.get(callid).get("startTime")
					.toString());
			bsid = callMap.get(callid).get("bsId").toString();

			
		} catch (NullPointerException e) {
			// TODO: handle exception
		}
		double time2 = Math.ceil((float)(func.nowDateTime(func.nowDate()) - timeStart) / 1000);
		int usetime = (int) time2;
		callType = "PTT_OFF";
		m_calling = 0;
		String filestr = callMap.get(callid).get("fileName").toString();
		String wavStr = "/resources/wav/" + filestr + ".wav";
		if (rssi_map.get(callMap.get(callid).get("bsId").toString()) != null) {
			m_rssi = Integer.parseInt(rssi_map.get(callMap.get(callid)
					.get("bsId").toString()));
		}

		if (time2 >0) {
			String sql = "insert into xhdigital_call(starttime,caller,called,callid,rssi,ig,bsId,filePath,slot,usetime)"
					+ "VALUES('"
					+ callMap.get(callid).get("startDate").toString()
					+ "','"
					+ callMap.get(callid).get("caller").toString()
					+ "','"
					+ callMap.get(callid).get("called").toString()
					+ "','"
					+ callid
					+ "','"
					+ m_rssi
					+ "','"
					+ callMap.get(callid).get("ig").toString()
					+ "','"
					+ callMap.get(callid).get("bsId").toString()
					+ "','"
					+ wavStr
					+ "','"
					+ slot
					+ "','"
					+ time2+ "')";

			try {
				Sql.Update(sql);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {

		}
		for (int i = 0; i < callList.size(); i++) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map = callList.get(i);

			if (map.get("callid").toString().equals(callid)) {
				if (Long.parseLong(map.get("time").toString()) == timeStart) {
					HashMap callL = new HashMap();
					callL.put("time", timeStart);
					callL.put("callid", callid);
					callL.put("path", map.get("path").toString());
					callL.put("caller", callMap.get(callid).get("caller").toString());
					callL.put("called",callMap.get(callid).get("called").toString());
					callL.put("ig", callMap.get(callid).get("ig").toString());
					callL.put("bsid", bsid);
					callL.put("bsName", map.get("bsName").toString());
					callL.put("rssi", m_rssi);
					callL.put("starttime", func.Time(timeStart));
					callL.put("usetime", usetime);
					callList.set(i, callL);
				}
			}

		}
		HashMap result = new HashMap();
		result.put("items", colorMap.get(callid));
		result.put("flag", false);
		String jsonstr = json.Encode(result);
		SocketDwr.callColor(jsonstr);
		SocketDwr.refresh();
		SocketDwr.rssi(null);

		if (callMap != null) {
			if (callMap.get(callid) != null) {
				callMap.remove(callid);
			}
		}
		if (colorMap.get(callid) != null) {
			callMap.remove(callid);
		}
		String fileRealPath = func.webPath() + "/resources/wav/" + filestr
				+ ".wav";
		File file = new File(fileRealPath);
		if (file.exists()) {
			/*if(VoiceUDP.index>0 && VoiceUDP.index<2000){
				log.info("语音数据测试-->index-3:"+VoiceUDP.index);
				byte[] udpData = new byte[VoiceUDP.index];
				System.arraycopy(VoiceUDP.getData(), 0, udpData, 0, VoiceUDP.index);
				try {
					func.writeVoiceFile(filestr, udpData);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				VoiceUDP.index=0;
			}*/
			byte[] voice = func.readVoiceFile(filestr);
			WavHeaderStruct wav = new WavHeaderStruct(voice.length - 44);
			try {
				System.arraycopy(wav.getHeader(), 0, voice, 0, 44);
				func.writeVoiceFile(fileRealPath, voice, false);
				
			} catch (ArrayIndexOutOfBoundsException e) {
				log.info("ArrayIndexOutOfBoundsException");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

	// GPS信息
	public void Gps(int len, String callid, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.GPS gps = null;
		try {
			gps = TrunkCommon.GPS.parseFrom(result);
		} catch (InvalidProtocolBufferException e1) {
			// TODO Auto-generated catch block
			log.info("===[ERROR]====GPS");
		}
		/*log.info("==========[GPS Data]=======");*/
		/*log.info("[GPS]----buf>>"+ func.BytesToHexS(buf));
		
		log.info("[GPS]----result>>"+ func.BytesToHexS(result));*/
		/*log.info("[GPS]----msId>>" + gps.getMsid());
		log.info("[GPS]----ch_type>>" + gps.getChType());
		log.info("[GPS]----content>>"
				+ func.BytesToHexS(gps.getContent().toByteArray()));*/
		/*log.info("----------------------------");*/
		String hex = "", m_hex = "";
		for (byte b : gps.getContent().toByteArray()) {
			/*
			 * String m_c = String.format("%x", b); log.debug("m_c:"+m_c);
			 */
			String m_a = func.ByteToHexS(b);
			// log.debug("m_a:"+m_a);
			String m_b = func.hex_16_2(m_a);
			hex += m_b;
			m_hex += m_b + " | ";

		}
		int csbko = Integer.parseInt(hex.substring(2, 8), 2);// 2,6
		int fid = func.hex_2_10(hex.substring(8, 16));// 8,8
		int m_lat = 0, m_lon = 0, lat_1 = 0, lat_2 = 0, lon_1 = 0, lon_2 = 0;
		int speed = 0, rssi = 0, power = 0;
		String UTChh = "", UTCmm = "", UTCss = "";
		double lat = 0, lon = 0;
		int q = 0;

		/*
		 * System.out.println("GPS========hex.substring(2,7)->"+hex.substring(2,8
		 * ));
		 * System.out.println("GPS========hex.substring(8, 15)->"+hex.substring
		 * (8, 16));
		 * 
		 * System.out.println("GPS========hex->" + m_hex);
		 */
		java.text.DecimalFormat df = new java.text.DecimalFormat("0.000000");

		try {
			if (gps.getChType() == 0) {
				if (hex.length() >= 80) {
					// 控制信道短格式
					q = func.hex_2_10(hex.substring(3, 4));
					speed = func.hex_2_10(hex.substring(4, 11));// 4,7
					m_lat = func.hex_2_10(hex.substring(11, 18));// 11,7 纬度
					lat_1 = func.hex_2_10(hex.substring(18, 24));// 18,6 纬度的整数部分
					lat_2 = func.hex_2_10(hex.substring(24, 38));// 24,14
																	// 纬度的小数部分
					m_lon = func.hex_2_10(hex.substring(38, 46));// 38,8 经度
					lon_1 = func.hex_2_10(hex.substring(46, 52));// 46,6 经度整数部分
					lon_2 = func.hex_2_10(hex.substring(52, 66));// 52,14 经度
																	// 小数部分
					if (gps.getContent().toByteArray().length == 10) {

					} else {
						/*
						 * UTChh =
						 * String.valueOf(func.hex_2_10(hex.substring(66,
						 * 71)));// 66,5 UTCmm =
						 * String.valueOf(func.hex_2_10(hex.substring(71,
						 * 77)));// 71,6 UTCss =
						 * String.valueOf(func.hex_2_10(hex.substring(77,
						 * 83)));// 66,6 log.info("GPS====HH->" + UTChh);
						 * log.info("GPS====MM->" + UTCmm);
						 * log.info("GPS====lon->" + UTCss);
						 */
					}

					lat = m_lat + ((double) lat_1 + (double) lat_2 / 10000)
							/ 60;
					lon = m_lon + ((double) lon_1 + (double) lon_2 / 10000)
							/ 60;
					lat = Double.parseDouble(df.format(lat));
					lon = Double.parseDouble(df.format(lon));
				}

				// sysFun.saveTsLonLat(gps.getTsid(), m_lon, m_lat);
			} else if (gps.getChType() == 5) {
				log.debug("length:" + hex.length());
				if (hex.length() == 72) {
					// 控制信道短格式
					q = -1;
					m_lat = func.hex_2_10(hex.substring(9, 16));// 9,7
					lat_1 = func.hex_2_10(hex.substring(16, 22));// 16,6
					lat_2 = func.hex_2_10(hex.substring(22, 32));// 22,10
					m_lon = func.hex_2_10(hex.substring(32, 40));// 32,8
					lon_1 = func.hex_2_10(hex.substring(40, 46));// 40,6
					lon_2 = func.hex_2_10(hex.substring(46, 56));// 46,10

					lat = m_lat + ((double) lat_1 + (double) lat_2 / 1000) / 60;
					lon = m_lon + ((double) lon_1 + (double) lon_2 / 1000) / 60;
					lat = Double.parseDouble(df.format(lat));
					lon = Double.parseDouble(df.format(lon));
					
				}

				// sysFun.saveTsLonLat(gps.getTsid(), m_lon, m_lat);
			} else {
				/*
				 * System.out.println("GPS========csbko->" + csbko);
				 * System.out.println("GPS========fid->" + fid); // C_GPSU if
				 * (csbko == 29 && fid == 104) { speed =
				 * func.hex_2_10(hex.substring(18, 25)); // 18,7 m_lat =
				 * func.hex_2_10(hex.substring(25, 32));// 25,7 lat_1 =
				 * func.hex_2_10(hex.substring(32, 38)); // 32,6 lat_2 =
				 * func.hex_2_10(hex.substring(38, 52));// 38,14 m_lon =
				 * func.hex_2_10(hex.substring(52, 60));// 52,8 lon_1 =
				 * func.hex_2_10(hex.substring(60, 66));// 60,6 lon_2 =
				 * func.hex_2_10(hex.substring(66, 80));// 66,14
				 * 
				 * lat = sysFun.TsLat(gps.getTsid()) + Double.parseDouble(lat_1
				 * + "." + lat_2) / 60; lon = sysFun.TsLon(gps.getTsid()) +
				 * Double.parseDouble(lon_1 + "." + lon_2) / 60;
				 * 
				 * lat=Double.parseDouble(df.format(lat));
				 * lon=Double.parseDouble(df.format(lon)); } // C_GPS2U if
				 * (csbko == 21 && fid == 104) {
				 * 
				 * speed = func.hex_2_10(hex.substring(18, 25)); // 18,7 lat_1 =
				 * func.hex_2_10(hex.substring(27, 33)); // 27,6 lat_2 =
				 * func.hex_2_10(hex.substring(33, 43));// 33,10 lon_1 =
				 * func.hex_2_10(hex.substring(46, 52));// 46,6 lon_2 =
				 * func.hex_2_10(hex.substring(52, 62));// 52,10 rssi =
				 * func.hex_2_10(hex.substring(62, 65));// 62,3 power =
				 * func.hex_2_10(hex.substring(65, 68));// 65,3
				 * 
				 * lat = sysFun.TsLat(gps.getTsid()) + Double.parseDouble(lat_1
				 * + "." + lat_2) / 60; lon = sysFun.TsLon(gps.getTsid()) +
				 * Double.parseDouble(lon_1 + "." + lon_2) / 60;
				 * 
				 * lat=Double.parseDouble(df.format(lat));
				 * lon=Double.parseDouble(df.format(lon));
				 * 
				 * } // C_GPS3U if (csbko == 21 && fid == 8) {
				 * 
				 * lat_1 = func.hex_2_10(hex.substring(20, 26)); // 20,6 lat_2 =
				 * func.hex_2_10(hex.substring(26, 36));// 26,10 lon_1 =
				 * func.hex_2_10(hex.substring(39, 45));// 39,6 lon_2 =
				 * func.hex_2_10(hex.substring(45, 55));// 45,10
				 * 
				 * lat = sysFun.TsLat(gps.getTsid()) + Double.parseDouble(lat_1
				 * + "." + lat_2) / 60; lon = sysFun.TsLon(gps.getTsid()) +
				 * Double.parseDouble(lon_1 + "." + lon_2) / 60;
				 * 
				 * lat=Double.parseDouble(df.format(lat));
				 * lon=Double.parseDouble(df.format(lon));
				 * 
				 * }
				 */

			}
			/*
			 * log.info("GPS====m_lat->" + m_lat); log.info("GPS====lat1->" +
			 * lat_1); log.info("GPS====lat2->" + lat_2);
			 * log.info("GPS====m_lon->" + m_lon); log.info("GPS====lon1->" +
			 * lon_1); log.info("GPS====lon2->" + lon_2);
			 */
		
			log.info("DS<-MSO[GPS] srcId:"+gps.getMsid()+"q:" + q + "; speed:" + speed + "; lat:"
					+ df.format(lat) + "; lon:" + df.format(lon));
			String sql = "";
			/*String sql2 = "update hometerminal set lat='" + lat + "',lng='"
					+ lon + "' where id=" + gps.getMsid();*/
			try {
				if (q == 0) {
					sql = "insert into xhdigital_gpsinfo(srcId,latitude,longitude,infoTime,starNum,typeId)VALUES('"
							+ gps.getMsid()
							+ "','"
							+ lat
							+ "','"
							+ lon
							+ "','"
							+ func.nowDate() + "','" + speed + "',0)";
				} else {
					sql = "insert into xhdigital_gpsinfo(srcId,latitude,longitude,infoTime,starNum,typeId)VALUES('"
							+ gps.getMsid()
							+ "','"
							+ lat
							+ "','"
							+ lon
							+ "','"
							+ func.nowDate() + "','" + speed + "','" + q + "')";
				}
				Sql.Update(sql);
				/*if (lat > 38 && lat < 40 && lon > 116 && lon < 119) {
					//xhSql.Update(sql2);
					
				}*/
				
				
				
				HashMap<String,Object> result = (HashMap<String, Object>) xhSql.radioUserMap(gps.getMsid());
				result.put("srcId", gps.getMsid());
				result.put("lng",lon);
				result.put("lat",lat);
				String jsonstr = json.Encode(result);
				RadioDwr.RadioGps(jsonstr);
                
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (StringIndexOutOfBoundsException e) {
			// TODO: handle exception
		}

	}

	
	//系统告警
	//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
	public void alarm(int type,int status,int id){
		String content="";
		if(type==1){
			content=id+"号基站："+xhSql.bsId_bsName(id)+"连接断开";
		}else if(type==2){
			content="与中心连接断开";
		}else if(type==3){
			content="交换连接断开";
		}else if(type==4){
			content=id+"号基站："+xhSql.bsId_bsName(id)+"温度过高";
		}else if(type==5){
			content=id+"号基站："+xhSql.bsId_bsName(id)+"gps失锁";
		}else if(type==6){
			content=id+"号基站："+xhSql.bsId_bsName(id)+"反向功率过大";
		}else if(type==7){
			content=id+"号基站："+xhSql.bsId_bsName(id)+"交流电断开";
		}else if(type==8){
			content=id+"号基站："+xhSql.bsId_bsName(id)+"设定功率与遥测功率差值较大";
		}else{
			content="未知";
		}
		String sql1= "select * from xhdigital_alarm where type='"+type+"' and alarmId='"+id+"'";
		String sql2="insert into xhdigital_alarm(alarmId,content,type)values('"+id+"','"+content+"','"+type+"')";
		String sql3="delete from xhdigital_alarm where type='"+type+"' and alarmId="+id;
		try {
			if(Sql.exists(sql1)){
				if(status==1){
					Sql.Update(sql3);
				}	
			}else{
				if(status==0){
					Sql.Update(sql2);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// 设备上下线通知
	public void OnOffStatus(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.OnOffStatus onOffStatus = null;
		try {
			onOffStatus = TrunkCommon.OnOffStatus.parseFrom(result);
			log.info("DS<-MSO [onOffStatus]----DeviceTyp>>" + onOffStatus.getType()+";"
					+ "mscId="+ onOffStatus.getId()+";onoff="+onOffStatus.getOnOff());
		} catch (InvalidProtocolBufferException e1) {
			// TODO Auto-generated catch block

			log.info("===[ERROR]====OnOffStatus:");
		}
		if (bsInfoList.size() > 100) {
			for (int i = 10; i < bsInfoList.size(); i++) {
				bsInfoList.remove(i);
			}
		}
		if (onOffStatus.getType().toString().toLowerCase().equals("bs")) {
			HashMap info = new HashMap();
			String bsName=Sql.bsId_bsName(onOffStatus.getId());
			info.put(
					"content",
					onOffStatus.getId() + "号基站["+ bsName+ "]"
							+ (onOffStatus.getOnOff() ? "连接成功!" : "连接中断！"));
			info.put("status", onOffStatus.getOnOff() ? 1 : 0);
			info.put("time", func.nowDate());
			bsInfoList.add(info);
			//Sql.smsAlarm(1, onOffStatus.getId(), onOffStatus.getOnOff() ? 1 : 0);
			//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
			alarm(1, onOffStatus.getOnOff() ? 1 : 0, onOffStatus.getId());
			IndexDwr.alarmDwr();
			try {
				xhlog.writeLogNoSevlet(6, info.get("content").toString(), bsName);
				String sql="insert into xhdigital_bs_offonline(bsId,online)"
						+ "values('"+onOffStatus.getId()+"','"+(onOffStatus.getOnOff() ? 1 : 0)+"')";
				Sql.Update(sql);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		if (onOffStatus.getType().toString().toLowerCase().equals("sw")) {
			HashMap info = new HashMap();
			info.put("content", "交换"
					+ (onOffStatus.getOnOff() ? "连接成功!" : "连接中断！"));
			info.put("status", onOffStatus.getOnOff() ? 1 : 0);
			info.put("time", func.nowDate());
			bsInfoList.add(info);
			IndexDwr.swStatus(onOffStatus.getOnOff() ? 1 : 0);
			//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
			alarm(3, onOffStatus.getOnOff() ? 1 : 0,-2);
			IndexDwr.alarmDwr();
		}
		if (onOffStatus.getType().toString().toLowerCase().equals("ms")) {
			String sql = "update xhdigital_gpsset_task_attr set online='"
					+ (onOffStatus.getOnOff() ? 1 : 0) + "' where mscid="
					+ onOffStatus.getId();
			String sql2 = "update xhdigital_gpsset_task_timer set online='"
					+ (onOffStatus.getOnOff() ? 1 : 0) + "' where mscid="
					+ onOffStatus.getId();
			String sql_online="insert into xhdigital_offonline(mscid,online,time)"
					+ "values('"+onOffStatus.getId()+"','"+(onOffStatus.getOnOff()? 1 : 0)+"','"+func.nowDate()+"')";
			/*ArrayList<GpsSetStruct> list = GpsTaskListener.getList();
			ArrayList<GpsSetStruct> listClock = GpsClockTaskListener.getList();*/
			try {
				Sql.Update(sql);
				Sql.Update(sql2);
				if(xhSql.radioType(onOffStatus.getId())==0){
					Sql.Update(sql_online);
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			int ismlist2 = 0;
			int ismlist1 = 0;

			if (onOffStatus.getOnOff()) {
				RadioUserAction userAction = new RadioUserAction();
				int m_authoritystatus = xhSql.MscId_Authoritystatus(onOffStatus.getId());

				try {
					if (m_authoritystatus == 1) {
						userAction.revive(onOffStatus.getId());
					} else if (m_authoritystatus == 3) {
						userAction.stun(onOffStatus.getId());
					}
					userAction.mscOnline(onOffStatus.getId());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				String sql_1 = "select id from xhdigital_gpsset_task_attr where mscid='"
						+ onOffStatus.getId() + "'";
				String sql_timer1 = "select id from xhdigital_gpsset_task_timer where mscid='"
						+ onOffStatus.getId() + "'";
				String sql3 = "insert into xhdigital_gpsset_task_attr(mscid)values('"
						+ onOffStatus.getId() + "')";
				String sql_push = "select id from xhdigital_gps_push where mscId="
						+ onOffStatus.getId();
				try {
					if (!Sql.exists(sql_push) && (xhSql.radioType(onOffStatus.getId())==0 
							|| xhSql.radioType(onOffStatus.getId())==1)) {

						if (Sql.exists(sql_timer1)) {
							for (int a = 0; a < GpsTaskListener.getM_list2().size(); a++) {
								if (Integer.parseInt(GpsTaskListener.getM_list2().get(a).toString()) == onOffStatus.getId()) {
									ismlist2 = 1;
								}
							}
							if (ismlist2 == 0) {
								GpsTaskListener.getM_list2().add(onOffStatus.getId());
							}

						} else {
							if (Sql.exists(sql_1)) {
								for (int a = 0; a < GpsTaskListener.getM_list1().size(); a++) {
									if (Integer.parseInt(GpsTaskListener.getM_list1().get(a).toString()) == onOffStatus.getId()) {
										ismlist1 = 1;
									}
								}
								if (ismlist1 == 0) {
									GpsTaskListener.getM_list1().add(onOffStatus.getId());
								}
							} else {
								Sql.Update(sql3);
								for (int a = 0; a < GpsTaskListener.getM_list1().size(); a++) {
									if (Integer.parseInt(GpsTaskListener.getM_list1().get(a).toString()) == onOffStatus.getId()) {
										ismlist1 = 1;
									}
								}
								if (ismlist1 == 0) {
									GpsTaskListener.getM_list1().add(onOffStatus.getId());
								}
							}
						}
						// GpsTaskListener.getGpsMap().put(onOffStatus.getId(),onOffStatus.getId());

					}
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				/*
				 * try { if (!Sql.exists(sql_1)) { Sql.Update(sql3); } } catch
				 * (Exception e) { // TODO Auto-generated catch block
				 * e.printStackTrace(); }
				 */
			} else {
				/*
				 * if
				 * (GpsTaskListener.getGpsMap().get(onOffStatus.getId())!=null)
				 * { GpsTaskListener.getGpsMap().remove(onOffStatus.getId()); }
				 */
				String sql4 = "delete from xhdigital_gpsset_task_attr  where mscid="
						+ onOffStatus.getId();
				String sql5 = "update xhdigital_gpsset_task_timer set online=0 where mscid="
						+ onOffStatus.getId();
				try {
					Sql.Update(sql4);
					Sql.Update(sql4);
					for (int a = 0; a < GpsTaskListener.getM_list1().size(); a++) {
						if (Integer.parseInt(GpsTaskListener.getM_list1().get(a).toString()) == onOffStatus.getId()) {
							GpsTaskListener.getM_list1().remove(a);
						}
					}
					for (int a = 0; a < GpsTaskListener.getM_list2().size(); a++) {
						if (Integer.parseInt(GpsTaskListener.getM_list2().get(a).toString()) == onOffStatus.getId()) {
							GpsTaskListener.getM_list2().remove(a);
						}
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}


		}
		SocketDwr.bsInfoDwr();
		if (onOffStatus.getType().toString().equals("BS")) {
			int online = 0;
			if (onOffStatus.getOnOff()) {
				online = 2;
			} else {
				online = 1;
			}
			String sql_s = "select bsId from xhdigital_bs_sta where bsId="
					+ onOffStatus.getId();
			String sql_i = "insert into xhdigital_bs_sta(bsId,online)VALUES('"
					+ onOffStatus.getId() + "','" + online + "')";
			String sql_u = "update xhdigital_bs_sta set online='" + online
					+ "' where bsId=" + onOffStatus.getId();
			try {
				if (Sql.exists(sql_s)) {
					Sql.Update(sql_u);
				} else {
					Sql.Update(sql_i);
				}
				HashMap result = new HashMap();
				result.put("bsId", onOffStatus.getId());
				result.put("online", onOffStatus.getOnOff());
				result.put("model", xhSql.bsId_model(onOffStatus.getId()));
				result.put("linkModel", Sql.bsId_linkModel(onOffStatus.getId()));
				result.put("status", Sql.bsId_status(onOffStatus.getId()));
				String jsonstr = json.Encode(result);
				SocketDwr.BsOffLineDwr(jsonstr);
				;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

	}
	//ppt统计
	public void PTTStats(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.PTTStats heart = null;
		try {
			heart = TrunkCommon.PTTStats.parseFrom(result);

			log.info("[PTTStats]----bsId="+ heart.getBsid()+";time="+heart.getPttDuration());
			String sql="insert into xhdigital_channel_send_count(bsId,pptTime)values('"+heart.getBsid()+"','"+heart.getPttDuration()+"')";
			Sql.Update(sql);
			
		} catch (InvalidProtocolBufferException e) {
		} catch (Error e) {
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void PTTStatsBSRES(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkMsoDs.PTTStatsBSRES heart = null;
		try {
			heart = TrunkMsoDs.PTTStatsBSRES.parseFrom(result);

			log.info("[PTTStatsBSRES]----ack="+ heart.getAck()+";bsId="+heart.getBsid());
			TcpKeepAliveClient.cbsId=heart.getBsid();
			
		} catch (InvalidProtocolBufferException e) {
		} catch (Error e) {
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void HeartBeatOUT(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkMsoDs.HeartBeatOUT heart = null;
		try {
			heart = TrunkMsoDs.HeartBeatOUT.parseFrom(result);

			log.info("==========[心跳信息]=======");
			log.info("[RSSI]----muticastsrc_bsid>>"
					+ heart.getMuticastsrcBsid());
			log.info("[RSSI]----mso_status>>" + heart.getMsoStatus());
			log.info("[RSSI]----sw_connection>>" + heart.getSwConnection());
			
		} catch (InvalidProtocolBufferException e) {
		} catch (Error e) {
			// TODO: handle exception
			log.info("heart:" + heart);
		}
	}

	// RSSI消息
	public void RSSI(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.RSSI rssi = null;
		try {
			rssi = TrunkCommon.RSSI.parseFrom(result);
			/*log.info("==========[RSSI信息]=======");
			log.info("[RSSI]----meetid>>" + rssi.getMeetid());
			log.info("[RSSI]----slot>>" + rssi.getSlot());
			log.info("[RSSI]----bsId>>" + rssi.getBsid());
			log.info("[RSSI]----rssi>>" + rssi.getRssi());
			log.info("----------------------------");*/
		} catch (InvalidProtocolBufferException e) {
			// TODO Auto-generated catch block
			log.info("===[ERROR]====RSSI");
		}
		// m_rssi=rssi.getRssi();
		rssi_map.put(String.valueOf(rssi.getBsid()),
				String.valueOf(rssi.getRssi()));

		if (rssi.getBsid() > 0) {
			ArrayList list = new ArrayList();
			Map map = new HashMap();
			map.put("bsId", rssi.getBsid());
			map.put("rssi", rssi.getRssi());
			list.add(map);
			String jsonstr = json.Encode(list);
			SocketDwr.rssi(jsonstr);
		}
	}
	// 71)应答设置模拟到数字通道使能开关
	public void A2DEnableRES(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkMsoDs.A2DEnableRES a2d = null;
		try {
			a2d = TrunkMsoDs.A2DEnableRES.parseFrom(result);
			log.info("DS<-MSO [A2DEnableRES]----ack>>" +a2d.getAck()+";enable="+a2d.getEnable());
		} catch (InvalidProtocolBufferException e) {
			
		}
		BsStationAction.setMoniSwitch(a2d.getEnable());
	}
	public void MuticastSrcBSRES(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkMsoDs.MuticastSrcBSRES muticastSrcBSRES = null;
		try {
			muticastSrcBSRES = TrunkMsoDs.MuticastSrcBSRES.parseFrom(result);
			log.info("DS<-MSO [MuticastSrcBSRES]----ACK>>" + muticastSrcBSRES.getAck()+";bsId="+muticastSrcBSRES.getMcsrcbsid());
		} catch (InvalidProtocolBufferException e) {

		}
		Map map = new HashMap();
		map.put("bsId", muticastSrcBSRES.getMcsrcbsid());
		map.put("bsName", xhSql.bsId_bsName(muticastSrcBSRES.getMcsrcbsid()));
		String jsonstr = json.Encode(map);
		IndexDwr.MuticastsrcBsid(jsonstr);
	}

	// 63)更改基站参数应答
	public void UpdateBSRES(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkMsoDs.UpdateBSRES offLineCh = null;
		try {
			offLineCh = TrunkMsoDs.UpdateBSRES.parseFrom(result);
			log.info("DS<-MSO[UpdateBSRES]----bsId>>"
					+ Arrays.toString(offLineCh.getBsidList().toArray())+";OK="+ offLineCh.getAck());
		} catch (InvalidProtocolBufferException e) {
			// TODO Auto-generated catch block
		}
	}

	// 发送短信
	public void senSms(int len, byte[] buf, String callid) {

		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.SMS sms = null;
		try {
			sms = TrunkCommon.SMS.parseFrom(result);
		} catch (InvalidProtocolBufferException e) {
			// TODO Auto-generated catch block
			// func.ucs2ToUtf8(sms.getContent().toByteArray())
			e.printStackTrace();
		}
		byte[] valueArr = sms.getContent().toByteArray();

		try {

		} catch (ArrayIndexOutOfBoundsException e) {
			// TODO: handle exception
			log.error("短信数组超界");
		}

		byte[] arr = func.ucs2ToUtf8(valueArr);
		log.info("====短信=====");
		log.info("[SMS]----type>>" + sms.getType());
		log.info("[SMS]----Srcid>>" + sms.getSrcid());
		log.info("[SMS]----Tarid>>" + sms.getTarid());
		log.info("[SMS]----Content.recv>>"
				+ Arrays.toString(sms.getContent().toByteArray()));
		try {
			log.info("[SMS]----Content.ToUtf8>>" + new String(arr, "utf-8"));
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		log.info("[SMS]----OK>>" + sms.getAck().toString());
		log.info("[SMS]----Mark>>" + sms.getMark());
		int msc = Integer.parseInt(func.readXml("sms", "msc"));
		int dst = Integer.parseInt(func.readXml("call", "pptId"));

		if (sms.getType().toString().indexOf("SETUP_I") > -1
				&& msc == sms.getTarid()) {

			try {
				MessageStruct header = new MessageStruct();
				SendData send = new SendData();
				SmsStruct struct = new SmsStruct();
				struct.setSrcId(sms.getSrcid());
				struct.setTarid(sms.getTarid());
				struct.setIg(1);
				struct.setSlot(0);
				String message = new String(arr, "utf-8");
				struct.setContent(message);
				header.setCMDId((short) 2); // 命令id
				Thread.sleep(100);
				send.SMS(header, struct);
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		if (sms.getAck().toString().equals("OK") && sms.getMark() == 1) {
			int ig = 0;
			if (sms.getType().toString().indexOf("SETUP_I") > -1) {
				ig = 0;
			} else if (sms.getType().toString().indexOf("SETUP_G") > -1) {
				ig = 1;

			} else {
				ig = -1;
			}

			String sql_send = null;
			try {
				sql_send = "insert into xhdigital_sendsms(srcId,dstId,content,IG,writeTime)VALUES('"
						+ sms.getSrcid()
						+ "',"
						+ "'"
						+ sms.getTarid()
						+ "','"
						+ new String(arr, "utf-8")
						+ "','"
						+ ig
						+ "','"
						+ func.nowDate() + "')";
			} catch (UnsupportedEncodingException e2) {
				// TODO Auto-generated catch block
				e2.printStackTrace();
			}
			String sql_recv = null;
			try {
				sql_recv = "insert into xhdigital_recvsms(srcId,dstId,content,writeTime)VALUES('"
						+ sms.getSrcid()
						+ "',"
						+ "'"
						+ sms.getTarid()
						+ "','"
						+ new String(arr, "utf-8")
						+ "','"
						+ func.nowDate()
						+ "')";
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			/*
			 * System.out.println("sms:"+sms.getSrcid());
			 * System.out.println("sms:"+SendData.getSrcId());
			 */

			try {
				if (sms.getSrcid() == SendData.getSrcId()) {
					Sql.Update(sql_send);
				} else {
					Sql.Update(sql_recv);
				}
				SendData.setSrcId(0);

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	// 遥测基站
	public void BsControl(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		TrunkCommon.BSControl bs = null;
		try {
			bs = TrunkCommon.BSControl.parseFrom(result);
		} catch (InvalidProtocolBufferException e) {
			// TODO Auto-generated catch block
			log.info("===[ERROR]====BSControl");
		}
		log.info("DS<-CENTER[BSControl]----BsId=" + bs.getBsid()+";Type="+bs.getType()+";content="+bs.getContent().toStringUtf8());
		String index = bs.getType().toString();
		BsControlType type = null;
		if (index.equals("STATUS")) {
			type = BsControlType.STATUS;
		} else if (index.equals("REBOOT")) {
			type = BsControlType.REBOOT;
		} else if (index.equals("INTERFERE")) {
			type = BsControlType.INTERFERE;
		} else if (index.equals("RSSI")) {
			type = BsControlType.RSSI;
		} else if (index.equals("SLEEP")) {
			type = BsControlType.SLEEP;
		} else if (index.equals("GPSDATA")) {
			type = BsControlType.GPSDATA;
		} else if (index.equals("PWSET")) {
			type = BsControlType.PWSET;
		} else if (index.equals("PWRELOAD")) {
			type = BsControlType.PWRELOAD;
		}
		/*
		 * STATUS = 0; //获取状态 REBOOT = 1; //重启系统 INTERFERE = 3; //干扰 RSSI = 4;
		 * //获取RSSI SLEEP = 5; //基站联网/脱网 GPSDATA = 6; //获取GPS PWSET = 7;
		 * //功率设置(content为功率值,范围1-50) PWRELOAD = 8; //功率标定
		 */
		switch (type) {
		case STATUS:
			Bs_Control_Status(bs); // 遥测基站
			break;
		case GPSDATA:
			GPSDATA(bs);
			break;

		default:
			break;
		}
	}

	public void Bs_Control_Status(TrunkCommon.BSControl bs) {
		// log.info("==[基站状态]==");
		String[] conString = bs.getContent().toStringUtf8().split(":");

		int model = xhSql.bsId_model(bs.getBsid());

		if (conString[0].equals("BS_STATUS")) {
			bsStatusStruct bsStruct = new bsStatusStruct();
			try {
				bsStruct.setBsChannel_status(Integer.parseInt(conString[1]));
				bsStruct.setjI_status(Integer.parseInt(conString[2]));
				bsStruct.setChannel_add_I_status(Integer.parseInt(conString[3]));
				bsStruct.setChannel_alarm_status(Integer.parseInt(conString[4]));
				bsStruct.setBusy_status(Integer.parseInt(conString[5]));
				bsStruct.setPtt_status(Integer.parseInt(conString[6]));
				bsStruct.setRep_status(Integer.parseInt(conString[7]));
				bsStruct.setChannel_number(Integer.parseInt(conString[8]) + 1);
				bsStruct.setTemp1(Integer.parseInt(conString[9]));
				bsStruct.setzV(Integer.parseInt(conString[10]));
				bsStruct.setzI(Integer.parseInt(conString[11]));
				bsStruct.setSend_power(Integer.parseInt(conString[12]));
				bsStruct.setdB(Integer.parseInt(conString[13], 16));
				bsStruct.setjV(Integer.parseInt(conString[14]));
				bsStruct.setBack_power(Integer.parseInt(conString[15]));
				bsStruct.setTemp2(Integer.parseInt(conString[16]));
				bsStruct.setGps(Integer.parseInt(conString[17].split("=")[1]));
				bsStruct.setSleep(Integer.parseInt(conString[18].split("=")[1]
						.split(";")[0]));
				//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
				int temp=Integer.parseInt(func.readXml("Alarm", "temp"));
				int bpower=Integer.parseInt(func.readXml("Alarm", "back_power"));				
				alarm(4, bsStruct.getTemp1()>temp?0:1, bs.getBsid());
				/*alarm(5, bsStruct.getGps(), bs.getBsid());*/
				alarm(6, bsStruct.getBack_power()>bpower?0:1, bs.getBsid());
				alarm(7, bsStruct.getjI_status(), bs.getBsid());
				IndexDwr.alarmDwr();
				
		
				String sql_s = "select bsId from xhdigital_bs_control where bsId="
						+ bs.getBsid();
				String sql_i = "insert into xhdigital_bs_control(bsId,"
						+ "channel_add_I_status,channel_number,temp1,zV,zI,send_power,dB,"
						+ "jV,gps,sleep,time,bsChannel_status,jI_status,channel_alarm_status,busy_status,ptt_status,rep_status,"
						+ "back_power,temp2)" + "VALUES('"
						+ bs.getBsid()
						+ "',"
						+ "'"
						+ bsStruct.getChannel_add_I_status()
						+ "','"
						+ bsStruct.getChannel_number()
						+ "',"
						+ "'"
						+ bsStruct.getTemp1()
						+ "','"
						+ bsStruct.getzV()
						+ "','"
						+ bsStruct.getzI()
						+ "',"
						+ "'"
						+ bsStruct.getSend_power()
						+ "','"
						+ bsStruct.getdB()
						+ "','"
						+ bsStruct.getjV()
						+ "',"
						+ "'"
						+ bsStruct.getGps()
						+ "','"
						+ bsStruct.getSleep()
						+ "','"
						+ func.nowDate()
						+ "',"
						+ "'"
						+ bsStruct.getBsChannel_status()
						+ "',"
						+ "'"
						+ bsStruct.getjI_status()
						+ "','"
						+ bsStruct.getChannel_alarm_status()
						+ "','"
						+ bsStruct.getBusy_status()
						+ "',"
						+ "'"
						+ bsStruct.getPtt_status()
						+ "','"
						+ bsStruct.getRep_status()
						+ "','"
						+ bsStruct.getBack_power()
						+ "','"
						+ bsStruct.getTemp2() + "')";
				String sql_u = "update xhdigital_bs_control set channel_add_I_status='"
						+ bsStruct.getChannel_add_I_status()
						+ "'"
						+ ",channel_number='"
						+ bsStruct.getChannel_number()
						+ "',temp1='"
						+ bsStruct.getTemp1()
						+ "',"
						+ "zV='"
						+ bsStruct.getzV()
						+ "',zI='"
						+ bsStruct.getzI()
						+ "',send_power='"
						+ bsStruct.getSend_power()
						+ "',"
						+ "dB='"
						+ bsStruct.getdB()
						+ "',jV='"
						+ bsStruct.getjV()
						+ "',gps='"
						+ bsStruct.getGps()
						+ "',"
						+ "sleep='"
						+ bsStruct.getSleep()
						+ "',time='"
						+ func.nowDate()
						+ "',bsChannel_status='"
						+ bsStruct.getBsChannel_status()
						+ "',"
						+ "channel_alarm_status='"
						+ bsStruct.getChannel_alarm_status()
						+ "',busy_status='"
						+ bsStruct.getBusy_status()
						+ "',"
						+ "ptt_status='"
						+ bsStruct.getPtt_status()
						+ "',rep_status='"
						+ bsStruct.getRep_status()
						+ "',"
						+ "back_power='"
						+ bsStruct.getBack_power()
						+ "',temp2='"
						+ bsStruct.getTemp2()
						+ "'  where bsId="
						+ bs.getBsid();

				String sql_stra = "update xhdigital_bs_sta set bsChannel_status='"
						+ bsStruct.getBsChannel_status()
						+ "' where bsId="
						+ bs.getBsid();

				String sql_i2 = "insert into xhdigital_bs_status(bsId,"
						+ "channel_add_I_status,channel_number,temp1,zV,zI,send_power,dB,"
						+ "jV,gps,sleep,time,bsChannel_status,jI_status,channel_alarm_status,busy_status,ptt_status,rep_status,"
						+ "back_power,temp2)" + "VALUES('"
						+ bs.getBsid()
						+ "',"
						+ "'"
						+ bsStruct.getChannel_add_I_status()
						+ "','"
						+ bsStruct.getChannel_number()
						+ "',"
						+ "'"
						+ bsStruct.getTemp1()
						+ "','"
						+ bsStruct.getzV()
						+ "','"
						+ bsStruct.getzI()
						+ "',"
						+ "'"
						+ bsStruct.getSend_power()
						+ "','"
						+ bsStruct.getdB()
						+ "','"
						+ bsStruct.getjV()
						+ "',"
						+ "'"
						+ bsStruct.getGps()
						+ "','"
						+ bsStruct.getSleep()
						+ "','"
						+ func.nowDate()
						+ "',"
						+ "'"
						+ bsStruct.getBsChannel_status()
						+ "',"
						+ "'"
						+ bsStruct.getjI_status()
						+ "','"
						+ bsStruct.getChannel_alarm_status()
						+ "','"
						+ bsStruct.getBusy_status()
						+ "',"
						+ "'"
						+ bsStruct.getPtt_status()
						+ "','"
						+ bsStruct.getRep_status()
						+ "','"
						+ bsStruct.getBack_power()
						+ "','"
						+ bsStruct.getTemp2() + "')";

				try {
					if (Sql.exists(sql_s)) {
						Sql.Update(sql_u);
					} else {
						Sql.Update(sql_i);
					}

					Sql.Update(sql_i2);
					Sql.Update(sql_stra);

					SocketDwr.BsControlDwr();
					HashMap result = new HashMap();
					result.put("bsId", bs.getBsid());
					result.put("bsChannel_status",
							bsStruct.getBsChannel_status());
					result.put("online", Sql.bsId_online(bs.getBsid()));
					result.put("model", xhSql.bsId_model(bs.getBsid()));
					result.put("linkModel", Sql.bsId_linkModel(bs.getBsid()));
					result.put("status", Sql.bsId_status(bs.getBsid()));
					String jsonstr = json.Encode(result);
					SocketDwr.BsControl(jsonstr);

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				if (bsStruct.getGps() == 1) {
					MessageStruct struct = new MessageStruct();
					Sql.updategpsLost(bs.getBsid());
					String sql_gps = "select id from xhdigital_bs_sta where lng>0 and lat>0 and bsId="
							+ bs.getBsid();
					try {
						SendData sendData = new SendData();
						if (!Sql.exists(sql_gps)) {
							sendData.BSControl(struct, bs.getBsid(), "",
									TrunkCommon.BSControl.TYPE.GPSDATA);
						}

					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				} else {
					Sql.gpsLostAlarm(bs.getBsid());
				}
			} catch (NumberFormatException e) {
				// TODO: handle exception
				log.info("数据包格式不正确");
			}
		} else if (conString[0].equals("cmdgetstatus;")) {
			String sql_s = "select bsId from xhdigital_bs_control where bsId="
					+ bs.getBsid();
			String sql_i = "insert into xhdigital_bs_control(bsId,time,channel_add_I_status)"
					+ "VALUES('" + bs.getBsid() + "','" + func.nowDate() + "',1)";

			String sql_u = "update xhdigital_bs_control set channel_add_I_status=''"
					+ ",channel_number='',temp1='',zV='',zI='',send_power='',dB='',jV='',gps='',"
					+ "sleep='',time='"
					+ func.nowDate()
					+ "' where bsId="
					+ bs.getBsid()+" and bsId!=65535";
			String sql2 = "insert into xhdigital_bs_status(bsId,time)"
					+ "VALUES('" + bs.getBsid() + "','" + func.nowDate() + "')";

			try {
				if (Sql.exists(sql_s)) {
					Sql.Update(sql_u);
				} else {
					Sql.Update(sql_i);
				}
				Sql.Update(sql2);
				SocketDwr.BsControlDwr();

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

	public void GPSDATA(TrunkCommon.BSControl bs) {
		log.info("==[" + bs.getBsid() + "号基站 经纬度]==");
		log.info("----------------------------");
		String[] str = bs.getContent().toStringUtf8().split(":");
		if (str[0].equals("GPS")) {
			DecimalFormat formater = new DecimalFormat(); // 保留几位小数
			formater.setMaximumFractionDigits(6);

			String longitude = formater
					.format(Double.parseDouble(str[2]) / 100);
			String latitude = formater.format(Double.parseDouble(str[1]) / 100);

			Double lat1 = Double.parseDouble("0." + latitude.split("\\.")[1]) * 100 / 60;
			Double lng1 = Double.parseDouble("0." + longitude.split("\\.")[1]) * 100 / 60;

			Double lat = Double.parseDouble(latitude.split("\\.")[0]) + lat1;
			Double lng = Double.parseDouble(longitude.split("\\.")[0]) + lng1;

			/*
			 * log.debug("lng:"+lat); log.debug("lat:"+lng);
			 */

			String height = formater.format(Double.parseDouble(str[3]));
			int star = Integer.parseInt(str[4].split(";")[0]);
			String sql_s = "select bsId from xhdigital_bs_sta where bsId="
					+ bs.getBsid();
			// String sql1_i="insert into xhdigital_bs_sta()";

			String sql_gps = "select id from xhdigital_bs_sta where lng>0 and lat>0 and bsId="
					+ bs.getBsid();

			String sql_u = "update xhdigital_bs_sta set longitude='" + lng
					+ "',latitude='" + lat + "',height='" + height + "',star="
					+ star + " where bsId=" + bs.getBsid();

			String sql_gps_u = "update xhdigital_bs_sta set lng='" + lng
					+ "',lat='" + lat + "' where bsId=" + bs.getBsid();

			try {
				Sql.Update(sql_u);
				if (!Sql.exists(sql_gps)) {
					Sql.Update(sql_gps_u);
				}

			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

		}

	}

	// 获取基站状态
	public void bsStatus(int len, byte[] buf) {
		result = new byte[len - 26];
		System.arraycopy(buf, 24, result, 0, len - 26);
		NetDataTypeTransform dd = new NetDataTypeTransform();
		TrunkMsoDs.BSStatusRES res = null;
		try {
			res = TrunkMsoDs.BSStatusRES.parseFrom(result);
		} catch (InvalidProtocolBufferException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		log.info("DS<-MSO [BSStatus]----Length>>" + dd.BigByteArrayToShort(buf, 2)+";bsINFO="+res.getBsinfoCount());
		TrunkMsoDs.BSStatus.Builder bs = TrunkMsoDs.BSStatus.newBuilder();
		ArrayList list = new ArrayList();
		if (res.getAck().toString().equals("OK") && res.getBsinfoCount() > 0) {
			for (int i = 0; i < res.getBsinfoCount(); i++) {
				bs = res.getBsinfo(i).toBuilder();
				HashMap map = new HashMap();
				map.put("bsId", bs.getBsid());
				map.put("channelno", bs.getChannelno() + 1);
				map.put("workstatus", bs.getWorkstatus());
				map.put("model", bs.getAdmode());
				map.put("linkModel", bs.getLinkmode());
				map.put("status", Sql.bsId_status(bs.getBsid()));
				list.add(map);

				/*log.info("BsinfoList:{bsId:" + bs.getBsid() + ";channelno:"
						+ bs.getChannelno() + ";workstatus:"
						+ bs.getWorkstatus() + ";offlinerepeaten:"
						+ bs.getOfflinerepeaten() + ";slot0_stat:"
						+ bs.getSlot0Stat() + ";slot1_stat:"
						+ bs.getSlot1Stat() + ";model:" + bs.getAdmode()
						+ ";4G:" + bs.getLinkmode() + "}");*/

				String sql_s = "select bsId from xhdigital_bs_sta where bsId="
						+ bs.getBsid();
				String sql_i = "insert into xhdigital_bs_sta(bsId,online,bsName,channelno,model,linkModel,rf_send,rf_recv,offlinerepeaten)VALUES('"
						+ bs.getBsid()
						+ "','"
						+ bs.getWorkstatus()
						+ "','"
						+ xhSql.bsId_bsName(bs.getBsid())
						+ "',"
						+ "'"
						+ (bs.getChannelno() + 1)
						+ "','"
						+ bs.getAdmode()
						+ "','"
						+ bs.getLinkmode()
						+ "',"
						+ "'"
						+ xhSql.bsId_rf_send(bs.getBsid())
						+ "','"
						+ xhSql.bsId_rf_recv(bs.getBsid())
						+ "','"
						+ bs.getOfflinerepeaten() + "')";
				String sql_u = "update xhdigital_bs_sta set online='"
						+ bs.getWorkstatus() + "',bsName='"
						+ xhSql.bsId_bsName(bs.getBsid()) + "',"
						+ "channelno='" + (bs.getChannelno() + 1) + "',model='"
						+ bs.getAdmode() + "',linkModel='" + bs.getLinkmode()
						+ "'," + "rf_send='" + xhSql.bsId_rf_send(bs.getBsid())
						+ "',rf_recv='" + xhSql.bsId_rf_recv(bs.getBsid())
						+ "'" + ", offlinerepeaten='" + bs.getOfflinerepeaten()
						+ "' where bsId=" + bs.getBsid();
				try {
					if (Sql.exists(sql_s)) {
						Sql.Update(sql_u);
					} else {
						Sql.Update(sql_i);
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			HashMap map = new HashMap();

			map.put("items", list);
			String jsonstr = json.Encode(map);
			SocketDwr.BsStatus(jsonstr);

			// SocketDwr.BsViewDwr();

		}

	}

	// 转16进制
	public String HexString(byte[] src) {
		String str = "";
		int v1 = src[0] & 0xFF;
		int v2 = src[1] & 0xFF;
		str = Integer.toHexString(v1) + Integer.toHexString(v2);
		return str;
	}

	public static byte[] getBufferFlag() {
		return bufferFlag;
	}

	public static void setBufferFlag(byte[] bufferFlag) {
		TcpKeepAliveClient.bufferFlag = bufferFlag;
	}

	public static String getFilePath() {
		return filePath;
	}

	public static void setFilePath(String filePath) {
		TcpKeepAliveClient.filePath = filePath;
	}

	public static long getTimeStart() {
		return timeStart;
	}

	public static void setTimeStart(long timeStart) {
		TcpKeepAliveClient.timeStart = timeStart;
	}

	public static String getDate() {
		return date;
	}

	public static void setDate(String date) {
		TcpKeepAliveClient.date = date;
	}

	public static String getFileName() {
		return fileName;
	}

	public static void setFileName(String fileName) {
		TcpKeepAliveClient.fileName = fileName;
	}

	public static Socket getSocket() {
		return socket;
	}

	public static void setSocket(Socket socket) {
		TcpKeepAliveClient.socket = socket;
	}

	public static byte[] getResult() {
		return result;
	}

	public static void setResult(byte[] result) {
		TcpKeepAliveClient.result = result;
	}

	public int getSlot() {
		return slot;
	}

	public void setSlot(int slot) {
		this.slot = slot;
	}

	public TcpKeepAliveClient(String ip, int port) {
		this.ip = ip;
		this.port = port;
	}

	public boolean isConnected() {
		return connected;
	}

	public void setConnected(boolean connected) {
		this.connected = connected;
	}

	public static int getComID() {
		return comID;
	}

	public static void setComID(int comID) {
		TcpKeepAliveClient.comID = comID;
	}

	public static int getBufLen() {
		return bufLen;
	}

	public static void setBufLen(int bufLen) {
		TcpKeepAliveClient.bufLen = bufLen;
	}

	public static int getUsetime() {
		return usetime;
	}

	public static void setUsetime(int usetime) {
		TcpKeepAliveClient.usetime = usetime;
	}

	public static String getCallId() {
		return callId;
	}

	public static void setCallId(String callId) {
		TcpKeepAliveClient.callId = callId;
	}

	public static String getCallType() {
		return callType;
	}

	public static void setCallType(String callType) {
		TcpKeepAliveClient.callType = callType;
	}

	public static byte[] getWriteBuf() {
		return writeBuf;
	}

	public static void setWriteBuf(byte[] writeBuf) {
		TcpKeepAliveClient.writeBuf = writeBuf;
	}

	public static long getTime() {
		return time;
	}

	public static void setTime(long time) {
		TcpKeepAliveClient.time = time;
	}

	public static ArrayList<HashMap<String, Object>> getCallList() {
		return callList;
	}

	public static void setCallList(ArrayList<HashMap<String, Object>> callList) {
		TcpKeepAliveClient.callList = callList;
	}

	public static HashMap<String, Object> getStartTimeMap() {
		return startTimeMap;
	}

	public static void setStartTimeMap(HashMap<String, Object> startTimeMap) {
		TcpKeepAliveClient.startTimeMap = startTimeMap;
	}

	public static ArrayList<HashMap<String, Object>> getBsInfoList() {
		return bsInfoList;
	}

	public static void setBsInfoList(
			ArrayList<HashMap<String, Object>> bsInfoList) {
		TcpKeepAliveClient.bsInfoList = bsInfoList;
	}

	public static ArrayList getColorList() {
		return colorList;
	}

	public static void setColorList(ArrayList colorList) {
		TcpKeepAliveClient.colorList = colorList;
	}

	public static HashMap<String, Map> getCallMap() {
		return callMap;
	}

	public static void setCallMap(HashMap<String, Map> callMap) {
		TcpKeepAliveClient.callMap = callMap;
	}

	public static int getM_rssi() {
		return m_rssi;
	}

	public static void setM_rssi(int m_rssi) {
		TcpKeepAliveClient.m_rssi = m_rssi;
	}

	public static HashMap<String, String> getRssi_map() {
		return rssi_map;
	}

	public static void setRssi_map(HashMap<String, String> rssi_map) {
		TcpKeepAliveClient.rssi_map = rssi_map;
	}

	public static int getM_calling() {
		return m_calling;
	}

	public static void setM_calling(int m_calling) {
		TcpKeepAliveClient.m_calling = m_calling;
	}

	public static HashMap<String, ArrayList> getColorMap() {
		return colorMap;
	}

	public static void setColorMap(HashMap<String, ArrayList> colorMap) {
		TcpKeepAliveClient.colorMap = colorMap;
	}

	public static int getM_countin() {
		return m_countin;
	}

	public static void setM_countin(int m_countin) {
		TcpKeepAliveClient.m_countin = m_countin;
	}

}

class HeartBeat extends TimerTask {
	private Socket socket = null;
	private TcpKeepAliveClient tcp;
	protected final Log log = LogFactory.getLog(HeartBeat.class);

	public HeartBeat(Socket socket) throws Exception {
		this.socket = socket;

	}

	public void run() {
		NetDataTypeTransform dd = new NetDataTypeTransform();
		// ===============================protoco buf 数据
		TrunkMsoBs.HeartBeatIN.Builder builder = TrunkMsoBs.HeartBeatIN
				.newBuilder();
		builder.setWorkstatus(1);
		TrunkMsoBs.HeartBeatIN dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		MessageStruct mStruct = new MessageStruct();
		if (socket.isConnected()) {
			try {
				OutputStream out = socket.getOutputStream();
				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				DataOutputStream dos = new DataOutputStream(bos);

				dos.writeShort(mStruct.getCMDHeader()); // commandHeader 2
				// 命令开始字段
				dos.writeShort(mStruct.getLength() + buffer.length);// length 2
				// 后接数据长度
				dos.writeShort(512);// commandId 2 命令ID
				dos.write(dd.LongData(mStruct.getCallID(), 8));// businessSN 8
				// 业务流水号
				dos.writeShort(mStruct.getSeqNum());
				;// segNum 2 分片总数
				dos.write(dd.LongData(mStruct.getReserved(), 8));
				/**************** content ***********************/
				dos.write(buffer);
				/**************** content ***********************/
				dos.writeShort(mStruct.getCheckSum());

				byte[] info = bos.toByteArray();
				if (TcpKeepAliveClient.getSocket().isConnected()) {
					out.write(info);
					/*
					 * SocketDwr.refresh(); SocketDwr.callColor("1,2" + "," +
					 * true);
					 */
				}

			} catch (IOException e) {
			}
		} else {
			log.info("====Timer:socket closed!!====");
		}
	}
}
