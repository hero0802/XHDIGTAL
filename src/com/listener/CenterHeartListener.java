package com.listener;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.protobuf.TrunkMsoBs;
import com.socket.MessageStruct;
import com.socket.NetDataTypeTransform;
import com.socket.TcpKeepAliveClient;


public class CenterHeartListener  implements ServletContextListener{
	private static Timer timer=null;

	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		if (timer!=null) {
			timer.cancel();
		}
	}

	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		if (timer==null) {
			timer=new Timer();
		}
		try {
			timer.scheduleAtFixedRate(new Heart(TcpKeepAliveClient.getSocket()) ,2000,1000*3);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
class Heart extends TimerTask {
	private Socket socket = null;
	private TcpKeepAliveClient tcp;
	protected final Log log = LogFactory.getLog(HeartBeat.class);

	public Heart(Socket socket) throws Exception {
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
		try {
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
		} catch (NullPointerException e) {
			// TODO: handle exception
			log.error("还没建立TCP长连接");
		}
		
	}
}


