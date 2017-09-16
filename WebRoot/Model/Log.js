//创建Model
Ext.define('log',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'operator'},
	        {name: 'type'},
	        {name: 'content'},
	        {name: 'time'},
	        {name: 'ip'}
	      
	        ], 
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'log',	
	remoteSort: true,
//	设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../data/sysLog.action',
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
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>其他信息>>系统日志',
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
	         {text: "操作员", width: 100, dataIndex: 'operator', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "客户端IP", width: 120, dataIndex: 'ip', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "操作类型",width: 120, dataIndex: 'type', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },align:'center',
	         renderer:function(v,b){
	        	 if(v==1){return "<img src='../resources/images/btn/add.png'/>&nbsp;&nbsp;添加数据";}
	        	 else if(v==2){return "<img src='../resources/images/btn/update.png'/>&nbsp;&nbsp;修改数据";}
	        	 else if(v==3){return "<img src='../resources/images/btn/delete.png'/>&nbsp;&nbsp;删除数据";}
	        	 	        	 else{return "<img src='../resources/images/picture/light.png'/>&nbsp;&nbsp;其他操作";}
	         }}, 
	         {text: "操作记录", flex:1, dataIndex: 'content', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },
	         renderer:function(v,b){
	        	return "<a href='#' onclick='look_btn()'>"+v+"</a>";
	         }}, 
	         {text: "时间", width: 150, dataIndex: 'time', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }                  
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<span>对不起，没有查询到数据</span>',
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
	             items: [ {fieldLabel:'操作员',xtype:'textfield',name:'operator',id:'operator',labelWidth: 50,width:130,emptyText:'操作员' },
	                      {fieldLabel:'操作类型',
		        	  xtype:'combobox',
		        	  name:'type',
		        	  id:'type',
		        	  labelWidth:65,
		        	  width:170,
		        	  msgTarget : 'side',
		        	  store:typeStore,
		        	  queryModel:'local',
		        	  emptyText:'请选择...',
		        	  value:'0',
		        	  valueField:'id',
		        	  displayField:'value'},
		        	  {fieldLabel:'日志类容',xtype:'textfield',name:'content',
		        		  id:'content',labelWidth: 70,width:220,emptyText:'操作记录' },
		        	         {fieldLabel:'起始时间',
		        	        	 xtype:'datetimefield',
		        	        	 id:'Ftime',
		        	        	 name:'Ftime',
		        	        	 format:'Y-m-d H:i:s',
//		        	        	 value:new Date(),
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
		        	         Ext.getCmp("operator").reset();
	        	        	 Ext.getCmp("type").reset();
	        	        	 Ext.getCmp("Ftime").reset();
	        	         }}]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:[deleteAction]

	          	 
	         }]

})
}

store.on('beforeload', function (store, options) {  
    var new_params = { 
    		operator: Ext.getCmp('operator').getValue(),
    		type: Ext.getCmp('type').getValue(),
    		content: Ext.getCmp('content').getValue(),
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
	store.load({params:{start:0,limit:30}}); 
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
