var button = '	<div class="top">'
		+ '<div class=" index-icon"><img src="resources/images/picture/log.gif" height="50px" width="50px"/></div>'
		+ '<div class="index-title"><h1>数字同播网管系统V1.0</h1></div>'
		+ '<div class="index-btn"><ul class="menu-block">'
		+ '<li class="menu-block-active active" onclick="systemBtn()"><a href="#"><img src="resources/images/picture/system.png" height="32px" width="32px"></img><br><span>系统</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"  onclick="radioBtn()"><a href="#"><img src="resources/images/picture/phone.png" height="32px" width="32px"></img><br><span>终端</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active" onclick="configBtn()"><a href="#"><img src="resources/images/picture/config.png" height="32px" width="32px"></img>'
		+ '	<br><span>配置</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active" onclick="powerBtn()"><a href="#" ><img src="resources/images/picture/power.png" height="32px" width="32px"></img>'
		+ '	<br><span>权限</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active" onclick="otherBtn()"><a href="#" ><img src="resources/images/picture/other.png" height="32px" width="32px"></img>'
		+ '	<br><span>日志</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active" onclick="alarm()"><a href="#" ><img src="resources/images/picture/alarm2.png" height="32px" width="32px" id="alarm_src"></img>'
		+ '<br><span style="color:#fff">系统告警</span></a></li>' 
		+ '<li  class="menu-block-active" onclick="loginOut()"><a href="#" ><img src="resources/images/picture/loginout1.png" height="32px" width="32px"></img>'
		+ '	<br><span>退出系统</span></a></li>' 
		
		+ '</ul></div></div>';

		//+'<div><a href="#" style="color:#fff;" onclick="downFile()">下载语音监听插件</a></div>'
		
var systemMenu = '<ul class="left-menu">'
		+ '<li  class="menu-block-active active"><a href="bsMap.html" target="main-view"><img src="resources/images/picture/bs.png" height="32px" width="32px"></img><br><span>基站全景</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/callList.html" target="main-view"><img src="resources/images/picture/callList.png" height="32px" width="32px"></img>'
		+ '	<br><span>通话记录</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/callPro.html" target="main-view"><img src="resources/images/picture/callPro3.png" height="32px" width="32px"></img>'
		+ '	<br><span>话务统计</span>' + '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/bsControllData.html" target="main-view"><img src="resources/images/picture/task.png" height="32px" width="32px"></img>'
		+ '	<br><span>遥测记录</span>'
		+ '</a></li>'
		+ '</ul>';
var radioMenu = '	<ul class="left-menu">'
		+ '<li  class="menu-block-active"><a href="map.html" target="main-view"><img src="resources/images/picture/cellphone5.png" height="32px" width="32px"></img><br><span>终端分布</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/sms.html" target="main-view"><img src="resources/images/picture/sms.png" height="32px" width="32px"></img>'
		+ '	<br><span>短信</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/useronline.html" target="main-view"><img src="resources/images/picture/useroffonline.png" height="32px" width="32px"></img>'
		+ '	<br><span>离线统计</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active" style="margin-top:40px;"><a href="View/gpsInfo.html" target="main-view"><img src="resources/images/picture/gps.png" height="32px" width="32px"></img>'
		+ '	<br><span style="color:red">GPS记录</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/gpsSetting.html" target="main-view"><img src="resources/images/picture/gpsSet.png" height="32px" width="32px"></img>'
		+ '	<br><span style="color:red">GPS设置</span>'
		+ '</a></li>'
		+ '<li  class="menu-block-active"><a href="View/gpsPush.html" target="main-view"><img src="resources/images/picture/gpsoff.png" height="32px" width="32px"></img>'
		+ '	<br><span style="color:red">GPS屏蔽</span>'
		+ '</a></li>'
		+ '</ul>';
var configMenu = '	<ul class="left-menu">'
		+ '<li  class="menu-block-active"><a href="View/bsStation.html" target="main-view"><img src="resources/images/picture/net.png" height="32px" width="32px"></img>'
		+ '	<br><span>基站管理</span>'
		+ '</a></li>'
		+ '<li class="menu-block-active"><a href="View/talkGroup.html" target="main-view"><img src="resources/images/picture/groupConfig.png" height="32px" width="32px"></img><br><span>组配置</span>'
		+ '</a></li>'
		+ '<li class="menu-block-active"><a href="View/mdconnect.html" target="main-view"><img src="resources/images/picture/connect.png" height="32px" width="32px"></img><br><span>模数互联</span>'
		+ '</a></li>'
		+ '<li class="menu-block-active"><a href="View/smsAlarm.html" target="main-view"><img src="resources/images/picture/smsnet.png" height="32px" width="32px"></img><br><span>短信告警</span>'
		+ '</a></li>'
		+ '<li class="menu-block-active" style="margin-top:80px;"><a href="View/radioUser.html" target="main-view"><img src="resources/images/picture/phoneMarker2.png" height="32px" width="18px"></img><br><span style="color:red">终端配置</span>'
		+ '</a></li>'
		+ '<li class="menu-block-active"><a href="View/mscKill.html" target="main-view"><img src="resources/images/picture/sellphone.png" height="32px" width="32px"></img><br><span style="color:red">遥晕遥毙</span>'
		+ '</a></li>'
		+ '</ul>';
var otherMenu = '	<ul class="left-menu">'
		+ '<li  class="menu-block-active"><a href="View/log.html" target="main-view"><img src="resources/images/picture/loginfo.png" height="32px" width="32px"></img>'
		+ '	<br><span>系统日志</span>' + '</a></li>' + '</ul>';
var powerMenu = '<ul class="left-menu">'
	+ '<li  class="menu-block-active"><a href="View/msoConfg.html" target="main-view"><img src="resources/images/picture/center.png" height="32px" width="32px"></img><br><span>中心配置</span>'
	+ '</a></li>';

if(parseInt(getcookie("groupid"))==10000){
	powerMenu +='<li  class="menu-block-active"><a href="View/config.html" target="main-view"><img src="resources/images/picture/net.png" height="32px" width="32px"></img>'
	+ '	<br><span>联网配置</span></a></li>' 
	+ '<li  class="menu-block-active"><a href="View/webUser.html" target="main-view"><img src="resources/images/picture/user.png" height="32px" width="32px"></img><br><span>用户管理</span>'
	+ '</a></li>'
	+ '<li  class="menu-block-active"><a href="View/webGroup.html" target="main-view"><img src="resources/images/picture/userGroup.png" height="32px" width="32px"></img>'
	+ '	<br><span>角色管理</span>'
	+ '</a></li>'
	+ '<li class="menu-block-active"><a href="View/event.html" target="main-view"><img src="resources/images/picture/task.png" height="32px" width="32px"></img><br><span>计划任务</span>'
	+ '</a></li>' ;
}
	
 powerMenu +="</ul>";
var iframePanel = Ext.create('Ext.panel.Panel',
		{
					border : true,
					bodyStyle : {
						borderLeft : 0
					},
					region : 'center',
					html : '<iframe id="main-view" name="main-view" scrolling="auto" frameborder="0" width="100%" height="100%" src="bsMap.html"></iframe>'
				});
var bs_store = Ext.create('Ext.data.Store',{
	fields:[
	        {name: 'id'},
	        {name:'bsId'},
	        {name:'bsName'}
	        ],	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : 'data/bsList.action',
	//url:'../../user/show.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'id', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true
}
});
//创建Model
var alarmstore = Ext.create('Ext.data.Store',{
	fields:[
	        {name: 'id'},
	        {name: 'alarmId'},
	        {name: 'content'},
	        {name: 'type'},
	        {name: 'ignore'},
	        {name: 'time'}
	        ],	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : 'data/systemAlarm.action',
	//url:'../../user/show.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'id', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true
}
});
var ignorealarmstore = Ext.create('Ext.data.Store',{
	fields:[
	        {name: 'id'},
	        {name: 'alarmId'},
	        {name: 'content'},
	        {name: 'type'},
	        {name: 'ignore'},
	        {name: 'time'}
	        ],	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : 'data/ignoreSystemAlarm.action',
	//url:'../../user/show.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            //排序字段。 
    	            property: 'id', 
    	            //排序类型，默认为 ASC 
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true
}
});
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	/*region:'center',*/
	store:alarmstore,
	trackMouseOver: false,
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}),
	         {text: "告警类型", width: 80, dataIndex: 'type', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	//告警类型：1：断站；2：中心；3：交换；4：温度;5:gps失锁；6：反向功率过大；7：交流；8：功率
	        	 if(v==1){return "断站";}
	        	 else if(v==2){return "中心";}
	        	 else if(v==3){return "交换";}
	        	 else if(v==4){return "温度";}
	        	 else if(v==5){return "gps失锁";}
	        	 else if(v==6){return "反向功率过大";}
	        	 else if(v==7){return "交流";}
	        	 else if(v==8){return "功率";}
	        	 else{
	        		 return "未知";
	        	 }
	         }},
	         {text: "告警类容", width: 200, dataIndex: 'content', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "时间", width: 150, dataIndex: 'time', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, {text: "是否忽略", width:80, dataIndex: 'ignore', sortable: true,
	        	 editor : {  
		        	 allowBlank : false  
		         },renderer:function(v){
		     
		        	 if(v==0){return "";}
		        	 else if(v==1){return "已忽略";}
		        	 else{
		        		 return "未知";
		        	 }
		         }},{
		        	 text:'<span style="color:green">操作</span>',
		        	 align : 'center',
		        	 width:70,
		        	 dataIndex:'username',
		        	 renderer:function(value,metaData,record){
		        	 if(record.get("ignore")==0){
		        		 var str="<a href='#' onclick=ignore()>忽略</a>";
		        		 return str
		        	 }else{
		        		 var str="<a href='#' onclick=cancel_ignore()>取消忽略</a>";
		        		 return str
		        	 }
		        	 
		         }
		         }],
	        /* plugins : [cellEditing],*/
	         frame:false,
	         border:false,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     /*contextMenu.showAt(e.getXY());*/
	                     return false;
	                 }
	             }
	         },
	        
	         emptyText:'<span>暂无告警！</span>',
	         dockedItems: [{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: alarmstore, 
	          	 displayInfo: true, 

	          	 displayMsg: '显示 {0} - {1} 条，共计 {2} 条', 
	          	 emptyMsg: "没有数据",
	          	 beforePageText:'第',
	          	 afterPageText:'页 共{0}页',
	          	 firstText:'首页',
	          	 prevText:'上一页',
	          	 nextText:'下一页',
	          	 lastText:'尾页',
	          	 refreshText:'刷新',
	          	 prependButtons:true
	         }]

})
}
var mainPanel = Ext.create('Ext.panel.Panel', {
	/*title : button,#426ab3 #009ad6*/
	border : true,
	region : 'north',
	/*margin:'0 0 50 0',*/
	bodyStyle:{
		background:'#426ab3',
		color:'#fff',
		borderBottom:'3px solid #fff'
	},
	bodyPadding:0,
	height : 85,
	html:button
});
var leftPanel = Ext.create('Ext.panel.Panel', {
	region : 'west',
	bodyStyle : {
		background : '#fafafa'
	},
	id : "leftPanel",
	width : 83,
	html : '<div class="menu-div">'+systemMenu+'</div>'
});
var statusBar = Ext
		.create(
				'Ext.panel.Panel',
				{
					border : true,
					frame : false,
					region : 'south',
					bodyStyle : {
						background : '#fafafa'
					},
					bbar : Ext
							.create(
									'Ext.ux.StatusBar',
									{
										id : 'bbar-status',
										// defaults to use when the status is
										// cleared:
										defaultText : '<div style="float:left;margin-left:0px;position: relative; padding-top:10px;margin-top:10px"><span style="color:black;font-weight:800">中心通信 :</span>&nbsp;<span id="centerStatus" style="border:1px solid #000000"></span></div>'
											    +''
												+ '<div style="float:left;margin-left:100px;position: relative; padding-top:10px;margin-top:10px"><span style="color:black;font-weight:800">交换:</span>&nbsp;<span id="swStatus" style="border:1px solid #000000"></span></div>'
												+ '<div style="float:left;margin-left:100px;position: relative; padding-top:10px;margin-top:10px"><span style="color:black;font-weight:800">组播源基站:</span>&nbsp;<span id="muticastBsid" style="border:1px solid #000000"></span>&nbsp;&nbsp;&nbsp;<span><a href="#" style="color:blue;" onclick="setMuticastBsid()">设置组播源</a></span></div>'	
												+ '<div style="float:left;margin-left:100px;position: relative; padding-top:10px;margin-top:10px"><span style="color:black;font-weight:500">本系统由成都中航信虹科技股份有限公司提供技术支持,<a href="#" style="color:blue;" onclick="downFile()">下载语音监听插件</a></span></div>',
												/*+ '<marquee style="WIDTH: 200px; HEIGHT: 25px; font-size:13px;color:red;" scrollamount="2" direction="left" Behaviour="scroll" >'
												+ '<div style=" padding-top:0px;">本系统由亚光电子提供技术支持 </div>'
												+ '</marquee></div>',*/
										// defaultIconCls: 'default-icon',本系统由亚光电子提供技术支持
										items : []
									}),
					height : 27
				});
var footer=Ext.create('Ext.Panel',{
	region:'south',
	height:20,
	html:'<span style="text-align:center;margin-left:300px;margin-right:auto;width:100%; height:20px">建议使用谷歌浏览器,体验效果更佳</span>'
});

bs_store.on('load',function(){
	console.log("bsstore:"+bs_store.getCount());
	for(var i =0;i<bs_store.getCount();i++){
		bs_store.getAt(i).set("bsName",bs_store.getAt(i).get('bsId')+":"+bs_store.getAt(i).get("bsName"));

}})
ignorealarmstore.on('load',function(){

		if(ignorealarmstore.getCount()>0){
			$("#alarm_src").attr({src:"resources/images/picture/alarm2.gif"})
		}else{
			$("#alarm_src").attr({src:"resources/images/picture/alarm2.png"})
		}
		
})

				

Ext.onReady(function() {
	new Ext.Viewport({
		layout : "border",
		bodyStyle:{
			background:'#fff'
		},
		renderTo : Ext.getBody(),
		items : [ mainPanel, leftPanel, iframePanel, statusBar]
	});
	$(".menu-div").on('click','li',function(){
		 $(this).siblings().removeClass("active"); 
		 $(this).addClass("active");
	})
	$(".menu-block>li").click(function() {
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		$(".left-menu>li:first-child").addClass("active");
	});
	
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setAsync(false);// 同步步
	dwr.engine.setErrorHandler(function() {
		window.location.href = "index.html"
	});
	// 设置在页面关闭时，通知服务端销毁会话
	//dwr.engine.setNotifyServerOnPageUnload(true);
	dwr_Data();
	mutiCastBsId();
	bs_store.load(); 
	alarmstore.load();
	ignorealarmstore.load();

})
function alarmIcon(){
	alarmstore.load();
	ignorealarmstore.reload();
}
function systemBtn() {
	//Ext.getCmp("leftPanel").body.update(systemMenu);
	$(".menu-div").html(systemMenu);
	Ext.get("main-view").dom.src = "bsMap.html"
}
function radioBtn() {
	$(".menu-div").html(radioMenu);
	Ext.get("main-view").dom.src = "map.html"
}
function configBtn() {
	$(".menu-div").html(configMenu);
	Ext.get("main-view").dom.src = "View/bsStation.html"
}
function powerBtn() {
	$(".menu-div").html(powerMenu);
	Ext.get("main-view").dom.src = "View/msoConfg.html"
}
function otherBtn() {
	$(".menu-div").html(otherMenu);
	Ext.get("main-view").dom.src = "View/log.html"
}
function loginOut() {

	Ext.Msg.confirm("待确认退出系统", "确定要退出系统吗？", function(button, text) {
		if (button == "yes") {
			window.top.location.href = "View/loginout.jsp";
		}
	})
}
function dwr_Data() {
	indexDwr.centerStatus(1);
	swStatus(1)
	//indexDwr.DBStatus(2);

}
function muticastsrc_bsid(str){
	var recvData=Ext.decode(str);
	if (recvData.bsId==-1) {
		$("#muticastBsid").html("<d style='background:red;color:#ffffff'>无组播源</d>");
	
	} else {
		$("#muticastBsid").html("<d style='background:green;color:#ffffff'>"+recvData.bsId+"号"+recvData.bsName+"基站</d>")
	}
}
function statusUtil(status) {
	if (status == 1) {
		$("#centerStatus").html(
				"<d style='background:green;color:#ffffff'>连接成功</d>")
	} else {
		$("#centerStatus").html(
				"<d style='background:red;color:#ffffff'>正在连接。。。</d>");
	}

}
function swStatus(status){
	if (status == 1) {
		$("#swStatus").html(
				"<d style='background:green;color:#ffffff'>连接成功</d>")
	} else {
		$("#swStatus").html(
				"<d style='background:red;color:#ffffff'>连接失败。</d>");
	}
}
function mutiCastBsId(){
	Ext.Ajax.request({
		url : 'controller/mutiCastBsId.action', 
		params : {  
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
		     
	    },
	    failure: function(response) {}
	})	
}
//下载插件
function downFile(){
	var name="信虹语音插件.exe";
	var path="/resources/data/信虹语音插件.exe"
		var downUrl = "controller/downSoft.action?fileName="+name+"&inputPath="+path; 
		Ext.Ajax.request({
			url:'controller/fileIsExists.action',
			params: {
			fileName:name,
			filePath:path
		},
		method:'POST',
		success : function(response,opts){
			var success=Ext.decode(response.responseText).success;
			if(success){
				window.open(downUrl,'_self','width=1,height=1,toolbar=no,menubar=no,location=no');	
			}else{
				Ext.MessageBox.show({
					title:'提示',
					msg:'文件不存在',
					icon:Ext.MessageBox.INFO
				});
			}
		},
		failure: function(response) {

			Ext.MessageBox.show({  
				title : "提示",  
				msg : "服务器响应失败!" , 
				icon: Ext.MessageBox.INFO  
			});} 
		});

}
//设置组播源基站
function setMuticastBsid(){
	var Form=Ext.create('Ext.FormPanel',{
		width:300,
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{fieldLabel:'组播源基站',xtype:'combobox',name:'bsId', labelWidth:100,width:170,
  	        store:bs_store,queryModel:'remote',emptyText:'请选择...',
  	        valueField:'bsId',displayField:'bsName',forceSelection : true}]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置组播源',
		autoWidth:true,
		autoHeight:true,
		closeAction:'hide',
		items:Form,
		buttons:[{
			text:'确定',
			iconCls:'ok',
			handler:function(){
			var form=Form.form;
			 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                 msg: '正在操作中。。。',  
                 loadMask: true, 
                 removeMask: true // 完成后移除
             });
			if(form.isValid){
				myMask.show();
				form.submit(Ext.Ajax.request({
					url : 'controller/updateMutiCastBsId.action', 
					params : {  
					 bsId:form.findField('bsId').getValue()
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
				     var rs = Ext.decode(response.responseText)
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","组播源基站设置成功"); 
				    	 win.hide();
				     }else{
				    	 Ext.example.msg("提示","失败");  
				     } 
  			    },
  			    failure: function(response) {
  			    	myMask.hide();
  			    	Ext.example.msg("提示","失败");  
   			      }
				}))
			}}
				
				
		}]
	})
	win.show();
	Form.form.findField('bsId').setValue(bs_store.getAt(0).get("bsId"));
}
var alarmwin;
function alarm(){ 
	if(!alarmwin){
		alarmwin = new Ext.Window({
		width:750,
		closable: false ,
		height:400,
		modal:false,
		layout: 'fit',
		title:"系统告警信息",
		items:grid,
		buttons:[{
		        	 text:'关闭',
		        	 iconCls:'cancel',
		        	 handler:function(){
		        		 alarmwin.hide();
		         }
		         }
		         ]
	});
	}
	alarmwin.show();
	//store.insert(0,new User()); 
}
function ignore(){
	record = grid.getSelectionModel().getLastSelected(); 
	Ext.Ajax.request({  
		 url : 'controller/ignoreBtn.action',  
		 params : {
		 bsId:record.get("alarmId"),
		 bsType:record.get("type"),
		 ignore:1
	 },  
	 method : 'POST',
	 waitTitle : '请等待' ,  
	 waitMsg: '正在提交中', 
	 success : function(response) { 
		 ignorealarmstore.reload();
		 alarmstore.reload();
	 },

	 failure: function(response) {

		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "数据修改失败!" , 
			 icon: Ext.MessageBox.INFO  
		 }); 
	 }}); 
}
/* 获取cookie */
function getcookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
};
function cancel_ignore(){
	record = grid.getSelectionModel().getLastSelected(); 
	Ext.Ajax.request({  
		 url : 'controller/ignoreBtn.action',  
		 params : {
		 bsId:record.get("alarmId"),
		 bsType:record.get("type"),
		 ignore:0
	 },  
	 method : 'POST',
	 waitTitle : '请等待' ,  
	 waitMsg: '正在提交中', 
	 success : function(response) { 
		 ignorealarmstore.reload();
		 alarmstore.reload();
	 },

	 failure: function(response) {

		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "数据修改失败!" , 
			 icon: Ext.MessageBox.INFO  
		 }); 
	 }}); 
}