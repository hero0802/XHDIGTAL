package com.socket;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		NetDataTypeTransform dd = new NetDataTypeTransform();
		byte[] a=new byte[3];
		a[0]=0;
		a[1]=0;
		a[2]=1;
		System.out.println(dd.BigByteArrayToThreeByte(a, 0));

	}

}
