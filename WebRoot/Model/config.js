Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging'
             ]		 
);
var store=Ext.create('Ext.data.Store',{
	autoDestroy: true,
	autoLoad:true,
	fields:[{name:'id'},{name:'value'}],
	data:[
	      {id:'1',value:'允许'},
	      {id:'0',value:'禁止'}
	      ]
})
var groupStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name:'name'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/groupList.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var configForm=Ext.create('Ext.form.Panel',{
	width:350,
	border:0,
	style:'margin:10;',
	height:150,
	buttonAlign:'left',
	items:[{
		xtype:'textfield',
		fieldLabel:'IP地址',
		name:'xh_ip',
		labelWidth:80
		
	},{
		xtype:'numberfield',
		fieldLabel:'端口',
		name:'xh_port',
		labelWidth:80
		
	},{
		xtype:'textfield',
		fieldLabel:'账号',
		name:'xh_root',
		labelWidth:80
		
	},{
		xtype:'textfield',
		fieldLabel:'密码',
		inputType:'password',
		name:'xh_password',
		labelWidth:80
		
	},{
		xtype:'textfield',
		fieldLabel:'数据库名',
		/*disabled:true,*/
		name:'xh_dbname',
		labelWidth:80
		
	}]
});
var dispatchForm=Ext.create('Ext.form.Panel',{
	width:300,
	border:0,
	height:130,
	buttonAlign:"left",
	items:[{
		xtype:'textfield',
		fieldLabel:'IP地址',
		name:'center_ip'
		
	},{
		xtype:'numberfield',
		fieldLabel:'TCP端口',
		name:'center_port'
		
	},{
		xtype:'textfield',
		fieldLabel:'UDP端口',
		name:'udp_port'
		
	},{
		xtype:'numberfield',
		fieldLabel:'调度台ID',
		name:'pptId'
		
	}]
});
var gpsForm=Ext.create('Ext.form.Panel',{
	width:350,
	border:0,
	style:'margin:10;',
	height:150,
	buttonAlign:'left',
	items:[{
		xtype:'checkbox',
		fieldLabel:'自动遥测基站',
		boxLabel:'开启',
		name:'start',
		labelWidth:120
		
	},{
		xtype:'numberfield',
		fieldLabel:'间隔时间[/分钟]',
		name:'time',
		labelWidth:120,
		width:180,
		minValue:1,
		maxValue:1440
		
	}]
});
var adgroupForm=Ext.create('Ext.form.Panel',{
	width:350,
	border:0,
	style:'margin:10 10 10 0;',
	height:150,
	buttonAlign:'left',
	items:[{
		 fieldLabel:'当前互联组',
		 xtype:'combobox',
		 name:'adgroup',
		 allowBlank: false,
		 labelAlign:'right',
		 msgTarget : 'side',
		 store:groupStore,
		 queryMode:'remote',
		 editable:false,
		 emptyText:'请选择...',
		 valueField: 'id',  
		 displayField: 'name' 
	 }]
});
//panel
var Panel=Ext.create('Ext.Panel',{
	region:'center',
	bodyStyle :'overflow-x:visible;overflow-y:scroll', //隐藏水平滚动条
	border:false,
	layout:'column',
	items:[{
		xtype:'panel',
		title:'中心数据库配置',
		border:true,
		frame:false,
		margin:'10 10 0 10',
		bodyPadding:'10 10 0 10',
		width:300,
		height:250,
		/*collapsed: false , 
		collapsible: true,*/
		items:configForm,
		buttons:[{
			xtype:'button',
			text:'保存配置',
			handler:function(){
			save();
		}
			
		}]
	},{
		xtype:'panel',
		title:'接入中心配置',
		border:true,
		frame:false,
		/*collapsed: false , 
		collapsible: true,*/
		width:300,
		height:250,
		margin:'10 10 0 10',
		bodyPadding:'10 10 0 10',
		items:[dispatchForm/*,{
			xtype:"panel",
			height:40,
			border:false,
			html:'<div id="tcp"></div>'
		}*/],
		buttons:[{
			xtype:'button',
			text:'保存配置',
			handler:function(){
			netSave();
		}
			
		}]
	},{
		xtype:'panel',
		title:'其他配置',
		border:true,
		frame:false,
		/*collapsed: false , 
		collapsible: true,*/
		width:300,
		height:250,
		margin:'10 10 0 10',
		bodyPadding:'10 10 0 10',
		items:gpsForm,
		buttons:[{
			xtype:'button',
			text:'保存配置',
			handler:function(){
			save();
		}
		}]
	}/*,{
		xtype:'panel',
		title:'模数互联配置',
		border:true,
		frame:false,
		collapsed: false , 
		collapsible: true,
		width:300,
		height:250,
		margin:'10 10 0 10',
		bodyPadding:'10 10 0 10',
		items:adgroupForm,
		buttons:[{
			xtype:'button',
			text:'保存配置',
			handler:function(){
			saveAdGroup();
		}
		}]
	}*/]
})
Ext.QuickTips.init(); 
Ext.onReady(function(){
	//radiogroup.down('radio[boxLabel=sd]').setValue(true); 
	new Ext.Viewport({
		layout:'border',
		items:[Panel]
	})
	loadConfig();
	groupStore.load();
	HasAdGroup();
	
});
function loadConfig(){
	Ext.Ajax.request({
		url:'../data/loadXML.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		form=configForm.getForm(); 
		if(str.success){
			form.findField('xh_ip').setValue(str.xh_ip);
			form.findField('xh_port').setValue(str.xh_port);
			form.findField('xh_root').setValue(str.xh_root);
			form.findField('xh_password').setValue(str.xh_password);
			form.findField('xh_dbname').setValue(str.xh_dbname);						
			dispatchForm.getForm().findField('center_ip').setValue(str.center_ip);
			dispatchForm.getForm().findField('center_port').setValue(str.center_port);
			dispatchForm.getForm().findField('udp_port').setValue(str.udp_port);
			gpsForm.getForm().findField('start').setValue(str.start);
			gpsForm.getForm().findField('time').setValue(str.time);
			dispatchForm.getForm().findField('pptId').setValue(str.pptId);
		}else{
			Ext.MessageBox.show({
				title:'提示',
				msg:'加载配置文件失败',
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
function HasAdGroup(){
	Ext.Ajax.request({
		url:'../data/HasAdGroup.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		form=adgroupForm.getForm(); 
		if(str.success){
			form.findField("adgroup").setValue(str.adgroup);
			console.log(str.adgroup);
		}}
	});
}
function tcpStatus(){
	Ext.Ajax.request({
		url:'../data/loadXML.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		form=configForm.getForm(); 
		if(str.success){
			var html="",status="";
			if(str.tcp_status==1){
				status="已连接";
			}else{
				status="正在连接";
			}
			html+='<span style="color:green;font-weight:800">TCP通信状态：</span><span>'+status+'</span>';
			$("#tcp").html(html);
		}}
	});
}
function saveAdGroup()
{
	
	var form=adgroupForm.getForm(); 
	 if(form.isValid()){
	 form.submit(									
			 Ext.Ajax.request({  
				 url : '../data/ChangeAdGroup.action',  
				 params : {				 			 
				 adgroup:form.findField('adgroup').getValue()
			 },  
			 method : 'POST',			        			 
			 success : function(response) { 
				 
				 HasAdGroup();
				 Ext.example.msg("提示","修改成功"); 
			 },
			 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "读取配置文件失败" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			 })); } 	
}
function save()
{
	
	var form=configForm.getForm(); 
	 if(form.isValid()){
	 form.submit(									
			 Ext.Ajax.request({  
				 url : '../data/updateXML.action',  
				 params : {				 			 
				 xh_ip:form.findField('xh_ip').getValue(),
				 xh_port:form.findField('xh_port').getValue(),
				 xh_root:form.findField('xh_root').getValue(),
				 xh_password:form.findField('xh_password').getValue(),
				 xh_dbname:form.findField('xh_dbname').getValue(),						
				 center_ip:dispatchForm.getForm().findField('center_ip').getValue(),
				 center_port:dispatchForm.getForm().findField('center_port').getValue(),
				 udp_port:dispatchForm.getForm().findField('udp_port').getValue(),
				 pptId:dispatchForm.getForm().findField('pptId').getValue(),
				 start:gpsForm.getForm().findField('start').getValue()?1:0,
				 time:gpsForm.getForm().findField('time').getValue()
			 },  
			 method : 'POST',			        			 
			 success : function(response) { 
				 
				 loadConfig();
				 Ext.example.msg("提示","修改成功"); 
			 },
			 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "读取配置文件失败" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			 })); } 	
}
//net
function netSave()
{
	
	var form=configForm.getForm(); 
	 if(form.isValid()){
	 form.submit(									
			 Ext.Ajax.request({  
				 url : '../data/netSave.action',  
				 params : {				 			 					
				 center_ip:dispatchForm.getForm().findField('center_ip').getValue(),
				 center_port:dispatchForm.getForm().findField('center_port').getValue(),
				 udp_port:dispatchForm.getForm().findField('udp_port').getValue(),
				 pptId:dispatchForm.getForm().findField('pptId').getValue()/*,
				 multicast_ip:gpsForm.getForm().findField('multicast_ip').getValue(),
				 multicast_port:gpsForm.getForm().findField('multicast_port').getValue()*/
			 },  
			 method : 'POST',			        			 
			 success : function(response) { 
				 
				 loadConfig();
				 Ext.example.msg("提示","修改成功"); 
			 },
			 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "读取配置文件失败" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			 })); } 	
}
