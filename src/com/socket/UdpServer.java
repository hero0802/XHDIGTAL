package com.socket;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.func.WebFun;

public class UdpServer extends TimerTask {
	private static DatagramSocket server = null;
	private boolean isconnected = false;
	protected final Log log = LogFactory.getLog(UdpServer.class);
	private static WebFun func = new WebFun();
	public final static int serverPort = Integer.parseInt(func.readXml("sound",
			"port"));

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
		/* 创建服务端DatagramSocket */
		while (!isconnected) {
			isconnected = true;
			try {
				server = new DatagramSocket(serverPort);
				log.debug("SoundServer start running...");
				while (true) {
					/* 定义接收byte空间 */
					byte[] buffer = new byte[8192];
					/* 将UDP数据包内容保存在byte中 */
					DatagramPacket receivePacket = new DatagramPacket(buffer,
							buffer.length);
					/* UDP接收数据包 */
					server.receive(receivePacket);
					/* 获取当前系统时间 */
					/* 处理客户端的输入 */
					byte[] recvData = new byte[receivePacket.getLength()];
					System.arraycopy(buffer, 0, recvData, 0,
							receivePacket.getLength());
					String echo = func.BytesToHexS(recvData);
					echo = func.nowDate() + " " + echo;
					/* 打印系统日志记录用户输入 */
					log.info(echo);
					/* 从客户端输入转化为byte */
					byte[] data = echo.getBytes("utf-8");
					/* 将byte内容转化为UDP数据包 */
					DatagramPacket sendPacket = new DatagramPacket(data,
							data.length, receivePacket.getAddress(),
							receivePacket.getPort());
					/* UPD发送数据包 */
					server.send(sendPacket);
				}
			} catch (SocketException e) {
				// TODO Auto-generated catch block
				log.debug("SoundServer start error!");
				isconnected=false;
			} catch (ArrayIndexOutOfBoundsException e) {
				log.debug("SoundServer ArrayIndexOutOfBoundsException!");
				
			} catch (UnknownHostException e) {
				log.debug("SoundServer UnknownHostException!");
				isconnected=false;
			} catch (IOException e) {
				log.debug("SoundServer  IOException!");
				isconnected=false;
			} finally {
				/* 安全关闭Socket */
				try {
					if (server != null) {
						server.close();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}

	}

}
