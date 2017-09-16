//创建Model
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name:'bsId'},
	        {name:'bsName'},
	        {name:'model'},
	        {name:'linkModel'},
	        {name:'channelno'},
	        {name:'rf_send'},
	        {name:'rf_recv'},
	        {name: 'online'},
	        {name:'bsChannel_status'},
	        {name:'longitude'},
	        {name:'latitude'},
	        {name:'lng'},
	        {name:'lat'},
	        {name: 'channel_number'}
	        ], 
	        idProperty : 'id'
}); 
Ext.define('bsControll',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'bsId'},
	        {name: 'bsName'},
	        {name: 'model'},
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
	        {name: 'content'},
	        {name:'longitude'},
	        {name:'latitude'},
	        {name:'height'},
	        {name:'star'},
	        {name:'sum'},
	        {name:'time'}
	        ], 
	        idProperty : 'id'
});
//创建数据源
var bs_store = Ext.create('Ext.data.Store',{
	model:'bsControll',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/bsList.action',
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
var bs_controll_store = Ext.create('Ext.data.Store',{
	model:'bsControll',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/bscontrollList.action',
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
var typeStore=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'value'}],
	data:[{id:'0',value:'==全部=='},
	      {id:'1',value:'添加数据'},
	      {id:'2',value:'修改数据'},
	      {id:'3',value:'删除数据'},
	      {id:'4',value:'其他操作'}
	      ]
	      
})
//创建Action
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除数据',
	disabled:true,
	handler:del_btn
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	iconCls:'refresh',
    handler:function(){bs_controll_store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
    handler:function(){bs_controll_store.loadPage(1);}
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        deleteAction,'-',
        refreshAction
    ]
});
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>系统>>基站遥测记录',
	iconCls:'icon-location',
	region:'center',
	store:bs_controll_store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[{text: "获取时间", width: 150, dataIndex: 'time', sortable: false},
	         {text: "基站ID", width: 60, dataIndex: 'bsId', sortable: false},
	         {text: "基站名称", width: 150, dataIndex: 'bsName', sortable: false},
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
	         {text: "备注", width: 160, dataIndex: 'content', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "信道号", width: 60, dataIndex: 'channel_number', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return value}
	         }}, 
	         {text: "板上温度", width: 80, dataIndex: 'temp1', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return value+"°C"}
	         }},
	         {text: "直流电压", width: 80, dataIndex: 'zV', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return (parseInt(value)/10)+"V"}
	         }},
	         {text: "直流电流", width: 80, dataIndex: 'zI', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return value+"A"}
	         }},
	         {text: "交流电压", width: 80, dataIndex: 'jV', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return value+"V"}
	         }},
	         {text: "发射功率", width: 80, dataIndex: 'send_power', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return value+"W"}
	         }},
	         {text: "反向功率", width: 80, dataIndex: 'back_power', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{return value+"W"}
	         }},
	         {text: "GPS状态", width: 80, dataIndex: 'gps', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(value==0){
	        		 metaData.tdCls='x-grid-record-alarm3';
	        	 }	
	        	 if(value==0){return "失锁"}else{return "锁定";}
	        	 
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{
	        		 if(value==0){
		        		 metaData.tdCls='x-grid-record-alarm3';
		        	 }	
		        	 if(value==0){return "失锁"}else{return "锁定";}
		        	 }
	         }},
	         {text: "网络状态", width: 80, dataIndex: 'sleep', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(value,metaData,record){
	        	 if(record.get("content")!=""){return "- -"}else{

	        		 if(record.get('channel_number')>0){
		        		 if(value==0){
			        		 metaData.tdCls='x-grid-record-alarm3';
			        	 }	        		 
		        	 if(value==0){return "单站休眠";}else{return "单站工作";}
		        	 
		        	 }else{
		        		 return "- -"
		        	 }
	        	 }
	         }}   
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: false,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
	         selModel: selModel,
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	                /* itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     contextMenu.showAt(e.getXY());
	                     return false;
	                 }*/
	             }
	         },

	        
	        
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{fieldLabel:'基站',xtype:'combobox',name:'bsId', id:'bsId', labelWidth:40,width:170,
		        	        store:bs_store,queryModel:'remote',emptyText:'请选择...',value:0,
		        	        valueField:'bsId',displayField:'bsName',forceSelection : true},	  
		        	        {fieldLabel:'GPS状态',xtype:'combobox',name:'gpsen', id:'gpsen', labelWidth:60,width:130,
			        	        store:[[2,'所有'],[0,'失锁'],[1,'锁定']],
			        	        queryModel:'local',emptyText:'请选择...',value:2,
			        	        valueField:'id',displayField:'text',forceSelection : true},	   
		        	         {fieldLabel:'起始时间',
		        	        	 xtype:'datetimefield',
		        	        	 id:'Ftime',
		        	        	 name:'Ftime',
		        	        	 format:'Y-m-d H:i:s',
	        	        	    value:getDay(),
		        	        	 labelWidth: 60,width:220},
		        	         {fieldLabel:'结束时间',
		        	        		 xtype:'datetimefield',
		        	        		 id:'Etime',
		        	        		 name:'Etime',
		        	        		 value:getOneDay() ,
		        	        		 format:'Y-m-d H:i:s',
		        	        		 labelWidth: 60,width:220},
	        	         searchAction]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: bs_controll_store, 
	          	 displayInfo: true

	          	 
	         }]

})
}
var refreshStr= "";  
for (var i = 0; i <grid.dockedItems.keys.length; i++) {  
    if (grid.dockedItems.keys[i].indexOf("pagingtoolbar") !== -1) {  
         refreshStr= grid.dockedItems.keys[i];  
    }  
}  
//grid.dockedItems.get(refreshStr).child('#refresh').hide(true);  
grid.dockedItems.get(refreshStr).child('#refresh').setHandler(   
	     function() {   
	            Ext.getCmp('Etime').setValue(getOneDay());
	            bs_controll_store.loadPage(1);
	     }  
);
bs_store.on('load',function(){
	for(var i =0;i<bs_store.getCount();i++){
		bs_store.getAt(i).set("bsName",bs_store.getAt(i).get('bsId')+":"+bs_store.getAt(i).get("bsName"));

	}
	var ins_rec = Ext.create('bs',{
		bsId:0,bsName:"所有基站"
    }); 
    bs_store.insert(0,ins_rec);
    Ext.getCmp('bsId').setValue(0);
	//bs_store.addSorted({bsId:0,bsName:"全部"});
})
bs_controll_store.on('beforeload',function(store,options){
	  var new_params = { 
	    		bsId: Ext.getCmp('bsId').getValue(),
	    		gpsen: Ext.getCmp('gpsen').getValue(),
	    		Ftime: Ext.getCmp('Ftime').getValue(),
	    		Etime: Ext.getCmp('Etime').getValue()
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  
})
/*store.on('beforeload', function (store, options) {  
    var new_params = { 
    		operator: Ext.getCmp('operator').getValue(),
    		type: Ext.getCmp('type').getValue(),
    		Ftime: Ext.getCmp('Ftime').getValue(),
    		Etime: Ext.getCmp('Etime').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});*/

//显示表格
Ext.QuickTips.init(); 
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:grid
     })
	bs_controll_store.load({params:{start:0,limit:100}}); 
	bs_store.load();
});

//删除数据
function del_btn(){
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
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('id');  
					//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
					if(userId){ids.push(userId);}  

				});  
				Ext.example.msg("提示","正在删除数据");
				Ext.Ajax.request({  
					url : '../../log/delLog.action',  
					params : {  
					deleteIds : ids.join(',') 
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
							
						}); 
						Ext.example.msg("提示","删除数据成功");

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
//---------------查看---------------------------------------
function look_btn()
{	
	var updateForm=new Ext.FormPanel({
		defaultType : 'textfield',//表单默认类型
		frame : true,
		bodyBorder: 0, 
		baseCls: '',
		bodyPadding: 20,
		style:{border:0}, 
		labelStyle: 'font-weight:bold' ,
		width : 450,
		buttonAlign:'center',
		height : 220,

		items : //元素
			[
			 {
				 fieldLabel:'操作员',
				 name: 'operator',
				 blankText: '不能为空',
				 disabled:true,			 
				 msgTarget : 'side'
			 },{
				 fieldLabel:'操作类型',
				 name:'type',
				 disabled:true,
				 msgTarget : 'side'
			 },{
				 fieldLabel:'操作时间',
				 name:'time',
				 disabled:true,
				 msgTarget : 'side'
			 },{
				 fieldLabel:'日志内容',
				 name:'content',
				 xtype:'textareafield',
				 msgTarget : 'side',
				 readOnly:true,
				 height:100,
				 width:450

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
		x:350,
		y:100,
		layout: 'fit',
//		title:"查看短信",
		resizable: false, 
		closable:false,
		items:updateForm,		
		buttons:[
		        
		         {text:'关闭',
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
function getDay()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    //-1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"00:00:00";   
    return  strYesterday;
}
function getOneDay()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    //-1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"23:59:59";   
    return  strYesterday;
}
