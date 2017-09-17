package com.smsnet;

public class Sms {
	private String phoneNumber;
	private String message;
	private String 	person;
	private int endTag=0x1a;
	
	
	public Sms(){
		
	}
	
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getEndTag() {
		return endTag;
	}
	public void setEndTag(int endTag) {
		this.endTag = endTag;
	}

	public String getPerson() {
		return person;
	}

	public void setPerson(String person) {
		this.person = person;
	}
	
	

}
