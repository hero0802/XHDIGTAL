//创建Model
Ext.define('bs',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name:'bsId'},
	        {name:'bsName'}
	        ], 
	        idProperty : 'id'
}); 
Ext.define('callerror',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'bsId'},
	        {name: 'bsName'},
	        {name: 'caller'},
	        {name: 'called'},
	        {name: 'message'},
	        {name: 'starttime'}
	        ], 
	        idProperty : 'id'
});
//创建数据源
var bs_store = Ext.create('Ext.data.Store',{
	model:'bs',	
	remoteSort: true,
//	设置分页大小
	pageSize:300,
	proxy: {
	type: 'ajax',
	url : '../data/bsList.action',
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
var store = Ext.create('Ext.data.Store',{
	model:'callerror',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/callerror.action',
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

//创建菜单
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
    handler:function(){store.loadPage(1);}
});
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>系统>>呼叫失败记录',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[{text: "呼叫时间", width: 150, dataIndex: 'starttime', sortable: false},
	         {text: "基站ID", width: 60, dataIndex: 'bsId', sortable: false},
	         {text: "基站名称", width: 150, dataIndex: 'bsName', sortable: false},
	         {text: "主叫", width: 100, dataIndex: 'caller', sortable: false }, 
	         {text: "被叫组", width: 100, dataIndex: 'called', sortable: false }, 
	         {text: "失败原因", flex: 1, dataIndex: 'message', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}   
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: false,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
	         viewConfig: {
	             stripeRows: true,
	             listeners: {
	                /* itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     contextMenu.showAt(e.getXY());
	                     return false;
	                 }*/
	             }
	         },

	        
	        
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{fieldLabel:'基站',xtype:'combobox',name:'bsId', id:'bsId', labelWidth:40,width:170,
		        	        store:bs_store,queryModel:'remote',emptyText:'请选择...',value:0,
		        	        valueField:'bsId',displayField:'bsName',forceSelection : true},	    
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
		        	        		 value:getOneDay() ,
		        	        		 format:'Y-m-d H:i:s',
		        	        		 labelWidth: 60,width:220},searchAction]
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
//grid.dockedItems.get(refreshStr).child('#refresh').hide(true);  
grid.dockedItems.get(refreshStr).child('#refresh').setHandler(   
	     function() {   
	            Ext.getCmp('Etime').setValue(getOneDay());
	            store.loadPage(1);
	     }  
);
bs_store.on('load',function(){
	for(var i =0;i<bs_store.getCount();i++){
		bs_store.getAt(i).set("bsName",bs_store.getAt(i).get('bsId')+":"+bs_store.getAt(i).get("bsName"));

	}
	var ins_rec = Ext.create('bs',{
		bsId:0,bsName:"所有基站"
    }); 
    bs_store.insert(0,ins_rec);
    Ext.getCmp('bsId').setValue(0);
	//bs_store.addSorted({bsId:0,bsName:"全部"});
})
store.on('beforeload',function(store,options){
	  var new_params = { 
	    		bsId: Ext.getCmp('bsId').getValue(),
	    		startTime: Ext.getCmp('Ftime').getValue(),
	    		endTime: Ext.getCmp('Etime').getValue()
	    		};  
	    Ext.apply(store.proxy.extraParams, new_params);  
})
/*store.on('beforeload', function (store, options) {  
    var new_params = { 
    		operator: Ext.getCmp('operator').getValue(),
    		type: Ext.getCmp('type').getValue(),
    		Ftime: Ext.getCmp('Ftime').getValue(),
    		Etime: Ext.getCmp('Etime').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

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
	store.load({params:{start:0,limit:100}}); 
	bs_store.load();
});


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
