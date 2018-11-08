package com.socket;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

import com.func.WebFun;

public class test {

	public static void main(String[] args) throws UnsupportedEncodingException {
		// TODO Auto-generated method stub
		//[16, 98, -3, -112, -31, 79, 121, -122]
		byte[] a={16, 98, -3, -112, -31, 79, 121, -122};
		byte[] b=WebFun.ucs2ToUtf8(a);
		String c="成都信虹";
		
		byte[] utf8=c.getBytes("utf-8");
		byte[] ucs2=WebFun.utf8ToUsc2(c);
		//62,10,90,FD,4F,E1,86,79
		byte[]  ucss={98,16};
		byte[] ucs2_utf8=WebFun.ucs2ToUtf8(ucs2);
		
		
		System.out.println(WebFun.BytesToHexS(WebFun.ucs2ToUtf8(a)));
		System.out.println(new String(b,"utf-8"));
		System.out.println(WebFun.BytesToHexS(a));
		System.out.println(new String(a,"UTF-16"));
		System.out.println("============================");
		System.out.println("utf-8->"+WebFun.BytesToHexS(utf8));
		System.out.println("usc2->"+WebFun.BytesToHexS(ucs2));
		
		System.out.println("ucs2->utf-8::::"+WebFun.BytesToHexS(ucs2_utf8));
		System.out.println("============================");

	}
	
	

}
