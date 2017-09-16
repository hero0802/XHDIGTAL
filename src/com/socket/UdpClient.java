package com.socket;

import java.io.*;  
import java.net.*;  
    
public class UdpClient {  
    private byte[] buffer = new byte[1024];  
  
    private DatagramSocket ds = null;  
  
    /** 
     * 构造函数，创建UDP客户端 
     * @throws Exception 
     */  
    public UdpClient() throws Exception {  
        ds = new DatagramSocket();  
    }  
      
    /** 
     * 设置超时时间，该方法必须在bind方法之后使用. 
     * @param timeout 超时时间 
     * @throws Exception 
     */  
    public  void setSoTimeout( int timeout) throws Exception {  
        ds.setSoTimeout(timeout);  
    }  
  
    /** 
     * 获得超时时间. 
     * @return 返回超时时间 
     * @throws Exception 
     */  
    public  int getSoTimeout() throws Exception {  
        return ds.getSoTimeout();  
    }  
  
    public  DatagramSocket getSocket() {  
        return ds;  
    }  
  
    /** 
     * 向指定的服务端发送数据信息. 
     * @param host 服务器主机地址 
     * @param port 服务端端口 
     * @param bytes 发送的数据信息 
     * @return 返回构造后俄数据报 
     * @throws IOException 
     */  
    public  DatagramPacket send( String host,  int port,  
             byte[] bytes) throws IOException {  
        DatagramPacket dp = new DatagramPacket(bytes, bytes.length, InetAddress  
                .getByName(host), port);  
        ds.send(dp);  
        return dp;  
    }  
  
    /** 
     * 接收从指定的服务端发回的数据. 
     * @param lhost 服务端主机 
     * @param lport 服务端端口 
     * @return 返回从指定的服务端发回的数据. 
     * @throws Exception 
     * @author <a href="mailto:xiexingxing1121@126.com">AmigoXie</a> 
     * Creation date: 2007-8-16 - 下午10:52:36 
     */  
    public  String receive( String lhost,  int lport)  
            throws Exception {  
        DatagramPacket dp = new DatagramPacket(buffer, buffer.length);  
        ds.receive(dp);  
        String info = new String(dp.getData(), 0, dp.getLength());  
        return info;  
    }  
  
    /** 
     * 关闭udp连接. 
     */  
    public void close() {  
        try {  
            ds.close();  
        } catch (Exception ex) {  
            ex.printStackTrace();  
        }  
    }  
  
    /** 
     * 测试客户端发包和接收回应信息的方法. 
     * @param args 
     * @throws Exception 
     */  
    public static void main(String[] args) throws Exception {  
        UdpClient client = new UdpClient();  
        String serverHost = "192.168.0.99";  
        int serverPort = 20000;  
        while(true){
        client.send(serverHost, serverPort, ("123456").getBytes()); 
        String info = client.receive(serverHost, serverPort);  
        System.out.println("服务端回应数据：" + info); 
        
        }
    }  
}  