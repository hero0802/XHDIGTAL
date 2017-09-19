package com.listener;

import java.util.ArrayList;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.func.WebFun;
import com.sql.SysSql;


public class BsBreakMoreCountListener implements ServletContextListener{
	private static Timer timer=null;

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if(timer!=null){
			timer.cancel();
		}
	}

	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		if (timer==null) {
			timer=new Timer();
			timer.scheduleAtFixedRate(new BsOffLineCount() ,8000, 5*1000*60);
			
		}
	}

}
class BsOffLineCount extends TimerTask{
	private WebFun func=new WebFun();
	private SysSql Sql=new SysSql();

	@Override
	public void run() {
		// TODO Auto-generated method stub
		Count();
		
	}
	public void Count(){
		int num=Integer.parseInt(func.readXml("sms", "bsoffnum"));
		ArrayList result=new ArrayList(); 
		
		String sql="select bsId,count(bsId) as num from xhdigital_bs_offonline  "
				+ "where time<'"+func.DateMinus(func.StringToInt(func.readXml("sms", "bsoffnumtime")))+"' and online=0 group by bsId";
		try {
			ArrayList data = Sql.DBList(sql);
			for(int i=0;i<data.size();i++){
				Map m=(Map) data.get(i);
				if(Integer.parseInt(m.get("num").toString())>=num){
					result.add(m.get("bsId").toString());
				}
				
			}
			if(result.size()>0){
				for(int i=0;i<result.size();i++){
					alarm(9,0,Integer.parseInt(result.get(i).toString()));
				}
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void alarm(int type,int status,int id){
		String content=id+"号基站："+Sql.bsId_bsName(id)+"多次闪断";

		String sql1= "select * from xhdigital_alarm where type='"+type+"' and alarmId='"+id+"'";
		String sql2="insert into xhdigital_alarm(alarmId,content,type)values('"+id+"','"+content+"','"+type+"')";
		try {
			if(!Sql.exists(sql1)){
				Sql.Update(sql2);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
}
