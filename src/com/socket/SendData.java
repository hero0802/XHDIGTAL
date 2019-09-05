package com.socket;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Arrays;
import java.util.HashMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.config.config;
import com.func.WebFun;
import com.google.protobuf.ByteString;
import com.protobuf.TrunkCommon;
import com.protobuf.TrunkMsoDs;
import com.sql.SysMysql;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.struct.BreakCallStruct;
import com.struct.SmsStruct;
import com.struct.bsStatusStruct;

public class SendData {
	// private HttpServletRequest request =ServletActionContext.getRequest();
	private config INI = new config();
	private String message = "";

	private int CLIENT_PORT = Integer.parseInt(INI.ReadConfig("center_port")); // 端口号12002
	private String IP = INI.ReadConfig("center_ip"); // IP192.168.30.12
	protected final static Log log = LogFactory.getLog(SendData.class);
	private static WebFun func = new WebFun();
	private static UdpMulticast uml;
	private static bsStatusStruct bsStruct = new bsStatusStruct();
	private com.func.XhLog llog = new com.func.XhLog();
	// public String ipAddr=llog.getIpAddr(request);

	public static HashMap hashMap = new HashMap();
	private SysSql Sql = new SysSql();
	private XhMysql db = new XhMysql();
	private SysMysql db_sys = new SysMysql();
	private static int srcId = 0;
	Socket socket = TcpKeepAliveClient.getSocket();

	public void connection() {
		InetAddress addr = null;
		try {
			addr = InetAddress.getLocalHost();
		} catch (UnknownHostException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		String ip = addr.getHostAddress();
		try {
			if (socket == null || socket.isClosed()) {
				socket = new Socket(IP, CLIENT_PORT);
				System.out.println("connection!!");
			}
		} catch (UnknownHostException e) {
			message = "没有找到主机，请检查端口号或者主机IP地址是否正确";
			System.out.print(message);
			// e.printStackTrace();
		} catch (IOException e) {
			message = "网络断开";
			System.out.println(message);
			// e.printStackTrace();
		}
		try {
			socket.setSoTimeout(10000);
		} catch (SocketException e1) {
			message = "对方没有应答";
			System.out.print(message);
			// e1.printStackTrace();
		}
		try {
			socket.setKeepAlive(true);
		} catch (SocketException e) {
			message = "网络已经断开";
			System.out.print(message);
			// e.printStackTrace();
		}// 开启保持活动状态的套接字
			// socket.setSoTimeout(10000);
	}

	// 70)设置模拟到数字通道使能开关
	public String SetA2DEnable(MessageStruct getHeader, int enable)
			throws IOException {
		/*
		 * message SetA2DEnable { required uint32 enable = 1; //0:切断模拟到数字
		 * 1:允许模拟到数字 }
		 */
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		TrunkMsoDs.SetA2DEnable.Builder builder = TrunkMsoDs.SetA2DEnable
				.newBuilder();
		builder.setEnable(enable);

		TrunkMsoDs.SetA2DEnable dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 543);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":SetA2DEnable:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8) + "; enable="
					+ enable);
			out.write(info);
		} else {
			return "NO";
		}
		return "OK";
	}

	public String SetA2DEnable2(MessageStruct getHeader, int enable)
			throws IOException {
		/*
		 * message SetA2DEnable { required uint32 enable = 1; //0:切断模拟到数字
		 * 1:允许模拟到数字 }
		 */
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		TrunkMsoDs.SetA2DEnable.Builder builder = TrunkMsoDs.SetA2DEnable
				.newBuilder();
		builder.setEnable(enable);

		TrunkMsoDs.SetA2DEnable dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 545);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":SetA2DEnable:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8) + "; enable="
					+ enable);
			out.write(info);
		} else {
			return "NO";
		}
		return "OK";
	}

	// 70)设置模拟到数字通道使能开关
	public String A2DEnableREQ(MessageStruct getHeader) throws IOException {
		/*
		 * message SetA2DEnable { required uint32 enable = 1; //0:切断模拟到数字
		 * 1:允许模拟到数字 }
		 */
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength());// length 2 后接数据长度
		dos.writeShort((short) 544);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":A2DEnableREQ:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8) + "");
			out.write(info);
		} else {
			return "NO";
		}
		return "OK";
	}

	// 设置PTT统计基站
	public static String SetPTTStatsBS(MessageStruct getHeader, int bsId)
			throws IOException {
		/*
		 * message SetA2DEnable { required uint32 enable = 1; //0:切断模拟到数字
		 * 1:允许模拟到数字 }
		 */
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		TrunkMsoDs.SetPTTStatsBS.Builder builder = TrunkMsoDs.SetPTTStatsBS
				.newBuilder();
		builder.setBsid(bsId);

		TrunkMsoDs.SetPTTStatsBS dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength()+buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 546);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":SetPTTStatsBS: bsId=" + bsId);
			out.write(info);
		} else {
			return "NO";
		}
		return "OK";
	}

	// 获取PTT统计基站
	public static String PTTStatsBSREQ()
			throws IOException {
		/*
		 * message SetA2DEnable { required uint32 enable = 1; //0:切断模拟到数字
		 * 1:允许模拟到数字 }
		 */
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);
		MessageStruct getHeader=new MessageStruct();

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength());// length 2 后接数据长度
		dos.writeShort((short) 547);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":PTTStatsBSREQ:");
			out.write(info);
		} else {
			return "NO";
		}
		return "OK";
	}

	// 62)更改基站参数通知中心
	public String UpdateBSREQ(MessageStruct getHeader, String bsIds, int action)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		TrunkMsoDs.UpdateBSREQ.Builder builder = TrunkMsoDs.UpdateBSREQ
				.newBuilder();

		String[] str = bsIds.split(",");
		try {
			for (String string : str) {
				builder.addBsid(Integer.parseInt(string));
			}
			builder.setAction(action);
		} catch (Exception e) {
			// TODO: handle exception
		}

		TrunkMsoDs.UpdateBSREQ dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 518);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			TrunkMsoDs.UpdateBSREQ gps = TrunkMsoDs.UpdateBSREQ
					.parseFrom(buffer);
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":UpdateBSREQ:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8) + "; bsIds="
					+ gps.getBsidList().toString());
			out.write(info);
		} else {
			return "NO";
		}
		return "OK";
	}

	// 过滤Gps
	public String UpdateGPSFileterTable(MessageStruct getHeader, String[] msc,
			int flag) throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */
		TrunkMsoDs.UpdateGPSFileterTable.Builder builder = TrunkMsoDs.UpdateGPSFileterTable
				.newBuilder();
		for (String str : msc) {
			builder.addMscId(Integer.parseInt(str));
		}
		builder.setAction(flag);
		TrunkMsoDs.UpdateGPSFileterTable dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 539);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			TrunkMsoDs.ReadDBREQ db = TrunkMsoDs.ReadDBREQ.parseFrom(buffer);
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":UpdateGPSFileterTable:" + "mscId="
					+ Arrays.toString(msc) + ";action=" + flag);
			out.write(info);
		}
		// log.info("send->同步数据："+Arrays.toString(info));
		return "OK";
	}

	// 数据库操作请求
	public String ReadDBREQ(MessageStruct getHeader, String tableName)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */
		TrunkMsoDs.ReadDBREQ.Builder builder = TrunkMsoDs.ReadDBREQ
				.newBuilder();
		builder.addTablename(tableName);
		TrunkMsoDs.ReadDBREQ dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 524);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			TrunkMsoDs.ReadDBREQ db = TrunkMsoDs.ReadDBREQ.parseFrom(buffer);
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":ReadDBREQ:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8)
					+ "; tableName=" + db.getTablenameList().toString());
			out.write(info);
		}
		// log.info("send->同步数据："+Arrays.toString(info));
		return "OK";
	}

	// // 强拆
	public String CallREQ(MessageStruct getHeader,
			TrunkCommon.CallType callType, BreakCallStruct callStruct)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		TrunkCommon.CallREQ.Builder builder = TrunkCommon.CallREQ.newBuilder();
		builder.setType(callType);
		builder.setSrcid(callStruct.getSrcid());
		builder.setTarid(callStruct.getTarid());
		builder.setPttid(callStruct.getPttid());
		TrunkCommon.CallREQ dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 0);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			TrunkMsoDs.ReadDBREQ db = TrunkMsoDs.ReadDBREQ.parseFrom(buffer);
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":CallREQ:" + "callid=" + getHeader.getCallID()
					+ "; type=" + callType + "; srcid=" + callStruct.getSrcid()
					+ ";tarid=" + callStruct.getTarid());
			out.write(info);
		}
		// log.info("send->同步数据："+Arrays.toString(info));
		return "OK";
	}

	// 组播源请求
	public String MuticastSrcBSREQ(MessageStruct getHeader, int bsId)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */
		TrunkMsoDs.MuticastSrcBSREQ.Builder builder = TrunkMsoDs.MuticastSrcBSREQ
				.newBuilder();
		builder.setMcsrcbsid(bsId);
		TrunkMsoDs.MuticastSrcBSREQ dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 537);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			TrunkMsoDs.MuticastSrcBSREQ muti = TrunkMsoDs.MuticastSrcBSREQ
					.parseFrom(buffer);
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":MuticastSrcBSREQ:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8)
					+ "; Mcsrcbsid=" + muti.getMcsrcbsid());
			out.write(info);
		}
		return "OK";
	}

	// 67)调度台设置模数互联组
	public String SetADGroup(MessageStruct getHeader, int group)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */
		TrunkMsoDs.SetADGroup.Builder builder = TrunkMsoDs.SetADGroup
				.newBuilder();
		builder.setGroupid(group);
		TrunkMsoDs.SetADGroup dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();
		// 发送数据，应该获取Socket流中的输出流。

		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort((short) 540);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":SetADGroup:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8)
					+ "; adgroupid=" + group);
			out.write(info);
		}
		// log.info("send->同步数据："+Arrays.toString(info));
		return "OK";
	}

	// 数据请求[注册、遥晕遥毙、激活]
	public String DataREQ(MessageStruct getHeader, Integer id, int slot,
			TrunkCommon.DeviceType deviceType, TrunkCommon.DataType dataType)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */
		// ===============================protoco buf 数据
		TrunkCommon.DataREQ.Builder builder = TrunkCommon.DataREQ.newBuilder();
		builder.setDeviceType(deviceType);
		builder.setId(id);
		builder.setDataType(dataType);
		builder.setSlot(slot);
		TrunkCommon.DataREQ dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort(6);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			TrunkCommon.DataREQ data = TrunkCommon.DataREQ.parseFrom(buffer);
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":DataREQ:" + "callid=" + getHeader.getCallID()
					+ "; seqNum=" + (getHeader.getSeqNum() << 8)
					+ "; deviceType=" + data.getDeviceType().toString()
					+ "; mscid=" + data.getId() + "; dataType="
					+ data.getDataType() + "; slot=" + data.getSlot());
			out.write(info);
		}
		return "OK";
	}

	// 发送短信
	public String SMS(MessageStruct getHeader, SmsStruct struct)
			throws Exception {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */
		srcId = struct.getSrcId();

		// ===============================protoco buf 数据
		TrunkCommon.SMS.Builder builder = TrunkCommon.SMS.newBuilder();
		builder.setType(struct.getIg() == 1 ? TrunkCommon.SMS.Type.SETUP_G
				: TrunkCommon.SMS.Type.SETUP_I);
		builder.setSrcid(struct.getSrcId());
		builder.setTarid(struct.getTarid());
		builder.setContent(ByteString.copyFrom(func.utf8ToUsc2_712(struct
				.getContent())));
		builder.setMark(1);
		builder.setUdtf(TrunkCommon.SMS.UDTF.UDTF_UNC);
		builder.setSlot(struct.getSlot());
		builder.setSendseqnum(struct.getSendseqnum());
		builder.setMsgseqnum(struct.getMsgseqnum());
		TrunkCommon.SMS sms = builder.build();
		byte[] buffer = sms.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort(getHeader.getCMDId());// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			out.write(info);
			// log.info("send->发送短信：gpsnum="+getHeader.getSeqNum());
			log.info("send->发送短信：" + Arrays.toString(info));
			return "OK";
		}

		return "NO";

	}

	public String setGps(int id, int gpsen, int type, int t_interval,
			int d_index, int pool_ch, int format, int slot, int mask)
			throws IOException {
		MessageStruct m_header = new MessageStruct();
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */

		// ===============================protoco buf 数据
		TrunkCommon.SetGPSTrigger.Builder builder = TrunkCommon.SetGPSTrigger
				.newBuilder();
		builder.setId(id);
		builder.setIg(0);
		builder.setGpsen(gpsen);
		builder.setType(type);
		builder.setTInterval(t_interval);
		builder.setDIndex(d_index);
		builder.setPoolCh(pool_ch);
		builder.setFormat(format);
		// builder.setMask(mask);
		builder.setSlot(slot);
		/* builder.setSlot(value) */
		TrunkCommon.SetGPSTrigger dsReq = builder.build();
		byte[] buffer = dsReq.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);
		MessageStruct m_header1 = new MessageStruct();
		int gpsnum = m_header1.getSeqNum();

		dos.writeShort(m_header.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(m_header.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort(4);// commandId 2 命令ID
		dos.write(dd.LongData(m_header.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(gpsnum);
		// segNum 2 分片总数
		dos.write(dd.LongData(m_header.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(m_header.getCheckSum());

		byte[] info = bos.toByteArray();

		log.debug("-->center:"
				+ TcpKeepAliveClient.getSocket().getInetAddress() + ":setGps:"
				+ "gpsNum:" + (gpsnum >> 8) + ";id=" + id + "; ig=0; gpsen="
				+ gpsen + "; type=" + type + "; t_interval=" + t_interval
				+ "; d_index=" + d_index + "; pool_ch=" + pool_ch + "; format="
				+ format + "; mask=" + mask + "; slot=" + slot);

		out.write(info);

		return "OK";
	}

	// 遥测基站
	public synchronized String BSControl(MessageStruct getHeader, Integer id,
			String content, TrunkCommon.BSControl.TYPE type) throws Exception {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();

		// ===============================protoco buf 数据
		TrunkCommon.BSControl.Builder builder = TrunkCommon.BSControl
				.newBuilder();
		builder.setTsid(id);
		builder.setBsid(id);
		builder.setType(type);
		builder.setContent(ByteString.copyFrom(content.getBytes()));

		TrunkCommon.BSControl bsControl = builder.build();
		byte[] buffer = bsControl.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort(9);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":BSControl:" + "id=" + id + "; type=" + type
					+ "; content=" + content);
			out.write(info);
			log.info("send->遥测基站："+id);
			return "OK";
		}
		return "NO";
	}

	// 设置基站信道号
	public String BSControl_CH(MessageStruct getHeader, Integer id,
			TrunkCommon.BSControl.TYPE type) throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */

		// ===============================protoco buf 数据
		TrunkCommon.BSControl.Builder builder = TrunkCommon.BSControl
				.newBuilder();
		builder.setTsid(id);
		builder.setBsid(id);
		builder.setType(type);
		builder.setContent(ByteString.copyFrom(("cmdsetch:"
				+ (bsStruct.getNumber() - 1) + ";").getBytes()));

		TrunkCommon.BSControl bsControl = builder.build();
		byte[] buffer = bsControl.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort(9);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		log.debug("-->center:"
				+ TcpKeepAliveClient.getSocket().getInetAddress()
				+ ":BSControl_CH:" + "; id=" + id + "; type=" + type
				+ "; content="
				+ ("cmdsetch:" + (bsStruct.getNumber() - 1) + ";"));
		out.write(info);

		// 获得服务器发过来的数据，先获得输入流
		InputStream in = TcpKeepAliveClient.getSocket().getInputStream();
		DataInputStream din = new DataInputStream(in);
		byte[] buf = new byte[1024];
		while (true) {
			int comID = TcpKeepAliveClient.getComID();
			if (comID == 9) {
				buf = TcpKeepAliveClient.getBufferFlag();
				int len = TcpKeepAliveClient.getBufLen();
				log.info("===[设置基站信道号]===");
				log.info("Data----Length>>" + dd.BigByteArrayToShort(buf, 2));
				log.info("Data----CMDId>>" + dd.BigByteArrayToShort(buf, 4));
				log.info("Data----CallID>>" + dd.ByteArraytoString(buf, 6, 8));
				// protocol buf 数据
				byte[] result = new byte[len - 26];
				System.arraycopy(buf, 24, result, 0, len - 26);
				TrunkCommon.BSControl res = TrunkCommon.BSControl
						.parseFrom(result);
				message = ACK(res.getAck().toString());
				log.info("ACK=" + message);
				log.info("Content==>" + res.getContent().toStringUtf8());

				break;
			}
		}

		return message;
	}

	// 基站状态信息
	public String BSStatusREQ(MessageStruct getHeader, int bsId)
			throws IOException {
		// 创建客户端的Socket服务，指定目的主机和端口。
		NetDataTypeTransform dd = new NetDataTypeTransform();
		/* connection(); */

		// ===============================protoco buf 数据
		TrunkMsoDs.BSStatusREQ.Builder builder = TrunkMsoDs.BSStatusREQ
				.newBuilder();
		builder.setBsid(bsId);

		TrunkMsoDs.BSStatusREQ bsControl = builder.build();
		byte[] buffer = bsControl.toByteArray();

		// ====================================
		// 发送数据，应该获取Socket流中的输出流。
		OutputStream out = TcpKeepAliveClient.getSocket().getOutputStream();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(bos);

		dos.writeShort(getHeader.getCMDHeader()); // commandHeader 2 命令开始字段
		dos.writeShort(getHeader.getLength() + buffer.length);// length 2 后接数据长度
		dos.writeShort(520);// commandId 2 命令ID
		dos.write(dd.LongData(getHeader.getCallID(), 8));// businessSN 8 业务流水号
		dos.writeShort(getHeader.getSeqNum());
		;// segNum 2 分片总数
		dos.write(dd.LongData(getHeader.getReserved(), 8));
		/**************** content ***********************/
		dos.write(buffer);
		/**************** content ***********************/
		dos.writeShort(getHeader.getCheckSum());

		byte[] info = bos.toByteArray();
		if (TcpKeepAliveClient.getSocket().isConnected()) {
			log.debug("-->center:"
					+ TcpKeepAliveClient.getSocket().getInetAddress()
					+ ":BSStatusREQ:" + "; id=" + bsId);
			out.write(info);
		}

		return "OK";
	}

	public String bsId() throws Exception {
		String str = "";
		String sql = "select bsId from xhdigital_bs_sta where online=0";
		Connection conn = db_sys.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		while (rst.next()) {
			str += rst.getInt("bsId") + ",";
		}
		rst.close();
		stmt.close();
		conn.close();
		return str;
	}

	public String ACK(String ack) {
		String msg = "";
		if (ack.equals("OK")) {
			msg = "OK";
		} else if (ack.equals("AHOY")) {
			msg = "鉴权请求[被鉴权方收到此命令后应该返回鉴权码]";
		} else if (ack.equals("TS_MA")) {
			msg = "基站接受";
		} else if (ack.equals("TS_SF")) {
			msg = "前向转移确认";
		} else if (ack.equals("TS_RA")) {
			msg = "登记确认";
		} else if (ack.equals("TS_AP")) {
			msg = "系统对MS鉴权成功";
		} else if (ack.equals("TS_NS")) {
			msg = "系统服务不支持";
		} else if (ack.equals("TS_PUR")) {
			msg = "服务未授权";
		} else if (ack.equals("TS_TUR")) {
			msg = "服务临时未被授权";
		} else if (ack.equals("TS_TSR")) {
			msg = "呼叫临时不支持";
		} else if (ack.equals("TS_NMR")) {
			msg = "被叫为登记";
		} else if (ack.equals("TS_MR")) {
			msg = "被叫无线不可达";
		} else if (ack.equals("TS_DCF")) {
			msg = "被叫已转移而拒绝业务";
		} else if (ack.equals("TS_SBR")) {
			msg = "系统过载而拒绝业务";
		} else if (ack.equals("TS_SNR")) {
			msg = "系统未准备好而临时拒绝业务";
		} else if (ack.equals("TS_CCR")) {
			msg = "取消呼叫拒绝";
		} else if (ack.equals("TS_RR")) {
			msg = "登记临时拒绝";
		}

		else if (ack.equals("TS_RD")) {
			msg = "登记永久拒绝";
		} else if (ack.equals("TS_ICF")) {
			msg = "IP激活失败";
		} else if (ack.equals("TS_NR")) {
			msg = "主叫未登记";
		} else if (ack.equals("TS_BSY")) {
			msg = "被叫忙";
		} else if (ack.equals("TS_NE")) {
			msg = "被叫用户不存在";
		} else if (ack.equals("TS_AFM")) {
			msg = "MS对系统鉴权失败，SADDR信息单元为网关号AUTHI/REGI";
		} else if (ack.equals("TS_AFT")) {
			msg = "系统对MS鉴权失败，SADDR信息单元为网关号AUTHI/REGI";
		} else if (ack.equals("TS_AS")) {
			msg = "MS对系统鉴权失败，系统将进行鉴权序列号同步操作，SADDR信息单元为网关号AUTHI";
		} else if (ack.equals("TS_ND")) {
			msg = "未定义或未名的原因";
		}

		// C_QACKD P_QACKD
		else if (ack.equals("TS_QC")) {
			msg = "信道忙排队";
		} else if (ack.equals("TS_QB")) {
			msg = "系统忙排队";
		}

		// C_WACKD P_WACKD
		else if (ack.equals("TS_WT")) {
			msg = "等待响应";
		}

		// C_ACKU P_ACKU
		else if (ack.equals("MS_MA")) {
			msg = "MS确认";
		} else if (ack.equals("MS_CB")) {
			msg = "MS回叫确认";
		} else if (ack.equals("MS_ALT")) {
			msg = "MS振铃";
		}

		// C_NACKU P_NACKU
		else if (ack.equals("MS_NS")) {
			msg = "MS服务不支持";
		} else if (ack.equals("MS_LNS")) {
			msg = "线路业务不支持";
		} else if (ack.equals("MS_SFR")) {
			msg = "存储空间已满拒绝";
		} else if (ack.equals("MS_EBR")) {
			msg = "设备忙拒绝";
		} else if (ack.equals("MS_RR")) {
			msg = "被叫拒绝接收";
		} else if (ack.equals("MS_CR")) {
			msg = "用户定义的原因拒绝";
		}

		// 自定义扩展
		else if (ack.equals("DO_NOTHING")) {
			msg = "什么都不做";
		} else if (ack.equals("GP_MERGE")) {
			msg = "组呼并入";
		} else if (ack.equals("DUPLICATE_CALLID")) {
			msg = "重复的呼叫ID";
		} else {
			msg = ack;
		}
		return msg;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public static bsStatusStruct getBsStruct() {
		return bsStruct;
	}

	public static void setBsStruct(bsStatusStruct bsStruct) {
		SendData.bsStruct = bsStruct;
	}

	public static int getSrcId() {
		return srcId;
	}

	public static void setSrcId(int srcId) {
		SendData.srcId = srcId;
	}

}
