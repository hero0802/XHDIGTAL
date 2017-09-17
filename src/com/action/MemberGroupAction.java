package com.action;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.config.config;
import com.func.Cookies;
import com.func.FlexJSON;
import com.func.XhLog;
import com.func.MD5;
import com.func.fileManager;
import com.opensymphony.xwork2.ActionSupport;
import com.sql.SysMysql;
import com.sql.SysSql;

public class MemberGroupAction  extends ActionSupport{
	private boolean success;
	private String message;
	private String groupname;
	private String groupinfo;
	private String level;
	private String id;
	private String deleteIds;

	private String actions;
	private int groupid;
	

	
	
	private SysMysql db=new SysMysql();
	private SysSql Sql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();	
	private config INI=new config();
	private fileManager file=new fileManager();
	private FlexJSON json=new FlexJSON();
	
	//添加会员组
	public String add_MemberGroup() throws Exception
	{
		SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date=dd.format(new Date());
		String sql1="select * from xhdigital_web_membergroup where groupname='"+this.groupname+"' or id='"+id+"' ";
		String sql2="insert into xhdigital_web_membergroup (id,groupname,groupinfo,createtime)values "
			+"('"+id+"','"+this.groupname+"','"+this.groupinfo+"','"+date+"')";
		if(Sql.exists(sql1)){
			this.message="会员组已经存在";
			this.success=false;
		}
		else
		{
			int groupID=Integer.parseInt(cookie.getCookie("groupid"));
			if (Integer.parseInt(id)>=groupID) {
				this.message="会员组ID不能高于或者等于登录账号所在的组ID";
				this.success=false;
			}else {
				Sql.Update(sql2);
				//createMenu();
				/*GroupID();
				createGroupMenuJson(this.groupid);*/
				log.writeLog(1, log.time()+" 添加了会员组："+groupname, "");
				this.success=true;
			}
		}
		return SUCCESS;
	}
	//修改会员组
	public String update_MemberGroup() throws Exception
	{
		SimpleDateFormat dd=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date=dd.format(new Date());
		String sql="update xhdigital_web_membergroup set groupname='"+this.groupname+"',groupinfo='"+this.groupinfo+"',createtime='"+date+"' where id="+this.id;
		String sql1="select * from xhdigital_web_membergroup where groupname='"+this.groupname+"' and id!="+id;
		if(Sql.exists(sql1)){
			this.message="会员组已经存在";
			this.success=false;
		}
		else
		{
			int groupID=Integer.parseInt(cookie.getCookie("groupid"));
			if (Integer.parseInt(id)>groupID) {
				this.message="不能修改高于或者等于登录账号所在的组";
				this.success=false;
				return SUCCESS;
			}
			Sql.Update(sql);
			log.writeLog(1, log.time()+" 修改了会员组："+groupname, "");
			this.success=true;
		}
		
		return SUCCESS;
	}
	//删除会员组
	public String delete_MemberGroup() throws Exception
	{
		String[] ids=this.deleteIds.split(",");
		for(int i=0;i<ids.length;i++)
		{
			if (ids[i].equals(cookie.getCookie("groupid"))) {
				this.success=false;
				this.message="不能删除自己的账号所在会员组";
				
			}else{
				int groupID=Integer.parseInt(cookie.getCookie("groupid"));
				if (Integer.parseInt(ids[i])>=groupID) {
					this.message="不能删除高于或者等于登录账号所在的组ID";
					this.success=false;
					return SUCCESS;
				}
				String sql="delete from xhdigital_web_membergroup where id="+ids[i];
				Sql.Update(sql);
				delGroupPower(ids[i]);
				//delGroupMenu(ids[i]);
				this.success=true;
				log.writeLog(3, log.time()+" 删除了会员组：ID->"+ids[i], "");
			}
		}
		
		return SUCCESS;
	}
	//删除会员组菜单
	public void delGroupMenu(String ID) throws Exception{
		String sql="delete from xhdigital_web_groupmenu where groupid="+ID;
		Sql.Update(sql);
	}
	//删除会员组权限
	public void delGroupPower(String ID) throws Exception{
		String sql="delete from xhdigital_web_actiongroup where id="+ID;
		Sql.Update(sql);
	}
	//添加会员组菜单
	public void createMenu() throws Exception{
		String sql=" INSERT INTO `xhdigital_web_groupmenu`(vpn,text,url,hidden,icon,iconCls,pmenu,sort,groupid) SELECT vpn,text,url,hidden,icon,iconCls,pmenu,sort,groupid FROM `xhdigital`.`xhdigital_web_systemmenu`";
		String sql2="update xhdigital_web_groupmenu set groupid=(select id from xhdigital_web_membergroup where groupname='"+groupname+"') " +
				"where groupid=0";
		Sql.Update(sql);Sql.Update(sql2);
	
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
	public String getGroupname() {
		return groupname;
	}
	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}
	public String getGroupinfo() {
		return groupinfo;
	}
	public void setGroupinfo(String groupinfo) {
		this.groupinfo = groupinfo;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDeleteIds() {
		return deleteIds;
	}
	public void setDeleteIds(String deleteIds) {
		this.deleteIds = deleteIds;
	}
	public String getActions() {
		return actions;
	}
	public void setActions(String actions) {
		this.actions = actions;
	}
	public int getGroupid() {
		return groupid;
	}
	public void setGroupid(int groupid) {
		this.groupid = groupid;
	}
	
	

}
