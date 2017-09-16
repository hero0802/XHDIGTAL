/* 系统权限全局变量************************************************************/
var Globale_add=false;
var Globale_del=false;
var Globale_update=false;
var Globale_search=false;
var Globale_refresh=false;
var Globale_event_open=false;
var Globale_event_close=false;
var Globale_db_address=false;
var Globale_web_update_group=false;
var Globale_web_del_group=false;
var Globale_web_add_group=false;
var Globale_web_add_user=false;
var Globale_web_del_user=false;
var Globale_web_update_user=false;
var Globale_web_power_group=false;
var Globale_web_upload=false;
var Globale_web_download=false;
var Globale_web_delFile=false;

//检查文件
/* ***************************************************************************/

function getcookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split(";");
	for(var i=0;i<arrcookie.length;i++){
		var arr=arrcookie[i].split("=");
		if(arr[0].match(name)==name)return arr[1];
	}
	return "";
}
//创建数据源
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}
function checkFpower(){
Ext.Ajax.request({  
	url : getRootPath()+'/power/getPower.action',  
	params : {  
	username:getcookie("username")
},
async:false,
method : 'POST',  
timeout : 2000,  
success : function(response, opts) {  
	var s= Ext.decode(response.responseText);
	    call_del=rs.call_del;
		sms_del=rs.sms_del;
		sms_send=rs.sms_send;
		gps_del=rs.gps_del;
		
		equipment_add=rs.equipment_add;
		equipment_del=rs.equipment_del;
		equipment_update=rs.equipment_update;
		equipment_excel=rs.equipment_excel;
		
		station_add=rs.station_add;
		station_del=rs.station_del;
		station_update=rs.station_update;
		station_excel=rs.station_excel;
		
		inspection_add=rs.inspection_add;
		inspection_del=rs.inspection_del;
		inspection_update=rs.inspection_update;
		inspection_excel=rs.inspection_excel;
		
		accessuser_add=rs.accessuser_add;
		accessuser_del=rs.accessuser_del;
		accessuser_update=rs.accessuser_update;
		
		radio_add=rs.radio_add;
		radio_del=rs.radio_del;
		radio_update=rs.radio_update;
		
		radiouser_add=rs.radiouser_add;
		radiouser_del=rs.radiouser_del;
		radiouser_update=rs.radiouser_update;
		
		talkgroup_add=rs.talkgroup_add;
		talkgroup_del=rs.talkgroup_del;
		talkgroup_update=rs.talkgroup_update;
		
		multigroup_add=rs.multigroup_add;
		multigroup_del=rs.multigroup_del;
		multigroup_update=rs.multigroup_update;
		
		radiouserattrm_add=rs.radiouserattrm_add;
		radiouserattrm_del=rs.radiouserattrm_del;
		radiouserattrm_update=rs.radiouserattrm_update;
		
		radiouserattre_add=rs.radiouserattre_add;
		radiouserattre_del=rs.radiouserattre_del;
		radiouserattre_update=rs.radiouserattre_update;
		
		talkgroupattrm_add=rs.talkgroupattrm_add;
		talkgroupattrm_del=rs.talkgroupattrm_del;
		talkgroupattrm_update=rs.talkgroupattrm_update;
		
		talkgroupattre_add=rs.talkgroupattre_add;
		talkgroupattre_del=rs.talkgroupattre_del;
		talkgroupattre_update=rs.talkgroupattre_update;
		
		asset_add=rs.asset_add;
		asset_del=rs.asset_del;
		asset_update=rs.asset_update;
		asset_look=rs.asset_look;
		
		repair_add=rs.repair_add;
		repair_del=rs.repair_del;
		repair_update=rs.repair_update;
		repair_look=rs.repair_look;
		
		lend_check=rs.lend_check;
		lend_look=rs.lend_look;
		
		lendhistory_del=rs.lendhistory_del;
		lendhistory_look=rs.lendhistory_look;
		
		weekly_add=rs.weekly_add;
		weekly_del=rs.weekly_del;
		weekly_update=rs.weekly_update;
		weekly_look=rs.weekly_look;
		weekly_check=rs.weekly_check;
		weekly_down=rs.weekly_down;
		
		duty_add=rs.duty_add;
		duty_del=rs.duty_del;
		duty_update=rs.duty_update;
		duty_look=rs.duty_look;
		duty_check=rs.duty_check;
		duty_down=rs.duty_down;
		
		fault_add=rs.fault_add;
		fault_del=rs.fault_del;
		fault_update=rs.fault_update;
		fault_look=rs.fault_look;
		fault_check=rs.fault_check;
		fault_down=rs.fault_down;
		
		communicationfault_add=rs.communicationfault_add;
		communicationfault_del=rs.communicationfault_del;
		communicationfault_update=rs.communicationfault_update;
		communicationfault_look=rs.communicationfault_look;
		communicationfault_check=rs.communicationfault_check;
		communicationfault_down=rs.communicationfault_down;
		
		reguler_add=rs.reguler_add;
		reguler_del=rs.reguler_del;
		reguler_update=rs.reguler_update;
		reguler_look=rs.reguler_look;
		reguler_check=rs.reguler_check;
		reguler_down=rs.reguler_down;
		
		summary_add=rs.summary_add;
		summary_del=rs.summary_del;
		summary_update=rs.summary_update;
		summary_look=rs.summary_look;
		summary_check=rs.summary_check;
		summary_down=rs.summary_down;
		
		task_add=rs.task_add;
		task_del=rs.task_del;
		task_update=rs.task_update;
		task_look=rs.task_look;
		task_down=rs.task_down;
		
		webuser_add=rs.webuser_add;
		webuser_del=rs.webuser_del;
		webuser_update=rs.webuser_update;
		
		menu_update=rs.menu_update;
		
		group_add=rs.group_add;
		group_del=rs.group_del;
		group_update=rs.group_update;
		
		power_update=rs.power_update;
		
		event_add=rs.event_add;
		event_del=rs.event_del;
		event_open=rs.event_open;
		event_close=rs.event_close;
		
		database_login=rs.database_login;
		database_self=rs.database_self;
		database_bak=rs.database_bak;
		database_back=rs.database_back;
}})
}