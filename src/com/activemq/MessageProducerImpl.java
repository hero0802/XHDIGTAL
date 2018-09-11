package com.activemq;

import java.io.IOException;

import javax.jms.JMSException;

import com.func.WebFun;
import com.struct.WavHeaderStruct;



public class MessageProducerImpl {
	public static WebFun fun=new WebFun();
	public static void main(String[] args) throws JMSException{
		
		ActiveMqImpl.CreateConnection();
		ActiveMqImpl.RecvTextMessage("callid222");
		
	/*	String fileRealPath = fun.webPath() + "/resources/wav/146.wav";
		byte[] voice = fun.readVoiceFile("146");
		WavHeaderStruct wav = new WavHeaderStruct(voice.length - 44);
		try {
			System.arraycopy(wav.getHeader(), 0, voice, 0, 44);
			fun.writeVoiceFile(fileRealPath, voice, false);
			System.out.println("完成");
		} catch (ArrayIndexOutOfBoundsException e) {
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		
		
		/*byte[] a=new byte[4];
		a[0]=01;
		a[1]=02;
		a[2]=03;
		a[3]=04;

		for(int i=0;i<20;i++){
		   ActiveMqImpl.SendTextMessage("voice"+i,new String(a));
		}
		
		//ActiveMqImpl.RecvMessage("voice");
		for(int i=0;i<22;i++){
			ActiveMqImpl.RecvTextMessage("voice"+i);
		}*/
		
		
		
 
	}
 


}
