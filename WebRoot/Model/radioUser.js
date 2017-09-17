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
var isAddMany=false
checkUserPower();
// 创建Model
Ext.define('radiouser',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'np'},
	        {name: 'type'},
	        {name: 'regstatus'},
	        {name: 'authoritystatus'},
	        {name: 'priority'},
	        {name: 'maxcalltime'},
	        {name: 'roamen'},
	        {name: 'g_callen'},
	        {name: 'i_callen'},
	        {name: 'emergencyen'},
	        {name: 'broadcasten'},
	        {name: 'allnetcallen'},
	        {name: 'areacallen'},
	        {name: 'tscallen'}, 
	        {name: 'foacsuen'},
	        {name: 'g_smsen'},
	        {name: 'i_smsen'},
	        {name: 'pstnen'},
	        {name: 'gpsen'},
	        {name: 'authen'},
	        {name: 'adv_authen'},
	        {name: 'include_call_en'},
	        {name: 'discreet_listening_en'},
	        {name: 'stun_kill_revive_en'},
	        {name: 'force2conventional_en'},
	        {name: 'diverting_call_num'},
	        {name: 'hometsid'},
	        {name: 'name'},
	        {name: 'esn'},
	        {name: 'key1'},
	        {name: 'stun_group'}
	        ], 
	        idProperty : 'id'
})
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
Ext.define('radiouser_bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'hometerminalid'},
	        {name: 'basestationid'},
	        {name: 'name'}
	        ], 
	        idProperty : 'basestationid'
})
// 创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
// 设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/radioUser.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'id', 
    	            // 排序类型，默认为 ASC
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});
// 创建数据源
var bsStore = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
// 设置分页大小
	pageSize:200,
	proxy: {
	type: 'ajax',
	url : '../data/bsStation.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'id', 
    	            // 排序类型，默认为 ASC
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});
var radiouserOtherBsStore = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
// 设置分页大小
	pageSize:200,
	proxy: {
	type: 'ajax',
	url : '../data/bsRadioUserList.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'id', 
    	            // 排序类型，默认为 ASC
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});
var radiouserBsStore = Ext.create('Ext.data.Store',{
	model:'radiouser_bs',	
	remoteSort: true,
// 设置分页大小
	pageSize:200,
	proxy: {
	type: 'ajax',
	url : '../data/radioUserBs.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'id', 
    	            // 排序类型，默认为 ASC
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});

 // 创建多选
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
// 创建Action
var addAction=Ext.create('Ext.Action',{
	iconCls:'add',
	text:'增加',
	tooltip:'增加数据',
	disabled:addRadioUser?false:true,
	handler:add
});
var updateAction=Ext.create('Ext.Action',{
	iconCls:'update',
	text:'修改',
	tooltip:'修改数据',
	disabled:updateRadioUser?false:true,
	handler:update_btn
});
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除',
	tooltip:'删除数据',
	disabled:delRadioUser?false:true,
	handler:del_btn
});
var leaderAction=Ext.create('Ext.Action',{
	text:'一键分类领导号码',
	tooltip:'一键分类领导号码',
	handler:leader
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
var stunAction=Ext.create('Ext.Action',{
	iconCls:'start',
	text:'摇晕',
	tooltip:'摇晕',
	disabled:addRadioUser?false:true,
	handler:stunRadio
});
var reviveAction=Ext.create('Ext.Action',{
	iconCls:'start',
	text:'复活',
	tooltip:'复活',
	disabled:addRadioUser?false:true,
	handler:reviveRadio
});
var killAction=Ext.create('Ext.Action',{
	iconCls:'start',
	text:'摇毙',
	tooltip:'摇毙',
	disabled:addRadioUser?false:true,
	handler:killRadio
});
var excelToAction=Ext.create('Ext.Action',{
	iconCls:'excel',
	text:'导入数据',
	tooltip:'导入数据',
	disabled:false,
	handler:excelIn
});
// 创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        addAction,
        updateAction,
        deleteAction,'-',
        refreshAction/*,'-',
        stunAction,reviveAction,killAction*/
    ]
});
// 创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>配置管理>>终端配置',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "用户ID", width:80, dataIndex: 'id', sortable: true,
	        	 renderer : function(v){
	        	 return"<a href='#' onclick=update_btn() title='详细信息' style='color:blue'>"+v+"</a>";
	         }
	         },{text: "名称", width:150, dataIndex: 'name', sortable: false
	         },{text: "类型", width:60, dataIndex: 'type', sortable: false,
	        	 renderer:function(v){
	        	 if(v==0){return "手台";}
	        	 else if(v==1){return "车载台";}
	        	 else if(v==2){return "调度台";}
	        	 else if(v==3){return "固定台";}
	        	 else{return "未知";}
	         }
	         },{text: "鉴权状态", width:70, dataIndex: 'authoritystatus', sortable: false,
	        	 renderer:function(v){
	        	 if(v==0){return "<span class='badge' style='background:green'>正常</span>"}
	        	 else if(v==1){return "<span class='badge' >复活中</span>"}
	        	 else if(v==2){return "<span class='badge' style='background:yellow'>摇晕</span>"}
	        	 else if(v==3){return "<span class='badge'>摇晕中</span>"}
	        	 else if(v==4){return "<span class='badge' style='background:red'>摇毙</span>"}
	        	 else if(v==5){return "<span class='badge' >摇毙中</span>"}
	        	 else{return "<span>未知</span>"}
	         }
	         },{text: "用户激活", width:70, dataIndex: 'regstatus', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         },{text: "GPS", width:60, dataIndex: 'gpsen', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         },{text: "短信组发", width:70, dataIndex: 'g_smsen', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         },{text: "短信单发", width:70, dataIndex: 'i_smsen', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         },{text: "组呼", width:60, dataIndex: 'g_callen', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         },{text: "单呼", flex:2, dataIndex: 'i_callen', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
	         }
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: false,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         
	         selModel: selModel,
	         viewConfig: {
	             stripeRows: true,
	             loadMask: false,  
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },

	         emptyText:'<span>对不起，没有查询到数据</span>',
	        
	         dockedItems: [{
	        	 dock: 'left',
	             xtype: 'toolbar',
	             items:[excelToAction,addAction,'-',updateAction,'-',deleteAction]
	         },{
	        	 dock: 'top',
	             xtype: 'toolbar',
	             items:[{fieldLabel:'用户ID',xtype:'textfield',name:'id',id:'id',labelWidth: 60,width:180,emptyText:'用户ID' },	                    
	                    {fieldLabel:'用户名称',xtype:'textfield',name:'name',id:'name',labelWidth:60,width:180,emptyText:'用户名称'},    
	               		  searchAction,'-',{
	               			  text:'清除',
	               			  iconCls:'clear',
	               			  tooltip:'清除输入的查询数据',
	               			  handler: function(){
	               			  Ext.getCmp("id").reset();
	               			  Ext.getCmp("name").reset();
	               		  }}]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             // style:'background: skyblue',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:[/*'-',
                 stunAction,'-',reviveAction,'-',killAction
                */]

	          	
	         }]

})
}
var radioUserBsGrid=Ext.create('Ext.grid.Panel',{
	margin:'0 0 0 10',
	title:'当前终端允许漫游基站列表',
	region:'center',
	// width:400,
	store:radiouserBsStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "基站ID", width: 100, dataIndex: 'basestationid', sortable: true},
	         {text: "基站名称", flex:1, dataIndex: 'name', sortable: true},
	         {text: "操作", width: 120, dataIndex: 'name', sortable: true,
	        	 renderer:function(value,metaData,record){
	        	 var str="<img src='../resources/images/picture/delete.png'>" +
	        	 		"<a href='#' onclick=delRadioUserBs("+record.get('hometerminalid')+","+record.get('basestationid')+")>删除</a>";
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
	             store: radiouserBsStore, 
	          	 displayInfo: true, 
	          	 items:[{text:'',
	            	 iconCls:'add',
	            	 handler:addRadioUserBS}]

	          	
	         }]

});
var bs_Grid=Ext.create('Ext.grid.Panel',{
	// margin:'0 0 0 10',
	region:'center',
	// width:400,
	store:radiouserOtherBsStore,
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
// 表格行选择
grid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 
		radiouserBsStore.on('beforeload', function (store, options) {  
		    var new_params = { 
		    		hometerminalid: record.get('id')
		    		};  
		    Ext.apply(store.proxy.extraParams, new_params);  

		});
		radiouserBsStore.load();
	}
}
	
});
var right=Ext.create('Ext.panel.Panel',{
	bodyCls:'panel',
	layout:'border',
	border:false,
	region:'east',
	width:450,
	items:[radioUserBsGrid]
})
var radiouserAttr=Ext.create('Ext.panel.Panel',{
	title:'终端属性',
	bodyCls:'panel',
	layout:'border',
	border:false,
	region:'east',
	width:250,
	html:'<div id="attr"></div>'
})
store.on('beforeload', function (store, options) {  
    var new_params = { 
    		id: Ext.getCmp('id').getValue(),
    		name: Ext.getCmp('name').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
var radioUserAttrRecord="";
//表格行选择
grid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 
			Ext.Ajax.request({
				url:'../data/callerInfo.action',
				params: {
				caller:record.get('id')
			},
			method:'POST',
			async:false,
			success : function(response,opts){
				var rs=Ext.decode(response.responseText);
				if(rs.total>0){
					var data=rs.items[0];
					radioUserAttrRecord=data;
					var html='<div>';
					html+='<table border=1 cellpadding="1" cellspacing="1" id="callerInfo-table">';
					html+='<tr class="tr-yellow"><th>属性</th><th>信息</th></tr>';
					html+='<tr><td>ID</td><td>'+data.mscId+'</td></tr>';
					html+='<tr><td>型号</td><td>'+data.model+'</td></tr>';
					html+='<tr><td>机器号</td><td>'+data.number+'</td></tr>';
					html+='<tr><td>ESN</td><td>'+data.esn+'</td></tr>';
					html+='<tr><td>开机密码</td><td>'+data.openpass+'</td></tr>';
					html+='<tr><td>PDT ID</td><td>'+data.pdtId+'</td></tr>';
					/*html+='<tr><td>MPT ID</td><td>'+data.mptId+'</td></tr>';
					html+='<tr><td>模拟ID</td><td>'+data.moniId+'</td></tr>';*/
					html+='<tr><td>登记人</td><td>'+data.checkPerson+'</td></tr>';
					html+='<tr class="tr-default"><td>使用单位</td><td>'+data.company+'</td></tr>';
					html+='<tr class="tr-default"><td>使用人</td><td>'+data.person+'</td></tr>';
					html+='<tr class="tr-default"><td>警员编号</td><td>'+data.personNumber+'</td></tr>';
					html+='<tr class="tr-default"><td>职位</td><td>'+data.post+'</td></tr>';
					html+='</table>';
					html+='</div>';
					
					$("#attr").html(html);
				}else{
					$("#attr").html("没有属性信息");
				}
			},
			failure: function(response) {}});	

	}
}
	
});
// 显示表格
Ext.QuickTips.init(); 
// 禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:[grid,radiouserAttr]
     })
	store.load({params:{start:0,limit:100}}); 
});



// 增加、删除，修改功能

// -----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
// -----------------------------------------------编码ID删除
// --------------------------------------------------
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
					// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在删除数据，请稍后！',  
                     // loadMask: true,
                     removeMask: true // 完成后移除
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/delRadioUser.action',  
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
							// store.remove(record);// 页面效果
							
						}); 
						store.loadPage(1);
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
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!" , 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
function delRun(id){
	
	Ext.Ajax.request({  
		url : '../controller/delRadioUser.action',  
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

// ---------------更新数据---------------------------------------
function update_btn()
{	
	var updateForm=new Ext.FormPanel({
		frame :false,
		bodyBorder: 0, 
		autoWidth:true,
		height : true,
		items:[{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'基本属性',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'numberfield',fieldLabel:'<span style="color:red">终端ID</span>',name:'id',allowBlank: true,
					labelWidth:80,width:170,margin:'0 30 0 0',disabled:true,minValue:0
				},/*{
					xtype:'textfield',fieldLabel:'别名',name:'alias',
					labelWidth:80,width:170,margin:'0 30 0 0'
				},*/{
					xtype:'textfield',fieldLabel:'名称',name:'name',
					labelWidth:80,width:170,margin:'0 30 0 0'
				}]
			},{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'combobox',fieldLabel:'类型',name:'type',
					labelWidth:80,
	        		store:[[0,'手台'],[1,'车载台'],[2,'调度台'],[3,'固定台']],
	        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
				},{
					xtype:'numberfield',fieldLabel:'通话时长(s)',name:'maxcalltime',tooltip:'123',
					labelWidth:80,width:170,margin:'0 30 0 0',minValue:0
				},/*
					 * { xtype:'numberfield',fieldLabel:'全网区域码',name:'np',
					 * labelWidth:80,width:170,margin:'0 30 0 0' },
					 */{
					xtype:'numberfield',fieldLabel:'优先级',name:'priority',
					labelWidth:80,width:170,margin:'0 30 0 0',minValue:0
				}]
			},{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'numberfield',fieldLabel:'鉴权码',name:'esn',
					labelWidth:80,width:170,margin:'0 30 0 0',minValue:0
				},{
					xtype:'numberfield',fieldLabel:'对讲机上行加密键值',name:'key1',
					labelWidth:130,width:250,margin:'0 30 0 0',minValue:0
				}]
			}]},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
				title:'配置参数',
				layout:'form',
				items:[{
					xtype:'panel',
					layout:"column",
					border:false,
					items:[{
						xtype:'checkbox',fieldLabel:'鉴权使能',name:'authen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'用户使能',name:'regstatus',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'GPS使能',name:'gpsen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'高级鉴权',name:'adv_authen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'短信组发',name:'g_smsen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'短信单发',name:'i_smsen',checked:true,labelWidth:60,margin:'0 30 0 0'
					}/*
						 * ,{
						 * xtype:'radiogroup',fieldLabel:'鉴权状态',name:'authoritystatus',id:'authoritystatus',checked:true,
						 * labelWidth:60,layout:'column',margin:'0 30 0
						 * 0',readOnly:true, items: [ { boxLabel: '正常',
						 * name:'authoritystatus', inputValue: '0',checked: true }, {
						 * boxLabel: '复活中', name:'authoritystatus', inputValue:
						 * '1'}, { boxLabel: '遥晕', name:'authoritystatus',
						 * inputValue: '2'}, { boxLabel: '遥晕中',
						 * name:'authoritystatus', inputValue: '3'}, { boxLabel:
						 * '遥毙', name:'authoritystatus', inputValue: '4'}, {
						 * boxLabel: '遥毙中', name:'authoritystatus', inputValue:
						 * '5'} ] }
						 */]
				}]
			},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
				title:'呼叫配置',
				layout:'form',
				items:[{
					xtype:'panel',
					layout:"column",
					border:false,
					items:[{
						xtype:'checkbox',fieldLabel:'组呼',name:'g_callen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'单呼',name:'i_callen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'紧急呼叫',name:'emergencyen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'广播呼叫',name:'broadcasten',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'全网呼叫',name:'allnetcallen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'本地全呼',name:'areacallen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'基站全呼',name:'tscallen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'单呼振铃',name:'foacsuen',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'包容呼叫',name:'include_call_en',checked:true,labelWidth:60,margin:'0 30 0 0'
					}]
				}]
			},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
				title:'其他设置',
				layout:'form',
				items:[{
					xtype:'panel',
					layout:"column",
					border:false,
					items:[{
						xtype:'checkbox',fieldLabel:'慎密监听',name:'discreet_listening_en',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'指令常规',name:'force2conventional_en',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'呼叫转移',name:'diverting_call_num',checked:true,labelWidth:60,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'PSTN接入',name:'pstnen',checked:true,labelWidth:80,margin:'0 30 0 0'
					},{
						xtype:'checkbox',fieldLabel:'遥晕遥毙复活',name:'stun_kill_revive_en',checked:true,labelWidth:90,margin:'0 30 0 0'
					}]
				}]
			},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
				title:'<span style="color:red">属性设置</span>',
				layout:'form',
				items:[{
					xtype:'panel',
					layout:"column",
					border:false,
					items:[{
						xtype:'numberfield',fieldLabel:'PDTID',name:'pdtId',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'型号',name:'model',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'机器号',name:'number',labelWidth:60,width:180,margin:'0 30 0 0'
					},/*{
						xtype:'textfield',fieldLabel:'ESN',name:'esn',labelWidth:60,width:180,margin:'0 30 0 0'
					},*/{
						xtype:'textfield',fieldLabel:'开机密码',name:'openpass',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'使用单位',name:'company',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'岗位',name:'post',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'职务',name:'job',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'登记人',name:'checkPerson',labelWidth:60,width:180,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'警号',name:'personNumber',labelWidth:60,width:180,margin:'0 30 0 0'
					}]
				}]
			}]
		});
	var Panel=Ext.create('Ext.Panel',{
		width : 600,
		height:1000,
		border:0,
		bodyStyle :'overflow-x:visible;overflow-y:scroll', //隐藏水平滚动条
		items:updateForm
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
		 width:750,
		 height:450,
         autoScroll:true,
		 plain:true,
		 modal:true,
		 layout: 'fit',
		 title:"修改终端用户",
		 iconCls:'update',
		 resizable: false, 
		 closable:true,
		 items:Panel,
		 closeAction:'close',
		buttons:[
		         {text:'更新',
		          iconCls:'save',
		          disabled:updateRadioUser?false:true,
		        	 handler: function() {
		        		 Ext.Msg.confirm("请确认", "是否真的要修改数据？", function(button, text) {  
		        				if (button == "yes") { 
		        	 var form=updateForm.form; 
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证数据，请稍后！',  
	                     // loadMask: true,
	                     removeMask: true // 完成后移除
	                 });
		        	 if(form.isValid()){
		        		 myMask.show();
		        	 form.submit(									
		        			 Ext.Ajax.request({  
		        				 url : '../controller/updateRadioUser.action',  
		        				 params : {
		        				 id:form.findField('id').getValue(),
		        				 name:form.findField('name').getValue(),
		        				 /*alias:form.findField('alias').getValue(),*/
		        				 // np:form.findField('np').getValue(),
		        				 type:form.findField('type').getValue(),
		        				 regstatus:form.findField('regstatus').getValue()?1:0,
		        				 // authoritystatus:form.findField('authoritystatus').getValue()['authoritystatus'],
		        				 priority:form.findField('priority').getValue(),
		        				 maxcalltime:form.findField('maxcalltime').getValue(),
		        				 esn:form.findField('esn').getValue(),
		        				 key1:form.findField('key1').getValue(),
		        				 /* roamen:form.findField('roamen').getValue()['roamen'], */
		        				 
		        				 g_callen:form.findField('g_callen').getValue()?1:0,
		        				 i_callen:form.findField('i_callen').getValue()?1:0,
		        				 emergencyen:form.findField('emergencyen').getValue()?1:0,
		        				 broadcasten:form.findField('broadcasten').getValue()?1:0,
		        				 allnetcallen:form.findField('allnetcallen').getValue()?1:0,
		        				 areacallen:form.findField('areacallen').getValue()?1:0,
		        				 tscallen:form.findField('tscallen').getValue()?1:0,
		        				 foacsuen:form.findField('foacsuen').getValue()?1:0,
		        				 g_smsen:form.findField('g_smsen').getValue()?1:0,
		        				 i_smsen:form.findField('i_smsen').getValue()?1:0,
		        				 pstnen:form.findField('pstnen').getValue()?1:0,
		        				 gpsen:form.findField('gpsen').getValue()?1:0,
		        				 authen:form.findField('authen').getValue()?1:0,
		        				 adv_authen:form.findField('adv_authen').getValue()?1:0,
		        				 include_call_en:form.findField('include_call_en').getValue()?1:0,
		        				 discreet_listening_en:form.findField('discreet_listening_en').getValue()?1:0,
		        				 stun_kill_revive_en:form.findField('stun_kill_revive_en').getValue()?1:0,
		        				 force2conventional_en:form.findField('force2conventional_en').getValue()?1:0,
		        				 diverting_call_num:form.findField('diverting_call_num').getValue()?1:0,
		        						 model:form.findField('model').getValue(),
		        						 number:form.findField('number').getValue(),
		        						 openpass:form.findField('openpass').getValue(),
		        						 pdtId:form.findField('pdtId').getValue(),
		        						 company:form.findField('company').getValue(),
		        						 post:form.findField('post').getValue(),
		        						 job:form.findField('job').getValue(),
		        						 checkPerson:form.findField('checkPerson').getValue(),
		        						 personNumber:form.findField('personNumber').getValue()
		        			 },
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 
		        			 
		        			 success : function(response) { 
		        				 myMask.hide();
		        				 var rs = Ext.decode(response.responseText); 
		        				 if(rs.success)
		        				 {
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
		        			 })); } }})
		         } }/*
					 * , {text:'取消', iconCls:'cancel', handler: function(){
					 * updateWindow.hide(); }}
					 */
		         ]

	});
	
	
	// store.insert(0,new User());
	updateWindow.show();
	/* updateWindow.maximize(); */
//	
	updateForm.form.loadRecord(record);
	setRadioChecked(record);
	 updateForm.form.findField('model').setValue(radioUserAttrRecord.model),
	 updateForm.form.findField('number').setValue(radioUserAttrRecord.number),
	 updateForm.form.findField('openpass').setValue(radioUserAttrRecord.openpass),
	 updateForm.form.findField('pdtId').setValue(radioUserAttrRecord.pdtId),
	 updateForm.form.findField('company').setValue(radioUserAttrRecord.company),
	 updateForm.form.findField('post').setValue(radioUserAttrRecord.post),
	 updateForm.form.findField('job').setValue(radioUserAttrRecord.job),
	 updateForm.form.findField('checkPerson').setValue(radioUserAttrRecord.checkPerson),
	 updateForm.form.findField('personNumber').setValue(radioUserAttrRecord.personNumber)
	}	
}

// -------------------------------------------添加数据------------------------------------------------------
/* var successfully=0,error=0; */
var success=false;
var flag=0/* ,i=0 */;
function add(){ 
	var  typeset= new Ext.form.FieldSet({  
        title:'模式',  
        height:80,  
        layout:'column',  
        border:true,  
        style:'margin: 5 10 5 10',
        labelWidth:40,  
        items:[{
			layout:'column',border:false,
			items:[{
			xtype:'combobox',fieldLabel:'',name:'id_type',
			labelWidth:50,
    		store:[[0,'默认模式'],[1,'天津模式']],
    		queryMode:'local',value:0,width:150,margin:'0 30 0 0',
    		listeners:{
    			change:function(){
    			var val=addForm.form.findField("id_type").getValue();
    			if(val==1){
    				addForm.form.findField('type').hide();
    				normal.hide();
    				tj.show();
    			}else{
    				addForm.form.findField('type').show();
    				normal.show();
    				tj.hide();
    			}
    			
    		}
    		}
		}] }]
    }); 
	var  normal = new Ext.form.FieldSet({  
        title:'终端号码',  
        height:80,  
        layout:'column',  
        border:true,  
        style:'margin: 5 10 5 10',
        labelWidth:40,  
        items:[{
			layout:'column',border:false,
			items:[{xtype:'numberfield',fieldLabel:'号码',labelWidth:50,name:'mscId1',emptyText:''},
			       {xtype:'numberfield',fieldLabel:'',name:'mscId2',emptyText:'',margin:'0 0 0 20',hidden:true}]
		}]  
    }); 
	var  tj = new Ext.form.FieldSet({  
        title:'终端号码',  
        autoHeight:true,  
        layout:'form',  
        border:true,  
        style:'margin: 5 10 5 10', 
        labelWidth:40,  
        hidden:true,
        items:[{
			layout:'column',border:false,
			items:[{
				xtype:'numberfield',fieldLabel:'区号',name:'np',emptyText:'0~806',
				labelWidth:50,width:150,margin:'0 20 0 0',minValue:0,maxValue:806,
				listeners:{
	    			change:function(){
	    			var np=addForm.form.findField("np").getValue();
	    			var fgn=addForm.form.findField("fgn").getValue();
	    			var gn=addForm.form.findField("gn").getValue();
	    			var str="";
	    			if(np!=null){str+=np;}
	    			if(fgn!=null){str+="-"+fgn;}
	    			if(gn!=null){str+="-"+gn;}
	    			//addForm.form.findField("alias").setValue(str);
	    		}
	    		}
			}]
		},{
				layout:'column',border:false,
				items:[{
				xtype:'numberfield',fieldLabel:'队号',name:'fgn',emptyText:'20~89',
				labelWidth:50,width:150,margin:'0 20 0 0',minValue:20,maxValue:89,
				value:20,
				listeners:{
	    			change:function(){
	    			var np=addForm.form.findField("np").getValue();
	    			var fgn=addForm.form.findField("fgn").getValue();
	    			var gn=addForm.form.findField("gn").getValue();
	    			var str="";
	    			if(np!=null){str+=np;}
	    			if(fgn!=null){str+="-"+fgn;}
	    			if(gn!=null){str+="-"+gn;}
	    			//addForm.form.findField("alias").setValue(str);
	    		}
	    		}
	    		
			},{
				xtype:'displayfield',fieldLabel:'',value:'<span style="color:red; font-size:2em">-></span>',
				labelWidth:1,width:60,margin:'0 0 0 0',name:'zzz',hidden:true
	    		
			},{
				xtype:'numberfield',fieldLabel:'',name:'fgnEnd',emptyText:'20~89',
				labelWidth:50,width:120,margin:'0 20 0 0',minValue:20,maxValue:89,
				hidden:true,value:20
	    		
			}]
			},{
				layout:'column',border:false,
				items:[{
				xtype:'numberfield',fieldLabel:'个号',name:'gn',emptyText:'200~899',
				labelWidth:50,width:150,margin:'0 20 10 0',minValue:200,maxValue:899,
				value:200,
				listeners:{
	    			change:function(){
	    			var np=addForm.form.findField("np").getValue();
	    			var fgn=addForm.form.findField("fgn").getValue();
	    			var gn=addForm.form.findField("gn").getValue();
	    			var str="";
	    			if(np!=null){str+=np;}
	    			if(fgn!=null){str+="-"+fgn;}
	    			if(gn!=null){str+="-"+gn;}
	    			//addForm.form.findField("alias").setValue(str);
	    		}
	    		}
			},{
				xtype:'displayfield',fieldLabel:'',value:'<span style="color:red; font-size:2em">-></span>',
				labelWidth:1,width:60,margin:'0 0 10 0',name:'zz',hidden:true
	    		
			},{
				xtype:'numberfield',fieldLabel:'',name:'gnEnd',emptyText:'200~899',
				labelWidth:50,width:120,margin:'0 20 10 0',minValue:200,maxValue:899,
				hidden:true,value:200
			}]
			}]  
    }); 
var addForm=new Ext.FormPanel({
	frame :false,
	autoWidth:true,
	autoHeight : true,
	items:[typeset,normal,tj,{
		xtype:"fieldset",
		style:'margin: 5 10 5 10',
		title:'基本属性',
		layout:'form',
		items:[{
			xtype:'panel',
			layout:"column",
			border:false,
			items:[{
				xtype:'textfield',fieldLabel:'使用人',name:'name',
				labelWidth:80,width:170,margin:'0 30 0 0'
			},/*{
				xtype:'textfield',fieldLabel:'别名',name:'alias',
				labelWidth:80,width:170,margin:'0 30 0 0'
			},*/{
				xtype:'numberfield',fieldLabel:'鉴权码',name:'esn',
				labelWidth:80,width:170,margin:'0 30 0 0',minValue:0
			},{
				xtype:'combobox',fieldLabel:'类型',name:'type',
				labelWidth:80,
				store:[[0,'手台'],[1,'车载台'],[2,'调度台'],[3,'固定台']],
        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
			},{
				xtype:'numberfield',fieldLabel:'通话时长(s)',name:'maxcalltime',tooltip:'123',
				labelWidth:80,width:170,margin:'0 30 0 0',minValue:0
			},/*
				 * { xtype:'numberfield',fieldLabel:'全网区域码',name:'np',
				 * labelWidth:80,width:170,margin:'0 30 0 0' },
				 */{
				xtype:'numberfield',fieldLabel:'优先级',name:'priority',
				labelWidth:80,width:170,margin:'0 30 0 0',minValue:0
			},{
				xtype:'numberfield',fieldLabel:'对讲机上行加密键值',name:'key1',
				labelWidth:130,width:220,margin:'0 30 0 0',minValue:0
			}]
		},{
			xtype:'panel',
			layout:"column",
			border:false,
			items:[]
		}]},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'配置参数',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'checkbox',fieldLabel:'鉴权使能',name:'authen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'用户使能',name:'regstatus',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'GPS使能',name:'gpsen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'高级鉴权',name:'adv_authen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'短信组发',name:'g_smsen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'短信单发',name:'i_smsen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'radiogroup',fieldLabel:'鉴权状态',name:'authoritystatus',checked:true,labelWidth:60,layout:'column',margin:'0 30 0 0',
					items: [
				            { boxLabel: '正常', name:'authoritystatus', inputValue: '0',checked: true },
				            { boxLabel: '复活中', name:'authoritystatus', inputValue: '1'},
				            { boxLabel: '遥晕', name:'authoritystatus', inputValue: '2'},
				            { boxLabel: '遥晕中', name:'authoritystatus', inputValue: '3'},
				            { boxLabel: '遥毙', name:'authoritystatus', inputValue: '3'},
				            { boxLabel: '遥毙中', name:'authoritystatus', inputValue: '3'}
				        ]
				}]
			}]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'呼叫配置',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'checkbox',fieldLabel:'组呼',name:'g_callen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'单呼',name:'i_callen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'紧急呼叫',name:'emergencyen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'广播呼叫',name:'broadcasten',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'全网呼叫',name:'allnetcallen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'本地全呼',name:'areacallen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'基站全呼',name:'tscallen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'单呼振铃',name:'foacsuen',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'包容呼叫',name:'include_call_en',checked:true,labelWidth:60,margin:'0 30 0 0'
				}]
			}]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'其他设置',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'checkbox',fieldLabel:'慎密监听',name:'discreet_listening_en',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'指令常规',name:'force2conventional_en',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'呼叫转移',name:'diverting_call_num',checked:true,labelWidth:60,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'PSTN接入',name:'pstnen',checked:true,labelWidth:80,margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'遥晕遥毙复活',name:'stun_kill_revive_en',checked:true,labelWidth:90,margin:'0 30 0 0'
				}]
			}]
		},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'<span style="color:red">属性设置</span>',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'numberfield',fieldLabel:'PDTID',name:'pdtId',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'型号',name:'model',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'机器号',name:'number',labelWidth:60,width:180,margin:'0 30 0 0'
				},/*{
					xtype:'textfield',fieldLabel:'ESN',name:'esn',labelWidth:60,width:180,margin:'0 30 0 0'
				},*/{
					xtype:'textfield',fieldLabel:'开机密码',name:'openpass',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'使用单位',name:'company',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'岗位',name:'post',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'职务',name:'job',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'登记人',name:'checkPerson',labelWidth:60,width:180,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'警号',name:'personNumber',labelWidth:60,width:180,margin:'0 30 0 0'
				}]
			}]
		}]
	});
	var Panel=Ext.create('Ext.Panel',{
		width : 600,
		height:1000,
		border:0,
		bodyStyle :'overflow-x:visible;overflow-y:scroll', // 隐藏水平滚动条
		items:[{
			xtype:'toolbar',
			items:[{
				xtype:'button',
				text:'[ 创建 ]',
				handler:function(){
				isAddMany=false;
				if(addForm.form.findField('id_type').getValue()==1){
					addForm.form.findField('fgnEnd').hide();
					addForm.form.findField('gnEnd').hide();
					addForm.form.findField('zzz').hide();
					addForm.form.findField('zz').hide();
					//addForm.form.findField('alias').show();
					addForm.form.findField('name').show();
				}else{
					addForm.form.findField('mscId2').hide();
				}
				
			}
			},{
				xtype:'button',
				text:'[ 批量创建 ]',
				handler:function(){
				isAddMany=true;
				
				if(addForm.form.findField('id_type').getValue()==1){
					addForm.form.findField('fgnEnd').show();
					addForm.form.findField('gnEnd').show();
					addForm.form.findField('zzz').show();
					addForm.form.findField('zz').show();
					//addForm.form.findField('alias').hide();
					addForm.form.findField('name').hide();
				}else{
					addForm.form.findField('mscId2').show();
				}
				
			}
			}]
		},addForm]
	});
/*	var tabPanel=Ext.create("Ext.tab.Panel",{
		region:"center",
		animCollapse:false,
		padding:0,
		border:false,
		// plain:true,
		layout:'fit',  
		frame: false, 
		enableTabScroll:true,
		items:[{
			title:"首页",
			items:Panel
		}]
	});*/
	if(!addWindow){
	addWindow = new Ext.Window({
		border:0,
		draggable:false,
		width:750,
		height:500,
// plain:true,
		closable: true,
		autoScroll:true,
		modal:true,
		layout: 'fit',
		title:'添加用户',
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
	                     msg: '正在添加数据，请稍后！',  
	                     // loadMask: true,
	                     removeMask: true // 完成后移除
	                 });
					 
		        	 if(form.isValid()){
		        		 if(form.findField('id_type').getValue()==0){
		        			 if(!isAddMany){
		        				 if(form.findField('mscId1').getValue()==null){
				        			 Ext.MessageBox.show({
				        					 title : "提示",
				        					 msg :'终端号码不能为空' ,
				        					 icon: Ext.MessageBox.ERROR});
				        			 return ;
				        		 }
		        			 }else{
		        				 if(form.findField('mscId1').getValue()==null || form.findField('mscId2').getValue()==null){
				        			 Ext.MessageBox.show({ title : "提示",msg :'终端号码不能为空' , icon: Ext.MessageBox.ERROR});
				        			 return ;
				        	}
		        		    if(form.findField('mscId1').getValue()>form.findField('mscId2').getValue()){
		        			 Ext.MessageBox.show({ title : "提示",msg :'终端号码范围不正确' , icon: Ext.MessageBox.ERROR});
		        			 return ;
		        		 }
		        		        
		        			 }
		        		 }else{
		        			 if(!isAddMany)
			        		 {
			        			 if(form.findField('np').getValue()==null){
				        			 Ext.MessageBox.show({ title : "提示",msg :'区号不能为空' , icon: Ext.MessageBox.ERROR});
				        			 return ;
				        		 }
			        			 if(form.findField('fgn').getValue()>89 || form.findField('fgn').getValue()<20){
			        				 Ext.MessageBox.show({ title : "提示", msg :'对号取值不正确,<br>'+'范围在20～89时', icon: Ext.MessageBox.ERROR
			        				 });
				        			 return ;
			        			 }
			        			 if(form.findField('gn').getValue()>899 || form.findField('gn').getValue()<200){
			        				 Ext.MessageBox.show({ title : "提示", msg :'个号取值不正确,<br>' +'范围在200～899时', 
			        					 icon: Ext.MessageBox.ERROR
			        				 });
				        			 return ;
			        			 }
			        		 }else{
			        			 if(form.findField('fgn').getValue()==null || form.findField('fgnEnd').getValue()==null){
				        			 Ext.MessageBox.show({ title : "提示", msg :'队号范围不能为空' ,  icon: Ext.MessageBox.ERROR
			        				 });
				        			 return ;
				        		 }
			        			 if(form.findField('gn').getValue()==null || form.findField('gnEnd').getValue()==null){
				        			 Ext.MessageBox.show({ title : "提示",msg :'个号范围不能为空' , 
			        					 icon: Ext.MessageBox.ERROR
			        				 });
				        			 return ;
				        		 }
			        			 if(form.findField('fgn').getValue()>form.findField('fgnEnd').getValue()){
			        				 Ext.MessageBox.show({ title : "提示", msg :'队号范围不正确' , 
			        					 icon: Ext.MessageBox.ERROR
			        				 });
				        			 return ;
			        			 }
			        			 if(form.findField('gn').getValue()>form.findField('gnEnd').getValue()){
			        				 Ext.MessageBox.show({title : "提示", msg :'个号范围不正确' ,  icon: Ext.MessageBox.ERROR
			        				 });
				        			 return ;
			        			 }
			        		 }
		        		 }
		        	
		        		 myMask.show();
		        		 Ext.getCmp('saveBtn').disable();
		        	     if(form.findField('id_type').getValue()==0){
		        	    	 if(isAddMany){
			        			 var j=0;var i=0;
			        			 var timeout=setInterval(function(){
			        					
			        					if(flag==0){
			        					 flag=1;
			        					 if(i<=form.findField('mscId2').getValue()-form.findField('mscId1').getValue()){
			        						 var mscId=form.findField('mscId1').getValue()+i;
			        						 mscId=parseInt(mscId);
			        						 NorMalRun(form,mscId);
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
			        					
			        			}, 10);  //每隔 1秒钟  
			        	
			        		 }else{
			        			 addNorRun(form,myMask);
			        			 Ext.getCmp('saveBtn').enable();
			        		 }
		        	     }else{
		        	    	 if(isAddMany){
			        			 var j=0;var i=0;
			        			 var timeout=setInterval(function(){
			        					
			        					if(flag==0){
			        					 flag=1;
			        					 if(i<=form.findField('fgnEnd').getValue()-form.findField('fgn').getValue()){
				        						if(j<=form.findField('gnEnd').getValue()-form.findField('gn').getValue()){
				        							var fgn=form.findField('fgn').getValue()+i;
				        							var gn=form.findField('gn').getValue()+j
				        							var alias=form.findField('np').getValue()+"-"+fgn+"-"+gn;		        							
				        							Run(form,fgn,gn,alias);
				        							j++
				        						}else{
				        							i++;j=0;flag=0;
				        						}
			        						
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
			        					
			        			}, 10);  //每隔 1秒钟  
			        	
			        		 }else{
			        			 addRun(form,myMask);
			        			 Ext.getCmp('saveBtn').enable();
			        		 }
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
		        	 //addForm.form.reset();
		        	 addWindow.hide();
		         }
		         }
		         ]

	});
	}
	addWindow.show();
	/* addWindow.maximize(); */
	// store.insert(0,new User());
}
function Run(form,fgn,gn,alias){
	var str=form.findField('np').getValue()+"-"+fgn+"-"+gn;
	if(addRunMany(form,fgn,gn,alias)){
		// Ext.example.msg("提示","标示 ["+id+"]添加成功");
		successfully++;
		flag=0;
	}else{
		// Ext.example.msg("错误提示","标示 ["+id+"]添加失败");
		error++;
		flag=0;
	}
}
function  NorMalRun(form,mscId){
	if(addNorRunMany(form,mscId)){
		// Ext.example.msg("提示","标示 ["+id+"]添加成功");
		successfully++;
		flag=0;
	}else{
		// Ext.example.msg("错误提示","标示 ["+id+"]添加失败");
		error++;
		flag=0;
	}
}
function addRun(form,mask){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addRadioUser.action',  
				 params : {
				// id:form.findField('id').getValue(),
				 id_type:form.findField('id_type').getValue(),
				 np:form.findField('np').getValue(),
				 fgn:form.findField('fgn').getValue(),
				 gn:form.findField('gn').getValue(),
				 
				 name:form.findField('name').getValue(),
				 /*alias:form.findField('alias').getValue(),*/
				// np:form.findField('np').getValue(),
				 type:form.findField('type').getValue(),
				 regstatus:form.findField('regstatus').getValue()?1:0,
				 authoritystatus:form.findField('authoritystatus').getValue()['authoritystatus'],
				 priority:form.findField('priority').getValue(),
				 maxcalltime:form.findField('maxcalltime').getValue(),
				 esn:form.findField('esn').getValue(),
				 key1:form.findField('key1').getValue(),
				 /* roamen:form.findField('roamen').getValue()['roamen'], */
				 
				 g_callen:form.findField('g_callen').getValue()?1:0,
				 i_callen:form.findField('i_callen').getValue()?1:0,
				 emergencyen:form.findField('emergencyen').getValue()?1:0,
				 broadcasten:form.findField('broadcasten').getValue()?1:0,
				 allnetcallen:form.findField('allnetcallen').getValue()?1:0,
				 areacallen:form.findField('areacallen').getValue()?1:0,
				 tscallen:form.findField('tscallen').getValue()?1:0,
				 foacsuen:form.findField('foacsuen').getValue()?1:0,
				 g_smsen:form.findField('g_smsen').getValue()?1:0,
				 i_smsen:form.findField('i_smsen').getValue()?1:0,
				 pstnen:form.findField('pstnen').getValue()?1:0,
				 gpsen:form.findField('gpsen').getValue()?1:0,
				 authen:form.findField('authen').getValue()?1:0,
				 adv_authen:form.findField('adv_authen').getValue()?1:0,
				 include_call_en:form.findField('include_call_en').getValue()?1:0,
				 discreet_listening_en:form.findField('discreet_listening_en').getValue()?1:0,
				 stun_kill_revive_en:form.findField('stun_kill_revive_en').getValue()?1:0,
				 force2conventional_en:form.findField('force2conventional_en').getValue()?1:0,
				 diverting_call_num:form.findField('diverting_call_num').getValue()?1:0,
				 model:form.findField('model').getValue(),
				 number:form.findField('number').getValue(),
				 openpass:form.findField('openpass').getValue(),
				 pdtId:form.findField('pdtId').getValue(),
				 company:form.findField('company').getValue(),
				 post:form.findField('post').getValue(),
				 job:form.findField('job').getValue(),
				 checkPerson:form.findField('checkPerson').getValue(),
				 personNumber:form.findField('personNumber').getValue()

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
function addNorRun(form,mask){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addRadioUser.action',  
				 params : {
				// id:form.findField('id').getValue(),
				 id_type:form.findField('id_type').getValue(),
				 id:form.findField('mscId1').getValue(),

				 
				 name:form.findField('name').getValue(),
				 /*alias:form.findField('alias').getValue(),*/
				// np:form.findField('np').getValue(),
				 type:form.findField('type').getValue(),
				 regstatus:form.findField('regstatus').getValue()?1:0,
				 authoritystatus:form.findField('authoritystatus').getValue()['authoritystatus'],
				 priority:form.findField('priority').getValue(),
				 maxcalltime:form.findField('maxcalltime').getValue(),
				 esn:form.findField('esn').getValue(),
				 key1:form.findField('key1').getValue(),
				 /* roamen:form.findField('roamen').getValue()['roamen'], */
				 
				 g_callen:form.findField('g_callen').getValue()?1:0,
				 i_callen:form.findField('i_callen').getValue()?1:0,
				 emergencyen:form.findField('emergencyen').getValue()?1:0,
				 broadcasten:form.findField('broadcasten').getValue()?1:0,
				 allnetcallen:form.findField('allnetcallen').getValue()?1:0,
				 areacallen:form.findField('areacallen').getValue()?1:0,
				 tscallen:form.findField('tscallen').getValue()?1:0,
				 foacsuen:form.findField('foacsuen').getValue()?1:0,
				 g_smsen:form.findField('g_smsen').getValue()?1:0,
				 i_smsen:form.findField('i_smsen').getValue()?1:0,
				 pstnen:form.findField('pstnen').getValue()?1:0,
				 gpsen:form.findField('gpsen').getValue()?1:0,
				 authen:form.findField('authen').getValue()?1:0,
				 adv_authen:form.findField('adv_authen').getValue()?1:0,
				 include_call_en:form.findField('include_call_en').getValue()?1:0,
				 discreet_listening_en:form.findField('discreet_listening_en').getValue()?1:0,
				 stun_kill_revive_en:form.findField('stun_kill_revive_en').getValue()?1:0,
				 force2conventional_en:form.findField('force2conventional_en').getValue()?1:0,
				 diverting_call_num:form.findField('diverting_call_num').getValue()?1:0,
						 model:form.findField('model').getValue(),
						 number:form.findField('number').getValue(),
						 openpass:form.findField('openpass').getValue(),
						 pdtId:form.findField('pdtId').getValue(),
						 company:form.findField('company').getValue(),
						 post:form.findField('post').getValue(),
						 job:form.findField('job').getValue(),
						 checkPerson:form.findField('checkPerson').getValue(),
						 personNumber:form.findField('personNumber').getValue()

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
function addRunMany(form,fgn,gn,alias){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addRadioUser.action',  
				 params : {
				 //id:id,
				 id_type:form.findField('id_type').getValue(),
				 np:form.findField('np').getValue(),
				 fgn:fgn,
				 gn:gn,			 
				 name:"",
				 alias:"",
				 // np:form.findField('np').getValue(),
				 type:form.findField('type').getValue(),
				 regstatus:form.findField('regstatus').getValue()?1:0,
				 authoritystatus:form.findField('authoritystatus').getValue()['authoritystatus'],
				 priority:form.findField('priority').getValue(),
				 maxcalltime:form.findField('maxcalltime').getValue(),
				 esn:form.findField('esn').getValue(),
				 key1:form.findField('key1').getValue(),
				 /* roamen:form.findField('roamen').getValue()['roamen'], */
				 
				 g_callen:form.findField('g_callen').getValue()?1:0,
				 i_callen:form.findField('i_callen').getValue()?1:0,
				 emergencyen:form.findField('emergencyen').getValue()?1:0,
				 broadcasten:form.findField('broadcasten').getValue()?1:0,
				 allnetcallen:form.findField('allnetcallen').getValue()?1:0,
				 areacallen:form.findField('areacallen').getValue()?1:0,
				 tscallen:form.findField('tscallen').getValue()?1:0,
				 foacsuen:form.findField('foacsuen').getValue()?1:0,
				 g_smsen:form.findField('g_smsen').getValue()?1:0,
				 i_smsen:form.findField('i_smsen').getValue()?1:0,
				 pstnen:form.findField('pstnen').getValue()?1:0,
				 gpsen:form.findField('gpsen').getValue()?1:0,
				 authen:form.findField('authen').getValue()?1:0,
				 adv_authen:form.findField('adv_authen').getValue()?1:0,
				 include_call_en:form.findField('include_call_en').getValue()?1:0,
				 discreet_listening_en:form.findField('discreet_listening_en').getValue()?1:0,
				 stun_kill_revive_en:form.findField('stun_kill_revive_en').getValue()?1:0,
				 force2conventional_en:form.findField('force2conventional_en').getValue()?1:0,
				 diverting_call_num:form.findField('diverting_call_num').getValue()?1:0,
						 model:form.findField('model').getValue(),
						 number:form.findField('number').getValue(),
						 openpass:form.findField('openpass').getValue(),
						 pdtId:form.findField('pdtId').getValue(),
						 company:form.findField('company').getValue(),
						 post:form.findField('post').getValue(),
						 job:form.findField('job').getValue(),
						 checkPerson:form.findField('checkPerson').getValue(),
						 personNumber:form.findField('personNumber').getValue()

				 
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
function addNorRunMany(form,mscId){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addRadioUser.action',  
				 params : {
				 //id:id,
				 id_type:form.findField('id_type').getValue(),
				 id:mscId,			 
				 name:"",
				 alias:"",
				 // np:form.findField('np').getValue(),
				 type:form.findField('type').getValue(),
				 regstatus:form.findField('regstatus').getValue()?1:0,
				 authoritystatus:form.findField('authoritystatus').getValue()['authoritystatus'],
				 priority:form.findField('priority').getValue(),
				 maxcalltime:form.findField('maxcalltime').getValue(),
				 esn:form.findField('esn').getValue(),
				 key1:form.findField('key1').getValue(),
				 /* roamen:form.findField('roamen').getValue()['roamen'], */
				 
				 g_callen:form.findField('g_callen').getValue()?1:0,
				 i_callen:form.findField('i_callen').getValue()?1:0,
				 emergencyen:form.findField('emergencyen').getValue()?1:0,
				 broadcasten:form.findField('broadcasten').getValue()?1:0,
				 allnetcallen:form.findField('allnetcallen').getValue()?1:0,
				 areacallen:form.findField('areacallen').getValue()?1:0,
				 tscallen:form.findField('tscallen').getValue()?1:0,
				 foacsuen:form.findField('foacsuen').getValue()?1:0,
				 g_smsen:form.findField('g_smsen').getValue()?1:0,
				 i_smsen:form.findField('i_smsen').getValue()?1:0,
				 pstnen:form.findField('pstnen').getValue()?1:0,
				 gpsen:form.findField('gpsen').getValue()?1:0,
				 authen:form.findField('authen').getValue()?1:0,
				 adv_authen:form.findField('adv_authen').getValue()?1:0,
				 include_call_en:form.findField('include_call_en').getValue()?1:0,
				 discreet_listening_en:form.findField('discreet_listening_en').getValue()?1:0,
				 stun_kill_revive_en:form.findField('stun_kill_revive_en').getValue()?1:0,
				 force2conventional_en:form.findField('force2conventional_en').getValue()?1:0,
				 diverting_call_num:form.findField('diverting_call_num').getValue()?1:0,
						 model:form.findField('model').getValue(),
						 number:form.findField('number').getValue(),
						 openpass:form.findField('openpass').getValue(),
						 pdtId:form.findField('pdtId').getValue(),
						 company:form.findField('company').getValue(),
						 post:form.findField('post').getValue(),
						 job:form.findField('job').getValue(),
						 checkPerson:form.findField('checkPerson').getValue(),
						 personNumber:form.findField('personNumber').getValue()

				 
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
// 导出excel数据
function Excel_btn() { 
}
// 编辑归属基站
function editRadioUserBS(){
	var TGBSGrid=Ext.create('Ext.grid.Panel',{
		region:'center',
		store:radiouserBsStore,
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
		        	 		"<a href='#' onclick=delRadioUserBs("+record.get('hometerminalid')+","+record.get('basestationid')+")>删除</a>";
		        	 return str;
		         }}
		         ],
		        /* plugins : [cellEditing], */
		         frame:false,
		         border:false,
		         forceFit: true,
		         columnLines : true, 
		         height:document.documentElement.clientHeight,
		         
		         /* selModel: selModel, */
		         viewConfig: {
		             stripeRows: true
		         },

		         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
		         dockedItems: [{
		             xtype: 'toolbar',
		             dock: 'top',
		             items:[{text:'创建',
		            	 iconCls:'add',
		            	 handler:addRadioUserBS}]
		         },{
		             dock: 'bottom',
		             xtype: 'pagingtoolbar',
		             // style:'background: skyblue',
		             store: radiouserBsStore, 
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
		title:'终端归属基站列表',
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
	radiouserBsStore.on('beforeload', function (store, options) {  
	    var new_params = { 
	    		hometerminalid: record.get('id')
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	radiouserBsStore.load()
	win.show();
	
	
}
radiouserOtherBsStore.on('load',function(){
	for(var i =0;i<radiouserOtherBsStore.getCount();i++){
		radiouserOtherBsStore.getAt(i).set("name","ID:"+radiouserOtherBsStore.getAt(i).get('id')+"->"+radiouserOtherBsStore.getAt(i).get("name"));

	}
})
// 添加归属基站
function addRadioUserBS(){
	var data = grid.getSelectionModel().getSelection();
	if (data.length ==0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请至少选择一个终端!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	}

	var win=new Ext.Window({
		title:'基站列表',
		border:false,
		layout:'border',
		height:350,
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
			}
			var myMask = new Ext.LoadMask(Ext.getBody(), { 
		        msg: '正在验证数据，请稍后！',  
		        // loadMask: true,
		        removeMask: true // 完成后移除
		    });
			myMask.show();
			win.hide();
			var hometerminalids = [],bsids=[];  
			Ext.Array.each(data, function(record) {  
				var hometerminalid=record.get('id');  
				// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
				if(hometerminalid){hometerminalids.push(hometerminalid);}  

			}); 
			
			Ext.Array.each(data_bs,function(record){
				var bsid=record.get('id');
				if(bsid){bsids.push(bsid);}
			});
			 Ext.Ajax.request({  
				 url : '../controller/addRadioUserBS.action',  
				 params : {
				 hometerminalids:hometerminalids.join(','),
				 bsids:bsids.join(',')
			 },  
			 method : 'POST',
			 success : function(response) { 
				 var rs=Ext.decode(response.responseText);
				 myMask.hide();
				 if(rs.success)
				 {
					 radiouserBsStore.reload();
				 Ext.example.msg("提示",rs.message);
				 /* win.hide(); */
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
					 msg : "添加数据失败!" , 
					 icon: Ext.MessageBox.ERROR 
				 }); 
			 }  
			 });
		}}]
	})
	record = grid.getSelectionModel().getLastSelected();
	var hometerminalid=-1;
	if(data.lenght>1){
		hometerminalid=-1
	}else{
		hometerminalid=record.get('id');
	}
	radiouserOtherBsStore.on('beforeload', function (store, options) {  
	    var new_params = { 
	    		hometerminalid: hometerminalid
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  

	});
	
	radiouserOtherBsStore.load();
	
	win.show();
}
// 删除归属基站
function delRadioUserBs(hometerminalid,basestationid){
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在验证数据，请稍后！',  
        // loadMask: true,
        removeMask: true // 完成后移除
    });
	myMask.show();
	 Ext.Ajax.request({  
		 url : '../controller/delRadioUserBS.action',  
		 params : {
		 hometerminalid:hometerminalid,
		 basestationid:basestationid
	 },  
	 method : 'POST',
	 success : function(response) { 
		 var rs=Ext.decode(response.responseText);
		 myMask.hide();
		 if(rs.success)
		 {
			 radiouserBsStore.reload();
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
// 摇晕对讲机
function stunRadio(){
	var data = grid.getSelectionModel().getSelection();
	if (data.length <1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请至少选择一条数据!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	
	else
	{ 
		Ext.Msg.confirm("请确认", "是否真的要遥晕对讲机", function(button, text) {  
			if (button == "yes") { 
				var mscIds=[];
				Ext.Array.each(data,function(record){
					var bsid=record.get('id');
					if(bsid){mscIds.push(bsid);}
				}); 
	
	Ext.Ajax.request({  
		url : '../controller/stunRadio.action',  
		params : {  
		mscIds: mscIds.join(',')
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			
			 Ext.example.msg("提示","摇晕执行成功");
			 store.reload();
		}
		else
		{
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "执行错误" , 
				icon: Ext.MessageBox.ERROR  
			}); 
		}

	},
	failure: function(response) {

		Ext.MessageBox.show({  
			title : "提示",  
			msg : "响应服务器失败" , 
			icon: Ext.MessageBox.ERROR  
		});}  
	}); 
			}})
	}
}
// 复活对讲机
function reviveRadio(){
	var data = grid.getSelectionModel().getSelection();
	if (data.length <1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请至少选择一条数据!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	
	else
	{ 
		Ext.Msg.confirm("请确认", "是否真的要复活对讲机", function(button, text) {  
			if (button == "yes") { 	
				var mscIds=[];
				Ext.Array.each(data,function(record){
					var bsid=record.get('id');
					if(bsid){mscIds.push(bsid);}
				});
	
	Ext.Ajax.request({  
		url : '../controller/reviveRadio.action',  
		params : {  
		mscIds:mscIds.join(',')
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			 store.reload();
			 Ext.example.msg("提示","复活执行成功");
		}
		else
		{
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "执行错误" , 
				icon: Ext.MessageBox.ERROR  
			}); 
		}

	},
	failure: function(response) {

		Ext.MessageBox.show({  
			title : "提示",  
			msg : "响应服务器失败" , 
			icon: Ext.MessageBox.ERROR  
		});}  
	});
			}})
	}
}
// 摇毙对讲机
function killRadio(){
	var data = grid.getSelectionModel().getSelection();
	if (data.length <1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请至少选择一条数据!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	
	else
	{ 
		Ext.Msg.confirm("请确认", "是否真的要遥毙对讲机", function(button, text) {  
			if (button == "yes") { 
	// data = grid.getSelectionModel().getLastSelected();
	var mscIds=[];
	Ext.Array.each(data,function(record){
		var bsid=record.get('id');
		if(bsid){mscIds.push(bsid);}
	});
	Ext.Ajax.request({  
		url : '../controller/killRadio.action',  
		params : {  
		mscIds: mscIds.join(',')
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			 store.reload();
			 Ext.example.msg("提示","摇毙执行成功");
		}
		else
		{
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "执行错误" , 
				icon: Ext.MessageBox.ERROR  
			}); 
		}

	},
	failure: function(response) {

		Ext.MessageBox.show({  
			title : "提示",  
			msg : "响应服务器失败" , 
			icon: Ext.MessageBox.ERROR  
		});}  
	});
			}})
	}
}
//导入数据
function excelIn(){
	var excelForm=Ext.create('Ext.FormPanel',{
		width:500,
		fileUpload: true, 
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,
		fileUpload : true,	
		items : //元素
			[{  				  
		        xtype: 'filefield',
		        name: 'filePath',
		        /*inputType: 'file',*/
		        fieldLabel: '文件地址',
		        labelWidth:60, 
		        anchor: '100%',
		        buttonText: '选择文件', 
			     buttonConfig: {
                     iconCls: 'excel'
                 }
			}
			 ]
	})
	var excelWin=Ext.create("Ext.Window",{
		modal:true,
		title:'导入数据',
		autoWidth:true,
		autoHeight:true,
		closeAction:'hide',
		items:excelForm,
		buttons:[{
			text:'开始导入',
			iconCls:'excel',
			handler:function(){
			var form=excelForm.form;
			 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                 msg: '正在验证数据，请稍后！',  
                 loadMask: true, 
                 removeMask: true //完成后移除  
             });
			if(form.isValid){
				var ex=excelForm.form.findField('filePath').getValue().split(".")[1].toLowerCase();
				if(ex!="xls"){
					 Ext.MessageBox.show({  
	   					 title : "提示",  
	   					 msg : "数据导入失败!,检查文件名后缀是否为[.xls   .XLS]" , 
	   					 icon: Ext.MessageBox.INFO  
	   				 }); 
					 return;
				}
				myMask.show();
				form.submit({  
   				 url : '../controller/excelTo.action', 
   				method : 'POST',
   				async:false,
   			     success : function(response) { 
					myMask.hide();
				   /*  var rs = Ext.decode(response);
				     
				     if(rs.success){
				    	 Ext.example.msg("提示","导入成功"); 
					     excelWin.hide();
					     store.reload();
				     }else{
				    	 Ext.MessageBox.show({  
		   					 title : "提示",  
		   					 msg : "数据导入失败!,检查文件名后缀是否为[.xls   .XLS]" , 
		   					 icon: Ext.MessageBox.INFO  
		   				 }); 
				     }*/
					 Ext.example.msg("提示","导入成功"); 
				     excelWin.hide();
				     store.reload();
				     
				    
   				     
   			 },
   			 failure: function(response) {
   				myMask.hide();
   				 Ext.MessageBox.show({  
   					 title : "提示",  
   					 msg : "数据导入失败!,检查文件名后缀是否为[.xls 22.XLS]" , 
   					 icon: Ext.MessageBox.INFO  
   				 }); 
   			 }  
   			 });
			}
		}
		},{
			text:'重置',
			iconCls:'reset',
			handler:function(){
			excelForm.form.reset();
		}
		}]
	})
	excelWin.show();
}
// 通知中心
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
		/* alert("success") */

	},
	failure: function(response) {
	}  
	}); 
}
function leader(){
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在更新数据，请稍后！',  
         loadMask: true, 
         removeMask: true //完成后移除  
     });
	 myMask.show();
	Ext.Ajax.request({  
		url : '../controller/leader.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		/* alert("success") */
		myMask.hide();

	},
	failure: function(response) {
		myMask.hide();
	}  
	}); 
}
// 设置checkbox的值
function setRadioChecked(record){
	// Ext.getCmp('authoritystatus').down('radio').setValue(record.get('authoritystatus'));
	
}