
//创建Model
Ext.define('User',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'srcId'},
	        {name: 'dstId'},
	        {name: 'refNum'},
	        {name: 'content'},
	        {name: 'writeTime'}
	        ], 
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'User',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/recvSms.action',
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
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建Action
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除短信',
	disabled:true,
	handler:del_btn
});
var lookAction=Ext.create('Ext.Action',{
	iconCls:'sms',
	text:'查看短信',
	disabled:false,
	handler:look_btn
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	disabled:false,
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
    handler:function(){store.loadPage(1);}
});
var recvsmsChartAction=Ext.create('Ext.Action',{
	text:'数据统计',
	disabled:false,
	iconCls:'chart',
    handler:getChart
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        deleteAction
    ]
});

//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置:短信>>收件箱',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "ID", width: 100, dataIndex: 'id', sortable: true,hidden:true},
	         {text: "短信发送ID", width: 120, dataIndex: 'srcId', sortable: true,
	        	 renderer :function(v) {  
	        	 return "<span style='color:red;font-weight:700'>"+v+"</span>";
	         }},
	         {text: "短信接收ID", width: 120, dataIndex: 'dstId', sortable: true,
	        	 renderer :function(v) {  
	        	 return "<span style='color:green;font-weight:700'>"+v+"</span>";
	         }}, 
	         {text: "参考号", width: 120, dataIndex: 'refNum', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "短信内容", flex: 1, dataIndex: 'content', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }  }, 
	         {text: "短信发送时间", width: 150, dataIndex: 'writeTime', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }  }
	         ],
	         plugins : cellEditing,
	         frame:false,
	         border:true,
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

	        
	         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'bottom',
	             items: [ {fieldLabel:'短信发送ID',xtype:'textfield',name:'srcId',id:'srcId',labelWidth: 80,width:180,emptyText:'短信发送ID' },
		         	         {fieldLabel:'短信接收ID',xtype:'textfield',name:'dstId',id:'dstId',labelWidth:80,width:180,emptyText:'短信接收ID'},
		        	         {fieldLabel:'起始时间',
		        	        	 xtype:'datetimefield',
		        	        	 id:'Ftime',
		        	        	 name:'Ftime',
		        	        	 format:'Y-m-d H:i:s',value:getDay(),
		        	        	 labelWidth: 60,width:220},
		        	         {fieldLabel:'结束时间',
		        	        		 xtype:'datetimefield',
		        	        		 id:'Etime',
		        	        		 name:'Etime',
		        	        		 value:getOneDay(),
		        	        		 format:'Y-m-d H:i:s',
		        	        		 labelWidth: 60,width:220},
	        	         searchAction,{
	        	        	 text:'清除',
	        	        	 iconCls:'clear',
	        	        	 tooltip:'清除输入的查询数据',
	        	        	 handler: function(){
	        	        	 Ext.getCmp("srcId").reset();
	        	        	 Ext.getCmp("dstId").reset();
	        	        	 Ext.getCmp("Ftime").reset();
	        	         }}]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:[{
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
	          	 },'-',deleteAction]

	          	 
	         }]

})
}
store.on('beforeload', function (store, options) {  
    var new_params = { 
    		srcId: Ext.getCmp('srcId').getValue(),
    		dstId: Ext.getCmp('dstId').getValue(),
    		Ftime: Ext.getCmp('Ftime').getValue(),
    		Etime: Ext.getCmp('Etime').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  
    

});
//显示表格
var a=1;
Ext.QuickTips.init();
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
 
	var frame=new Ext.Viewport({
	layout:"border",	
	items:grid
     })
	frame.show();
	store.load({
		params:{start:0,limit:50},
		callback: function(records, operation, success) {
	        // do something after the load finishes
			a=2;
	    },
	    scope: this
	}); 
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
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('id');  
					//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
					if(userId){ids.push(userId);}  

				});  
				Ext.example.msg("提示","正在删除数据");
				Ext.Ajax.request({  
					url : '../../sms/del_recvsms.action',  
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
							Ext.example.msg("提示","删除数据成功");
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
//---------------查看短信---------------------------------------
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
				 fieldLabel:'发送ID',
				 name: 'srcId',
				 blankText: '不能为空',
				 disabled:true,			 
				 msgTarget : 'side'
			 },{
				 fieldLabel:'接收ID',
				 name:'dstId',
				 disabled:true,
				 msgTarget : 'side'
			 },{
				 fieldLabel:'发送时间',
				 name:'writeTime',
				 disabled:true,
				 msgTarget : 'side'
			 },{
				 fieldLabel:'短信内容',
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
		title:"查看短信",
		iconCls:'sms',
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

function getChart(){
	var chart = new FusionCharts("../../classes/charts/INFOSOFTGLOBAL.COM/Charts/Column3D.swf", "chartId", "100%", "100%", "0", "0","exactFit");
	var width=document.documentElement.clientWidth;
	width=width/2-1;
	var height=document.documentElement.clientHeight-2;
	
	var winChart = Ext.create('Ext.Window', {
		//region:'south',
		renderTo:Ext.getBody(),
	    height: height-202,
	    width:width-1,
	    iconCls:'chart',
	    maximizable: true,
	    closable:true,
	    cloaseAction:'close',
	    title: '本月接收短信统计',
	    autoShow: true,
	    layout: 'fit',
	    html:'<div id="chartsms" style="width:100%;height:100%"></div>' 
	});
	getRecvData(chart);
	winChart.show();
	
}
//数据统计
function getRecvData(str){
	Ext.Ajax.request({
		url:"../../chart/recvsmsChart.action",
	    method:'POST',
	    success : function(response,opts){
		var success=Ext.decode(response.responseText).success;
		var data=Ext.decode(response.responseText).strXML;
		if(success){
			 str.setJSONData(data);
		     str.render("chartsms");	
		}else{
			Ext.MessageBox.show({
				title:'提示',
				msg:'加载数据失败',
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

//获取系统cookie
function getcookie(name){
    var strcookie=document.cookie;
	  var arrcookie=strcookie.split(";");
    for(var i=0;i<arrcookie.length;i++){
          var arr=arrcookie[i].split("=");
          if(arr[0].match(name)==name)return arr[1];
    }
    return "";
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

