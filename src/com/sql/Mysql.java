package com.sql;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.config.config;

public class Mysql {
	private config INI = new config();
	private String db_user = INI.ReadConfig("sys_root");
	private String db_pass = INI.ReadConfig("sys_password");
	private String className = "com.mysql.jdbc.Driver";
	public String url = "jdbc:mysql://"
			+ INI.ReadConfig("sys_ip")
			+ ":"
			+ INI.ReadConfig("sys_port")
			+ "/mysql?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull";

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
				System.out.println(INI.ReadConfig("sys_ip") + ":"
						+ INI.ReadConfig("sys_port"));
			}
		} else {
			try {
				conn = java.sql.DriverManager.getConnection(url, db_user,
						db_pass);
				// System.out.print("connection system database successful!");
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				System.out.println(date
						+ "--connection system database failed!");
			}
		}

		return conn;
	}
}
