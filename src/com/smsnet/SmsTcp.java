package com.smsnet;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.dwr.IndexDwr;
import com.func.WebFun;
import com.func.XhLog;
import com.protobuf.TrunkMsoBs;
import com.socket.MessageStruct;
import com.socket.NetDataTypeTransform;
import com.socket.TcpKeepAliveClient;
import com.sql.SysSql;

public class SmsTcp extends Thread {
	private static Socket socket;
	private static int timeout = 1*60*1000;
	protected final Log log = LogFactory.getLog(SmsTcp.class);
	private String ip;
	private int port;
	private WebFun func = new WebFun();
	private boolean connected = false;
	private static String recvStr="";
	private SendSms sendSms=new SendSms();
	private Sms sms=new Sms();	
	
	private SysSql sysSql=new SysSql();
	private static Timer timer = null;
	private static Timer hearttimer = null;

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	public void run() {

		receive();
	}
	public void connect() {
		if (socket == null || socket.isClosed() || !socket.isConnected()) {
			socket = new Socket();
			ip = func.readXml("sms", "ip");
			port = Integer.parseInt(func.readXml("sms", "port"));
			InetSocketAddress addr = new InetSocketAddress(ip, port);
			try {
				socket.connect(addr, timeout);
				socket.setTcpNoDelay(true);
				socket.setKeepAlive(true);
			} catch (IOException e) {

			}
			try {
				socket.setSoTimeout(timeout);
			} catch (SocketException e) {

				try {
					socket.close();

					try {
						Thread.sleep(1000);
					} catch (InterruptedException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				connected = false;
			}

		}
	}
	// 接收数据
	public void receive() {
		//InputStream input = null;

		while (!connected) {

			try {

				connect();
				//input = socket.getInputStream();
				if (socket.isConnected()) {
					connected = true;
					log.info("sms TCP Connected success!!");  
					//sendSms.sendAt("AT+CSCS=GSM\r");
					//Timer timer = new Timer();
					if (timer==null) {
						timer=new Timer();
						timer.schedule(new AlarmSms(), 2000, 10*1000);
						//timer.schedule(new HeartBeat(), 1000, 60*1000);
					}
					
					//timer.schedule(new HeartBeat(), 1000, 100 * 1000);
					

				}
				//DataInputStream in = new DataInputStream(socket.getInputStream());
				BufferedReader in=new BufferedReader(new InputStreamReader(socket.getInputStream()));
				 PrintWriter out = new PrintWriter(socket.getOutputStream());
				// read body
				//byte[] buf = new byte[4096];// 收到的包字节数组
				 InputStream is=socket.getInputStream(); 
		         byte b[]=new byte[1024]; 
		          
				while (connected) {
					//String res = in.readLine();
					int len=  is.read(b);

					if (len>0 ) {
						 byte c[]=new byte[len];
						
						 System.arraycopy(b, 0, c, 0, len);
						 String str=new String(c);
						 recvStr+=str;
						/* log.info("16进制:"+func.BytesToHexS(str.getBytes()));
						 log.info("16进制123:"+str.indexOf("\r\n"));
						 log.info("recv:"+func.BytesToHexS(recvStr.getBytes()));
						 log.info("recv2:"+recvStr.lastIndexOf("\r\n")+"data:"+(recvStr.length()-2));*/
						 
						 if (recvStr.lastIndexOf("\r\n")==recvStr.length()-2) {
							handler(recvStr);
						}else {
							
						}		

					} else {
						socket.close();
						log.info("====TCP connection is closed!!====");
						log.info("====reconnection now!!====");
						connected = false;
					}
				}

			} catch (SocketException e) {
				log.info("sms tcp connect trying");
				if (socket.isConnected() || socket != null) {
					try {
						socket.close();
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					connected = false;
				}

			} catch (UnknownHostException e) {
				System.out.println("UnknownHostException");
			} catch (IOException e) {
				log.info("sms tcp connect timeout,socket is closed and reconnecting!");
				try {
					socket.close();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				try {
					sleep(1000);
				} catch (InterruptedException e1) {
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
	public void handler(String str){
		//log.info("smsnet:"+str );
		if (str.indexOf("CSQ")==-1) {
			String[] ss=str.split("\r\n");
			for (int i = 0; i < ss.length; i++) {
				if (!ss[i].equals("") && ss[i].indexOf("CSQ")==-1) {
					log.info("smsNet:"+ss[i]);
				}
				
			}
		}
		
		recvStr="";
		
	}
	public static Socket getSocket() {
		return socket;
	}
	public static void setSocket(Socket socket) {
		SmsTcp.socket = socket;
	}
	public static String getRecvStr() {
		return recvStr;
	}
	public static void setRecvStr(String recvStr) {
		SmsTcp.recvStr = recvStr;
	}	
	
	

}


class AlarmSms extends TimerTask {
	private Socket socket = null; 
	private SendSms sendSms=new SendSms();
	protected final Log log = LogFactory.getLog(AlarmSms.class);
	private WebFun func = new WebFun();
	private SysSql sysSql=new SysSql();

	private XhLog xhlog=new XhLog();
	public AlarmSms(){

	}

	public void run() {
		if (SmsTcp.getSocket().isConnected()) {
			handler();
		}
	}
	
	public void handler(){
	/*	//sendSms.sendAt("AT+CSCS=GSM\r");
		Thread.sleep(1000);*/
		try {
			
			int index=func.StringToInt(func.readXml("Alarm", "open"));
			if (index==1 && sysSql.personList().size()>0 && SmsTcp.getSocket().isConnected()) {
				
				//基站断站告警
				if (sysSql.bsAlarmList().size()>0) {
					
					for (int i=0;i<sysSql.bsAlarmList().size();i++) {
						Map map=sysSql.bsAlarmList().get(i);
						
						
						for (int j = 0; j < sysSql.personList().size(); j++) {
							Sms sms=new Sms();
							sms=sysSql.personList().get(j);
							sms.setMessage(map.get("content").toString());
							sendSms.smsModel();
							Thread.sleep(500);
							log.info("phone:"+sms.getPhoneNumber());
							log.info("sms:"+sms.getMessage());
							sendSms.sendMessage(sms);
							try {
								xhlog.writeLog(5, sms.getMessage(),sms.getPerson());
							} catch (Exception e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							Thread.sleep(5000);
						}
						updateAlarmInfo(1, map.get("bsId").toString());
					}
				}
				//基站gps失锁告警
				if (sysSql.bsgpslost().size()>0) {
					for(int i=0;i<sysSql.bsgpslost().size();i++){
						Map map=sysSql.bsgpslost().get(i);
						try {
							xhlog.writeLog(5, map.get("content").toString(),"网管");
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						for (int j = 0; j < sysSql.personList().size(); j++) {
							Sms sms=new Sms();
							sms=sysSql.personList().get(j);
							sms.setMessage(map.get("bsId").toString()+"号"+map.get("bsName")+"基站GPS失锁！");
							sendSms.smsModel();
							Thread.sleep(500);
							log.info("phone:"+sms.getPhoneNumber());
							log.info("sms:"+sms.getMessage());
							sendSms.sendMessage(sms);
							try {
								xhlog.writeLog(5, sms.getMessage(),sms.getPerson());
							} catch (Exception e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							Thread.sleep(5000);
						}
						updateGpsLostInfo(map.get("bsId").toString());
					}
				}
			//其他告警
			if(sysSql.sysAlarmList().size()>0){
				for(int i=0;i<sysSql.sysAlarmList().size();i++){
					Map map=sysSql.sysAlarmList().get(i);
				
					for (int j = 0; j < sysSql.personList().size(); j++) {
						Sms sms=new Sms();
						sms=sysSql.personList().get(j);
						sms.setMessage(map.get("content").toString());
						sendSms.smsModel();
						Thread.sleep(500);
						log.info("phone:"+sms.getPhoneNumber());
						log.info("sms:"+sms.getMessage());
						sendSms.sendMessage(sms);
						try {
							xhlog.writeLog(5, sms.getMessage(),sms.getPerson());
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						Thread.sleep(5000);
					}
					updateAlarmInfo(Integer.parseInt(map.get("type").toString()), map.get("bsId").toString());
				}
			}
				
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	public void updateAlarmInfo(int type,String bsId){
		String sql="update xhdigital_alarm set flag=1 where type='"+type+"' and alarmId="+bsId;
		try {
			sysSql.Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void updateGpsLostInfo(String bsId){
		String sql="update xhdigital_bs_control_gps set number=0,status=1,time='"+func.nowDate()+"' where bsId="+bsId;
		//String sql="delete from xhdigital_bs_control_gps  where bsId="+bsId;
		try {
			sysSql.Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
