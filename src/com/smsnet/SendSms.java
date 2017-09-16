package com.smsnet;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import com.func.WebFun;
import com.smsnet.Sms;


public class SendSms {
	private StringUtil stringUtil=new StringUtil();
	private WebFun func=new WebFun();
	
	
	

	public void smsModel() {
		OutputStream out;
		try {
			if (SmsTcp.getSocket().isConnected()) {
				out = SmsTcp.getSocket().getOutputStream();
				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				DataOutputStream dos = new DataOutputStream(bos);
				dos.write("AT+CMGF=0\r\n".getBytes());
				out.write(bos.toByteArray());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendAt(String str) {
		OutputStream out;
		try {
			if (SmsTcp.getSocket().isConnected()) {
				out = SmsTcp.getSocket().getOutputStream();
				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				DataOutputStream dos = new DataOutputStream(bos);
				dos.write(str.getBytes());
				out.write(bos.toByteArray());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void sendMessage(Sms sms) {
		OutputStream out;//ContentStr(sms.getMessage())
		//System.out.println("content:===="+ContentStr(sms.getMessage()));
		String message=pnumber(sms.getPhoneNumber())+ContentStr(sms.getMessage());
		int len=message.length()/2;
		message=centerNum(func.readXml("sms", "number"))+message;
		//System.out.println(message);
		String step2="AT+CMGS="+String.valueOf(len)+"\r";
		try {
			if (SmsTcp.getSocket().isConnected()) {
				
				sendAt(step2);
				Thread.sleep(2000);				
				out = SmsTcp.getSocket().getOutputStream();
				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				DataOutputStream dos = new DataOutputStream(bos);		
				
				dos.write(message.getBytes());
				//dos.write(sms.getMessage().getBytes());
				dos.write(sms.getEndTag());
				out.write(bos.toByteArray());
				

			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	public String centerNum(String num){
		String a="";
		//num="86"+num;
		if (num.length()%2==1) {
			num+="F";
		}
		for (int i = 0; i < num.length(); i+=2) {
			   a+=num.charAt(i+1);
			   a+=num.charAt(i);
			}
	  return "0791"+a;
	}
	//strlen("11000D91"+phoneno+"000800"+"0A5DE54F5C61095FEBFF01")/2=50/2=25
	public String  pnumber(String num){
		String a="";
		num="86"+num;
		if (num.length()%2==1) {
			num+="F";
		}
		for (int i = 0; i < num.length(); i+=2) {
			   a+=num.charAt(i+1);
			   a+=num.charAt(i);
			}
		a="1100"+func.HexString(num.length()-1)+"91"+a+"000800";
	    return a;
	}
	public String ContentStr(String str) {
		String a=stringUtil.encodeHex(str);
		return func.HexString(a.length()/2)+a;
	}
	
	
	

}
