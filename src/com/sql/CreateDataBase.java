package com.sql;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.ServletActionContext;

import com.dwr.SocketDwr;
import com.dwr.loadDataDwr;
import com.func.WebFun;
import com.opensymphony.xwork2.ActionSupport;

public class CreateDataBase extends ActionSupport {
	private boolean success;
	private String message;
	private int ok=0;
	private int error=0;
	private Mysql db = new Mysql();
	private WebFun func = new WebFun();
	private SysMysql   mysql=new SysMysql();
	private SysSql Sql = new SysSql();
	private static String dir = ServletActionContext.getServletContext()
			.getRealPath("/");

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		// readFile();
	}

	public String FileExists() {
		String filePath = dir + "/resources/data/lock.lock";
		boolean exisFile=true;
		File file = new File(filePath);
		if (file.exists()) {
			exisFile=true;
		} else {
			exisFile=false;
		}
		
		String sqlString="SELECT * FROM information_schema.SCHEMATA where SCHEMA_NAME='xhdigital'";
		try {
			if (mysql.getConn()==null) {
				success=true;
			}else {
				if (Sql.mysql_exists(sqlString) || exisFile) {
					success=true;
					//System.out.println("数据库已经存在不需要创建");
					
				}else {
					success=false;
					//System.out.println("数据库不存在");
				}
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			success=false;
			//System.out.println("数据库不存在2");
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String CreateDB() {
		readFile();
		return SUCCESS;
	}

	public String readFile() {
		String pathName = dir + "/resources/data/xhdigital.sql";
		FileInputStream in = null;
		try {
			in = new FileInputStream(new File(pathName));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		InputStreamReader fileReader = null;
		try {
			fileReader = new InputStreamReader(in, "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		BufferedReader bufferedReader = new BufferedReader(fileReader);
		StringBuilder builder = new StringBuilder("");
		try {
			String str = bufferedReader.readLine();
			while (str != null) {
				// 去掉一些注释，和一些没用的字符
				if (!str.startsWith("-") && !str.startsWith("/*")) {
					builder.append(str);
				}
				str = bufferedReader.readLine();

			}
			String[] strArr = builder.toString().split(";");
			List<String> strList = new ArrayList<String>();
			String sql_db = "create database if not exists xhdigital default charset=utf8";
			try {
				Update(sql_db);

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			for (String s : strArr) {
				strList.add(s);
				try {
					Sql.Update(s);
					ok++;
					loadDataDwr.sendMessage(s+"    <span style='color:red'>执行成功|</span>"+strArr.length+"|"+ok+"|"+error);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					error++;
					loadDataDwr.sendMessage("执行失败|"+strArr.length+"|"+ok+"|"+error);
				}
				System.out.println(s);

			}
			func.creatTxtFile(dir + "/resources/data/lock.lock");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.success = true;
		return SUCCESS;
	}

	public void Update(String sql) throws Exception {
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(sql);
		conn.close();
		stmt.close();
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getOk() {
		return ok;
	}

	public void setOk(int ok) {
		this.ok = ok;
	}

	public int getError() {
		return error;
	}

	public void setError(int error) {
		this.error = error;
	}
}
