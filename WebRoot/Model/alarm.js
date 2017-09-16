//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
//创建Model
Ext.define('online',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'device'},
	        {name: 'deviceId'},
	        {name: 'deviceAlias'},
	        {name: 'online'},
	        {name: 'time'},
	        {name: 'type'}
	      
	        ], 
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'online',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/offonline.action',
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
var store_db = Ext.create('Ext.data.Store',{
	model:'online',	
	remoteSort: true,
//	设置分页大小
	pageSize:5,
	proxy: {
	type: 'ajax',
	url : '../data/dbcenter.action',
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
var store_alarm = Ext.create('Ext.data.Store',{
	model:'online',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/alarm.action',
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

var onlineGrid=Ext.create('Ext.grid.Panel',{
	title:'设备上下线',
	icon:'../resources/images/btn/equipment.png',
	border:true,
	frame:false,
	region:'center',
	store:store,
	//margin:'0 10 0 0',
	margin:'5 5 5 5',
	trackMouseOver: false,
	disableSelection: false,
	hideHeaders:false,
	
	/* listeners : {     
        'afterrender' : function(grid) {  
            var elments = Ext.select(".x-column-header",true);//.x-grid3-hd  
            elments.each(function(el) {  
                            el.setStyle("color", 'green');  
                            el.setStyle("background", '#ff0000');  
                        }, this); 
          
                  
            }  
    } ,*/
	columns:[
	         {text: "#", width: 50, dataIndex: 'type', sortable: false,
	        	 renderer:function(v){
	        	 if(v=="MS"){return '<span class="badge">MS</span>'}
	        	 else if(v=="BS"){return '<span class="badge">BS</span>'}
	        	 else if(v=="SW"){return '<span class="badge">SW</span>'}
	        	 else if(v=="MSO"){return '<span class="badge">MSO</span>'}
	        	 else if(v=="TEL"){return '<span class="badge">TEL</span>'}
	        	 else if(v=="TAL"){return '<span class="badge">TAL</span>'}
	        	 else if(v=="DS"){return '<span class="badge">DS</span>'}
	        	 else if(v=="NM"){return '<span class="badge">NM</span>'}
	         }},
	         {text: "设备ID", width: 100, dataIndex: 'deviceId', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "别名", width: 230, dataIndex: 'deviceAlias', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "时间", width: 150, dataIndex: 'time', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "类型",flex: 1, dataIndex: 'online', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },align:'center',
	         renderer:function(v,b){
	        	 if(v==0){return '<span id="off" >下线</span>';}
	        	 else if(v==1){return '<span id="online" >上线</span>';}
	        	 else if(v==-1){return '<span id="off" >访问失败！</span>';}
	        	 else if(v==-2){return '<span id="off" >通信中断</span>';}
	        	 else if(v==-3){return '<span id="online" >通信成功</span>';}
	        	 else{return "未知";}
	         }}                  
	         ],
	         plugins : Ext.create('Ext.grid.plugin.CellEditing', { 
	        		        clicksToEdit: 2
	        		     }),
	        
	         forceFit: true,
	         columnLines : true, 
	         height:300,
	         emptyText:'<span>沒有数据</span>',
	        // selModel: selModel,
	         viewConfig: {
	             stripeRows: true,
	             loadMask: false, 
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                    // contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },

	        
	        
	         dockedItems: [{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:[]

	          	 
	         }]

})
var dbGrid=Ext.create('Ext.grid.Panel',{
	margin:'5 5 5 5',
	title:'网管与中心通信信息',
	icon:'../resources/images/btn/center.png',
	border:true,
	frame:false,
	region:'north',
	height:200,
	store:store_db,
	trackMouseOver: false,
	disableSelection: false,
	hideHeaders:true,
	columns:[
	         {text: "#", width: 60, dataIndex: 'type', sortable: false,
	        	 renderer:function(v){
	        	 if(v=="DB"){return '<span class="badge">DB</span>'}
	        	 else if(v=="LINK"){return '<span class="badge">LINK</span>'}
	         }},
	         {text: "设备类型", width: 90, dataIndex: 'device', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "时间", width: 150, dataIndex: 'time', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "类型",flex: 1, dataIndex: 'online', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },align:'center',
	         renderer:function(v,b){
	        	 if(v==0){return '<span id="off" >下线</span>';}
	        	 else if(v==1){return '<span id="online" >上线</span>';}
	        	 else if(v==-1){return '<span id="off" >访问失败！</span>';}
	        	 else if(v==-2){return '<span id="off" >通信中断</span>';}
	        	 else if(v==-3){return '<span id="online" >通信成功</span>';}
	        	 else{return "未知";}
	         }}                  
	         ],
	         plugins : Ext.create('Ext.grid.plugin.CellEditing', { 
	        		        clicksToEdit: 2
	        		     }),
	        
	         forceFit: true,
	         columnLines : true, 
	         emptyText:'<span>沒有数据</span>',
	        // selModel: selModel,
	         viewConfig: {
	             stripeRows: true,
	             loadMask: false, 
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                    // contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         }/*,
	         dockedItems: [{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store:store_db,
	             displayInfo: true, 
	          	 items:[]

	          	 
	         }]*/

})
var alarmGrid=Ext.create('Ext.grid.Panel',{
	margin:'5 5 5 5',
	title:'系统告警列表',
	icon:'../resources/images/btn/alarm.png',
	border:true,
	frame:false,
	region:'center',
	store:store_alarm,
	trackMouseOver: false,
	disableSelection: false,
	hideHeaders:true,
	columns:[
	         {text: "#", width: 60, dataIndex: 'type', sortable: false,
	        	 renderer:function(v){
	        	 if(v=="DB"){return '<span class="badge">DB</span>'}
	        	 else if(v=="LINK"){return '<span class="badge">LINK</span>'}
	        	 else if(v=="SW"){return '<span class="badge">SW</span>'}
	        	 else if(v=="BS"){return '<span class="badge">BS</span>'}
	         }},
	         {text: "设备类型", width: 90, dataIndex: 'deviceId', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v==-2){return "中心通信";}else{return v;}
	         }},
	         {text: "时间", width: 150, dataIndex: 'time', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "类型",flex: 1, dataIndex: 'online', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },align:'center',
	         renderer:function(v,b){
	        	 if(v==0){return '<span id="off" >下线</span>';}
	        	 else if(v==1){return '<span id="online" >上线</span>';}
	        	 else if(v==-1){return '<span id="off" >访问失败！</span>';}
	        	 else if(v==-2){return '<span id="off" >通信中断</span>';}
	        	 else if(v==-3){return '<span id="online" >通信成功</span>';}
	        	 else{return "未知";}
	         }}                  
	         ],
	         plugins : Ext.create('Ext.grid.plugin.CellEditing', { 
	        		        clicksToEdit: 2
	        		     }),
	        
	         forceFit: true,
	         columnLines : true, 
	         height:670,
	         emptyText:'<span>沒有数据</span>',
	        // selModel: selModel,
	         viewConfig: {
	             stripeRows: true,
	             loadMask: false, 
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                    // contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },
	         dockedItems: [{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store:store_alarm,
	             displayInfo: true, 
	          	 items:[]

	          	 
	         }]

})
var panel=Ext.create('Ext.Panel',{
	bodyStyle:'background:#ffffff',
	border:false,
	region:'west',
	width:650,
	autoScroll:false,
	layout:'border',
	items:[dbGrid,onlineGrid]
})
var mainPanel=Ext.create('Ext.Panel',{
	bodyStyle:'background:#ffffff',
	region:'center',
	border:false,
	layout:"border",
	items:[panel,alarmGrid]
	
})
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:[panel,mainPanel]
     })
	store.load(); 
	store_db.load({params:{start:0,limit:5}});
	store_alarm.load();
	 $(".thumb-wrap:even").css("background-color","yellow");
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setAsync(false);//同步步
	//设置在页面关闭时，通知服务端销毁会话
    dwr.engine.setNotifyServerOnPageUnload( true);
	dwr_Data();
	dwr.engine.setErrorHandler(function(){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "ERROR:<br>服务器重启，系统推送功能失效，请刷新页面" , 
			 icon: Ext.MessageBox.INFO 
		 });
		if (top.location !== self.location) {   
		    top.location = "../index.jsp";//跳出框架，并回到首页   
		} 
		
	})
});
function dwr_Data(){
	AlarmDwr.Alarm()
  } 
function alarmData(){
	store.load(); 
	store_db.load();
	store_alarm.load();
}