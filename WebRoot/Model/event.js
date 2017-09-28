Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../resources/ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging',
             'Ext.Action'
             ]		 
);
//创建Model
Ext.define('Event',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'db'},
	        {name: 'name'},
	        {name: 'created'},
	        {name: 'interval_value'},
	        {name: 'interval_field'},
	        {name: 'starts'},
	        {name: 'status'},
	        {name: 'last_executed'}
	        ]
	        //idProperty : 'id'
});
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'Event',	
	remoteSort: true,
//	设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../data/event.action',
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
var level_store=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'level'}],
	data:[
	      {id:'1',level:'1'},
	      {id:'2',level:'2'},
	      {id:'3',level:'3'}
	      ]
})
var event_type_store=Ext.create('Ext.data.Store',{
	autoDestory: true,
	autoLoad: true,
	fields:[{name:'type'},{name:'showInfo'}],
	data:[
	        {type: 'delete',showInfo: '删除表单数据'},
	        {type: 'repair',showInfo: '修复表单'}]
})
var event_db_store=Ext.create('Ext.data.Store',{
	autoDestory: true,
	autoLoad: true,
	fields:[{name:'dbname'},{name:'showInfo'}],
	data:[
	      {dbname: 'xhdigital_call',showInfo: '呼叫记录'},
	      {dbname: 'xhdigital_gpsinfo',showInfo: 'GPS信息'},
	      {dbname: 'xhdigital_bs_status',showInfo: '基站遥测记录'},
	      {dbname: 'xhdigital_recvsms',showInfo: '短信收件箱'},
	      {dbname: 'xhdigital_sendsms',showInfo: '短信发件箱'},
	      {dbname: 'xhdigital_log',showInfo: '系统操作日志'},
	      {dbname: 'xhdigital_callerror',showInfo: '呼叫失败记录'},
	      {dbname: 'xhdigital_channel_send_count',showInfo: '信道机发射时间统计数据'}
	      ]
})
var event_time_store=Ext.create('Ext.data.Store',{
	autoDestory: true,
	autoLoad: true,
	fields:[{name:'time'},{name:'showInfo'}],
	data:[
	      {time: '1',showInfo: '1天'},
	      {time: '2',showInfo: '2天'},
	      {time: '5',showInfo: '5天'},
	      {time: '10',showInfo: '10天'}
	      ]
})
var event_date_store=Ext.create('Ext.data.Store',{
	autoDestory: true,
	autoLoad: true,
	fields:[{name:'time'},{name:'showInfo'}],
	data:[
          {time: '10',showInfo: '10天前的数据'},
          {time: '20',showInfo: '20天前的数据'},
          {time: '30',showInfo: '一个月前的数据'},
	      {time: '90',showInfo: '三个月前的数据'},
	      {time: '180',showInfo: '半年前的数据'},
	      {time: '360',showInfo: '一年前的数据'},
	      {time: '720',showInfo: '二年前的数据'}
	      ]
})
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     });
//创建Action
var searchAction;
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除事件',
	/*disabled:event_del?false:true,*/
	handler:del_btn
});
var updateAction = Ext.create('Ext.Action', {
    iconCls:'modify',
    text: '修改数据',
    disabled: true,
    handler: update_btn
    }
);
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var addAction=Ext.create('Ext.Action',{
	text:' 添加事件',
	/*disabled:event_add?false:true,*/
	iconCls:'add',
    handler:add
});
var openEventAction=Ext.create('Ext.Action',{
	text:' 开启事件',
	/*disabled:event_open?false:true,*/
	iconCls:'openEvent',
    handler:open_Btn
})
var closeEventAction=Ext.create('Ext.Action',{
	text:' 关闭事件',
	/*disabled:event_close?false:true,*/
	iconCls:'closeEvent',
    handler:close_Btn
})

//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        addAction,
        deleteAction,
        '-',
        refreshAction,'-',
        closeEventAction,
        openEventAction
    ]
});
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>权限管理>>计划任务',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         /*{text: "操作数据库", width: 100, dataIndex: 'db', sortable: true}, */
	         {text: "事件名称", flex: 1, dataIndex: 'name', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "创建时间", width: 150, dataIndex: 'created', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "执行周期", width:80, dataIndex: 'interval_value', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v==1){
	        		 return "每天";
	        	 }else{
	        		 return v+"天";
	        	 }
	         }}, 
	        /* {text: "执行单位", width:70, dataIndex: 'interval_field', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},*/
	         {text: "开始时间", width: 140, dataIndex: 'starts', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "事件运行状态", width: 90, dataIndex: 'status', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "上次运行时间", width: 140, dataIndex: 'last_executed', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}
	         
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:false,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         
	         selModel: selModel,
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

	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
	        
	         dockedItems: [{
	        	 xtype: 'toolbar',
	             dock: 'bottom',
	             items:[ {fieldLabel:'事件调度器状态',
		        	 xtype:'textfield',
		        	 name:'event',
		        	 id:'event',
		        	 readyonly:true,
		        	 labelWidth: 100,
		        	 width:220 },openEventAction,closeEventAction]
	         },
	        {
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [addAction, 
	                     deleteAction,'-',
		                 refreshAction,'-',{

		            	 xtype: 'displayfield',
		            	 name: 'displayfield1',
		            	 //fieldLabel: '温馨提示',
		            	 value: '<span style="color:green;">提示:</span> <span style="color:red;">右键快捷菜单更方便</span>'

		             }]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: store, 
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

//显示表格
Ext.QuickTips.init(); 
Ext.Ajax.request({  
	 url : '../controller/getEvent.action',   
     method : 'POST',
     success : function(response, opts) {  
	    var success = Ext.decode(response.responseText).success; 
	    var event_scheduler = Ext.decode(response.responseText).event_scheduler;   
	     if (success) {Ext.getCmp("event").setValue(event_scheduler);} else {}  
       },

    failure: function(response) {}
});  
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});	     
Ext.onReady(function(){
	new Ext.Viewport({
		layout:{
		type:'border',
		padding:0
	},	
		items:grid
		       
	})
	store.load({params:{start:0,limit:30}}); 
});



//增加、删除，修改功能

//-----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
//-----------------------------------------------编码ID删除  --------------------------------------------------
function del_btn() {  
	var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return;  
	} else {  
		Ext.Msg.confirm("请确认", "是否真的要删除数据？", function(button, text) {  
			if (button == "yes") {  
				var names = [];  
				Ext.Array.each(data, function(record) {  
					var eventNames=record.get('name');  
					//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
					if(eventNames){names.push(eventNames);}  

				});  
				Ext.example.msg("提示","正在删除计划任务");
				Ext.Ajax.request({  
					url : '../controller/deleteEvent.action',  
					params : {  
					deleteNames : names.join('#') 
				},  
				method : 'POST',
				waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
				success : function(response, opts) {  
					var success = Ext.decode(response.responseText).success; 
					
					// 当后台数据同步成功时  
					if (success) {  
						Ext.Array.each(data, function(record) {  
							store.remove(record);// 页面效果  
							Ext.example.msg("提示","删除计划任务成功");
						}); 

					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "数据删除失败!" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},
				 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!" , 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
//---------------更新数据---------------------------------------
function update_btn()
{	
	var updateForm=new Ext.FormPanel({
		defaultType : 'textfield',//表单默认类型
		frame : true,
		bodyBorder: 0, 
		baseCls: '',
		bodyPadding: 20,
		style:{border:0}, 
		labelStyle: 'font-weight:bold' ,
		width : 300,
		buttonAlign:'center',
		autoHeight : true,
		items : //元素
			[
			 {
				 fieldLabel:'会员组名',
				 name: 'groupname',
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'会员组级别',
				 xtype:'combobox',
				 name:'level',
				 allowBlank: false,
				 msgTarget : 'side',
				 store:level_store,
				 queryModel:'local',
				 emptyText:'请选择...',
				 valueField:'level',
				 displayField:'id'
			 }
			 ]

	});
	var data = grid.getSelectionModel().getSelection();
	if (data.length !=1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择一条数据!" , 
			icon: Ext.MessageBox.INFO  
		});  
		return;  
	} 
	
	else
	{ 
	record = grid.getSelectionModel().getLastSelected(); 
  /*if(!updateWindow)*/{
	 updateWindow = new Ext.Window({
		width:510,
		autoHeight:true,
		modal:true,
		layout: 'fit',
		title:"修改会员组",
		iconCls:'modify',
		resizable: false, 
		closable:false,
		items:updateForm,		
		buttons:[
		         {text:'保存',
		          iconCls:'save',
		        	 handler: function() {
		        	 var form=updateForm.form; 
		        	 if(form.isValid()){
		        	 form.submit(									
		        			 Ext.Ajax.request({  
		        				 url : '../../group/update-membergroup.action',  
		        				 params : {
		        				 id:record.get("id"),
		        				 groupname:form.findField('groupname').getValue(),
		        				 level:form.findField('level').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 		        				        			 
		        			 success : function(response) { 
		        				 store.reload();
		        				 updateWindow.hide();
		        			 },

		        			 failure: function(response) {

		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg : "数据修改失败!" , 
		        					 icon: Ext.MessageBox.INFO  
		        				 }); 
		        			 }  
		        			 })); } 
		         } },
		         {text:'取消',
		        	 iconCls:'cancel',
		        	 handler: function(){
		        	 updateWindow.hide();
		         }}
		         ]

	});
  }
	
	//store.insert(0,new User()); 
	updateWindow.show();
	updateForm.form.loadRecord(record);
	}	
}

//-------------------------------------------添加数据------------------------------------------------------
function add(){ 
	var addForm=new Ext.FormPanel({
		defaultType : 'textfield',//表单默认类型
		frame : true,
		bodyBorder: 0, 
		bodyPadding: 20,
		style:{border:0}, 
		labelStyle: 'font-weight:bold' ,
		width : 250,
		layout:'form',
		buttonAlign:'center',
		autoHeight : true,
		items : //元素
			[
			 {
				 fieldLabel:'事件执行动作',
				 xtype: 'combobox',
				 name:'type',
				 allowBlank:false,
				 msgTarget:'side',
				 store:event_type_store,
				 queryModel: 'local',
				 editable:false,
				 emptyText:'请选择...',
				 valueField:'type',
				 displayField:'showInfo',
				labelWdth:240
			 },{
				 fieldLabel:'选择数据库表单',
				 xtype:'combobox',
				 name:'dbname',
				 allowBlank: false,
				 msgTarget : 'side',
				 store:event_db_store,
				 queryMode:'local',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'dbname',  
				 displayField: 'showInfo', 
				 labelWdth:240

			 },{
				 fieldLabel:'执行时间周期',
				 xtype:'combobox',
				 name:'rule',
				 allowBlank: false,
				 msgTarget : 'side',
				 store:event_time_store,
				 queryMode:'local',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'time',  
				 displayField: 'showInfo', 
				 labelWdth:240

			 },{
				 fieldLabel:'处理多长时间的数据',
				 xtype:'combobox',
				 name:'time',
				 allowBlank: false,
				 msgTarget : 'side',
				 store:event_date_store,
				 queryMode:'local',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'time',  
				 displayField: 'showInfo',
				 labelWdth:240
				 
			 }
			 ]

	});
	
	if(!addWindow){
	addWindow = new Ext.Window({
		width:510,
		closable: false ,
		autoHeight:true,
		modal:true,
		layout: 'fit',
		title:"添加事件",
		iconCls:'add',
		items:addForm,
		buttons:[
		         {text:'添加',
		        	 iconCls:'add',
		        	 handler: function() {
		        	 var form=addForm.getForm(); 
		        	 if(form.isValid()){
		        	 form.submit(									
		        			 Ext.Ajax.request({  
		        				 url : '../controller/addEvent.action',  
		        				 params : {  
		        				 type:form.findField('type').getValue(),
		        				 dbname:form.findField('dbname').getValue(),
		        				 rule:form.findField('rule').getValue(),
		        				 time:form.findField('time').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 success : function(response, opts) {  
		        				 var success = Ext.decode(response.responseText).success; 

		        				 // 当后台数据同步成功时  
		        				 if (success) {  
		        					 addForm.form.reset();		        				
		        					 Ext.example.msg("提示","添加计划任务成功");
			    		        	 addWindow.hide();
			        				 store.reload();

		        				 } else {  
		        					 Ext.MessageBox.show({  
		        						 title : "提示",  
		        						 msg : "数据添加失败!" , 
		        						 icon: Ext.MessageBox.INFO  
		        					 });  
		        				 }  

		        			 },

		        			 failure: function(response) {

		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg : "数据添加失败!" , 
		        					 icon: Ext.MessageBox.INFO  
		        				 }); 
		        			 }  
		        			 })); 
		        	 }

		         } },
		         {text:'重置',
		        	 iconCls:'reset',
		        	 handler: function(){
		        	 addForm.form.reset();
		         }},{
		        	 text:'取消',
		        	 iconCls:'cancel',
		        	 handler:function(){
		        	 addForm.form.reset();
		        	 addWindow.hide();
		         }
		         }
		         ]

	});
	}
	addWindow.show();
	//store.insert(0,new User()); 
}
//事件处理

//打开
function open_Btn()
{
	 Ext.Ajax.request({  
		 url : '../controller/onEvent.action',  
		 params : {  
	 },  
	 method : 'POST',
	 waitTitle : '请等待' ,  
	 waitMsg: '正在提交中', 

	 success : function(response, opts) {  
		 var success = Ext.decode(response.responseText).success; 
		 var event_scheduler = Ext.decode(response.responseText).event_scheduler; 

		 // 当后台数据同步成功时  
		 if (success) {  	        				
			 Ext.example.msg("提示","事件调度器开启成功");
        	 Ext.getCmp("event").setValue(event_scheduler);

		 } else {  
			 Ext.MessageBox.show({  
				 title : "提示",  
				 msg : "事件调度器开启失败!" , 
				 icon: Ext.MessageBox.INFO  
			 });  
		 }  

	 },

	 failure: function(response) {

		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "响应服务器失败!" , 
			 icon: Ext.MessageBox.INFO  
		 }); 
	 }
	 })  
}
//关闭
function close_Btn()
{
	 Ext.Ajax.request({  
		 url : '../controller/offEvent.action',  
		 params : {  
	 },  
	 method : 'POST',
	 waitTitle : '请等待' ,  
	 waitMsg: '正在提交中', 

	 success : function(response, opts) {  
		 var success = Ext.decode(response.responseText).success; 
		 var event_scheduler = Ext.decode(response.responseText).event_scheduler; 

		 // 当后台数据同步成功时  
		 if (success) {  		        				
			 Ext.example.msg("提示","事件调度器关闭成功");
        	 Ext.getCmp("event").setValue(event_scheduler);

		 } else {  
			 Ext.MessageBox.show({  
				 title : "提示",  
				 msg : "事件调度器关闭失败!" , 
				 icon: Ext.MessageBox.INFO  
			 });  
		 }  

	 },

	 failure: function(response) {

		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "响应服务器失败!" , 
			 icon: Ext.MessageBox.INFO  
		 }); 
	 }
	 })  
	
}