package com.action;

import java.io.File;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

public class FileIsExistsAction extends ActionSupport {
	private String fileName;
	private String filePath;
	private boolean success;
	/**
	 * @return the fileName
	 */
	public String getFileName() {
		return fileName;
	}
	/**
	 * @param fileName the fileName to set
	 */
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	/**
	 * @return the filePath
	 */
	public String getFilePath() {
		return filePath;
	}
	/**
	 * @param filePath the filePath to set
	 */
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	/**
	 * @return the success
	 */
	public boolean isSuccess() {
		return success;
	}
	/**
	 * @param success the success to set
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}
	//execute()
	
	public String execute(){
		String downloadFile=ServletActionContext.getServletContext().getRealPath(filePath);
		File file=new File(downloadFile);
		if(!file.exists()){
			this.success=false;
		}
		else
		{
			this.success=true;
		}
		return SUCCESS;
	}

}
