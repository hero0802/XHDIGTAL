Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../resources/ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging'
             ]		 
);
Ext.define('call',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'starttime'},
	        {name: 'usetime'},
	        {name: 'caller'},
	        {name: 'called'},
	        {name: 'callid'},
	        {name: 'ldtid'},
	        {name: 'filePath'},
	        {name: 'endway'},
	        {name:'ldtname'}
	        ], 
	        idProperty : 'id'
})

//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'call',	
	remoteSort: true,
	/*groupField:'Call_id' ,*/
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : 'data/callNow.action',
	reader: {
	//数据格式为json
	type: 'json',
	root: 'items',
	//获取数据总数
	totalProperty: 'total'
},
autoLoad: true ,//很关键 ,
sorters: [{ 
	            //排序字段。 
	            property: 'starttime', 
	            //排序类型，默认为 ASC 
	            direction: 'DESC' 
	        }]
}
});
var grid;
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	region:'center',
	store:store,
	disableSelection: false,
	viewConfig: {
        stripeRows: true,
        loadMask:false
    },  
	columns:[
	         {text: "ID", width: 100, dataIndex: 'id', sortable: false,hidden:true},
	         {text: "#", width: 30, dataIndex: 'usetime', sortable: false,
	        	 renderer:function(v){
	        	 if(v<=0){return "<img src='resources/images/picture/call.png'>"}
	        	 else{return "";}
	         }},
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
	         },renderer:function(v){if(v>0){return  getTime(v)}else{return "";}}},
	         {text: "通话时间", width: 140, dataIndex: 'starttime', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }},
	         {text: "结束原因", width: 80, dataIndex: 'endway', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}
	   
	         ],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:200,
             emptyText:'<span style="text-align:center">对不起，没有查询到数据</span>'

})
}
Ext.onReady(function () { 
	setInterval(function(){
		store.reload();
		
}, 100);  //每隔 10秒钟  
var loginTpl='<div><p>会员：'+getcookie("username")+'</p>'
+'<p>会员组：'+getGroupName()+'</p></div'
+'<p>客户端IP：'+getIP()+'</p>'
+'<p>登录时间：'+getLoginTime()+'</p>';
var loginPanel=Ext.create('Ext.Panel',{
	iconCls:'webuser',
	maximizable: false,
	height:200,
	autoWidth:true,
	collapsable:true,
	split:true,
	title: '会员登录信息',
	autoShow: true,
	layout: 'fit',
	html:loginTpl
})
var Main=Ext.create('Ext.Panel',{
	region:'center',
	border:false,
	layout:'form',
	items:[{
		layout:'column',
		border:false,
		items:[{
			columnWidth:.5,
			border:false,
			items:[{
				xtype:'panel',
				border:false,
				bodyPadding:'10 10 0 10',
				items:loginPanel
			}]
		},{
			columnWidth:.5,
			border:false,
			items:[{
				xtype:'panel',
				border:false,
				bodyPadding:'10 10 0 10',
				items:[{
					xtype:'panel',
					title:'实时呼叫信息',
					maximizable: false,
					height:200,
					autoWidth:true,
					collapsable:true,
					split:true,
					items:grid
					
				}]
			}]
		}]
	}]
})
	new Ext.Viewport({
		layout:"border",
		
		items:Main
	})
})

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
