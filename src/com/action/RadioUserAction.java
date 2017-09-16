package com.action;

import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.validator.Var;
import org.apache.struts2.ServletActionContext;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;

import com.socket.MessageStruct;
import com.socket.SendData;
import com.socket.TcpKeepAliveClient;
import com.func.Cookies;
import com.func.XhLog;
import com.func.MD5;
import com.func.WebFun;
import com.opensymphony.xwork2.ActionSupport;
import com.protobuf.TrunkCommon;
import com.protobuf.TrunkMsoBs;
import com.protobuf.TrunkMsoDs;
import com.sql.SysSql;
import com.sql.XhMysql;
import com.sql.XhSql;
import com.struct.radioUserStruct;

public class RadioUserAction extends ActionSupport{
	private boolean success;
	private String message;
	private String deleteIds; //删除ID号
	
	
	private int id_type;
	private int np;
	private int fgn;
	private int gn;
	
	private int id;
    //private String np;
    private int type;
    private String alias;
    private String regstatus;
    private String authoritystatus;
    private String priority;
    private String maxcalltime;
    private String roamen;
    private String esn;
    private String g_callen;
    private String i_callen;
    private String emergencyen;
    private String broadcasten;
    private String allnetcallen;
    private String areacallen;
    private String tscallen; 
    private String foacsuen;
    private String g_smsen;
    private String i_smsen;
    private String pstnen;
    private String gpsen;
    private String authen;
    private String adv_authen;
    private String include_call_en;
    private String discreet_listening_en;
    private String stun_kill_revive_en;
    private String force2conventional_en;
    private String diverting_call_num;
    private String hometsid;
    private String name;
    private int key1;
    private String  model;
    private String  number;
    private String  openpass;
    private String  company;
    private int  pdtId;
    private String  post;
    private String  job;
    private String  checkPerson;
    private String  personNumber;
    
	private String hometerminalid;
    private String basestationid;
    
    private String hometerminalids;
    private String bsids;
    private String mscIds;
    
    private int slot;
    
    private File filePath; //上传设备图片
	private String fileName;    //上传的文件名  
	private String uploadContentType; //限制上传的后缀名  
	private String uploadFileName;
	private String uploadFileSize;
    
	private XhMysql db=new XhMysql();
	private XhSql Sql=new XhSql();
	private SysSql sysSql=new SysSql();
	private MD5 md5=new MD5();
	private Cookies cookie=new Cookies();
	private XhLog log=new XhLog();
	private WebFun fun=new WebFun();
	
	private MessageStruct header=new MessageStruct();
	private SendData send=new SendData();
	protected final Log log4j = LogFactory.getLog(RadioUserAction.class);
	
	
	
	public String Leader() throws Exception{
		String sql="select id from hometerminal where isLeader=0 limit 500";
		Connection conn = db.getConn();
		Statement stmt = conn.createStatement();
		ResultSet rst = stmt.executeQuery(sql);
		List<radioUserStruct> list=new  ArrayList<radioUserStruct>();
		String  str="";
		while (rst.next()) {
			radioUserStruct radio=new radioUserStruct();
			int ss=rst.getInt("id");
			
			if (isLeader(ss)) {
				/*radio.setMscId(rst.getInt("id"));
				list.add(radio);*/
				
				str=str+","+ss;
				
			}			
		}
		
		if (str.length()>1) {
			str=str.substring(1);
			System.out.println("手台ID"+str);
			String sql2="update hometerminal set isLeader=1 where id in("+str+")";
			Sql.Update(sql2);
		}else {
			log4j.debug("无需更新手台");
		}
		
		
		/*for (radioUserStruct radioUser : list) {
			String sql2="update hometerminal set isLeader=1 where id="+radioUser.getMscId();
			Sql.Update(sql2);
		}*/
		
		this.success=true;
		return SUCCESS;
	}
	
	public static boolean isLeader(int id) {
		int len=String.valueOf(id).length();
		int msc=id;
		if (len==7) {
			int a=msc/10000;
			int b=msc%10;
			int a1=a/100;
			int a2=a%100/10;
			int a3=a%10;
			int c=a1+a2+a3;
			if (c%10==b) {
				return true;
			}else {
				return false;
			}
		}else if (len==8) {
			int a=msc/10000;
			int b=msc%10;
			int a1=a/1000;
			int a2=a%1000/100;
			int a3=a%100/10;
			int a4=a%10;
			int c=a1+a2+a3+a4;
			if (c%10==b) {
				return true;
			}else {
				return false;
			}
		}
		return false;
	}
	
	
    //导入数据
    public String IntoFile() throws Exception{
    	  ExcelToMysql();
    	  this.success=true;
    	  this.message="导入数据成功";
    	  setMessageHeader();
  		  if (TcpKeepAliveClient.getSocket().isConnected()) {
  			send.ReadDBREQ(header, "hometerminal");
  			log.writeLog(4, "导入终端属性信息", "");
		}
    	return SUCCESS;
    }
    //Excel表中的数据导入到MySql数据库
    public  void ExcelToMysql() throws Exception{
        //得到表格中所有的数据
        List<radioUserStruct> listExcel=getAllByExcel(filePath.getAbsolutePath());
        for (radioUserStruct struct : listExcel) {
        	/*System.out.println(struct.getMscId());
        	System.out.println(struct.getPerson());
        	System.out.println(struct.getKey());
        	System.out.println(struct.getCheckPerson());*/
        	String sql1="select id from hometerminal where id="+struct.getMscId();
        	String sql2="select id from xhdigital_radiouser where mscId="+struct.getMscId();
        	String sql3="",sql4="";
        	if (!Sql.exists(sql1)) {
        		
        		if (isLeader(struct.getMscId())) {
        			sql3="insert into hometerminal(id,name,type,key1,isLeader)VALUES('"+struct.getMscId()+"','"+struct.getPerson()+"',"
    						+ "'"+struct.getType()+"','"+struct.getKey()+"',1) ";
				}else {
					sql3="insert into hometerminal(id,name,type,key1,isLeader)VALUES('"+struct.getMscId()+"','"+struct.getPerson()+"',"
							+ "'"+struct.getType()+"','"+struct.getKey()+"',0) ";
				}
        		
				
				Sql.Update(sql3);
			}else {
				sql3="update hometerminal set name='"+struct.getPerson()+"',type='"+struct.getType()+"',key1='"+struct.getKey()+"' where id="+struct.getMscId();
				Sql.Update(sql3);
			}
        	if (!sysSql.exists(sql2)) {
				sql4="insert into xhdigital_radiouser(mscId,model,number,esn,openpass,pdtId,mptId,"
						+ "moniId,company,post,job,personNumber,person,keyValue,checkPerson)VALUES('"+struct.getMscId()+"',"
						+ "'"+struct.getModel()+"','"+struct.getNumber()+"','"+struct.getEsn()+"','"+struct.getOpenpass()+"',"
						+ "'"+struct.getPdtId()+"','"+struct.getMptId()+"','"+struct.getMoniId()+"','"+struct.getCompany()+"',"
						+ "'"+struct.getPost()+"','"+struct.getJob()+"','"+struct.getPersonNumber()+"','"+struct.getPerson()+"',"
						+ "'"+struct.getKey()+"','"+struct.getCheckPerson()+"')";
				sysSql.Update(sql4);
			}else {
				sql4="update xhdigital_radiouser set model='"+struct.getModel()+"',number='"+struct.getNumber()+"',esn='"+struct.getEsn()+"',"
						+ "openpass='"+struct.getOpenpass()+"',pdtId='"+struct.getPdtId()+"',"
						+ "company='"+struct.getCompany()+"',post='"+struct.getPost()+"',job='"+struct.getJob()+"',personNumber='"+struct.getPersonNumber()+"',"
						+ "person='"+struct.getPerson()+"',keyValue='"+struct.getKey()+"',checkPerson='"+struct.getCheckPerson()+"' where mscId="+struct.getMscId();
				sysSql.Update(sql4);
			}
        }
        setMessageHeader();
		send.ReadDBREQ(header, "hometerminal");
        
    }
    /**
     * 查询指定目录中电子表格中所有的数据
     * @param file 文件完整路径
     * @return
     */
    public  List<radioUserStruct> getAllByExcel(String  file){
        List<radioUserStruct> list=new ArrayList<radioUserStruct>();
        try {
            Workbook rwb=Workbook.getWorkbook(new File(file));
          //取得第一个sheet  
            int sheet=rwb.getSheets().length;
            
            for(int a=0;a<sheet;a++){
            	
          
            Sheet rs=rwb.getSheet(a); 
            
            int clos=rs.getColumns();//得到所有的列
            int rows=rs.getRows();//得到所有的行
            for(int i = 2; i < rows; i++) {  
                Cell [] cell = rs.getRow(i);  
                int cellLen=cell.length;
                if(cellLen>3){
                	for(int j=1; j<16; j++) {  
                        //getCell(列，行)  
                        //out.print(sheet.getCell(j, i).getContents());  
                		radioUserStruct radiouser=new radioUserStruct();
                		radiouser.setModel(rs.getCell(j++, i).getContents());
                		radiouser.setNumber(rs.getCell(j++, i).getContents());
                		radiouser.setEsn(rs.getCell(j++, i).getContents());
                		
                		radiouser.setPdtId(rs.getCell(j++, i).getContents());
                		radiouser.setOpenpass(rs.getCell(j++, i).getContents());
                		
                		//radiouser.setMptId(rs.getCell(j++, i).getContents());
                		radiouser.setRadioId(rs.getCell(j++, i).getContents());
                		radiouser.setLastId(rs.getCell(j++, i).getContents());
                		radiouser.setKey(rs.getCell(j++, i).getContents());
                		//radiouser.setMoniId(rs.getCell(j++, i).getContents());
                		
                		radiouser.setCompany(rs.getCell(j++, i).getContents());
                		radiouser.setPost(rs.getCell(j++, i).getContents());
                		radiouser.setJob(rs.getCell(j++, i).getContents());
                		radiouser.setPersonNumber(rs.getCell(j++, i).getContents());
                		radiouser.setCheckPerson(rs.getCell(j++, i).getContents());
                		radiouser.setPerson(rs.getCell(j++, i).getContents());
                		
                		
                		if(radiouser.getOpenpass().equals("")){
                			radiouser.setType(4);
                		}else {
                			if (radiouser.getOpenpass().equals("固定台")) {
    							radiouser.setType(3);
    						}else if(radiouser.getOpenpass().equals("调度台")){
    							radiouser.setType(2);
    						}else if(radiouser.getOpenpass().equals("车载台")){
    							radiouser.setType(1);
    						}else {
    							radiouser.setType(0);
    						}
						}
                		
                		
                		
                		try {
                			radiouser.setMscId(Integer.parseInt(radiouser.getRadioId()+radiouser.getLastId()));
                			list.add(radiouser);
                			
						} catch (NumberFormatException e) {
							// TODO: handle exception
						System.out.println("导入数据格式不对");
						}
                		
                		
                		
                    } 
                }
                 
            }  
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
        	System.out.println("导入excel出错");
        	e.printStackTrace();
        } 
        return list;
        
    }
	
	//添加终端用户
	public String addRadioUser() throws Exception{
		if (id_type==1) {
			String str=String.valueOf(np)+String.valueOf(fgn);
			int result=0,resultB=0,num=0,m_type=0;
			if (np>=10) {
				result=Integer.parseInt(String.valueOf(np).substring(0,1))+Integer.parseInt(String.valueOf(np).substring(1));
				result+=Integer.parseInt(String.valueOf(fgn).substring(0,1))+Integer.parseInt(String.valueOf(fgn).substring(1));
			}else {
				result=np+Integer.parseInt(String.valueOf(fgn).substring(0,1))+Integer.parseInt(String.valueOf(fgn).substring(1));
			}
			//System.out.println("result:"+result);
			resultB=Integer.parseInt(String.valueOf(gn).substring(1));
			//System.out.println("resultB:"+resultB);
			if (resultB>=11&&resultB<=98 &&np!=0) {
				num=(result+1)%10;
			}else {
				num=result%10;
			}
			id=Integer.parseInt(String.valueOf(np)+String.valueOf(fgn)+String.valueOf(gn)+String.valueOf(num));
			if ((resultB>=11&&resultB<=98) || (resultB>=1 && resultB<=7)) {
				type=0;
			}else if(resultB==0||(resultB>=8 && resultB<=10)){
				type=2;
			}else {
				type=1;
			}
		}else {
			
		}
		int lea=0;
		if (isLeader(id)) {
			lea=1;
		}
		
		
		String sql="select id from hometerminal where id="+id;
		String sql_attr="select id from xhdigital_radiouser where mscId="+id;
		String sql2="insert into hometerminal(id,np,type,regstatus,authoritystatus,priority,maxcalltime,roamen," +
				"g_callen,i_callen,emergencyen,broadcasten,allnetcallen,areacallen,tscallen,foacsuen,g_smsen," +
				"i_smsen,pstnen,gpsen,authen,adv_authen,include_call_en,discreet_listening_en,stun_kill_revive_en," +
				"force2conventional_en,diverting_call_num,name,esn,key1,isLeader)VALUES("+id+",'"+np+"','"+type+"'," +
				"'"+regstatus+"','"+authoritystatus+"','"+priority+"','"+maxcalltime+"','"+roamen+"','"+g_callen+"'," +
				"'"+i_callen+"','"+emergencyen+"','"+broadcasten+"','"+allnetcallen+"','"+areacallen+"','"+tscallen+"'," +
				"'"+foacsuen+"','"+g_smsen+"','"+i_smsen+"','"+pstnen+"','"+gpsen+"','"+authen+"','"+adv_authen+"'," +
				"'"+include_call_en+"','"+discreet_listening_en+"','"+stun_kill_revive_en+"','"+force2conventional_en+"'," +
				"'"+diverting_call_num+"','"+name+"','"+esn+"','"+key1+"','"+lea+"')";
		String sql_attr2="insert into xhdigital_radiouser(mscId,person,model,number,openpass,pdtId,"
				+ "company,post,job,checkPerson,personNumber)VALUES('"+id+"','"+name+"','"+model+"',"
				+ "'"+number+"','"+openpass+"','"+pdtId+"','"+company+"','"+post+"','"+job+"',"
						+ "'"+checkPerson+"','"+personNumber+"')";
		String sql_attr2_u="update xhdigital_radiouser set person='"+name+"',model='"+model+"',"
				+ "number='"+number+"',openpass='"+openpass+"',pdtId='"+pdtId+"',company='"+company+"',"
				+ "post='"+post+"',job='"+job+"',checkPerson='"+checkPerson+"',personNumber='"+personNumber+"' "
				+ " where mscId='"+id+"'";
		if (Sql.exists(sql)) {
			this.message="该ID已经存在";
			this.success=false;
			
		} else {
			Sql.Update(sql2);
			this.message="终端信息添加成功";
			log.writeLog(1, "终端信息添加成功："+this.id, "");
			this.success=true;

		}
		if (sysSql.exists(sql_attr)) {
			sysSql.Update(sql_attr2_u);
		}else {
			sysSql.Update(sql_attr2);
		}
		return SUCCESS;
	}
	//添加归属基站
	public String addRadioUserBS() throws Exception{
		String[] mscId=hometerminalids.split(",");
		String[] tsId=bsids.split(",");
		for (int i = 0; i < mscId.length; i++) {
			for (int j = 0; j < tsId.length; j++) {
				String sql = "select * from hometerminal_basestation where hometerminalid='"
					+ mscId[i]
					+ "' and basestationid='"
					+ tsId[j]
					+ "'";
			    String sql2 = "insert into hometerminal_basestation(hometerminalid,basestationid)VALUES("
					+ mscId[i] + "," + tsId[j] + ")";
			    if (!Sql.exists(sql)) {
			    	Sql.Update(sql2);
					
					this.message = "归属基站添加成功";
					log.writeLog(1, "终端归属基站添加成功：" + tsId[j], "");
					
				}
			}
		}
		setMessageHeader();
		send.ReadDBREQ(header, "hometerminal_basestation");
		this.success=true;
		return SUCCESS;
	}
	//修改终端用户
	public String updateRadioUser() throws Exception{
		String sql="update hometerminal set np='"+np+"',type='"+type+"'," +
				"regstatus='"+regstatus+"',priority='"+priority+"'," +
				"maxcalltime='"+maxcalltime+"',roamen='"+roamen+"',g_callen='"+g_callen+"'," +
				"i_callen='"+i_callen+"',emergencyen='"+emergencyen+"',broadcasten='"+broadcasten+"'," +
				"allnetcallen='"+allnetcallen+"',areacallen='"+areacallen+"',tscallen='"+tscallen+"'," +
				"foacsuen='"+foacsuen+"',g_smsen='"+g_smsen+"',i_smsen='"+i_smsen+"'," +
				"pstnen='"+pstnen+"',gpsen='"+gpsen+"',authen='"+authen+"',adv_authen='"+adv_authen+"'," +
				"include_call_en='"+include_call_en+"',discreet_listening_en='"+discreet_listening_en+"'," +
				"stun_kill_revive_en='"+stun_kill_revive_en+"',force2conventional_en='"+force2conventional_en+"'," +
				"diverting_call_num='"+diverting_call_num+"',hometsid='"+hometsid+"',name='"+name+"',esn='"+esn+"',key1='"+key1+"' where id="+id;
		String sql2="select id from xhdigital_radiouser where mscId="+id;
		String sql3="update xhdigital_radiouser set person='"+name+"',model='"+model+"',"
				+ "number='"+number+"',openpass='"+openpass+"',pdtId='"+pdtId+"',company='"+company+"',"
				+ "post='"+post+"',job='"+job+"',checkPerson='"+checkPerson+"',personNumber='"+personNumber+"' "
				+ " where mscId='"+id+"'";
		String sql4="insert into xhdigital_radiouser(mscId,person,model,number,openpass,pdtId,"
				+ "company,post,job,checkPerson,personNumber)VALUES('"+id+"','"+name+"','"+model+"',"
				+ "'"+number+"','"+openpass+"','"+pdtId+"','"+company+"','"+post+"','"+job+"',"
						+ "'"+checkPerson+"','"+personNumber+"')";
		
		Sql.Update(sql);
	    if (sysSql.exists(sql2)) {
			sysSql.Update(sql3);
		
		}else {
			
			sysSql.Update(sql4);
		}
		setMessageHeader();
		send.ReadDBREQ(header, "hometerminal");
		this.message="修改终端用户信息成功";
		
		this.success=true;
		return SUCCESS;
		
	}
	//删除终端用户
	public String delRadioUser() throws Exception{
		String[] ids=this.deleteIds.split(",");
		for(int i=0;i<ids.length;i++){
			String sql="delete from hometerminal where id="+ids[i];
			Sql.Update(sql);
		}
		setMessageHeader();
		send.ReadDBREQ(header, "hometerminal");
		this.success=true;
		return SUCCESS;
	}
	//删除终端用户归属基站
	public String delRadioUserBS() throws Exception{
		String sql="delete from hometerminal_basestation where hometerminalid='"+hometerminalid+"' and basestationid='"+basestationid+"'";
		Sql.Update(sql);
		setMessageHeader();
		send.ReadDBREQ(header, "hometerminal");
		this.success=true;
		return SUCCESS;
	}
	//摇晕对讲机
	public String stunRadio() throws Exception{
		String[] mscid=mscIds.split(",");
		//log4j.info("gpsnum->:"+header.getSeqNum());
		for (String str : mscid) {
			MessageStruct header1=new MessageStruct();
			log4j.info("gpsnum->:"+header1.getSeqNum());
			send.DataREQ(header1, Integer.parseInt(str),slot,TrunkCommon.DeviceType.MS,TrunkCommon.DataType.STUN);
			Thread.sleep(200);
			log.writeLog(4,  "操作：遥晕对讲机："+str, "");
		}
		this.success=true;
		return SUCCESS;
	}
	//复活对讲机
	public String reviveRadio() throws Exception{
		String[] mscid=mscIds.split(",");
		for (String str : mscid) {
			MessageStruct header1=new MessageStruct();
			log4j.info("gpsnum->:"+header1.getSeqNum());
			send.DataREQ(header1, Integer.parseInt(str),slot,TrunkCommon.DeviceType.MS,TrunkCommon.DataType.REVIVE);
			Thread.sleep(200);
			log.writeLog(4,  "操作：复活对讲机："+str, "");
		}
		this.success=true;
		return SUCCESS;
	}
	//摇毙对讲机
	public String killRadio() throws Exception{
		/*String[] mscid=mscIds.split(",");
		for (String str : mscid) {
			send.DataREQ(header, Integer.parseInt(str),TrunkCommon.DeviceType.MS,TrunkCommon.DataType.KILL);
			Thread.sleep(100);
		}
		this.success=true;*/
		return SUCCESS;
	}
	
	//摇晕对讲机
	public void stun(int msc) throws Exception{
		MessageStruct header1=new MessageStruct();
		send.DataREQ(header1,msc,slot,TrunkCommon.DeviceType.MS,TrunkCommon.DataType.STUN);
		}
		//复活对讲机
    public void revive(int msc) throws Exception{
			MessageStruct header1=new MessageStruct();
			send.DataREQ(header1, msc,slot,TrunkCommon.DeviceType.MS,TrunkCommon.DataType.REVIVE);
		}
    //手台上线加入数据库
    public void mscOnline(int msc){
    	String sql="insert into xhdigital_offonline(mscid,online,time)values('"+msc+"',1,'"+fun.nowDate()+"')";
    	try {
			sysSql.Update(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    }
	//数据包头
	public void setMessageHeader()
	{		
		header.setCMDId((short)6);    //  命令id
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
	public String getDeleteIds() {
		return deleteIds;
	}
	public void setDeleteIds(String deleteIds) {
		this.deleteIds = deleteIds;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getRegstatus() {
		return regstatus;
	}
	public void setRegstatus(String regstatus) {
		this.regstatus = regstatus;
	}
	public String getAuthoritystatus() {
		return authoritystatus;
	}
	public void setAuthoritystatus(String authoritystatus) {
		this.authoritystatus = authoritystatus;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getMaxcalltime() {
		return maxcalltime;
	}
	public void setMaxcalltime(String maxcalltime) {
		this.maxcalltime = maxcalltime;
	}
	public String getRoamen() {
		return roamen;
	}
	public void setRoamen(String roamen) {
		this.roamen = roamen;
	}
	public String getG_callen() {
		return g_callen;
	}
	public void setG_callen(String gCallen) {
		g_callen = gCallen;
	}
	public String getI_callen() {
		return i_callen;
	}
	public void setI_callen(String iCallen) {
		i_callen = iCallen;
	}
	public String getEmergencyen() {
		return emergencyen;
	}
	public void setEmergencyen(String emergencyen) {
		this.emergencyen = emergencyen;
	}
	public String getBroadcasten() {
		return broadcasten;
	}
	public void setBroadcasten(String broadcasten) {
		this.broadcasten = broadcasten;
	}
	public String getAllnetcallen() {
		return allnetcallen;
	}
	public void setAllnetcallen(String allnetcallen) {
		this.allnetcallen = allnetcallen;
	}
	public String getAreacallen() {
		return areacallen;
	}
	public void setAreacallen(String areacallen) {
		this.areacallen = areacallen;
	}
	public String getTscallen() {
		return tscallen;
	}
	public void setTscallen(String tscallen) {
		this.tscallen = tscallen;
	}
	public String getFoacsuen() {
		return foacsuen;
	}
	public void setFoacsuen(String foacsuen) {
		this.foacsuen = foacsuen;
	}
	public String getG_smsen() {
		return g_smsen;
	}
	public void setG_smsen(String gSmsen) {
		g_smsen = gSmsen;
	}
	public String getI_smsen() {
		return i_smsen;
	}
	public void setI_smsen(String iSmsen) {
		i_smsen = iSmsen;
	}
	public String getPstnen() {
		return pstnen;
	}
	public void setPstnen(String pstnen) {
		this.pstnen = pstnen;
	}
	public String getGpsen() {
		return gpsen;
	}
	public void setGpsen(String gpsen) {
		this.gpsen = gpsen;
	}
	public String getAuthen() {
		return authen;
	}
	public void setAuthen(String authen) {
		this.authen = authen;
	}
	public String getAdv_authen() {
		return adv_authen;
	}
	public void setAdv_authen(String advAuthen) {
		adv_authen = advAuthen;
	}
	public String getInclude_call_en() {
		return include_call_en;
	}
	public void setInclude_call_en(String includeCallEn) {
		include_call_en = includeCallEn;
	}
	public String getDiscreet_listening_en() {
		return discreet_listening_en;
	}
	public void setDiscreet_listening_en(String discreetListeningEn) {
		discreet_listening_en = discreetListeningEn;
	}
	public String getStun_kill_revive_en() {
		return stun_kill_revive_en;
	}
	public void setStun_kill_revive_en(String stunKillReviveEn) {
		stun_kill_revive_en = stunKillReviveEn;
	}
	public String getForce2conventional_en() {
		return force2conventional_en;
	}
	public void setForce2conventional_en(String force2conventionalEn) {
		force2conventional_en = force2conventionalEn;
	}
	public String getDiverting_call_num() {
		return diverting_call_num;
	}
	public void setDiverting_call_num(String divertingCallNum) {
		diverting_call_num = divertingCallNum;
	}
	public String getHometsid() {
		return hometsid;
	}
	public void setHometsid(String hometsid) {
		this.hometsid = hometsid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getHometerminalid() {
		return hometerminalid;
	}
	public void setHometerminalid(String hometerminalid) {
		this.hometerminalid = hometerminalid;
	}
	public String getBasestationid() {
		return basestationid;
	}
	public void setBasestationid(String basestationid) {
		this.basestationid = basestationid;
	}
	public String getEsn() {
		return esn;
	}
	public void setEsn(String esn) {
		this.esn = esn;
	}
	public String getHometerminalids() {
		return hometerminalids;
	}
	public void setHometerminalids(String hometerminalids) {
		this.hometerminalids = hometerminalids;
	}
	public String getBsids() {
		return bsids;
	}
	public void setBsids(String bsids) {
		this.bsids = bsids;
	}
	public String getMscIds() {
		return mscIds;
	}
	public void setMscIds(String mscIds) {
		this.mscIds = mscIds;
	}
	public int getNp() {
		return np;
	}
	public int getFgn() {
		return fgn;
	}
	public int getGn() {
		return gn;
	}
	public void setNp(int np) {
		this.np = np;
	}
	public void setFgn(int fgn) {
		this.fgn = fgn;
	}
	public void setGn(int gn) {
		this.gn = gn;
	}
	public int getId_type() {
		return id_type;
	}
	public void setId_type(int idType) {
		id_type = idType;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public File getFilePath() {
		return filePath;
	}
	public void setFilePath(File filePath) {
		this.filePath = filePath;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getUploadContentType() {
		return uploadContentType;
	}
	public void setUploadContentType(String uploadContentType) {
		this.uploadContentType = uploadContentType;
	}
	public String getUploadFileName() {
		return uploadFileName;
	}
	public void setUploadFileName(String uploadFileName) {
		this.uploadFileName = uploadFileName;
	}
	public String getUploadFileSize() {
		return uploadFileSize;
	}
	public void setUploadFileSize(String uploadFileSize) {
		this.uploadFileSize = uploadFileSize;
	}
	public int getSlot() {
		return slot;
	}
	public void setSlot(int slot) {
		this.slot = slot;
	}
	public int getKey1() {
		return key1;
	}
	public void setKey1(int key1) {
		this.key1 = key1;
	}
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model = model;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getOpenpass() {
		return openpass;
	}
	public void setOpenpass(String openpass) {
		this.openpass = openpass;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public int getPdtId() {
		return pdtId;
	}
	public void setPdtId(int pdtId) {
		this.pdtId = pdtId;
	}
	public String getPost() {
		return post;
	}
	public void setPost(String post) {
		this.post = post;
	}
	public String getJob() {
		return job;
	}
	public void setJob(String job) {
		this.job = job;
	}
	public String getCheckPerson() {
		return checkPerson;
	}
	public void setCheckPerson(String checkPerson) {
		this.checkPerson = checkPerson;
	}
	public String getPersonNumber() {
		return personNumber;
	}
	public void setPersonNumber(String personNumber) {
		this.personNumber = personNumber;
	}
    
    

}
