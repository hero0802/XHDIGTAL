Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../resources/ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging'
             ]		 
);
var groupStore=Ext.create('Ext.data.Store',{
	remoteSort: true,
	fields:[{name:'id',name:'groupname'}],
	proxy: {
	type:'ajax',
	url:'../data/MemberGroup.action',
	reader:{
	type:'json',
	root:'items'
    },
    simpleSortModel: true
   
}
})
var loginForm=new Ext.FormPanel({
		//defaultType : 'textfield',//表单默认类型
		frame : true,
		border:false,
		//bodyStyle:'margin:0',
		id:'form',
		height:160,
		width:240,
		style:'border:0;',
		buttonAlign:'center',
		layout:'form',
		items : //元素
			[
			 {
				 xtype:'textfield',
				 fieldLabel:'用户名',
				 name: 'name',
				 allowBlank: false,
				 blankText: '不能为空',
				 msgTarget : 'side',
				 labelWidth:60,
                 labelAlign: 'left',
                 width:100                                           
			 },{
				 xtype:'textfield',
				 fieldLabel:'密    码',
				 name:'password',
				 allowBlank: false,
				 inputType:'password',	
				 blankText: '不能为空',
				 msgTarget : 'side',
                 labelAlign: 'left',
                 labelWidth:60,
                 width:100
                 
                 
			 },
			 {
				 xtype:'checkbox',
				 fieldLabel:'记住密码',
				 tooltip:'勾选账号可以免登陆一周',
				 labelWidth:60,
				 name:'remember_time',
				 width:120
			 }
			 ],
				buttons:[
				         {text:'登陆',
				        	 handler:login,
				        	 iconCls:'login'
				        	
				         },
				         {text:'重置',
				        	 handler:function(){
				        	 loginForm.form.reset();
				        	 
				         }
				        }
				        ]

	});
var frame=Ext.create('Ext.Panel', {
	    //title: '容器面板',
	    renderTo: Ext.getBody(),
	    frame:false,
	    border:false,
	    width: 700,
	    height: 350,
	    layout: 'border',
	    defaults: {
	        split: false,                 //是否有分割线
	        collapsible: false,           //是否可以折叠
	        bodyStyle: 'padding:0;border:0'
	    },
	    items: [{
	        region: 'east',
	        xtype: "panel",
	        width: 240,
	        items: [{
	        	layout:'column',	 
	        	items:[loginForm,{
	        		bodyStyle: 'border:0',
	        		height:210,
	        		width:230,
	        		html:'<br><span style="color:#FF7F50">还没有账号？</span><span style="margin-left:30px;"><a href="#" onclick="card()">注册账号</a></span><br><br><br><br>&nbsp;Copyright @2014-06-20 亚光电子'
	        	}]
	        }]	        
	 
	    }, {
	        region: 'center',
	        xtype: "panel",
	        html: "<img src='../resources/images/picture/login.jpg' alt='软件LOGO' height='350' width='500'/>"
    }
	        	]
	});
var loginWin="";
Ext.onReady(function(){
	Ext.QuickTips.init(); 
	 loginWin= new Ext.Window({
			autoWidth:true,
			autoHeight:true,
			//modal:true,
			draggable:false,
			//layout: 'form',
			title:"欢迎登陆  综合应用平台系统",
			iconCls:'login_title',
			resizable: false, 
			closable:false,
			buttonAlign : 'center', 
            layout:'fit',
			items:frame		
		});
loginWin.show();
});
var cardWin="";
function card(){
	
	if(!cardWin)
	{
		cardWin= new Ext.Window({
			width:250,
			autoHeight:true,
			modal:true,
			draggable:false,
			//layout: 'form',
			title:"口令卡",
			iconCls:'card',
			resizable: false, 
			closable:false,
			buttonAlign : 'center', 
            layout:'form',
			items:[{
				xtype:'form',
				bodyPadding: 20,
				style:{border:0},
				id:'cardForm',
				layout: {
	                type:'vbox',
	                padding:'1',
	                pack:'center',//垂直居中
	                align:'center'//水平居中
	            },
				items : //元素
					[
					 {
						 xtype:'textfield',
						 fieldLabel:'注册口令',
						 id:'card',
						 name: 'card',
						 allowBlank: false,
						 blankText: '不能为空',
						 msgTarget : 'side',
						 labelWidth:60,
			             labelAlign: 'left',
			             width:200                                           
					 }
					 ],
						buttons:[
						         {text:'验证',
						        	 handler:checkCard,
						        	 iconCls:'check'
						        	
						         },
						         {text:'取消',
						        	 iconCls:'cancel',
						        	 handler:function(){
						        	 //registerForm.form.reset();
						        	 cardWin.hide()
						        	 
						         }
						        }
						        ]
			}]	
		});
	}
	cardWin.show();
	
}
var registerWin="";
function register(){
	
	if(!registerWin)
	{
		registerWin= new Ext.Window({
			width:350,
			autoWidth:true,
			modal:true,
			draggable:false,
			//layout: 'form',
			title:"欢迎注册 综合应用与网管系统",
			iconCls:'register',
			resizable: false, 
			closable:false,
			buttonAlign : 'center', 
            layout:'form',
			items:[{
				xtype:'form',
				bodyPadding: 20,
				id:'registerForm',
				style:{border:0},
				layout: {
	                type:'vbox',
	                padding:'5',
	                pack:'center',//垂直居中
	                align:'center'//水平居中
	            },
				items : //元素
					[
					 {
						 xtype:'textfield',
						 fieldLabel:'用户名',
						 name: 'name',
						 id:'name',
						 allowBlank: false,
						 blankText: '不能为空',
						 msgTarget : 'side',
						 labelWidth:60,
			             labelAlign: 'left',
			             width:200                                           
					 },{
						 xtype:'textfield',
						 fieldLabel:'密    码',
						 name:'password',
						 id:'password',
						 allowBlank: false,
						 inputType:'password',	
						 blankText: '不能为空',
						 msgTarget : 'side',
			             labelAlign: 'left',
			             labelWidth:60,
			             width:200  
			             
			             
					 },
					 {
						 xtype:'textfield',
						 fieldLabel:'确认密码',
						 name:'repassword',
						 id:'repassword',
						 allowBlank: false,
						 inputType:'password',	
						 blankText: '不能为空',
						 msgTarget : 'side',
			             labelAlign: 'left',
			             labelWidth:60,
			             width:200  
			             
			             
					 },{
						 fieldLabel:'归属组',
						 xtype:'combobox',
						 name:'id',
						 id:'id',
						 allowBlank: false,
						 msgTarget : 'side',
						 store:groupStore,
						 queryMode:'remote',
						 editable:false,
						 emptyText:'请选择...',
						 valueField: 'id',  
						 displayField: 'groupname' ,
			             labelWidth:60,
			             width:200 
					 }
					 ],
						buttons:[
						         {text:'注册',
						        	 handler:GetRegister,
						        	 iconCls:'register'
						        	
						         },
						         {text:'关闭',
						        	 iconCls:'cancel',
						        	 handler:function(){
						        	 //registerForm.form.reset();
						        	 registerWin.hide()
						        	 
						         }
						        }
						        ]
			}]	
		});
	}
	registerWin.show();
	
}
function login(){
	if(loginForm.form.isValid){
		   Ext.MessageBox.show({
			   title:'正在登陆',
			   msg:'正在验证登录信息，请稍等！',
			   progressText:'',
			   width:300,
			   progress:true,
			   closable:'false',
			   animEl:'loding'
		   });   
		   var f = function(v){
			   return function(){
				   var i=v/11;
				   Ext.MessageBox.updateProgress(i,'');
			   }
		   }
		   for(var i=1;i<33;i++){
			   setTimeout(f(i),i*1500);
		   }

		   if(loginForm.form.submit){
			   Ext.Ajax.request({
				   url:'../login/login.action',
				   params:{
				username:loginForm.form.findField("name").getValue(),
				password:loginForm.form.findField("password").getValue(),
				rememberTime:loginForm.form.findField("remember_time").getValue()
			},
			method:'POST',
			//waitTitle:'正在登陆',
			//waitMsg:'正在验证登录信息，请稍等！',
			success : function(response, opts) {  
				var success = Ext.decode(response.responseText).success; 
				
				// 当后台数据同步成功时  
				if (success) {  
					//Ext.Array.each(data, function(record) {  
						window.location.href="../index.jsp";
						//window.opener=null;
						//window.open("../../index.jsp","",width=document.body.width, 'fullscreen=yes');
					//}); 

				} else {  
					Ext.MessageBox.show({  
						title : "提示",  
						msg : "验证信息没有通过!" , 
						icon: Ext.MessageBox.INFO  
					});  
				}  

			},

			 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "登陆失败!" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			})
 
		}
	}
}		
function checkCard(){
	  Ext.Ajax.request({
		url:'../login/check.action',
		params:{
		registerCard:Ext.getCmp('card').getValue()
	},
	method:'POST',
	waitTitle:'正在验证',
	waitMsg:'正在验信息，请稍等！',
	success : function(response, opts) {  
		var success = Ext.decode(response.responseText).success; 
		
		// 当后台数据同步成功时  
		if (success) { 
			cardWin.hide();
			register(); 

		} else {  
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "验证信息没有通过!" , 
				icon: Ext.MessageBox.INFO  
			});  
		}  

	},

	 failure: function(response) {

		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "服务器响应失败!" , 
			 icon: Ext.MessageBox.INFO  
		 }); 
	 }  
	})
}
function GetRegister(){
	if(Ext.getCmp('registerForm').form.isValid){
		 //显示进度条  
		   Ext.MessageBox.show({
			   title:'loading.....',
			   msg:'正在注册信息',
			   progressText:'',
			   width:300,
			   progress:true,
			   closable:false,
			   animEl:'loding'
		   });   
		   var f = function(v){
			   return function(){
				   var i=v/9;
				   Ext.MessageBox.updateProgress(i,'');
//				   Ext.MessageBox.updateText("正在准备数据"+i);
			   }
		   }
		   for(var i=1;i<9;i++){
			   setTimeout(f(i),i*500);
		   }
		 Ext.Ajax.request({
				url:'../login/register.action',
				params:{
				username:Ext.getCmp('name').getValue(),
				password:Ext.getCmp('password').getValue(),
				repassword:Ext.getCmp('repassword').getValue(),
				groupid:Ext.getCmp('id').getValue()
			},
			method:'POST',
			//waitTitle:'正在登陆',
			//waitMsg:'正在验证登录信息，请稍等！',
			success : function(response, opts) {  
				var success = Ext.decode(response.responseText).success; 
				var message=Ext.decode(response.responseText).message;
				
				// 当后台数据同步成功时  
				if (success) {  
					registerWin.hide();
					Ext.MessageBox.show({  
						title : "提示",  
						msg : "注册成功!" , 
						icon: Ext.MessageBox.INFO  
						
					});   

				} else {  
					Ext.MessageBox.show({  
						title : "提示",  
						msg : message , 
						icon: Ext.MessageBox.INFO  
					});  
				}  

			},

			 failure: function(response) {

				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			})
		
	}
	
}