Ext.define('phone',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'phoneNumber'},
	        {name: 'person'}
	        ], 
	        idProperty : 'id'
})
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
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'phone',	
	remoteSort: true,
//	设置分页大小
	pageSize:200,
	proxy: {
	type: 'ajax',
	url : '../data/phoneList.action',
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
//创建数据源
var bs_store = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/smsNotAlarmList.action',
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
var bsstore = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/smsBsList.action',
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
var addAction=Ext.create('Ext.Action',{
	iconCls:'add',
	text:'添加联系人',
	tooltip:'添加联系人',
	handler:add
});
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
var grid=Ext.create('Ext.grid.Panel',{
	region:'center',
	//height:300,
	store:store,
	trackMouseOver: false,
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:40,text:'#'}), 
	         {text: "ID", width: 50, dataIndex: 'id', sortable: true,hidden:true},
	         {text: "联系人", width: 100, dataIndex: 'person'},
	         {text: "手机号码", width: 120, dataIndex: 'phoneNumber'},
	         {
	        	 text:'<span style="color:green">操作</span>',
	        	 align : 'center',
	        	 width:150,
	        	 dataIndex:'id',
	        	 renderer:function(v,m){
	        	 var str="<img src='../resources/images/picture/edit.png'><a href='#' onclick=update()>修改</a>";
	        	 str+="&nbsp;&nbsp;<img src='../resources/images/picture/delete.png'><a href='#' onclick=del()>删除</a>";
	        	 return str;
	         }
	         }
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

	         emptyText:'<h1 align="center" style="color:red"><span>通讯录是空的，赶紧去添加吧！</span></h1>',
	         dockedItems: [{
	             dock: 'top',
	             xtype: 'toolbar',
	          	 items:[addAction]
	         }]

});
var bs_limitgrid=Ext.create('Ext.grid.Panel',{
	region:'center',
	//height:300,
	store:bs_store,
	trackMouseOver: false,
	disableSelection: false,
	loadMask: true,  
	columns:[/*
	         new Ext.grid.RowNumberer({width:40,text:'#'}), 
	         */{text: "基站ID", width: 50, dataIndex: 'bsId'},
	         {text: "名称", width: 100, dataIndex: 'bsName'},
	         {
	        	 text:'<span style="color:green">操作</span>',
	        	 align : 'center',
	        	 width:90,
	        	 dataIndex:'id',
	        	 renderer:function(v,m){
	        	 var str="<img src='../resources/images/picture/delete.png'><a href='#' onclick=delSmsLimitBs()>删除</a>";
	        	 return str;
	         }
	         }
	         ],
	         plugins : Ext.create('Ext.grid.plugin.CellEditing', { 
	        		        clicksToEdit: 2
	        		     }),
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
	         viewConfig: {
	             stripeRows: true
	         },

	         emptyText:'<h1 align="center" style="color:red"><span>限制基站告警列表没有数据！</span></h1>',
	         dockedItems: [{
	             dock: 'top',
	             xtype: 'toolbar',
	          	 items:[{
	          		 xtype:'button',
	          		 text:'添加',
	          		 iconCls:'add',
	          		 handler:showBsWin
	          	 },{
	          		 xtype:'button',
	          		 text:'删除',
	          		 iconCls:'delete',
	          		 handler:delSmsLimitBs
	          	 }]
	         }]

});
var bs_grid=Ext.create('Ext.grid.Panel',{
	// margin:'0 0 0 10',
	region:'center',
	// width:400,
	store:bsstore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "基站ID", width: 100, dataIndex: 'bsId', sortable: true},
	         {text: "基站名称", flex:1, dataIndex: 'bsName', sortable: true}
	         ],
	        // plugins : Ext.create('Ext.selection.CheckboxModel'),
	         frame:false,
	         border:false,
	         forceFit: true,
	         columnLines : true, /*
									 * height:document.documentElement.clientHeight,
									 */
	         
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
	         viewConfig: {
	             stripeRows: true
	         },
	         emptyText:'<span>没有查询到数据</span>'

});
var alarmManageForm=Ext.create('Ext.form.Panel',{
	autoWidth:true,
	border:0,
	style:'margin:3;',
	autoHeight:true,
	layout:'form',
	buttonAlign:"right",
	items:[{
		xtype:'checkbox',fieldLabel:'短信告警',name:'open',checked:false,labelWidth:80,boxLabel:'开启'
	},{
		xtype:'textfield',
		fieldLabel:'IP地址',
		 allowBlank: false,
		name:'ip'
		
	},{
		xtype:'numberfield',
		fieldLabel:'TCP端口',
		 allowBlank: false,
		name:'port'
		
	},{
		xtype:'textfield',
		fieldLabel:'短信中心号码',
		 allowBlank: false,
		name:'centerNumber'
		
	},{
		xtype:'numberfield',
		fieldLabel:'基站断站时长(单位：分钟)',
		labelWidth:160,
		 allowBlank: false,
		name:'bsoffTime'
		
	},{
		xtype:'button',margin:'30 10 0 100',
		text:'保存配置',
		handler:function(){
		save();
	}	
	}]
});
var Panel=Ext.create('Ext.Panel',{
	region:'center',
	bodyStyle :'overflow-x:visible;overflow-y:scroll', //隐藏水平滚动条
	border:true,
	layout:'column',
	items:[{
		xtype:'panel',
		title:'短信网关',
		border:true,
		frame:false,
		margin:'10 10 0 10',
		bodyPadding:'10 10 0 10',
		width:300,
		height:300,
		/*collapsed: false , 
		collapsible: true,*/
		items:alarmManageForm
	},{
		xtype:'panel',
		title:'通讯录',
		border:true,
		frame:false,
		margin:'10 10 0 10',
		width:400,
		height:300,
		layout:'border',
		/*collapsed: false , 
		collapsible: true,*/
		items:grid
	},{
		xtype:'panel',
		title:'禁止基站告警列表',
		border:true,
		frame:false,
		margin:'10 10 0 10',
		width:300,
		height:300,
		layout:'border',
		/*collapsed: false , 
		collapsible: true,*/
		items:bs_limitgrid
	}]
})

Ext.QuickTips.init(); 
Ext.onReady(function(){
	//radiogroup.down('radio[boxLabel=sd]').setValue(true); 
	new Ext.Viewport({
		layout:'border',
		items:[Panel]
	})
	store.load();
	loadConfig();
	bs_store.load();
	
});

function add(){
	var addForm=new Ext.FormPanel({
		defaultType : 'textfield',//表单默认类型
		frame : false,
		bodyBorder: 0, 
		bodyPadding: 20,
		style:"background: #FFFFFF", 
		labelStyle: 'font-weight:bold' ,
		width : 400,
		buttonAlign:'center',
		autoHeight : true,
		items : //元素
			[
			 {
				 fieldLabel:'联系人',
				 name: 'person',
				 allowBlank: false,
				 labelAlign:'right',
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'手机号码',
				 name:'phoneNumber',
				 labelAlign:'right',
				 allowBlank: false,
				 msgTarget : 'side'
			 }
			 ]

	});
	
	var addWindow = new Ext.Window({
		autoWidth:true,
		closable: false ,
		autoHeight:true,
		modal:true,
		layout: 'fit',
		title:"添加联系人",
		iconCls:'add',
		items:addForm,
		buttons:[
		         {text:'添加',
		        	 iconCls:'add',
		        	 handler: function() {
		        	 var form=addForm.getForm(); 
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证数据，请稍后！',  
	                     //loadMask: true, 
	                     removeMask: true //完成后移除  
	                 });
		        	 if(form.isValid()){
		        		 myMask.show();
		        	 form.submit(	
		        			 
		        			 Ext.Ajax.request({  
		        				 url : '../controller/addPhone.action',  
		        				 params : {  
		        				 person:form.findField('person').getValue(),
		        				 phoneNumber:form.findField('phoneNumber').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 success : function(response, opts) {  
		     					var success=Ext.decode(response.responseText).success;
		     					// 当后台数据同步成功时  
		     					if (success) {  
		     						myMask.hide();
		     							 addForm.form.reset();		        				
		     							Ext.example.msg("提示","添加成功");
				    		        	 addWindow.hide();
				        				 store.reload();

		     					} else { 
			        				 Ext.Msg.alert('提示','手机号码已经存在');
		     					}  

		     				},

		        			 failure: function(response) {
		     					myMask.hide();
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
	addWindow.show();
}
//---------------更新数据---------------------------------------
function update()
{	
	var updateForm=new Ext.FormPanel({
		defaultType : 'textfield',//表单默认类型
		frame : false,
		bodyBorder: 0, 
		//baseCls: '',
		bodyPadding: 20,
		style:"background: #FFFFFF", 
		labelStyle: 'font-weight:bold',
		width : 400,
		buttonAlign:'center',
		//autoHeight : true,
		autoHeight:true,
	
		items : [
				 {
					 fieldLabel:'联系人',
					 name: 'person',
					 allowBlank: false,
					 labelAlign:'right',
					 blankText: '不能为空',
					 msgTarget : 'side'
				 },{
					 fieldLabel:'手机号码',
					 name:'phoneNumber',
					 labelAlign:'right',
					 allowBlank: false,
					 msgTarget : 'side'
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
	 var updateWindow = new Ext.Window({
		width:400,
		autoHeight:true,
		//x:300,
		//y:200,
		modal:true,
		layout: 'fit',
		title:"修改联系人",
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
		        				 url : '../controller/updatePhone.action',  
		        				 params : {
		        					 id:record.get("id"),
		        					 person:form.findField('person').getValue(),
			        				 phoneNumber:form.findField('phoneNumber').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 
		        			 
		        			 success : function(response) { 
		        				 var success=Ext.decode(response.responseText).success;
		        				 if(success){
		        					 store.reload();
			        				 updateWindow.hide();
			        				 grid.getSelectionModel().clearSelections();
			        				 Ext.example.msg("提示","修改成功");
		        				 }else{
		        					 Ext.MessageBox.show({  
			        					 title : "提示",  
			        					 msg : "联系人修改失败!联系人已经存在" , 
			        					 icon: Ext.MessageBox.INFO  
			        				 }); 
		        				 }
		  
		        				
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
	updateWindow.show();	
	updateForm.form.loadRecord(record);
	}	
}
//-----------------------------------------------编码ID删除  --------------------------------------------------
function del() { 
	var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return;  
	} else {  
		Ext.Msg.confirm("请确认", "是否真的要删除联系人？", function(button, text) {  
			if (button == "yes") {  
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('id');  
					//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在删除数据，请稍后！',  
                     //loadMask: true, 
                     removeMask: true //完成后移除  
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/delPhone.action',  
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
						Ext.Array.each(data, function(record) {  
							store.remove(record);// 页面效果  
							Ext.example.msg("提示","删除联系人成功");
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
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!" , 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
function loadConfig(){
	Ext.Ajax.request({
		url:'../controller/loadPhone.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		form=alarmManageForm.getForm(); 
		if(str.success){
			form.findField('open').setValue(str.open);
			form.findField('ip').setValue(str.ip);
			form.findField('port').setValue(str.port);
			form.findField('centerNumber').setValue(str.centerNumber);
			form.findField('bsoffTime').setValue(str.bsoffTime);
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
function save()
{
	
	var form=alarmManageForm.getForm(); 
	 if(form.isValid()){
	 form.submit(									
			 Ext.Ajax.request({  
				 url : '../controller/savePhone.action',  
				 params : {				 			 
				 open:form.findField('open').getValue()?1:0,
						 ip:form.findField('ip').getValue(),
						 port:form.findField('port').getValue(),
						 centerNumber:form.findField('centerNumber').getValue(),
						 bsoffTime:form.findField('bsoffTime').getValue()
			 },  
			 method : 'POST',			        			 
			 success : function(response) { 				 
				 loadConfig();
				 Ext.example.msg("提示","修改成功"); 
			 },
			 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "读取配置文件失败" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			 })); } 	
}
function showBsWin(){
	
	var win=new Ext.Window({
		title:'基站列表',
		border:false,
		layout:'border',
		height:300,
		width:400,
		modal:false,
		items:bs_grid,
		closable:true,
		iconCls:'add',
		dragable:false,
		closeAction:'close',
		buttons:[{text:'保存',
			handler:function(){
				var data = bs_grid.getSelectionModel().getSelection(); 
				if (data.length == 0) {  
					Ext.MessageBox.show({  
						title : "提示",  
						msg : "请先选择您要操作的行!" , 
						icon: Ext.MessageBox.INFO 
					});  
					return;  
				}
			var myMask = new Ext.LoadMask(Ext.getBody(), { 
		        msg: '正在验证数据，请稍后！',  
		        //loadMask: true, 
		        removeMask: true //完成后移除  
		    });
			myMask.show();
			win.hide();
			var bsids=[];  
			
			Ext.Array.each(data,function(record){
				var bsid=record.get('bsId');
				if(bsid){bsids.push(bsid);}
			});
			 Ext.Ajax.request({  
				 url : '../controller/addLimitBs.action',  
				 params : {
					 bsids:bsids.join(',')
			 },  
			 method : 'POST',
			 success : function(response) { 
				 var rs=Ext.decode(response.responseText);
				 myMask.hide();
				 if(rs.success)
				 {
				 bs_store.reload();
				 Ext.example.msg("提示","操作成功");
				 win.hide();
				 }
				 else
				 {
					 Ext.MessageBox.show({  
						 title : "提示",  
						 msg : "操作失败" , 
						 icon: Ext.MessageBox.ERROR  
					 }); 
				 }
			 },

			 failure: function(response) {

				 myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "操作失败!" , 
					 icon: Ext.MessageBox.ERROR 
				 }); 
			 }  
			 });
		}}]
	})
	
	win.show();
	bsstore.reload();
	
}
function delSmsLimitBs(){
	var data = bs_limitgrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return;  
	}
	var ids = [];  
	Ext.Array.each(data, function(record) {  
		var userId=record.get('bsId');  
		//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
		if(userId){ids.push(userId);}  

	}); 
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在验证数据，请稍后！',  
        //loadMask: true, 
        removeMask: true //完成后移除  
    });
	myMask.show();
	 Ext.Ajax.request({  
		 url : '../controller/delLimitBs.action',  
		 params : {
		 bsids:ids.join(",")
	 },  
	 method : 'POST',
	 success : function(response) { 
		 var rs=Ext.decode(response.responseText);
		 myMask.hide();
		 if(rs.success)
		 {
			 bs_store.reload();
		 Ext.example.msg("提示","操作成功");
		 }
		 else
		 {
			 Ext.MessageBox.show({  
				 title : "提示",  
				 msg : "操作失败" , 
				 icon: Ext.MessageBox.ERROR  
			 }); 
		 }
	 },

	 failure: function(response) {

		 myMask.hide();
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "操作失败!" , 
			 icon: Ext.MessageBox.ERROR 
		 }); 
	 }  
	 });
}