//创建Model
Ext.define('gps',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'srcId'},
	        {name: 'dstId'},
	        {name: 'infoType'},
	        {name: 'longitude'},
	        {name: 'latitude'},
	        {name: 'heigh'},
	        {name: 'starNum'},
	        {name: 'horizon'},
	        {name: 'infoTime'},
	        {name: 'typeId'}
	        ], 
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'gps',	
	remoteSort: true,
//	设置分页大小
	pageSize:50,
	proxy: {
	type: 'ajax',
	url : '../data/Gps.action',
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

var sysStore=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'value'}],
	data:[{id:'2',value:'全部'},
	      {id:'0',value:'东信'},
	      {id:'1',value:'motorola'}
	      ]
})
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建Action
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除数据',
	disabled:true,
	handler:del_btn
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
    handler:function(){store.loadPage(1);}
});
var recvsmsChartAction=Ext.create('Ext.Action',{
	text:'数据统计',
	disabled:false,
	iconCls:'chart',
    handler:getChart
});
var excelAction=Ext.create('Ext.Action',{
	iconCls:'excel',text:'导出数据',tooltip:'导出数据',handler:excel
});
//创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        deleteAction,'-',
        refreshAction
        /*recvsmsChartAction,*/
       
    ]
});
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>终端信息>>GPS记录',
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
	         {text: "手台号码", width: 80, dataIndex: 'srcId', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },align:'center'},
	         {text: "经度", width: 110, dataIndex: 'longitude', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "纬度", width: 110, dataIndex: 'latitude', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }
	         }, 
	         {text: "高度", width: 80, dataIndex: 'heigh', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	         {text: "速度(km/h)", width: 80, dataIndex: 'starNum', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }}, 
	     /*    {text: "地平线", width: 80, dataIndex: 'horizon', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         }  }, 
	         {text: "获取类型", flex: 1, dataIndex: 'infoType', sortable: false,
	        	 editor : {  
	        	 allowBlank : false  
	         },renderer:function(v){
	        	 if(v==129){return "定时上报";
	        	 }else if(v==130){return "定距离上报";}else{return "未知";}
	         }  },*/
	         {text: "质量",width: 120, dataIndex: 'typeId', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         },align:'center',renderer:function(v){
	        	 if(v==0){return "<span style='color:red'>质量差</span>";}
	        	 else{return "";}
	         }}, 
	         {text: "产生时间", width: 150, dataIndex: 'infoTime', sortable: true,
	        	 editor : {  
	        	 allowBlank : false  
	         }}
	         
	         
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: true,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
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

	        
	        
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [ {fieldLabel:'手台号码',xtype:'textfield',name:'srcId',id:'srcId',labelWidth: 90,width:180,emptyText:'手台号码' },
		         	         {fieldLabel:'调度台号',xtype:'textfield',name:'dstId',id:'dstId',labelWidth:70,width:180,emptyText:'调度台号'},
		        	         {fieldLabel:'起始时间',
		        	        	 xtype:'datetimefield',
		        	        	 id:'Ftime',
		        	        	 name:'Ftime',
		        	        	 format:'Y-m-d H:i:s',
		        	        	 value:GetDay(),
		        	        	 labelWidth: 60,width:220},
		        	         {fieldLabel:'结束时间',
		        	        		 xtype:'datetimefield',
		        	        		 id:'Etime',
		        	        		 name:'Etime',
		        	        		 value:getOneDay(),
		        	        		 format:'Y-m-d H:i:s',
		        	        		 labelWidth: 60,width:220},
	        	         searchAction,{
	        	        	 text:'清除',
	        	        	 iconCls:'clear',
	        	        	 tooltip:'清除输入的查询数据',
	        	        	 handler: function(){
		        	         Ext.getCmp("bsId").reset();
	        	        	 Ext.getCmp("srcId").reset();
	        	        	 Ext.getCmp("dstId").reset();
	        	        	 Ext.getCmp("Ftime").reset();
	        	         }}]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:['-',deleteAction,'-']

	          	 
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
store.on('beforeload', function (store, options) {  
    var new_params = { 
    		bsId: '',
    		srcId: Ext.getCmp('srcId').getValue(),
    		dstId: Ext.getCmp('dstId').getValue(),
    		Ftime: Ext.getCmp('Ftime').getValue(),
    		Etime: Ext.getCmp('Etime').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});

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
	store.load({params:{start:0,limit:50}}); 
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
					var userId=record.get('id');  
					//如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可  
					if(userId){ids.push(userId);}  

				});  
				Ext.example.msg("提示","正在删除数据");
				Ext.Ajax.request({  
					url : '../../gps/del.action',  
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
							Ext.example.msg("提示","删除数据成功");
						}); 
				       /* Ext.Msg.show({
				            title: "cvv",
				            msg: "dfgh",
				            minWidth: 200,
				            modal: true,
				            icon: Ext.Msg.INFO,
				            buttons: Ext.Msg.OK
				        });*/

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
function getChart(){
	var chart = new FusionCharts("../../classes/charts/INFOSOFTGLOBAL.COM/Charts/Column3D.swf", "chartId", "100%", "100%", "0", "0","exactFit");
	var width=document.documentElement.clientWidth;
	width=width/2-1;
	var height=document.documentElement.clientHeight-2;
	
	var winChart = Ext.create('Ext.Window', {
		//region:'south',
		renderTo:Ext.getBody(),
	    height: height-202,
	    width:width-1,
	    iconCls:'chart',
	    maximizable: true,
	    closable:true,
	    cloaseAction:'close',
	    title: '本月GPS信息统计',
	    autoShow: true,
	    layout: 'fit',
	    html:'<div id="chartsms" style="width:100%;height:100%"></div>'      
	});
	getRecvData(chart);
	if(winChart=="")
	{
	winChart.show();
	}
	
}
//数据统计
function getRecvData(str){
	Ext.Ajax.request({
		url:"../../chart/gpsChart.action",
	    method:'POST',
	    success : function(response,opts){
		var success=Ext.decode(response.responseText).success;
		var data=Ext.decode(response.responseText).strXML;
		if(success){
			 str.setJSONData(data);
		     str.render("chartsms");	
		}else{
			Ext.MessageBox.show({
				title:'提示',
				msg:'加载数据失败',
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
	
}
//导出数据
var excelWin="";
function excel(){
	var excelForm=new Ext.FormPanel({
		width:500,
		autoHeight:true,
		bodyPadding:10,
		layout:'form',
		border:false,
		frame:false,
		items:[{
			 xtype:'fieldset',title:'<span style="color: #8A2BE2">过滤条件</span>',
			 collapsible: true,autoHeight : true,autoWidth : true,
//			 layout : "form", // 从上往下的布局
			 items:[{
					xtype:'textfield',name:'srcId',fieldLabel:'手台号码',labelWidth:80,
					emptyText:'===可以为空==='
				},{
					xtype:'textfield',name:'dstId',fieldLabel:'调度台号',labelWidth:80,
					emptyText:'===可以为空==='
				},{
				 layout:'column',
				 border:false,
				 items:[{
						fieldLabel:'起始时间',xtype:'datetimefield',labelWidth:80,width:250,value:GetDay(),
						format:'Y-m-d H:i:s',name:'excel_Ftime',allowBlank: false,emptyText:'==必填=='
					},{
						fieldLabel:'至',xtype:'datetimefield',labelWidth:30,format:'Y-m-d H:i:s',name:'excel_Etime',
						labelAlign:'left',allowBlank: false,value:new Date()
					}]
			 },{
					xtype:'displayfield',name:'',fieldLabel:'<span style="color:green">温馨提示</span>',labelWidth:100,
					value:'<span style="color:red">导出的数据最好不要超过10万条数据，如果数据量过大请分批导出</span>'
				}]
		}]
	})
	if(!excelWin){
	 excelWin=Ext.create("Ext.Window",{
		modal:true,
		title:'导出excel数据',
		autoWidth:true,
		autoHeight:true,
		closeAction:'hide',
		items:excelForm,
		buttons:[{
			text:'开始导出',
			iconCls:'excel',
			handler:function(){
			var form=excelForm.getForm();
			if(form.isValid()){
				excelWin.hide();
				 //显示进度条  
				   Ext.MessageBox.show({
					   title:'loading.....',
					   msg:'正在准备数据',
					   progressText:'',
					   width:300,
					   progress:true,
					   closable:false,
					   animEl:'loding'
				   });   
				   var f = function(v){
					   return function(){
						   var i=v/11;
						   Ext.MessageBox.updateProgress(i,'');
//						   Ext.MessageBox.updateText("正在准备数据"+i);
					   }
				   }
				   for(var i=1;i<11;i++){
					   setTimeout(f(i),i*500);
				   }
				   Ext.Ajax.request({
					   url:'../../excel/gpsExcel.action',
					   params:{
						srcId:valueFormat(form.findField("srcId").getValue()),
						dstId:valueFormat(form.findField("dstId").getValue()),
						from:"",
						Ftime:dateFormat(form.findField('excel_Ftime').getValue()),
						Etime:dateFormat(form.findField('excel_Etime').getValue())
				},
				method:'POST',
				success : function(response, opts) {  
					var success = Ext.decode(response.responseText).success; 				
					// 当后台数据同步成功时  
					if (success) {  
						Ext.MessageBox.close();
						window.location.href="../../data/ToExcel.jsp?method=GpsToExcel";

					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "导出数据失败" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},

				 failure: function(response) {

					 Ext.MessageBox.show({  
						 title : "错误提示",  
						 msg : "导出数据过多或响应服务器失败" , 
						 icon: Ext.MessageBox.INFO  
					 }); 
				 }  
				})
				
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
	}
	excelWin.show();
}
function dateFormat(value){ 
    if(null != value){ 
        return Ext.Date.format(new Date(value),'Y-m-d H:i:s'); 
    }else{ 
        return ""; 
    } 
}
function valueFormat(value){ 
    if(null != value){ 
        return value; 
    }else{ 
        return ""; 
    } 
}
function GetDay()   
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
    if(strDay<10)   
    {   
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
