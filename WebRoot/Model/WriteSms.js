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
//短信编辑界面
var Form=Ext.create('Ext.form.Panel',{
	width:700,
	height:400,
	bodyPadding:20,
	layout:'form',
	//bodyStyle:'background:#DCDCDC',
	margin:'5 5 5 5',
	frame:false,
	border:false,
	items:[{
		xtype:'numberfield',labelWidth:80,width:200,
		labelWidth:100,
		fieldLabel:'<span style="color:#FF1493;font-weight:700">调度台ID</span>',
		border:0,
		name:'srcId',
		id:'dstId',
		allowBlank:false,
		 msgTarget : 'side',
		value:'888888',
		minValue:1,
		height:30,
		listeners : {
		       change : function(field,newValue,oldValue){
		         $(".dstId").css('display','block');
		        
		         if($("#dstIdlist").text()==""){
		        	 $(".dstId").css('display','none'); 
		         }
		         getDstId(newValue);
		         
		       }
		}
	},{
		xtype:'radiogroup',
		fieldLabel:'<span style="color:#FF1493;font-weight:700">发送方式</span>',
		name:'ig',
		border:0,
		height:30,
		allowBlank:false,
		 msgTarget : 'side',
		 layout:'column',
		width:400,
		items:[{boxLabel:'单发短信',name:'ig',inputValue:0},
		       {boxLabel:'组发短信',name:'ig',inputValue:1,checked:true}]
	},{
		xtype:'numberfield',
		fieldLabel:'<span style="color:#FF1493;font-weight:700">接收ID</span>',
		name:'tarid',
		id:'mscId',
		border:0,
		height:30,
		allowBlank:false,
		 msgTarget : 'side',
		width:400,
		minValue:1,
		listeners : {
		       change : function(field,newValue,oldValue){
		         $(".mscId").css('display','block');
		         if($("#mscIdlist").text()==""){
		        	 $(".mscId").css('display','none'); 
		         }
		         getMscId(newValue);
		       }
		}
		
	},{
		xtype:'radiogroup',
		fieldLabel:'<span style="color:#FF1493;font-weight:700">选择时隙</span>',
		name:'slot',
		border:0,
		height:30,
		allowBlank:false,
		 msgTarget : 'side',
		 layout:'column',
		width:400,
		items:[{boxLabel:'0时隙',name:'slot',inputValue:0,checked:true},
		       {boxLabel:'1时隙',name:'slot',inputValue:1}]
	},
		{
		xtype:'textarea',
		fieldLabel:'<span style="color:#FF1493;font-weight:700">短信内容</span>',
		name:'content',
		width:400,
		border:0,
		allowBlank:false,
		height:100,
		emptyText : '最多可以输入23个中文',  
        maxLength : 23,   //设置多行文本框的最大长度为100   
        preventScrollbars : true ,  //设置多行文本框没有滚动条显示  
        msgTarget : 'side'
	}]
})

var smsPanel=Ext.create('Ext.Panel',{
	border:false,
	autoWidth:true,
	autoHeight:true,
	//height:document.documentElement.clientHeight,
	items:[Form]
})
var callGroupStore = Ext.create('Ext.data.TreeStore',{
	fields:[{name: 'id'},{name:'text'}],	
	proxy: {
	type: 'ajax',
	url : '../../data/AjaxService.jsp?method=getTalkGroupMenu'
    },
    folderSort: true 
});


var smsTabPanel=Ext.create("Ext.tab.Panel",{
	id:'smsTabPanel',
	split : true,
	region:'center',
	animCollapse:false,
	padding:0,
	border:false,
	//plain:true,
	layout:'fit',  
	frame: false, 
	enableTabScroll:true,
	items:[{
		title:"编辑短信",
		height:document.documentElement.clientHeight,
		id:'800M',
		items:Form
	}/*{
		title:"编辑手机短信",
		height:document.documentElement.clientHeight,
		id:'phone',
		items:phonePanel
	},*//*{
		title:"查看手机短信",
		height:document.documentElement.clientHeight,
		id:'phonesms',
		layout:'border',
		items:grid
	}*/],
	buttons:[{
		text:'发送',
		/*disabled:sms_send?false:true,*/
		handler:function(){
		sendSms();
	}
	},{
		text:'撤销',
		handler:function()
		{
		var tab=Ext.getCmp('smsTabPanel');
			Form.form.reset();
		}
	}]
});

//显示表格
Ext.QuickTips.init(); 
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	/*loadConfig();*/
	new Ext.Viewport({
		layout:"border",
		style:'background:skyblue',
		items:[smsTabPanel/*,card*/]
	});
	loadConfig();
	$("#dstIdlist li").live('click',function(){
		Ext.getCmp('dstId').setValue($(this).text());
		//m_userName=$(this).text().split('/')[1];
		$(".dstId").css('display','none');
		
	});
	$("#mscIdlist li").live('click',function(){
		Ext.getCmp('mscId').setValue($(this).text());
		//m_groupName=$(this).text().split('/')[1];
		$(".mscId").css('display','none');
		
	});
	$("body").click(function(){
		$(".dstId").css('display','none');
		$(".mscId").css('display','none');
	})
	/*smsStore.load({params:{start:0,limit:50}});*/
});
function loadConfig(){
	Ext.Ajax.request({
		url:'../../systemConfig/get.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		if(str.success){
			Form.getForm().findField('srcId').setValue(str.dispatchNumber);					
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
//发送800M短信
function sendSms()
{
	var form=Form.getForm(); 
	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
         msg: '正在验证权限，请稍后！',  
         removeMask: true //完成后移除  
     });
	if(form.isValid()){
		myMask.show();
		form.submit(									
				Ext.Ajax.request({  
					url : '../controller/sendSms.action',  
					params : {  
					srcId:form.findField('srcId').getValue(),
					tarid:form.findField('tarid').getValue(),
					content:form.findField('content').getValue(),
					ig:form.findField('ig').getValue(),
					slot:form.findField('slot').getValue()
				},  
				method : 'POST',
				waitTitle : '请等待' ,  
				waitMsg: '正在提交中', 

				success : function(response) {  
					var rs=Ext.decode(response.responseText);
   				    myMask.hide();
   				     Ext.example.msg("提示","短信已发送");
				},

				failure: function(response) {

					myMask.hide();
					Ext.MessageBox.show({  
						title : "提示",  
						msg : "发送失败!" , 
						icon: Ext.MessageBox.INFO  
					}); 
				}  
				})); 
	}
}

//获取调度台Id
function getDstId(dstId){
	Ext.Ajax.request({  
		url : '../data/dstId.action',  
		params : {  
		srcId:dstId
	},  
	method : 'POST',
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时  						
		if(rs.success)
		{
			$("#dstIdlist").empty();
			Ext.Array.each(rs.srcidList, function(record){
			
				$(".dstId ul").append('<li>'+record.id+'/'+record.name+'</li>');
			})
		}
		else{}

	},
	failure: function(response) {}  
	});
}
//获取mscId
function getMscId(dstId){
	Ext.Ajax.request({  
		url : '../data/mscId.action',  
		params : {  
		srcId:dstId
	},  
	method : 'POST',
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时  						
		if(rs.success)
		{
			$("#mscIdlist").empty();
			Ext.Array.each(rs.mscidList, function(record){
				
				$(".mscId ul").append('<li>'+record.id+'/'+record.name+'</li>');
			})
		}
		else{}

	},
	failure: function(response) {}  
	});
}
function loadConfig(){
	Ext.Ajax.request({
		url:'../data/loadXML.action',
		params: {
	},
	method:'POST',
	success : function(response,opts){
		var str=Ext.decode(response.responseText);
		if(str.success){
			Form.getForm().findField('dstId').setValue(str.pptId);
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
function CurentTime(time)
{ 
    var now =time;
   
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
   
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
   
    var clock = year + "-";
   
    if(month < 10)
        clock += "0";
   
    clock += month + "-";
   
    if(day < 10)
        clock += "0";
       
    clock += day + " ";
   
    if(hh < 10)
        clock += "0";
       
    clock += hh + ":";
    if (mm < 10) clock += '0'; 
    clock += mm; 
    return(clock); 
} 