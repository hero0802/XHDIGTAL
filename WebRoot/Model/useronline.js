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
// 创建数据源
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
	iconCls:'search',
    handler:function(){
    	Ext.getCmp('tag').setValue(0);
    	store.loadPage(1);}
});
var onlineStatusAction=Ext.create('Ext.Action',{
	text:'上线状态查询',
	iconCls:'search',
    handler:function(){
    	Ext.getCmp('tag').setValue(1);
    	store.loadPage(1);}
});
var offonlineAction=Ext.create('Ext.Action',{
	text:'未上线手台查询',
	iconCls:'search',
    handler:function(){searchOffonline()}
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
	             items: [ {fieldLabel:'手台ID',xtype:'textfield',name:'mscid',id:'mscid',labelWidth: 50,width:130,emptyText:'操作员' },
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
	             items:["->",onlineStatusAction,searchAction,offonlineAction,{
	        	        	 text:'清除',
	        	        	 iconCls:'clear',
	        	        	 tooltip:'清除输入的查询数据',
	        	        	 handler: function(){
		        	         Ext.getCmp("mscid").reset();
	        	         }}]

	          	 
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
    		msc: Ext.getCmp('mscid').getValue(),
    		startTime: Ext.getCmp('Ftime').getValue(),
    		endTime: Ext.getCmp('Etime').getValue(),
    		tag:Ext.getCmp('tag').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

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
});

function searchOffonline(){
	
	userstore.reload();
	
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


