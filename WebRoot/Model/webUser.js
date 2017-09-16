Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../resources/ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging'
             ]		 
);
checkUserPower();
checkGroupPower();
//创建Model
Ext.define('User',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'username'},
	        {name: 'groupid'},
	        {name: 'groupname'},
	        {name: 'createtime'},
	        {name: 'name'},
	        {name: 'sex'},
	        {name: 'birthday'},
	        {name: 'tel'},
	        {name: 'phone'},
	        {name: 'address'},
	        {name: 'email'},
	        {name: 'qq'}
	        ],allowBlank: false,
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'User',	
	remoteSort: true,
//	设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../data/WebUsers.action',
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
var groupStore=Ext.create('Ext.data.Store',{
	remoteSort: true,
	fields:[{name:'id',name:'groupname'}],
	proxy: {
	type:'ajax',
	url:'../data/MemberGroupList.action',
	reader:{
	type:'json',
	root:'items'
    },
    simpleSortModel: true
   
}
})
var ok_store=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'value'}],
	data:[
	      {id:'0',value:'显示'},
	      {id:'1',value:'隐藏'}
	      ]
})
var sexStore=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'value'}],
	data:[
	      {id:'1',value:'男'},
	      {id:'2',value:'女'}
	      ]
})
//创建Model
Ext.define('groupPower',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'actionname'},
	        {name: 'action'},
	        {name: 'groupid'},
	        {name: 'createtime'}
	        ],
	        idProperty : 'id'
})
//创建数据源
var groupPowerStore = Ext.create('Ext.data.Store',{
	model:'groupPower',	
	remoteSort: true,
//	设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../power/getUserPower.action',
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
var addAction=Ext.create('Ext.Action',{
	iconCls:'add',
	text:'添加会员',
	tooltip:'添加数据',
	disabled:addWebUser?false:true,
	handler:add
});
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除会员',
	tooltip:'删除数据',
	disabled:delWebUser?false:true,
	handler:del_btn
});
var updateAction = Ext.create('Ext.Action', {
    iconCls:'update',
    text: '修改会员信息',
    tooltip:'修改数据',
    disabled:updateWebUser?false:true,
    handler: update_btn
    }
);
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	tooltip:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var editPowerAction=Ext.create('Ext.Action',{
	text:' 编辑权限',
	iconCls:'power',
    handler:editPower
});
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
    handler:function(){store.loadPage(1);}
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        addAction,
        deleteAction,
        updateAction,'-',
        editPowerAction,
        refreshAction
    ]
});
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>权限管理>>用户管理',
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
	         {text: "用户名", width: 120, dataIndex: 'username', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "姓名", width: 120, dataIndex: 'name', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "性别", width: 60, dataIndex: 'sex', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "移动电话", width: 120, dataIndex: 'phone', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "归属会员组", flex: 1, dataIndex: 'groupname', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "时间", width: 150, dataIndex: 'createtime', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }  },{
	        	 text:'<span style="color:green">操作</span>',
	        	 align : 'center',
	        	 width:270,
	        	 dataIndex:'username',
	        	 renderer:function(v,m){
	        	 var str="<img src='../resources/images/picture/detail.png'><a href='#' onclick=Detail('"+v+"')>详细信息</a>";
	        	 if(updateWebUser){str+="&nbsp;&nbsp;<img src='../resources/images/picture/edit.png'><a href='#' onclick=update_btn()>修改信息</a>";}
	        	 else{str+="&nbsp;&nbsp;<img src='../resources/images/picture/edit.png'><a href='#' style='color:gray'>修改信息</a>";}
	        	 if(delWebUser){str+="&nbsp;&nbsp;<img src='../resources/images/picture/delete.png'><a href='#' onclick=del_btn()>删除信息</a>";}
	        	 else{str+="&nbsp;&nbsp;<img src='../resources/images/picture/delete.png'><a href='#' style='color:gray'>删除信息</a>";}
	        	 return str;
	         }
	         }
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
	        
	         emptyText:'<h1 align="center" style="color:red"><span><img src="../../resources/images/other/nodata.png"></span><span>对不起，没有查询到数据</span></h1>',
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'bottom',
	             items: [ {fieldLabel:'用户名',xtype:'textfield',name:'username',id:'username',labelWidth: 50,width:150,emptyText:'填写用户名' },
	         	         {fieldLabel:'会员组',
	            	      id:'groupid',
	            	      labelWidth:50,
	            	      width:170,
	            	     xtype:'combobox',
	     				 name:'groupid',
	     				 allowBlank: false,
	     				 msgTarget : 'side',
	     				 store:groupStore,
	     				 queryMode:'remote',
	     				 editable:false,
	     				 emptyText:'请选择...',
	     				 valueField: 'id',  
	     				 displayField: 'groupname' 
	            	         },
	        	         {fieldLabel:'起始时间',
	        	        	 xtype:'datetimefield',
	        	        	 name:'f_datetime',
	        	        	 format:'Y-m-d H:i:s',
	        	        	 labelWidth: 80,width:250},
	        	         {fieldLabel:'结束时间',
	        	        		 xtype:'datetimefield',
	        	        		 name:'l_datetime',
	        	        		 value:new Date(),
	        	        		 format:'Y-m-d H:i:s',
	        	        		 labelWidth: 80,width:250},
	        	         searchAction,{
	        	        	 text:'清除',
	        	        	 iconCls:'clear',
	        	        	 tooltip:'清除输入的查询数据',
	        	        	 handler: function(){
	        	        	 Ext.getCmp("groupid").reset();
	        	        	 Ext.getCmp("username").reset();
	        	         }}]
	         },{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [addAction, '-',
	                     updateAction,'-',
	                     deleteAction,'-',
	                     editPowerAction,'-',
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
store.on('beforeload', function (store, options) {  
    var new_params = { username: Ext.getCmp('username').getValue(),groupid:Ext.getCmp('groupid').getValue()};  
    Ext.apply(store.proxy.extraParams, new_params);  

});

//会员信息详情
var memberForm=new Ext.FormPanel({
	title:'用户基本资料',
	defaultType : 'textfield',//表单默认类型
	frame : false,
	bodyBorder: 0, 
	bodyPadding: 20,
	style:"background: #FFFFFF", 
	labelStyle: 'font-weight:bold' ,
	width : 400,
	buttonAlign:'center',
	autoHeight : true,
	layout: {
        type:'vbox',
        padding:'5',
        pack:'center',//垂直居中
        align:'center'//水平居中
    },
	items : //元素
		[
		 {
			 fieldLabel:'用户名[<span style="color:red">*</span>]',
			 name: 'username',
			 allowBlank: false,
			 labelAlign:'right',
			 blankText: '不能为空',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'密&nbsp;码[<span style="color:red">*</span>]',
			 name:'password',
			 labelAlign:'right',
			 allowBlank: false,
			 msgTarget : 'side'
		 },{
			 fieldLabel:'归属组[<span style="color:red">*</span>]',
			 xtype:'combobox',
			 name:'groupid',
			 allowBlank: false,
			 labelAlign:'right',
			 msgTarget : 'side',
			 store:groupStore,
			 queryMode:'remote',
			 editable:false,
			 emptyText:'请选择...',
			 valueField: 'id',  
			 displayField: 'groupname' 
		 },{
			 fieldLabel:'姓名',
			 name: 'name',
			 labelAlign:'right',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'性别',
			 xtype:'combobox',
			 name:'sex',
			 allowBlank: false,
			 labelAlign:'right',
			 msgTarget : 'side',
			 store:sexStore,
			 queryMode:'remote',
			 editable:false,
			 emptyText:'请选择...',
			 valueField: 'value', 
			 value:"男",
			 displayField: 'value' 
		 },{
			 fieldLabel:'生日',
			 name: 'birthday',
			 labelAlign:'right',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'固定电话',
			 name: 'tel',
			 labelAlign:'right',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'移动电话',
			 name: 'phone',
			 labelAlign:'right',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'联系地址',
			 name: 'address',
			 labelAlign:'right',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'电子邮箱',
			 name: 'email',
			 labelAlign:'right',
			 msgTarget : 'side'
		 },{
			 fieldLabel:'QQ号码',
			 name: 'qq',
			 labelAlign:'right',
			 msgTarget : 'side'
		 }
		 ]

});
//[1]会员菜单
var MemberMenuStore = Ext.create('Ext.data.TreeStore',{
	fields:[
	        {name: 'id'},
	        {name:'vpn'},
	        {name: 'text'},
	        {name: 'url'},
	        {name: 'hidden'},
	        {name:'ico'},
	        {name: 'icons'},
	        {name: 'pmenu'}
	        ],	
	proxy: {
	type: 'ajax',
	url : '../data/userMenu.action'
    },
    folderSort: true 
});

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
				 labelWidth:80,margin:'0 30 0 0',disabled:updateConfig_g?false:true,
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
				 labelWidth:80,margin:'0 30 0 0',disabled:addBs_g?false:true,
				 items:[{ boxLabel: '是', name:'addBs', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addBs', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateBs',id:'updateBs', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:updateBs_g?false:true,
				 items:[{ boxLabel: '是', name:'updateBs', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateBs', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delBs',id:'delBs', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:delBs_g?false:true,
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
				 labelWidth:80,margin:'0 30 0 0',disabled:addRadioUser_g?false:true,
				 items:[{ boxLabel: '是', name:'addRadioUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addRadioUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateRadioUser',id:'updateRadioUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:updateRadioUser_g?false:true,
				 items:[{ boxLabel: '是', name:'updateRadioUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateRadioUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delRadioUser',id:'delRadioUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:delRadioUser_g?false:true,
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
				 labelWidth:80,margin:'0 30 0 0',disabled:addUserGroup_g?false:true,
				 items:[{ boxLabel: '是', name:'addUserGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addUserGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateUserGroup',id:'updateUserGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:updateUserGroup_g?false:true,
				 items:[{ boxLabel: '是', name:'updateUserGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateUserGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delUserGroup',id:'delUserGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:delUserGroup_g?false:true,
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
				 labelWidth:80,margin:'0 30 0 0',disabled:addWebUser_g?false:true,
				 items:[{ boxLabel: '是', name:'addWebUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addWebUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateWebUser',id:'updateWebUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:updateWebUser_g?false:true,
				 items:[{ boxLabel: '是', name:'updateWebUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateWebUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delWebUser',id:'delWebUser', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:delWebUser_g?false:true,
				 items:[{ boxLabel: '是', name:'delWebUser', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delWebUser', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'编辑权限',name:'editUserPower',id:'editUserPower', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:editUserPower_g?false:true,
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
				 labelWidth:80,margin:'0 30 0 0',disabled:addWebGroup_g?false:true,
				 items:[{ boxLabel: '是', name:'addWebGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'addWebGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'修改',name:'updateWebGroup',id:'updateWebGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:updateWebGroup_g?false:true,
				 items:[{ boxLabel: '是', name:'updateWebGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'updateWebGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'删除',name:'delWebGroup',id:'delWebGroup', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:delWebGroup_g?false:true,
				 items:[{ boxLabel: '是', name:'delWebGroup', inputValue: '1',checked:true},
			            { boxLabel: '否', name:'delWebGroup', inputValue: '0'}]

			 },{
				 xtype:'radiogroup',fieldLabel:'编辑权限',name:'editGroupPower',id:'editGroupPower', layout:'column',
				 labelWidth:80,margin:'0 30 0 0',disabled:editGroupPower_g?false:true,
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
var tabPanel=Ext.create("Ext.panel.Panel",{
		region:"center",
		padding:0,
		border:false,
		//plain:true,
		layout:'fit',  
		frame: false, 
		items:[{
			id:'rolePower',
			layout:'border',
			height:350,
			items:power
		}]
	});
/*tabPanel.on('tabchange', function(tabPanel, newCard, oldCard) {
	if(newCard.id=="role") {
		MemberMenuStore.reload();
	}
	else{
		getUserPower();
	}
});*/
var detailWin=Ext.create('Ext.Window',{
	title:'详细信息',
	autoHeight:true,
	autoWidth:true,
	closeAction:'hide',
	items:memberForm
})
function Detail(username){
	detailWin.show();
	MemberMenuStore.on('beforeload', function (store, options) {  
	    var new_params = { username: username};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	groupPowerStore.on('beforeload', function (store, options) {  
	    var new_params = {username: username};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	record = grid.getSelectionModel().getLastSelected();
	memberForm.form.loadRecord(record);
	groupPowerStore.load();
	MemberMenuStore.load();
}
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



//增加、删除，修改功能

//-----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
//-----------------------------------------------编码ID删除  --------------------------------------------------
function del_btn() { 
	/*if(!webuser_del){
		Ext.MessageBox.show({  
			title : "error",  
			msg : "权限不够" , 
			icon: Ext.MessageBox.ERROR
		});
		return;
	}*/
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
					url : '../controller/delUser.action',  
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
							Ext.example.msg("提示","删除会员成功");
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
//---------------更新数据---------------------------------------
function update_btn()
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
	
		items : //元素
			[
			 {
				 xtype:'displayfield',
				 fieldLabel:'用户名',
				 name: 'username',
				 labelAlign:'right',
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'密&nbsp;码',
				 name:'password',
				 allowBlank: true,
				 labelAlign:'right',
				 emptyText:'不修改请留空',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'归属组',
				 labelAlign:'right',
				 xtype:'combobox',
				 name:'groupid',
				 allowBlank: false,
				 msgTarget : 'side',
				 store:groupStore,
				 queryMode:'remote',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'id',  
				 displayField: 'groupname'
			 },{
				 fieldLabel:'姓名',
				 name: 'name',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'性别',
				 xtype:'combobox',
				 name:'sex',
				 allowBlank: false,
				 labelAlign:'right',
				 msgTarget : 'side',
				 store:sexStore,
				 queryMode:'remote',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'value', 
				 value:"男",
				 displayField: 'value' 
			 },{
				 fieldLabel:'生日',
				 name: 'birthday',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'固定电话',
				 name: 'tel',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'移动电话',
				 name: 'phone',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'联系地址',
				 name: 'address',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'电子邮箱',
				 name: 'email',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'QQ号码',
				 name: 'qq',
				 labelAlign:'right',
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
	 updateWindow = new Ext.Window({
		width:400,
		autoHeight:true,
		//x:300,
		//y:200,
		modal:true,
		layout: 'fit',
		title:"修改用户",
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
		        				 url : '../controller/updateUser.action',  
		        				 params : {
		        				 username:form.findField('username').getValue(),
		        				 password:form.findField('password').getValue(),
		        				 groupid:form.findField('groupid').getValue(),
		        				 name:form.findField('name').getValue(),
		        				 sex:form.findField('sex').getValue(),
		        				 birthday:form.findField('birthday').getValue(),
		        				 tel:form.findField('tel').getValue(),
		        				 phone:form.findField('phone').getValue(),
		        				 address:form.findField('address').getValue(),
		        				 email:form.findField('email').getValue(),
		        				 qq:form.findField('qq').getValue()
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 
		        			 
		        			 success : function(response) { 
		  
		        				 store.reload();
		        				 updateWindow.hide();
		        				 grid.getSelectionModel().clearSelections();
		        				 Ext.example.msg("提示","修改成功");
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
  
	
	//store.insert(0,new User()); 
	updateWindow.show();
	
	updateForm.form.loadRecord(record);
	}	
}

//-------------------------------------------添加数据------------------------------------------------------
function add(){ 
	var addForm=new Ext.FormPanel({
		defaultType : 'textfield',//表单默认类型
		frame : false,
		bodyBorder: 0, 
		bodyPadding: 20,
		style:"background: #FFFFFF", 
		labelStyle: 'font-weight:bold' ,
		autoWith:true,
		buttonAlign:'center',
		autoHeight : true,
		layout: {
            type:'vbox',
            padding:'5',
            pack:'center',//垂直居中
            align:'center'//水平居中
        },
		items : //元素
			[
			 {
				 fieldLabel:'用户名[<span style="color:red">*</span>]',
				 name: 'username',
				 allowBlank: false,
				 labelAlign:'right',
				 blankText: '不能为空',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'密&nbsp;码[<span style="color:red">*</span>]',
				 name:'password',
				 labelAlign:'right',
				 allowBlank: false,
				 msgTarget : 'side'
			 },{
				 fieldLabel:'归属组[<span style="color:red">*</span>]',
				 xtype:'combobox',
				 name:'groupid',
				 allowBlank: false,
				 labelAlign:'right',
				 msgTarget : 'side',
				 store:groupStore,
				 queryMode:'remote',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'id',  
				 displayField: 'groupname' 
			 },{
				 fieldLabel:'姓名',
				 name: 'name',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'性别',
				 xtype:'combobox',
				 name:'sex',
				 allowBlank: false,
				 labelAlign:'right',
				 msgTarget : 'side',
				 store:sexStore,
				 queryMode:'remote',
				 editable:false,
				 emptyText:'请选择...',
				 valueField: 'value', 
				 value:"男",
				 displayField: 'value' 
			 },{
				 fieldLabel:'生日',
				 name: 'birthday',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'固定电话',
				 name: 'tel',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'移动电话',
				 name: 'phone',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'联系地址',
				 name: 'address',
				 labelAlign:'right',
				 msgTarget: 'side'
			 },{
				 fieldLabel:'电子邮箱',
				 name: 'email',
				 labelAlign:'right',
				 msgTarget : 'side'
			 },{
				 fieldLabel:'QQ号码',
				 name: 'qq',
				 labelAlign:'right',
				 msgTarget : 'side'
			 }
			 ]

	});
	
	if(!addWindow){
	addWindow = new Ext.Window({
		autoWidth:true,
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
		        				 url : '../controller/addUser.action',  
		        				 params : {  
		        				 username:form.findField('username').getValue(),
		        				 password:form.findField('password').getValue(),
		        				 groupid:form.findField('groupid').getValue(),
		        				 name:form.findField('name').getValue(),
		        				 sex:form.findField('sex').getValue(),
		        				 birthday:form.findField('birthday').getValue(),
		        				 tel:form.findField('tel').getValue(),
		        				 phone:form.findField('phone').getValue(),
		        				 address:form.findField('address').getValue(),
		        				 email:form.findField('email').getValue(),
		        				 qq:form.findField('qq').getValue()
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
			        				 Ext.Msg.alert('提示','用户名已经被注册');
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
	}
	addWindow.show();
	//store.insert(0,new User()); 
}
//编辑权限
function editPower(){
	var data = grid.getSelectionModel().getSelection();
	if (data.length !=1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择一条数据!" , 
			icon: Ext.MessageBox.INFO  
		});  
		return;  
	} 
	record = grid.getSelectionModel().getLastSelected(); 
	var powerWin=new Ext.Window({
		width:700,
		closable: false ,
		autoHeight:true,
		modal:true,
		layout: 'fit',
		title:"用户权限分配",
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
					url:'../controller/updateUserPower.action',
					params : {		
					userid:record.get('id'),
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
				store.reload();
				grid.getSelectionModel().clearSelections();
			powerWin.hide();
		}
		}]
	})
   powerWin.show();
	getUserPower();
}
//修改数据
function update(vpn,hidden){
    var records = MemberMenuStore.getUpdatedRecords();// 获取修改的行的数据，无法获取幻影数据  
    var phantoms=MemberMenuStore.getNewRecords( ) ;//获得幻影行  
    record = grid.getSelectionModel().getLastSelected(); 
    records=records.concat(phantoms);//将幻影数据与真实数据合并  
    Ext.Ajax.request({  
        url : '../controller/updateUserMenu.action',  
        params : {  
           vpn:vpn,
           hidden:hidden,
           userid: record.get('id'),
           username:record.get('username')
        },  
        method : 'POST',  
//        timeout : 2000,  

        success : function(response, opts) {  
            var success = Ext.decode(response.responseText).success;  
            // 当后台数据同步成功时  
            if (success) {  
               //store.reload();  
           	   Ext.Array.each(records, function(record) {  
                      // data.push(record.data);  
                      record.commit();// 向store提交修改数据，页面效果 
                  }); 
           	   Ext.example.msg("提示","数据修改成功");
            } else {  
                Ext.MessageBox.show({  
                    title : "提示",  
                    msg : "数据修改失败!"  
                        // icon: Ext.MessageBox.INFO  
                    });  
            }  
        }  
    });
}
//获取会员组权限
function getUserPower(){
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
			url:'../controller/userPower.action',
			params : {
			    userid:record.get('id')
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
