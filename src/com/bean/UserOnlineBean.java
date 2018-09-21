package com.bean;

public class UserOnlineBean {
	private int userId;
	private String name;
	private String time;
	@Override
	public String toString() {
		return "UserOnlineBean [userId=" + userId + ", name=" + name
				+ ", time=" + time + "]";
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	

}
