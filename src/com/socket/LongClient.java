package com.socket;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;

import com.opensymphony.xwork2.ActionSupport;

public class LongClient extends ActionSupport{
	
	private static final int CLIENT_PORT = 20000; //端口号
	private static final String IP = "127.0.0.1"; //IP
	private static Socket socket=null;
	private BufferedReader in; 
	private OutputStream out; 
	private String str;
	
	private static LongClient instance = new LongClient();  
    private LongClient(){
    	open();
    }  
    public static LongClient getInstance() {  
       return instance;  
    }  
     
    
    
    //连接 服务器
    public void open(){
    	if(socket==null){
    		try {
				socket=new Socket(IP,CLIENT_PORT);
				System.out.println("客户端建立连接");
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				System.out.println("没有找到主机");
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				System.out.println(e.getMessage());
			}
			try {
				socket.setSoTimeout(20000);
			} catch (SocketException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    }
    //发送心跳
    public void sendHeartBeat(){
    	 final long timeInterval = 1000; 
    	 
         Runnable runnable = new Runnable() {  
        	 int i=0;
             public void run() {  
                 while (true) {  
                     // ------- code for task to run 
                	 send();
                     // ------- ends here  
                     try {  
                         Thread.sleep(timeInterval);  
                     } catch (InterruptedException e) {  
                         e.printStackTrace();  
                     }  
                 }  
             }  
         };  
         Thread thread = new Thread(runnable);  
         thread.start();  
    	
    }
    //关闭连接
    public void close(){
    	if(socket!=null){
    		try {
				socket.close();
				System.out.println("socket close!");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				System.out.println("ERROR");
			}
    	}else{
    		System.out.println("socket 关闭");
    	}
    }
    //向服务器发送数据
    public void send(){
    	 //客户端发送给服务端消息
    	try{
    		out = socket.getOutputStream();
            out.write(str.getBytes());
    	}catch (IOException e) {
			// TODO: handle exception
    		e.printStackTrace();
		}
        
    }
    //接收服务器数据
    public void recvData() throws Exception{
    	while(true){
    		InputStream in = socket.getInputStream();
            DataInputStream din=new DataInputStream(in);
            byte[] buf = new byte[1024]; 
        	int len = din.read(buf);
    	}
    }
	public static Socket getSocket() {
		return socket;
	}
	public static void setSocket(Socket socket) {
		LongClient.socket = socket;
	}
	public String getStr() {
		return str;
	}
	public void setStr(String str) {
		this.str = str;
	}
	
    


}
