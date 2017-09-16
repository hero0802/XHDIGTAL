package com.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.StringUtil;
import com.func.fileManager;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;

import data.action.UserMenu;

public class WebUserAction extends ActionSupport{
	private boolean success;
	private String message;
	private String deleteIds; //删除ID号
	
	private int id;
	private String username;
	private String password;
	private String repassword;
	private String groupname;
	private String groupid;
	private String level;
    private String name;
    private String sex;
    private String birthday;
    private String tel;
    private String phone;
    private String address;
    private String email;
    private String qq;
    
	private String vpn;
	private int hidden;
    
    private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	private StringUtil stru=new StringUtil();
    
	//添加账号
	public String add_user() throws Exception {
		SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date=dd.format(new Date());
		String pass=md5.addMD5(password);
		String sql="select username from xhdigital_web_user where username='"+this.username+"'";
		if(Sql.exists(sql))
		{
			this.success=false;
		}
		else
		{
		String sql2="insert into xhdigital_web_user(username,password,groupid,createtime,name,sex,birthday," +
				"tel,phone,address,email,qq)values"
			  +"('"+this.username+"','"+pass+"','"+this.groupid+"','"+date+"','"+name+"','"+sex+"','"+birthday+"'," +
			  		"'"+tel+"','"+phone+"','"+address+"','"+email+"','"+qq+"')";
		Sql.Update(sql2);
		//createMenu(username);
		//createUserMenuJson(username);
		createPower(username);
		log.writeLog(1, "添加会员账号："+this.username, "");
		this.success=true;
		}
		
		return SUCCESS;
	}
	//修改账号
	public String update_user() throws Exception{
		SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date=dd.format(new Date());
		String pass=md5.addMD5(this.password);
		String sql="";
		if("".equals(this.password)){
			sql="update xhdigital_web_user set groupid='"+this.groupid+"'"
	         +",createtime='"+date+"',name='"+name+"',sex='"+sex+"',birthday='"+birthday+"',tel='"+tel+"'," +
	         "phone='"+phone+"',address='"+address+"',email='"+email+"',qq='"+qq+"' where username='"+this.username+"'";
	      }
		else
		{
		sql="update xhdigital_web_user set password='"+pass+"',groupid='"+this.groupid+"'"
		         +",createtime='"+date+"',name='"+name+"',sex='"+sex+"',birthday='"+birthday+"',tel='"+tel+"'," +
		         "phone='"+phone+"',address='"+address+"',email='"+email+"',qq='"+qq+"' where username='"+this.username+"'";
		}
		log.writeLog(2, "修改会员账号："+this.username, "");
		Sql.Update(sql);
		this.success=true;
		return SUCCESS;
	}

	//删除会员账号
	public String delete_user() throws Exception{
		String[] IDs=this.deleteIds.split(",");
		for(int i=0,l=IDs.length;i<l;i++){
			String sql="delete from xhdigital_web_user where id="+IDs[i];
			
			String id=IDs[i];
			if (IDs[i].equals(cookie.getCookie("userid"))) {
				this.success=false;
				this.message="不能删除自己的账号";
				
			} else {
				delUserMenu(Integer.parseInt(id));
				delUserPower(Integer.parseInt(id));
				Sql.Update(sql);
				this.success=true;
				log.writeLog(3, log.time()+"删除会员账号：ID->"+IDs[i], "");
			}
		}
		
		
		return SUCCESS;
	}
	
	//修改会员菜单
	public String updateUserMenu() throws Exception{
		String sql="update xhdigital_web_usermenu set hidden="+hidden+" where vpn='"+vpn+"' and userid="+id;
		Sql.Update(sql);
		log.writeLog(2, log.time()+" 修改了会员菜单", "");
		//createUserMenuJson(username);
		this.success=true;
		return SUCCESS;
	}
	//添加会员菜单
	public void createMenu(String user) throws Exception{
		String sql=" INSERT INTO `xhdigital`.`xhdigital_web_usermenu`(vpn,text,url,hidden,icon,iconCls,pmenu,sort) select * from " +
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
	//删除会员菜单
	public void delUserMenu(int userId) throws Exception{
		String sql="delete from xhdigital_web_usermenu where userid="+userId;
		Sql.Update(sql);
	}
	//删除会员权限
	public void delUserPower(int userId) throws Exception{
		String sql="delete from xhdigital_web_actionuser where userid="+userId;
		Sql.Update(sql);
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
/*	public void createUserMenuJson(String user) throws Exception{
		String sql="ALTER TABLE  `xhdigital_web_usermenu` ORDER BY  `id`";
		Sql.Update(sql);
		ArrayList data=new ArrayList();
	    data=new UserMenu().userMenuItem(user);
		String str = json.Encode(file.menuList(data));		
		file.creatTxtFile(user);
		file.writeTxtFile (user,str); 
	}*/
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
	public String getDeleteIds() {
		return deleteIds;
	}
	public void setDeleteIds(String deleteIds) {
		this.deleteIds = deleteIds;
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
	public String getRepassword() {
		return repassword;
	}
	public void setRepassword(String repassword) {
		this.repassword = repassword;
	}
	public String getGroupname() {
		return groupname;
	}
	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getQq() {
		return qq;
	}
	public void setQq(String qq) {
		this.qq = qq;
	}
	public String getVpn() {
		return vpn;
	}
	public void setVpn(String vpn) {
		this.vpn = vpn;
	}
	public int getHidden() {
		return hidden;
	}
	public void setHidden(int hidden) {
		this.hidden = hidden;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	
	
	

}
