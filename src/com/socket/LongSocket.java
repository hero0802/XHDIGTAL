package com.socket;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;

import com.protobuf.TrunkMsoDs;

public class LongSocket extends Thread{
	private static final int SERVER_PORT = 20000; //端口号
    private int count = 0;//连接客户端数
    private ServerSocket ss = null;//服务端socket
    
    public LongSocket(){
    	try {
            if(null==ss){
                this.ss = new  ServerSocket(SERVER_PORT);
                ss.setReuseAddress(true);  //两个进程共用同一个端口的时候,一个进程关闭后,另一个进程还能够立刻重用相同端口 
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public void run() {
        System.out.println("-------主监听线程----------start----------");
        try {
            while(true){
                Socket client = ss.accept();
                count += 1;
                Thread c_thread = new CreateServerThread(client,count);
                c_thread.start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    class CreateServerThread extends Thread {
        private Socket client; //当前所连接客户端
        private int index;//当前线程编号
        private BufferedReader in = null;//从客户端接受到的信息
        private OutputStream out = null;//返回给客户端的信息
        private DataOutputStream dout=null;
         
        public CreateServerThread(Socket client,int index) throws IOException {
            this.client = client;
            this.index = index;
        }
         
        public void run(){
            System.out.println("-------当前连接的客户端数为----------" + index + "----------");
            String ms = "Callback accepted " + client.getInetAddress() + ":" + client.getPort();
            System.out.println(ms);
             
            try {
                in = new BufferedReader(new InputStreamReader(client.getInputStream()));//接收请求的流                
                out = client.getOutputStream();//写入缓存
                int len = 0;//监听到的字符串长度
                String str = "";//监听到的字符串
                byte buf[] = new byte[4096];
                
                InputStream in = client.getInputStream();
                DataInputStream din=new DataInputStream(in);
                len=din.read(buf);
                
               if(len > 0){
                    out.write("1".getBytes());
                	
                    for(int j=0;j<len;j++)
                    {System.out.print(buf[j]+" ");}               
                    
                }
                
                
            } catch (IOException e) {
                System.out.println("---------服务端与第"+index+"个客户端交互时异常："+e.getMessage());
            }finally{
                try {
                    if(client!=null){
                        client.close();
                        count -= 1;
                        System.out.println("---------关闭第"+index+"个客户端连接，当前连接的客户端个数为"+count);
                    }
                } catch (IOException e) {
                    System.out.println("---------第"+index+"个客户端关闭异常："+e.getMessage());
                }
            }
        }
    }
    public void closeSocketServer(){
        try{
            if(ss!=null && !ss.isClosed()){
                ss.close();
            }
        }catch(IOException e){
            e.printStackTrace();
        }
    }

}
