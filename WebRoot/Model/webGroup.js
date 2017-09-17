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
checkUserPower();
//创建Model
Ext.define('MemberGroup',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'groupname'},
	        {name: 'groupinfo'},
	        {name: 'level'},
	        {name: 'createtime'}
	        ], 
	        idProperty : 'id'
});
Ext.define('User',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name:'vpn'},
	        {name: 'text'},
	        {name: 'url'},
	        {name: 'hidden'},
	        {name:'ico'},
	        {name: 'icons'},
	        {name: 'pmenu'}
	        ]
})
var groupMenuStore = Ext.create('Ext.data.TreeStore',{
	remoteSort: true,
	model:'User',	
	proxy: {
	type: 'ajax',
	url : '../data/MemberGroupMenu.action'
    },
    folderSort: true 
});
var ok_store=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'value'}],
	data:[
	      {id:'0',value:'显示'},
	      {id:'1',value:'隐藏'}
	      ]
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'MemberGroup',	
	remoteSort: true,
//	设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../data/MemberGroupList.action',
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
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel',{
	width:60
}); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     });
//创建Action
var searchAction;
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除',
	disabled:delWebGroup?false:true,
	handler:del_btn
});
var updateAction = Ext.create('Ext.Action', {
    iconCls:'update',
    text: '修改',
    disabled:updateWebGroup?false:true,
    handler: update_btn
    }
);
var addAction=Ext.create('Ext.Action',{
	text:' 添加',
	disabled:addWebGroup?false:true,
	iconCls:'add',
    handler:add
});
var editPowerAction=Ext.create('Ext.Action',{
	text:' 编辑权限',
	disabled:editGroupPower?false:true,
	iconCls:'power',
    handler:editPower
});


//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        addAction,
        deleteAction,
        updateAction,'-',
        editPowerAction

    ]
});
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>权限管理>>角色管理',
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
	         {text: "会员组", width: 250, dataIndex: 'groupname', sortable: true}, 
	         {text: "会员组描述", flex: 1, dataIndex: 'groupinfo', sortable: true},
	         /*{text: "会员组级别", width: 80, dataIndex: 'level', sortable: true},*/
	         {text: "创建时间", width: 150, dataIndex: 'createtime', sortable: true}
	         
	         ],
	         plugins : cellEditing,
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

	         emptyText:'<h1 align="center" style="color:red"><span><img src="../resources/images/picture/nodata.png"></span><span>对不起，没有查询到数据</span></h1>',
	        
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [addAction, '-',
	                     updateAction,'-',
	                     deleteAction,'-',
	                     editPowerAction,{

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
var treegrid=Ext.create("Ext.tree.Panel",{
	region:'center',
	autoWidth:true,  
	useArrows :false,
	height:document.documentElement.clientHeight,
    viewConfig: {
        stripeRows: true,
        loadMask: true
    },
	columnLines : true, 
	renderTo: Ext.getBody(),  
	collapsible: false,   
	rootVisible: false,  
	store: groupMenuStore,  
	draggable: true,// 是否支持拖拽效果
	multiSelect: true,  
	singleExpand: false, 
	forceFit: false,
	columns:[ 
	         {xtype:'treecolumn',text:'功能名称',flex:1,dataIndex:'text',sortable:true        	 
	         },/*{text: '链接',width:300,dataIndex: 'url',sortable: false
	         },*/
	         {text: '标识', width:300,dataIndex: 'vpn',hidden:true
	         },{text:'显示',dataIndex: 'hidden',flex:1,sortable: false,
	        	 editor : {  

	        	 xtype : 'combobox',
	        	 store : ok_store,
	        	 editable : false,
	        	 valueField: 'id', 
	        	 displayField : 'value',
	        	 value:'0',
	        	 queryMode : 'local',
	        	 allowBlank : false

	         } ,
	         renderer:function(v,m){
	        	 if(v=="0"){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	        	 
	         }/*,{text:'功能名称',width:55,dataIndex:'text',sortable:false,
	        	 renderer:function(v,m,record){
	             update(record.get("vpn"),record.get("hidden"))
	         }
	         }*/,{
	                header: '<span style="color:red">操作</span>',
	                width: 55,
	                menuDisabled: true,
	                xtype: 'actioncolumn',
	                tooltip: '保存修改后的记录',
	                align: 'center',
	                iconCls:'save',
	    
	                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                             update(record.get("vpn"),record.get("hidden"))
	                }
	                // Only leaf level tasks may be edited
//	                isDisabled: function(view, rowIdx, colIdx, item, record) {
//	                    return !record.data.leaf;
//	                }
	            }
	         ],
	         plugins : Ext.create('Ext.grid.plugin.CellEditing', { 
	        		        clicksToEdit: 2
	        		     }),
	      
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'bottom',
	             items: ['-',{
	        	        	 text:"刷新数据",
	        	        	 id:'refresh',
	        	        	 xtype: 'button',
	        	        	 iconCls:'refresh',
	        	        	 tooltip:'刷新数据',
	        	        	 handler: function(){groupMenuStore.reload()}
	        	         }]
	         }]
})
var powerPanel=Ext.create('Ext.FormPanel',{
	width:750,
	autoHeight:true,
	layout:'form',
	border:false,
	frame:false,
	id:'powerCheck',
	items:[{
		xtype:"fieldset",
		style:'margin: 5 10 5 10',
		title:'系统管理',
		frame:true,
		items:[{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'系统配置',
			frame:true,
			items:[{
				 xtype:'radiogroup',fieldLabel:'修改配置',name:'updateConfig',id:'updateConfig', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'updateConfig', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateConfig', inputValue: '0'}]

			 }]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'基站配置',

			frame:true,
			layout:'column',
			items:[{
				 xtype:'radiogroup',fieldLabel:'添加',name:'addBs',id:'addBs', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'addBs', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addBs', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateBs',id:'updateBs', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'updateBs', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateBs', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delBs',id:'delBs', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'delBs', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delBs', inputValue: '0'}]

			 }]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'终端用户',

			frame:true,
			layout:'column',
			items:[{
				 xtype:'radiogroup',fieldLabel:'添加',name:'addRadioUser',id:'addRadioUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'addRadioUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addRadioUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateRadioUser',id:'updateRadioUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'updateRadioUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateRadioUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delRadioUser',id:'delRadioUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'delRadioUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delRadioUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'复活',name:'reviveRadio',id:'reviveRadio', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'reviveRadio', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'reviveRadio', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'遥晕',name:'stunRadio',id:'stunRadio', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'stunRadio', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'stunRadio', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'遥毙',name:'killRadio',id:'killRadio', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'killRadio', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'killRadio', inputValue: '0'}]

			 }]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'用户组',
		
			frame:true,
			layout:'column',
			items:[{
				 xtype:'radiogroup',fieldLabel:'添加',name:'addUserGroup',id:'addUserGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'addUserGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addUserGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateUserGroup',id:'updateUserGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'updateUserGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateUserGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delUserGroup',id:'delUserGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'delUserGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delUserGroup', inputValue: '0'}]

			 }]
		}]
	},{
		xtype:"fieldset",
		style:'margin: 5 10 5 10',
		title:'权限管理',
	
		frame:true,
		items:[{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'用户管理',
			
			frame:true,
			layout:'column',
			items:[{
				 xtype:'radiogroup',fieldLabel:'添加',name:'addWebUser',id:'addWebUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'addWebUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addWebUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateWebUser',id:'updateWebUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'updateWebUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateWebUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delWebUser',id:'delWebUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'delWebUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delWebUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'编辑权限',name:'editUserPower',id:'editUserPower', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'editUserPower', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'editUserPower', inputValue: '0'}]

			 }]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'角色管理',
			
			frame:true,
			layout:'column',
			items:[{
				 xtype:'radiogroup',fieldLabel:'添加',name:'addWebGroup',id:'addWebGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'addWebGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addWebGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateWebGroup',id:'updateWebGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'updateWebGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateWebGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delWebGroup',id:'delWebGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'delWebGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delWebGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'编辑权限',name:'editGroupPower',id:'editGroupPower', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',
				 items:[{ boxLabel: '是', name:'editGroupPower', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'editGroupPower', inputValue: '0'}]

			 }]
		}]
	}]
	
})
var power=Ext.create('Ext.Panel',{
	region:'center',
	
	layout:'form',
	border:0,
	bodyStyle :'overflow-x:visible;overflow-y:scroll', //隐藏水平滚动条
	items:[powerPanel],
	buttons:[]
	
	
})
var tabPanel=Ext.create("Ext.Panel",{
		region:"center",
		padding:0,
		border:false,
		//plain:true,
		layout:'fit',  
		frame: false, 
		enableTabScroll:true,
		items:[{
			id:'rolePower',
			layout:'border',
			height:350,
			items:power
		}]
	});
/*tabPanel.on('tabchange', function(tabPanel, newCard, oldCard) {
	if(newCard.id=="role") {
		groupMenuStore.reload();
	}
	else{
		getGroupPower();
	}
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
	store.load({params:{start:0,limit:30}}); 
	getGroupPower();
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
					var groupId=record.get('id');  
					//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
					if(groupId){ids.push(groupId);}  

				});  

				Ext.Ajax.request({  
					url : '../power/del.action',  
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
							Ext.example.msg("提示","删除会员组成功");
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
		//defaultType : 'textfield',//表单默认类型
		frame : false,
		bodyBorder: 0, 
		bodyPadding: 20,
		style:"background: #FFFFFF;border:0", 
		labelStyle: 'font-weight:bold' ,
		width : 400,
		buttonAlign:'center',
		//autoHeight : true,
		height:180,
		items : //元素
			[{
				 xtype:'numberfield',
				 fieldLabel:'组ID',
				 name: 'id',
				 minValue:1000,
				 maxValue:10000,
				 readOnly:true,
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },
			 {
				 xtype:'textfield',
				 fieldLabel:'会员组名',
				 name: 'groupname',
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 xtype:'textarea',
				 fieldLabel:'会员组描述',
				 name: 'groupinfo',
				 allowBlank: true,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 }/*,{
				 xtype:'numberfield',
				 fieldLabel:'会员组级别',
				 name: 'level',
				 allowBlank: true,
				 disable:false,
				 blankText: '不能为空',
				 minValue:0,
				 maxValue:20,
				 msgTarget : 'side'
			 }*/
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
		width:400,
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
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证数据，请稍后！',  
	                     //loadMask: true, 
	                     removeMask: true //完成后移除  
	                 });
		        	 
		        	 if(form.isValid()){
		        		 myMask.show();
		        	 form.submit(									
		        			 Ext.Ajax.request({  
		        				 url : '../power/update.action',  
		        				 params : {
		        				 id:record.get("id"),
		        				 groupname:form.findField('groupname').getValue(),
		        				 groupinfo:form.findField('groupinfo').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 timeout:20000,
		        			 
		        			 
		        			 success : function(response) { 
		        				 myMask.hide();
		        				 var rs = Ext.decode(response.responseText); 
		        				 if(rs.success){
		        				 store.reload();
		        				 updateWindow.hide();
		        				 Ext.example.msg("提示","修改数据成功");
		        				 }
		        				 else{
		        					 Ext.MessageBox.show({  
			        					 title : "提示",  
			        					 msg : rs.message, 
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
		//defaultType : 'textfield',//表单默认类型
		frame : false,
		bodyBorder: 0, 
		bodyPadding: 20,
		style:"background: #FFFFFF",  
		labelStyle: 'font-weight:bold' ,		
		width : 400,
		buttonAlign:'center',
		height : 180,
		items : //元素
			[
			 {
				 xtype:'numberfield',
				 fieldLabel:'组ID',
				 name: 'id',
				 minValue:1000,
				 maxValue:10000,
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 xtype:'textfield',
				 fieldLabel:'会员组名称',
				 name: 'groupname',
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 xtype:'textarea',
				 fieldLabel:'会员组描述',
				 name: 'groupinfo',
				 allowBlank: true,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 }/*,{
				 xtype:'numberfield',
				 fieldLabel:'会员组级别',
				 name: 'level',
				 allowBlank: false,
				 blankText: '不能为空',
				 minValue:0,
				 maxValue:20,
				 msgTarget : 'side'
			 }*/
			 ]

	});
	
	if(!addWindow){
	addWindow = new Ext.Window({
		width:400,
		closable: false ,
		autoHeight:true,
		modal:true,
		layout: 'fit',
		title:"添加用户",
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
		        				 url : '../power/add.action',  
		        				 params : {
		        			     id:form.findField('id').getValue(),
		        				 groupname:form.findField('groupname').getValue(),
		        				 groupinfo:form.findField('groupinfo').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 success : function(response, opts) { 
		        				 myMask.hide();
			     					var rs=Ext.decode(response.responseText);
			     					// 当后台数据同步成功时  
			     					if (rs.success) {  
			     							 addForm.form.reset();		        				
			     							Ext.example.msg("提示","添加会员组成功");
					    		        	 addWindow.hide();
					        				 store.reload();

			     					} else { 
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
		        					 msg : "数据添加失败!" , 
		        					 icon: Ext.MessageBox.ERROR  
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
//编辑权限
function editPower(){
	record = grid.getSelectionModel().getLastSelected(); 
	var powerWin=new Ext.Window({
		width:700,
		closable: false ,
		autoHeight:true,
		modal:true,
		layout: 'fit',
		title:"角色权限分配",
		iconCls:'edit',
		items:tabPanel,
		buttons:[{
			text:'全部选中',
			handler:function(){
			var mask = new Ext.LoadMask(Ext.getBody(), {  
	            msg: '正在操作中,初始化数据时需要一定时间,请耐心等待',  
	            removeMask: true //完成后移除  
	        });
			mask.show();
			var item1=Ext.getCmp('powerCheck').items;
	    	item1.each(function(item2){
	    		
	    		item2.items.each(function(item3){
	    			item3.items.each(function(item4){
	    				item4.items.each(function(item){
	    					item.setValue(1);
	    				})
	    			})})});
	    	mask.hide();
		}
		},{
			text:'保存权限',
			/*disabled:power_update?false:true,*/
			handler:function(){
			var data = grid.getSelectionModel().getSelection(); 
			if (data.length == 0) {  
				Ext.MessageBox.show({  
					title : "提示",  
					msg : "请先选择会员组!" , 
					icon: Ext.MessageBox.INFO 
				});  
				return;  
			}
			var form=powerPanel.getForm();
			var record = grid.getSelectionModel().getLastSelected(); 
			var mask = new Ext.LoadMask(Ext.getBody(), {  
	            msg: '正在操作中,请耐心等待！',  
	            removeMask: true //完成后移除  
	        });
			if(form.isValid()){
				mask.show();
				form.submit(Ext.Ajax.request({
					url:'../controller/updateGroupPower.action',
					params : {		
					groupid:record.get('id'),

					updateConfig:form.findField('updateConfig').getValue()['updateConfig'],

					addBs:form.findField('addBs').getValue()['addBs'],
					updateBs:form.findField('updateBs').getValue()['updateBs'],
					delBs:form.findField('delBs').getValue()['delBs'],

					addRadioUser:form.findField('addRadioUser').getValue()['addRadioUser'],
					updateRadioUser:form.findField('updateRadioUser').getValue()['updateRadioUser'],
					delRadioUser:form.findField('delRadioUser').getValue()['delRadioUser'],
					
					reviveRadio:form.findField('reviveRadio').getValue()['reviveRadio'],
					stunRadio:form.findField('stunRadio').getValue()['stunRadio'],
					killRadio:form.findField('killRadio').getValue()['killRadio'],

					addUserGroup:form.findField('addUserGroup').getValue()['addUserGroup'],
					updateUserGroup:form.findField('updateUserGroup').getValue()['updateUserGroup'],
					delUserGroup:form.findField('delUserGroup').getValue()['delUserGroup'],

					addWebUser:form.findField('addWebUser').getValue()['addWebUser'],
					updateWebUser:form.findField('updateWebUser').getValue()['updateWebUser'],
					delWebUser:form.findField('delWebUser').getValue()['delWebUser'],
					editUserPower:form.findField('editUserPower').getValue()['editUserPower'],

					addWebGroup:form.findField('addWebGroup').getValue()['addWebGroup'],
					updateWebGroup:form.findField('updateWebGroup').getValue()['updateWebGroup'],
					delWebGroup:form.findField('delWebGroup').getValue()['delWebGroup'],
					editGroupPower:form.findField('editGroupPower').getValue()['editGroupPower']
				},  
	   			 method : 'POST',		 
				 success : function(response,o) {  
	   				var rs = Ext.decode(response.responseText); 
					 if(rs.success){	        				
					 Ext.example.msg("提示",rs.message);
					 mask.hide();
					 }
					 else
					 {
						 mask.hide();
						 Ext.MessageBox.show({  
								title : "提示",  
								msg : rs.message, 
								icon: Ext.MessageBox.INFO  
							});  
					 }
				 },
				 failure: function(response,o) {
					 var rs = Ext.decode(response.responseText); 
					 mask.hide();
					 Ext.MessageBox.show({  
							title : "提示",  
							msg : rs.message, 
							icon: Ext.MessageBox.INFO  
						}); 
				 }
				}));}}
		},{
			text:'取消',
			handler:function(){
			powerWin.hide();
		}
		}]
	})
   powerWin.show();
	getGroupPower();
/*	groupMenuStore.on('beforeload', function (store, options) {  
	    var new_params = { groupid: record.get('id')};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	groupMenuStore.reload();
	var main=Ext.getCmp("main");
	var n = main.getComponent("power");
	
	if(!n){
		getGroupPower();
	}else{
		
		groupMenuStore.reload();
	}*/
}
//修改数据
function update(vpn,hidden){
    var records = groupMenuStore.getUpdatedRecords();// 获取修改的行的数据，无法获取幻影数据  
    var phantoms=groupMenuStore.getNewRecords( ) ;//获得幻影行  
    record = grid.getSelectionModel().getLastSelected(); 
    records=records.concat(phantoms);//将幻影数据与真实数据合并  
    var mask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在操作中,请耐心等待！',  
        removeMask: true //完成后移除  
    });
    mask.show();
    Ext.Ajax.request({  
        url : '../controller/updateGroupMenu.action',  
        params : {  
           vpn:vpn,
           hidden:hidden,
           groupid: record.get('id')
        },  
        method : 'POST',  
//        timeout : 2000,  

        success : function(response, opts) {  
        	mask.hide();
            var success = Ext.decode(response.responseText).success;  
            // 当后台数据同步成功时  
            if (success) {  
               //store.reload();  
           	   Ext.Array.each(records, function(record) {  
                      // data.push(record.data);  
                      record.commit();// 向store提交修改数据，页面效果 
                  }); 
           	   Ext.example.msg("提示","数据修改成功，会员菜单同步成功");
            } else {  
                Ext.MessageBox.show({  
                    title : "提示",  
                    msg : "数据修改失败!"  
                        // icon: Ext.MessageBox.INFO  
                    });  
            }  
        },
        failure: function(response,o) {
			 mask.hide();
			 Ext.MessageBox.show({  
					title : "提示",  
					msg : "错误", 
					icon: Ext.MessageBox.ERROR 
				});
		 }
    });
}
//获取会员组权限
function getGroupPower(){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 
		
		var form=powerPanel.getForm();
		var mask = new Ext.LoadMask(Ext.getBody(), {  
			msg: '正在操作中,初始化数据时需要一定时间,请耐心等待',   
            removeMask: true //完成后移除  
        });
		mask.show();
		Ext.Ajax.request({
			url:'../controller/groupPower.action',
			params : {
			    groupid:record.get('id')
		     },
			 method : 'POST',		 
			 success : function(response,o) { 
				mask.hide();
   				var rs = Ext.decode(response.responseText); 	
   				Ext.getCmp('updateConfig').down('radio').setValue(rs.updateConfig);

   				Ext.getCmp('addBs').down('radio').setValue(rs.addBs);
   				Ext.getCmp('updateBs').down('radio').setValue(rs.updateBs);
   				Ext.getCmp('delBs').down('radio').setValue(rs.delBs);

   				Ext.getCmp('addRadioUser').down('radio').setValue(rs.addRadioUser);
   				Ext.getCmp('updateRadioUser').down('radio').setValue(rs.updateRadioUser);
   				Ext.getCmp('delRadioUser').down('radio').setValue(rs.delRadioUser);
   				
   				Ext.getCmp('stunRadio').down('radio').setValue(rs.stunRadio);
   				Ext.getCmp('reviveRadio').down('radio').setValue(rs.reviveRadio);
   				Ext.getCmp('killRadio').down('radio').setValue(rs.killRadio);

   				Ext.getCmp('addUserGroup').down('radio').setValue(rs.addUserGroup);
   				Ext.getCmp('updateUserGroup').down('radio').setValue(rs.updateUserGroup);
   				Ext.getCmp('delUserGroup').down('radio').setValue(rs.delUserGroup);

   				Ext.getCmp('addWebUser').down('radio').setValue(rs.addWebUser);
   				Ext.getCmp('updateWebUser').down('radio').setValue(rs.updateWebUser);
   				Ext.getCmp('delWebUser').down('radio').setValue(rs.delWebUser);
   				Ext.getCmp('editUserPower').down('radio').setValue(rs.editUserPower);

   				Ext.getCmp('addWebGroup').down('radio').setValue(rs.addWebGroup);
   				Ext.getCmp('updateWebGroup').down('radio').setValue(rs.updateWebGroup);
   				Ext.getCmp('delWebGroup').down('radio').setValue(rs.delWebGroup);
   				Ext.getCmp('editGroupPower').down('radio').setValue(rs.editGroupPower);
				
			 },
			 failure: function(response,o) {
				 mask.hide();
				 Ext.MessageBox.show({  
						title : "提示",  
						msg : "失败", 
						icon: Ext.MessageBox.INFO  
					});
			 }
		})
	}
}
function getcookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split(";");
	for(var i=0;i<arrcookie.length;i++){
		var arr=arrcookie[i].split("=");
		if(arr[0].match(name)==name)return arr[1];
	}
	return "";
}
