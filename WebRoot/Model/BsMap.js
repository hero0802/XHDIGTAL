	
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name:'bsId'},
	        {name:'offlinerepeaten'},
	        {name: 'online'}
	        ], 
	        idProperty : 'id'
})
Ext.define('bsControll',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'bsId'},
	        {name: 'channel_add_I_status'},
	        {name: 'channel_number'},
	        {name: 'temp1'},
	        {name: 'zV'},
	        {name: 'zI'},
	        {name: 'send_power'},
	        {name: 'dB'},
	        {name: 'jV'},
	        {name: 'gps'},
	        {name: 'sleep'},
	        {name:'longitude'},
	        {name:'latitude'},
	        {name:'height'},
	        {name:'star'}
	        ], 
	        idProperty : 'id'
})
Ext.define('call',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'starttime'},
	        {name: 'usetime'},
	        {name: 'caller'},
	        {name: 'called'},
	        {name: 'callid'},
	        {name: 'bsid'},
	        {name: 'ldtid'},
	        {name: 'filePath'},
	        {name: 'endway'},
	        {name:'ldtname'}
	        ], 
	        idProperty : 'id'
})

//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/BsView.action',
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
    	            property: 'bsId', 
    	            //排序类型，默认为 ASC 
    	            direction: 'ASC' 
    	        }] ,
    simpleSortMode: true 
}
});
//创建数据源
var bs_status_store = Ext.create('Ext.data.Store',{
	model:'bsControll',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/BsControlData.action',
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
    	            property: 'bsId', 
    	            //排序类型，默认为 ASC 
    	            direction: 'ASC' 
    	        }] ,
    simpleSortMode: true 
}
});
//创建数据源
var call_store = Ext.create('Ext.data.Store',{
	model:'call',	
	remoteSort: true,
	/*groupField:'Call_id' ,*/
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/callNow.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
},
autoLoad: true ,//很关键 ,
sorters: [{ 
	            //排序字段。 
	            property: 'starttime', 
	            //排序类型，默认为 ASC 
	            direction: 'DESC' 
	        }]
}
});

//Action
var bs_status_Action=Ext.create('Ext.Action',{
	text:'遥测基站',
	icon:'../resources/images/menu/bsStatus2.png',
    handler:function(){bsStatus()}
});
var bs_statusAll_Action=Ext.create('Ext.Action',{
	text:'遥测所有基站',
	icon:'../resources/images/menu/bsStatus.png',
    handler:function(){BsControlAll()}
});
var bs_pow_on_Action=Ext.create('Ext.Action',{
	text:'打开基站电源',
	icon:'../resources/images/menu/powon.png',
    handler:function(){bsPowOn()}
});
var bs_pow_off_Action=Ext.create('Ext.Action',{
	text:'关闭基站电源',
	icon:'../resources/images/menu/powoff.png',
    handler:function(){bsPowOff()}
});
var bs_no_sleep_Action=Ext.create('Ext.Action',{
	text:'基站联网',
	icon:'../resources/images/menu/neton.png',
    handler:function(){bsNetOn()}
});
var bs_sleep_Action=Ext.create('Ext.Action',{
	text:'基站脱网',
	icon:'../resources/images/menu/netoff.png',
    handler:function(){bsNetOff()}
});
var bs_singNum_Action=Ext.create('Ext.Action',{
	text:'设置信道号',
	icon:'../resources/images/menu/ch.png',
    handler:function(){setNum()}
});
var bs_pow_set_Action=Ext.create('Ext.Action',{
	text:'功率设定',
	icon:'../resources/images/menu/ps.png',
    handler:function(){set_power()}
});
var bs_pow_flag_Action=Ext.create('Ext.Action',{
	text:'功率标定',
	icon:'../resources/images/menu/p.png',
    handler:function(){bs_power_flag()}
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [bs_status_Action,bs_statusAll_Action,'-',
            bs_pow_on_Action,bs_pow_off_Action,'-',
            bs_no_sleep_Action,bs_sleep_Action,'-',
            bs_singNum_Action,'-',bs_pow_set_Action,bs_pow_flag_Action]
});
var view = Ext.create('Ext.view.View', {
	region:'center',
	store : store, //指定数据源
	loadMask:false,
	toolTip:{},
	tpl : [ //设置展示模板
			'<tpl for=".">',
			'<div class="thumb-wrap">',
			'<div class="bsId_div" id="ID_{bsId}"><span style="text-align:center;word-break:break-all;width:100%">{bsId}号基站</span></div>',
			'<div class="thumb">',
			'<tpl if="online==2">',
				'<img src="../resources/images/picture/bs_green.png" height="33" width="33">',
			'</tpl>',
			'<tpl if="online==1">',
			    '<img src="../resources/images/picture/bs_red.png" height="33" width="33">',
		    '</tpl>',
			'</div>',
			'<div  class="db_div" id="bsId_{bsId}"></div>',
			'</div>',
			
			 '</tpl>'],
	style : {
		backgroundColor : '#FFFFFF',
		fontFamily : '微软雅黑',
		backgroundImage : '../../resources/images/filebackground.jpg'
	},
	multiSelect : true,
	simpleSelect : true,
	trackOver : true,
	overItemCls : 'x-item-over',
	itemSelector : 'div.thumb-wrap',
	autoScroll : true,
	listeners:{
		'afterrender' : function() {
		view.emptyText='<span>对不起，没有查询到数据</span>'/*,
		//创浮动提示
		Ext.create('Ext.tip.ToolTip', {
				target : view.el,
				delegate : view.itemSelector,
				trackMouse : true,
				renderTo : Ext.getBody(),
				anchor : 'right',
				listeners : {
					beforeshow : function(tip) {
						var record = view
									.getRecord(tip.triggerElement);
							tip.update(Ext.String.format(
									tiptpl, 
									record.get('bsId'),
									record.get('house'),
									record.get('time')));
							       
						 
					}
				}
			});*/
	}
	,
	itemcontextmenu : function(dataView, record, item, index, e){
		view.getSelectionModel().select(record);
		e.stopEvent();
		contextMenu.showAt(e.getXY());
		contextMenu.doConstrain();
	}
	}
});
var grid;
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	region:'center',
	store:call_store,
	disableSelection: false,
	autoScroll:true,
	viewConfig: {
        stripeRows: true,
        forceFit: false,
        loadMask:false
    },  
	columns:[
	         {text: "通话时间", width: 140, dataIndex: 'starttime', sortable: false,
   	 editor : {  
   	 allowBlank : false  
    }},
	         {text: "主叫号码", width: 80, dataIndex: 'caller', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }, 
	         {text: "被叫号码", width: 80, dataIndex: 'called', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "主讲基站", width: 80, dataIndex: 'bsid', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 return v+"号基站"
	         }},
	         {text: "通话时长", width: 80, dataIndex: 'usetime', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){if(v>0){return  getTime(v)}else{return "";}}}/*,
	         {text: "结束原因", width: 80, dataIndex: 'endway', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}*/
	   
	         ],
	         frame:false,
	         border:true,
	         /*forceFit: false,*/
	         columnLines : true, 
	         height:document.documentElement.clientHeight-42,
	         autoWidth:true,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>'

})
}

var grid_status;
if(!grid_status)
{ grid_status=Ext.create('Ext.grid.Panel',{
	region:'center',
	store:bs_status_store,
	disableSelection: false,
	autoScroll:true,
	viewConfig: {
        stripeRows: true,
        forceFit: false,
        loadMask:false
    },  
	columns:[
	         {text: "基站ID", width: 60, dataIndex: 'bsId', sortable: false},
	         {text: "信道机电源", width: 80, dataIndex: 'channel_add_I_status', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==0){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
	        	 if(value==0){return "关机";}else{return "开机";}
	        	 
	        	 }
	         }
	         }, 
	         {text: "信道号", width: 60, dataIndex: 'channel_number', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v}
	         }}, 
	         {text: "板上温度", width: 80, dataIndex: 'temp1', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"°C" }
	         }},
	         {text: "直流电压", width: 80, dataIndex: 'zV', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){
	        		 return (parseInt(v)/10)+"V"
	        	 }
	         }},
	         {text: "直流电流", width: 80, dataIndex: 'zI', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"A"}
	         }},
	         {text: "发射功率", width: 80, dataIndex: 'send_power', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"W"}
	         }},
	         {text: "交流电压", width: 80, dataIndex: 'jV', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"V"}
	         }},
	         {text: "GPS状态", width: 80, dataIndex: 'gps', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==0){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
	        	 if(value==0){return "未锁定"}else{return "锁定";}
	        	 }
	        	 
	         }},
	         {text: "网络状态", width: 80, dataIndex: 'sleep', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==0){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }	        		 
	        	 if(value==0){return "单站休眠";}else{return "单站工作";}
	        	 
	        	 }
	         }},{text: "经度", width: 80, dataIndex: 'longitude', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},{text: "纬度", width: 80, dataIndex: 'latitude', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},{text: "高度", width: 80, dataIndex: 'height', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},{text: "卫星数", width: 80, dataIndex: 'star', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v}
	         }}
	   
	         ],
	         frame:false,
	         border:true,
	         /*forceFit: false,*/
	         columnLines : true, 
	         height:document.documentElement.clientHeight-50,
	         autoWidth:true,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>',
             dockedItems: [{
            	dock: 'bottom',
            	xtype: 'pagingtoolbar',
            	store: bs_status_store, 
            	displayInfo: true, 
            	items:[]


            }]

})
}
store.on('beforeload', function (store, options) {  
    var new_params = { 
    		id: "",
    		name: ""
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});

var bs_monitor=Ext.create('Ext.panel.Panel',{
	title:'<div id="bsMonistor1">基站遥测数据</div>',
	region:"center",
	items:grid_status
	/*collapsible : true, // 设置可折叠,
	split : true,*/
	/*autoScroll:true,*/
	/*margin:'0 30 0 30',*/
	/*bodyStyle:'overflow-x:hidden; overflow-y:scroll',*/
	/*html:'<div class="bsStatus"></div>'*/
})
var bs_right=Ext.create('Ext.panel.Panel',{
	title:'实时呼叫信息',
	region:"east",
	width:500,
	layout:'border',
	/*margin:'0 10 0 10',*/
	collapsible : true,
	collapsed:true,
	split : true,
	items:[bs_monitor,{
		xtype:'panel',
		region:'north',
		maximizable: false,
		height:210,
		autoWidth:true,
		/*collapsible : true, // 设置可折叠,
*/		items:grid
		
	}]
})
var rightTabPanel=Ext.create("Ext.tab.Panel",{
	/*collapsible : true,
	collapsed:false,*/
	margin:'0 5 0 5',
	split : true,
	region:"east",
	width:500,
	animCollapse:false,
	padding:0,
	border:false,
	//plain:true,
	layout:'border',  
	frame: false, 
	autoTabs:true,
	deferredRender:false,
	enableTabScroll:true,
	deferredRender:false,
	tabPosition:'top',	
	items:[{
		title:"实时呼叫记录",
		id:'call',
		icon:'../resources/images/menu/call.png',
		items:[grid]
		
	},{
		title:'基站遥测数据',
		id:'status',
		icon:'../resources/images/menu/bsStatus.png',
		items:[grid_status]
	}]
});
var tip_text="<span style='text-align:center;color:red;font-weight:600' >" +
	"<span style='text-align:center;'>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='showAlarm()'>点击查看!!</a></span></span>";
var top_tip=Ext.create('widget.uxNotification', {  
	border:false,
	layout:'border',
	title: '告警',
	position: 't',  
	width: 160,
	height:50,
	icon: 'resources/images/menu/alarm.png',
	autoClose:false,
	autoCloseDelay: 1000,  
	//maximized:true,
	maxinizable:true,
	spacing:0,  
	html:tip_text
	}); 
//显示表格
Ext.QuickTips.init(); 
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	
	new Ext.Viewport({
	layout:"border",	
	items:[{
		xtype:'panel',
		region:'center',
	
		maximizable: false,	
		autoWidth:true,
		autoScroll:true,
		items:view/*,
		dockedItems: [{
	          xtype: 'toolbar',
	          dock: 'left',
	          items: [{
	        	  xtype:'button',text:'123',handler:function(){bsAllStatus();}
	          }]
		}]*/
		
	}]
     });
	//top_tip.show();
	store.load({params:{start:0,limit:300}}); 
	call_store.load({params:{start:0,limit:300}});
	//bsAllStatus({params:{start:0,limit:300}});
	bs_status_store.load({params:{start:0,limit:300}});
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setAsync(false);//同步步
	//dwr_Data();
	dwr.engine.setErrorHandler(function(){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "ERROR:<br>服务器重启，系统推送功能失效，请刷新页面" , 
			 icon: Ext.MessageBox.ERROR
		 });
		if (top.location !== self.location) {   
		    top.location = "../index.html";//跳出框架，并回到首页   
		} 
	})
});
function dwr_Data(){
	SocketDwr.refresh();
	SocketDwr.rssi(null);
	SocketDwr.BsViewDwr();
	SocketDwr.callColor(null);
	SocketDwr.BsControlDwr();
  } 

function refreshData(){
	  call_store.reload();
  }
function rssiData(str){
	  if(str!=null && str!=""){
		  var str1=str.split(",");
		  $("#bsId_"+str1[0]).html("场强："+str1[1]+"dBm");
	  }else{
		  $("div[id^='bsId']").html("");
		  /*$("div[id^='bsId']").parent().parent().css("background","#F5F5DC");*/
	  }
  }
function BsViewRefresh(){
	store.reload();
}
function callColorControll(str){
	if(str!=null && str!=""){
		var str1=str.split(",");
		var reg = /^\s*|\s*$/g;
		if(str1[str1.length-1]=="true"){
			$("#ID_"+str1[0].replace(reg, "")).css("background","#1d953f");
			$("#ID_"+str1[1].replace(reg, "")).css("background","#f58220");
			$("#ID_"+str1[2].replace(reg, "")).css("background","#f58220");
			
		}else{
			//$("#ID_"+str1[0]).css("background","#225a1f"c77eb5);#19a97b
			$(".bsId_div").css("background","#19a97b");
		}
	}
  }
function BsControlRefresh(){
	bs_status_store.reload();
}
function bsStatus()
{
	var data = view.getSelectionModel().getLastSelected(); 
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在操作中。。。',  
         loadMask: true, 
         removeMask: true //完成后移除  
     });
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return;  
	}else{
		/*myMask.show();*/
		 Ext.Ajax.request({  
			 url : '../controller/bsStatus.action',  
			 params : {
			 id:data.get("bsId")
		 },  
		 method : 'POST',
		 waitTitle : '请等待' ,  
		 waitMsg: '正在提交中', 
		 /*timeout:5,*/
		 success : function(response, opts) { 
			 /*myMask.hide();*/
			 var str = Ext.decode(response.responseText);  

		 },

		 failure: function(response) {
			 Ext.example.msg("提示","失败");  
		 }
		 })  
	}
	rightTabPanel.setActiveTab("status");
	
}
function setNum(){
	var data = view.getSelectionModel().getLastSelected(); 
	var Form=Ext.create('Ext.FormPanel',{
		width:300,
		fileUpload: true, 
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{
			xtype:"numberfield",
			fieldLabel:'信道号',
			name:'number',
			minValue:1,
			maxValue:16
		}]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站-['+data.get("bsId")+':'+data.get("name")+']信道号',
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
                 removeMask: true //完成后移除  
             });
			if(form.isValid){
				myMask.show();
				form.submit(Ext.Ajax.request({
					url : '../controller/bsCh.action', 
					params : {  
					 id:data.get("bsId"),
       				 number:form.findField('number').getValue()
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
				     var rs = Ext.decode(response.responseText)
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","信道号设置成功"); 
				    	 win.hide();
				     }else{
				    	 Ext.example.msg("提示",rs.message);  
				     }
				    
				     
				   
  				     
  			    },
  			    failure: function(response) {
  			    	myMask.hide();
  			    	Ext.example.msg("提示","失败");  
   			      }
				}))
			}}
				
				
		},{
			text:'重置',
			iconCls:'reset',
			handler:function(){
			Form.form.reset();
		}
		}]
	})
	win.show();
}
//设定功率
function set_power(){
	var data = view.getSelectionModel().getLastSelected(); 
	var Form=Ext.create('Ext.FormPanel',{
		width:300,
		fileUpload: true, 
		autoHeight:true,
		bodyPadding:10,
		layout:'column',
		border:false,
		frame:false,	
		items :[{
			xtype:"numberfield",
			fieldLabel:'功率',
			name:'power',
			minValue:1,
			maxValue:50,
			labelWidth:30,
			width:150
		},{
			html:'<span style="color:red">  范围 [1-50]</span>',border:false
		}]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站-['+data.get("bsId")+':'+data.get("name")+']功率',
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
                 removeMask: true //完成后移除  
             });
			if(form.isValid){
				myMask.show();
				form.submit(Ext.Ajax.request({
					url : '../controller/set_power.action', 
					params : {  
					 id:data.get("bsId"),
       				 power:form.findField('power').getValue()
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
				     var rs = Ext.decode(response.responseText)
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","功率设置成功"); 
				    	 win.hide();
				     }else{
				    	 Ext.example.msg("提示",rs.message);  
				     }
				    
				     
				   
  				     
  			    },
  			    failure: function(response) {
  			    	myMask.hide();
  			    	Ext.example.msg("提示","失败");  
   			      }
				}))
			}}
				
				
		},{
			text:'重置',
			iconCls:'reset',
			handler:function(){
			Form.form.reset();
		}
		}]
	})
	win.show();
}
//打开基站电源
function bs_power_flag(){
	var data = view.getSelectionModel().getLastSelected(); 
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true //完成后移除  
         });
			myMask.show();
			Ext.Ajax.request({
				url : '../controller/bs_power_flag.action', 
				params : {  
				 id:data.get("bsId")
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","标定功率成功"); 
			    	 win.hide();
			     }else{
			    	 Ext.MessageBox.show({  
	   					 title : "提示",  
	   					 msg : rs.message , 
	   					 icon: Ext.MessageBox.INFO  
	   				 }); 
			     }
				     
			    },
			    failure: function(response) {
			    	myMask.hide();
			    	Ext.example.msg("提示","失败");  
			      }
			})	
}
//打开基站电源
function bsPowOn(){
	var data = view.getSelectionModel().getLastSelected(); 
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true //完成后移除  
         });
			myMask.show();
			Ext.Ajax.request({
				url : '../controller/bsPowOn.action', 
				params : {  
				 id:data.get("bsId")
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","基站电源打开成功"); 
			    	 win.hide();
			     }else{
			    	 Ext.MessageBox.show({  
	   					 title : "提示",  
	   					 msg : rs.message , 
	   					 icon: Ext.MessageBox.INFO  
	   				 }); 
			     }
				     
			    },
			    failure: function(response) {
			    	myMask.hide();
			    	Ext.example.msg("提示","失败");  
			      }
			})	
}
//关闭基站电源
function bsPowOff(){
	var data = view.getSelectionModel().getLastSelected(); 
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true //完成后移除  
         });
			myMask.show();
			Ext.Ajax.request({
				url : '../controller/bsPowOff.action', 
				params : {  
				 id:data.get("bsId")
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","关闭基站电源成功"); 
			    	 
			     }else{
			    	 Ext.example.msg("提示",rs.message);  
			     }
				     
			    },
			    failure: function(response) {
			    	myMask.hide();
			    	Ext.example.msg("提示","获取失败");  
			      }
			})	
}
//基站联网
function bsNetOn(){
	var data = view.getSelectionModel().getLastSelected(); 
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true //完成后移除  
         });
			myMask.show();
			Ext.Ajax.request({
				url : '../controller/bsNetOn.action', 
				params : {  
				 id:data.get("bsId")
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","基站联网成功"); 
			    	
			     }else{
			    	 Ext.example.msg("提示",rs.message); 
			     }
				     
			    },
			    failure: function(response) {
			    	myMask.hide();
			    	Ext.example.msg("提示","获取失败");  
			      }
			})	
}
//基站断网
function bsNetOff(){
	var data = view.getSelectionModel().getLastSelected(); 
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true //完成后移除  
         });
			myMask.show();
			Ext.Ajax.request({
				url : '../controller/bsNetOff.action', 
				params : {  
				 id:data.get("bsId")
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","基站断网成功"); 
			    	 
			     }else{
			    	 Ext.example.msg("提示",rs.message);  
			     }
				     
			    },
			    failure: function(response) {
			    	myMask.hide();
			    	Ext.example.msg("提示","获取失败"); 
			      }
			})	
}
//获取基站状态
function bsAllStatus(){
	var data = view.getSelectionModel().getLastSelected(); 
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true //完成后移除  
         });
			//myMask.show();
			Ext.Ajax.request({
				url : getRootPath()+'/data/BSStatusREQ.action', 
				params : {  
				 bsId:-1
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				//myMask.hide();
			   /*  var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","获取基站状态成功"); 
			    	 
			     }else{
			    	 Ext.example.msg("提示",rs.message);  
			     }*/
				     
			    },
			    failure: function(response) {
			    	//myMask.hide();
			    	//Ext.example.msg("提示","获取失败"); 
			      }
			})	
}
//遥测所有基站
function BsControlAll(){
	Ext.Ajax.request({  
		url : getRootPath()+'/controller/bsStatusAll.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时  
		/*alert("success")*/

	},
	failure: function(response) {

	}  
	}); 
	rightTabPanel.setActiveTab("status");
}
function getTime(time)
{
	var datetime="";
	var datem=Math.floor(time/60);
	var dates=time%60;
	if(datem<10){datem="0"+datem}
	if(dates<10){dates="0"+dates}
	datetime=datem+":"+dates;   	
	return datetime;
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