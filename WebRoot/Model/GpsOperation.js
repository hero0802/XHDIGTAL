
//创建Model
Ext.define('gpsoperation',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'srcId'},
	        {name: 'dstId'},
	        {name: 'interval'},
	        {name: 'distance'},
	        {name: 'status'},
	        {name: 'operationType'},
	        {name: 'writeTime'}
	        ], 
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'gpsoperation',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/GpsOperation.action',
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
var addAction;
var updateAction;
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'remove',
	text:'删除数据',
	disabled:true,
	handler:del_btn
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
    handler:function(){store.loadPage(1);}
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        deleteAction,'-',
        refreshAction
    ]
});
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	//title:'GPS操作记录列表',
	//iconCls:'list',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "ID", width: 100, dataIndex: 'id', sortable: true,hidden:true},
	         {text: "调度台号", width: 120, dataIndex: 'srcId', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "手台号码", width: 120, dataIndex: 'dstId', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "定时触发器(秒)", width: 120, dataIndex: 'interval', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "定距离触发器(米)", width: 120, dataIndex: 'distance', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }, 
	         {text: "操作状态", width: 120, dataIndex: 'status', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },
	             renderer:function(v,b){
	        	 if(v==24 || v==0){return "<span style='color:green'>成功</span>";}
	        	 else if(v==1){return "<span style='color:red'>失败</span>";}
	        	 else{return "<span style='color:blue'>未知</span>";}
	         }
	         }, 
	         {text: "操作类型", width: 120, dataIndex: 'operationType', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         
	         {text: "操作时间", width: 150, dataIndex: 'writeTime', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }  }
	         ],
	         plugins : [cellEditing],
	         frame:true,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
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

	        
	        
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [ {fieldLabel:'调度台号',xtype:'textfield',name:'srcId',id:'srcId',labelWidth: 80,width:180,emptyText:'调度台号' },
		         	         {fieldLabel:'手台号码',xtype:'textfield',name:'dstId',id:'dstId',labelWidth:80,width:180,emptyText:'手台号码'},
		        	         {fieldLabel:'起始时间',
		        	        	 xtype:'datetimefield',
		        	        	 id:'Ftime',
		        	        	 name:'Ftime',
		        	        	 format:'Y-m-d H:i:s',
		        	        	 value:GetDay(),
		        	        	 labelWidth: 60,width:220},
		        	         {fieldLabel:'结束时间',
		        	        		 xtype:'datetimefield',
		        	        		 id:'Etime',
		        	        		 name:'Etime',
		        	        		 value:new Date(),
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
	             dock: 'top',
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
	store.load({params:{start:0,limit:50}}); 
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
					url : '../../gps/del_gpsoperation.action',  
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
				       /* Ext.Msg.show({
				            title: "cvv",
				            msg: "dfgh",
				            minWidth: 200,
				            modal: true,
				            icon: Ext.Msg.INFO,
				            buttons: Ext.Msg.OK
				        });*/

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
function GetDay()   
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
    if(strDay<10)   
    {   
        strDay="0"+strDay;   
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"00:00:00";   
    return  strYesterday;
}
