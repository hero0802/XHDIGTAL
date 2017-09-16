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
	fields:[{name:'mscId'},{name:'issi'},{name:'gssi'},{name:'groupname'},{name:'attached'},{name:'cou'},{name:'operation'},{name:'status'}],
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
	         {text: "标示", width: 100, dataIndex: 'issi'
	         },{text: "名称", width: 100, dataIndex: 'groupname', sortable: true
	         },{text: "状态", width: 100, dataIndex: 'status', sortable: true
	         }
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:false,
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
	            	 id:'startBtn',
	            	 text:'开始执行',
	            	 iconCls:'play',
	            	 handler:function(){
//	            	 Ext.getCmp('startBtn').disable();
	            	 start();
	             }
	             }]
	         },{
	             xtype: 'toolbar',
	             dock: 'top',
	             items: [{
	            	 xtype:'button',
	            	 text:'删除用户',
	            	 iconCls:'remove',
	            	 handler:del_btn
	             },{
	            	 xtype:'button',
	            	 text:'清空用户',
	            	 iconCls:'remove',
	            	 handler:function(){
	            	 store.removeAll();
	             }
	             }]
	         }]

})
}

store.on('beforeload', function (store, options) {  
    var new_params = { 
    		
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
var topPanel=Ext.create('Ext.Panel',{
	region:'north',
	height:250,
	items:[{
		xtype:'panel',
		title:'用户',
		items:[{
			xtype: 'toolbar',border:0,
			items:[{
				xtype:'numberfield',fieldLabel:'标识',id:'issi',labelWidth:60,
				listeners : {
				       change : function(field,newValue,oldValue){
				         $(".user").css('display','block');
				         if($("#userlist").text()==""){
				        	 $(".user").css('display','none'); 
				         }
				         getUserName(newValue);
				       }
				}
			},{
				xtype:'button',text:'添加',iconCls:'add',handler:addOne
			}]
		},{
			xtype: 'toolbar',border:0,
			items:[{
				xtype:'numberfield',fieldLabel:'标识范围',id:'issiStart',labelWidth:60				
			},{
				xtype:'numberfield',fieldLabel:'',id:'issiEnd',labelWidth:40				
			},{
				xtype:'button',text:'批量添加',iconCls:'add',handler:addMany
			},{
				xtype:'displayfield',value:'<span style="color:red">  [最多只能添加50个]</span>'
			}]
		}]
	},{
		xtype:'form',title:'组',border:0,margin:'3 0 5 0',
		items:[{
				xtype:'numberfield',fieldLabel:'标识',id:'gssi',labelWidth:60,
				listeners : {
				       change : function(field,newValue,oldValue){
				         $(".group").css('display','block');
				         if($("#grouplist").text()==""){
				        	 $(".group").css('display','none'); 
				         }
				         getGroupName(newValue);
				       }
				}
			},{
				xtype:'radiogroup',fieldLabel:'操作',name:'operation',id:'operation',labelWidth:60,
				margin:'10 0 10 0',layout:'column',
				items: [
			            { boxLabel: '动态重组', name:'operation', inputValue: 0,checked:true},
			            { boxLabel: '去动态重组', name:'operation', inputValue: 1,margin:'0 0 0 20'}
			        ]
			},{
				xtype:'radiogroup',fieldLabel:'组等级',name:'cou',id:'cou',labelWidth:60,
				margin:'10 0 10 0',layout:'column',
				items: [
			            { boxLabel: '低', name:'cou', inputValue: 2},
			            { boxLabel: '正常', name:'cou', inputValue: 3,margin:'0 0 0 20'},
			            { boxLabel: '选中', name:'cou', inputValue: 4,margin:'0 0 0 20',checked:true},
			            { boxLabel: '高', name:'cou', inputValue: 5,margin:'0 0 0 20'}
			        ]
			},{
				xtype:'radiogroup',fieldLabel:'组附着',name:'attached',id:'attached',labelWidth:60,
				margin:'10 0 10 0',layout:'column',
				items: [
			            { boxLabel: '附着', name:'attached', inputValue: 1,checked:true},
			            { boxLabel: '不附着', name:'attached', inputValue: 0,margin:'0 0 0 20'}
			        ]
			}]
	}]
	
})
var m_userName="无";
var m_groupName="";
Ext.onReady(function () { 
	new Ext.Viewport({
		layout:'border',
		renderTo:Ext.getBody(),
		items:[topPanel,grid]
	})
	store.load({params:{start:0,limit:30}}); 
	$("#userlist li").live('click',function(){
		Ext.getCmp('issi').setValue($(this).text());
		m_userName=$(this).text().split('/')[1];
		$(".user").css('display','none');
		
	});
	$("#grouplist li").live('click',function(){
		Ext.getCmp('gssi').setValue($(this).text());
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
	var issi=Ext.getCmp('issi').getValue();
	var gssi=Ext.getCmp('gssi').getValue();
	var attached=Ext.getCmp('attached').getValue()['attached'];
	var cou=Ext.getCmp('cou').getValue()['cou'];
	var operation=Ext.getCmp('operation').getValue()['operation'];
	var tag=false;
	if(issi==null){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "不能为空" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	store.each(function(record){
		if(record.get('issi')==issi){
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
		store.addSorted({mscId:1,issi:issi,gssi:gssi,groupname:m_userName,attached:attached,cou:cou,operation:operation,status:"等待处理.."});
		m_userName="无";
	}
	
}
//批量添加
function addMany(){
	var issiStart=Ext.getCmp('issiStart').getValue();
	var issiEnd=Ext.getCmp('issiEnd').getValue();
	var gssi=Ext.getCmp('gssi').getValue();
	var attached=Ext.getCmp('attached').getValue()['attached'];
	var cou=Ext.getCmp('cou').getValue()['cou'];
	var operation=Ext.getCmp('operation').getValue()['operation'];
	
	var tag=false;
	if(issiStart==null || issiEnd==null){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "范围不能为空" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	if(issiEnd-issiStart>50){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "批量添加不能超过 50个" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	for(var i=0;i<=issiEnd-issiStart;i++){
		var issi=issiStart+i;
		store.each(function(record){
			if(record.get('issi')==issi){
				tag=true;
			}
		});
		if(!tag){
			store.addSorted({mscId:1,issi:issi,gssi:gssi,groupname:"",attached:attached,cou:cou,operation:operation,status:"等待处理.."});
		}else{
			tag=false;
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
	if(store.getCount()<1){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没有添加用户" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	if(Ext.getCmp('gssi').getValue()==null){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没有填写组标识" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	Ext.getCmp('startBtn').disable();
	Ext.getCmp('gssi').disable();
	/*for(var j=0;j<store.getCount();j++){
		store.getAt(j).set('status','等待处理中..');
	}*/
	store.getAt(i).set('status','处理中，请稍等!');	
	var timeout=setInterval(function(){
		
		if(flag==0){
		 flag=1;
		if(i<store.getCount()){
			run(i);
			i++;
			
		}else{
			clearInterval(timeout);
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "<p>一共执行"+i+"次</p> <p>成功"+successfully+"个</p> <p>失败"+error+"个</p>" , 
				icon: Ext.MessageBox.INFO 
			});
			Ext.getCmp('startBtn').enable();
			Ext.getCmp('gssi').enable();
			i=0;flag=0;successfully=0;error=0;
			
		}
		}
		
}, 1000);  //每隔 1秒钟  
}
function run(i){
	
	if(send(store.getAt(i).get('mscId'),store.getAt(i).get('issi'),store.getAt(i).get('gssi'),m_groupName,store.getAt(i).get('attached'),store.getAt(i).get('cou'),store.getAt(i).get('operation'),0)){
		
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
function getUserName(issi){
	Ext.Ajax.request({  
		url : '../../adddgna/getUserName.action',  
		params : {  
		issi:issi
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
//获取组名
function getGroupName(gssi){
	Ext.Ajax.request({  
		url : '../../adddgna/getGroupName.action',  
		params : {  
		gssi:gssi
	},  
	method : 'POST',
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时  						
		if(rs.success)
		{
			$("#grouplist").empty();
			Ext.Array.each(rs.gName, function(record){
				$(".group ul").append('<li>'+record.TalkgroupID+'/'+record.E_name+'</li>');
			})
		}
		else
		{ 
		}

	},
	failure: function(response) {}  
	});
}
//发送数据mscId,issi,gssi,groupname,attached,cou,operation,status

function send(mscId,issi,gssi,groupname,attached,cou,operation,status){
	gssi=Ext.getCmp('gssi').getValue();
	attached=Ext.getCmp('attached').getValue()['attached'];
	cou=Ext.getCmp('cou').getValue()['cou'];
	operation=Ext.getCmp('operation').getValue()['operation'];
	

	Ext.Ajax.request({  
		url : '../../adddgna/send.action',  
		params : { 
		mscId:mscId,
		issi:issi,
		gssi:gssi,
		groupname:groupname,
		attached:attached,
		cou:cou,
		operation:operation,
		status:status
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
/*function start(){
	if(store.getCount()<1){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没有添加用户" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	if(Ext.getCmp('gssi').getValue()==null){
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没有填写组标识" , 
			icon: Ext.MessageBox.ERROR  
		});
	  return ;
	}
	var i=0;
	var successfully=0,error=0;
//	mask.show();
	for(i=0;i<store.getCount();i++){
		if(send(store.getAt(i).get('mscId'),store.getAt(i).get('issi'),store.getAt(i).get('gssi'),m_groupName,store.getAt(i).get('attached'),store.getAt(i).get('cou'),store.getAt(i).get('operation'),store.getAt(i).get('status'))){
			store.getAt(i).set('status','完成');
			store.update();
			successfully++;             
		}else{
			store.getAt(i).set('status','失败');
			store.update();
			error++;
		}
	}
//	mask.hide();
//	Ext.getCmp('startBtn').enable();
	store.each(function(record){
		store.getAt(i++).set('status','完成');
	})
}*/