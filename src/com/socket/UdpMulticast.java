package com.socket;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.config.config;
import com.func.WebFun;
import com.google.protobuf.InvalidProtocolBufferException;
import com.protobuf.TrunkCommon;
import com.sql.SysMysql;
import com.sql.XhMysql;

public class UdpMulticast extends Thread {
	public static config config = new config();
	protected final Log log = LogFactory.getLog(UdpMulticast.class);
	private static int gpsNum = -1;
	private WebFun func = new WebFun();
	private static String IP;
	private static int Port;
	private static int voice_cache_num=0;
	private XhMysql db = new XhMysql();
	protected final Log log4j=LogFactory.getLog(UdpMulticast.class);

	public void run() {
		recvData();
	}

	public void recvData() {
		InetAddress inetRemoteAddr = null;
	    IpPort();
		
		try {
			inetRemoteAddr = InetAddress.getByName(IP);
		} catch (UnknownHostException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		byte buf[] = new byte[256];
		DatagramPacket recvPack = new DatagramPacket(buf, buf.length);
		MulticastSocket server = null;
		try {
			server = new MulticastSocket(Port);
		} catch (SocketException e2) {
			// TODO Auto-generated catch block
			log4j.error(e2.fillInStackTrace());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/*
		 * 如果是发送数据报包,可以不加入多播组; 如果是接收数据报包,必须加入多播组; 这里是接收数据报包,所以必须加入多播组;
		 */
		try {
			server.joinGroup(inetRemoteAddr);
			if (server.isConnected()) {
				log.debug("---------------------------------");
				log.debug("Multicast start......");
				log4j.info("IP:"+IP);
				log4j.info("Port:"+Port);
				log.debug("---------------------------------");
			}
		}catch(SocketException e){
			log4j.error(e.fillInStackTrace());
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		while (true) {
			try {
				server.receive(recvPack);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			byte[] recvByte = Arrays.copyOfRange(recvPack.getData(), 0,recvPack.getLength());
			byte[] bufH=new byte[2];
			System.arraycopy(recvByte, 0, bufH, 0, 2);
			//log4j.debug(func.BytesToHexS(recvByte));
			if (HexString(bufH).equals("c4d7")) {
				byte[] result = new byte[recvByte.length - 26];
				
				System.arraycopy(recvByte, 24, result, 0, recvByte.length - 26);
				//log4j.debug(func.BytesToHexS(result));
				TrunkCommon.GpsSecond gps = null;
				try {
					gps = TrunkCommon.GpsSecond.parseFrom(result);
				} catch (InvalidProtocolBufferException e) {
					// TODO Auto-generated catch block
					//e.printStackTrace();
					log4j.error(e.fillInStackTrace());
				}
				    gpsNum = gps.getGpsnum();
				    //log4j.info("==========gpsnum:"+gpsNum+";scoed:"+gps.getBsid()+"; s:"+gps.getSecond());
			}
			
			
			
			
		}

	}
	public String HexString(byte[] src) {
		String str = "";
		int v1 = src[0] & 0xFF;
		int v2 = src[1] & 0xFF;
		str = Integer.toHexString(v1) + Integer.toHexString(v2);
		return str;
	}

	public void IpPort() {
		String sql = "select multicastip,multicastport,voice_cache_num from systemconfig limit 1";
		Connection conn = db.getConn();
		Statement stmt;
		try {
			stmt = conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			rst.next();
			IP = rst.getString("multicastip");
			Port = rst.getInt("multicastport")+1;
			voice_cache_num=rst.getInt("voice_cache_num");
			rst.close();
			stmt.close();
			conn.close();
		} catch (NullPointerException e) {
			log4j.error("gei ip,port error");
		}
		   catch (SQLException e) {}
		
	}

	public static void main(String[] args) {
		UdpMulticast uml = new UdpMulticast();
		uml.start();

	}

	public static int getGpsNum() {
		return gpsNum;
	}

	public static void setGpsNum(int gpsNum) {
		UdpMulticast.gpsNum = gpsNum;
	}

	public static int getVoice_cache_num() {
		return voice_cache_num;
	}

	public static void setVoice_cache_num(int voice_cache_num) {
		UdpMulticast.voice_cache_num = voice_cache_num;
	}

}
