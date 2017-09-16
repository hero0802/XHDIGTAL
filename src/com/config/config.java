package com.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Hashtable;
import java.util.Properties;

public class config extends Hashtable {
	private String Value="";

	public String ReadConfig(String name){
		InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("Config.properties");   
		Properties p = new Properties();   
		try {   
			p.load(inputStream);   
		} catch (IOException e1) {   
			e1.printStackTrace();   
		} 
		finally {//关闭资源  
            if (inputStream != null) {  
                try {  
                	inputStream.close();  
                } catch (IOException e) {  
                }  
            }
		}
		//System.out.println("ip:"+p.getProperty("ip"));  
		Value=p.getProperty(name);
		return Value;

	}
	/** 
     * 修改或添加键值对 如果key存在，修改, 反之，添加。 
     * @param filePath 文件路径，即文件所在包的路径，例如：java/util/config.properties 
     * @param key 键 
     * @param value 键对应的值 
     */  
    public  void WriteConfig(String filePath, String key, String value) {  
        //获取绝对路径  
        filePath = config.class.getResource("/" + filePath).toString();  
        //截掉路径的”file:/“前缀  
        filePath = filePath.substring(6);  
        Properties prop = new Properties();  
        try {  
            File file = new File(filePath);  
            if (!file.exists())  
                file.createNewFile();  
            InputStream fis = new FileInputStream(file);  
            prop.load(fis);  
            //一定要在修改值之前关闭fis  
            fis.close();  
            OutputStream fos = new FileOutputStream(filePath);  
            prop.setProperty(key,value);  
            //保存，并加入注释  
            prop.store(fos, "Update '" + key + "' value");  
            fos.close();  
        } catch (IOException e) {  
            System.err.println("Visit " + filePath + " for updating " + value + " value error");  
        }  
    }  

}
