Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.toolbar.Paging',
             'Ext.Action'
             ]		 
);
//用户数据
var store=Ext.create('Ext.data.Store',{
//	mscId,issi,gssi,groupname,attached,cou,operation,status
	fields:[{name:'number'},{name:'status'}],
	autoLoad:true,
	data:[]
})
 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         new Ext.grid.RowNumberer({width:50,text:'#'}), 
	         {text: "号码", width: 100, dataIndex: 'number'
	         },{text: "状态", width: 100, dataIndex: 'status', sortable: true
	         }
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:true,
	         forceFit: true,
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
	         dockedItems: [{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{
	            	 xtype:'button',
	            	 text:'删除数据',
	            	 iconCls:'delete',
	            	 handler:del_btn
	             },{
	            	 xtype:'button',
	            	 text:'清空数据',
	            	 iconCls:'clear',
	            	 handler:function(){
	            	 store.removeAll();
	             }
	             }/*,{
	            	 xtype:'button',
	            	 id:'startBtn',
	            	 text:'开始执行',
	            	 iconCls:'start',
	            	 handler:function(){
//	            	 Ext.getCmp('startBtn').disable();
	            	 start();
	             }
	             }*/]
	         }]

})
}

store.on('beforeload', function (store, options) {  
    var new_params = { 
    		
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
var userPanel=Ext.create('Ext.form.Panel',{
	id:'user',
	title:'用户',
	region:'north',
	margin:'0 0 10 0',
	height:180,
	items:[{
		xtype: 'fieldset',margin:'0 10 5 10',title:'单个添加',layout:'column',
		items:[{
			xtype:'textfield',fieldLabel:'号码',name:'number',labelWidth:60,
			emptyText:'',margin:'5 0 10 0'/*,
			listeners : {
			       change : function(field,newValue,oldValue){
			         $(".user").css('display','block');
			         if($("#userlist").text()==""){
			        	 $(".user").css('display','none'); 
			         }
			         getUserName(newValue);
			
			      if(newValue.length==3){
			    	  
			    	  userPanel.form.findField('number').setValue(newValue+"-");
			    	 
			      }else if(newValue.length==6){
			    	  userPanel.form.findField('number').setValue(newValue+"-");
			      }
			       }
			}*/
		},{
			xtype:'button',text:'添加',iconCls:'add',handler:addOne,margin:'5 0 10 5'
		}]
	},{
		xtype: 'fieldset',margin:'0 10 5 10',title:'掩码',layout:'column',
		items:[{
			xtype:'numberfield',fieldLabel:'掩码',name:'mask',labelWidth:60,
			value:0,margin:'5 0 10 0',value:0
			
		}]}/*,{
		xtype:"fieldset",
		style:'margin: 0 10 5 10',
		title:'批量添加',
		layout:'form',
		items:[{
			layout:'column',border:false,
			items:[{
				xtype:'numberfield',fieldLabel:'区号',name:'np',emptyText:'328~806',
				labelWidth:50,width:150,margin:'0 20 0 0',minValue:328,maxValue:806,
				value:328
			}]
		},{
				layout:'column',border:false,
				items:[{
				xtype:'numberfield',fieldLabel:'队号',name:'fgn',emptyText:'20~89',
				labelWidth:50,width:150,margin:'0 20 0 0',minValue:20,maxValue:89,
				value:20
	    		
			},{
				xtype:'displayfield',fieldLabel:'',value:'<span style="color:red; font-size:2em">-></span>',
				labelWidth:1,width:60,margin:'0 0 0 0',name:'zzz',hidden:false
	    		
			},{
				xtype:'numberfield',fieldLabel:'',name:'fgnEnd',emptyText:'20~89',
				labelWidth:50,width:120,margin:'0 20 0 0',minValue:20,maxValue:89,
				hidden:false,value:20
	    		
			}]
			},{
				layout:'column',border:false,
				items:[{
				xtype:'numberfield',fieldLabel:'个号',name:'gn',emptyText:'200~899',
				labelWidth:50,width:150,margin:'0 20 10 0',minValue:200,maxValue:899,
				value:200
			},{
				xtype:'displayfield',fieldLabel:'',value:'<span style="color:red; font-size:2em">-></span>',
				labelWidth:1,width:60,margin:'0 0 10 0',name:'zz',hidden:false
	    		
			},{
				xtype:'numberfield',fieldLabel:'',name:'gnEnd',emptyText:'200~899',
				labelWidth:50,width:120,margin:'0 20 10 0',minValue:200,maxValue:899,
				hidden:false,value:200
			},{
				xtype:'button',text:'批量添加',iconCls:'add',handler:addMany
			},{
				xtype:'displayfield',value:'<span style="color:red">  [最多只能添加500个]</span>',
				margin:'0 0 0 10'
			}]
			}]}*/]
})
var leftPanel=Ext.create('Ext.form.Panel',{
	region:'west',
	width:450,
	margin:'0 20 0 0',
	autoScrool:true,
	items:[{
		xtype:'form',title:'操作',frame:false,border:0,
		items:[{
			xtype:'fieldset',title:'方式',margin:'0 10 0 10',
			items:[{xtype:'radiogroup',fieldLabel:'',name:'type',checked:true,labelWidth:10,layout:'form',margin:'0 0 10 0',
				listeners:{
				'change':function(){
				      var type=leftPanel.getForm().findField('type').getValue()['type'];
				      if(type==4 || type==5){
				    	 
				    	  Ext.getCmp('t_interval').enable();
				    	  Ext.getCmp('d_index').enable();
				      }else{
				    	  Ext.getCmp('t_interval').disable();
				    	  Ext.getCmp('d_index').disable();
				      }
			     }
			    },
				items: [
			            { boxLabel: '立即发送(查询)', name:'type', inputValue:0,checked: true },
			            { boxLabel: '开机触发', name:'type', inputValue:1},
			            { boxLabel: '关机触发', name:'type', inputValue:2},
			            { boxLabel: '开关机触发', name:'type', inputValue:3},
			            { boxLabel: '时间或距离任一满足触发', name:'type', inputValue:4},
			            { boxLabel: '时间或距离同时满足触发', name:'type', inputValue:5}
			]}]
		},{
			xtype:'fieldset',title:'其他',margin:'0 10 0 10',
			items:[{
				xtype:'checkbox',fieldLabel:'上报GPS',name:'gpsen',boxLabel:'是',checked:true,labelWidth:80,margin:'0 0 10 0'
			},{
				layout:'column',border:false,items:[{
				xtype:'numberfield',fieldLabel:'时间间隔',id:'t_interval',name:'t_interval',emptyText:'0:无效',
				labelWidth:80,width:170,margin:'0 0 10 0',minValue:0,maxValue:10801,disabled:true,
				listeners:{
					'blur':function(){
					      var time=leftPanel.getForm().findField('t_interval').getValue();
					     if( time!=null && time_index(time)==-1){
					    	 Ext.MessageBox.show({  
					    			title : "提示",  
					    			left:0,
					    			msg : "时间间隔范围区间不正确,正确区间：<br>" +
					    					"1-30秒<br>"+"62-100秒<br>"+"153-240秒<br>"+"405-500秒<br>"+
					    					"1010-1100秒<br>"+" 3330-3750秒<br>"+"7200s秒<br>"+"10800s秒<br>" , 
					    			icon: Ext.MessageBox.ERROR  
					    		});
					     }
				     }
				    }
			},{
				border:false,margin:'3 0 0 20',stlye:'cursor:pointer',
				html:"<a href='#' onclick='tooltip()'><img src='../resources/images/btn/info.png'/> </a>"
			}]
			},{
				xtype:'combobox',fieldLabel:'距离间隔',id:'d_index',name:'d_index',labelWidth:80,disabled:true,
	    		store:[
	    		       [0,'无效'],
	    		       [1,'5米'],
	    		       [2,'10米'],
	    		       [3,'30米'],
	    		       [4,'60米'],
	    		       [5,'120米'],
	    		       [6,'220米'],
	    		       [7,'350米'],
	    		       [8,'500米'],
	    		       [9,'700米'],
	    		       [10,'1000米'],
	    		       [11,'1300米'],
	    		       [12,'1700米'],
	    		       [13,'2200米'],
	    		       [14,'2800米'],
	    		       [15,'3500米']],
	    		queryMode:'local',value:0,width:170,margin:'0 0 10 0'
			},/*{
				xtype:'radiogroup',fieldLabel:'上拉信道 ',name:'pool_ch',checked:true,labelWidth:80,layout:'column',margin:'0 0 10 0',
				items: [
			            { boxLabel: '控制信道', name:'pool_ch', inputValue: '0',checked: true },
			            { boxLabel: '业务信道', name:'pool_ch', inputValue: '1'}
			        ]
			},*/{
				xtype:'combobox',fieldLabel:'GPS格式',name:'format',
				labelWidth:80,
	    		store:[[0,'控制信道短格式'],
	    		       [1,'控制信道长格式'],
	    		       [2,'业务信道C_GPSU格式'],
	    		       [3,'业务信道C_GPS2U格式'],
	    		       [4,'业务信道C_GPS3U格式']],
	    		queryMode:'local',value:0,width:300,margin:'0 0 10 0'
			}]
		},{
			xtype:'fieldset',title:'时隙',margin:'0 10 0 10',
			items:[{xtype:'numberfield',fieldLabel:'',name:'slot',labelWidth:10,margin:'0 0 10 0',minValue:0,maxValue:1,value:0}]
		}]
	}]
	
})
var startOne=true;
var startPanel=Ext.create('Ext.form.Panel',{
	region:'west',
	width:250,
	items:[{
		xtype:'fieldset',title:'执行方式',margin:'0 10 0 10',
		items:[{xtype:'radiogroup',fieldLabel:'',name:'startType',checked:true,labelWidth:10,layout:'form',
			listeners:{
			'change':function(){
			      var type=startPanel.getForm().findField('startType').getValue()['startType'];
			      if(type==1){
			    	 startOne=true;
			    	  Ext.getCmp('start').hide();
			    	  Ext.getCmp('btnStart').show();
			      }else{
			    	  startOne=false;
			    	  Ext.getCmp('start').show();
			    	  Ext.getCmp('btnStart').hide();
			      }
		     }
		    },
			items: [{
				boxLabel:'执行一次',name:'startType',inputValue:1,checked:true
			},{
				boxLabel:'定时执行',name:'startType',inputValue:2
			}
		]}]
	},{
		xtype:'button',text:'开始执行',name:'btnStart',id:'btnStart',margin:'20 0 0 150',
		 iconCls:'start',
    	 handler:function(){
//    	 Ext.getCmp('startBtn').disable();
    	 start();
    	 }
	},{
		xtype:'fieldset',title:'定时执行',margin:'0 10 0 10',id:'start',hidden:true,
		items:[{
			xtype:'numberfield',fieldLabel:'间隔时间[s]',name:'time',labelWidth:80,value:1,minValue:1,margin:'0 20 0 0',width:150
		},{
			layout:'column',margin:'20 0 0 10',border:0,
			items:[{
			xtype:'button',text:'开始',name:'btn_start',id:'btn_start',icon:'../resources/images/btn/success.png',margin:'0 20 0 0',
			handler:function(){
				manyStart();
			}
		},{
			xtype:'button',text:'停止',name:'btn_end',id:'btn_end',icon:'../resources/images/btn/error.png',
			handler:function(){
				stop();
			}
		}]
		}]
	}]
})
var right_leftPanel=Ext.create('Ext.Panel',{
	title:'数据列表',
	region:'center',
	layout:'border',
	bodyCls:'panel',
	border:false,
	items:[startPanel,grid]
})
var rightPanel=Ext.create('Ext.Panel',{
	region:'center',
	layout:'border',
	bodyCls:'panel-panel',
	border:false,
	items:[userPanel,right_leftPanel]
	
})
var m_userName="无";
var m_groupName="";
Ext.onReady(function () { 
	new Ext.Viewport({
		layout:'border',
		baseCls:'main-panel',
		renderTo:Ext.getBody(),
		items:[leftPanel,rightPanel]
	})
	store.load({params:{start:0,limit:30}}); 
	$("#userlist li").live('click',function(){
		Ext.getCmp('srcId').setValue($(this).text());
		m_userName=$(this).text().split('/')[1];
		$(".user").css('display','none');
		
	});
	$("#grouplist li").live('click',function(){
		Ext.getCmp('dstId').setValue($(this).text());
		m_groupName=$(this).text().split('/')[1];
		$(".group").css('display','none');
		
	});
	$("body").click(function(){
		$(".user").css('display','none');
		$(".group").css('display','none');
	})
	
})
//添加单个标示
function addOne(){
	var userForm=userPanel.getForm();
	var number=userForm.findField('number').getValue();
	var tag=false;
	if(number==null || number==""){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "号码不能为空" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	store.each(function(record){
		if(record.get('number')==number){
			tag=true;
		}
	});
	if(tag){Ext.MessageBox.show({  
		title : "提示",  
		msg : "已经存在！不能重复添加" , 
		icon: Ext.MessageBox.ERROR  
	});
	return;
	}else{
		store.addSorted({number:number,status:"等待处理.."});
		m_userName="无";
	}
	
}
//批量添加
function addMany(){
	var userForm=userPanel.getForm();
	var np=userForm.findField('np').getValue();
	var fgn=userForm.findField('fgn').getValue();
	var fgnEnd=userForm.findField('fgnEnd').getValue();
	var gn=userForm.findField('gn').getValue();
	var gnEnd=userForm.findField('gnEnd').getValue();
	
	var tag=false;
	if(userForm.findField('fgn').getValue()==null || userForm.findField('fgnEnd').getValue()==null){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg :'队号范围不能为空' , 
			 icon: Ext.MessageBox.ERROR
		 });
		 return ;
	 }
	 if(userForm.findField('gn').getValue()==null || userForm.findField('gnEnd').getValue()==null){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg :'个号范围不能为空' , 
			 icon: Ext.MessageBox.ERROR
		 });
		 return ;
	 }
	 if(userForm.findField('fgn').getValue()>userForm.findField('fgnEnd').getValue()){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg :'队号范围不正确' , 
			 icon: Ext.MessageBox.ERROR
		 });
		 return ;
	 }
	 if(userForm.findField('gn').getValue()>userForm.findField('gnEnd').getValue()){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg :'个号范围不正确' , 
			 icon: Ext.MessageBox.ERROR
		 });
		 return ;
	 }
	for(var i=0;i<=fgnEnd-fgn;i++){
		for(var j=0;j<=gnEnd-gn;j++){
			var number=np+"-"+(fgn+i)+"-"+(gn+j);
			store.each(function(record){
				if(record.get('number')==number){
					tag=true;
				}
			});
			if(!tag){
				store.addSorted({number:number,status:"等待处理.."});
			}else{
				tag=false;
			}
		}
		
	}
	
}
//删除数据
function del_btn() {  
	var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的行!" , 
			icon: Ext.MessageBox.ERROR 
		});  
		return;  
	} else {  
		Ext.Array.each(data, function(record) {  
			
			store.remove(data);

		}); 
	 }  
}
var successI=false,message="";
var successfully=0,error=0;
var i=0;  var flag=0;
//开始执行

function start(){
	var userForm=userPanel.getForm();
	var leftForm=leftPanel.getForm();
    var time=leftPanel.getForm().findField('t_interval').getValue();
    if( time!=null && time_index(time)==-1){
   	 Ext.MessageBox.show({  
   			title : "提示",  
   			left:0,
   			msg : "时间间隔范围区间不正确,正确区间：<br>" +
   					"1-30秒<br>"+"62-100秒<br>"+"153-240秒<br>"+"405-500秒<br>"+
   					"1010-1100秒<br>"+" 3330-3750秒<br>"+"7200s秒<br>"+"10800s秒<br>" , 
   			icon: Ext.MessageBox.ERROR  
   		});
   	 return;
    }
	if(store.getCount()<1){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没有添加数据" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	if(leftForm.findField('type').getValue()==4 || leftForm.findField('type').getValue()==5){
		 if(userForm.findField('t_interval').getValue()=="" || userForm.findField('d_index').getValue()==""){
			 Ext.MessageBox.show({  
	    			title : "提示",  
	    			msg : "指定距离和时间不能为空" , 
	    			icon: Ext.MessageBox.ERROR  
	    		});
	    	  return ;
		    	
      }
    }
	Ext.getCmp('btnStart').disable();
	for(var j=0;j<store.getCount();j++){
		store.getAt(j).set('status','等待处理中..');
	}
	store.getAt(i).set('status','处理中，请稍等!');
	var timeout=setInterval(function(){
		
		if(flag==0){
		 flag=1;
	
		if(i<store.getCount()){
			
			gpsSet(i)
			i++;
			
		}else{
			clearInterval(timeout);
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "<p>一共执行"+i+"次</p> <p>成功"+successfully+"个</p> <p>失败"+error+"个</p>" , 
				icon: Ext.MessageBox.INFO 
			});
			Ext.getCmp('btnStart').enable();
			//Ext.getCmp('dstId').enable();
			i=0;flag=0;successfully=0;error=0;
			
		}
		}
		
}, 1000);  //每隔 1秒钟  
}

//定时执行；
var m_timeout="";
function manyStart(){
	var userForm=userPanel.getForm();
	var leftForm=leftPanel.getForm();
	var startForm=startPanel.getForm();
	 var time=leftPanel.getForm().findField('t_interval').getValue();
	    if( time!=null && time_index(time)==-1){
	   	 Ext.MessageBox.show({  
	   			title : "提示",  
	   			left:0,
	   			msg : "时间间隔范围区间不正确,正确区间：<br>" +
	   					"1-30秒<br>"+"62-100秒<br>"+"153-240秒<br>"+"405-500秒<br>"+
	   					"1010-1100秒<br>"+" 3330-3750秒<br>"+"7200s秒<br>"+"10800s秒<br>" , 
	   			icon: Ext.MessageBox.ERROR  
	   		});
	   	 return;
	    }
	if(store.getCount()<1){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没有添加数据" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	
	console.log(startForm.findField('time').getValue())
	if(startForm.findField('time').getValue()==null  || startForm.findField('time').getValue()<1){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "间隔时间必须>=1" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	
	if(leftForm.findField('type').getValue()==4 || leftForm.findField('type').getValue()==5){
		 if(userForm.findField('t_interval').getValue()=="" || userForm.findField('d_index').getValue()==""){
			 Ext.MessageBox.show({  
	    			title : "提示",  
	    			msg : "指定距离和时间不能为空" , 
	    			icon: Ext.MessageBox.ERROR  
	    		});
	    	  return ;
		    	
      }
    }
	Ext.getCmp('btn_start').disable();
	Ext.getCmp('btn_end').enable();
	if(startForm.findField('time').getValue()>0){
		 m_timeout=setInterval(function(){
			 
				for(var j=0;j<store.getCount();j++){
					store.getAt(j).set('status','等待处理中..');
				}
				store.getAt(i).set('status','处理中，请稍等!');
				var timeout=setInterval(function(){
					
					if(flag==0){
					 flag=1;
				
					if(i<store.getCount()){
						
						gpsSet(i)
						i++;
						
					}else{
						clearInterval(timeout);
						/*Ext.MessageBox.show({  
							title : "提示",  
							msg : "<p>一共执行"+i+"次</p> <p>成功"+successfully+"个</p> <p>失败"+error+"个</p>" , 
							icon: Ext.MessageBox.INFO 
						});*/
						/*Ext.getCmp('btn_start').enable();
						Ext.getCmp('btn_end').disable();*/
						//Ext.getCmp('dstId').enable();
						i=0;flag=0;successfully=0;error=0;
						
					}
					}
					
			}, 1000);  //每隔 1秒钟  
			 
		 },startForm.findField('time').getValue()*1000)
	}

}
function stop(){
	if( m_timeout!=null ||  m_timeout!=""){
		clearInterval( m_timeout);
		Ext.getCmp('btn_start').enable();
		Ext.getCmp('btn_end').disable();
	}
}
//即时定位请求
function gpsSet(i){
	if(sendGpsSet(store.getAt(i).get('number'))){
		store.getAt(i).set('status','成功');
		if(i<store.getCount()-1){
			store.getAt(i+1).set('status','处理中，请稍等!');		
		}
		store.update();
		successfully++;  
		flag=0;
	}else{
		store.getAt(i).set('status','失败');
		if(i<store.getCount()-1){
			store.getAt(i+1).set('status','处理中，请稍等!');	
		}
		store.update();
		error++;
		flag=0;
	}
}
//设置gps触发器
function SetGpsTriRun(i){
	var triggerPara="";
	var triggerType=Ext.getCmp("triggerType").getValue()['triggerType'];
    if(Ext.getCmp("triggerType").getValue()['triggerType'] == 129){
    	triggerPara=Ext.getCmp("triggerPara").getValue();
    }else{
    	triggerPara=Ext.getCmp("triggerParaTime").getValue();
    }
	if(sendSetGpsTri(store.getAt(i).get('srcId'),store.getAt(i).get('dstId'),triggerType,triggerPara)){
		store.getAt(i).set('status','成功');
		if(i<store.getCount()-1){
			store.getAt(i+1).set('status','处理中，请稍等!');		
		}
		store.update();
		successfully++;  
		flag=0;
	}else{
		store.getAt(i).set('status','失败');
		if(i<store.getCount()-1){
			store.getAt(i+1).set('status','处理中，请稍等!');	
		}
		store.update();
		error++;
		flag=0;
	}
}


//获取用户名
function getUserName(srcId){
	Ext.Ajax.request({  
		url : '../../adddgna/getUserName.action',  
		params : {  
		issi:srcId
	},  
	method : 'POST',
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时  						
		if(rs.success)
		{
			$("#userlist").empty();
			Ext.Array.each(rs.userName, function(record){
				$(".user ul").append('<li>'+record.C_ID+'/'+record.E_name+'</li>');
			})
		}
		else{}

	},
	failure: function(response) {}  
	});
}
//发送数据mscId,srcId,dstId,groupname,attached,cou,operation,status
function sendGpsSet(number){
	var leftForm=leftPanel.getForm();
	var poolch=0;
	if(leftForm.findField('format').getValue()==0 || leftForm.findField('format').getValue()==1){
		poolch=0;
	}else{
		poolch=1;
	}
	Ext.Ajax.request({  
		url : '../controller/setGps.action',  
		params : { 
		/*ig:leftForm.findField('ig').getValue()['ig'],*/
		number:number,
		gpsen:leftForm.findField('gpsen').getValue()?1:0,
		type:leftForm.findField('type').getValue()['type'],
		t_interval: time_index(leftForm.findField('t_interval').getValue())==-1?0:time_index(leftForm.findField('t_interval').getValue()),
		d_index:leftForm.findField('d_index').getValue(),
		pool_ch:poolch,
		format:leftForm.findField('format').getValue(),
		slot:leftForm.findField('slot').getValue(),
		mask:userPanel.form.findField('mask').getValue()
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
//		myMask.hide();
		// 当后台数据同步成功时  						
		if(rs.success)
		{
//			Ext.example.msg("提示",rs.message);
			successId=true;
			message=rs.message;
			
		}
		else
		{ 
//			Ext.example.msg("提示","error"); 
			successId=false;
			message=rs.message;
		}

	},
	failure: function(response) {successId=false;}  
	});
	return successId;
}
/*function sendSetGpsTri(srcId,dstId,triggerType,triggerPara){
	Ext.Ajax.request({  
		url : '../../gps/SetGpsTri.action',  
		params : { 
		srcId:dstId,
		dstId:srcId,
		triggerType:triggerType,
		triggerPara:triggerPara
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
//		myMask.hide();
		// 当后台数据同步成功时  						
		if(rs.success)
		{
//			Ext.example.msg("提示",rs.message);
			successId=true;
			message=rs.message;
			
		}
		else
		{ 
//			Ext.example.msg("提示","error"); 
			successId=false;
			message=rs.message;
		}

	},
	failure: function(response) {successId=false;}  
	});
	return successId;
}
function sendGpsEnabled(srcId,dstId,enableFlag){
	Ext.Ajax.request({  
		url : '../../gps/GpsEnabled.action',  
		params : { 
		srcId:dstId,
		dstId:srcId,
		enableFlag:enableFlag
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
//		myMask.hide();
		// 当后台数据同步成功时  						
		if(rs.success)
		{
//			Ext.example.msg("提示",rs.message);
			successId=true;
			message=rs.message;
			
		}
		else
		{ 
//			Ext.example.msg("提示","error"); 
			successId=false;
			message=rs.message;
		}

	},
	failure: function(response) {successId=false;}  
	});
	return successId;
}*/


function time_index(time){
	//时间间隔
	//数值n 		时间（s）
	//0 			时间触发无效
	//1-30 		*n s         1-30
	//31-50 		*2s      62-100
	//51-80 		*3s      153-240
	//81-100 		*5s      405-500
	//101-110 	*10s    1010-1100
	//111-125 	*30s     3330-3750
	//126 		7200s
	//127 		10800s
	if(time==0){
		return 0;
	}
	if(time>=1 && time<=30){
		return time;
	}
	else if(time>=62 && time<=100){
		return Math.round(time/2);
	}
	else if(time>=153 && time<=240){
		return Math.round(time/3);
	}
	else if(time>=405 && time<=500){
		return Math.round(time/5);
	}
	else if(time>=1010 && time<=1100){
		return Math.round(time/10);
	}
	else if(time>=3330 && time<=3750){
		return Math.round(time/30);
	}
	else if(time==7200){
		return 126;
	}
	else if(time==10800){
		return 127;
	}
	else{
		return -1;
	}
	
}
function tooltip(){
	 Ext.MessageBox.show({  
			title : "提示",  
			left:0,
			msg : "时间间隔范围区间：<br>" +
					"1-30秒<br>"+"62-100秒<br>"+"153-240秒<br>"+"405-500秒<br>"+
					"1010-1100秒<br>"+" 3330-3750秒<br>"+"7200s秒<br>"+"10800s秒<br>" , 
			icon: Ext.MessageBox.INFO
		});
}



