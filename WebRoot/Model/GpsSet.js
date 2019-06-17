Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath(['Ext.ux', '../../ext4.2/ux/'],['Go','../../time/Go/']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.form.*',
             'Ext.toolbar.Paging',
             'Ext.Action'
             ]		 
);

Ext.define('detm',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'name'}
	      
	        ], 
	        idProperty : 'id'
})

// 用户数据
var store = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name : 'mscid'},{name:'name'},{name:'timeout'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/gpsTaskList.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
var detachmentStore = Ext.create('Ext.data.Store', {
	fields : [ {name : 'id'},{name:'name'}],
	remoteSort : true,
	pageSize : 500,
	proxy : {
		type : 'ajax',
		url : '../data/RadioUserDetm.action',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		simpleSortMode : true
	}
});
detachmentStore.on('load', function (s, options) {  
	var ins_rec = Ext.create('detm',{
	      id:0,
	      name:'===全部==='
	    }); 
	    s.insert(0,ins_rec);
	    Ext.getCmp("mscType").setValue(0);
});

var leftPanel=Ext.create('Ext.form.Panel',{
	region:'center',
	margin:'0 3 0 0',
	border:false,
	autoScrool:true,
	items:[{
		xtype:'panel',title:'操作',frame:false,border:0,
		//height:220,
		layout:'form',
		items:[{
			xtype:'fieldset',title:'方式',margin:'0 3 0 3',
			items:[{xtype:'radiogroup',fieldLabel:'',name:'type',checked:true,labelWidth:10,layout:'column',
				listeners:{
				'change':function(){
				      var type=leftPanel.getForm().findField('type').getValue()['type'];
				      if(type==0){
				    	  Ext.getCmp('gpsen').show();
				    	  Ext.getCmp('t_interval').hide();
				    	  Ext.getCmp('d_index').hide();
				    	  Ext.getCmp('tip-img').hide();
				      }else if(type==4){
				    	  Ext.getCmp('gpsen').hide();
				    	  Ext.getCmp('t_interval').show();
				    	  Ext.getCmp('tip-img').show();
				    	  Ext.getCmp('d_index').hide();
				      }else{
				    	  Ext.getCmp('gpsen').hide();
				    	  Ext.getCmp('t_interval').hide();
				    	  Ext.getCmp('d_index').show();
				    	  Ext.getCmp('tip-img').hide();
				      }
			     }
			    },
				items: [
			            { boxLabel: '立即发送(查询)', name:'type', inputValue:0,checked: true,margin:'0 10 0 0' },
			            { boxLabel: '定时触发', name:'type', inputValue:4,margin:'0 10 0 0'},
			            { boxLabel: '定距离触发', name:'type', inputValue:5,margin:'0 10 0 0'}
			]}]
		},{
			xtype:'fieldset',title:'其他',margin:'30 10 0 4',layout:"column",
			items:[{
				xtype:'checkbox',fieldLabel:'是否上报GPS',id:'gpsen',name:'gpsen',boxLabel:'是',checked:true,labelWidth:60,margin:'0 20 0 0'
			},/*{xtype:'numberfield',fieldLabel:'时隙',name:'slot',width:160,labelWidth:80,minValue:0,maxValue:1,value:0},
			*/{
				layout:'column',border:false,items:[{
				xtype:'numberfield',fieldLabel:'时间间隔',id:'t_interval',name:'t_interval',emptyText:'0:无效',
				labelWidth:60,width:170,minValue:0,maxValue:10801,hidden:true,
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
				border:false,id:'tip-img',margin:'3 0 0 20',stlye:'cursor:pointer',hidden:true,
				html:"<a href='#' onclick='tooltip()'><img src='../resources/images/btn/info.png'/> </a>"
			}]
			},{
				xtype:'combobox',fieldLabel:'距离间隔',id:'d_index',name:'d_index',labelWidth:60,hidden:true,
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
	    		queryMode:'local',value:0,width:170,margin:'3 0 3 0'
			},/*{
				xtype:'combobox',fieldLabel:'GPS格式',name:'format',
				labelWidth:80,
	    		store:[[0,'控制信道短格式'],
	    		       [1,'控制信道长格式'],
	    		       [2,'业务信道C_GPSU格式'],
	    		       [3,'业务信道C_GPS2U格式'],
	    		       [4,'业务信道C_GPS3U格式']],
	    		queryMode:'local',value:0,width:250
			}*/]
		}/*,{
			xtype:'fieldset',title:'时隙',margin:'0 3 0 3',
			items:[{xtype:'numberfield',fieldLabel:'',name:'slot',width:100,labelWidth:10,margin:'0 0 10 0',minValue:0,maxValue:1,value:0}]
		}*/]
	},{
		xtype:'fieldset',title:'终端号码',margin:'30 3 0 3',layout:'column',
		items:[{xtype:'textfield',fieldLabel:'号码',name:'user',labelWidth:40
			
		    },{
		    	xtype:"button", text:"设置", iconCls:'start', handler:sendGpsSet, margin:'0 0 10 30'
		    }]
	}]
	
});
Ext.onReady(function () { 
	new Ext.Viewport({
		layout:'border',
		region:'center',
		renderTo:Ext.getBody(),
		items:leftPanel
	})
	/*userStore.load({params:{start:0,limit:500}}); 
	// store.load();
	detachmentStore.load();
	taskUserStore.load();
	gpsTimerktaskUserStore.load();
	gpsClockStore.load();
	
	loadConfig();*/
	
	
})
function save(){
	if(Ext.getCmp('gpsTaskTime').getValue()<1){
		 Ext.MessageBox.show({  
			 title : "提示",  
			 msg : "时间必须大于1s" , 
			 icon: Ext.MessageBox.ERROR
		 }); 
		 return;
	}
   Ext.Ajax.request({  
				 url : '../data/updateGpsXML.action',  
				 params : {				 			 
				 gpsTaskTime:Ext.getCmp('gpsTaskTime').getValue()
			 },  
			 method : 'POST',			        			 
			 success : function(response) { 
				 
				 loadConfig();
				 Ext.example.msg("提示","修改成功"); 
			 },
			 failure: function(response) {
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "修改失败" , 
					 icon: Ext.MessageBox.ERROR  
				 }); 
			 }  
			 })	
}

// 删除数据
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
		record = grid.getSelectionModel().getLastSelected(); 
		var ids = [];  
		Ext.Array.each(data, function(record) {  
			var userId=record.get('mscid');  
			// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
			if(userId){ids.push(userId);}  

		});
		
		Ext.Ajax.request({
			url : '../controller/delGpsTask.action', 
			params : { 
				deleteIds:ids.join(",")
			// taskId:record.get("taskId")
		},
		    method : 'POST',
		    waitTitle : '请等待' ,  
		    waitMsg: '正在提交中', 
		    success : function(response,opts) { 
		     var rs = Ext.decode(response.responseText)		     
		     if(rs.success){
		    	 Ext.example.msg("提示","删除任务成功"); 
		    	 taskUserStore.reload();
		     }else{
		    	 Ext.MessageBox.show({  
   					 title : "提示",  
   					 msg : "失败", 
   					 icon: Ext.MessageBox.ERROR 
   				 }); 
		     }    
		    },
		    failure: function(response) {
		    	Ext.example.msg("提示","失败");  
		   }
		})	
	 }  
}

// 发送数据mscId,srcId,dstId,groupname,attached,cou,operation,status
function sendGpsSet(){
	var leftForm=leftPanel.getForm();
	
	var poolch=0;
	if(0==0){
		poolch=0;
	}else{
		poolch=1;
	}
	var user=leftForm.findField('user').getValue();
	if(user==""){
		 Ext.example.msg("提示","终端号码不能为空");
	}
	Ext.Ajax.request({  
		url : '../controller/setGps.action',  
		params : { 
		/* ig:leftForm.findField('ig').getValue()['ig'], */
		number:user,
		gpsen:leftForm.findField('gpsen').getValue()?1:0,
		type:leftForm.findField('type').getValue()['type'],
		t_interval: time_index(leftForm.findField('t_interval').getValue())==-1?0:time_index(leftForm.findField('t_interval').getValue()),
		d_index:leftForm.findField('d_index').getValue(),
		pool_ch:poolch,
		format:0,
		slot:0,
		mask:0
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
// myMask.hide();
		// 当后台数据同步成功时
		if(rs.success)
		{
// Ext.example.msg("提示",rs.message);
			successId=true;
			message=rs.message;
			
		}
		else
		{ 
// Ext.example.msg("提示","error");
			successId=false;
			message=rs.message;
		}

	},
	failure: function(response) {successId=false;}  
	});
	return successId;
}

function time_index(time){
	// 时间间隔
	// 数值n 时间（s）
	// 0 时间触发无效
	// 1-30 *n s 1-30
	// 31-50 *2s 62-100
	// 51-80 *3s 153-240
	// 81-100 *5s 405-500
	// 101-110 *10s 1010-1100
	// 111-125 *30s 3330-3750
	// 126 7200s
	// 127 10800s
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


