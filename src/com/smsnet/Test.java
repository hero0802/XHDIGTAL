package com.smsnet;



public class Test {
	private static SmsTcp smsTcp;
	private static SendSms sms=new SendSms();

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		if (smsTcp==null) {
			smsTcp=new SmsTcp();
			smsTcp.start();
		}
	
	}

}
