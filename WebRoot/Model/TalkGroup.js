Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging',
             'Ext.Action'
             ]		 
);
var isAddMany=false
checkUserPower();
//创建Model
Ext.define('radiouser',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'alias'},
	        {name: 'type'},
	        {name: 'callmode'},
	        {name: 'priority'},
	        {name: 'slot'},
	        {name: 'maxcalltime'},
	        {name: 'roamen'},
	        {name: 'name'}
	        ], 
	        idProperty : 'id'
});
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'sysidcode'},
	        {name: 'colorcode'},
	        {name: 'sleepen'},
	        {name: 'ip'},
	        {name: 'startwatchdog'},
	        {name: 'channelno'},
	        {name: 'slot0authority'},
	        {name: 'slot1authority'},
	        {name: 'aietype'},
	        {name: 'up'},
	        {name: 'mask'},
	        {name: 'sf'},
	        {name: 'wt'},
	        {name: 'reg'},
	        {name: 'backoff'},
	        {name: 'np'},
	        {name: 'name'},
	        {name: 'rf_transmit_en'},
	        {name: 'rf_receive_en'}
	        ], 
	        idProperty : 'id'
});
Ext.define('group_bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'homegroupid'},
	        {name: 'basestationid'},
	        {name: 'name'}
	        ], 
	        idProperty : 'basestationid'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/talkGroup.action',
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
//创建数据源
var bsStore = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/bsStation.action',
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
var groupOtherBsStore = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/bsGroupList.action',
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
var groupBsStore = Ext.create('Ext.data.Store',{
	model:'group_bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/groupBs.action',
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
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建Action
var addAction=Ext.create('Ext.Action',{
	iconCls:'add',
	text:'增加',
	tooltip:'增加数据',
	disabled:addUserGroup?false:true,
	handler:add
});
var updateAction=Ext.create('Ext.Action',{
	iconCls:'update',
	text:'修改',
	tooltip:'修改数据',
	disabled:updateUserGroup?false:true,
	handler:update_btn
});
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除',
	tooltip:'删除数据',
	disabled:delUserGroup?false:true,
	handler:del_btn
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新',
	tooltip:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
	tooltip:'查询',
    handler:function(){store.loadPage(1);}
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        addAction,
        updateAction,
        deleteAction,'-',
        refreshAction,
    ]
});
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>配置管理>>通话组配置',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}),*/
	         {text: "用户ID", width:120, dataIndex: 'id', sortable: true,
	        	 renderer : function(v){
	        	 return"<a href='#' onclick=update_btn() title='详细信息' style='color:blue'>"+v+"</a>";
	         }
	         },{text: "名称", width:150, dataIndex: 'name', sortable: false
	         },{text: "类型", width:80, dataIndex: 'type', sortable: false
	         },/*{text: "漫游使能", flex:2, dataIndex: 'roamen', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         },*/{text: "时隙", width:60, dataIndex: 'slot', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "1"}
	        	 else{return "0"}
	         }},
	         {text: "通话时长", width:80, dataIndex: 'maxcalltime', sortable: false,
	        	 renderer:function(v){
	        	 return v+"s"
	         }},{text: "", flex:1, dataIndex: '', sortable: false
	         }
	         
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:false,
	         forceFit: false,
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
	        	 dock:'top',
	        	 xtype:'toolbar',
	        	 items:[{fieldLabel:'通话组ID',xtype:'textfield',name:'id',id:'id',labelWidth: 60,width:180,emptyText:'用户ID' },
        		        {fieldLabel:'名称',xtype:'textfield',name:'name',id:'name',labelWidth:60,width:180,emptyText:'用户名称'},
                		 searchAction,{
                			  text:'清除',
                			  iconCls:'clear',
                			  tooltip:'清除输入的查询数据',
                			  handler: function(){
                			  Ext.getCmp("id").reset();
                			  Ext.getCmp("name").reset();
                		  }}]
	         },{
	        	 dock:'left',
	        	 xtype:'toolbar',
	        	 items:[addAction,'-',
                 updateAction,'-',
                 deleteAction,'-']
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             //style:'background: skyblue',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:[]

	          	
	         }]

})
}
var TkGroupBsGrid=Ext.create('Ext.grid.Panel',{
	margin:'0 0 0 10',
	title:'当前组允许漫游基站列表',
	region:'center',
	// width:400,
	store:groupBsStore ,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "基站ID", width: 100, dataIndex: 'basestationid', sortable: true},
	         {text: "基站名称", flex:1, dataIndex: 'name', sortable: true},
	         {text: "操作", width: 120, dataIndex: 'name', sortable: true,
	        	 renderer:function(value,metaData,record){
	        	 var str="<img src='../resources/images/picture/delete.png'>" +
	        	 		"<a href='#' onclick=delGroupBs("+record.get('homegroupid')+","+record.get('basestationid')+")>删除</a>";
	        	 return str;
	         }}
	         ],
	        /* plugins : [cellEditing], */
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, /*
									 * height:document.documentElement.clientHeight,
									 */
	         
	         /* selModel: selModel, */
	         viewConfig: {
	             stripeRows: true
	         },

	         emptyText:'<span>没有查询到数据</span>',
	         dockedItems: [{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             // style:'background: skyblue',
	             store: groupBsStore, 
	          	 displayInfo: true, 
	          	 items:[{text:'',
	          		tooltip:'增加漫游基站',
	            	 iconCls:'add',handler:addTGBS}]

	          	
	         }]

});
var bs_Grid=Ext.create('Ext.grid.Panel',{
	// margin:'0 0 0 10',
	region:'center',
	// width:400,
	store:groupOtherBsStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "基站ID", width: 100, dataIndex: 'id', sortable: true},
	         {text: "基站名称", flex:1, dataIndex: 'name', sortable: true}
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

store.on('beforeload', function (store, options) {  
    var new_params = { 
    		id: Ext.getCmp('id').getValue(),
    		name: Ext.getCmp('name').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
//表格行选择
grid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 
		groupBsStore.on('beforeload', function (store, options) {  
		    var new_params = { 
		    		homegroupid: record.get('id')
		    		};  
		    Ext.apply(store.proxy.extraParams, new_params);  

		});
		groupBsStore.load();
	}
}
	
});
var right=Ext.create('Ext.panel.Panel',{
	bodyCls:'panel',
	layout:'border',
	border:false,
	region:'east',
	width:450,
	items:[TkGroupBsGrid]
})
//显示表格
Ext.QuickTips.init(); 
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:[grid, right]
     })
	store.load({params:{start:0,limit:100}}); 
});



//增加、删除，修改功能

//-----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
//-----------------------------------------------编码ID删除  --------------------------------------------------
var delFlag=0,i=0,successfully=0,error=0;
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
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在删除数据，请稍后！',  
                     //loadMask: true, 
                     removeMask: true //完成后移除  
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/delTalkGroup.action',  
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
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!" , 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
function delRun(id){
	
	Ext.Ajax.request({  
		url : '../controller/delTalkGroup.action',  
		params : {  
		deleteIds : id
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时  
		if(rs.success)
		{
			
			delFlag=0;
			successfully++;
		}
		else
		{
			delFlag=0;
			error++;
		}

	},
	failure: function(response) {

		delFlag=0;error++;}  
	}); 
}
//---------------更新数据---------------------------------------
function update_btn()
{	
	var updateForm=new Ext.FormPanel({
		frame :false,
		bodyBorder: 0, 
		autoWidth:true,
		autoHeight : true,
		items:[{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'唯一属性',
			layout:'form',
			items:[{
					xtype:'numberfield',fieldLabel:'<span style="color:red">用户组ID</span>',name:'id',allowBlank: true,
					labelWidth:150,disabled:true
				},{
					layout:'column',border:0,
					items:[{
						columnWidth: .5,
						border:0,
						items:[{
							xtype:'numberfield',fieldLabel:'<span style="color:red">ID范围</span>',name:'idStart',allowBlank: true,
							hidden:true,labelWidth:150
						}]
					},{
						columnWidth: .3,
						border:0,
						items:[{
							xtype:'numberfield',fieldLabel:'',name:'idEnd',allowBlank: true,
							hidden:true,labelWidth:1
						}]
					},{
						columnWidth: .2,
						border:0,
						items:[{
							xtype:'displayfield',fieldLabel:'',name:'say',allowBlank: true,
							hidden:true,labelWidth:1,value:'<span style="color:red">[最多创建100个]</span>'
						}]
					}]
				},{
					xtype:'textfield',fieldLabel:'名称',name:'name',
					labelWidth:150
				},{
					xtype:'textfield',fieldLabel:'别名',name:'alias',
					labelWidth:150
				},{
					xtype:'combobox',fieldLabel:'组类型',name:'type',
					labelWidth:150,
	        		store:[[0,'0'],[1,'1']],
	        		queryMode:'local',value:0
				}]},{
					xtype:"fieldset",
					style:'margin: 5 10 5 10',
				title:'其他参数',
				layout:'form',
				items:[/*{
					xtype:'radiogroup',fieldLabel:'漫游使能',name:'roamen',id:'roamen',labelWidth:150,layout:'column',
					items: [
				            { boxLabel: '是', name:'roamen', inputValue: '1',checked: true },
				            { boxLabel: '否', name:'roamen', inputValue: '0'}
				        ]
				},*/{
					xtype:'numberfield',fieldLabel:'优先级',name:'priority',
					labelWidth:150
				},{
					xtype:'numberfield',fieldLabel:'通话时长',name:'maxcalltime',
					labelWidth:150
				},{
					xtype:'combobox',fieldLabel:'时隙',name:'slot',
					labelWidth:150,
	        		store:[[false,'0时隙'],[true,'1时隙']],
	        		queryMode:'local',value:0
				},{
					xtype:'combobox',fieldLabel:'呼叫类型',name:'callmode',
					labelWidth:150,
	        		store:[[0,'随系统'],[1,'静态'],[2,'动态'],[1,'动静态交集']],
	        		queryMode:'local',value:0
				}]
			}/*,{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
				title:'用户组限制基站',
				layout:'form',
				items:[{
					xtype:'panel',
					html:'<a href="#" onclick=editTGBS()>编辑限制基站列表</a>'
				}]
			}*/]
		});
	var data = grid.getSelectionModel().getSelection();
	if (data.length !=1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择一条数据!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	
	else
	{ 
	record = grid.getSelectionModel().getLastSelected(); 
	 updateWindow = new Ext.Window({
		 draggable:false,
		 width:700,
		 autoHeight:true,
		 plain:true,
		 modal:true,
		 layout: 'fit',
		 title:"修改用户组",
		 iconCls:'update',
		 resizable: false, 
		 closable:true,
		 closeAction:'close',
		 items:updateForm,		
		buttons:[
		         {text:'更新',
		          iconCls:'save',
		          disabled:updateUserGroup?false:true,
		        	 handler: function() {
		        	 var form=updateForm.form; 
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证数据，请稍后！',  
	                     //loadMask: true, 
	                     removeMask: true //完成后移除  
	                 });
		        	 if(form.isValid()){
		        		 myMask.show();
		        	 form.submit(									
		        			 Ext.Ajax.request({  
		        				 url : '../controller/updateTalkGroup.action',  
		        				 params : {
		        				 id:record.get("id"),
		        				 name:form.findField('name').getValue(),
		        				 alias:form.findField('alias').getValue(),
		        				 callmode:form.findField('callmode').getValue(),
		        				 type:form.findField('type').getValue(),
		        				 priority:form.findField('priority').getValue(),
		        				 slot:form.findField('slot').getValue()?1:0,
		        				 maxcalltime:form.findField('maxcalltime').getValue()/*,
		        				 roamen:form.findField('roamen').getValue()['roamen']*/
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 
		        			 
		        			 success : function(response) { 
		        				 myMask.hide();
		        				 var rs = Ext.decode(response.responseText); 
		        				 if(rs.success)
		        				 {
//		        				 updateForm.form.reset();    	  				 
		        				 Ext.example.msg("提示",rs.message);
		    		        	 updateWindow.close();
		        				 store.reload();
		        				 grid.getSelectionModel().clearSelections();
		        				 }
		        				 else
		        				 {
		        					 Ext.MessageBox.show({  
			        					 title : "提示",  
			        					 msg :rs.message , 
			        					 icon: Ext.MessageBox.INFO  
			        				 }); 
		        				 }
		        				
		        			 },
		        			 failure: function(response) {
		        				 myMask.hide();
		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg : "数据修改失败!" , 
		        					 icon: Ext.MessageBox.INFO  
		        				 }); 
		        			 }  
		        			 })); } 
		         } }/*,
		         {text:'取消',
		        	 iconCls:'cancel',
		        	 handler: function(){
		        	 updateWindow.hide();
		         }}*/
		         ]

	});
 
	
	//store.insert(0,new User()); 
	updateWindow.show();
	/*updateWindow.maximize();*/
//	
	updateForm.form.loadRecord(record);
	setRadioChecked(record);
	}	
}

//-------------------------------------------添加数据------------------------------------------------------
/*var successfully=0,error=0;*/
var success=false;
var flag=0/*,i=0*/;
function add(){ 
var addForm=new Ext.FormPanel({
	frame :true,
	bodyBorder: 0, 
	autoWidth:true,
	autoHeight : true,
	items:[{
		xtype:"fieldset",
		style:'margin: 5 10 5 10',
		title:'唯一属性',
		layout:'form',
		items:[{
				xtype:'numberfield',fieldLabel:'<span style="color:red">用户组ID</span>',name:'id',allowBlank: true,
				labelWidth:150
			},{
				layout:'column',border:0,
				items:[{
					columnWidth: .5,
					border:0,
					items:[{
						xtype:'numberfield',fieldLabel:'<span style="color:red">ID范围</span>',name:'idStart',allowBlank: true,
						hidden:true,labelWidth:150
					}]
				},{
					columnWidth: .3,
					border:0,
					items:[{
						xtype:'numberfield',fieldLabel:'',name:'idEnd',allowBlank: true,
						hidden:true,labelWidth:1
					}]
				},{
					columnWidth: .2,
					border:0,
					items:[{
						xtype:'displayfield',fieldLabel:'',name:'say',allowBlank: true,
						hidden:true,labelWidth:1,value:'<span style="color:red">[最多创建100个]</span>'
					}]
				}]
			},{
				xtype:'textfield',fieldLabel:'名称',name:'name',
				labelWidth:150
			},{
				xtype:'textfield',fieldLabel:'别名',name:'alias',
				labelWidth:150
			},{
				xtype:'combobox',fieldLabel:'组类型',name:'type',
				labelWidth:150,
        		store:[[0,'0'],[1,'1']],
        		queryMode:'local',value:0
			}]},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
			title:'其他参数',
			layout:'form',
			items:[/*{
				xtype:'radiogroup',fieldLabel:'漫游使能',name:'roamen',labelWidth:150,layout:'column',
				items: [
			            { boxLabel: '是', name:'roamen', inputValue: '1',checked: true },
			            { boxLabel: '否', name:'roamen', inputValue: '0'}
			        ]
			},*/{
				xtype:'numberfield',fieldLabel:'优先级',name:'priority',
				labelWidth:150,value:0
			},{
				xtype:'numberfield',fieldLabel:'通话时长(s)',name:'maxcalltime',
				labelWidth:150,value:600
			},{
				xtype:'combobox',fieldLabel:'时隙',name:'slot',
				labelWidth:150,
        		store:[[0,'0时隙'],[1,'1时隙']],
        		queryMode:'local',value:0
			},{
				xtype:'combobox',fieldLabel:'呼叫类型',name:'callmode',
				labelWidth:150,
        		store:[[0,'随系统'],[1,'静态'],[2,'动态'],[1,'动静态交集']],
        		queryMode:'local',value:0
			}]
		}]
	});
	var Panel=Ext.create('Ext.Panel',{
		width : 600,
		autoHeight:true,
		border:0,
		/*bodyStyle :'overflow-x:visible;overflow-y:scroll', //隐藏水平滚动条
*/		items:[{
			xtype:'toolbar',
			items:[{
				xtype:'button',
				text:'[ 创建 ]',
				handler:function(){
				isAddMany=false;
				addForm.form.findField('id').show();
				addForm.form.findField('say').hide();
				addForm.form.findField('idStart').hide();
				addForm.form.findField('idEnd').hide();
			}
			},{
				xtype:'button',
				text:'[ 批量创建 ]',
				handler:function(){
				isAddMany=true;
				addForm.form.findField('id').hide();
				addForm.form.findField('say').show();
				addForm.form.findField('idStart').show();
				addForm.form.findField('idEnd').show();
			}
			}]
		},addForm]
	});
	var tabPanel=Ext.create("Ext.tab.Panel",{
		region:"center",
		id:"addTab",
		animCollapse:false,
		padding:0,
		border:false,
		//plain:true,
		layout:'fit',  
		frame: false, 
		enableTabScroll:true,
		items:[{
			title:"首页",
			items:Panel
		}]
	});
	if(!addWindow){
	addWindow = new Ext.Window({
		border:0,
		draggable:false,
		width:700,
		autoHeight:true,
//		plain:true,
		closable: false ,
		autoScroll:true,
		modal:true,
		layout: 'fit',
		title:'添加通话组',
		iconCls:'add',
		items:Panel,
		closeAction:'close',
		buttons:[
		         {text:'保存',
		        	 iconCls:'save',
		        	 id:'saveBtn',
		        	 handler: function() {
		        	 var form=addForm.getForm(); 
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证权限，请稍后！',  
	                     //loadMask: true, 
	                     removeMask: true //完成后移除  
	                 });
					 
		        	 if(form.isValid()){
		        		 if(!isAddMany)
		        		 {
		        		 if(form.findField('id').getValue()==null){
		        			 Ext.MessageBox.show({  
	        					 title : "提示",  
	        					 msg :'标示不能为空' , 
	        					 icon: Ext.MessageBox.ERROR
	        				 });
		        			 return ;
		        		 }
		        		 }else{
		        			 if(form.findField('idStart').getValue()==null || form.findField('idEnd').getValue()==null){
			        			 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg :'标示范围不能为空' , 
		        					 icon: Ext.MessageBox.ERROR
		        				 });
			        			 return ;
			        		 }
		        			 if(form.findField('idStart').getValue()>=form.findField('idEnd').getValue()){
		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg :'标示范围不正确' , 
		        					 icon: Ext.MessageBox.ERROR
		        				 });
			        			 return ;
		        			 }
		        			 if(form.findField('idEnd').getValue()-form.findField('idStart').getValue()>100){
		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg :'批量添加最多一次添加数据不能超过100条' , 
		        					 icon: Ext.MessageBox.ERROR
		        				 });
			        			 return ;
		        			 }
		        		 }
		        		 myMask.show();
		        		 Ext.getCmp('saveBtn').disable();
		        		 if(isAddMany){
		        			 var timeout=setInterval(function(){
		        					
		        					if(flag==0){
		        					 flag=1;
		        					if(i<=form.findField('idEnd').getValue()-form.findField('idStart').getValue()){
		        						Run(form,form.findField('idStart').getValue()+i)
		        						i++;
		        						
		        					}else{
		        						clearInterval(timeout);
		        						Ext.MessageBox.show({  
		        							title : "提示",  
		        							msg : "<p>一共执行"+i+"次</p> <p>成功"+successfully+"个</p> <p>失败"+error+"个</p>" , 
		        							icon: Ext.MessageBox.INFO 
		        						});
		        						tellCenter();
		        						Ext.getCmp('saveBtn').enable();
		        						myMask.hide();
		        						i=0;flag=0;successfully=0;error=0;
		        						
		        					}
		        					}
		        					
		        			}, 100);  //每隔 1秒钟  
		        	
		        		 }else{
		        			 addRun(form,myMask);
		        			 Ext.getCmp('saveBtn').enable();
		        		 }
		        	
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
	/*addWindow.maximize();*/
	//store.insert(0,new User()); 
}
function Run(form,id){
	if(addRunMany(form,id)){
		Ext.example.msg("提示","标示 ["+id+"]添加成功");
		successfully++;
		flag=0;
	}else{
		Ext.example.msg("错误提示","标示 ["+id+"]添加失败");
		error++;
		flag=0;
	}
}
function addRun(form,mask){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addTalkGroup.action',  
				 params : {
				 id:form.findField('id').getValue(),
				 name:form.findField('name').getValue(),
				 alias:form.findField('alias').getValue(),
				 callmode:form.findField('callmode').getValue(),
				 type:form.findField('type').getValue(),
				 priority:form.findField('priority').getValue(),
				 slot:form.findField('slot').getValue()?1:0,
				 maxcalltime:form.findField('maxcalltime').getValue()/*,
				 roamen:form.findField('roamen').getValue()['roamen']*/
			 },  
			 method : 'POST',
			 success : function(response, opts) {  
				 var rs = Ext.decode(response.responseText); 
				 mask.hide();
				 if(rs.success)
				 {
				 form.reset();		        				
				 Ext.example.msg("提示",rs.message)
				
	        	 addWindow.hide();
				 store.reload();
				 tellCenter();
				 }
				 else
				 {
					 Ext.MessageBox.show({  
    					 title : "提示",  
    					 msg :rs.message , 
    					 icon: Ext.MessageBox.INFO  
    				 }); 
				 }
			 },

			 failure: function(response) {
				 mask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "数据添加失败!" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			 })); 
}
function addRunMany(form,id){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addTalkGroup.action',  
				 params : {
				 id:id,
				 name:form.findField('name').getValue()+id,
				 alias:form.findField('alias').getValue(),
				 callmode:form.findField('callmode').getValue(),
				 type:form.findField('type').getValue(),
				 priority:form.findField('priority').getValue(),
				 slot:form.findField('slot').getValue()?1:0,
				 maxcalltime:form.findField('maxcalltime').getValue()/*,
				 roamen:form.findField('roamen').getValue()['roamen']*/

				 
			 },  
			 method : 'POST',
			 waitTitle : '请等待' ,  
			 waitMsg: '正在提交中', 
			 async:false,
			 success : function(response, opts) {  
				 var rs = Ext.decode(response.responseText); 
				 if(rs.success)
				 {
				 success=true;
				 store.reload();
				 addWindow.hide();
				 }
				 else
				 {
					 success=false;
					 
				 }
			 },

			 failure: function(response) {

				 success=false;
				
			 }  
			 })); 
	 return success;
}
//导出excel数据
function Excel_btn() { 
}
function Detail(){
	record = grid.getSelectionModel().getLastSelected();
    var detailForm=new Ext.FormPanel({
		frame :true,
		bodyBorder: 0, 
		autoWidth:true,
		autoHeight : true,
		items:[{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'唯一属性',
			layout:'form',
			items:[{
					xtype:'numberfield',fieldLabel:'<span style="color:red">用户组ID</span>',name:'id',allowBlank: true,
					labelWidth:150
				},{
					layout:'column',border:0,
					items:[{
						columnWidth: .5,
						border:0,
						items:[{
							xtype:'numberfield',fieldLabel:'<span style="color:red">ID范围</span>',name:'idStart',allowBlank: true,
							hidden:true,labelWidth:150
						}]
					},{
						columnWidth: .3,
						border:0,
						items:[{
							xtype:'numberfield',fieldLabel:'',name:'idEnd',allowBlank: true,
							hidden:true,labelWidth:1
						}]
					},{
						columnWidth: .2,
						border:0,
						items:[{
							xtype:'displayfield',fieldLabel:'',name:'say',allowBlank: true,
							hidden:true,labelWidth:1,value:'<span style="color:red">[最多创建100个]</span>'
						}]
					}]
				},{
					xtype:'textfield',fieldLabel:'名称',name:'name',
					labelWidth:150
				},{
					xtype:'textfield',fieldLabel:'别名',name:'alias',
					labelWidth:150
				},{
					xtype:'combobox',fieldLabel:'组类型',name:'type',
					labelWidth:150,
	        		store:[[0,'0'],[1,'1']],
	        		queryMode:'local',value:0
				}]},{
					xtype:"fieldset",
					style:'margin: 5 10 5 10',
				title:'其他参数',
				layout:'form',
				items:[/*{
					xtype:'radiogroup',fieldLabel:'漫游使能',name:'roamen',id:'roamen',labelWidth:150,layout:'column',
					items: [
				            { boxLabel: '是', name:'roamen', inputValue: '1',checked: true },
				            { boxLabel: '否', name:'roamen', inputValue: '0'}
				        ]
				},*/{
					xtype:'numberfield',fieldLabel:'优先级',name:'priority',
					labelWidth:150
				},{
					xtype:'numberfield',fieldLabel:'通话时长',name:'maxcalltime',
					labelWidth:150
				},{
					xtype:'combobox',fieldLabel:'时隙',name:'slot',
					labelWidth:150,
	        		store:[[false,'0时隙'],[true,'1时隙']],
	        		queryMode:'local',value:0
				},{
					xtype:'combobox',fieldLabel:'呼叫类型',name:'callmode',
					labelWidth:150,
	        		store:[[0,'随系统'],[1,'静态'],[2,'动态'],[1,'动静态交集']],
	        		queryMode:'local',value:0
				}]
			}]
		});
	
		var DWin=new Ext.Window({
			id:'detail',
			title:'用户组详细信息',
			border:false,
			 width:700,
			 autoHeight:true,
			 plain:true,
			 modal:true,
			 layout: 'fit',
			 items:detailForm,
			 closable:true
			// icon:'../../resources/images/tab/home.png'
		})	
	DWin.show();
	/*DWin.maximize();*/
	detailForm.form.loadRecord(record);
	setRadioChecked(record);
}
//编辑归属基站
function editTGBS(){
	var TGBSGrid=Ext.create('Ext.grid.Panel',{
		region:'center',
		store:groupBsStore,
		trackMouseOver: false,
		renderTo: Ext.getBody(),
		disableSelection: false,
		loadMask: true,  
		columns:[
		         new Ext.grid.RowNumberer({width:50,text:'#'}), 
		         {text: "基站ID", width: 100, dataIndex: 'basestationid', sortable: true},
		         {text: "基站名称", flex:1, dataIndex: 'name', sortable: true},
		         {text: "操作", width: 120, dataIndex: 'name', sortable: true,
		        	 renderer:function(value,metaData,record){
		        	 var str="<img src='../resources/images/picture/delete.png'>" +
		        	 		"<a href='#' onclick=delGroupBs("+record.get('homegroupid')+","+record.get('basestationid')+")>删除</a>";
		        	 return str;
		         }}
		         ],
		        /* plugins : [cellEditing],*/
		         frame:false,
		         border:false,
		         forceFit: true,
		         columnLines : true, 
		         height:document.documentElement.clientHeight,
		         
		         /*selModel: selModel,*/
		         viewConfig: {
		             stripeRows: true
		         },

		         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
		         dockedItems: [{
		             xtype: 'toolbar',
		             dock: 'top',
		             items:[{text:'创建',
		            	 iconCls:'add',
		            	 handler:addTGBS}]
		         },{
		             dock: 'bottom',
		             xtype: 'pagingtoolbar',
		             //style:'background: skyblue',
		             store: groupBsStore, 
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
		          	 }]

		          	
		         }]

	});
	var win=new Ext.Window({
		title:'用户组限制基站列表',
		border:false,
		layout:'border',
		height:300,
		width:550,
		modal:false,
		items:TGBSGrid,
		closable:true,
		closeAction:'close'
	})
	record = grid.getSelectionModel().getLastSelected();
	groupBsStore.on('beforeload', function (store, options) {  
	    var new_params = { 
	    		homegroupid: record.get('id')
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	groupBsStore.load()
	win.show();
	
	
}
groupOtherBsStore.on('load',function(){
	for(var i =0;i<groupOtherBsStore.getCount();i++){
		groupOtherBsStore.getAt(i).set("name","ID:"+groupOtherBsStore.getAt(i).get('id')+"->"+groupOtherBsStore.getAt(i).get("name"));

	}
})
//添加归属基站
function addTGBS(){
	var data = grid.getSelectionModel().getSelection();
	if (data.length ==0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请至少选择一个组!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	}
	
	
	
	
	/*record = grid.getSelectionModel().getLastSelected();
	var vaForm=new Ext.FormPanel({
		region:'center',
		frame :true,
		bodyBorder: 0, 
		autoWidth:true,
		height:450,
		layout:'form',
		items:[{
			xtype:'combobox',fieldLabel:'选择基站',labelWidth:100,name:'basestationid',	
			 allowBlank: false,msgTarget : 'side',store:groupOtherBsStore,
			 queryMode:'remote',editable:false,emptyText:'请选择...',
			 valueField: 'id',displayField: 'name'
			 
		     }]
	})*/
	var win=new Ext.Window({
		title:'用户组限制基站',
		border:false,
		layout:'border',
		height:300,
		width:400,
		modal:false,
		items:bs_Grid,
		closable:true,
		iconCls:'add',
		dragable:false,
		closeAction:'close',
		buttons:[{text:'保存',
			handler:function(){
				var data_bs = bs_Grid.getSelectionModel().getSelection();
				if (data_bs.length ==0) {  
					Ext.MessageBox.show({  
						title : "提示",  
						msg : "请至少选择一个基站!" , 
						icon: Ext.MessageBox.ERROR  
					});  
					return;  
				};
			var myMask = new Ext.LoadMask(Ext.getBody(), { 
		        msg: '正在验证数据，请稍后！',  
		        //loadMask: true, 
		        removeMask: true //完成后移除  
		    });
			myMask.show();
			win.hide();
			var homegroupids = [],bsids=[];  
			Ext.Array.each(data, function(record) {  
				var homegroupid=record.get('id');  
				// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
				if(homegroupid){homegroupids.push(homegroupid);}  

			}); 
			
			Ext.Array.each(data_bs,function(record){
				var bsid=record.get('id');
				if(bsid){bsids.push(bsid);}
			});
			 Ext.Ajax.request({  
				 url : '../controller/addTGBS.action',  
				 params : {
					 homegroupids:homegroupids.join(','),
					 bsids:bsids.join(',')
			 },  
			 method : 'POST',
			 success : function(response) { 
				 var rs=Ext.decode(response.responseText);
				 myMask.hide();
				 if(rs.success)
				 {
					 groupBsStore.reload();
				 Ext.example.msg("提示",rs.message);
				 /*win.hide();*/
				 }
				 else
				 {
					 Ext.MessageBox.show({  
						 title : "提示",  
						 msg : rs.message , 
						 icon: Ext.MessageBox.ERROR  
					 }); 
				 }
			 },

			 failure: function(response) {

				 myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "数据修改失败!" , 
					 icon: Ext.MessageBox.ERROR 
				 }); 
			 }  
			 });
		}}]
	})
	record = grid.getSelectionModel().getLastSelected();
	var homegroupid=-1;
	if(data.lenght>1){
		homegroupid=-1
	}else{
		homegroupid=record.get('id');
	}
	groupOtherBsStore.on('beforeload', function (store, options) {  
	    var new_params = { 
	    		 homegroupid:  homegroupid
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	
	groupOtherBsStore.load();
	
	win.show();
}
//删除归属基站
function delGroupBs(homegroupid,basestationid){
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在验证数据，请稍后！',  
        //loadMask: true, 
        removeMask: true //完成后移除  
    });
	myMask.show();
	 Ext.Ajax.request({  
		 url : '../controller/delTGBS.action',  
		 params : {
		 homegroupid:homegroupid,
		 basestationid:basestationid
	 },  
	 method : 'POST',
	 success : function(response) { 
		 var rs=Ext.decode(response.responseText);
		 myMask.hide();
		 if(rs.success)
		 {
			 groupBsStore.reload();
		 Ext.example.msg("提示",rs.message);
		 }
		 else
		 {
			 Ext.MessageBox.show({  
				 title : "提示",  
				 msg : rs.message , 
				 icon: Ext.MessageBox.ERROR  
			 }); 
		 }
	 },

	 failure: function(response) {

		 myMask.hide();
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "数据修改失败!" , 
			 icon: Ext.MessageBox.ERROR 
		 }); 
	 }  
	 });
}
//通知中心
function tellCenter(){
	Ext.Ajax.request({  
		url : '../controller/tellCenter.action',  
		params : {  
		table:'hometerminal'
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
}
//设置radiogroup的值
function setRadioChecked(record){
	/*Ext.getCmp('roamen').down('radio').setValue(record.get('roamen'));*/
}