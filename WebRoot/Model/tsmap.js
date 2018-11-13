var map = null;
var img=null;
var markers = [];
var mscMarker=[];
var flightPath=null;
var refreshMap=1;
var bsId=0;
var zoomLevel=10;
var openBtn=0;
var mailMenu="";
var bsStore="";
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name:'bsId'},
	        {name:'bsName'},
	        {name:'model'},
	        {name:'linkModel'},
	        {name:'channelno'},
	        {name:'groupName'},
	        {name:'groupId'},
	       
	        {name:'offlinerepeaten'},
	        {name:'rf_send'},
	        {name:'rf_recv'},
	        {name: 'online'},
	        {name:'bsChannel_status'},
	        {name:'longitude'},
	        {name:'latitude'},
	        {name:'lng'},
	        {name:'lat'},
	        {name:'gps'},
	        {name: 'channel_number'}
	        ], 
	        idProperty : 'id'
}); 
//创建Model
Ext.define('group',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'name'}
	        ], 
	        idProperty : 'id'
});
Ext.define('info',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'content'},
	        {name:'status'},
	        {name: 'time'}
	        ], 
	        idProperty : 'id'
}); 
Ext.define('call',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'starttime'},
	        {name: 'usetime'},
	        {name: 'bsName'},
	        {name: 'path'},
	        {name: 'srcId'},
	        {name: 'caller'},
	        {name: 'called'},
	        {name: 'callid'},
	        {name: 'rssi'},
	        {name: 'bsid'},
	        {name: 'ldtid'},
	        {name: 'filePath'},
	        {name: 'endway'},
	        {name:'ldtname'}
	        ], 
	        idProperty : 'id'
});
Ext.define('bsControll',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'bsId'},
	        {name: 'bs'},
	        {name: 'bsName'},
	        {name: 'model'},
	        {name: 'linkModel'},
	        {name: 'online'},
	        {name: 'channel_add_I_status'},
	        {name: 'channel_number'},
	        {name: 'temp1'},
	        {name: 'zV'},
	        {name: 'zI'},
	        {name: 'send_power'},
	        {name: 'dB'},
	        {name: 'jV'},
	        {name: 'bsChannel_status'},
	        {name: 'channel_alarm_status'},
	        {name: 'busy_status'},
	        {name: 'ptt_status'},
	        {name: 'rep_status'},
	        {name: 'back_power'},
	        {name: 'temp2'},
	        {name: 'gps'},
	        {name: 'sleep'},
	        {name:'longitude'},
	        {name:'latitude'},
	        {name:'height'},
	        {name:'star'},
	        {name:'sum'}
	        ], 
	        idProperty : 'id'
});
//创建数据源
var group_store = Ext.create('Ext.data.Store',{
	model:'group',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : 'data/TalkGroupAllList.action',
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
var group_view_store = Ext.create('Ext.data.Store',{
	model:'group',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : 'data/TalkGroupAllList.action',
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
// 创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
// 设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : 'data/BsView.action',
    async:true,
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'bsId', 
    	            // 排序类型，默认为 ASC
    	            direction: 'ASC' 
    	        }] ,
    simpleSortMode: true 
}
});
// 创建数据源
var call_store = Ext.create('Ext.data.Store',{
	model:'call',	
	remoteSort: true,
	/* groupField:'Call_id' , */
// 设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : 'data/callNow.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
},
autoLoad: true ,// 很关键 ,
sorters: [{ 
	            // 排序字段。
	            property: 'starttime', 
	            // 排序类型，默认为 ASC
	            direction: 'DESC' 
	        }]
}
});
// 创建数据源
var bs_status_store = Ext.create('Ext.data.Store',{
	model:'bsControll',	
	remoteSort: true,
// 设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : 'data/BsControlData.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'bsId', 
    	            // 排序类型，默认为 ASC
    	            direction: 'ASC' 
    	        }] ,
    simpleSortMode: true 
}
});
// 创建数据源
var bs_info_store = Ext.create('Ext.data.Store',{
	model:'info',	
	remoteSort: true,
// 设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : 'data/bsInfo.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'time', 
    	            // 排序类型，默认为 ASC
    	            direction: 'desc' 
    	        }] ,
    simpleSortMode: true 
}
});
var clearAction = Ext.create('Ext.Action', {
    text: '清空',
    tooltip:'清空遥测信息',
    handler: clearBtn
    }
);
var detailAction = Ext.create('Ext.Action', {
    iconCls:'detail',
    text: '详细信息',
    tooltip:'详细信息',
    handler: showGrid
    }
);

var callAction = Ext.create('Ext.Action', {
    text: '通话记录',
    tooltip:'通话记录',
    handler: function(){
    	window.location.href="View/callList.html";
    }
    }
);
var breakCallAction = Ext.create('Ext.Action', {
    text: '强拆语音',
    iconCls:'break',
    tooltip:'强拆语音',
    handler: breakCall
    }
);
var breakAndKillAction= Ext.create('Ext.Action', {
    text: '遥晕电台',
    iconCls:'break',
    tooltip:'遥晕电台',
    handler: breakAndKill
    }
);
var detailAction = Ext.create('Ext.Action', {
    iconCls:'detail',
    text: '详细信息',
    tooltip:'详细信息',
    handler: showGrid
    }
);
// 创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [clearAction ,detailAction 
    ]
});
var callMenu = Ext.create('Ext.menu.Menu', {
    items: [callAction,'-',breakCallAction,"-",breakAndKillAction
    ]
});
var html='<div id="map_canvas" style="left:0;top:0px;bottom:0;width:100%;height:100%;min-height:450px;position:absolute;"></div>';
var normalHtml='<div id="bs-view"><div id="bs_div"></div></div>';

var mapPanel=Ext.create('Ext.panel.Panel',{
	/* title:'地图', */
	border:false,
	region:'center',
	layout:'border',
	items:[{
		xtype:"panel",
		id:'map-show',
		region:'center',
		html:normalHtml,
		dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items:[{
    			xtype:'radiogroup',fieldLabel:"",name:"type",id:"type",labelWidth:30,width:100,
    			items:[{
    				boxLabel:'地图',name:'type', inputValue: '0'
    			},{
    				boxLabel:'普通',name:'type', inputValue: '1',checked: true 
    			}],
    			listeners:{
        			change:function(){
        			var val=Ext.getCmp("type").getValue()['type'];
        			if(val==0){
        				Ext.getCmp('map-show').update(html);
        				$.smartMenu.remove();
        			}else{
        				Ext.getCmp('map-show').update(normalHtml);
        				$.smartMenu.remove();
        			}
        			store.reload();
        			}}
    		},{
            	text:'同步基站状态',
            	icon:'resources/images/menu/bsStatus.png',
            	handler:function(){
            		bsAllStatus();
            	
            	}
            },/*{
            	text:'同步基站GPS',
            	icon:'resources/images/menu/gps.png',
            	handler:function(){
            		bs_Gps();
            		store.reload();
            	}
            },*/{
            	text:'<span style="color:#000">语音监听</span>',
            	id:'voiceBtn',
            	icon:'resources/images/menu/monitor.png',
            	handler:function(){
            		listen();
            	}
            },'-',{
            	text:'<span style="color:#fff">开启全网禁发</span>',
            	id:'stopNet',
            	iconCls:'netstopsend-btn',
            	style:'background:green',
            	handler:function(){
            		// voice();
            		AllNetStopSendBtn();
            	}
            },'-',{
            	text:'<span style="color:#fff">允许模拟接入</span>',
            	id:'moni_on',
            	iconCls:'netstopsend-btn',
            	style:'background:green',
            	handler:function(){
            		// voice();
            		moniBtn();
            	}
            },breakCallAction]
            },{
                xtype: 'toolbar',
                dock: 'top',
                items:[{
                	xtype:'panel',
                	border:0,
                	html:'<div id="errorMsg" style="color:red;margin-left:20px;width:700px;height:20px;font-weight:blod;border:0;"></div>'
                }]
                }]
	},{
		xtype:'panel',
		layout:'column',
		region:'south',
		height:30,
		border:false,
		items:[{
			xtype:'textfield',
			fieldLabel:'缩放级别',
			labelWidth:60,
			width:100,
			id:'form-zoom',
			margin:2,
			value:getCookie("map_zoom")==""?9:parseInt(getCookie("map_zoom"))
		},{
			xtype:'textfield',
			fieldLabel:'经度',
			labelWidth:30,
			width:180,
			margin:2,
			id:'form-lon'
		},{
			xtype:'textfield',
			fieldLabel:'纬度',
			labelWidth:30,
			width:180,
			margin:2,
			id:'form-lat'
		}]
	}]
});
var grid;
var markerWin;
var voicePanel;
var gpsbtn=0;
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	region:'center',
	store:call_store,
	disableSelection: false,
	autoScroll:true,

	columns:[
	         {text: "通话时间", width: 100, dataIndex: 'starttime', sortable: false,
   	 editor : {  
   	 allowBlank : false  
    },renderer:function(v){
    	return v.split(" ")[1];
    }},
	         {text: "主叫", width: 120, dataIndex: 'caller', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }, 
	         {text: "被叫组", width: 120, dataIndex: 'called', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }} ,
	        
	         {text: "主讲基站", width: 100, dataIndex: 'bsName', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 return v
	         }},
	         {text: "场强", width: 100, dataIndex: 'rssi', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 return v+" dB"
	         }},
	        
	         {text: "通话时长", width: 90, dataIndex: 'usetime', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){if(v>0){return  getTime(v)}else{return "";}}}
	         
	         ],
	         frame:false,
	         border:true,
	         /* forceFit: false, */
	         columnLines : true, 
	         height:document.documentElement.clientHeight-42,
	         autoWidth:true,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>',
             viewConfig: {
	             stripeRows: true,
	             stripeRows: true,
	             forceFit: false,
	             loadMask:false,
	             listeners: {
	            	 itemdblclick:function(dataview, record, item, index, e){  
	            		 var usetime=parseInt(record.get("usetime"));
	            		 gpsbtn=0;
                    	 var form="<div style='padding:10px;'>";
                    	 form+="<p>主叫ID:"+record.get("srcId")+"</p>";
                    	 form+="<p>名称:"+record.get("caller")+"</p>";
                    	 form+="<p>被叫组:"+record.get("called")+"</p>";
                    	 form+="</div>";
                    	 if(!voicePanel){
                    		 voicePanel=Ext.create('Ext.Panel',{
                     			/*title:'播放器',*/
                     			height:200,
                     			html : '<iframe id="wav" style="" src="" frameborder="0" width="350px" scrolling="no" height="200px"></iframe>', 
                     		})
                    	 }else{
                    		 Ext.get("wav").dom.src = ""
                    	 }
                    	 
                    	if(markerWin){
                    		markerWin.hide();
                    		
                    	}
                    		
                    		markerWin=Ext.create("Ext.Window",{
                    			modal:false,
                    			title:'操作手台',
                    			x:document.documentElement.clientWidth-500,
                    			/*y:document.documentElement.clientHeight-500,*/
                    			width:500,
                    			height:200,
                    			layout:'border',
                    			closeAction:'hide',
                    			items:[{
                					xtype:'panel',
                					region:'west',
                					width:150,
                					border:0,
                					html:form
                				},{
                					xtype:'panel',
                					region:'center',
                					border:0,
                					items:voicePanel
                				}],
                    			buttons:[{
                    				text:'强拆',
                    				iconCls:'break',
                    				handler:function(){
                    					breakOtherCall(record)
                    				}
                    			},{
                    				text:'遥晕',
                    				iconCls:'ok',
                    				handler:function(){
                    					breakAndKill(record);
                    					/*markerWin.hide();*/
                    				}
                    			},{
                    				text:'播放',
                    				iconCls:'play',
                    				disabled:usetime==-1,
                    				handler:function(){
                    					var path=record.get("path");
                    					player(path);
                    					/*markerWin.hide();*/
                    				}
                    			},{
                    				text:'定位',
                    				iconCls:'icon-location',
                    				disabled:gpsbtn==1,
                    				handler:function(btn){
                    					gpsbtn=1;
                    					btn.disable();
                    					OneGps(record.get("srcId"),record.get("starttime"),btn);
                    					
                    				}
                    			},{
                    				text:'关闭',
                    				iconCls:'cancel',
                    				handler:function(){
                    					markerWin.hide();
                    					if(mscMarker.length>0){
                		    				clearMarker(mscMarker[0]);
                		    				mscMarker.splice(0,mscMarker.length);	
                		    			}
                    				}
                    				
                    			}]
                    	 })
                    	 markerWin.show()
                     }
	                 /*itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     callMenu.showAt(e.getXY());
	                     return false;
	                 }
                     ,*/
	             }
	         },

})
};
var grid_status=Ext.create('Ext.grid.Panel',{
	region:"center",
	store:bs_status_store,
	disableSelection: false,
	autoScroll:true,
	/* height:400, */
	  height:document.documentElement.clientHeight,
	viewConfig: {
        stripeRows: true,
        forceFit: false,
        loadMask:false
    }, 
	columns:[
	         {text: "基站ID", width: 60, dataIndex: 'bs', sortable: false},
	         {text: "基站名称", width: 120, dataIndex: 'bsName', sortable: false},
	         {text: "信道机电源", width: 100, dataIndex: 'bsChannel_status', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==2){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
	        	 if(value==2){return "关机";}else{return "开机";}
	        	 }else{
	        		 return "- -"
	        	 }
	         }
	         }, 
	         {text: "基站类型", width: 80, dataIndex: 'model', sortable: false,
	        	 renderer:function(value,metaData,record){
	        		 if(value==1){
	        			 return "数字基站";
	        		 }else{
	        			 return "模拟基站";
	        		 }
	        		 if(record.get("linkModel")==1){
	        			 return "4G基站";
	        		 }
	        	 }},
	        	 {text: "TCP状态", width: 80, dataIndex: 'online', sortable: false,
		        	 editor : {  
		        	 allowBlank : false  
		         },renderer:function(value,metaData,record){
		        	 if(value==1){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
		        	 if(value==1){return "中断";}else{return "连接";}
		        	 
		         }
		         },
	         {text: "信道号", width: 60, dataIndex: 'channel_number', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v}else{
	        		 return "- -"
	        	 }
	         }}, 
	         {text: "板上温度", width: 80, dataIndex: 'temp1', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"°C" }else{
	        		 return v
	        	 }
	         }},
	         {text: "直流电压", width: 80, dataIndex: 'zV', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){
	        		 return (parseInt(v)/10)+"V"
	        	 }else{
	        		 return v
	        	 }
	         }},
	         {text: "直流电流", width: 80, dataIndex: 'zI', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"A"}else{
	        		 return v
	        	 }
	         }},
	         {text: "交流电压", width: 80, dataIndex: 'jV', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"V"}else{
	        		 return v
	        	 }
	         }},
	         {text: "发射功率", width: 80, dataIndex: 'send_power', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"W"}else{
	        		 return v
	        	 }
	         }},
	         {text: "反向功率", width: 80, dataIndex: 'back_power', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"W"}else{
	        		 return v
	        	 }
	         }},
	         {text: "GPS状态", width: 80, dataIndex: 'gps', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==0){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
	        	 if(value==0){return "失锁"}else if(value==1){return "锁定";}else{ return "";}
	        	 }else{
	        		 return "- -"
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
	        	 
	        	 }else{
	        		 return "- -"
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
	         }},{text: "雷击次数", width: 80, dataIndex: 'sum', sortable: false,
	        	 renderer:function(v){return 0;}
		         }
	   
	         ],
	         frame:false,
	         border:true,
	         /* forceFit: false, */
	         columnLines : true, 
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	            	
	                /*
					 * itemcontextmenu: function(view, rec, node, index, e) {
					 * e.stopEvent(); contextMenu.showAt(e.getXY()); return
					 * false; }
					 */
	             }
	         },
	         autoWidth:true,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>',
             dockedItems: [/*
							 * { dock: 'bottom', xtype: 'pagingtoolbar', store:
							 * bs_status_store, displayInfo: true, items:[]
							 * 
							 *  }
							 */]

});
var info_grid;
if(!info_grid)
{ info_grid=Ext.create('Ext.grid.Panel',{
	title:'系统信息',
	region:'south',
	split:true,
	collapsible : true,
	height:document.documentElement.clientHeight/3,
	store:bs_info_store,
	disableSelection: false,
	headerCfg:{style:'display:none'},
	autoScroll:true,
	viewConfig: {
        stripeRows: true,
        forceFit: false,
        loadMask:false
    },  
	columns:[
	         {text: "时间", width: 140, dataIndex: 'time',renderer:function(value, metaData, record, rowIndex, colIndex, store){
	        	 if(record.get('status')==1){
	        		 metaData.tdCls='x-grid-record-alarm5';
	        	 }else if(record.get('status')==0){
	        		 metaData.tdCls='x-grid-record-alarm4';
	        	 }else {
	        		 metaData.tdCls='x-grid-record-alarm2';
	        	 }
	        	 return value
	          }},
	         {text: "信息", flex:1, dataIndex: 'content',renderer:function(value, metaData, record, rowIndex, colIndex, store){
	          	 if(record.get('status')==1){
	        		 metaData.tdCls='x-grid-record-alarm5';
	        	 }else if(record.get('status')==0){
	        		 metaData.tdCls='x-grid-record-alarm4';
	        	 }else{
	        		 metaData.tdCls='x-grid-record-alarm2';
	        	 }
	        	 return value
	          }}	   
	         ],
	         frame:false,
	         border:true,
	         /* forceFit: false, */
	         columnLines : true, 
	        /* height:document.documentElement.clientHeight/2, */
	         autoWidth:true,
             emptyText:'<span style="text-align:center">没有数据</span>'

})
};

var listen_panel=Ext.create('Ext.panel.Panel',{
	region:'center',
	/*collapsible : true,
	collapsed:false,*/
	split:true,
	width:630,
	html:'<div id="group-div"></div>'
})



var grid_controll=Ext.create('Ext.grid.Panel',{
	title:'遥测数据       &nbsp;&nbsp;&nbsp;&nbsp;<a href="#" style="color:#fff" onclick="refresh()">刷新</a>',
	region:"south",
	store:bs_status_store,
	disableSelection: false,
	autoScroll:true,
	height:150,
	collapsible : true,
	split:true,
	viewConfig: {
        stripeRows: true,
        forceFit: false,
        loadMask:false,
        enableTextSelection:true // 可以复制单元格文字
    }, 
	columns:[
	         {text: "基站ID", width: 60, dataIndex: 'bs', sortable: false},
	         {text: "基站名称", width: 80, dataIndex: 'bsName', sortable: false},
	         {text: "基站类型", width: 80, dataIndex: 'model', sortable: false,
	        	 renderer:function(value,metaData,record){
	        		 if(value==1){
	        			 return "数字基站";
	        		 }else{
	        			 return "模拟基站";
	        		 }
	        		 if(record.get("linkModel")==1){
	        			 return "4G基站";
	        		 }
	        	 }},
	        	 {text: "TCP状态", width: 60, dataIndex: 'online', sortable: false,
		        	 editor : {  
		        	 allowBlank : false  
		         },renderer:function(value,metaData,record){
		        	 if(value==1){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
		        	 if(value==1){return "中断";}else{return "连接";}
		        	
		         }
		         },
	         {text: "电源", width: 60, dataIndex: 'bsChannel_status', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==2){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
	        	 if(value==2){return "关机";}else{return "开机";}
	        	 }else{
	        		 return "- -"
	        	 }
	         }
	         }, 
	         {text: "信道号", width: 60, dataIndex: 'channel_number', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v}else{
	        		 return "- -"
	        	 }
	         }}, 
	         {text: "GPS", width: 60, dataIndex: 'gps', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get('channel_number')>0){
	        		 if(value==0){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }
	        	 if(value==0){return "失锁"}else if(value==1){
	        		 return "锁定";}
	        	 else{
	        		 return "";
	        	 }
	        	 }else{
	        		 return "- -"
	        	 }
	        	 
	         }},
	         {text: "发射功率", width: 80, dataIndex: 'send_power', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v!=0){return v+"W"}else{
	        		 return v
	        	 }
	         }}
	   
	         ],
	         frame:false,
	         border:true,
	         /* forceFit: false, */
	         columnLines : true, 
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	            	
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },
	         autoWidth:true,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>',
             dockedItems: [/*
							 * { dock: 'bottom', xtype: 'pagingtoolbar', store:
							 * bs_status_store, displayInfo: true, items:[]
							 * 
							 *  }
							 */]

})
var callPanel=Ext.create('Ext.Panel',{
	title:'呼叫信息<select id="group_list" style="margin-left:30px;"><option value="0">==所有被叫组==</option></select>',
	region:'east',
	collapsible : true,
	collapsed:false,
	split:true,
	layout:'border',
	width:430,
	items:[grid,grid_controll,info_grid]
});
var controllPanel=Ext.create('Ext.panel.Panel',{
	title:'遥测数据       &nbsp;&nbsp;&nbsp;&nbsp;<a href="#" style="color:#fff" onclick="refresh()">刷新</a>',
	region:'south',
	collapsible : true,
	collapsed:true,
	split:true,
	layout:'border',
	height:300,
	items:[grid_status]
});

var centerPanel=Ext.create('Ext.Panel',{
	title:'123',
	region:"center",
	layout:'border',
	items:mapPanel
})
/*
 * var tabPanel=Ext.create("Ext.tab.Panel",{ region:"center", id:"main",
 * animCollapse:false, padding:0, border:false, // plain:true, layout:'fit',
 * 
 * frame: false, autoTabs:true, deferredRender:false, enableTabScroll:true,
 * deferredRender:false, tabPosition:'bottom', items:[{ title:"基站视图",
 * height:100, layout:'border', border:false, id:'tab-view', // iconCls:'fa
 * fa-home fa-lg'/ // icon: 'resources/images/menu/config.png', items:mapPanel
 * 
 * },{ title:"遥测数据", items:[grid_status], height:100, id:'tab-controller' //
 * iconCls:'fa fa-home fa-lg'/ // icon: 'resources/images/menu/call.png'
 *  }] });
 */

 bs_status_store.on('beforeload', function (store, options) {  
			    var new_params = { 
			    		id:-1
			    		};  
			    Ext.apply(store.proxy.extraParams, new_params);  

});
var bsHtml="";
var bsChHtml="";
store.on('load',function (store, options){
	bsHtml="";bsChHtml="";
	for(var i =0;i<store.getCount();i++){
		var record=store.getAt(i);
		bsHtml+='<span><input name="bsId" value="'+record.get("bsId")+'" type="checkbox" >'+record.get("bsId")+record.get("bsName")+"</span>";
		bsChHtml+='<span><input name="bsIdCh" value="'+record.get("bsId")+'" type="checkbox">'+record.get("bsId")+record.get("bsName")+"</span>";

	}
	if(Ext.getCmp('type').getValue()['type']==0){
		mapInitialize();
		var zoom=map.getZoom();
		if(zoom<zoomLevel){
			MapMaker9();
		}else{
			MapData();
		}	
		
		Ext.getCmp('form-zoom').setValue(map.getZoom());
		
	}else{
		GetBsView();
		 $("#bs-view").on('mousedown',function(e){
			 $.smartMenu.remove();
			 if(e.which==3){
				 var menu = [
						    		 [{text: "遥测所有基站", func: function() {BsControlAll()}}],
						    		  [{text: "设置信道号", func: function() {setNum()}}],
						    		  [{text: "基站限制", func: function() {updateBsRfdown()}}]		  
						   ];
				 $("#bs-view").smartMenu(menu);
			 }
		 })
		
		
		
		
	}	
});
group_store.on('load', function (s, options) {  
    console.log("store->"+s.getCount());
    s.each(function(record){
    	$("#group_list").append("<option value='"+record.get('id')+"'>"+record.get('name')+"["+record.get('id')+"]"+"</option>");
    	$("#group-div").html(record.get('name'));
    }) 
    

});
group_view_store.on('load', function (s, options) {  
	var htm="";
	   
	group_view_store.each(function(record){
		if(getCookie("openVoice")==1 && getCookie("listenGroup")==record.get('id')){
			htm+="<div class='group-div listenning' value='"+record.get('id')+"'>";
	    	htm+="<p>"+record.get('name')+"</p>";
	    	htm+="<p class='listen-status'>正在监听..</p>"
	    	htm+="</div>";
		}else{
			htm+="<div class='group-div' value='"+record.get('id')+"'>";
	    	htm+="<p>"+record.get('name')+"</p>";
	    	htm+="<p class='listen-status'></p>"
	    	htm+="</div>";
		}
		
		
		
    
    }) 
    $("#group-view").html(htm);
	
});

$(".group-div").live('click',function(e){
	
	
	if($(this).find(".listen-status").html()!=""){
		$(".group-div").find(".listen-status").html("");
		$(".group-div").removeClass("listenning");
		setCookie("openVoice", 0);
		setCookie("listenGroup","");
		closeVoice($(this).attr("value"));
	}else{
		$(".group-div").find(".listen-status").html("");
		$(".group-div").removeClass("listenning");
		closeVoice($(this).attr("value"));
		$(this).find(".listen-status").html("<span>正在监听..</span>");
		$(this).toggleClass("listenning");
		setCookie("openVoice", 1);
		setCookie("listenGroup", $(this).attr("value"));
		openVoice($(this).attr("value"));
	}
	
})
$(".group-div").live('mouseover',function(e){
	
	
})



call_store.on('beforeload', function (store, options) {  
    var new_params = { 
    		called:$("#group_list").val()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
$("#group_list").live("change",function(){
　　　　//获取选择的值
　　　　var condition = $(this).val();
　　　　//其他操作
    call_store.on('beforeload', function (store, options) {  
    var new_params = { 
    		called:condition
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
     call_store.reload();
　　});
/*
 * tabPanel.addListener("tabchange", function(tabs, nowtab){
 * 
 * if(nowtab.id=="tab-controller"){ bs_status_store.reload() } })
 */
// 自定义右键上下文
// 数据


// 显示表格
Ext.QuickTips.init(); 
// 禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	/* loadConfig(); */
	// setCookie("openVoice", 0);
	new Ext.Viewport({
		layout:"border",
		style:'background:skyblue',
		items:[mapPanel,callPanel,controllPanel]
	});
	
	/*var wgloc={};
	wgloc.lat=39.1187;
	wgloc.lng=117.20233;
	console.log("经纬度转化前："+wgloc.lat+";"+wgloc.lng);
	console.log("经纬度："+transformFromWGSToGCJ(wgloc).lat+";"+transformFromWGSToGCJ(wgloc).lng);*/
	AllNetStopSendBtnSta();
	// mapInitialize();
	// bs_status_store.reload();
	store.load();
	bs_status_store.load();
	call_store.load();
	bs_info_store.load();
	group_store.load();
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setAsync(false);// 同步步
	dwr_Data();
	dwr.engine.setErrorHandler(function(){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "ERROR:<br>服务器重启，系统推送功能失效，请刷新页面" , 
			 icon: Ext.MessageBox.ERROR
		 });
		if (top.location !== self.location) {   
		    top.location = "index.html";// 跳出框架，并回到首页
		} 
	})
	
	
	//$("#errorMsg").html("2weer");
	
	
});

function dwr_Data(){
	SocketDwr.refresh();
	// SocketDwr.rssi(null);
	// SocketDwr.BsViewDwr();
	// SocketDwr.callColor(null);
	// SocketDwr.BsControlDwr();
  } 

function bsStatusDwr(str){
	var recvData=Ext.decode(str);
	if(recvData.items.length<1){
		return;
	}
	var type=Ext.getCmp('type').getValue()['type'];
	for(var i=0;i<recvData.items.length;i++){
		var online=recvData.items[i].workstatus;
		var channelno=recvData.items[i].channelno;
		var bsId=recvData.items[i].bsId;
		var model=recvData.items[i].model;
		var linkModel=recvData.items[i].linkModel;
		var status=recvData.items[i].status;
		var offlinerepeaten=recvData.items[i].offlinerepeaten;
		
		var icon='mapfiles/bs_digital.png';
		  if(online==2){
			  if(model==0){
				  icon='mapfiles/bs_moni.png';
			  }else{
				  icon='mapfiles/bs_digital.png';
				  if(offlinerepeaten==1){
					  icon='mapfiles/bs_digital_offnet.png'; 
				  }
				  if(linkModel==1){
						icon="mapfiles/bs_4g_green.png";
						if(offlinerepeaten==1){
							  icon='mapfiles/bs_4g.png'; 
						  }
				  }
				  if(status==2){
					  if(linkModel==1){
							icon="mapfiles/bs_4g_off.png";
					  }else{
						  icon="mapfiles/bs_off.png";
					  }
				  }
			  }
			  
		  }else{
			  if(model==0){
				  icon='mapfiles/bs_moni_red.png';
			  }else{
				  icon='mapfiles/bs_digital_red.png';
			  }
		  }
		if(type==0){
			var zoom=map.getZoom(); 
			if(zoom<zoomLevel){
			  if(online==2){
					  icon='mapfiles/bs_small_red.png';
			   }else{
					  icon='mapfiles/bs_small_green.png';
			  }			  
					for(var j=0;j<markers.length;j++){
						  if(markers[j].id== bsId){
							  var record=markers[j].record;
							  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
							  var bsId=markers[j].id;
							  var title=markers[j].title;
							  var labelContent=markers[j].labelContent;	
							  var record=markers[j].record;
							  clearMarker(markers[j]);
							  markers.splice(j,1);
							  CreatMaker9(location,title,bsId,icon,record)  
						  }
					}		
			}else{
				for(var j=0;j<markers.length;j++){
					  if(markers[j].id==bsId){
						  var record=markers[j].record;
						  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
						  var bsId=markers[j].id;
						  var title=markers[j].title;
						  var labelContent=markers[j].labelContent;	
						  var record=markers[j].record;
						  clearMarker(markers[j]);
						  markers.splice(j,1);
						  createMarker(location,bsId,title,labelContent,icon,record);
						  
					  }
				  }
			}

		}else{
		    $("#img_"+bsId).attr("src",icon);	
		    $(".ch_"+bsId).html("ch:"+channelno);
		    //(offlinerepeaten==1&&online==2?"<img src='mapfiles/close.png'>脱网":"")+'</span>
		    /*var hh=offlinerepeaten==1&&online==2?"<img src='mapfiles/close.png'>单站":""
		    $("bs_outnet_"+bsId).html(hh)*/
			
		  // store.reload();
		}
			
	}
}

function refreshData(){
	  call_store.reload();
}
function rssiData(str){
	var recvData=Ext.decode(str);
	var type=Ext.getCmp('type').getValue()['type'];

	if(type==1){
		  if(str!=null && str!=""){
			  $("#bs_rssi_"+ recvData[0].bsId).html("<span style='color:red;font-size:10px;'> 场强"+recvData[0].rssi+"dB</span>");
		  }else{
			 $("span[id^='bs_rssi']").html("");
			  
		  }
	}else{
		/*
		 * var zoom=map.getZoom(); if(zoom<zoomLevel){return;}
		 */
		  if(str!=null && str!=""){
			  $("#bs_rssi_"+ recvData[0].bsId).html("<span style='color:red;font-size:10px;'> 场强"+recvData[0].rssi+"dB</span>");
		  }else{
			 $("span[id^='bs_rssi']").html("");
			  
		  }
	}
  }
function BsViewRefresh(){
	store.reload();
}
function BsToControl(str){
/*	var zoom=map.getZoom();
	if(zoom<zoomLevel){
		MapMaker9();
	}else{
		MapData();
	}	
	if(record.get("online")==1 || record.get('bsChannel_status')==2){
		icon="mapfiles/bs_small_red.png";
		// labelClass="marker-label-error";
	}*/
	var type=Ext.getCmp('type').getValue()['type'];
	var recvData=Ext.decode(str);
	var online=recvData.online;
	var model=recvData.model;
	var linkModel=recvData.linkModel;
	var status=recvData.status;
	var bsChannel_status=recvData.bsChannel_status;
	var offlinerepeaten=recvData.offlinerepeaten;
	var icon='mapfiles/bs_digital.png';
	
	  if(online==2){
		  if(model==0){
			  icon='mapfiles/bs_moni.png';
		  }else{
			  icon='mapfiles/bs_digital.png';
			  if(offlinerepeaten==1){
				  icon='mapfiles/bs_digital_offnet.png';
			  }
			  if(linkModel==1){
					icon="mapfiles/bs_4g_green.png";
					if(offlinerepeaten==1){
						  icon='mapfiles/bs_4g.png';
					  }
			  }
			  if(status==2){
				  if(linkModel==1){
						icon="mapfiles/bs_4g_off.png";
				  }else{
					  icon="mapfiles/bs_off.png";
				  }
			  }
		  }
	  }else{
		  if(model==0){
			  icon='mapfiles/bs_moni_red.png';
		  }else{
			  icon='mapfiles/bs_digital_red.png';
		  }
	  }
	if(type==0){
		var zoom=map.getZoom();  
		if(zoom<zoomLevel){
		  if(online==2){
				  icon='mapfiles/bs_small_red.png';
		   }else{
				  icon='mapfiles/bs_small_green.png';
		  }	
		  if(record.get('bsChannel_status')==2){
				icon="mapfiles/bs_small_red.png";
				// labelClass="marker-label-error";
			}
				for(var j=0;j<markers.length;j++){
					  if(markers[j].id==recvData.bsId){
						  var record=markers[j].record;
						  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
						  var bsId=markers[j].id;
						  var title=markers[j].title;
						  var labelContent=markers[j].labelContent;	
						  var record=markers[j].record;
						  clearMarker(markers[j]);
						  markers.splice(j,1);
						  CreatMaker9(location,title,bsId,icon,record)  
					  }
				}		
		}else{
			for(var j=0;j<markers.length;j++){
				  if(markers[j].id==recvData.bsId){
					  var record=markers[j].record;
					  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
					  var bsId=markers[j].id;
					  var title=markers[j].title;
					  var labelContent=markers[j].labelContent;	
					  var record=markers[j].record;
					  clearMarker(markers[j]);
					  markers.splice(j,1);
					  createMarker(location,bsId,title,labelContent,icon,record);
					  
				  }
			  }
		}

	}else{
		// console.log(recvData.bsId);
	    $("#img_"+recvData.bsId).attr("src",icon);
		
	  // store.reload();
	}
	
}
function BsOffLine(str){
	var type=Ext.getCmp('type').getValue()['type'];
	var recvData=Ext.decode(str);
	var online=recvData.online;
	var model=recvData.model;
	var linkModel=recvData.linkModel;
	var status=recvData.status;
	var offlinerepeaten=recvData.offlinerepeaten;
	var icon='mapfiles/bs_digital.png';
	
	  if(online==1){
		  if(model==0){
			  icon='mapfiles/bs_moni.png';
		  }else{
			  icon='mapfiles/bs_digital.png';
			  if(offlinerepeaten==1){
				  icon='mapfiles/bs_digital_offnet.png'; 
			  }
			  if(linkModel==1){
					icon="mapfiles/bs_4g_green.png";
					if(offlinerepeaten==1){
						  icon='mapfiles/bs_4g.png'; 
					  }
			  }
			  if(status==2){
				  if(linkModel==1){
						icon="mapfiles/bs_4g_off.png";
				  }else{
					  icon="mapfiles/bs_off.png";
				  }
			  }
		  }
	  }else{
		  if(model==0){
			  icon='mapfiles/bs_moni_red.png';
		  }else{
			  icon='mapfiles/bs_digital_red.png';
		  }
	  }
	if(type==0){
		var zoom=map.getZoom();  
		if(zoom<zoomLevel){
		  if(online==1){
				  icon='mapfiles/bs_small_red.png';
		   }else{
				  icon='mapfiles/bs_small_green.png';
		  }			  
				for(var j=0;j<markers.length;j++){
					  if(markers[j].id==recvData.bsId){
						  var record=markers[j].record;
						  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
						  var bsId=markers[j].id;
						  var title=markers[j].title;
						  var labelContent=markers[j].labelContent;	
						  var record=markers[j].record;
						  clearMarker(markers[j]);
						  markers.splice(j,1);
						  CreatMaker9(location,title,bsId,icon,record)  
					  }
				}		
		}else{
			for(var j=0;j<markers.length;j++){
				  if(markers[j].id==recvData.bsId){
					  var record=markers[j].record;
					  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
					  var bsId=markers[j].id;
					  var title=markers[j].title;
					  var labelContent=markers[j].labelContent;	
					  var record=markers[j].record;
					  clearMarker(markers[j]);
					  markers.splice(j,1);
					  createMarker(location,bsId,title,labelContent,icon,record);
					  
				  }
			  }
		}

	}else{
		// console.log(recvData.bsId);
	    $("#img_"+recvData.bsId).attr("src",icon);
		
	  // store.reload();
	}
	
}
var radioMakerWin= new google.maps.InfoWindow();
//显示当前呼叫手台
/*function radiogps(str){

	if(data.lat*1 > 38 && data.lat*1 < 40 && data.lng*1 > 116 && data.lng*1 < 119){
	 //markers.push(marker);
	var image = "";
	var wgloc={};
	wgloc.lat=data.lat;
	wgloc.lng=data.lng;
	var lat=transformFromWGSToGCJ(wgloc).lat;
	var lng=transformFromWGSToGCJ(wgloc).lng;	
	var marker = new google.maps.Marker({
		position :new google.maps.LatLng(lat,lng),	
		map : map,
		title : "ID:"+data.id+"名称："+data.name,
		id : data.id,
		data:data,
		icon : 'mapfiles/phoneMarker2.png',
	});
	if(mscMarker.length>0){
		clearMarker(markers[0]);
		mscMarker.splice(0,mscMarker.length);	
	}
	mscMarker.push(marker);

	   
	}
	
}*/
function bsModel(str){
	var type=Ext.getCmp('type').getValue()['type'];
	var recvData=Ext.decode(str);
	var items=recvData.items;
	var icon='mapfiles/bs_digital.png';
/*
 * $.each(items,function(){ var model=recvData.model; var
 * online=recvData.online; })
 */
	
	for(var i=0;i<items.length;i++){  
		var model=items[i].model;
		var online=items[i].online;
		var bsId=items[i].bsId;
		var linkModel=items[i].linkModel;
		var status=items[i].status;
		var offlinerepeaten=items[i].offlinerepeaten
		if(online==2){
			  if(model==0){
				  icon='mapfiles/bs_moni.png';
			  }else{
				  icon='mapfiles/bs_digital.png';
				  if(offlinerepeaten==1){
					  icon='mapfiles/bs_digital_offnet.png';
				  }
				  if(linkModel==1){
						icon="mapfiles/bs_4g_green.png";
						 if(offlinerepeaten==1){
							  icon='mapfiles/bs_4g.png';
						  }
				  }
				  if(status==2){
					  if(linkModel==1){
							icon="mapfiles/bs_4g_off.png";
					  }else{
						  icon="mapfiles/bs_off.png";
					  }
				  }
			  }
		  }else{
			  if(model==0){
				  icon='mapfiles/bs_moni_red.png';
			  }else{
				  icon='mapfiles/bs_digital_red.png';
			  }
		  }
		  
		
		if(type==0){
			var zoom=map.getZoom();
			if(zoom!=null){
			if(zoom<zoomLevel){return;}
			}
			  for(var j=0;j<markers.length;j++){
				  if(markers[j].id==bsId){
					  var record=markers[j].record;
					  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
					  var bsId=markers[j].id;
					  var title=markers[j].title;
					  var labelContent=markers[j].labelContent;	
					  var record=markers[j].record;
					  clearMarker(markers[j]);
					  markers.splice(j,1);
					  createMarker(location,bsId,title,labelContent,icon,record);
					  
				  }
			  }
		}else{
		    $("#img_"+bsId).attr("src",icon);
			
		    // store.reload();
		}
	} 
	
	
	
	
	  
	  
	
}
function bsChan(str){
	var recvData=Ext.decode(str);
	var type=Ext.getCmp('type').getValue()['type'];
	if(type==1){
		$(".ch_"+recvData.bsId).html("ch:"+recvData.channelno);
	}
}
function callColorControll(str){

	var type=Ext.getCmp('type').getValue()['type'];
	var recvData=Ext.decode(str);

	var flag=recvData.flag;
	
	if(recvData.items==null){return;}
	
	if(type==0){
		var zoom=map.getZoom();
		if(zoom!=null){
		if(zoom<zoomLevel){return;}
		}
		for(var i=0;i<recvData.items.length;i++){
			  for(var j=0;j<markers.length;j++){
				  var icon='mapfiles/bs_digital.png';
				  if(recvData.items[i].model==0){
					  icon='mapfiles/bs_monil.png';
				  }else{
					  if(recvData.items[i].offlinerepeaten==1){
						  icon="mapfiles/bs_digital_offnet.png";
					  }
					  if(recvData.items[i].linkModel==1){
						  icon="mapfiles/bs_4g_green.png";
						  if(recvData.items[i].offlinerepeaten==1){
							  icon="mapfiles/bs_4g.png";
						  }
					  }
					  if(recvData.items[i].status==2){
						  if(recvData.items[i].linkModel==1){
								icon="mapfiles/bs_4g_off.png";
						  }else{
							  icon="mapfiles/bs_off.png";
						  }
					  }
					  
				  }
				  
				  if(flag){
					  if(i==0){
						  icon='mapfiles/phoneMarker2.png';
					  }else{
						  icon='mapfiles/bs_say.gif';
					  }
				  }
				  if(markers[j].id==recvData.items[i].bsId){
					  var record=markers[j].record;
					  var location=new google.maps.LatLng(record.get("lat"),record.get("lng"));
					  var bsId=markers[j].id;
					  var title=markers[j].title;
					  var labelContent=markers[j].labelContent;
					  
					  clearMarker(markers[j]);
					  markers.splice(j,1);
					  createMarker(location,bsId,title,labelContent,icon,record);
					  
				  }
			  }
		}
	}else{
		for(var i=0;i<recvData.items.length;i++){
			  var icon='mapfiles/bs_digital.png';
			  if(recvData.items[i].model==0){
				  icon='mapfiles/bs_monil.png';
			  }else{
				  if(recvData.items[i].offlinerepeaten==1){
					  icon="mapfiles/bs_digital_offnet.png";
				  }
				  if(recvData.items[i].linkModel==1){
					  icon="mapfiles/bs_4g_green.png";
					  if(recvData.items[i].offlinerepeaten==1){
						  icon="mapfiles/bs_4g.png";
					  }
				  }
				  if(recvData.items[i].status==2){
					  if(recvData.items[i].linkModel==1){
							icon="mapfiles/bs_4g_off.png";
					  }else{
						  icon="mapfiles/bs_off.png";
					  }
				  }
			  }
			  if(flag){
				  if(i==0){
					  icon='mapfiles/phoneMarker2.png';
				  }else{
					  icon='mapfiles/bs_say.gif';
				  }
			  }
			 $("#img_"+recvData.items[i].bsId).attr("src",icon);
			
		}
	}
	
  }
function BsControlRefresh(){
	bs_status_store.reload();
	bs_status_store.each(function(record){
		console.log("data->"+record.get('gps'))
		var bsid=record.get('bsId');
		var gps=record.get('gps').toString();
		if(gps=='0'){
			$("#bsName-"+bsid).css("color","red")			
		}else{
			$("#bsName-"+bsid).css("color","#000")
		}
		
	})
}
function BsInfo(){
	bs_info_store.reload();
}
function CallErrorInfo(str){
	var recvData=Ext.decode(str);
	if(recvData!=null){
		var html="时间："+recvData.starttime+"&nbsp;&nbsp;";
		html+="主讲号码："+recvData.caller+"&nbsp;&nbsp;";
		html+="主讲基站：["+recvData.bsid+"]"+recvData.bsName+"&nbsp;&nbsp;";
		html+="呼叫失败,"+recvData.errorMsg;
		$("#errorMsg").html(html);
		
	}
}
function LocalMapType() {
}
LocalMapType.prototype.tileSize = new google.maps.Size(256, 256);
LocalMapType.prototype.maxZoom = 17; // 地图显示最大级别
LocalMapType.prototype.minZoom = 6; // 地图显示最小级别
LocalMapType.prototype.name = "西藏自治区地图";
LocalMapType.prototype.alt = "显示本地地图数据";
LocalMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
	img = ownerDocument.createElement("img");
	img.style.width = this.tileSize.width + "px";
	img.style.height = this.tileSize.height + "px";
	img.style.border=0;
	// 地图存放路径
	// 谷歌矢量图 maptile/googlemaps/roadmap
	// 谷歌影像图 maptile/googlemaps/roadmap
	// MapABC地图 maptile/mapabc/
	// strURL = "maptile/googlemaps/roadmap/";

	mapPicDir = "maptile/googlemaps/roadmap/";
	var curSize = Math.pow(2, zoom);
	strURL = mapPicDir + zoom + "/" + (coord.x % curSize) + "/"
			+ (coord.y % curSize) + ".png";
	// strURL = "E:/地图文件/谷歌地图中国0-12级googlemaps/googlemaps/roadmap/" + zoom +
	// "/" + (coord.x % curSize )+ "/" + (coord.y % curSize)+ ".PNG";

	img.src =strURL;
	img.alt = "" + "没有地图数据";
	
	CheckImgExists(strURL);
	return img;
};
function mapInitialize() {
	
	var zoom=getCookie("map_zoom")==""?6:parseInt(getCookie("map_zoom"));
	var lat=29.709378,lng=91.114822;
	if(getCookie("map_center_lat")!="" && getCookie("map_center_lng")!=""){
		lat=parseFloat(getCookie("map_center_lat"));
		lng=parseFloat(getCookie("map_center_lng"));
	}
	var myLatlng = new google.maps.LatLng(lat, lng);
	var localMapType = new LocalMapType();
	var mapOptions = {
		zoom :zoom,
		center : myLatlng,
		disableDefaultUI : true,
		mapTypeControl: true,
		mapTypeControlOptions : {
			style : google.maps.MapTypeControlStyle.DEFAULT,
			mapTypeIds : ['localMap' ]
		// 定义地图类型
		},
		panControl : true,
		zoomControl : true, // 缩放控件
		/*
		 * zoomControlOptions:{ style: google.maps.ZoomControlStyle.LARGE,
		 * position: google.maps.ControlPosition.LEFT_CENTER },
		 */
		mapTypeControl : true,
		scaleControl : true ,// 尺寸
		streetViewControl : true,  // 小人
		rotateControl : true,
		
		overviewMapControl : true
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	map.mapTypes.set('localMap', localMapType); // 绑定本地地图类型
	map.setMapTypeId('localMap'); // 指定显示本地地图
	map.setOptions({
		draggable : true
	});
	
	var image = 'mapfiles/spotlight-poi.png';
/*
 * var marker = new MarkerWithLabel({ position :new google.maps.LatLng(39,117),
 * map : map, id:1, icon : 'mapfiles/mscMarker.png', labelContent : "33699",
 * labelAnchor : new google.maps.Point(22, 0), labelClass : "marker-label", //
 * the CSS class for }); marker.addListener('click', function(){
 * infowindow.open(map,marker); });
 */
	/*
	 * marker.setMap(map);//将定义的标注显示在地图上
	 * 
	 */
	/* marker.addListener('click', toggleBounce); */
	/*
	 * map.addListener('click', function(event) { addMarker(event.latLng); });
	 */
	// 鼠标移动获取经纬度坐标
	google.maps.event.addListener(map, 'mousemove', function(event) {
		/*
		 * document.getElementById("showLatlng").innerHTML = "经度：" +
		 * event.latLng.lng() + ',纬度：' + event.latLng.lat();
		 */
		Ext.getCmp('form-lat').setValue(event.latLng.lat());
		Ext.getCmp('form-lon').setValue(event.latLng.lng());
		var center=map.getCenter().toString();
		center=center.substring(1,(center.length-1)).split(",");
		setCookie("map_center_lat",center[0].trim());
		setCookie("map_center_lng",center[1].trim());
		/*console.log("lat:"+getCookie("map_center_lat"))
		console.log("lng:"+getCookie("map_center_lng"))*/
		
	});
	// 鼠标滚动获取地图层级：
	google.maps.event.addListener(map, 'zoom_changed', function(event) {
		var zoom=map.getZoom();
		Ext.getCmp('form-zoom').setValue(map.getZoom());
		setCookie("map_zoom",map.getZoom());
		
		if(zoom>=zoomLevel){
			MapData();
		}else{
			MapMaker9();
		}
		
	});

	/*
	 * google.maps.event.addListener(marker, 'click', function() { alert(1) });
	 */

}
// 获取地图数据
function MapData(){
	clearMarkers();
	markers=[];
	var infoWindow = new google.maps.InfoWindow(); 
	store.each(function(record){
		var image = "",marker="";
		var icon="mapfiles/bs_digital.png"
		var labelClass="marker-label-success";
		if(record.get("model")==0){
			if(record.get("online")==1){
				icon="mapfiles/bs_moni_red.png";
				// labelClass="marker-label-error";
			}else{
				icon="mapfiles/bs_moni.png";
			}
			// labelClass="marker-label-error";
		}else{
			if(record.get("online")==1){
				icon="mapfiles/bs_digital_red.png";
				// labelClass="marker-label-error";
			}else{
				if(record.get('linkModel')==1){
					icon="mapfiles/bs_4g_green.png";
					if(record.get('offlinerepeaten')==1){
						icon="mapfiles/bs_4g.png";
					}
					
				}
				if(record.get('offlinerepeaten')==1){
					icon="mapfiles/bs_digital_offnet.png";
				}
				if(record.get('bsChannel_status')==2){
					  if(record.get('linkModel')==1){
							icon="mapfiles/bs_4g_off.png";
					  }else{
						  icon="mapfiles/bs_off.png";
					  }
				}
			}
		}
		var wgloc={};
		wgloc.lat=record.get("lat");
		wgloc.lng=record.get("lng");
		var lat=transformFromWGSToGCJ(wgloc).lat;
		var lng=transformFromWGSToGCJ(wgloc).lng;
		
		   marker = new MarkerWithLabel({
			position : new google.maps.LatLng(lat,lng),
			map : map,
			title : "ID:"+record.get("bsId")+"  名称:"+record.get("bsName"),
			id : record.get("bsId"),
			icon :icon,
			record:record,
			labelContent :record.get("bsName")+"<span id='bs_"+record.get("bsId")+"'></span>",
			labelAnchor : new google.maps.Point(37, 0),
			labelClass : labelClass, // the CSS class for
			labelStyle : {}
		    // animation: google.maps.Animation.DROP
		});
		   markers.push(marker);
		   (function (marker,record) {  
				var id="1";
				var name="123"
			   
			   var htmlStr='<span id="sd" >ID:'+marker.record.get("bsId")+'</span><br>';
			   htmlStr+='<span >名称:'+marker.record.get("bsName")+'</span><br>';
			   htmlStr+='<span>状态:'+(marker.record.get("online")=="2"?"<span style='color:green'>在线</span>":"<span style='color:red'>离线</span>")+'</span><br>';
			   htmlStr+='<span>信道:'+(marker.record.get("channel_number")=="0"?"- -":marker.record.get("channel_number"))+'</span><br>';
		     google.maps.event.addListener(marker, "click", function (e) {  
		         // Wrap the content inside an HTML DIV in order to set
					// height and width of InfoWindow.
		         infoWindow.setContent("<div style = 'width:150px; color:#000'>"+htmlStr+"</div>");  
		         infoWindow.open(map, marker);  
		        
		     });  
		     google.maps.event.addListener(marker, "mousedown", function (e) {  
		    	 
		    	 bsId=marker.id;
		         if(e.which==3){
		        	 
		        	 var menu= [
			    		 [{text: "遥测当前基站", func: function() {bsStatus(bsId)}},
			    		  {text: "遥测所有基站", func: function() {BsControlAll()}}],
			    		  [{text: "打开基站电源", func: function() {bsPowOn(bsId)}},
			    		  {text: "关闭基站电源", func: function() {bsPowOff(bsId)}}],
			    		  [{text: "基站联网", func: function() {bsNetOn(bsId)}},
			    		  {text: "基站脱网", func: function() {bsNetOff(bsId)}}],
			    		  [{text: "设置信道号", func: function() {setNum(bsId)}}],
			    		  
			    		  
			    		  [{text: "功率设定", func: function() {set_power(bsId)}}],
			    		  
			    		  [{text: "基站限制", func: function() {updateBsRfdown(bsId)}}],
			    		  
			    		  
			    		  [{text: "设置模数模式", func: function() {ADMode(bsId)}}],
				    		
			    		 
				    		 [{text: "经纬度设置", func: function() {setLngLat(bsId)}}]
			    						 ];
		        	 $(".marker-label-success").smartMenu(menu);
		      
		        	// Action

		         }    	 
		     }); 
		 })(marker, record);
	});
		
}
// 地图9级
function MapMaker9(){
	clearMarkers();
	markers=[];
	var infoWindow = new google.maps.InfoWindow(); 
	store.each(function(record){
		var image = "",marker="";
		var icon="mapfiles/bs_small_green.png";
		var labelClass="marker-label-success";
		if(record.get("online")==1 || record.get('bsChannel_status')==2){
			icon="mapfiles/bs_small_red.png";
			// labelClass="marker-label-error";
		}
		var wgloc={};
		wgloc.lat=record.get("lat");
		wgloc.lng=record.get("lng");
		var lat=transformFromWGSToGCJ(wgloc).lat;
		var lng=transformFromWGSToGCJ(wgloc).lng;
		
		   marker = new google.maps.Marker({
			position : new google.maps.LatLng(lat,lng),
			map : map,
			title : "ID:"+record.get("bsId")+"  名称:"+record.get("bsName"),
			id : record.get("bsId"),
			icon :icon,
			record:record
		    // animation: google.maps.Animation.DROP
		});
		   markers.push(marker);
	});	
}
function CreatMaker9(position,title,id,icon,record){
	var marker = new google.maps.Marker({
		position : position,
		map : map,
		title : title,
		id : id,
		icon :icon,
		record:record
	    // animation: google.maps.Animation.DROP
	});
	   markers.push(marker);
}
function GetBsView(){
	var str="";
	var str_off="";
	
	store.each(function(record){
		var icon='mapfiles/bs_digital.png';
		var iconRfs="mapfiles/bs_small_green.png";
		var iconRfr="mapfiles/bs_small_green.png";
		var labelClass="marker-label-error";
		if(record.get("model")==0){
			
			if(record.get("online")==1){
				icon="mapfiles/bs_moni_red.png";
				labelClass="marker-label-error";
			}else{
				icon="mapfiles/bs_moni.png";
				labelClass="marker-label-error";
			}
		}else{
			if(record.get("online")==1){
				icon="mapfiles/bs_digital_red.png";
				labelClass="marker-label-error";
			}else{
				if(record.get('offlinerepeaten')){
					  icon="mapfiles/bs_digital_offnet.png";
				  }
				if(record.get('linkModel')==1){
					icon="mapfiles/bs_4g_green.png";
					if(record.get('offlinerepeaten')==1){
						icon="mapfiles/bs_4g.png";
					}
				}

				  if(record.get('bsChannel_status')==2){
					  if(record.get('linkModel')==1){
							icon="mapfiles/bs_4g_off.png";
					  }else{
						  icon="mapfiles/bs_off.png";
					  }
				  }
			}
		}
		
		if(record.get('rf_send')==1){
			iconRfs="mapfiles/bs_small_green.png";
		}else{
			iconRfs="mapfiles/bs_small_red.png";
		}
		if(record.get('rf_recv')==1){
			iconRfr="mapfiles/bs_small_green.png";
		}else{
			iconRfr="mapfiles/bs_small_red.png";
		}
		
		
	
		str+='<div  bsId="'+record.get('bsId')+'" linkModel="'+record.get('linkModel')+'" id="bs-div-on" model="'+record.get('model')+'" >';
		
	/*	str+='<div style="width:100%;"><span  id="badge-right" title="基站ID">'+record.get('bsId')+'</span>';
		str+='<span  id="badge-right-center" title="联网信道"  class="ch_'+record.get('bsId')+'" >ch:'+record.get('channelno')+'</span>';
		str+='</div><div><table >';*/
		str+='<div><table class="bs-table">';
		str+='<tr>';
		str+='<td colspan=2><span  id="badge-right" title="基站ID">'+record.get('bsId')+'</span></td>';
		str+='<td><span  id="badge-right-center" title="联网信道"  class="ch_'+record.get('bsId')+'" >ch:'+record.get('channelno')+'</span></td>'
		str+="</tr>";
		
		
		str+='<tr style="padding:5px;" ><td colspan="3" style="font-size:10px;color:#000"> &nbsp;';
		str+=record.get("groupName");
		str+='</td></tr>';
		str+='<tr align="center" valign="middle"><td width="25px"><img id="imgRf_'+record.get('bsId')+'" src="'+iconRfr+'" style="margin:0 auto"><br><span style="font-size:11px">收</span></td><td><img id="img_'+record.get('bsId')+'" src="'+icon+'" style="vertical-align:middle;"></td><td><img id="imgRf_'+record.get('bsId')+'" src="'+iconRfs+'" style="margin:0 auto"><br><span style="font-size:11px">发</span></td></tr>';
		if(record.get("gps").toString()=='0'){
			str+='<tr style="color:red;font-weight: bold; font-size: 11px;"><td  colspan="3" id="bsName-'+record.get('bsId')+'"><span>'+record.get('bsName')+'</span></td></tr>';
		}else{
			str+='<tr style="color:#000;font-weight: bold; font-size: 11px;"><td  colspan="3" id="bsName-'+record.get('bsId')+'"><span>'+record.get('bsName')+'</span></td></tr>';
		}

		str+='<tr><td  colspan="3"><span id="bs_rssi_'+record.get('bsId')+'"></span></td></tr>';
		/*str+='<tr><td  colspan="3"><span style="color:red;font-weight: bold; font-size: 11px;" id="bs_outnet_'+record.get('bsId')+'">'
			+(record.get('offlinerepeaten')==1&&record.get('online')==2?"<img src='mapfiles/close.png'>单站":"")+'</span></td></tr>';*/
		
		str+='</table></div>';
		/*str+='<div class="gps-div" id="gpsen-'+record.get('bsId')+'">'+(record.get('gps')==0?"<span>失锁</span>":"")+'</div>';*/
		str+='</div>';
		$("#bs_div").html(str);
		
	});
	
	 $("#bs_div").on('mousedown',"#bs-div-on",function(e){
		 $.smartMenu.remove();
		 if(e.which==3){
			 mailMenu = [
					    		 [{text: "遥测当前基站", func: function() {bsStatus($(this).attr("bsId"))}}/*
																										 * ,
																										 * {text:
																										 * "遥测所有基站",
																										 * func:
																										 * function()
																										 * {BsControlAll()}}
																										 */],
					    		  
					    		  [{text: "打开基站电源", func: function() {bsPowOn($(this).attr("bsId"))}},
					    		  {text: "关闭基站电源", func: function() {bsPowOff($(this).attr("bsId"))}}],
					    		  
					    		
					    		  
					    		  [{text: "设置信道号", func: function() {setNumOne($(this).attr("bsId"))}}],
					    		  
					    		  [{text: "功率设定", func: function() {set_power($(this).attr("bsId"))}}],
					    		  
					    		  [{text: "设置模数模式", func: function() {ADMode($(this).attr("bsId"),$(this).attr("model"))}}],
					    
					    		  
					    		  [{text: "基站联网", func: function() {bsNetOn($(this).attr("bsId"))}},
						    		  {text: "基站脱网", func: function() {bsNetOff($(this).attr("bsId"))}}],
						    		  
						    		  [{text: "4G基站更新",show:false, func: function() {bsUpdate($(this).attr("bsId"),$(this).attr("linkModel"))}}],
						    		  
						    		 [{text: "经纬度设置", func: function() {setLngLat($(this).attr("bsId"))}}]
					   ];
			 $(this).smartMenu(mailMenu);
		 }
	 })
/*
 * $("#bsoff_div").on('mousedown','div',function(e){ if(e.which==3){ var
 * mailMenuData = [ [{text: "遥测当前基站", func: function()
 * {bsStatus($(this).attr("bsId"))}}, {text: "遥测所有基站", func: function()
 * {BsControlAll()}}], [{text: "打开基站电源", func: function()
 * {bsPowOn($(this).attr("bsId"))}}, {text: "关闭基站电源", func: function()
 * {bsPowOff($(this).attr("bsId"))}}], [{text: "基站联网", func: function()
 * {bsNetOn($(this).attr("bsId"))}}, {text: "基站脱网", func: function()
 * {bsNetOff($(this).attr("bsId"))}}], [{text: "设置信道号", func: function()
 * {setNum($(this).attr("bsId"))}}], [{text: "功率设定", func: function()
 * {set_power($(this).attr("bsId"))}}, {text: "功率标定", func: function()
 * {bs_power_flag($(this).attr("bsId"))}}], [{text: "设置脱网信道", func: function()
 * {OffLineCh($(this).attr("bsId"))}}, {text: "设置模数模式", func: function()
 * {ADMode($(this).attr("bsId"))}}], [{text: "经纬度设置", func: function()
 * {setLngLat($(this).attr("bsId"))}}] ]; $(this).smartMenu(mailMenuData); } })
 */
	 
}
function bsStatus(id)
{
	 Ext.Ajax.request({  
		 url : 'controller/bsStatus.action',  
		 params : {
		 id:id
	 },  
	 method : 'POST',
	 waitTitle : '请等待' ,  
	 waitMsg: '正在提交中', 
	 /* timeout:5, */
	 success : function(response, opts) { 
		 /* myMask.hide(); */
		 var str = Ext.decode(response.responseText);  
		 bs_status_store.on('beforeload', function (store, options) {  
			    var new_params = { 
			    		id:id
			    		};  
			    Ext.apply(store.proxy.extraParams, new_params);  

			});
		 bs_status_store.reload();

	 },
	 failure: function(response) {
		 Ext.example.msg("提示","失败");  
	 }
	 }) 
	// tabPanel.setActiveTab("tab-controller");
	
}

// 设置基站信道
var winCh="";
function setNum(){ 
	
	var Form=Ext.create('Ext.FormPanel',{
		width:750,
		fileUpload: true, 
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{
			xtype:'panel',
			html:"<div id='BsIdChCheckbox'>"+bsChHtml+"</div>"
		},{xtype:'checkbox',name:'selectAll',fieldLabel:'全选',labelWidth:30,
			listeners:{change:function(){
				var a=Form.form.findField("selectAll").getValue();
				if(a){
					$("input[name='bsIdCh']").attr("checked", true);
				}else{
					$("input[name='bsIdCh']").attr("checked",false);
				}
            }}},{
    			xtype:"numberfield",
    			fieldLabel:'信道号',
    			name:'number',
    			minValue:1,
    			maxValue:16
    		}]
	})
	if(!winCh){ winCh=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站信道号',
		autoWidth:true,
		autoHeight:true,
		closeAction:'close',
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
			 var Chk=$("input[name='bsIdCh']:checked");
			 
			 var ids = []; 
			 if(ids.length>0){
				 ids.slice(0,ids.length);
			 }
			 
			 $(Chk).each(function(){
				
				   if(this.value){ids.push(this.value);  }
			    });
			
		  if(ids.length<1){
			  alert("没有选择基站");
			  return;
		  }
		  if(form.findField('number').getValue()<1){
			  alert("信道号不正确");
			  ids.slice(0,ids.length);
			  return;
		  }
			if(form.isValid){
				myMask.show();
			
				form.submit(Ext.Ajax.request({
					url : 'controller/bsCh.action', 
					params : {  
						bsIds:ids.join(","),
						number:form.findField('number').getValue(),
					
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
					 ids.slice(0,ids.length);
			
				     var rs = Ext.decode(response.responseText)
				 	if(rs.success){
						Ext.example.msg("提示","设置成功");
						
						// winCh.hide();
						
					}else{
						Ext.example.msg("提示","设置失败");
					} 
  			    },
  			    failure: function(response) {
  			    	myMask.hide();
  			    	
  			    	 ids.slice(0,ids.length);
  			    	Ext.example.msg("提示","失败");  
   			      }
				}))
			}}
				
				
		}]
	})
	}
	winCh.show();
	$("input[name='bsIdCh']").attr("checked", false);
	// $("input[value='"+id+"']").attr("checked", true);
}
function setNumOne(id){ 
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
		title:'设置基站-['+id+']信道号',
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
					url : 'controller/bsCh.action', 
					params : {  
						bsIds:id,
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
// 设定功率
function set_power(id){
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
			minValue:0,
			maxValue:50,
			labelWidth:30,
			width:150
		},{
			html:'<span style="color:red">  范围 [0-50]</span>',border:false
		}]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站-['+id+']功率',
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
					url : 'controller/set_power.action', 
					params : {  
					 id:id,
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
// 设置脱网信道
function OffLineCh(id){
	var Form=Ext.create('Ext.FormPanel',{
		width:300,
		fileUpload: true, 
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{
			xtype:'checkbox',fieldLabel:'所有基站',name:'bsType',checked:false,labelWidth:60,margin:'0 30 0 0'
		},{
			xtype:"numberfield",
			fieldLabel:'脱网信道',
			name:'channel',
			minValue:1,
			maxValue:50,
			labelWidth:70,
			width:150
		}]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站-['+id+']脱网信道',
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
					url : 'controller/bs_offnet_chan.action', 
					params : {  
					 id:id,
					 bsType:form.findField('bsType').getValue()?1:0,
       				 number:form.findField('channel').getValue()
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
				     var rs = Ext.decode(response.responseText)
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","脱网信道设置成功"); 
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
};

/*
 * function updateBsRfdown(id){ Ext.Ajax.request({ url :
 * 'controller/updateBsRfdown.action', params : { id:id }, method : 'POST',
 * async:false, success : function(response, opts) { var rs =
 * Ext.decode(response.responseText); // 当后台数据同步成功时 if(rs.success){
 * Ext.example.msg("提示","设置成功"); }else{ Ext.example.msg("提示","设置失败"); }
 *  }, failure: function(response) { Ext.example.msg("提示","设置失败"); } }); }
 */
// 基站限制

var winBs="";

function updateBsRfdown(id){ 
	var Form=Ext.create('Ext.FormPanel',{
		width:750,
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{
			xtype:'panel',
			html:"<div id='BsIdCheckbox'>"+bsHtml+"</div>"
		},{xtype:'checkbox',name:'selectAll',fieldLabel:'全选',labelWidth:30,
			listeners:{change:function(){
				var a=Form.form.findField("selectAll").getValue();
				if(a){
					$("input[name='bsId']").attr("checked", true);
				}else{
					$("input[name='bsId']").attr("checked",false);
				}
            }}},{
			xtype:'radiogroup',fieldLabel:'基站限制',name:'bsmang',labelWidth:60,layout:'column',margin:'0 30 0 0',
			items: [
		           /* { boxLabel: '基站禁发', name:'bsmang', inputValue: '0'},*/
		            { boxLabel: '基站禁收', name:'bsmang', inputValue: '1',margin:'0 0 0 10',checked: true }/*,
		            { boxLabel: '允许基站发射接收', name:'bsmang', inputValue: '2',margin:'0 0 0 10',checked: true }*/
		        ]/*,
            listeners:{
    			change:function(){
    			
        			var val=Form.form.findField('bsmang').getValue()['bsmang'];
        		
        			
        			$("input[name='bsId']").attr("checked",false);
        			if(val==0){
        				Ext.Ajax.request({
        					url : 'data/rf_transmit.action', 
        					params : {  
        				    
        				},
        				method : 'POST',
        				    waitTitle : '请等待' ,  
        				    waitMsg: '正在提交中', 
        				    success : function(response,opts) { 
        				     var rs = Ext.decode(response.responseText).items;
        				   
        				     for(var i=0;i<rs.length;i++){
        				    	 $("input[value='"+rs[i].id+"']").attr("checked", true);
        				     }  
        				    },
        				    failure: function(response) {
        				    	
        				      }
        				})	
        			}else if(val==1){
        				Ext.Ajax.request({
        					url : 'data/rf_receive.action', 
        					params : {  
        				
        				},
        				method : 'POST',
        				    waitTitle : '请等待' ,  
        				    waitMsg: '正在提交中', 
        				    success : function(response,opts) { 
        				     var rs = Ext.decode(response.responseText).items;
        				   
        				     for(var i=0;i<rs.length;i++){
        				    	 $("input[value='"+rs[i].id+"']").attr("checked", true);
        				     }  
        				    },
        				    failure: function(response) {
        				    	
        				      }
        				})	
        			}
        			else{
        				
        			}
        			
      }}*/
		}]
	});
	var Panel=Ext.create('Ext.Panel',{
		width : 600,
		height:500,
		border:0,
		bodyStyle :'overflow-x:visible;overflow-y:scroll', // 隐藏水平滚动条
		items:Form
	})
	if(!winBs){winBs=Ext.create("Ext.Window",{
		modal:true,
		title:'基站限制',
		autoWidth:true,
		autoHeight:true,
		closeAction:'close',
		items:Form,
		buttons:[{
			text:'确定',
			iconCls:'ok',
			handler:function(){
				/*var val=Form.form.findField('bsmang').getValue()['bsmang'];
    			alert(val);return;*/
		
			var form=Form.form;
			 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                 msg: '正在操作中。。。',  
                 loadMask: true, 
                 removeMask: true // 完成后移除
             });
			 var obj=$("input[name='bsId']:checked");
			 var ids = []; 
			 for(k in obj){
			        if(obj[k].checked)
			            ids.push(obj[k].value);
			    }
			 /*if(ids.length>0){
				 ids.slice(0,ids.length);
			 }*/
			 /*console.log("前："+ ids)
			    $(arrChk).each(function(){
			    	ids.push(this.value); 
			    	console.log("bsId:"+this.value)
			    });
			 console.log("后："+ ids)*/
		 /* if(ids.length<1){
			  alert("没有选择基站");
			  return;
		  }*/
			if(form.isValid){
				myMask.show();
			
				form.submit(Ext.Ajax.request({
					url : 'controller/updateBsRfdown.action',  
					params : {  
						bsIds:ids.join(","),
						bsmang:Form.form.findField("bsmang").getValue()['bsmang'],
					
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
					 //ids.slice(0,ids.length);
				     var rs = Ext.decode(response.responseText)
				 	if(rs.success){
						Ext.example.msg("提示","设置成功");
						// Form.form.reset();
						winBs.hide();
						store.reload()
					}else{
						Ext.example.msg("提示","设置失败");
					} 
  			    },
  			    failure: function(response) {
  			    	myMask.hide();
  			    	 ids.slice(0,ids.length);
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
	winBs.show();
	}else{
		
		winBs.show();
	}
	
	Ext.Ajax.request({
		url : 'data/rf_receive.action', 
		params : {  
	
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText).items;
	   
	     for(var i=0;i<rs.length;i++){
	    	 $("input[value='"+rs[i].id+"']").attr("checked", true);
	     }  
	    },
	    failure: function(response) {
	    	
	      }
	})	
	Form.form.findField("selectAll").setValue(0);
	// $("input[value='"+id+"']").attr("checked", true);
	//$("input[name='selectAll']").attr("checked", false);
/*
 * Ext.Ajax.request({ url : 'data/rf_updown.action', params : {
 *  }, method : 'POST', waitTitle : '请等待' , waitMsg: '正在提交中', success :
 * function(response,opts) { var rs = Ext.decode(response.responseText).items;
 * 
 * for(var i=0;i<rs.length;i++){
 * $("input[value='"+rs[i].id+"']").attr("checked", true); } }, failure:
 * function(response) {
 *  } })
 */
	
}
// 设置设置模数模式
function ADMode(id,model){
	var Form=Ext.create('Ext.FormPanel',{
		width:300,
		fileUpload: true, 
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{
			xtype:'checkbox',fieldLabel:'所有基站',name:'bsType',checked:false,labelWidth:60,margin:'0 30 0 0'
		},{
			xtype:'radiogroup',fieldLabel:'模式',name:'channel',id:'channel',checked:true,labelWidth:60,layout:'column',margin:'0 30 0 0',
			items: [
		            { boxLabel: '模拟', name:'channel', inputValue: '0'},
		            { boxLabel: '数字', name:'channel', inputValue: '1',checked: true }
		        ]
		}/*
			 * { xtype:"numberfield", fieldLabel:'模式', name:'channel',
			 * minValue:1, maxValue:50, labelWidth:70, width:150 }
			 */]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站-['+id+']模数模式',
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
					url : 'controller/bs_admodel.action', 
					params : {  
					 id:id,
					 bsType:form.findField('bsType').getValue()?1:0,
       				 number:form.findField('channel').getValue()['channel']
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
				     var rs = Ext.decode(response.responseText)
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","模数模式设置成功"); 
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
	//console.log("model:"+model)
	// Form.form.findField('channel').setValue(model);
	 Ext.getCmp('channel').down('radio').setValue(model);
}
var group_view_win=Ext.create("Ext.Window",{
	modal:false,
	title:'语音监听[提示：单击组，开启监听；再次单击，取消组监听]',
	width:700,
	height:500,
	autoScroll:true,
	closeAction:'hide',
	html:"<div id='group-view'></div>",
	buttons:[{
		
		text:'关闭窗口',
		iconCls:'close',
		handler:function(){
			group_view_win.close();
	}
	}]
})

function listen(){
	
	
	group_view_store.load();
	group_view_win.show();
	
}
// 设置基站经纬度
function setLngLat(id){
	var Form=Ext.create('Ext.FormPanel',{
		width:300,
		/*fileUpload: true, */
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,	
		items :[{
			xtype:"numberfield",
			fieldLabel:'经度',
			name:'longitude',
			allowDecimals: true,
	        // 这里允许保留4位小数，所以你输入11.996就不会进位了
	        decimalPrecision: 4,
			minValue:1
		},{
			xtype:"numberfield",
			fieldLabel:'纬度',
			allowDecimals: true,
	        // 这里允许保留4位小数，所以你输入11.996就不会进位了
	        decimalPrecision: 4,
			name:'latitude',
			minValue:1
		}]
	})
	var win=Ext.create("Ext.Window",{
		modal:true,
		title:'设置基站-['+id+']经纬度',
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
					url : 'controller/setLngLat.action', 
					params : {  
					 id:id,
					 lng:form.findField('longitude').getValue(),
					 lat:form.findField('latitude').getValue()
				},
				method : 'POST',
   			    waitTitle : '请等待' ,  
   			    waitMsg: '正在提交中', 
   			    success : function(response,opts) { 
					myMask.hide();
				     var rs = Ext.decode(response.responseText)
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","经纬度设置成功"); 
				    	 
				    	 
				    	 
				   	  for(var j=0;j<markers.length;j++){
					
						  if(markers[j].id==id){
							  var record=markers[j].record;
							  var location=new google.maps.LatLng(form.findField('latitude').getValue(),form.findField('longitude').getValue());
							  var bsId=markers[j].id;
							  var title=markers[j].title;
							  var labelContent=markers[j].labelContent;
							  var icon=markers[j].icon;
							  clearMarker(markers[j]);
							  markers.splice(j,1);
							  createMarker(location,bsId,title,labelContent,icon,record);
							  
						  }
					  }
			
				    	 
				    	 
				    	 
				    	 
				    	// store.reload();
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
// 打开基站电源bsGps
function bs_power_flag(id){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
			myMask.show();
			Ext.Ajax.request({
				url : 'controller/bs_power_flag.action', 
				params : {  
				 id:id
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
// 打开基站电源bsGps
function bs_Gps(){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
			myMask.show();
			Ext.Ajax.request({
				url : 'controller/bsGps.action', 
				params : {  
			
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","同步基站GPS成功"); 
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
// 打开基站电源
function bsPowOn(id){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
			myMask.show();
			Ext.Ajax.request({
				url : 'controller/bsPowOn.action', 
				params : {  
				 id:id
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
// 关闭基站电源OneGps
function bsPowOff(id){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
			myMask.show();
			Ext.Ajax.request({
				url : 'controller/bsPowOff.action', 
				params : {  
				 id:id
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
//当前手台GPS
function OneGps(msc,time,btn){
	var type=Ext.getCmp('type').getValue()['type'];
	if(type!=0){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先切换到地图模式" , 
			icon: Ext.MessageBox.INFO  
		}); 
		btn.enable();
		return;
	}
	Ext.Ajax.request({
			url : 'data/OneRadioMaker.action', 
			params : {  
			 msc:msc,
			 endTime:time
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
		     var rs = Ext.decode(response.responseText)
		     /*Ext.getCmp('gpsBtn').enable();*/
		     btn.enable();
		     if(rs.total==0){
		    	 Ext.MessageBox.show({  
		 			title : "提示",  
		 			msg : "无定位数据" , 
		 			icon: Ext.MessageBox.INFO  
		 		}); 
		    	 
		     }else{
		    	 var data=rs.items[0];
		    	 if(data.longitude==0 || data.latitude==0 ){
		    		 Ext.MessageBox.show({  
				 			title : "提示",  
				 			msg : "数据无效" , 
				 			icon: Ext.MessageBox.INFO  
				 		}); 
		    	 }else{
		    		 var image = "";
		    			var wgloc={};
		    			wgloc.lat=data.latitude;
		    			wgloc.lng=data.longitude;
		    			var lat=transformFromWGSToGCJ(wgloc).lat;
		    			var lng=transformFromWGSToGCJ(wgloc).lng;	
		    			var marker = new google.maps.Marker({
		    				position :new google.maps.LatLng(lat,lng),	
		    				map : map,
		    				title : "ID:"+data.srcId,
		    				id : data.id,
		    				data:data,
		    				icon : 'mapfiles/marker5.png',
		    			});
		    			if(mscMarker.length>0){
		    				clearMarker(mscMarker[0]);
		    				mscMarker.splice(0,mscMarker.length);	
		    			}
		    			mscMarker.push(marker);
		    			setMapCenter(lat,lng)
		    	 }
		     }
			     
		    },
		    failure: function(response) {
		    
		    	Ext.example.msg("提示","获取失败"); 
		    	btn.enable();
		    	/*Ext.getCmp('gpsBtn').enable();*/
		      }
		})	
}
//更新4g基站
function bsUpdate(id,linkModel){
	
	if(parseInt(linkModel)!=1){
		Ext.example.msg("提示","非4G基站不能进行操作"); 
		return;
	}
	
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
		myMask.show();
		Ext.Ajax.request({
			url : 'controller/bs_update.action', 
			params : {  
			 id:id
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在处理中', 
		    success : function(response,opts) { 
			myMask.hide();
		     var rs = Ext.decode(response.responseText)
		     
		     if(rs.success){
		    	 Ext.example.msg("提示","4G基站更新成功"); 
		    	 
		     }else{
		    	 Ext.example.msg("提示",rs.message);  
		     }
			     
		    },
		    failure: function(response) {
		    	myMask.hide();
		    	Ext.example.msg("提示","4G基站更新失败");  
		      }
		})	
}
// 基站联网
function bsNetOn(id){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
			myMask.show();
			Ext.Ajax.request({
				url : 'controller/bsNetOn.action', 
				params : {  
				 id:id
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
// 基站断网
function bsNetOff(id){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
			myMask.show();
			Ext.Ajax.request({
				url : 'controller/bsNetOff.action', 
				params : {  
				 id:id
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			     var rs = Ext.decode(response.responseText)
			     
			     if(rs.success){
			    	 Ext.example.msg("提示","基站脱网成功"); 
			    	 
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
// 获取基站状态
function bsAllStatus(){
		 var myMask = new Ext.LoadMask(Ext.getBody(), {  
             msg: '正在操作中。。。',  
             loadMask: true, 
             removeMask: true // 完成后移除
         });
		myMask.show();
			Ext.Ajax.request({
				url : 'controller/BsStatusAll.action', 
				params : {  
				 bsId:-1
			},
			method : 'POST',
			    waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
			    success : function(response,opts) { 
				myMask.hide();
			    var rs = Ext.decode(response.responseText)
				
				  if(rs.success){ Ext.example.msg("提示","获取基站状态成功");
				  store.reload();
				 
				 }else{ Ext.example.msg("提示","获取失败"); }

			    },
			    failure: function(response) {
			    	 myMask.hide();
			    	// Ext.example.msg("提示","获取失败");
			      }
			})	
}
//强拆
function breakCall(){
	
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
	//myMask.show();
	// var record = grid.getSelectionModel().getLastSelected();
	 var record=call_store.getAt(0);
	 var count=call_store.getCount();
	 if(count<1){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "当前没有用户通话，强拆不可用" , 
			 icon: Ext.MessageBox.ERROR 
		 });
		 return;
	 }
	 
	 if(record.get("usetime")>0){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "通话已经结束，不允许强拆" , 
			 icon: Ext.MessageBox.INFO  
		 });
		 return;
	 }
/*	 console.log("caller:"+record.get("caller"));
	 console.log("called:"+record.get("called"));
	 console.log("callid:"+record.get("callid"));*/
	Ext.Ajax.request({
			url : 'controller/breakCall.action', 
			params : {  
				srcid:record.get("srcId"),
				callid:record.get("callid"),
				tarid:record.get("called"),
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
			//myMask.hide(); 
		    var rs = Ext.decode(response.responseText)
			
			  if(rs.success){ Ext.example.msg("提示","强拆已经执行");
			 
			 }else{ Ext.example.msg("提示","强拆失败"); }

		    },
		    failure: function(response) {
		    	// myMask.hide();
		    	// Ext.example.msg("提示","获取失败");
		      }
		})	
}
//强拆2
function breakOtherCall(record){
	
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
       msg: '正在操作中。。。',  
       loadMask: true, 
       removeMask: true // 完成后移除
      });	 
	 if(record.get("usetime")>0){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "通话已经结束，不允许强拆" , 
			 icon: Ext.MessageBox.INFO  
		 });
		 return;
	 }
	Ext.Ajax.request({
			url : 'controller/breakCall.action', 
			params : {  
				srcid:record.get("srcId"),
				callid:record.get("callid"),
				tarid:record.get("called"),
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
			//myMask.hide(); 
		    var rs = Ext.decode(response.responseText)
			
			  if(rs.success){ Ext.example.msg("提示","强拆已经执行");
			 
			 }else{ Ext.example.msg("提示","强拆失败"); }

		    },
		    failure: function(response) {
		    	// myMask.hide();
		    	// Ext.example.msg("提示","获取失败");
		      }
		})	
}
//强拆并遥晕
function breakAndKill(record){
	
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
	/* 
	 var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "请先选中呼叫列表中的记录" , 
				icon: Ext.MessageBox.INFO 
			}); 
			return;
	}
	 var record = grid.getSelectionModel().getLastSelected();
	// var record=call_store.getAt(0);
	 var count=call_store.getCount();
	 if(count<1){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "当前没有用户通话，遥晕不可达" , 
			 icon: Ext.MessageBox.ERROR 
		 });
		 return;
	 }*/
	/* 
	 if(record.get("usetime")<=0){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "正在通话，或者通话时长为0，不允许遥晕手台" , 
			 icon: Ext.MessageBox.INFO  
		 });
		 return;
	 }*/
	 Ext.Msg.confirm("请确认", "是否真的要遥晕该电台", function(button, text) {  
			if (button == "yes") {
				myMask.show();
	 
	 
	 
/*	 console.log("caller:"+record.get("caller"));
	 console.log("called:"+record.get("called"));
	 console.log("callid:"+record.get("callid"));*/
	Ext.Ajax.request({
			url : 'controller/breakAndKill.action', 
			params : {  
				srcid:record.get("srcId"),
				callid:record.get("callid"),
				tarid:record.get("called"),
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
			myMask.hide();
		    var rs = Ext.decode(response.responseText)
			
			  if(rs.success){ Ext.example.msg("提示","已经执行");
			 
			 }else{ Ext.example.msg("提示","失败"); }

		    },
		    failure: function(response) {
		    myMask.hide();
		    	// Ext.example.msg("提示","获取失败");
		      }
		})	
		
			}})
}
// 遥测所有基站
function BsControlAll(){
	Ext.Ajax.request({  
		url : 'controller/bsStatusAll.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		/* alert("success") */
		 bs_status_store.on('beforeload', function (store, options) {  
			    var new_params = { 
			    		id:-1
			    		};  
			    Ext.apply(store.proxy.extraParams, new_params);  

			});
		 bs_status_store.reload();

	},
	failure: function(response) {

	}  
	}); 
	// tabPanel.setActiveTab("tab-controller");
}
function refresh(){
	 bs_status_store.on('beforeload', function (store, options) {  
		    var new_params = { 
		    		id:-1
		    		};  
		    Ext.apply(store.proxy.extraParams, new_params);  

		});
	 bs_status_store.reload();
}
function syncBsControlAll(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
		myMask.show();
	Ext.Ajax.request({  
		url : 'controller/bsStatusAll.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		/* alert("success") */
		myMask.hide();
		 bs_status_store.on('beforeload', function (store, options) {  
			    var new_params = { 
			    		id:-1
			    		};  
			    Ext.apply(store.proxy.extraParams, new_params);  

			});
		 bs_status_store.reload();
	    store.reload();

	},
	failure: function(response) {
		myMask.hide();
	}  
	}); 
}
function updateBsRfup(id){
	Ext.Ajax.request({  
		url : 'controller/updateBsRfup.action',  
		params : {  
			id:id
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success){
			Ext.example.msg("提示","设置成功");
		}else{
			Ext.example.msg("提示","设置失败");
		}

	},
	failure: function(response) {
		Ext.example.msg("提示","设置失败");
	}  
	}); 
}

function updateBsRfupdown(id){
	Ext.Ajax.request({  
		url : 'controller/updateBsRfupdown.action',  
		params : { 
			id:id
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success){
			Ext.example.msg("提示","设置成功");
		}else{
			Ext.example.msg("提示","设置失败");
		}

	},
	failure: function(response) {
		Ext.example.msg("提示","设置失败");
	}  
	}); 
}


function openVoice(group){
	Ext.Ajax.request({  
		url : 'controller/startMonotor.action',  
		params : {  
			tarid:group
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
	},
	failure: function(response) {
	}  
	}); 
}
function closeVoice(group){
	Ext.Ajax.request({  
		url : 'controller/closeMonotor.action',  
		params : {  
			tarid:group
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
    	
	},
	failure: function(response) {
	}  
	}); 
}
// 全网禁发
function AllNetStopSendBtn(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
		myMask.show();
	Ext.Ajax.request({  
		url : 'controller/AllNetStopSendBtnSta.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
    	var rs= Ext.decode(response.responseText); 
    	var btn=Ext.getCmp('stopNet');
    	
    	if(rs.allNetStopSendSwitch==1){
    		CloseAllNetStopSend();
    		// btn.setText("开启全网禁发");
    	}else{
    		OpenAllNetStopSend();
    		// btn.setText("关闭全网禁发");
    	}
    	myMask.hide();
	},
	failure: function(response) {
		myMask.hide();
	}  
	}); 
}
//模拟接入
function moniBtn(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
		myMask.show();
	Ext.Ajax.request({  
		url : 'controller/AllNetStopSendBtnSta.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
    	var rs= Ext.decode(response.responseText); 
    	var btn=Ext.getCmp('moni_on');
    	
    	if(rs.a2denable==1){
    		CloseMoni();
    		console.log("moni0");
    		// btn.setText("开启全网禁发");
    	}else{
    		OpenMoni();
    		console.log("moni1");
    		// btn.setText("关闭全网禁发");
    	}
    	myMask.hide();
	},
	failure: function(response) {
		myMask.hide();
	}  
	}); 
}
// 全网禁发开关
function AllNetStopSendBtnSta(){
	Ext.Ajax.request({  
		url : 'controller/AllNetStopSendBtnSta.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
    	var rs= Ext.decode(response.responseText); 
    	var btn=Ext.getCmp('stopNet');
    	var btn1=Ext.getCmp('moni_on');
    	//moniSwitch
    	if(rs.allNetStopSendSwitch==1){
    		btn.setText('<span style="color:#fff">关闭全网禁发</span>');
    		Ext.getDom('stopNet').style.background = 'red';
    	}else{
    		btn.setText('<span style="color:#fff">开启全网禁发</span>');
    		Ext.getDom('stopNet').style.background = 'green';
    	}
    	if(rs.a2denable==1){
    		btn1.setText('<span style="color:#fff">禁止模拟接入</span>');
    		Ext.getDom('moni_on').style.background = 'green';
    	}else{
    		btn1.setText('<span style="color:#fff">允许模拟接入</span>');
    		Ext.getDom('moni_on').style.background = 'red';
    	}
	},
	failure: function(response) {
	}  
	}); 
}
//允许模拟接入
function OpenMoni(){
	
	Ext.Msg.confirm("请确认", "是否允许模拟接入", function(button, text) {  
		if (button == "yes") {
			Ext.Ajax.request({  
				url : 'controller/OpenMoni.action',  
				params : {  
			},  
			method : 'POST',
			async:false,
		    success : function(response, opts) {  
		    	var rs= Ext.decode(response.responseText); 
		    	var btn=Ext.getCmp('moni_on');
		    	AllNetStopSendBtnSta();
		    	if(rs.success){
		    		Ext.example.msg("提示","开启成功");
		    		
		    	}else{
		    		Ext.example.msg("提示","开启失败");
		    		
		    	}
			},
			failure: function(response) {
			}  
			}); 
		}})
}
//禁止模拟接入
function CloseMoni(){
	
	Ext.Msg.confirm("请确认", "是否禁止模拟接入", function(button, text) {  
		if (button == "yes") {
	Ext.Ajax.request({  
		url : 'controller/CloseMoni.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) { 
    	var rs= Ext.decode(response.responseText); 
    	var btn=Ext.getCmp('moni_on');
    	AllNetStopSendBtnSta();
    	if(rs.success){
    		Ext.example.msg("提示","关闭成功");
    	}else{
    		Ext.example.msg("提示","关闭失败");
    		
    	}
	},
	failure: function(response) {
	}  
	}); 
		}})
}
// 开启全网禁发
function OpenAllNetStopSend(){
	
	Ext.Msg.confirm("请确认", "是否真的要开启全网禁发？", function(button, text) {  
		if (button == "yes") {
			Ext.Ajax.request({  
				url : 'controller/OpenAllNetStopSend.action',  
				params : {  
			},  
			method : 'POST',
			async:false,
		    success : function(response, opts) {  
		    	var rs= Ext.decode(response.responseText); 
		    	var btn=Ext.getCmp('stopNet');
		    	if(rs.success){
		    		Ext.example.msg("提示","开启成功");
		    		AllNetStopSendBtnSta();
		    		store.reload();
		    	}else{
		    		Ext.example.msg("提示","开启失败");
		    		AllNetStopSendBtnSta();
		    	}
			},
			failure: function(response) {
			}  
			}); 
		}})
	
	
	
	
	
}
// 关闭全网禁发
function CloseAllNetStopSend(){
	
	Ext.Msg.confirm("请确认", "是否真的要关闭全网禁发？", function(button, text) {  
		if (button == "yes") {
	Ext.Ajax.request({  
		url : 'controller/CloseAllNetStopSend.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) { 
    	var rs= Ext.decode(response.responseText); 
    	var btn=Ext.getCmp('stopNet');
    	if(rs.success){
    		Ext.example.msg("提示","关闭成功");
    		AllNetStopSendBtnSta();
    		store.reload();
    	}else{
    		Ext.example.msg("提示","关闭失败");
    		AllNetStopSendBtnSta();
    	}
	},
	failure: function(response) {
	}  
	}); 
		}})
}
function player(path){	
		    	
		var playerPath=path	    	
		playerPath=playerPath.substring(1,playerPath.length);

		var index=playerPath.lastIndexOf("/");
		var name=playerPath.substring(index+1,playerPath.length);	
		Ext.get("wav").dom.src = "View/play.jsp?playerID="+playerPath
		/*win = Ext.getCmp("player");

		if (!win) {
			win =new Ext.Window({
				id: 'player',
				title: "....正在播放: &nbsp;",
				width: 410,
				height: 220,
				resizable:false,
				iconCls: 'play',
				closable:true,
				animCollapse: false,
				maximizable : false,
				border: false,
				layout: 'fit',
				plain: true, 

				items: [{
					header:false, 
					html : '<iframe style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; width: 728px; height: 455px; border-right-width: 0px" src="View/play.jsp?playerID='+playerPath+'" frameborder="0" width="100%" scrolling="no" height="100%"></iframe>', 
					border:false 
				}]
			});
		}

		win.show();*/

}
function clearBtn(){
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在删除数据，请稍后！',  
         // loadMask: true,
         removeMask: true // 完成后移除
     });
	 myMask.show();
	Ext.Ajax.request({  
		url : 'controller/ clearConData.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
    	myMask.hide();
    	bs_status_store.reload();
	},
	failure: function(response) {
		myMask.hide();
	}  
	}); 
}
function showGrid(){
	
	controllPanel.expand();
}
// 检查图片是否存在
function CheckImgExists(imgurl) {  
	$('img').error(function(){
       $(this).attr('src', "resources/images/picture/maperror.png");
     });

} 

function toggleBounce() {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
// Adds a marker to the map and push to the array.
function addMarker(location) {
	var marker = new google.maps.Marker({
		position : location,
		map : map
	});
	markers.push(marker);
}
function createMarker(location,bsId,title,labelContent,icon,record){
	  var marker = new MarkerWithLabel({
			position : location,
			map : map,
			title : title,
			id : bsId,
			icon :icon,
			record:record,
			// icon : 'resources/images/picture/police2.png',
			labelContent :labelContent,
			labelAnchor : new google.maps.Point(37, 0),
			labelClass : "marker-label-success", // the CSS class for
			labelStyle : {}
		    // animation: google.maps.Animation.DROP
		});
	  var infoWindow = new google.maps.InfoWindow(); 
	 markers.push(marker);
		var id="1";
		var name="123"
	   
			 var htmlStr='<span id="sd" >ID:'+marker.record.get("bsId")+'</span><br>';
		   htmlStr+='<span >名称:'+marker.record.get("bsName")+'</span><br>';
		   htmlStr+='<span>状态:'+(marker.record.get("online")=="2"?"<span style='color:green'>在线</span>":"<span style='color:red'>离线</span>")+'</span><br>';
		   htmlStr+='<span>信道:'+(marker.record.get("channel_number")=="0"?"- -":marker.record.get("channel_number"))+'</span><br>';
		
     google.maps.event.addListener(marker, "click", function (e) {  
         // Wrap the content inside an HTML DIV in order to set
			// height and width of InfoWindow.
         infoWindow.setContent("<div style = 'width:100px;'>"+htmlStr+"</div>");  
         infoWindow.open(map, marker);  
        
     }); 
	    google.maps.event.addListener(marker, "mousedown", function (e) {  
	         if(e.which==3){
	        	 bsId=marker.id;
	        	/*
				 * var mailMenuData = [ [{text: "遥测当前基站", func: function()
				 * {bsStatus(bsId)}}, {text: "遥测所有基站", func: function()
				 * {BsControlAll()}}], [{text: "打开基站电源", func: function()
				 * {bsPowOn(bsId)}}, {text: "关闭基站电源", func: function()
				 * {bsPowOff(bsId)}}], [{text: "基站联网", func: function()
				 * {bsNetOn(bsId)}}, {text: "基站脱网", func: function()
				 * {bsNetOff(bsId)}}], [{text: "设置信道号", func: function()
				 * {setNum(bsId)}}], [{text: "功率设定", func: function()
				 * {set_power(bsId)}}, {text: "功率标定", func: function()
				 * {bs_power_flag(bsId)}}], [{text: "设置脱网信道", func: function()
				 * {OffLineCh(bsId)}}, {text: "设置模数模式", func: function()
				 * {ADMode(bsId)}}], [{text: "经纬度设置", func: function()
				 * {setLngLat(bsId)}}] ];
				 */
	        	 
	        	 var menu2= [
				    		 [{text: "遥测当前基站", func: function() {bsStatus(bsId)}},
				    		  {text: "遥测所有基站", func: function() {BsControlAll()}}],
				    		  [{text: "打开基站电源", func: function() {bsPowOn(bsId)}},
				    		  {text: "关闭基站电源", func: function() {bsPowOff(bsId)}}],
				    		  [{text: "基站联网", func: function() {bsNetOn(bsId)}},
				    		  {text: "基站脱网", func: function() {bsNetOff(bsId)}}],
				    		  [{text: "设置信道号", func: function() {setNum(bsId)}}],
				    		  
				    		  
				    		  [{text: "功率设定", func: function() {set_power(bsId)}}],
				    		  
				    		  [{text: "基站限制", func: function() {updateBsRfdown(bsId)}}],
				    		  
				    		  
				    		  [{text: "设置模数模式", func: function() {ADMode(bsId)}}],
					    		
					    		
					    		 [{text: "经纬度设置", func: function() {setLngLat(bsId)}}]
				    						 ];
	        	 $(".marker-label-success").smartMenu(menu2);
	        	// Action
         
	         }    	 
	     }); 
	  
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}
function clearMarker(mark){
	mark.setMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}

function drop() {
	for (var i = 0; i < markerArray.length; i++) {
		setTimeout(function() {
			addMarkerMethod();
		}, i * 200);
	}
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
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath=window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return(localhostPaht+projectName);
}
function getCookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
}
// 写cookies
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
var pi = 3.14159265358979324;

//
// Krasovsky 1940
//
// a = 6378245.0, 1/f = 298.3
// b = a * (1 - f)
// ee = (a^2 - b^2) / a^2;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function outOfChina(lat, lon){
    if (lon < 72.004 || lon > 137.8347)
        return 1;
    if (lat < 0.8293 || lat > 55.8271)
        return 1;
    return 0;
}
function transformLat(x,y){
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(x > 0 ? x:-x);
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 *Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
function transformLon(x,y){
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(x > 0 ? x:-x);
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}
function transformFromWGSToGCJ(wgLoc)
{
    var mgLoc ={};
    mgLoc.lat = 0;
    mgLoc.lng = 0;
    if (outOfChina(wgLoc.lat, wgLoc.lng))
    {
        mgLoc = wgLoc;
        return mgLoc;
    }
    var dLat = transformLat(wgLoc.lng - 105.0, wgLoc.lat - 35.0);
    var dLon = transformLon(wgLoc.lng - 105.0, wgLoc.lat - 35.0);

    var radLat = wgLoc.lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    mgLoc.lat = wgLoc.lat + dLat;
    mgLoc.lng = wgLoc.lng + dLon;

    return mgLoc;
}
function setMapCenter(lat,lng){
	var myLatlng = new google.maps.LatLng(lat, lng);
	map.setCenter(myLatlng,9);
	map.setZoom(9);
}
