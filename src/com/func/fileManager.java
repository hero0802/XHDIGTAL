package com.func;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.struts2.ServletActionContext;

import com.config.config;

public class fileManager {
	private static String filenameTemp;
	public config jsonFile=new config();

	//创建文件
	public  boolean creatTxtFile(String name) throws IOException { 
		boolean flag = false; 
		filenameTemp = jsonFile.ReadConfig("jsonPath") +"/"+ name + ".json"; 
		File filename = new File(filenameTemp); 
		if (!filename.exists()) { 
			filename.createNewFile(); 
			flag = true; 
		} 
		return flag; 
	} 
	//向文件写入数据
	public  void  writeTxtFile (String filename,String newStr) 
	throws IOException { 
		filenameTemp = jsonFile.ReadConfig("jsonPath") +"/"+ filename + ".json"; 
		OutputStreamWriter os = null;
		FileOutputStream fos = null;
		try {
		fos = new FileOutputStream(filenameTemp);
		os = new OutputStreamWriter(fos, "UTF-8");
		os.write(newStr);
		} catch (Exception ex) {
		ex.printStackTrace();
		} finally {
		if (os != null) {
		os.close();
		os = null;
		}
		if (fos != null) {
		fos.close();
		fos = null;
		}
		 
		}
		
	} 
	public HashMap menuList(ArrayList list) throws Exception
	{

		HashMap result=new HashMap();
		result.put("data", list);

		return result;
	}
	public boolean isFile(String name){
		boolean flg=false;
		filenameTemp = jsonFile.ReadConfig("jsonPath") +"/"+ name + ".json"; 
		File file=new File(filenameTemp);
		if(!file.exists()){
			flg=false;
		}
		else
		{
			flg=true;
		}
		return flg;
	}
	public String getFilePath(String name){
		filenameTemp = jsonFile.ReadConfig("jsonPath") +"/"+ name + ".json"; 
		return filenameTemp;
	}

}
