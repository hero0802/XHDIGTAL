
//系统菜单
var buildTree = function(json) {  
	return Ext.create('Ext.tree.Panel', {  
		rootVisible : false,  
		border : false, 
		rowLines:false,
		emptyText :'暂无数据',
		useArrows :true,
		store : Ext.create('Ext.data.TreeStore', {  
			root : {  
			expanded : true,  
			children : json.children  
		}  
		}),   
		listeners : {
		itemclick : function(view, record, item, index, event, options) {
		var main=Ext.getCmp("main");
		var id=record.get('id');
		var ico;
		var url;
		var n = main.getComponent(id);
		
		url=record.get('iconCls');
		if(url!="#" && url!=""){
			
			if (!n) { // 判断是否已经打开该面板       
				n = main.add({
					'id' : id,
					'title' : record.get('text'),
					closable : true, // 通过html载入目标页
					layout: 'fit',
					icon:record.get('icon'),
				html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="'+url+'"></iframe>'
				});
		}
			else{
				main.remove(id, true); 
				n = main.add({
					'id' : id,
					'title' : record.get('text'),
					closable : true, // 通过html载入目标页
					layout: 'fit',
					icon:record.get('icon'),
				html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="'+url+'"></iframe>'
				});
			}
		}
		main.setActiveTab(n);
		
		
	},scope : this }
	});  
};
var Menu1=Ext.create("Ext.panel.Panel",{
	layout: 'accordion',
	width:190,
	padding:0,
	border:true
});
Ext.each(MenuItem("UserPower/usermenu.action"), function(el) {  
		var panel = Ext.create(  
				'Ext.panel.Panel', {  
					//id : el.id,  
					title : "&nbsp;&nbsp;"+"<span style='font-weight:800'>"+el.text+"</span>", 
					icon:el.icon,
					layout : 'fit',
					frame:false,
					border:1
				});
		panel.add(buildTree(el));  
		Menu1.add(panel); 
		
	}); 

///////////////////////////////////////////////////////////////////////////
//系统中心部分
var tabPanel=Ext.create("Ext.tab.Panel",{
	title:'当前位置》系统管理',
	icon: 'resources/images/menu/config.png',
	region:"center",
	id:"main",
	animCollapse:false,
	padding:0,
	border:false,
	//plain:true,
	layout:'fit',  
	frame: false, 
	autoTabs:true,
	deferredRender:false,
	enableTabScroll:true,
	deferredRender:false,
	tabPosition:'top',
	items:[{
		title:"系统管理",
		html:'<iframe id="iframe-view" scrolling="auto" frameborder="0" width="100%" height="100%" src="View/bsMap.html"></iframe>',
		height:100,
		id:'tab-view',
		//iconCls:'fa fa-home fa-lg'/
		icon: 'resources/images/menu/config.png'
		
	},{
		title:"终端管理",
		html:'<iframe id="iframe-map" scrolling="auto" frameborder="0" width="100%" height="100%" src="map.html"></iframe>',
		height:100,
		id:'tab-map',
		//iconCls:'fa fa-home fa-lg'/
		icon: 'resources/images/menu/call.png'
		
	}/*,{
		title:"系统信息",
		id:'tab-sys',
		html:'<iframe id="iframe-sys" scrolling="auto" frameborder="0" width="100%" height="100%" src="View/alarm.html"></iframe>',
		height:100,
		//iconCls:'fa fa-home fa-lg'/
		icon: 'resources/images/btn/info.png'
		
	}*/]
});
var statusBar=Ext.create('Ext.Panel',{
	margin:'0 0 0 0',
	padding:0,
	border:false,
	frame:false,
	region:'south',
	bbar: Ext.create('Ext.ux.StatusBar', {
        id: 'bbar-status',
        // defaults to use when the status is cleared:
        defaultText: '<div style="float:left;margin-left:10px;position: relative; padding-top:10px;"><i class="fa fa-server fa-1x" style="color:green;"></i>&nbsp;<span style="color:black;font-weight:800">中心通信 :</span>&nbsp;<span id="centerStatus" style="border:1px solid #000000"></span></div>'
                     +'<div style="float:left;margin-left:100px;position: relative; padding-top:10px;"><i class="fa fa-database fa-1x" style="color:green"></i>&nbsp;<span style="color:black;font-weight:800">中心数据库 :</span>&nbsp;<span id="dbStatus" style="border:1px solid #000000"></span></div>'/*
                     +'<div style="float:left;margin-left:100px;position: relative;"><i class="fa fa-user-secret fa-1x" style="color:green"></i>&nbsp;<span style="color:black;font-weight:800">用户总数:</span>&nbsp;<span id="userAll" style="border:1px solid #000000"></span></div>'
                     +'<div style="float:left;margin-left:100px;position: relative;"><i class="fa fa-user fa-1x" style="color:green"></i>&nbsp;<span style="color:black;font-weight:800">在线用户 :</span>&nbsp;<span id="userOnline" style="border:1px solid #000000"></span></div>'*/
                     +'<div style="float:left;margin-left:130px;position: relative;">'
                     +'<marquee style="WIDTH: 200px; HEIGHT: 30px; font-size:13px;color:red" scrollamount="2" direction="left" Behaviour="scroll" >'
                     +'<div style=" padding-top:10px;">本系统由亚光电子提供技术支持</div>'
                     +'</marquee></div>',
        //defaultIconCls: 'default-icon',
        items: []
    }),
	height:30
})
var centerPanel=Ext.create("Ext.panel.Panel",{
	title:'当前位置》系统管理',
	icon: 'resources/images/menu/config.png',
	region:"center",
	html:'<iframe id="iframe-view" scrolling="auto" frameborder="0" width="100%" height="100%" src="View/bsMap.html"></iframe>'
});
var footer=Ext.create('Ext.Component',{
	padding:0,
	border:true,
	frame:true,
	region:'south',
	html:'<center style="color:#000000">[建议使用 谷歌浏览器，体验效果更佳,分辨率高于1366*768]</center>',
	height:25
})
//#8EC172;;#317040; #19a97b;
var topHtml='<div style="width:100%;height:100%;background:#000;">'
	+'<div style="float:left;vertical-align:middle; padding-top:3px;border:0;">'
	+'<img src="resources/images/picture/log.gif" height="40px" width="40px"/>'
	+'</div>'
	+'<div class="h_title"><strong>数字同播网管系统V1.0</strong></div>'
	+'<div></div>'
	+'<div id="CheckTheme" style="width:220px;bottom:0;float:right;padding:0"></div></div>';
var topPanel=Ext.create('Ext.panel.Panel',{
	region:'north',
	height:48,
	border:false,
	html:topHtml
})
	var card=Ext.create('Ext.panel.Panel',{
		layout: 'form',
		region:'west',
		title:'导航',
		split : true,
		width:100,
		padding:0,
		/*collapsible : true, // 设置可折叠,
*/		/*collapsed :true ,*/
		/*split : true,*/
		border:true,
		frame: false,
		icon:"resources/images/picture/menu.png",
		 shortcutsData : [
		                    {
								name : '腾迅QQ',
								iconCls : 'qq-shortcut',
								module : 'Leetop.module.Notepad',
								index : 1
							}],
	items:[{
			xtype:'button',
			text:'系统管理',
			icon: 'resources/images/menu/config.png',
			margin:'10,0,10,20'
		},{
			xtype:'button',
			text:'终端管理',
			icon: 'resources/images/menu/call.png',
			margin:'10,0,10,20'
		}]
	})

//	网页框架
	Ext.onReady(function(){
		
		new Ext.Viewport({
			layout:"border",
			renderTo:Ext.getBody(),
			items:[topPanel,card,tabPanel,statusBar]
		});
		new Ext.create('Ext.panel.Panel',{
			renderTo:'CheckTheme',
			layout:'column',
			//bodyStyle:'background:#317040;',
			border:true,
			frame:false,
			items:[{
	        	xtype:'displayfield',fieldLabel:'',value:'<img src="resources/images/btn/login.png"></img>&nbsp; '+getcookie("username")+'&nbsp;你好！',margin:'5'
	        },{
	        	xtype:'button',text:"退出系统",icon:'resources/images/picture/exit.png',margin:'5 0 5 5',
	        	handler:loginOut
	        }]
		});
		
		tabPanel.addListener("tabchange", function(tabs, nowtab){
			
			if(nowtab.id=="tab-map"){
				Ext.get('iframe-map').dom.src="map.html"
			}
			if(nowtab.id=="tab-view"){
				Ext.get('iframe-view').dom.src="View/bsMap.html"
			}
			if(nowtab.id=="tab-sys"){
				Ext.get('iframe-sys').dom.src="View/alarm.html"
			}
		})
	
		
		dwr.engine.setActiveReverseAjax(true);
		dwr.engine.setAsync(false);//同步步
		dwr.engine.setErrorHandler(function(){
			window.location.href="index.jsp"
		});
		//设置在页面关闭时，通知服务端销毁会话
        dwr.engine.setNotifyServerOnPageUnload( true);
		dwr_Data();
		

	})
	
function dwr_Data(){
	indexDwr.centerStatus(1);
	indexDwr.DBStatus(2);
	
	/*//sleep(1000)
	indexDwr.userAll(userCountAll());
	indexDwr.userOnline(userCountOnline());*/
	
  }

function statusUtil(status){
	if(status==1){
		$("#centerStatus").html("<d style='background:green;color:#ffffff'>已经连接</d>")
	}else{
		$("#centerStatus").html("<d style='background:red;color:#ffffff'>正在连接</d>");
	}
	
}
function dbStatus(status){
	if(status==1){
		$("#dbStatus").html("<d style='background:green;color:#ffffff'>正常访问</d>")
	}else if(status==2){
		$("#dbStatus").html("<d style='background:#000000;color:#ffffff'>等待访问</d>");
	}else{
		$("#dbStatus").html("<d style='background:red;color:#ffffff'>访问失败</d>");
	}
	
}
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
function MenuItem(url){
	var data="";
	Ext.Ajax.request({  
		url : url,
		method : 'get',
		async:false,
		success : function(response) {  
		var json = Ext.JSON.decode(response.responseText); 
		data=json.items;
	} 
	});
	return data;
}
function getcookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split(";");
	for(var i=0;i<arrcookie.length;i++){
		var arr=arrcookie[i].split("=");
		if(arr[0].match(name)==name)return arr[1];
	}
	return "";
}
function loginOut(){

	Ext.Msg.confirm("待确认退出系统", "确定要退出系统吗？", function(button, text) {  
		if (button == "yes") { 
			window.top.location.href=getRootPath()+"/View/loginout.jsp";
		}
	})
}

//浏览器判断
function userAgent(){
	var str=navigator.userAgent;
	var explorer = window.navigator.userAgent ;
	//ie 
	if (explorer.indexOf("MSIE") >= 0) {
	return "ie";
	}
	//firefox 
	else if (explorer.indexOf("Firefox") >= 0) {
		return "Firefox";
	}
	//Chrome
	else if(explorer.indexOf("Chrome") >= 0){
		return "Chrome";
	}
	//Opera
	else if(explorer.indexOf("Opera") >= 0){
	return "Opera";
	}
	//Safari
	else if(explorer.indexOf("Safari") >= 0){
	return "Safari";
	}
}
function refresh(){
	window.location.href="index.jsp"
	}
function fullScreen(){
	var src='index.jsp'
	window.opener=null;
	window.open(document.location,"", 'fullscreen=yes');
	}
function fullScreen() {
    var el = document.documentElement,
        rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
        wscript;
 
    if(typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }
 
    if(typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if(wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}
 
function exitFullScreen() {
    var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript;
 
    if (typeof cfs != "undefined" && cfs) {
      cfs.call(el);
      return;
    }
 
    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
  }
}
/*value : 当前待渲染的单元格值，即表格中某行某列的值，类型为：Object
metaData : 当前待渲染的单元格元数据. 支持的属性有: tdCls, tdAttr, and style。类型为：Object
record : 当前待渲染的单元格所在行数据Model，类型为：Ext.data.Model
rowIndex : 当前待渲染的单元格所在行数，类型为：Number
colIndex : 当前待渲染的单元格所在列数，类型为：Number
store : 当前数据Store，类型为：Ext.data.Store
, : 当前视图，类型为：Ext.view.View*/


