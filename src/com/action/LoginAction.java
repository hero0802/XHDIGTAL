package com.action;

import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.fileManager;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;

import data.action.UserMenu;

public class LoginAction extends ActionSupport{
	private boolean success;
	private String message;
	
	private String username;
	private String password;
	private String groupname;
	private String checkCode;
	private String registerCard;
	private String repassword;
	private String groupid;
	private boolean rememberTime;
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	//验证登陆信息
	public String Login() throws Exception{	 
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		String pass=md5.addMD5(password);		
		String group="";
		String sql="select a.id,a.groupname,b.username,b.password,b.id as userid from xhdigital_web_membergroup as a inner join  xhdigital_web_user as b on binary b.username='"+this.username+"' and binary b.password='"+pass+"' and a.id=b.groupid";
		
		ResultSet rs,rs1;
		rs=stmt.executeQuery(sql);
				
		if(rs!=null && rs.next()) {
			
		String user=URLEncoder.encode(this.username,"UTF-8");
		String groupname=URLEncoder.encode(rs.getString("groupname"),"UTF-8");
		cookie.addCookie("username", user);
		cookie.addCookie("xhgmpass", pass);
		cookie.addCookie("groupname",groupname);
		cookie.addCookie("groupid",rs.getString("id"));
		cookie.addCookie("userid",rs.getString("userid"));
		
		group=rs.getString("groupname");
		HttpServletRequest request1 = ServletActionContext.getRequest();
		log.writeLog(4, log.time()+"登录系统",user);
		
		this.success=true;
		}
		else  {
			this.success=false;
		}
		stmt.close();
		conn.close();
		return SUCCESS;

	}
	//验证口令卡
	public String checkCard(){
		String Card=INI.ReadConfig("registerCard");
		if(this.registerCard.equals(Card)){
			this.success=true;
		}
		else
		{this.success=false;}
		return SUCCESS;
	}
	public String register() throws Exception{
		this.message="注册失败 #200";
		if(!checkExists() && !"".equals(username) && !"".equals(password)){
		if(!password.equals(repassword)){
			this.success=false;
			this.message="两次密码输入不一致";
		}
		else
		{
		  SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		  String date=dd.format(new Date());
		  String pasd=md5.addMD5(this.password);
		  
		  String sql="insert into xhdigital_web_user(username,password,groupid,createtime)values('"+username+"','"+pasd+"','"+groupid+"','"+date+"')";
		  Connection conn=db.getConn();
		  Sql.Update(sql);
		  log.writeLog(0, log.time()+" 注册了账号:"+username, "游客");
		  createMenu(username);
		  createUserMenuJson(username);
		  createPower(username);
		  this.success=true;
		  
		  
		}
		}
		else
		{
			this.message="该用户已经注册";
			log.writeLog(0, log.time()+" 注册了账号失败", "游客");
			this.success=false;
		}
		
		return SUCCESS;
	}
	//验证是否存在
	public boolean checkExists() throws Exception{
		String sql="select * from xhdigital_web_user where username='"+username+"'";
		boolean bl=false;
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rs=stmt.executeQuery(sql);
		while(rs.next()){
			bl=true;
		}
		conn.close();
		stmt.close();
		return bl;
	}
	//添加会员菜单
	public void createMenu(String user) throws Exception{
		String sql=" INSERT INTO `xhdigital_web_usermenu`(vpn,text,url,hidden,icon,iconCls,pmenu,sort) select * from " +
				"(SELECT vpn,text,url,hidden,icon,iconCls,pmenu,sort FROM `xhdigital`.`xhdigital_web_groupmenu` where groupid='"+groupid+"') a";
		String sql2="update xhdigital_web_usermenu set username='"+username+"',userid="+userID(user)+" where username=''";
		Sql.Update(sql);Sql.Update(sql2);
	}
	//添加会员权限
	public void createPower(String user) throws Exception{
		String sql=" INSERT INTO `xhdigital`.`xhdigital_web_actionuser`(actionname,actionValue) " +
				"select * from (SELECT actionname,actionValue FROM xhdigital_web_actiongroup where groupid='"+groupid+"') as a";
		String sql2="update xhdigital_web_actionuser set userid="+userID(user)+" where userid=0";
		Sql.Update(sql);Sql.Update(sql2);
	}
	public void createUserMenuJson(String user) throws Exception{
		String sql="ALTER TABLE  `xhdigital_web_usermenu` ORDER BY  `id`";
		/*Sql.Update(sql);*/
		ArrayList data=new ArrayList();
	    data=new UserMenu().userMenuItem(user);
		String str = json.Encode(file.menuList(data));		
		file.creatTxtFile(user);
		file.writeTxtFile (user,str); 
	}
	//获取用户ID
	   public int userID(String username) throws Exception{
		   String sql="select id from xhdigital_web_user where username='"+username+"'";
		   int userid=0;
		   Connection conn=db.getConn();
			Statement stmt=conn.createStatement();
			ResultSet rst = stmt.executeQuery(sql);
			boolean bl=false;
			while(rst.next())
			{
				userid=rst.getInt("id");
			}
			
			return userid;
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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getGroupname() {
		return groupname;
	}
	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}
	public String getCheckCode() {
		return checkCode;
	}
	public void setCheckCode(String checkCode) {
		this.checkCode = checkCode;
	}
	public String getRegisterCard() {
		return registerCard;
	}
	public void setRegisterCard(String registerCard) {
		this.registerCard = registerCard;
	}
	public String getRepassword() {
		return repassword;
	}
	public void setRepassword(String repassword) {
		this.repassword = repassword;
	}
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public boolean isRememberTime() {
		return rememberTime;
	}
	public void setRememberTime(boolean rememberTime) {
		this.rememberTime = rememberTime;
	}
	
	

}
