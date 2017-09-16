package com.action;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

import org.apache.struts2.ServletActionContext;


import com.opensymphony.xwork2.ActionSupport;

public class DownWavAction extends ActionSupport{

    private String inputPath;
    private String fileName;

	public String getInputPath() {
		return inputPath;
	}

	public void setInputPath(String inputPath) {
		this.inputPath = inputPath;
	}

	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public InputStream getInputStream() throws Exception {	
		return ServletActionContext.getServletContext().getResourceAsStream(inputPath);
		
    }	

    public String downLoadFile() throws Exception {
    /*String path=this.inputPath.substring(1, this.inputPath.length());
    String[] dir=path.split("/");
    String downDir="/"+dir[0];*/
    String downloadDir = ServletActionContext.getServletContext().getRealPath("/resources/wav");	 // 文件下载路径
    String downloadFile = ServletActionContext.getServletContext().getRealPath(inputPath); 
    File file = new File(downloadFile);	
    if(!file.exists())
    {
    	return null;
    }
    downloadFile = file.getCanonicalPath();// 真实文件路径,去掉里面的..等信息	 // 安全性
    if (!downloadFile.startsWith(downloadDir)) {
    return null;
    }
    return SUCCESS;
    }	/**
     * 提供转换编码后的供下载用的文件名
     * 
     * @return
     */
    public String getDownloadFileName() {
    String downFileName = fileName;
    try {
    downFileName = new String(downFileName.getBytes(), "ISO8859-1");
    } catch (UnsupportedEncodingException e) {
    e.printStackTrace();
    }
    return downFileName;
    }
	


}
