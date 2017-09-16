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
	        {name: 'mscId'},
	        {name: 'person'}
	        ], 
	        idProperty : 'id'
});
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'bsId'},
	        {name: 'name'},
	        {name: 'bsName'}
	        ], 
	        idProperty : 'id'
});
var userStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscId'},{name:'name'},{name:'onlinestatus'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/useronline.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
//创建数据源
var mscIdstore = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
//	设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/bkMscIdList.action',
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
var tellCenterAction=Ext.create('Ext.Action',{
	text:'手动同步中心屏蔽列表',
	/*iconCls:'search',*/
	tooltip:'手动同步中心屏蔽列表',
    handler:function(){tellCenter()}
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        refreshAction,
    ]
});
//创建grid

var usergrid=Ext.create('Ext.grid.Panel',{	
	title:'当前位置>>终端>>Gps屏蔽',
	iconCls:'icon-location',
	margin:'0 3 0 0',
	region:'center',
	store:userStore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "号码", width: 80, dataIndex: 'id'
	         },{text: "名称", width: 80, dataIndex: 'name', sortable: true
	         },{text: "状态", width: 50, dataIndex: 'onlinestatus',
	        	 renderer:function(v){
	        		 if(v){return "在线";}
	        		 else{return "<span style='color:red'>离线</span>"}
	        		 
	        	 }
	         }
	         ],
	        // plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                    // contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },	 
	         emptyText:'<span>对不起，没有查询到数据</span></h1>',
	         /*tbar:[{
            	 xtype:'button',
            	 text:'<span style="color:red">手动上拉GPS</span>',
            	 margin:'30 0 0 0',
            	 iconCls:'gpstask',
            	 handler:gpsTask
             },{
            	 xtype:'button',
            	 text:'<span style="color:green">添加时间段任务</span>',
            	 margin:'20 0 0 0',
            	 iconCls:'selfgpstask',
            	 handler:addTask
             },{
            	 xtype:'button',
            	 text:'<span style="color:blue">添加定时任务</span>',
            	 margin:'20 0 0 0',
            	 iconCls:'selfgpstask',
            	 handler:addTimerTask
             }],*/
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{
	 				xtype:'combobox',fieldLabel:'支队',id:'mscType',name:'mscType',labelWidth:30,
		    		store:[
		    		       ["0","不限制"],["16","领导"],["0120","和平"],["0221","河东"],["0322","河西"],["0423","河北"],
		    		       ["0524","南开"],["0625","红桥"],["0726","东丽"],["0827","西青"],
		    		       ["0928","津南"],["1029","北辰"],["0033","机关"],["1139","塘沽"],
		    		       ["1240","汉沽"],["1341","大港"]],
		    		queryMode:'local',value:"0",width:110
				},{
	 				xtype:'combobox',fieldLabel:'状态',id:'status',name:'status',labelWidth:30,
		    		store:[
		    		       [2,"不限制"],[0,"离线"],[1,"在线"]],
		    		queryMode:'local',value:1,width:110
				},{
					xtype:'numberfield',name:'mscId',id:'mscId',fieldLabel:'号码',labelWidth:30,width:130
				},{
	            	 xtype:'button',
	            	 text:'查询',
	            	 iconCls:'search',
	            	 handler:function(){userStore.reload()}
	             }]
         },{
             dock: 'bottom',
             xtype: 'pagingtoolbar',
             store: userStore, 
          	 displayInfo: true, 

          	 displayMsg: '<div>显示 {0} - {1} 条，共计 {2} 条</div>', 
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

});
var TkGroupBsGrid=Ext.create('Ext.grid.Panel',{
	margin:'0 0 0 2',
	title:'Gps信息推送限制手台列表',
	region:'center',
	// width:400,
	store:mscIdstore ,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "手台ID", width: 100, dataIndex: 'mscId', sortable: true},
	         {text: "名称", flex:1, dataIndex: 'person', sortable: true},
	         {text: "操作", width: 120, dataIndex: 'name', sortable: true,
	        	 renderer:function(value,metaData,record){
	        	 var str="<img src='../resources/images/picture/delete.png'>" +
	        	 		"<a href='#' onclick=delMscId()>删除</a>";
	        	 return str;
	         }}
	         ],
	        /* plugins : [cellEditing], */
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true,
	         
	         selModel: Ext.create('Ext.selection.CheckboxModel'),
	         viewConfig: {
	             stripeRows: true
	         },

	         emptyText:'<span>没有查询到数据</span>',
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{
					xtype:'numberfield',name:'msc',id:'msc',fieldLabel:'号码',labelWidth:30,width:130
				},{
	            	 xtype:'button',
	            	 text:'查询',
	            	 iconCls:'search',
	            	 handler:function(){mscIdstore.reload()}
	             },tellCenterAction]
         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             // style:'background: skyblue',
	             store: mscIdstore, 
	          	 displayInfo: true, 
	          	 items:[{text:'',
	          		tooltip:'删除限制手台ID',
	            	 iconCls:'delete',handler:delMscId}]

	          	
	         }]

});

//表格行选择
usergrid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=usergrid.getSelectionModel().getSelection();
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
userStore.on('beforeload', function (store, options) {  
    var new_params = { 
    		mscType:Ext.getCmp("mscType").getValue(),
    		mscId:Ext.getCmp("mscId").getValue(),
    		online:Ext.getCmp("status").getValue(),
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
mscIdstore.on('beforeload', function (store, options) {  
    var new_params = { 
    		mscId:Ext.getCmp("msc").getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
var right=Ext.create('Ext.panel.Panel',{
	bodyCls:'panel',
	layout:'border',
	border:false,
	region:'east',
	width:500,
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
	items:[usergrid,{
		xtype:"panel",
		region:'east',
		width:150,
		items:[{
			border:0,margin:'20,0,0,0',
			width:100,
			html:'<div class="" onclick="addMscId()">描述：该功能主要是屏蔽电台，禁止将gps信息推送到三方平台，但是手台还是允许gps信息上报到系统</div>'
		},{
			xtype:"button",
			margin:'50 0 0 10',
			text:'添加到限制列表>>',
			handler:addMscId
		}]
	},right]
     })
	userStore.load({params:{start:0,limit:100}});
	mscIdstore.load({params:{start:0,limit:100}});
});



//增加、删除，修改功能

//-----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
function delMscId() {  
	var data = TkGroupBsGrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.WARNING
		});  
		return;  
	} else {  
		Ext.Msg.confirm("请确认", "是否要解除屏蔽", function(button, text) {  
			if (button == "yes") {  
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('mscId');  
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在删除数据，请稍后！',  
                     //loadMask: true, 
                     removeMask: true //完成后移除  
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/openPushGps.action',  
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
						Ext.example.msg("提示","解除屏蔽成功");
						mscIdstore.reload();

					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "解除屏蔽失败!" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},
				 failure: function(response) {
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!", 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
function addMscId() {  
	var data = usergrid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.WARNING
		});  
		return;  
	} else {  
		Ext.Msg.confirm("请确认", "是否真的要屏蔽电台推送gps信息到三方系统", function(button, text) {  
			if (button == "yes") {  
				var ids = [];  
				Ext.Array.each(data, function(record) {  
					var userId=record.get('id');  
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在添加数据，请稍后！',  
                     //loadMask: true, 
                     removeMask: true //完成后移除  
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/stopPushGpsList.action',  
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
						Ext.example.msg("提示","屏蔽成功");
						userStore.reload();
						mscIdstore.reload();

					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "屏蔽失败!" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},
				 failure: function(response) {
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!", 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}

//通知中心
function tellCenter(){
	Ext.Ajax.request({  
		url : '../controller/UpdateGPSFileterTable.action',  
		params : {  
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		if(rs.success){
			Ext.example.msg("提示","中心同步成功");
		}else{
			Ext.example.msg("提示","中心同步失败");
		}

	},
	failure: function(response) {
	}  
	}); 
}
