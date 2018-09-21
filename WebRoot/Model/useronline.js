//创建Model
Ext.define('offonline',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'mscid'},
	        {name: 'name'},
	        {name: 'online'},
	        {name: 'time'}	      
	        ], 
	        idProperty : 'id'
})
Ext.define('radiouser',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'name'}
	        ], 
	        idProperty : 'id'
})
Ext.define('detm',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'name'}
	      
	        ], 
	        idProperty : 'id'
})

var is_pull=false;

// 创建数据源
var detachmentStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name:'name'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/RadioUserDetm.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var store = Ext.create('Ext.data.Store',{
	model:'offonline',	
	remoteSort: true,
// 设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../data/radioOffLine.action',
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
var userstore = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
// 设置分页大小
	pageSize:10000,
	proxy: {
	type: 'ajax',
	url : '../data/useroffonline.action',
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
var userOnlineStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscId'},
	           {name:'name'},{name:'onlinestatus'},{name:'lat'},{name:'lng'},{name:'result'}],
	remoteSort : true,
	pageSize : 1000,
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
// 创建Action
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除数据',
	disabled:true
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'上线记录',
	icon:'../resources/images/btn/3.png',
    handler:function(){
    	Ext.getCmp('tag').setValue(0);
    	store.loadPage(1);}
});
var onlineStatusAction=Ext.create('Ext.Action',{
	text:'上线状态查询',
	icon:'../resources/images/btn/2.png',
    handler:function(){
    	Ext.getCmp('tag').setValue(1);
    	store.loadPage(1);}
});
var offonlineAction=Ext.create('Ext.Action',{
	text:'未上线手台查询',
	icon:'../resources/images/btn/4.png',
    handler:function(){searchOffonline()}
});
var onlineAction=Ext.create('Ext.Action',{
	id:'online',
	text:'在线手台统计',
	icon:'../resources/images/btn/1.png',
    handler:function(){
    	gpsTask();
    	 
    	 }
});
// 创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        deleteAction,'-',
        refreshAction
    ]
});
 // 创建多选
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
// 创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'终端>>手台历史上下线记录',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         /*new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "手台ID", width: 100, dataIndex: 'mscid', sortable: true},
	         {text: "使用人", width: 100, dataIndex: 'name', sortable: true},
	         
	         {text: "在线状态", width: 100, dataIndex: 'online', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v,b){
	        	 if(v){
	        		 return "在线";
	        	 }else{
	        		 return "离线";
	        	 }
	         }},
	         {text: "时间", width: 120, dataIndex: 'time', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}                  
	         ],
	         /*plugins : [cellEditing],*/
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<span>对不起，没有查询到数据</span>',
	         /*selModel: selModel,*/
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
	             items: [ {
		 				xtype:'combobox',fieldLabel:'支队',id:'mscType',name:'mscType',labelWidth:30,
		 				store:detachmentStore,
			    		queryMode: "local",
			    		editable: false,
			            displayField: "name",
			            valueField: "id",
			            emptyText: "--请选择--",
			    		width:180
					},{fieldLabel:'手台ID',xtype:'textfield',name:'mscid',id:'mscid',labelWidth: 50,width:130,emptyText:'手台ID' },
		        	         {fieldLabel:'起始时间',
		        	        	 xtype:'datetimefield',
		        	        	 id:'Ftime',
		        	        	 name:'Ftime',
		        	        	 format:'Y-m-d H:i:s',
		        	        	 value:getDay(),
		        	        	 labelWidth: 60,width:220},
		        	         {fieldLabel:'结束时间',
		        	        		 xtype:'datetimefield',
		        	        		 id:'Etime',
		        	        		 name:'Etime',
		        	        		 value:getOneDay(),
		        	        		 format:'Y-m-d H:i:s',
		        	        		 labelWidth: 60,width:220},
		        	        		 {fieldLabel:'手台ID',xtype:'textfield',id:'tag',value:0,
		        	        			 labelWidth: 50,width:130,hidden:true }]
	         },{
	             dock: 'top',
	             xtype: 'toolbar',
	             items:["->",onlineAction,onlineStatusAction,searchAction,offonlineAction,{
	        	        	 text:'清除',
	        	        	 iconCls:'clear',
	        	        	 tooltip:'清除输入的查询数据',
	        	        	 handler: function(){
		        	         Ext.getCmp("mscid").reset();
	        	         }}]

	          	 
	         },{
	        	 dock:'top',
	        	 xtype:'panel',
	        	 height:30,
	        	 html:"<div id='showMessageInfo'></div>"
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: store, 
	          	 displayInfo: true

	          	 
	         }]

})
}
var offonlineGrid=Ext.create('Ext.grid.Panel',{
	title:'终端>>手台历史未上线列表',
	iconCls:'icon-location',
	region:'east',
	width:600,
	margin:'0 0 0 10',
	store:userstore,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         /*new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "手台ID", width: 100, dataIndex: 'id', sortable: true},
	         {text: "名称", width: 100, dataIndex: 'name', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}                  
	         ],
	        /* plugins : [cellEditing],*/
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<span>对不起，没有查询到数据</span>',
	        /* selModel: selModel,*/
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                    
	                 }
	             }
	         },
	         dockedItems: [{
	             dock: 'top',
	             xtype: 'panel',
	             html:'<div id="time-div"></div>'

	          	 
	         }/*,{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: userstore, 
	          	 displayInfo: true

	          	 
	         }*/]

})


store.on('beforeload', function (store, options) {  
    var new_params = { 
    		mscType: Ext.getCmp('mscType').getValue(),
    		msc: Ext.getCmp('mscid').getValue(),
    		startTime: Ext.getCmp('Ftime').getValue(),
    		endTime: Ext.getCmp('Etime').getValue(),
    		tag:Ext.getCmp('tag').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
detachmentStore.on('load', function (s, options) {  
	var ins_rec = Ext.create('detm',{
	      id:0,
	      name:'===全部==='
	    }); 
	    s.insert(0,ins_rec);
	    Ext.getCmp("mscType").setValue(0);
});
var i=0;
var timeout=null;
userOnlineStore.on('beforeload', function (s, options) {  
    var new_params = { 
    		mscType:Ext.getCmp('mscType').getValue(),
    		mscId:Ext.getCmp("mscid").getValue(),
    		online:1,
    		};  
    Ext.apply(s.proxy.extraParams, new_params); 

});
userOnlineStore.on('load', function (s, options) { 
	var ids = []; 
	if(s.getCount()<1){
		$("#showMessageInfo").html("根据条件没有找到相关手台");
		return;
	}
	truncateOnlineUser();
	Ext.getCmp('online').disable();
    timeout=setInterval(function(){
		if(i<s.getCount()){			
			gpsSet(i);
			var html="正在统计数据；手台<span style='color:red;font-weight:800'>总数："+s.getCount()+"个</span>"+"      正在获取第<span style='color:red;font-weight:800'>"+(i+1)+"</span>个手台的状态";
			$("#showMessageInfo").html(html);
		}else{
			clearInterval(timeout);
			timeout=null;
			i=0;/*flag=0;successfully=0;error=0;*/
			 Ext.getCmp('online').enable();
			
			 var html2="统计结束;";
			 $("#showMessageInfo").html(html2);
		}
		
     }, 500);  //每隔 1秒钟  
});
userstore.on('beforeload', function (store, options) { 
	
    var new_params = { 
    		startTime: Ext.getCmp('Ftime').getValue(),
    		endTime: Ext.getCmp('Etime').getValue(),
    		msc: Ext.getCmp('mscid').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});

userstore.on('load', function (store, options) {  
	var time1=Ext.getCmp('Ftime').getValue();
	var time2=Ext.getCmp('Etime').getValue()
	var htm="未上线手台统计时间段："+formatDateTime (time1)+"---"+formatDateTime (time2);
	htm+="&nbsp;&nbsp;总计："+userstore.getCount();
	$("#time-div").html(htm);

});
grid.getSelectionModel().on({
	selectionchange:function(sm,selections){
		var record = grid.getSelectionModel().getLastSelected(); 
		Ext.getCmp('mscid').setValue(record.get("mscid"))
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
	items:[grid,offonlineGrid]
     })
	store.load({params:{start:0,limit:30}}); 
	//MapData();
	dwr_Data();
	detachmentStore.load();
	dwr.engine.setActiveReverseAjax(true);
	//dwr.engine.setAsync(false);// 同步步
	dwr.engine.setErrorHandler(function() {
		//window.location.href = "index.html"
		console.log("map===err");
	});
});

function dwr_Data(){
	PullUserOnlineDwr.BackUserGps();
  } 
function backusergps(str){
	var data=Ext.decode(str);
	if(str==null){
		return;
	}
	var userIds=[];
	for(var i=0;i<userOnlineStore.getCount();i++){
		if(userOnlineStore.getAt(i).get("id")==data.id){
			
			 var rec={
					 userId:userOnlineStore.getAt(i).get("id"),
					 name:userOnlineStore.getAt(i).get("name")
				 }
		     userIds.push(rec);
			 addOnlineUser(userIds);
			
			 Ext.getCmp('tag').setValue(2);
			 store.reload();
			 console.log("user:"+data.id);
			
		}
		
		
	}
	
	
}


function searchOffonline(){
	
	userstore.reload();
	
}
//手动上拉
function gpsTask(){
	userOnlineStore.reload();
	
}

function addOnlineUser(json){
	var str=JSON.stringify(json);
	Ext.Ajax.request({
		url : '../controller/addOnlineUser.action', 
		params : { 
		 userJson:str
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response) {
	    	
	    },
	    failure: function(response) {
	     }
	});
	
}
function truncateOnlineUser(){
	Ext.Ajax.request({
		url : '../controller/truncateOnlineUser.action', 
		params : { 
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response) {
	    	
	    },
	    failure: function(response) {
	     }
	});
	
}
function gpsSet(a){
	Ext.Ajax.request({
		url : '../controller/handleTask.action', 
		params : { 
		 mscId:userOnlineStore.getAt(a).get('id')
	},
	method : 'POST',
	    waitTitle : '请等待' ,  
	    waitMsg: '正在提交中', 
	    success : function(response) {
	    	var rs = Ext.decode(response.responseText);
	    	if(rs.success){
	    		i++;
	    	}
	    },
	    failure: function(response) {
	     }
	});
}
function formatDateTime (date) {  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes();  
    minute = minute < 10 ? ('0' + minute) : minute;  
    return y + '-' + m + '-' + d+' '+h+':'+minute;  
};  


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


