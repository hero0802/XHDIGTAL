package com.socket;

import java.io.File;
import java.io.IOException;
import java.net.BindException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.action.BsStationAction;
import com.config.config;
import com.func.WebFun;
import com.protobuf.TrunkCommon;
import com.servlet.loginFilter;
import com.sound.WavPlay;
import com.struct.WavHeaderStruct;

public class VoiceUDP extends Thread {
	public static config config = new config();
	protected final static Log log = LogFactory.getLog(VoiceUDP.class);
	private static WebFun func = new WebFun();
	private static DatagramSocket socket = null;
	private boolean isconnected = false;
	public static byte[] data = new byte[2000];
	public static int index = 0;
	private static Map<String, List<byte[]>> voiceMap = new HashMap<String, List<byte[]>>();

	public VoiceUDP() {
	}

	public void run() {
		/* System.out.println("-------主监听线程----------start----------"); */
		NetDataTypeTransform dd = new NetDataTypeTransform();
		while (!isconnected) {

			if (socket == null || socket.isClosed()) {
				try {
					socket = new DatagramSocket(Integer.parseInt(func.readXml(
							"centerNet", "udp_port")));
					isconnected = true;
					log.debug("Listener  udp port success");
					log.info("======================================================");
					log.info("================语音监听系统=====================");
					log.info("======================================================");
					log.info("Listener voice udp port:"
							+ Integer.parseInt(func.readXml("centerNet",
									"udp_port")) + "  success");

				} catch (BindException e) {
					log.error("Listener  udp port error");
					log.error(e.fillInStackTrace());
					isconnected = false;
					try {
						Thread.sleep(3000);
					} catch (InterruptedException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				} catch (NullPointerException e) {
					/* log.info("[UDP Call Data]==空异常：" + e.fillInStackTrace()); */
					// isconnected=false;
				} catch (ArrayIndexOutOfBoundsException e) {
					// TODO: handle exception

				} catch (IOException e) {
					// TODO Auto-generated catch block
					isconnected = false;
					// log.info("监听语音端口失败");

				}// Socket对象.端口3000

			}
			try {// 数据长度 3+100+8
				byte buf[] = new byte[111];
				byte[] voiceData = new byte[100];
				byte[] udpData = new byte[103];
				byte[] callIdByte = new byte[8];
				DatagramPacket packet = new DatagramPacket(buf, buf.length);
				while (isconnected) {
					socket.receive(packet);
					int len = packet.getLength();
					String callid = "";
					if (len >= 103) {
						try {
							System.arraycopy(buf, 3, voiceData, 0, 100);
							System.arraycopy(buf, 103, callIdByte, 0, 8);
							System.arraycopy(buf, 0, udpData, 0, 103);
							callid = dd.ByteArraytoString(callIdByte, 0, 8);

							String filestr = TcpKeepAliveClient.getCallMap().get(callid).get("fileName").toString();
							if (filestr != null) {// config.ReadConfig("voicePath")
								func.writeVoiceFile(filestr, voiceData);

							}

							if (BsStationAction.getMonitorMap().size() > 0) {
								Iterator iter = BsStationAction.getMonitorMap()
										.entrySet().iterator();
								while (iter.hasNext()) {
									Map.Entry entry = (Map.Entry) iter.next();
									Object key = entry.getKey();
									sendData(udpData, key.toString());
								}
							}

						} catch (NullPointerException e) {

						} catch (ArrayIndexOutOfBoundsException e) {

						}
					}

				}
			} catch (Exception e) {
				socket.close();
				isconnected = false;
				log.info("UDP disconnect!");
			}
		}
	}

	public static void sendData(byte[] str, String ip) {
		/* 获取服务器地址 */
		InetAddress serverIp = null;
		try {
			serverIp = InetAddress.getByName(ip);
			int port = Integer.parseInt(func.readXml("sound", "port"));
			DatagramPacket sendPacket = new DatagramPacket(str, str.length,
					serverIp, port);
			socket.send(sendPacket);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static DatagramSocket getSocket() {
		return socket;
	}

	public static void setSocket(DatagramSocket socket) {
		VoiceUDP.socket = socket;
	}

	public static byte[] getData() {
		return data;
	}

	public static void setData(byte[] data) {
		VoiceUDP.data = data;
	}

	public static Map<String, List<byte[]>> getVoiceMap() {
		return voiceMap;
	}

	public static void setVoiceMap(Map<String, List<byte[]>> voiceMap) {
		VoiceUDP.voiceMap = voiceMap;
	}

	public static int getIndex() {
		return index;
	}

	public static void setIndex(int index) {
		VoiceUDP.index = index;
	}

}
