package com.sql;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.config.config;
import com.func.WebFun;

public class SysMysql {
	private config INI = new config();
	private WebFun func = new WebFun();
	private String db_user = func.readXml("sysDataBase", "sys_root");
	private String db_pass = func.readXml("sysDataBase", "sys_password");
	private String className = "com.mysql.jdbc.Driver";
	public String url = "jdbc:mysql://"
			+ func.readXml("sysDataBase", "sys_ip")
			+ ":"
			+ func.readXml("sysDataBase", "sys_port")
			+ "/"
			+ func.readXml("sysDataBase", "sys_dbname")
			+ "?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull";
	 protected final Log log4j=LogFactory.getLog(SysMysql.class);

	public Connection getConn() {
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date = dd.format(new Date());
		try {
			Class.forName(className).newInstance();
		} catch (InstantiationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalAccessException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Connection conn = null;
		if (db_user == null || db_user.equals("")) {

			try {
				conn = java.sql.DriverManager.getConnection(url);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				// e.printStackTrace();
				System.out.println(date
						+ "--connection system database failed!");
			}
		} else {

			try {
				conn = java.sql.DriverManager.getConnection(url, db_user,db_pass);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				log4j.debug("--connection system database failed!");
				log4j.debug("DATABASE:" +func.readXml("sysDataBase", "sys_ip") + ":"+ func.readXml("sysDataBase", "sys_port"));
				
			}
		}

		return conn;
	}

}
