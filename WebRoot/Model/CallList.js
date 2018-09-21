var hasFile=false;
var hasPttFile=false;
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging',
             'Ext.grid.feature.Grouping'
             ]		 
);
// 创建call Model
Ext.define('call',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'starttime'},
	        {name: 'usetime'},
	        {name: 'caller'},
	        {name: 'person'},
	        {name: 'called'},
	        {name: 'callid'},
	        {name: 'rssi'},
	        {name: 'bsId'},
	        {name: 'bsName'},
	        {name:'name'},
	        {name: 'ldtid'},
	        {name: 'filePath'},
	        {name: 'endway'},
	        {name:'ldtname'}
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
// 创建Model
Ext.define('group',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'alias'},
	        {name: 'type'},
	        {name: 'callmode'},
	        {name: 'priority'},
	        {name: 'slot'},
	        {name: 'count'},
	        {name: 'bs'},
	        {name: 'maxcalltime'},
	        {name: 'roamen'},
	        {name: 'name'}
	        ], 
	        idProperty : 'id'
});

// 创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'call',	
	remoteSort: true,
	groupField:'callid' ,
// 设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/callList.action',
	timeout: 10000,
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
},
autoLoad: true ,// 很关键 ,
sorters: [{ 
	            // 排序字段。
	            property: 'starttime', 
	            // 排序类型，默认为 ASC
	            direction: 'DESC' 
	        }]
}
});
// 创建数据源
var group_store = Ext.create('Ext.data.Store',{
	model:'group',	
	remoteSort: true,
// 设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/talkGroup.action',
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
var callPttStore = Ext.create('Ext.data.Store',{
	
	model:'call',	
	remoteSort: true,
// 设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/callListFromCallid.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
},
autoLoad: true ,// 很关键 ,
sorters: [{ 
	            // 排序字段。
	            property: 'id', 
	            // 排序类型，默认为 ASC
	            direction: 'DESC' 
	        }]
}
});

var Alarm_sys_id_store=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'sys'}],
	data:[
          {id:'2',sys:'===全部=='},
	      {id:'0',sys:'Motrola'},
	      {id:'1',sys:'eTra'}
	      ]
})
// 创建数据源
var bs_store = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
// 设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/bsList.action',
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
 var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 

// 创建Action
var downloadAction=Ext.create('Ext.Action',{
	iconCls:'download',
	text:'下载音频',
	disabled:false,
	tooltip:'下载音频',
	handler:downFile
})
var playAction=Ext.create('Ext.Action',{
	iconCls:'play',
	text:'播放音频',
	disabled:false,
	tooltip:'播放音频',
	handler:player
})
/*
 * var deleteAction=Ext.create('Ext.Action',{ iconCls:'delete', text:'删除数据',
 * disabled:call_del?false:true, tooltip:'删除数据', handler:del_btn });
 */
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
	handler:function(){store.loadPage(1);}
});
// 创建Action
var downPttAction=Ext.create('Ext.Action',{
	iconCls:'download',
	text:'下载音频',
	disabled:false,
	tooltip:'下载音频',
	handler:downPttFile
})
var playPttAction=Ext.create('Ext.Action',{
	iconCls:'play',
	text:'播放音频',
	disabled:false,
	tooltip:'播放音频',
	handler:player
})
var play=Ext.create('Ext.Action',{
	iconCls:'play',
	text:'播放音频',
	disabled:false,
	tooltip:'播放音频',
	handler:player
})
// 创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
	items: [
	        /* deleteAction,'-', */
	        play
	        ]
});

var contextMenu2 = Ext.create('Ext.menu.Menu', {
	items: [
	        playPttAction,
	        downPttAction
	        ]
});
var paggingToolbar=new Ext.PagingToolbar({
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
})
// 创建grid
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
var grid;
/*总计：{[values.rows.length]}   被叫组 ID:<tpl for="rows[0].data">{called}</tpl>*/
var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	groupHeaderTpl: '{columnName} : {name}<span style="color:red;margin-left:40px;">  </span>',
	hideGroupedHeader: true,
    startCollapsed: false,
	});
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
   // xtype: 'grouped-grid',
	region:'center',
	title:'当前位置>>终端信息>>通话记录',
	iconCls:'icon-location',
	store:store,
	frame:false,
	// trackMouseOver: false,
	// renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
   // features: [groupingFeature],
	columns:[
	        // new Ext.grid.RowNumberer({width:50,text:'#'}),
	         {text: "ID", width: 100, dataIndex: 'id', sortable: false,hidden:true},
	         {text: "通话时间", width: 150, dataIndex: 'starttime', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "主叫号码", width: 100, dataIndex: 'caller', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }, 
	         {text: "使用人", width: 100, dataIndex: 'person', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer :function(value, metaData, record, rowIndex, colIndex, store){
	        	 if(record.get("person")==null ||record.get("person")==""){
	        		 return record.get("caller");
	        	 }else{
	        		 return value;
	        	 }
	         }
	         }, 
	         {text: "被叫组", width: 100, dataIndex: 'called', sortable: false,align:'center',
	        	 editor : {  
	        	 allowBlank : false  
	         }},{text: "主讲基站", width: 130, dataIndex: 'bsId', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer :function(value, metaData, record, rowIndex, colIndex, store){
	        	 if(record.get("bsId")==65535){
	        		 return "数模互联";
	        	 }else{
	        		 return record.get("bsId")+":"+record.get("name")
	        	 }
	         }},  
	         {text: "通话时长", width: 80, dataIndex: 'usetime', sortable: false,align:'center',
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "场强", width: 60, dataIndex: 'rssi', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){return v+"dB"}},
	         /*
				 * {text: "结束原因", width: 80, dataIndex: 'endway', sortable:
				 * false, editor : { allowBlank : false }},
				 */{
	        	 text: "播放/下载", flex: 1,  dataIndex: 'Call_id',sortable: false,
	        	 renderer :function(value, metaData, record, rowIndex, colIndex, store){
	        	 isHave(record);
	        	 if(hasFile){
	        		 return "<span style=''><a href='#' onclick='playWav()'><img src='../resources/images/picture/playTrue.png' height='16' width='16'></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='downFile()'><img src='../resources/images/picture/downTrue.png' height='16' width='16'></a></span>";
	        	 }
	        	 else
	        	 {
	        		 return "<span style=''><a href='#' onclick='javascript:alert('文件不存在');'><img src='../resources/images/picture/play.png' height='16' width='16'></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='javascript:alert('文件不存在')'><img src='../resources/images/picture/downFalse.png' height='16' width='16'></a></span>";
	        	 }

	         }

	         }, {text: "流水号",  flex: 1,dataIndex: 'callid', sortable: false,
	        	 editor : {  
		        	 allowBlank : false  
		         }},
	   
	         ],
	         plugins : [cellEditing1],
	       
	         /*
				 * plugins: [{ ptype: 'rowexpander', rowBodyTpl : new
				 * Ext.XTemplate( '<div id="Inner{Call_id}">', '</div>' )}],
				 */
	        /*
			 * view: new Ext.grid.GroupingView({ forceFit:true, groupTextTpl:
			 * '{Call_id} ({[values.rs.length]} {[values.rs.length > 1 ? "项" :
			 * "个"]})' }),
			 */
	         border:true,
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
emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>',
dockedItems: [{
	 xtype: 'toolbar',
	 dock: 'top',
	 items: [ {fieldLabel:'主叫号码',xtype:'textfield',name:'caller',id:'caller',labelWidth: 65,width:140,emptyText:'主叫号码' },
	          /*{fieldLabel:'被叫组',xtype:'textfield',name:'called',id:'called',margin:'0 40',labelWidth: 65,width:140,emptyText:'被叫号码' },*/
	          {fieldLabel:'被叫组',xtype:'combobox',name:'called',id:'called', labelWidth:70,width:230,
	      	        store:group_store,queryModel:'remote',emptyText:'请选择...',value:0,
	      	        valueField:'id',displayField:'name',forceSelection : true},
	          {fieldLabel:'基站',xtype:'combobox',name:'bsId', id:'bsId', labelWidth:40,width:230,
      	        store:bs_store,queryModel:'remote',emptyText:'请选择...',value:0,
      	        valueField:'bsId',displayField:'bsName',forceSelection : true}]
 },{
	 xtype: 'toolbar',
	 dock: 'top',
	 items: [
	          {fieldLabel:'起始时间',xtype:'datetimefield',id:'Ftime',name:'Ftime',format:'Y-m-d H:i:s',
	           value:getDay(),labelWidth: 60,width:220},
	          {fieldLabel:'结束时间',xtype:'datetimefield',id:'Etime',name:'Etime',
	           value:getOneDay(),format:'Y-m-d H:i:s',labelWidth: 60,width:220},'-',
	        			  searchAction,'-',{
	        				  text:'清除',
	        				  iconCls:'clear',
	        				  tooltip:'清除输入的查询数据',
	        				  handler: function(){
	        				  Ext.getCmp("caller").reset();
	        				  Ext.getCmp("called").reset();
	        				  Ext.getCmp("Ftime").reset();
	        			  }}]
 },{
	dock: 'bottom',
	xtype: 'pagingtoolbar',
	store: store, 
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
// grid.dockedItems.get(refreshStr).child('#refresh').hide(true);
grid.dockedItems.get(refreshStr).child('#refresh').setHandler(   
	     function() {   
	            Ext.getCmp('Etime').setValue(getOneDay());
	            store.loadPage(1);
	     }  
);
var detailPanel=Ext.create('Ext.Panel',{
	region:'center',
	title:'发起呼叫者详细信息',
	html:'<div id="callerInfo">点击左侧表格行获取详细信息</div>'
})
var voicePanel=Ext.create('Ext.Panel',{
	region:'south',
	title:'语音播放器',
	height:210,
	html : '<iframe id="wav" style="" src="" frameborder="0" width="340px" scrolling="no" height="210px"></iframe>', 
})

var rightPanel=Ext.create('Ext.Panel',{
	region:'east',
	width:340,
	layout:'border',
	items:[detailPanel,voicePanel]
})

bs_store.on('load',function(){
	console.log("bsstore:"+bs_store.getCount());
	for(var i =0;i<bs_store.getCount();i++){
		bs_store.getAt(i).set("bsName",bs_store.getAt(i).get('bsId')+":"+bs_store.getAt(i).get("bsName"));

	}
	var ins_rec = Ext.create('bs',{
		bsId:0,bsName:"所有基站"
    }); 
    bs_store.insert(0,ins_rec);
    Ext.getCmp('bsId').setValue(0);
	// bs_store.addSorted({bsId:0,bsName:"全部"});
})
store.on('beforeload', function (store, options) {  
	var new_params = { 
			caller: Ext.getCmp('caller').getValue(),
			called: Ext.getCmp('called').getValue(),
			bsId: Ext.getCmp('bsId').getValue(),
			callid: '',
			startTime: Ext.getCmp('Ftime').getValue(),
			endTime: Ext.getCmp('Etime').getValue()
	};  
	Ext.apply(store.proxy.extraParams, new_params);  

});
group_store.on('beforeload', function (store, options) {  
	var new_params = { 
			id: "",
    		name: ""
	};  
	Ext.apply(store.proxy.extraParams, new_params);  

});
group_store.on('load',function(){
	/*for(var i =0;i<group_store.getCount();i++){
		bs_store.getAt(i).set("bsName",bs_store.getAt(i).get('bsId')+":"+bs_store.getAt(i).get("bsName"));

	}*/
	var ins_rec = Ext.create('group',{
		id:"",name:"所有被叫组"
    }); 
	group_store.insert(0,ins_rec);
    Ext.getCmp('called').setValue("");
	// bs_store.addSorted({bsId:0,bsName:"全部"});
})
var  innerGrid = Ext.create('Ext.grid.Panel', {
	title:'播放列表',
	store: callPttStore,
	// collapsible : true, // 设置可折叠,
	split : true, 
	region:'center',
	columns:[
	         new Ext.grid.RowNumberer({width:22,text:'#'}), 
	         {text: "ID", width: 20, dataIndex: 'id', sortable: true,hidden:true},
	         {text: "主叫号码", width: 80, dataIndex: 'caller', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }, 
	         {text: "被叫号码", width: 80, dataIndex: 'called', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "通话时长", width: 80, dataIndex: 'usetime', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "通话时间", width: 140, dataIndex: 'starttime', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "结束原因", width: 80, dataIndex: 'endway', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {
	        	 text: "播放/下载", width: 80, dataIndex: 'Call_id',sortable: false,
	        	 renderer :function(value, metaData, record, rowIndex, colIndex, store){
	        	 isHave(record);
	        	 if(hasFile){
	        		 return "<span style=''><a href='#' onclick='player()'><img src='../resources/images/picture/playTrue.png' height='16' width='16'></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='downFile()'><img src='../resources/images/picture/downTrue.png' height='16' width='16'></a></span>";
	        	 }
	        	 else
	        	 {
	        		 return "<span style=''><a href='#' onclick='javascript:alert('文件不存在');'><img src='../resources/images/picture/play.png' height='16' width='16'></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='javascript:alert('文件不存在')'><img src='../resources/images/picture/downFalse.png' height='16' width='16'></a></span>";
	        	 }

	         }

	         }
	         ],
	         plugins : [cellEditing],
	         dockedItems:[{
	        		dock: 'bottom',
	        		xtype: 'pagingtoolbar',
	        		store: callPttStore, 
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
	        		},{
	        			xtype:'button',
	        			text:'123',
	        			handler:function(){
	        			var s=playPanel.body.dom
	        			alert(s.innerHtml)
	        			
	        		}
	        		}]


	        	}],	
	        	
	         viewConfig: {
	stripeRows: true,
	listeners: {
	itemcontextmenu: function(view, rec, node, index, e) {
	e.stopEvent();
	contextMenu2.showAt(e.getXY());
	return false;
}
}
},
frame:true,
border:true,
disableSelection: false,
forceFit: true,
columnLines : true,
height:420
});
// 表格行选择
grid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 
			Ext.Ajax.request({
				url:'../data/callerInfo.action',
				params: {
				caller:record.get('caller')
			},
			method:'POST',
			async:false,
			success : function(response,opts){
				var rs=Ext.decode(response.responseText);
				if(rs.total>0){
					var data=rs.items[0];
					var html='<div>';
					html+='<table border=1 cellpadding="1" cellspacing="1" id="callerInfo-table">';
					html+='<tr class="tr-yellow"><th>属性</th><th>信息</th></tr>';
					html+='<tr><td>ID</td><td>'+data.mscId+'</td></tr>';
					html+='<tr><td>型号</td><td>'+data.model+'</td></tr>';
					html+='<tr><td>机器号</td><td>'+data.number+'</td></tr>';
					html+='<tr><td>ESN</td><td>'+data.esn+'</td></tr>';
					html+='<tr><td>开机密码</td><td>.....</td></tr>';
					html+='<tr><td>PDT ID</td><td>'+data.pdtId+'</td></tr>';
					html+='<tr><td>登记人</td><td>'+data.checkPerson+'</td></tr>';
					html+='<tr class="tr-default"><td>使用单位</td><td>'+data.company+'</td></tr>';
					html+='<tr class="tr-default"><td>使用人</td><td>'+data.person+'</td></tr>';
					html+='<tr class="tr-default"><td>警员编号</td><td>'+data.personNumber+'</td></tr>';
					html+='<tr class="tr-default"><td>职位</td><td>'+data.post+'</td></tr>';
					html+='</table>';
					html+='</div>';
					
					$("#callerInfo").html(html);
				}else{
					$("#callerInfo").html("没有个人详细信息");
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
		frame:false,
		layout:"border",
		renderTo:'content',
		items:[grid,rightPanel]
	})
	store.load({params:{start:0,limit:50}}); 
	bs_store.load(); 
	group_store.load();
});
// 增加、删除，修改功能
// 提示信息
var Tip=function(){
	Ext.Msg.wait("数据删除中","等待完成",{text:"正在删除。。。"});
}
// -----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;

// -----------------------------------------------编码ID删除
// --------------------------------------------------
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
				Ext.example.msg("提示","正在删除数据");
				Ext.Ajax.request({  
					url : '../controller/delCallList.action',  
					params : {  
					deleteIds : ids.join(',') 
				},  
				success : function(response, opts) {  
					var success = Ext.decode(response.responseText).success; 

					// 当后台数据同步成功时
					if (success) {  
						Ext.Array.each(data, function(record) {  
							store.remove(record);// 页面效果
						}); 
						Ext.example.msg("提示","数据删除成功");

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
grid.getSelectionModel().on({
	selectionchange:function(sm,selections){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 
		callPttStore.on('beforeload', function (store, options) {  
			var params = { 
					callid: record.get("callid"),
					id: record.get('id')
			};  
			Ext.apply(store.proxy.extraParams,params);  


		});
		callPttStore.load({params:{start:0,limit:50}}); 
	}
}

});


// 检查文件是否存在
function isHave(record)
{
	// var record = grid.getSelectionModel().getLastSelected();
	if(record.get("filePath")==""){
		return;
	}
	Ext.Ajax.request({
		url:'../controller/fileIsExists.action',
		params: {
		// fileName:record.get("filename"),
		filePath:record.get("filePath")
	},
	method:'POST',
	async:false,
	success : function(response,opts){
		var success=Ext.decode(response.responseText).success;
		if(success){
			hasFile=true;
		}else{
			hasFile=false;
		}
	},
	failure: function(response) {
		hasFile=false;
	}})	
}
function isPttHave(record)
{
	// var record = innerGrid.getSelectionModel().getLastSelected();
	if(record.get("filePath")==""){
		return;
	}
	Ext.Ajax.request({
		url:'../controller/fileIsExists.action',
		params: {
		// fileName:record.get("filename"),
		filePath:record.get("filePath")
	},
	method:'POST',
	async:false,
	success : function(response,opts){
		var success=Ext.decode(response.responseText).success;
		if(success){
			hasPttFile=true;
		}else{
			hasPttFile=false;
		}
	},
	failure: function(response) {
		hasPttFile=false;
	}})	
	return hasPttFile;
}

innerGrid.getSelectionModel().on({
	selectionchange: function(sm, selections) {
	var data=innerGrid.getSelectionModel().getSelection();
	if(data.length !=1){return;}
	else
	{
		var record = innerGrid.getSelectionModel().getLastSelected(); 
		if(record.get("filePath")==""){
			downPttAction.disable();
			playPttAction.disable();
			return;
		}
		Ext.Ajax.request({
			url:'../controller/fileIsExists.action',
			params: {
			fileName:record.get("filename"),
			filePath:record.get("filePath")
		},
		method:'POST',
		success : function(response,opts){
			var success=Ext.decode(response.responseText).success;
			if(success){
				downPttAction.enable();
				playPttAction.enable();
			}else{
				downPttAction.disable();
				playPttAction.disable();
			}
		},
		failure: function(response) {
			downPttAction.disable();
			playPttAction.disable();
		}})}}});
// 下载音频
function downFile(){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1){
		Ext.MessageBox.show({
			title:'提示',
			msg:'请选择一条数据',
			icon: Ext.MessageBox.INFO
		});
		return;
	}
	else
	{
		var record = grid.getSelectionModel().getLastSelected(); 
		var playerPath=record.get("filePath");
		var index=playerPath.lastIndexOf("/");
		playerPath=playerPath.substring(index+1,playerPath.length);
		var name=playerPath
		var downUrl = "../controller/downwav.action?fileName="+name+"&inputPath="+record.get("filePath"); 
		Ext.Ajax.request({
			url:'../controller/fileIsExists.action',
			params: {
			fileName:record.get("name"),
			filePath:record.get("filePath")
		},
		method:'POST',
		success : function(response,opts){
			var success=Ext.decode(response.responseText).success;
			if(success){
				window.open(downUrl,'_self','width=1,height=1,toolbar=no,menubar=no,location=no');	
			}else{
				Ext.MessageBox.show({
					title:'提示',
					msg:'文件不存在',
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


		// window.open(downUrl,'_self','width=1,height=1,toolbar=no,menubar=no,location=no');
	}

}
// 下载音频
function downPttFile(){
	var data=innerGrid.getSelectionModel().getSelection();
	if(data.length !=1){
		Ext.MessageBox.show({
			title:'提示',
			msg:'请选择一条数据',
			icon: Ext.MessageBox.INFO
		});
		return;
	}
	else
	{
		var record = innerGrid.getSelectionModel().getLastSelected(); 
		var playerPath=record.get("filePath");
		var index=playerPath.lastIndexOf("/");
		playerPath=playerPath.substring(index+1,playerPath.length);
		var name=playerPath;
		var downUrl = "../controller/downwav.action?fileName="+name+"&inputPath="+record.get("filePath"); 
		Ext.Ajax.request({
			url:'../controller/fileIsExists.action',
			params: {
			fileName:name,
			filePath:record.get("filePath")
		},
		method:'POST',
		success : function(response,opts){
			var success=Ext.decode(response.responseText).success;
			if(success){
				window.open(downUrl,'_self','width=1,height=1,toolbar=no,menubar=no,location=no');	
			}else{
				Ext.MessageBox.show({
					title:'提示',
					msg:'文件不存在',
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


		// window.open(downUrl,'_self','width=1,height=1,toolbar=no,menubar=no,location=no');
	}

}
// 播放音频
var win="";
function playWav(){
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1)
	{
		Ext.MessageBox.show({
			title:'提示',
			msg:'请选择一条数据',
			icon:Ext.MessageBox.INFO
		});
		return ;
	}
	var record = grid.getSelectionModel().getLastSelected(); 	    	
	var playerPath=record.get("filePath");	    	
	playerPath=playerPath.substring(1,playerPath.length);

	var index=playerPath.lastIndexOf("/");
	var name=playerPath.substring(index+1,playerPath.length);	
	voicePanel.setTitle("正在播放: &nbsp;"+name)
	Ext.get("wav").dom.src = "../View/play.jsp?playerID="+playerPath
}

function player(){	
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1)
	{
		Ext.MessageBox.show({
			title:'提示',
			msg:'请选择一条数据',
			icon:Ext.MessageBox.INFO
		});
		return ;
	}
	else{
		var record = grid.getSelectionModel().getLastSelected(); 	    	
		var playerPath=record.get("filePath");	    	
		playerPath=playerPath.substring(1,playerPath.length);

		var index=playerPath.lastIndexOf("/");
		var name=playerPath.substring(index+1,playerPath.length);		
		win = Ext.getCmp("player");

		if (!win) {
			win =new Ext.Window({
				id: 'player',
				title: "....正在播放: &nbsp;"+name,
				width: 410,
				height: 220,
				resizable:false,
				iconCls: 'play',
				closable:true,
				animCollapse: false,
				maximizable : false,
				border: false,
				layout: 'fit',
				plain: true, 

				items: [{
					header:false, 
					html : '<iframe style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; width: 728px; height: 455px; border-right-width: 0px" src="../View/play.jsp?playerID='+playerPath+'" frameborder="0" width="100%" scrolling="no" height="100%"></iframe>', 
					border:false 
				}]
			});
		}

		win.show();
	}

}
// 播放音频
function PttPlayer(){	
	var data=innerGrid.getSelectionModel().getSelection();
	if(data.length !=1)
	{
		Ext.MessageBox.show({
			title:'提示',
			msg:'请选择一条数据',
			icon:Ext.MessageBox.INFO
		});
		return ;
	}
	else{
		var record = innerGrid.getSelectionModel().getLastSelected(); 	    	
		var playerPath=record.get("filePath");	    	
		playerPath=playerPath.substring(1,playerPath.length);

		var index=playerPath.lastIndexOf("/");
		var name=playerPath.substring(index+1,playerPath.length);	
		win = Ext.getCmp("playPtt");
		if (!win) {
			win =new Ext.Window({
				id: 'playPtt',
				title: "....正在播放: &nbsp;"+name,
				width: 410,
				height:220,

				iconCls: 'play',
				resizable:false,
				animCollapse: false,
				maximizable : false,
				border: false,
				layout: 'fit',
				plain: true, 
				items: [{  title: '', 
					header:false, 
					html : '<iframe style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; width: 728px; height: 455px; border-right-width: 0px" src="../View/play.jsp?playerID='+playerPath
					+'" frameborder="0" width="100%" scrolling="no" height="100%"></iframe>', 
					border:false 
				}]
			});
		}
		win.show();
	}	   		
}
// 时间格式化
function getTime(time)
{
	var datetime="";
	var datem=Math.floor(time/60);
	var dates=time%60;
	if(datem<10){datem="0"+datem}
	if(dates<10){dates="0"+dates}
	datetime=datem+":"+dates;   	
	return datetime;
}
function GetDay()   
{   
    var  today=new Date();      
    var  yesterday_milliseconds=today.getTime();    // -1000*60*60*24

    var  yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    }   
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"00:00:00";   
    return  strYesterday;
}

// 播放音频
function p_music()
{
	var data=grid.getSelectionModel().getSelection();
	if(data.length !=1)
	{
		Ext.MessageBox.show({
			title:'提示',
			msg:'请选择一条数据',
			icon:Ext.MessageBox.INFO
		});
		return ;
	}
		var paths=[];
		callPttStore.each(function(record) {
			var path=record.get('filePath');  
			path=path.substring(1,path.length);
			// path="../.."+path;
			// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
			if(path){paths.push(path);} 
	    });
		
	var playPanel=Ext.create('Ext.Panel',{
		region:'north',
		border:false,
		items: [{  title: '', 
			header:false, 
			html : '<iframe style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; width: 728px; height: 455px; border-right-width: 0px" src="../View/playall.jsp?paths='+paths
			+'" frameborder="0" width="100%" scrolling="no" height="100%"></iframe>', 
			border:false 
		}],
		height:180
	})
	var playWin=Ext.create('Ext.Window',{
		items:playPanel,
		autoWidth:true,
		autoHeight:true,
		closeAction:'close'
	})
	
	
	playWin.show();
	// p_play()
}
var flag=0;
function p_play(){
	var paths=[];
	callPttStore.each(function(record) {
		var path=record.get('filePath');  
// path=path.substring(1,path.length);
		path="../.."+path;
		// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
		if(path){paths.push(path);} 
    });
	var starts = document.getElementById("player").playState;
	if(starts==1 && flag<paths.length-1)
	{
	flag++;
	document.getElementById("player").url = paths[flag];
	document.getElementById("player").controls.play();
	var view = innerGrid.getView();
	var record = callPttStore.getAt(flag);
    var rowId = view.getRowId(record);
    var rowDom = innerGrid.getEl().down("#" + rowId);
    rowDom.setStyle({
    	 color:"green",
    	 backgroundColor:'red'
    	 
     })
     callPttStore.getAt(flag).set('status','正在播放');
	}
	timer = setTimeout("p_play()",1000);
}


// 显示播放列表
var playWindow="";
var music_src = new Array();
var music_index = 0;
var timeout=0;
function showPlayWindow(){
	var paths=[];
	callPttStore.each(function(record) {
		var path=record.get('filePath');  
		path=path.substring(1,path.length);
// path="../.."+path;
		// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
		if(path){paths.push(path);} 
		
    });
	music_src=paths;
	var html='<object id="wind_meb" height="100" width="700" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" title="双击播放器屏幕可以全屏">'
		+'<embed src="" autoold=true loop=1 hidden=false '
		+' type="audio/x-wav" height=100 width=700 controls=smallconsole palette="#FF7F50" align="middle"></embed>'
		 +'<param NAME="AutoStart" VALUE="0">'
		 +'<!--是否自动播放-->'
		 +'<param NAME="Balance" VALUE="0">'
		 +'<!--调整左右声道平衡,同上面旧播放器代码-->'
		 +'<param name="enabled" value="1">'
		 +'<!--播放器是否可人为控制-->'
		 +'<param NAME="EnableContextMenu" VALUE="1">'
		 +'<!--是否启用上下文菜单-->'
		 +'<param NAME="url" VALUE="">'
		 +'<!--播放的文件地址-->'
		 +'<param NAME="PlayCount" VALUE="1">'
		 +'<!--播放次数控制,为整数-->'
		 +'<param name="rate" value="1">'
		 +'<!--播放速率控制,1为正常,允许小数,1.0-2.0-->'
		 +'<param name="currentPosition" value="0">'
		 +'<!--控件设置:当前位置-->'
		 +'<param name="currentMarker" value="0">'
		 +'<!--控件设置:当前标记-->'
		 +'<param name="defaultFrame" value="1">'
		 +'<!--显示默认框架-->'
		 +'<param name="invokeURLs" value="0">'
		 +'<!--脚本命令设置:是否调用URL-->'
		 +'<param name="baseURL" value="">'
		 +'<!--脚本命令设置:被调用的URL-->'
		 +'	<param name="stretchToFit" value="1">'
		 +'	<!--是否按比例伸展-->'
		 +'	<param name="volume" value="50">'
		 +'<!--默认声音大小0%-100%,50则为50%-->'
		 +'<param name="mute" value="0">'
		 +'	<!--是否静音-->'
		 +'<param name="uiMode" value="Full">'
		 +'<!--播放器显示模式:Full显示全部;mini最简化;None不显示播放控制,只显示视频窗口;invisible全部不显示-->'
		 +'	<param name="windowlessVideo" value="0">'
		 +'	<!--如果是0可以允许全屏,否则只能在窗口中查看-->'
		 +'	<param name="fullScreen" value="0">'
		 +'<!--开始播放是否自动全屏-->'
		 +'	<param name="enableErrorDialogs" value="-1">'
		 +'	<!--是否启用错误提示报告-->'
		 +'	<param name="SAMIStyle" value="1">'
		 +'<!--SAMI样式-->'
		 +'	<param name="SAMILang" value="1">'
		 +'	<!--SAMI语言-->'
		 +'	<param name="SAMIFilename" value="1">'
		 +'	<!--字幕ID-->'
		 +'	<param name="ShowStatusBar" value="1">'
		 +'	</object>';
	if(userAgent()!="ie"){
		html='<p>浏览器不支持播放</p>';
	}
	var record = grid.getSelectionModel().getLastSelected(); 
	var Callid=record.get("callid");
	var playPanel=Ext.create('Ext.Panel',{
		border:false,
		region:'north',
		height:100,
// html:html,
		items: [{  title: '', 
			header:false, 
			html : '<iframe style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; width: 728px; height: 455px; border-right-width: 0px" src="../View/playall.jsp?paths='+paths
			+'" frameborder="0" width="100%" scrolling="no" height="100%"></iframe>', 
			border:false 
		}]
	})
	var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return;  
	}else if(data.length>1){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "只能选择一行数据!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return; 
	}else{
		 playWindow=Ext.create('Ext.Window',{
			layout:'border',
			title:'MediaPlayer播放器',
			width:710,
			height:450,
			closeAction:'hide',
			items:[playPanel,innerGrid],
			listeners: {
			 'hide':function(){
			 playWindow="";
			 /*
				 * music_index=music_src.length-1; timeout=1;
				 * document.getElementById("wind_meb").url="";
				 */
			 playPanel.removeAll();
			 playPanel.doLayout();
	
			 }
		 }
		})
		playWindow.show();
		/*
		 * document.getElementById("wind_meb").url = music_src[music_index];
		 * document.getElementById("wind_meb").controls.play(); wavController();
		 */
		
		
	}
}
// 播放控制
function wavController(){
	var starts = document.getElementById("wind_meb").playState;
	if(starts == 1 && music_index<music_src.length-1)
	{
	music_index++;
	document.getElementById("wind_meb").url = music_src[music_index];
	document.getElementById("wind_meb").controls.play();

	}
	timer=setTimeout("wavController()",100);
}

// 浏览器判断
function userAgent(){
	var str=navigator.userAgent;
	var explorer = window.navigator.userAgent ;
	// ie
	if (explorer.indexOf("MSIE") >= 0) {
	return "ie";
	}
	// firefox
	else if (explorer.indexOf("Firefox") >= 0) {
		return "Firefox";
	}
	// Chrome
	else if(explorer.indexOf("Chrome") >= 0){
		return "Chrome";
	}
	// Opera
	else if(explorer.indexOf("Opera") >= 0){
	return "Opera";
	}
	// Safari
	else if(explorer.indexOf("Safari") >= 0){
	return "Safari";
	}
}
function getDay()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    // -1000*60*60*24

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
    var   yesterday_milliseconds=today.getTime();    // -1000*60*60*24

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

