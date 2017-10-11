package com.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import com.func.MD5;
import com.func.WebFun;
import com.sql.SysSql;
import com.struct.WavHeaderStruct;

public class ttttt {
	private static WebFun func=new WebFun();
	private static SysSql sql=new SysSql();
	private static MD5 md5=new MD5();

	public static void main(String[] args) throws Exception {
		
		System.out.println(func.DateMinus(60));
		
	}
	public static String webPath(){
		String str=WebFun.class.getResource("/").getPath();
		str=str.substring(0, str.length()-17);
		return str;
		
	}
	public static void ab(){
		
		int a=12202583;
		
		//isLeader(a);
		String b=",12,34";
		System.out.println(b.substring(1));
		
		/*double a=300;
		double b=0;
		for(int i=0;i<7;i++){
			a=a*2;
			b+=a;
			System.out.println("a="+(int)a);
		}
		System.out.println("b="+(int)b);*/
		//a=75415  b=316012
		//a=197634  b=683007
		//a=484602  b=1446337
	}
	public static boolean isLeader(int id) {
		int len=String.valueOf(id).length();
		int msc=id;
		if (len==7) {
			int a=msc/10000;
			int b=msc%10;
			int a1=a/100;
			int a2=a%100/10;
			int a3=a%10;
			System.out.println("a1="+a1);
			System.out.println("a2="+a2);
			System.out.println("a3="+a3);
			System.out.println("b="+b);
		}else if (len==8) {
			int a=msc/10000;
			int b=msc%10;
			int a1=a/1000;
			int a2=a%1000/100;
			int a3=a%100/10;
			int a4=a%10;
			
			System.out.println("a1="+a1);
			System.out.println("a2="+a2);
			System.out.println("a3="+a3);
			System.out.println("a4="+a4);
			System.out.println("b="+b);
		}
		return false;
	}
	public static void luck() throws Exception{
		String a="LUYSWGV1ooARWKWP(3)hUch4C";
		byte[] source = a.getBytes("utf-8");
		MessageDigest md = MessageDigest.getInstance("MD5");
		//使用指定的 byte 数组更新摘要
		md.update(source);
		//通过执行诸如填充之类的最终操作完成哈希计算，结果是一个128位的长整数
		//[-97, -119, -117, -3, -59, -60, -125, 58, -58, 31, -39, -95, -52, -67, -97, 119]
		byte[] tmp = md.digest();
		System.out.println(Arrays.toString(tmp));
		System.out.println(md5.addMD5(a));
	}
	
	public static void gps(){
		/*String[] str1={"1","2","3","4","5","6","7","8","9","A"};
		List list = Arrays.asList(str1);
		Collections.shuffle(list);
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < list.size(); i++) {
			sb.append(list.get(i));
		}
		String afterShuffle = sb.toString();
		String result = afterShuffle.substring(1, 6);*/
		String  string="70 09 c7 0f a1 d4 c0 c3 0c 29 00 00 30 a4 00 ff 00 00 00 00";
		String hex = "", m_hex = "";
		int m_lat = 0, m_lon = 0, lat_1 = 0, lat_2 = 0, lon_1 = 0, lon_2 = 0;
		double lat = 0, lon = 0;
		for (int i = 0; i < string.split(" ").length; i++) {
			String m_a = string.split(" ")[i];
			//log.debug("m_a:"+m_a);
			String m_b = func.hex_16_2(m_a);
			hex += m_b;
		}
		m_lat = func.hex_2_10(hex.substring(11, 18));// 11,7  纬度
		lat_1 = func.hex_2_10(hex.substring(18, 24));// 18,6  纬度的整数部分
		lat_2 = func.hex_2_10(hex.substring(24, 38));// 24,14  纬度的小数部分
		m_lon = func.hex_2_10(hex.substring(38, 46));// 38,8  经度
		lon_1 = func.hex_2_10(hex.substring(46, 52));// 46,6 经度整数部分
		lon_2 = func.hex_2_10(hex.substring(52, 66));// 52,14 经度 小数部分
		
		
		System.out.println("二进制："+hex.substring(11, 18));
		System.out.println("二进制："+hex.substring(18, 24));
		System.out.println("二进制："+hex.substring(24, 38));
		System.out.println("二进制："+hex.substring(38, 46));
		System.out.println("二进制："+hex.substring(46, 52));
		System.out.println("二进制："+hex.substring(52, 66));
		
		System.out.println(hex);
		System.out.println(m_lat);
		System.out.println(lat_1);
		System.out.println(lat_2);
		System.out.println(m_lon);
		System.out.println(lon_1);
		System.out.println(lon_2);
		
		DecimalFormat df = new java.text.DecimalFormat("0.000000");
		DecimalFormat formater = new DecimalFormat(); // 保留几位小数
		formater.setMaximumFractionDigits(6);
		double b=((double)lon_1  + (double)lon_2/10000) / 60;
	
		
		
		System.out.println(df.format(b));
		
		String ss="0111000000001001110001110000111110100001110101001100000011000011000011000010100100000000000000";
		System.out.println(ss.substring(11,18));
		System.out.println(hex.substring(11,18));
		//System.out.println("二进制："+hex.substring(11, 18));
	}

}
