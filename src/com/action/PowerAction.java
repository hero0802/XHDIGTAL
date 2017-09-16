package com.action;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

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

public class PowerAction extends ActionSupport{
	private boolean success;
	private String message;
	
	private int groupid;
	private int userid;
	private String username;
	private String vpn;
	private int hidden;
	
	private int updateConfig;

	private int addBs;
	private int updateBs;
	private int delBs;

	private int addRadioUser;
	private int updateRadioUser;
	private int delRadioUser;
	
	private int stunRadio;
	private int reviveRadio;
	private int killRadio;

	private int addUserGroup;
	private int updateUserGroup;
	private int delUserGroup;

	private int addWebUser;
	private int updateWebUser;
	private int delWebUser;
	private int editUserPower;

	private int addWebGroup;
	private int updateWebGroup;
	private int delWebGroup;
	private int editGroupPower;
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	
	//获取会员组权限
	public String GroupPower() throws Exception{
		String sql="select * from xhdigital_web_actiongroup where groupid="+groupid;
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rs = stmt.executeQuery(sql);
		while(rs.next()){
             if(rs.getString("actionname").equals("updateConfig")){updateConfig=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addBs")){addBs=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateBs")){updateBs=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delBs")){delBs=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addRadioUser")){addRadioUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateRadioUser")){updateRadioUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delRadioUser")){delRadioUser=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("killRadio")){killRadio=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("reviveRadio")){reviveRadio=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("stunRadio")){stunRadio=rs.getInt("actionValue");}
			 
			 
			 
			 if(rs.getString("actionname").equals("addUserGroup")){addUserGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateUserGroup")){updateUserGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delUserGroup")){delUserGroup=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addWebUser")){addWebUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateWebUser")){updateWebUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delWebUser")){delWebUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("editUserPower")){editUserPower=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addWebGroup")){addWebGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateWebGroup")){updateWebGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delWebGroup")){delWebGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("editGroupPower")){editGroupPower=rs.getInt("actionValue");}

		}
		rs.close();
		stmt.close();
		conn.close();
		this.success=true;
		return SUCCESS;
	}	
	//获取会员组权限
	public String UserPower() throws Exception{
		String sql="select * from xhdigital_web_actionuser where userid="+userid;
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rs = stmt.executeQuery(sql);
		while(rs.next()){
			 if(rs.getString("actionname").equals("updateConfig")){updateConfig=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addBs")){addBs=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateBs")){updateBs=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delBs")){delBs=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addRadioUser")){addRadioUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateRadioUser")){updateRadioUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delRadioUser")){delRadioUser=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("killRadio")){killRadio=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("reviveRadio")){reviveRadio=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("stunRadio")){stunRadio=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addUserGroup")){addUserGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateUserGroup")){updateUserGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delUserGroup")){delUserGroup=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addWebUser")){addWebUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateWebUser")){updateWebUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delWebUser")){delWebUser=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("editUserPower")){editUserPower=rs.getInt("actionValue");}
			 
			 if(rs.getString("actionname").equals("addWebGroup")){addWebGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("updateWebGroup")){updateWebGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("delWebGroup")){delWebGroup=rs.getInt("actionValue");}
			 if(rs.getString("actionname").equals("editGroupPower")){editGroupPower=rs.getInt("actionValue");}
		}
		rs.close();
		stmt.close();
		conn.close();
		this.success=true;
		return SUCCESS;
	}
	//修改会员组权限
	public String updateGroupPower() throws Exception{
		String sql="delete from xhdigital_web_actiongroup where groupid="+groupid;
		Sql.Update(sql);
		String sql2="insert into xhdigital_web_actiongroup(actionname,actionValue,groupid)VALUES"+
		"('updateConfig','"+updateConfig+"',"+groupid+")," +
		
		"('addBs','"+addBs+"',"+groupid+")," +
		"('updateBs','"+updateBs+"',"+groupid+")," +
		"('delBs','"+delBs+"',"+groupid+")," +
		
		"('addRadioUser','"+addRadioUser+"',"+groupid+")," +
		"('updateRadioUser','"+updateRadioUser+"',"+groupid+")," +
		"('delRadioUser','"+delRadioUser+"',"+groupid+")," +
		
	"('stunRadio','"+stunRadio+"',"+groupid+")," +
	"('reviveRadio','"+reviveRadio+"',"+groupid+")," +
	"('killRadio','"+killRadio+"',"+groupid+")," +
		
		"('addUserGroup','"+addUserGroup+"',"+groupid+")," +
		"('updateUserGroup','"+updateUserGroup+"',"+groupid+")," +
		"('delUserGroup','"+delUserGroup+"',"+groupid+")," +
		
		"('addWebUser','"+addWebUser+"',"+groupid+")," +
		"('updateWebUser','"+updateWebUser+"',"+groupid+")," +
		"('delWebUser','"+delWebUser+"',"+groupid+")," +
		"('editUserPower','"+editUserPower+"',"+groupid+")," +
		
		"('addWebGroup','"+addWebGroup+"',"+groupid+")," +
		"('updateWebGroup','"+updateWebGroup+"',"+groupid+")," +
		"('delWebGroup','"+delWebGroup+"',"+groupid+")," +
		"('editGroupPower','"+editGroupPower+"',"+groupid+")";
		Sql.Update(sql2);
		updateUserP();
		this.message="修改会员组权限成功";
		this.success=true;
		return SUCCESS;
		
	}
	//修改会员组权限时同时更新会员权限
	public void updateUserP() throws Exception{
		if(updateConfig==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='updateConfig' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		
		if(addBs==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='addBs' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(updateBs==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='updateBs' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(delBs==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='delBs' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		
		if(addRadioUser==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='addRadioUser' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(updateRadioUser==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='updateRadioUser' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(delRadioUser==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='delRadioUser' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		
		
		if(killRadio==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='killRadio' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(reviveRadio==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='reviveRadio' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(stunRadio==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='stunRadio' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		
		
		if(addUserGroup==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='addUserGroup' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(updateUserGroup==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='updateUserGroup' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(delUserGroup==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='delUserGroup' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		
		if(addWebUser==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='addWebUser' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(updateWebUser==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='updateWebUser' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(delWebUser==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='delWebUser' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(editUserPower==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='editUserPower' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		
		if(addWebGroup==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='addWebGroup' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(updateWebGroup==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='updateWebGroup' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(delWebGroup==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='delWebGroup' and userid in("+userids()+")";
			Sql.Update(sql);
		}
		if(editGroupPower==0){
			String sql="update xhdigital_web_actionuser set actionValue=0 where actionName='editGroupPower' and userid in("+userids()+")";
			Sql.Update(sql);
		}
	}
	//根据groupid获取userid
	public String userids() throws Exception{
		String sql="select id from xhdigital_web_user where groupid="+groupid;
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		String str="";
		while(rst.next())
		{
			str+=rst.getInt("id")+",";
		}
		rst.close();
		stmt.close();
		conn.close();
		return str.substring(0, str.lastIndexOf(','));
		
	}
	//根据groupid获取username
	public String username() throws Exception{
		String sql="select username from xhdigital_web_user where groupid="+groupid;
		Connection conn=db.getConn();
		Statement stmt=conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		String str="";
		while(rst.next())
		{
			str+=rst.getString("username")+",";
		}
		rst.close();
		stmt.close();
		conn.close();
		return str.substring(0, str.lastIndexOf(','));
		
	}
	//修改会员权限
	public String updateUserPower() throws Exception{
		String sql="delete from xhdigital_web_actionuser where userid="+userid;
		Sql.Update(sql);
		String sql2="insert into xhdigital_web_actionuser(actionname,actionValue,userid)VALUES"+
		"('updateConfig','"+updateConfig+"',"+userid+")," +
		
		"('addBs','"+addBs+"',"+userid+")," +
		"('updateBs','"+updateBs+"',"+userid+")," +
		"('delBs','"+delBs+"',"+userid+")," +
		
		"('addRadioUser','"+addRadioUser+"',"+userid+")," +
		"('updateRadioUser','"+updateRadioUser+"',"+userid+")," +
		"('delRadioUser','"+delRadioUser+"',"+userid+")," +
		
	   "('stunRadio','"+stunRadio+"',"+userid+")," +
	  "('reviveRadio','"+reviveRadio+"',"+userid+")," +
	  "('killRadio','"+killRadio+"',"+userid+")," +
		
		"('addUserGroup','"+addUserGroup+"',"+userid+")," +
		"('updateUserGroup','"+updateUserGroup+"',"+userid+")," +
		"('delUserGroup','"+delUserGroup+"',"+userid+")," +
		
		"('addWebUser','"+addWebUser+"',"+userid+")," +
		"('updateWebUser','"+updateWebUser+"',"+userid+")," +
		"('delWebUser','"+delWebUser+"',"+userid+")," +
		"('editUserPower','"+editUserPower+"',"+userid+")," +
		
		"('addWebGroup','"+addWebGroup+"',"+userid+")," +
		"('updateWebGroup','"+updateWebGroup+"',"+userid+")," +
		"('delWebGroup','"+delWebGroup+"',"+userid+")," +
		"('editGroupPower','"+editGroupPower+"',"+userid+")";
		Sql.Update(sql2);
		this.message="修改会员组权限成功";
		this.success=true;
		return SUCCESS;
		
	}
	//修改会员组菜单显示
	public String updateGroupMenu() throws Exception{
		String sql="update xhdigital_web_groupmenu set hidden="+hidden+" where vpn='"+vpn+"' and groupid="+groupid;
		Sql.Update(sql);
		if(hidden==1){
			String sql2="update xhdigital_web_usermenu set hidden=1 where vpn='"+vpn+"' and userid in ("+userids()+")";
			Sql.Update(sql2);
			String[] str=username().split(",");
		    for (int i = 0; i < str.length; i++) {
		    	createUserMenuJson(str[i]);
			}
			
		}
		log.writeLog(2, log.time()+" 修改了会员菜单", "");
		this.success=true;
		return SUCCESS;
	}
	//修改会员菜单
	public String updateUserMenu() throws Exception{
		String sql="update xhdigital_web_usermenu set hidden="+hidden+" where vpn='"+vpn+"' and userid="+userid;
		Sql.Update(sql);
		log.writeLog(2, log.time()+" 修改了会员菜单", "");
		createUserMenuJson(username);
		this.success=true;
		return SUCCESS;
	}
	public void createUserMenuJson(String user) throws Exception{
		ArrayList data=new ArrayList();
	    data=new UserMenu().userMenuItem(user);
		String str = json.Encode(file.menuList(data));		
		file.creatTxtFile(user);
		file.writeTxtFile (user,str); 
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
	public int getGroupid() {
		return groupid;
	}
	public void setGroupid(int groupid) {
		this.groupid = groupid;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public int getUpdateConfig() {
		return updateConfig;
	}
	public void setUpdateConfig(int updateConfig) {
		this.updateConfig = updateConfig;
	}
	public int getAddBs() {
		return addBs;
	}
	public void setAddBs(int addBs) {
		this.addBs = addBs;
	}
	public int getUpdateBs() {
		return updateBs;
	}
	public void setUpdateBs(int updateBs) {
		this.updateBs = updateBs;
	}
	public int getDelBs() {
		return delBs;
	}
	public void setDelBs(int delBs) {
		this.delBs = delBs;
	}
	public int getAddRadioUser() {
		return addRadioUser;
	}
	public void setAddRadioUser(int addRadioUser) {
		this.addRadioUser = addRadioUser;
	}
	public int getUpdateRadioUser() {
		return updateRadioUser;
	}
	public void setUpdateRadioUser(int updateRadioUser) {
		this.updateRadioUser = updateRadioUser;
	}
	public int getDelRadioUser() {
		return delRadioUser;
	}
	public void setDelRadioUser(int delRadioUser) {
		this.delRadioUser = delRadioUser;
	}
	public int getAddUserGroup() {
		return addUserGroup;
	}
	public void setAddUserGroup(int addUserGroup) {
		this.addUserGroup = addUserGroup;
	}
	public int getUpdateUserGroup() {
		return updateUserGroup;
	}
	public void setUpdateUserGroup(int updateUserGroup) {
		this.updateUserGroup = updateUserGroup;
	}
	public int getDelUserGroup() {
		return delUserGroup;
	}
	public void setDelUserGroup(int delUserGroup) {
		this.delUserGroup = delUserGroup;
	}
	public int getAddWebUser() {
		return addWebUser;
	}
	public void setAddWebUser(int addWebUser) {
		this.addWebUser = addWebUser;
	}
	public int getUpdateWebUser() {
		return updateWebUser;
	}
	public void setUpdateWebUser(int updateWebUser) {
		this.updateWebUser = updateWebUser;
	}
	public int getDelWebUser() {
		return delWebUser;
	}
	public void setDelWebUser(int delWebUser) {
		this.delWebUser = delWebUser;
	}
	public int getEditUserPower() {
		return editUserPower;
	}
	public void setEditUserPower(int editUserPower) {
		this.editUserPower = editUserPower;
	}
	public int getAddWebGroup() {
		return addWebGroup;
	}
	public void setAddWebGroup(int addWebGroup) {
		this.addWebGroup = addWebGroup;
	}
	public int getUpdateWebGroup() {
		return updateWebGroup;
	}
	public void setUpdateWebGroup(int updateWebGroup) {
		this.updateWebGroup = updateWebGroup;
	}
	public int getDelWebGroup() {
		return delWebGroup;
	}
	public void setDelWebGroup(int delWebGroup) {
		this.delWebGroup = delWebGroup;
	}
	public int getEditGroupPower() {
		return editGroupPower;
	}
	public void setEditGroupPower(int editGroupPower) {
		this.editGroupPower = editGroupPower;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
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
	public int getStunRadio() {
		return stunRadio;
	}
	public void setStunRadio(int stunRadio) {
		this.stunRadio = stunRadio;
	}
	public int getReviveRadio() {
		return reviveRadio;
	}
	public void setReviveRadio(int reviveRadio) {
		this.reviveRadio = reviveRadio;
	}
	public int getKillRadio() {
		return killRadio;
	}
	public void setKillRadio(int killRadio) {
		this.killRadio = killRadio;
	}
	
	

}
