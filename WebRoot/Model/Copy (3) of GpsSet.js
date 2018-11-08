Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.form.*',
             'Ext.toolbar.Paging',
             'Ext.Action'
             ]		 
);

Ext.define('detm',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'name'}
	      
	        ], 
	        idProperty : 'id'
})

// 用户数据
var store = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscid'},{name:'name'},{name:'timeout'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/gpsTaskList.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var userStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscId'},{name:'name'},{name:'onlinestatus'},{name:'pushgpsen'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/userGps.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var detachmentStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name:'name'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/RadioUserDetm.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var gpsTimerktaskUserStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscid'},{name:'online'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/gpsTimerktaskUserList.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var gpsClockStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'time'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/gpsTimerktaskClockList.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var taskUserStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscid'},{name:'taskId'},{name:'online'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/gpsTaskUserList.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
 // 创建多选
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
var grid=Ext.create('Ext.grid.Panel',{
	title:'勤务管理任务列表',
	region:'center',
	store:taskUserStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[new Ext.grid.RowNumberer({width:30,text:'#'}), 
	         {text: "号码", width: 70, dataIndex: 'mscid'
	         },{text: "状态", width: 40, dataIndex: 'online',
	        	 renderer:function(v){
	        		 if(v==1){return "在线";}else{return "<span style='color:red'>离线</span>"}
	        	 }
	         }/*,{
	        	 text:'<span style="color:green">操作</span>',
	        	 align : 'center',width:50,dataIndex:'taskId',
	        	 renderer:function(v){
	        	 var str="<img src='../resources/images/picture/delete.png'><a href='#' onclick=del_btn()>删除</a>";
	        	 return str;
	         }
	         }*/
	         ],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
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
	         bbar:[{
	        	 xtype:"button",text:"删除手台",iconCls:'delete',handler:del_btn
	         },{
	        	 xtype:"button",text:"刷新",iconCls:'refresh',handler:function(){
	        		 taskUserStore.loadPage(1);
	        	 }
	         }],
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
																 

});
var TimerTaskUserGrid=Ext.create('Ext.grid.Panel',{
	title:"一级任务列表",
	region:'center',
	store:gpsTimerktaskUserStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[new Ext.grid.RowNumberer({width:30,text:'#'}), 
	         {text: "号码", width: 70, dataIndex: 'mscid'
	         },{text: "状态", width: 40, dataIndex: 'online',
	        	 renderer:function(v){
	        		 if(v==1){return "在线";}else{return "<span style='color:red'>离线</span>"}
	        	 }
	         },{
	        	 text:'<span style="color:green">操作</span>',
	        	 align : 'center',width:50,dataIndex:'taskId',
	        	 renderer:function(v){
	        	 var str="<img src='../resources/images/picture/delete.png'><a href='#' onclick=delTimerTaskbtn()>删除</a>";
	        	 return str;
	         }
	         }
	         ],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
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
	         bbar:[{
	        	 xtype:"button",text:"删除手台",iconCls:'delete',handler:delTimerTaskbtn
	         },{
	        	 xtype:"button",text:"刷新",iconCls:'refresh',handler:function(){
	        		 gpsTimerktaskUserStore.loadPage(1);
	        	 }
	         }],
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
																 

})
var usergrid=Ext.create('Ext.grid.Panel',{	
	title:'用户列表',
	margin:'0 3 0 0',
	region:'center',
	store:userStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "号码", width: 80, dataIndex: 'id'
	         },{text: "名称", width: 80, dataIndex: 'name', sortable: true
	         },{text: "状态", width: 50, dataIndex: 'onlinestatus',
	        	 renderer:function(v){
	        		 if(v){return "在线";}
	        		 else{return "<span style='color:red'>离线</span>"}
	        		 
	        	 }
	         },{text: "gps是否禁拉", width: 50, dataIndex: 'pushgpsen',
	        	 renderer:function(v){
	        		 if(v){return "<span class='badge' style='background:red'>是</span>";}
	        		 else{return "否"}
	        		 
	        	 }
	         }
	         ],
	        // plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                    // contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },	 
	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
	         tbar:[{
            	 xtype:'button',
            	 text:'<span style="color:red">手动上拉GPS</span>',
            	 /*margin:'30 0 0 0',*/
            	 /*iconCls:'gpstask',*/
            	 handler:gpsTask
             },/*{
            	 xtype:'button',
            	 text:'<span style="color:green">添加勤务管理任务</span>',
            	 margin:'20 0 0 0',
            	 iconCls:'selfgpstask',
            	 handler:addTask
             },*/{
            	 xtype:'button',
            	 text:'<span style="color:blue">添加一级任务</span>',
            	 /*margin:'20 0 0 0',*/
            	 /*iconCls:'selfgpstask',*/
            	 handler:addTimerTask
             },{
            	 xtype:'button',
            	 text:'<span style="color:#000">电台GPS禁拉</span>',
            	 /*margin:'20 0 0 0',*/
            	 /*iconCls:'selfgpstask',*/
            	 handler:limitGps
             },{
            	 xtype:'button',
            	 text:'<span style="color:#000">解除电台GPS禁拉</span>',
            	 /*margin:'20 0 0 0',*/
            	 /*iconCls:'selfgpstask',*/
            	 handler:notLimitGps
             }],
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{
	 				xtype:'combobox',fieldLabel:'支队',id:'mscType',name:'mscType',labelWidth:30,
		    		store:detachmentStore,
		    		queryMode: "local",
		    		editable: false,
		            displayField: "name",
		            valueField: "id",
		            emptyText: "--请选择--",
		    		width:180
				},{
	 				xtype:'combobox',fieldLabel:'状态',id:'status',name:'status',labelWidth:30,
		    		store:[
		    		       [2,"不限制"],[0,"离线"],[1,"在线"]],
		    		queryMode:'local',value:1,width:110
				},{
	 				xtype:'combobox',fieldLabel:'gps禁拉',id:'pushgpsen',name:'pushgpsen',labelWidth:60,
		    		store:[
		    		       [2,"不限制"],[1,"禁拉"],[0,"不禁拉"]],
		    		queryMode:'local',value:2,width:140
				}]
         },{
             xtype: 'toolbar',
             dock: 'top',
             items: [{
				xtype:'numberfield',name:'mscId',id:'mscId',fieldLabel:'号码',labelWidth:30,width:130
			},{
            	 xtype:'button',
            	 text:'查询',
            	 iconCls:'search',
            	 handler:function(){userStore.reload()}
             }]
     },{
             dock: 'bottom',
             xtype: 'pagingtoolbar',
             store: userStore, 
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

});
var taskUserGrid=Ext.create('Ext.grid.Panel',{	
	region:'center',
	store:taskUserStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[{text: "任务ID", width: 100, dataIndex: 'taskId'
	         },{text: "手台", flex:1, dataIndex: 'mscid'
	         }],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
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
	         dockedItems: [/*
							 * { xtype: 'toolbar', dock: 'top', items: [{
							 * xtype:'button', text:'删除任务', iconCls:'delete',
							 * handler:del_btn }] }
							 */]

});
var gpsClockGrid=Ext.create('Ext.grid.Panel',{
	region:'center',
	store:gpsClockStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[{text: "时间段", width: 100, dataIndex: 'time'},
	         {
   	          text:'<span style="color:green">操作</span>',
   	          align : 'center',width:100,dataIndex:'taskId',
   	          renderer:function(v){
   	          var str="<img src='../resources/images/picture/delete.png'><a href='#' onclick=delGpsClock()>删除</a>";
   	          return str;
              }
             }],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
	         viewConfig: {
	             stripeRows: true,
	             
	         },	        
	         dockedItems: [/*
							 * { xtype: 'toolbar', dock: 'top', items: [{
							 * xtype:'button', text:'删除任务', iconCls:'delete',
							 * handler:del_btn }] }
							 */]

});

userStore.on('beforeload', function (store, options) {  
    var new_params = { 
    		mscType:Ext.getCmp("mscType").getValue(),
    		mscId:Ext.getCmp("mscId").getValue(),
    		online:Ext.getCmp("status").getValue(),
    		pushgpsen:Ext.getCmp("pushgpsen").getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
detachmentStore.on('load', function (s, options) {  
	var ins_rec = Ext.create('detm',{
	      id:0,
	      name:'===全部==='
	    }); 
	    s.insert(0,ins_rec);
	    Ext.getCmp("mscType").setValue(0);
});

var leftPanel=Ext.create('Ext.form.Panel',{
	region:'north',
	height:230,
	margin:'0 3 0 0',
	border:false,
	autoScrool:true,
	items:[{
		xtype:'panel',title:'操作',frame:false,border:0,
		height:220,
		layout:'column',
		items:[{
			xtype:'fieldset',title:'方式',margin:'0 3 0 3',
			items:[{xtype:'radiogroup',fieldLabel:'',name:'type',checked:true,labelWidth:10,layout:'form',
				listeners:{
				'change':function(){
				      var type=leftPanel.getForm().findField('type').getValue()['type'];
				      if(type==4 || type==5){
				    	 
				    	  Ext.getCmp('t_interval').enable();
				    	  Ext.getCmp('d_index').enable();
				      }else{
				    	  Ext.getCmp('t_interval').disable();
				    	  Ext.getCmp('d_index').disable();
				      }
			     }
			    },
				items: [
			            { boxLabel: '立即发送(查询)', name:'type', inputValue:0,checked: true,margin:'0 10 0 0' },
			            { boxLabel: '开机触发', name:'type', inputValue:1,margin:'0 10 0 0'},
			            { boxLabel: '关机触发', name:'type', inputValue:2,margin:'0 10 0 0'},
			            { boxLabel: '开关机触发', name:'type', inputValue:3,margin:'0 10 0 0'},
			            { boxLabel: '时间或距离任一满足触发', name:'type', inputValue:4,margin:'0 10 0 0'},
			            { boxLabel: '时间或距离同时满足触发', name:'type', inputValue:5,margin:'0 10 0 0'}
			]}]
		},{
			xtype:'fieldset',title:'其他',margin:'0 10 0 10',
			items:[{
				xtype:'checkbox',fieldLabel:'上报GPS',name:'gpsen',boxLabel:'是',checked:true,labelWidth:80
			},{xtype:'numberfield',fieldLabel:'时隙',name:'slot',width:160,labelWidth:80,minValue:0,maxValue:1,value:0},
			{
				layout:'column',border:false,items:[{
				xtype:'numberfield',fieldLabel:'时间间隔',id:'t_interval',name:'t_interval',emptyText:'0:无效',
				labelWidth:80,width:170,minValue:0,maxValue:10801,disabled:true,
				listeners:{
					'blur':function(){
					      var time=leftPanel.getForm().findField('t_interval').getValue();
					     if( time!=null && time_index(time)==-1){
					    	 Ext.MessageBox.show({  
					    			title : "提示",  
					    			left:0,
					    			msg : "时间间隔范围区间不正确,正确区间：<br>" +
					    					"1-30秒<br>"+"62-100秒<br>"+"153-240秒<br>"+"405-500秒<br>"+
					    					"1010-1100秒<br>"+" 3330-3750秒<br>"+"7200s秒<br>"+"10800s秒<br>" , 
					    			icon: Ext.MessageBox.ERROR  
					    		});
					     }
				     }
				    }
			},{
				border:false,margin:'3 0 0 20',stlye:'cursor:pointer',
				html:"<a href='#' onclick='tooltip()'><img src='../resources/images/btn/info.png'/> </a>"
			}]
			},{
				xtype:'combobox',fieldLabel:'距离间隔',id:'d_index',name:'d_index',labelWidth:80,disabled:true,
	    		store:[
	    		       [0,'无效'],
	    		       [1,'5米'],
	    		       [2,'10米'],
	    		       [3,'30米'],
	    		       [4,'60米'],
	    		       [5,'120米'],
	    		       [6,'220米'],
	    		       [7,'350米'],
	    		       [8,'500米'],
	    		       [9,'700米'],
	    		       [10,'1000米'],
	    		       [11,'1300米'],
	    		       [12,'1700米'],
	    		       [13,'2200米'],
	    		       [14,'2800米'],
	    		       [15,'3500米']],
	    		queryMode:'local',value:0,width:170,margin:'3 0 3 0'
			},/*{
				xtype:'radiogroup',fieldLabel:'上拉信道 ',name:'pool_ch',checked:true,labelWidth:80,layout:'column',margin:'0 0 10 0',
				items: [
			            { boxLabel: '控制信道', name:'pool_ch', inputValue: '0',checked: true },
			            { boxLabel: '业务信道', name:'pool_ch', inputValue: '1'}
			        ]
			},*/{
				xtype:'combobox',fieldLabel:'GPS格式',name:'format',
				labelWidth:80,
	    		store:[[0,'控制信道短格式'],
	    		       [1,'控制信道长格式'],
	    		       [2,'业务信道C_GPSU格式'],
	    		       [3,'业务信道C_GPS2U格式'],
	    		       [4,'业务信道C_GPS3U格式']],
	    		queryMode:'local',value:0,width:250
			}]
		}/*,{
			xtype:'fieldset',title:'时隙',margin:'0 3 0 3',
			items:[{xtype:'numberfield',fieldLabel:'',name:'slot',width:100,labelWidth:10,margin:'0 0 10 0',minValue:0,maxValue:1,value:0}]
		}*/]
	}]
	
});
var right_leftPanel=Ext.create('Ext.Panel',{
	title:'GPS任务',
	region:'east',
	width:700,
	layout:'border',
	bodyCls:'',
	bodyStyle:'background:#fff;',
	border:false,
	
	items:[{
		xtype:'panel',border:false,region:'north',margin:1,height:50,
	   	bodyStyle:'background:#fff;',
	   	items:[{
	   		xtype:'panel',
	   		layout:"column",
	   		margin:'10 0 0 0',
	   		border:0,
	   		items:[
		    	 {xtype:'numberfield',fieldLabel:'间隔时间（毫秒）',width:260,labelWidth:140,id:'eachTime',value:500,minValue:1
	             },{fieldLabel:'结束时间',
	 		    	xtype:'datetimefield',
			    	id:'Etime',
			    	name:'Etime',
			    	format:'Y-m-d H:i:s',
			    	margin:'0 0 0 20',
			        labelWidth: 60,
			        width:220
			     }
		    	 ]
	   	}/*,{
	   		xtype:'panel',
	   		layout:"column",
	   		margin:'10 0 0 0',
	   		border:0,
	   		items:[{
	   			xtype:'displayfield',fieldLabel:'任务总开关'
	   		},
	   		{xtype:"button", text:"开始", iconCls:'start', handler:taskOpen},
	        {xtype:"button", text:"停止", iconCls:'stop', handler:taskClose, margin:'0 0 0 10'},
	        {xtype:"displayfield",id:"gpsTaskOpen",labelWidth:60,
		    	 fieldLabel:"<span style='color:red;font-weight:bold'>运行状态</span>",margin:'0 0 10 60'}
		    	 ]
	   	}*/]
	},{
		xtype:'panel',border:false,layout:'border',region:'north',margin:1,height:240,
	   	bodyStyle:'background:#fff;',
	   	items:[grid,{
		    xtype:"panel",width:220,border:true,margin:'0 0 0 2',title:'勤务管理设置',region:'east',
			items:[{layout:'column',border:false,margin:'5 0 5 0',
			     items:[{xtype:'numberfield',fieldLabel:'循环时间（秒）',width:210,labelWidth:140,id:'gpsTaskTime',value:1,minValue:5
		             }/*,{xtype:"button", text:"更新时间",iconCls:'update',handler:save, margin:'0 0 0 10'
		             }*/]
			 },,{xtype:"displayfield",id:"dateRunStatus",labelWidth:60,
		    	 fieldLabel:"<span style='color:red;font-weight:bold'>运行状态</span>",margin:'0 0 10 0'},
		     {layout:'column',border:false,
		    	 items:[
		                             {xtype:"button", text:"开始", iconCls:'start', handler:startDateTask, margin:'10 0 10 10'},
		                             {xtype:"button", text:"停止", iconCls:'stop', handler:stopDateTask, margin:'10 0 10 10'}]
             }]
        }]
	},{
   	 xtype:'panel',border:false,layout:'border',region:'center',margin:1,
   	 bodyStyle:'background:#fff;',
	 items:[TimerTaskUserGrid,{
       	 xtype:"panel",width:220,border:true,layout:'border',
       	 margin:'0 0 0 2',title:'一级任务设置',region:"east",
    	 items:[{
    		 xtype:"panel",region:"north",height:160,
    		 items:[{xtype:'numberfield',fieldLabel:'循环时间（秒）',width:210,labelWidth:140,id:'emergTaskTime',value:500,minValue:3
             },{xtype:"displayfield",id:"timerRunStatus",labelWidth:60,
            	 fieldLabel:"<span style='color:red;font-weight:bold'>运行状态</span>",margin:'0 0 0 0'},
             {layout:'column',border:false,
    	    	 items:[{xtype:"button", text:"开始", iconCls:'start', handler:startTimerTask, margin:'10 0 10 10'},
    	                {xtype:"button", text:"停止", iconCls:'stop', handler:stopTimerTask, margin:'10 0 10 10'}]
        }]
    	 }]
	 
	 }]
 }]
});
var left=Ext.create('Ext.Panel',{
	region:'center',
	layout:'border',
	bodyCls:'panel-panel',
	border:false,
	items:[leftPanel,usergrid]
	
});
var rightPanel=Ext.create('Ext.Panel',{
	region:'center',
	layout:'border',
	bodyCls:'panel-panel',
	border:false,
	items:[right_leftPanel]
	
})
var m_userName="无";
var m_groupName="";
Ext.onReady(function () { 
	new Ext.Viewport({
		layout:'border',
		baseCls:'main-panel',
		baseStyle:'background:#fff;',
		renderTo:Ext.getBody(),
		items:[left,right_leftPanel]
	})
	userStore.load({params:{start:0,limit:500}}); 
	// store.load();
	detachmentStore.load();
	taskUserStore.load();
	gpsTimerktaskUserStore.load();
	gpsClockStore.load();
	
	loadConfig();
	
	
})
function loadConfig(){
	Ext.Ajax.request({
		url:'../data/loadGpsXML.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		if(str.success){
			Ext.getCmp('gpsTaskTime').setValue(str.gpsTaskTime);
			Ext.getCmp('eachTime').setValue(str.eachTime);
			Ext.getCmp('emergTaskTime').setValue(str.emergTaskTime);
			if(str.gpsTimerTaskStart){
				Ext.getCmp('timerRunStatus').setValue("运行中..");
			}else{
				Ext.getCmp('timerRunStatus').setValue("未运行");
			}
			if(str.gpsDateTaskStart){
				Ext.getCmp('dateRunStatus').setValue("运行中..");
			}else{
				Ext.getCmp('dateRunStatus').setValue("未运行");
			}
			/*if(str.gpsTaskOpen){
				Ext.getCmp('gpsTaskOpen').setValue("运行中..");
			}else{
				Ext.getCmp('gpsTaskOpen').setValue("未运行");
			}*/
			//Ext.getCmp('Ftime').setValue(str.gpsTaskDate1);
			Ext.getCmp('Etime').setValue(str.gpsTaskDate2);
		}else{
			Ext.MessageBox.show({
				title:'提示',
				msg:'加载配置文件失败',
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
function save(){
	if(Ext.getCmp('gpsTaskTime').getValue()<1){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "时间必须大于1s" , 
			 icon: Ext.MessageBox.ERROR
		 }); 
		 return;
	}
   Ext.Ajax.request({  
				 url : '../data/updateGpsXML.action',  
				 params : {				 			 
				 gpsTaskTime:Ext.getCmp('gpsTaskTime').getValue()
			 },  
			 method : 'POST',			        			 
			 success : function(response) { 
				 
				 loadConfig();
				 Ext.example.msg("提示","修改成功"); 
			 },
			 failure: function(response) {
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "修改失败" , 
					 icon: Ext.MessageBox.ERROR  
				 }); 
			 }  
			 })	
}

// 删除数据
function del_btn() {  
	var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.ERROR 
		});  
		return;  
	} else {  
		record = grid.getSelectionModel().getLastSelected(); 
		var ids = [];  
		Ext.Array.each(data, function(record) {  
			var userId=record.get('mscid');  
			// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
			if(userId){ids.push(userId);}  

		});
		
		Ext.Ajax.request({
			url : '../controller/delGpsTask.action', 
			params : { 
				deleteIds:ids.join(",")
			// taskId:record.get("taskId")
		},
		    method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
		     var rs = Ext.decode(response.responseText)		     
		     if(rs.success){
		    	 Ext.example.msg("提示","删除任务成功"); 
		    	 taskUserStore.reload();
		     }else{
		    	 Ext.MessageBox.show({  
   					 title : "提示",  
   					 msg : "失败", 
   					 icon: Ext.MessageBox.ERROR 
   				 }); 
		     }    
		    },
		    failure: function(response) {
		    	Ext.example.msg("提示","失败");  
		   }
		})	
	 }  
}
function delTimerTaskbtn() {  
	var data = TimerTaskUserGrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.ERROR 
		});  
		return;  
	} else {  
		record = TimerTaskUserGrid.getSelectionModel().getLastSelected(); 
		var ids = [];  
		Ext.Array.each(data, function(record) {  
			var userId=record.get('mscid');  
			// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
			if(userId){ids.push(userId);}  

		});
		
		Ext.Ajax.request({
			url : '../data/delTimerTask.action', 
			params : { 
				deleteIds:ids.join(",")
			// taskId:record.get("taskId")
		},
		    method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
		     var rs = Ext.decode(response.responseText)		     
		     if(rs.success){
		    	 Ext.example.msg("提示","删除任务成功"); 
		    	 gpsTimerktaskUserStore.reload();
		     }else{
		    	 Ext.MessageBox.show({  
   					 title : "提示",  
   					 msg : "失败", 
   					 icon: Ext.MessageBox.ERROR 
   				 }); 
		     }    
		    },
		    failure: function(response) {
		    	Ext.example.msg("提示","失败");  
		   }
		})	
	 }  
}

// 获取用户名
function getUserName(srcId){
	Ext.Ajax.request({  
		url : '../../adddgna/getUserName.action',  
		params : {  
		issi:srcId
	},  
	method : 'POST',
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			$("#userlist").empty();
			Ext.Array.each(rs.userName, function(record){
				$(".user ul").append('<li>'+record.C_ID+'/'+record.E_name+'</li>');
			})
		}
		else{}

	},
	failure: function(response) {}  
	});
}
// 发送数据mscId,srcId,dstId,groupname,attached,cou,operation,status
function sendGpsSet(number){
	var leftForm=leftPanel.getForm();
	var poolch=0;
	if(leftForm.findField('format').getValue()==0 || leftForm.findField('format').getValue()==1){
		poolch=0;
	}else{
		poolch=1;
	}
	Ext.Ajax.request({  
		url : '../controller/setGps.action',  
		params : { 
		/* ig:leftForm.findField('ig').getValue()['ig'], */
		number:number,
		gpsen:leftForm.findField('gpsen').getValue()?1:0,
		type:leftForm.findField('type').getValue()['type'],
		t_interval: time_index(leftForm.findField('t_interval').getValue())==-1?0:time_index(leftForm.findField('t_interval').getValue()),
		d_index:leftForm.findField('d_index').getValue(),
		pool_ch:poolch,
		format:leftForm.findField('format').getValue(),
		slot:leftForm.findField('slot').getValue(),
		mask:userPanel.form.findField('').getValue()
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
// myMask.hide();
		// 当后台数据同步成功时
		if(rs.success)
		{
// Ext.example.msg("提示",rs.message);
			successId=true;
			message=rs.message;
			
		}
		else
		{ 
// Ext.example.msg("提示","error");
			successId=false;
			message=rs.message;
		}

	},
	failure: function(response) {successId=false;}  
	});
	return successId;
}

function time_index(time){
	// 时间间隔
	// 数值n 时间（s）
	// 0 时间触发无效
	// 1-30 *n s 1-30
	// 31-50 *2s 62-100
	// 51-80 *3s 153-240
	// 81-100 *5s 405-500
	// 101-110 *10s 1010-1100
	// 111-125 *30s 3330-3750
	// 126 7200s
	// 127 10800s
	if(time==0){
		return 0;
	}
	if(time>=1 && time<=30){
		return time;
	}
	else if(time>=62 && time<=100){
		return Math.round(time/2);
	}
	else if(time>=153 && time<=240){
		return Math.round(time/3);
	}
	else if(time>=405 && time<=500){
		return Math.round(time/5);
	}
	else if(time>=1010 && time<=1100){
		return Math.round(time/10);
	}
	else if(time>=3330 && time<=3750){
		return Math.round(time/30);
	}
	else if(time==7200){
		return 126;
	}
	else if(time==10800){
		return 127;
	}
	else{
		return -1;
	}
	
}
function tooltip(){
	 Ext.MessageBox.show({  
			title : "提示",  
			left:0,
			msg : "时间间隔范围区间：<br>" +
					"1-30秒<br>"+"62-100秒<br>"+"153-240秒<br>"+"405-500秒<br>"+
					"1010-1100秒<br>"+" 3330-3750秒<br>"+"7200s秒<br>"+"10800s秒<br>" , 
			icon: Ext.MessageBox.INFO
		});
}
// 添加自动任务
function addTask(){
	var type=leftPanel.getForm().findField('type').getValue()['type'];
	if(type!=0){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "目前操作方式只支持 “立即发送”" , 
			icon: Ext.MessageBox.ERROR
		});  
		return; 
	}
	var data = usergrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没选择手台" , 
			icon: Ext.MessageBox.ERROR
		});  
		return;  
	}
	var ids = [];  
	Ext.Array.each(data, function(record) {  
		var userId=record.get('id');  
		// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
		if(userId){ids.push(userId);}  

	});
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在操作中。。。',  
         loadMask: true, 
         removeMask: true // 完成后移除
     });
	myMask.show();
	var poolch=0;
	if(leftPanel.getForm().findField('format').getValue()==0 || leftForm.findField('format').getValue()==1){
		poolch=0;
	}else{
		poolch=1;
	}
	Ext.Ajax.request({
		url : '../controller/addTask.action', 
		params : { 
		 mscId:ids.join(","),
		 gpsen:leftPanel.getForm().findField('gpsen').getValue()?1:0,
		 type:leftPanel.getForm().findField('type').getValue()['type'],
		 t_interval: time_index(leftPanel.getForm().findField('t_interval').getValue())==-1?0:time_index(leftForm.findField('t_interval').getValue()),
		 d_index:leftPanel.getForm().findField('d_index').getValue(),
		 pool_ch:poolch,
		 format:leftPanel.getForm().findField('format').getValue(),
		 slot:leftPanel.getForm().findField('slot').getValue(),
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
		myMask.hide();
	     var rs = Ext.decode(response.responseText)
	     
	     if(rs.success){
	    	 // store.reload()
	    	 // win.hide();
	    	 taskUserStore.reload();
	     }else{
	    	 Ext.example.msg("提示",rs.message);  
	     }
	    
	     
	   
		     
	    },
	    failure: function(response) {
	    	myMask.hide();
	    	Ext.example.msg("提示","失败");  
	      }
	});
	
}
//添加定时自动任务
function addTimerTask(){
	var type=leftPanel.getForm().findField('type').getValue()['type'];
	if(type!=0){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "目前操作方式只支持 “立即发送”" , 
			icon: Ext.MessageBox.ERROR
		});  
		return; 
	}
	var data = usergrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没选择手台" , 
			icon: Ext.MessageBox.ERROR
		});  
		return;  
	}
	var ids = [];  
	Ext.Array.each(data, function(record) {  
		var userId=record.get('id');  
		// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
		if(userId){ids.push(userId);}  

	});
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在操作中。。。',  
         loadMask: true, 
         removeMask: true // 完成后移除
     });
	myMask.show();
	var poolch=0;
	if(leftPanel.getForm().findField('format').getValue()==0 || leftForm.findField('format').getValue()==1){
		poolch=0;
	}else{
		poolch=1;
	}
	Ext.Ajax.request({
		url : '../data/addGpsTimerTask.action', 
		params : { 
		 mscId:ids.join(","),
		 gpsen:leftPanel.getForm().findField('gpsen').getValue()?1:0,
		 type:leftPanel.getForm().findField('type').getValue()['type'],
		 t_interval: time_index(leftPanel.getForm().findField('t_interval').getValue())==-1?0:time_index(leftForm.findField('t_interval').getValue()),
		 d_index:leftPanel.getForm().findField('d_index').getValue(),
		 pool_ch:poolch,
		 format:leftPanel.getForm().findField('format').getValue(),
		 slot:leftPanel.getForm().findField('slot').getValue(),
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
		myMask.hide();
	     var rs = Ext.decode(response.responseText)
	     
	     if(rs.success){
	    	 gpsTimerktaskUserStore.reload();
	    	 taskUserStore.reload();
	     }else{
	    	 Ext.example.msg("提示",rs.message);  
	     }    
	    },
	    failure: function(response) {
	    	myMask.hide();
	    	Ext.example.msg("提示","失败");  
	      }
	});
	
}
//手动上拉
function gpsTask(){
	var type=leftPanel.getForm().findField('type').getValue()['type'];
	if(type!=0){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "目前操作方式只支持 “立即发送”" , 
			icon: Ext.MessageBox.ERROR
		});  
		return; 
	}
	var data = usergrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没选择手台" , 
			icon: Ext.MessageBox.ERROR
		});  
		return;  
	}
	var ids = [];  
	Ext.Array.each(data, function(record) {  
		var userId=record.get('id');  
		// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
		if(userId){ids.push(userId);}  

	});
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在上拉手台gps，每个手台上拉时间间隔500毫秒，请耐心等待',  
         loadMask: true, 
         removeMask: true // 完成后移除
     });
	myMask.show();
	ClearPhoneMarker();
	var poolch=0;
	if(leftPanel.getForm().findField('format').getValue()==0 || leftForm.findField('format').getValue()==1){
		poolch=0;
	}else{
		poolch=1;
	}
	Ext.Ajax.request({
		url : '../controller/gpsTask.action', 
		params : { 
		 mscId:ids.join(","),
		 gpsen:leftPanel.getForm().findField('gpsen').getValue()?1:0,
		 type:leftPanel.getForm().findField('type').getValue()['type'],
		 t_interval: time_index(leftPanel.getForm().findField('t_interval').getValue())==-1?0:time_index(leftForm.findField('t_interval').getValue()),
		 d_index:leftPanel.getForm().findField('d_index').getValue(),
		 pool_ch:poolch,
		 format:leftPanel.getForm().findField('format').getValue(),
		 slot:leftPanel.getForm().findField('slot').getValue(),
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
		myMask.hide();
	     var rs = Ext.decode(response.responseText)
	     
	     if(rs.success){
	    	 // store.reload()
	    	 // win.hide();
	    	 taskUserStore.reload();
	     }else{
	    	 
	    	 Ext.MessageBox.show({  
	 			title : "提示",  
	 			msg : rs.message , 
	 			icon: Ext.MessageBox.ERROR
	 		}); 
	     }
	    
	     
	   
		     
	    },
	    failure: function(response) {
	    	myMask.hide();
	    	Ext.example.msg("提示","失败");  
	      }
	});
	
}
//添加定时时钟
function addGpsClock(){
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在操作中。。。',  
         loadMask: true, 
         removeMask: true // 完成后移除
     });
	myMask.show();
	Ext.Ajax.request({
		url : '../data/addGpsClock.action', 
		params : { 
		clock:Ext.getCmp('time').getValue()
		},
	    method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
		myMask.hide();
	     var rs = Ext.decode(response.responseText)
	     
	     if(rs.success){
	    	 gpsClockStore.reload();
	     }else{
	    	 Ext.example.msg("提示","添加失败");  
	     }    
	    },
	    failure: function(response) {
	    	myMask.hide();
	    	Ext.example.msg("提示","失败");  
	      }
	});
	
}
//删除定时时钟
function delGpsClock() {  
 
		var record =gpsClockGrid.getSelectionModel().getLastSelected(); 
		var ids = [];  
		
		Ext.Ajax.request({
			url : '../data/delGpsClock.action', 
			params : { 
				clock:record.get("time")
			// taskId:record.get("taskId")
		},
		    method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
		     var rs = Ext.decode(response.responseText)		     
		     if(rs.success){
		    	 Ext.example.msg("提示","删除成功"); 
		    	 gpsClockStore.reload();
		     }else{
		    	 Ext.MessageBox.show({  
   					 title : "提示",  
   					 msg : "失败", 
   					 icon: Ext.MessageBox.ERROR 
   				 }); 
		     }    
		    },
		    failure: function(response) {
		    	Ext.example.msg("提示","失败");  
		   }
		})	 
}
//开始任务
function taskOpen() {  
	Ext.Ajax.request({
		url : '../data/taskOpen.action', 
		params : { 
	    },
	    method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText)		     
	     if(rs.success){
	    	 Ext.example.msg("提示","开启成功"); 
	    	 loadConfig();
	     }else{
	    	 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "失败", 
					 icon: Ext.MessageBox.ERROR 
				 }); 
	     }    
	    },
	    failure: function(response) {
	    	Ext.example.msg("提示","失败");  
	   }
	})	 
}
//停止任务
function taskClose() {  
	Ext.Ajax.request({
		url : '../data/taskClose.action', 
		params : { 
	    },
	    method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText)		     
	     if(rs.success){
	    	 Ext.example.msg("提示","关闭成功"); 
	    	 loadConfig();
	     }else{
	    	 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "失败", 
					 icon: Ext.MessageBox.ERROR 
				 }); 
	     }    
	    },
	    failure: function(response) {
	    	Ext.example.msg("提示","失败");  
	   }
	})	 
}
//开始时间段任务
function startDateTask() {  
	var nowTime=parseInt(new Date().getTime());
	var time=parseInt(new Date(Ext.getCmp('Etime').getValue()).getTime());
	if(Ext.getCmp('Etime').getValue()=="" ){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "结束时间不能为空", 
			 icon: Ext.MessageBox.ERROR 
		 }); 
		return;
	}
	if(time<nowTime){
		Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "结束时间必须大于当前时间", 
			 icon: Ext.MessageBox.ERROR 
		 }); 
		return;
	}
	if(Ext.getCmp('eachTime').getValue()<300 ){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "间隔时间不能小于300毫秒", 
			 icon: Ext.MessageBox.ERROR 
		 }); 
		return;
	}
	//ClearPhoneMarker();
	Ext.Ajax.request({
		url : '../data/startDateTask.action', 
		params : { 
			gpsTaskTime:Ext.getCmp('gpsTaskTime').getValue(),
			emergTaskTime:Ext.getCmp('emergTaskTime').getValue(),
			gpsTaskDate2:Ext.getCmp('Etime').getValue(),
			eachTime:Ext.getCmp('eachTime').getValue()
	    },
	    method : 'POST',
	    waitTitle : '请等待',  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText)		     
	     if(rs.success){
	    	 Ext.example.msg("提示","开启成功"); 
	    	 loadConfig();
	     }else{
	    	 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "失败", 
					 icon: Ext.MessageBox.ERROR 
				 }); 
	     }    
	    },
	    failure: function(response) {
	    	Ext.example.msg("提示","失败");  
	   }
	})	 
}
//停止时间段任务
function stopDateTask() {  	
	Ext.Ajax.request({
		url : '../data/stopDateTask.action', 
		params : { 
	    },
	    method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText)		     
	     if(rs.success){
	    	 Ext.example.msg("提示","停止成功"); 
	    	 loadConfig();
	     }else{
	    	 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "失败", 
					 icon: Ext.MessageBox.ERROR 
				 }); 
	     }    
	    },
	    failure: function(response) {
	    	Ext.example.msg("提示","失败");  
	   }
	})	 
}
//开始执行定时gps任务
function startTimerTask() {  
	var nowTime=parseInt(new Date().getTime());
	var time=parseInt(new Date(Ext.getCmp('Etime').getValue()).getTime());
	if(Ext.getCmp('Etime').getValue()=="" ){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "结束时间不能为空", 
			 icon: Ext.MessageBox.ERROR 
		 }); 
		return;
	}
	if(time<nowTime){
		Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "结束时间必须大于当前时间", 
			 icon: Ext.MessageBox.ERROR 
		 }); 
		return;
	}
	if(Ext.getCmp('eachTime').getValue()<300 ){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "间隔时间不能小于300毫秒", 
			 icon: Ext.MessageBox.ERROR 
		 }); 
		return;
	}
	Ext.Ajax.request({
		url : '../data/startTimerTask.action', 
		params : { 
			gpsTaskTime:Ext.getCmp('gpsTaskTime').getValue(),
			emergTaskTime:Ext.getCmp('emergTaskTime').getValue(),
			gpsTaskDate2:Ext.getCmp('Etime').getValue(),
			eachTime:Ext.getCmp('eachTime').getValue()
	    },
	    method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText)		     
	     if(rs.success){
	    	 Ext.example.msg("提示","开启成功"); 
	    	 loadConfig();
	     }else{
	    	 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "失败", 
					 icon: Ext.MessageBox.ERROR 
				 }); 
	     }    
	    },
	    failure: function(response) {
	    	Ext.example.msg("提示","失败");  
	   }
	})	 
}
//停止执行定时gps任务
function stopTimerTask() {  	
	Ext.Ajax.request({
		url : '../data/stopTimerTask.action', 
		params : { 
	    },
	    method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response,opts) { 
	     var rs = Ext.decode(response.responseText)		     
	     if(rs.success){
	    	 Ext.example.msg("提示","停止成功"); 
	    	 loadConfig();
	     }else{
	    	 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "失败", 
					 icon: Ext.MessageBox.ERROR 
				 }); 
	     }    
	    },
	    failure: function(response) {
	    	Ext.example.msg("提示","失败");  
	   }
	})	 
}
function ClearPhoneMarker(){
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中。。。',  
        loadMask: true, 
        removeMask: true // 完成后移除
    });
		myMask.show();
		Ext.Ajax.request({
			url : '../controller/ClearPhoneMarker.action', 
			params : {  
		
		},
		method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
			myMask.hide();
		     var rs = Ext.decode(response.responseText)
		     
		    /* if(rs.success){
		    	 Ext.example.msg("提示","清空地图标记成功"); 
		     }else{
		    	 Ext.MessageBox.show({  
  					 title : "提示",  
  					 msg : "清空地图标记失败", 
  					 icon: Ext.MessageBox.INFO  
  				 }); 
		     }*/
			     
		    },
		    failure: function(response) {
		    	/*myMask.hide();
		    	Ext.example.msg("提示","失败"); */ 
		      }
		})	
}
function limitGps() {  
	var data = usergrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.WARNING
		});  
		return;  
	} else {  
		Ext.Msg.confirm("请确认", "是否真的要屏蔽手台，车载台gps信息", function(button, text) {  
			if (button == "yes") {  
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('id');  
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在操作中，请稍后！',  
                     //loadMask: true, 
                     removeMask: true //完成后移除  
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/addMscId.action',  
					params : {  
					deleteIds : ids.join(',') 
				},  
				method : 'POST',
				waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
				success : function(response, opts) {  
					myMask.hide();
					var success = Ext.decode(response.responseText).success; 
					// 当后台数据同步成功时  
					if (success) {  
						Ext.example.msg("提示","屏蔽成功");
						userStore.reload();
						gpsTimerktaskUserStore.reload();
						taskUserStore.reload();

					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "屏蔽失败!" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},
				 failure: function(response) {
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!", 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
function notLimitGps() {  
	var data = usergrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.WARNING
		});  
		return;  
	} else {  
		Ext.Msg.confirm("请确认", "是否真的要取消屏蔽", function(button, text) {  
			if (button == "yes") {  
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('id');  
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在操作中，请稍后！',  
                     //loadMask: true, 
                     removeMask: true //完成后移除  
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/delMscId.action',  
					params : {  
					deleteIds : ids.join(',') 
				},  
				method : 'POST',
				waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
				success : function(response, opts) {  
					myMask.hide();
					var success = Ext.decode(response.responseText).success; 
					// 当后台数据同步成功时  
					if (success) {  
						Ext.example.msg("提示","取消屏蔽成功");
						userStore.reload();
						gpsTimerktaskUserStore.reload();
						taskUserStore.reload();
					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "取消屏蔽失败!" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},
				 failure: function(response) {
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!", 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}



