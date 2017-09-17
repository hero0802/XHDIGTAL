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
var isAddMany=false
checkUserPower();
// 创建Model
Ext.define('radiouser',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'sysidcode'},
	        {name: 'colorcode'},
	        {name: 'sleepen'},
	        {name: 'ip'},
	        {name: 'startwatchdog'},
	        {name: 'channelno'},
	        {name: 'slot0authority'},
	        {name: 'slot1authority'},
	        {name: 'aietype'},
	        {name: 'up'},
	        {name: 'mask'},
	        {name: 'sf'},
	        {name: 'wt'},
	        {name: 'reg'},
	        {name: 'backoff'},
	        {name: 'np'},
	        {name: 'name'},
	        {name: 'rf_transmit_en'},
	        {name: 'rf_receive_en'},
	        {name:'offlinech'},
	        {name:'offlinerepeaten'},
	        {name:'admode'},
	        {name:'aduiorecvport'},
	        {name:'wan_en'},
	        {name:'wan_centerip'},
	        {name:'wan_centerport'},
	        {name:'wan_switchip'},
	        {name:'wan_switchport'},
	        {name: 'issimulcast'},
	        {name:'gpsnum_delay'},
	        {name:'gpsunlock_worken'},
	        {name:'mcsrcen'},
	        {name:'msodisconn_worken'},
	        {name:'bsdisconn_worken'}
	        ], 
	        idProperty : 'id'
})
// 创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
// 设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/bsStation.action',
	// url:'../../user/show.action',
	reader: {
	// 数据格式为json
	type: 'json',
	root: 'items',
	// 获取数据总数
	totalProperty: 'total'
    },
    sorters: [{ 
    	            // 排序字段。
    	            property: 'id', 
    	            // 排序类型，默认为 ASC
    	            direction: 'DESC' 
    	        }] ,
    simpleSortMode: true 
}
});

// 创建Model
Ext.define('radiouseria',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'name'}    
	        ], 
	        idProperty : 'id'
})
 // 创建多选
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
// 创建Action
var addAction=Ext.create('Ext.Action',{
	iconCls:'add',
	text:'增加',
	tooltip:'增加数据',
	disabled:addBs?false:true,
	handler:add
});
var updateAction=Ext.create('Ext.Action',{
	iconCls:'update',
	text:'修改',
	tooltip:'修改数据',
	disabled:updateBs?false:true,
	handler:update_btn
});
var deleteAction=Ext.create('Ext.Action',{
	iconCls:'delete',
	text:'删除',
	tooltip:'删除数据',
	disabled:delBs?false:true,
	handler:del_btn
});
var refreshAction=Ext.create('Ext.Action',{
	text:'刷新',
	tooltip:'刷新数据',
	iconCls:'refresh',
    handler:function(){store.reload()}
});
var searchAction=Ext.create('Ext.Action',{
	text:'',
	iconCls:'search',
	tooltip:'查询',
    handler:function(){store.loadPage(1);}
});
// 创建菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        addAction,
        updateAction,
        deleteAction,'-',
        refreshAction,
    ]
});
// 创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置>>配置管理>>基站配置',
	iconCls:'icon-location',
	region:'center',
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	loadMask: true,  
	columns:[
	         {text: "基站ID", width:60, dataIndex: 'id', sortable: true,
	        	 renderer : function(v){
	        	 return"<a href='#' onclick=update_btn() title='详细信息' style='color:blue'>"+v+"</a>";
	         }
	         },{text: "名称", width:130, dataIndex: 'name', sortable: false
	         },{text: "IP", width:130, dataIndex: 'ip', sortable: false
	         },{text: "色码", width:80, dataIndex: 'colorcode', sortable: false
	         },/*{text: "看门狗", width:80, dataIndex: 'startwatchdog', sortable: false,
	        	 renderer:function(v){
	        	 if(v==0){return "关闭";}else{return "开启";}
	         }
	         },*/{text: "状态", width:80, dataIndex: 'sleepen', sortable: false,
	        	 renderer:function(v){
	        	 if(v==0){return "休眠";}else{return "工作";}
	         }
	         },{text: "是否同播", width:80, dataIndex: 'issimulcast', sortable: false,
	        	 renderer:function(v){
		        	 if(v==0){return "<span style='color:red'>否</span>";}else{return "是";}
		         }
		      },{text: "Gps失锁是否工作", width:130, dataIndex: 'gpsunlock_worken', sortable: false,
	        	 renderer:function(v){
		        	 if(v==0){return "<span style='color:red'>否</span>";}else{return "是";}
		         }
		         },/*{text: "射频发射", width:80, dataIndex: 'rf_transmit_en', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "允许";}else{return "禁止";}
	         }
	         },*/{text: "射频接收", width:80, dataIndex: 'rf_receive_en', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "允许";}else{return "禁止";}
	         }
	         },{text: "联网信道", width:80, dataIndex: 'channelno', sortable: false,
	        	 renderer:function(v){
	        		 return v+1;
	        	 }
	         },{text: "脱网信道", width:80, dataIndex: 'offlinech', sortable: false,
	        	 renderer:function(v){
	        		 return v+1;
	        	 }
		         },{text: "脱网转发", width:80, dataIndex: 'offlinerepeaten', sortable: false,
		        	 renderer:function(v){
			        	 if(v){return "允许";}else{return "禁止";}
			         }
			         },{text: "工作模式", width:80, dataIndex: 'admode', sortable: false,
			        	 renderer:function(v){
				        	 if(v){return "数字";}else{return "模拟";}
				         }
				         },{text: "音频接收端口", width:110, dataIndex: 'aduiorecvport', sortable: false
			},{text: "组播源", width:80, dataIndex: 'offlinerepeaten', sortable: false,
	        	 renderer:function(v){
		        	 if(v){return "是";}else{return "<span style='color:red'>否</span>";}
		      }}
			,{text: "中心断网是否工作", width:140, dataIndex: 'offlinerepeaten', sortable: false,
	        	 renderer:function(v){
		        	 if(v){return "是";}else{return "<span style='color:red'>否</span>";}
		      }}
			,{text: "基站断网是否工作", width:140, dataIndex: 'offlinerepeaten', sortable: false,
	        	 renderer:function(v){
		        	 if(v){return "是";}else{return "<span style='color:red'>否</span>";}
		      }}
	         ],
	         plugins : [cellEditing],
	         frame:false,
	         border:false,
	         forceFit: false,
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

	         emptyText:'<h1 align="center" style="color:red"><span>对不起，没有查询到数据</span></h1>',
	        
	         dockedItems: [{
	        	 dock:'top',
	        	 xtype:'toolbar',
	        	 items:[{fieldLabel:'基站ID',xtype:'textfield',name:'id',id:'id',labelWidth: 60,width:180,emptyText:'基站ID' },	                    
	                    {fieldLabel:'名称',xtype:'textfield',name:'name',id:'name',labelWidth:60,width:180,emptyText:'基站名称'},    
	               		  searchAction,'-',{
	               			  text:'',
	               			  iconCls:'clear',
	               			  tooltip:'清除输入的查询数据',
	               			  handler: function(){
	               			  Ext.getCmp("id").reset();
	               			  Ext.getCmp("name").reset();
	               		  }}]
	         },{
	        	 dock:'left',
	        	 xtype:'toolbar',
	        	 items:[addAction,'-',updateAction,'-',deleteAction]
	         },{
	             dock: 'bottom',
	             xtype: 'pagingtoolbar',
	             // style:'background: skyblue',
	             store: store, 
	          	 displayInfo: true, 
	          	 items:[]

	          	
	         }]

})
}

store.on('beforeload', function (store, options) {  
    var new_params = { 
    		id: Ext.getCmp('id').getValue(),
    		name: Ext.getCmp('name').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
// 显示表格
Ext.QuickTips.init(); 
// 禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:grid
     })
	store.load({params:{start:0,limit:100}}); 
});



// 增加、删除，修改功能

// -----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
// -----------------------------------------------编码ID删除
// --------------------------------------------------
var delFlag=0,i=0,successfully=0,error=0;
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
					// 如果删除的是幻影数据，则id就不传递到后台了，直接在前台删除即可
					if(userId){ids.push(userId);}  

				}); 
				 var myMask = new Ext.LoadMask(Ext.getBody(), {  
                     msg: '正在删除数据，请稍后！',  
                     // loadMask: true,
                     removeMask: true // 完成后移除
                 });
				 myMask.show();
				Ext.Ajax.request({  
					url : '../controller/delBsStation.action',  
					params : {  
					deleteIds : ids.join(',') 
				},  
				method : 'POST',
				waitTitle : '请等待' ,  
			    waitMsg: '正在提交中', 
				success : function(response, opts) {  
					myMask.hide();
					var success = Ext.decode(response.responseText).success; 
					
					// 当后台数据同步成功时
					if (success) {  
						Ext.Array.each(data, function(record) {  
							store.remove(record);// 页面效果
							Ext.example.msg("提示","删除数据成功");
						}); 

					} else {  
						Ext.MessageBox.show({  
							title : "提示",  
							msg : "数据删除失败!" , 
							icon: Ext.MessageBox.INFO  
						});  
					}  

				},
				 failure: function(response) {
					myMask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "服务器响应失败!" , 
					 icon: Ext.MessageBox.INFO  
				 });}  }); } });  }  
}
function delRun(id){
	
	Ext.Ajax.request({  
		url : '../controller/delBsStation.action',  
		params : {  
		deleteIds : id
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			
			delFlag=0;
			successfully++;
		}
		else
		{
			delFlag=0;
			error++;
		}

	},
	failure: function(response) {

		delFlag=0;error++;}  
	}); 
}
// ---------------更新数据---------------------------------------
function update_btn()
{	
	var updateForm=new Ext.FormPanel({
		frame :false,
		border:false,
		width:600,
		height:400,
		border:0,
		 
		  bodyStyle :'overflow-y:scroll', //隐藏水平滚动条
		/* autoScroll : true, */
		/* bodyStyle : 'overflow-x:visible; overflow-y:scroll', */
		items:[{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'基本属性',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:"column",
				border:false,
				items:[{
					xtype:'textfield',fieldLabel:'<span style="color:red">基站ID</span>',name:'id',allowBlank: true,
					labelWidth:80,width:170,margin:'0 30 0 0',disabled:true
				},{
					xtype:'textfield',fieldLabel:'名称',name:'name',
					labelWidth:80,margin:'0 30 0 0',width:170
				},{
					xtype:'textfield',fieldLabel:'IP',name:'ip',
					labelWidth:80,margin:'0 30 0 0',width:170
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'textfield',fieldLabel:'系统识别码',name:'sysidcode',
					labelWidth:80,width:170,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'色码',name:'colorcode',
					labelWidth:80,margin:'0 30 0 0',width:170
				},{
					xtype:'numberfield',fieldLabel:'联网信道',name:'channelno',
					labelWidth:80,margin:'0 30 0 0',width:170
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'numberfield',fieldLabel:'脱网信道',name:'offlinech',
					labelWidth:80,width:170,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'音频端口',name:'aduiorecvport',
					labelWidth:80,margin:'0 30 0 0',width:170
				},{
					xtype:'checkbox',fieldLabel:'Gps失锁是否工作',name:'gpsunlock_worken',width:170,labelWidth:120,boxLabel:'是',margin:'0 30 0 0'
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'checkbox',fieldLabel:'组播源',name:'mcsrcen',width:170,labelWidth:60,boxLabel:'是',margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'中心断网是否工作',name:'msodisconn_worken',width:170,labelWidth:120,boxLabel:'是',margin:'0 30 0 0'
				},{
					xtype:'checkbox',fieldLabel:'基站断网是否工作',name:'bsdisconn_worken',width:170,labelWidth:120,boxLabel:'是',margin:'0 30 0 0'
				}]
			}]},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
				title:'公网参数',
				layout:'form',
				items:[{xtype:'panel',
					layout:'column',border:0,
					items:[{
						xtype:'checkbox',fieldLabel:'开关',name:'wan_en',width:170,labelWidth:80,boxLabel:'开启',margin:'0 30 0 0'
					}]
				},{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[{
						xtype:'textfield',fieldLabel:'UDP IP',name:'wan_switchip',
						labelWidth:80,width:190,margin:'0 30 0 0'
					},{
						xtype:'numberfield',fieldLabel:'UDP端口',name:'wan_switchport',
						labelWidth:80,margin:'0 30 0 0',width:160
					}]
				},{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[{
						xtype:'textfield',fieldLabel:'TCP IP',name:'wan_centerip',allowBlank: true,
						labelWidth:80,width:190,margin:'0 30 0 0'
					},{
						xtype:'textfield',fieldLabel:'TCP 端口',name:'wan_centerport',allowBlank: true,
						labelWidth:80,width:160,margin:'0 30 0 0'
					},{
						xtype:'numberfield',fieldLabel:'GPS计数延迟[s]',name:'gpsnum_delay',
						labelWidth:110,margin:'0 30 0 0',width:180,value:5
					}]
				}]},{
					xtype:"fieldset",
					style:'margin: 5 10 5 10',
				title:'其他参数',
				layout:'form',
				items:[{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[{
						xtype:'numberfield',fieldLabel:'0时隙权限',name:'slot0authority',
						labelWidth:80,width:170,value:7,hidden:true
					},{
						xtype:'numberfield',fieldLabel:'1时隙权限',name:'slot1authority',
						labelWidth:80,width:170,margin:'0 30 0 0',value:7,hidden:true
					}]
				},{
					xtype:'panel',
					layout:'column',
					hidden:true,
					border:false,
					items:[{
						xtype:'numberfield',fieldLabel:'地址掩码',name:'mask',
						labelWidth:80,minValue:0,maxValue:24,width:170,margin:'0 30 0 0'
					},{
						xtype:'combobox',fieldLabel:'用户等级',name:'up',
						labelWidth:80,
		        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],
		        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
					},{
						xtype:'combobox',fieldLabel:'服务选项',name:'sf',
						labelWidth:80,
		        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],
		        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
					}]
				},{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[{
						xtype:'combobox',fieldLabel:'接入等待',name:'wt',
						labelWidth:80,
		        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9'],[10,'10'],[11,'11'],[12,'12'],[13,'13'],[14,'14'],[15,'15']],
		        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
					},{
						xtype:'combobox',fieldLabel:'退避参数',name:'backoff',
						labelWidth:80,
		        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9'],[10,'10'],[11,'11'],[12,'12'],[13,'13'],[14,'14'],[15,'15']],
		        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
					},{
						xtype:'combobox',fieldLabel:'加密状态',name:'aietype',
						labelWidth:80,width:170,
		        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],
		        		queryMode:'local',value:0,margin:'0 30 0 0'
					}]
				},{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[{
						xtype:'checkbox',fieldLabel:'看门狗',name:'startwatchdog',checked:true,labelWidth:80,boxLabel:'开启'
					},{
						xtype:'checkbox',fieldLabel:'状态',name:'sleepen',labelWidth:30,boxLabel:'工作',checked:true,
						margin:'0 0 0 50'
					},{
						xtype:'checkbox',fieldLabel:'移动台激活是否需登记',name:'reg',labelWidth:150,boxLabel:'是',
						margin:'0 0 0 50'
					}]
				},{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[/*{
						xtype:'checkbox',fieldLabel:'射频发射',name:'rf_transmit_en',labelWidth:80,boxLabel:'允许'
						
					},*/{
						xtype:'checkbox',fieldLabel:'射频接收',name:'rf_receive_en',labelWidth:60,boxLabel:'允许',
						margin:'0 0 0 0'
					},{
						xtype:'checkbox',fieldLabel:'脱网转发',name:'offlinerepeaten',labelWidth:60,checked:true,boxLabel:'允许',
						margin:'0 0 0 50'
					},{
						xtype:'checkbox',fieldLabel:'工作模式',name:'admode',labelWidth:60,checked:true,boxLabel:'数字',
						margin:'0 0 0 50'
					},{
						xtype:'checkbox',fieldLabel:'是否同播',name:'issimulcast',labelWidth:80,checked:true,boxLabel:'是',
						margin:'0 0 0 0'
					}]
				}/*,{
					xtype:'panel',
					layout:'column',
					border:false,
					items:[{
						xtype:'checkbox',fieldLabel:'是否同播',name:'issimulcast',labelWidth:80,checked:true,boxLabel:'是',
						margin:'0 0 0 0'
					}]
				}*/]
			}]
		});
	
	var data = grid.getSelectionModel().getSelection();
	if (data.length !=1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择一条数据!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	
	else
	{ 
	record = grid.getSelectionModel().getLastSelected(); 
	 updateWindow = new Ext.Window({
		 draggable:false,
		 width:700,
		 height:380,
		 plain:true,
		 modal:true,
		 layout: 'fit',
		 title:"修改基站参数",
		 iconCls:'update',
		 resizable: false, 
		 closable:true,
		 items:updateForm,	
		 closeAction:'close',
		buttons:[
		         {text:'更新',
		          iconCls:'save',
		          disabled:updateBs?false:true,
		        	 handler: function() {
		        
		        		 
		        		 
		        		 Ext.Msg.confirm("请确认", "确认更新基站信息？", function(button, text) {  
		        				if (button == "yes") { 
		        	 var form=updateForm.form; 
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证数据，请稍后！',  
	                     // loadMask: true,
	                     removeMask: true // 完成后移除
	                 });
		        	 if(form.isValid()){
		        		 myMask.show();
		        	 form.submit(									
		        			 Ext.Ajax.request({  
		        				 url : '../controller/updateBsStation.action',  
		        				 params : {
		        				 id:record.get("id"),
		        				 sysidcode:form.findField('sysidcode').getValue(),
		        				 colorcode:form.findField('colorcode').getValue(),
		        				 sleepen:form.findField('sleepen').getValue()?1:0,
		        				 ip:form.findField('ip').getValue(),
		        				 startwatchdog:form.findField('startwatchdog').getValue()?1:0,
		        				 channelno:form.findField('channelno').getValue(),
		        				 slot0authority:form.findField('slot0authority').getValue(),
		        				 slot1authority:form.findField('slot1authority').getValue(),
		        				 aietype:form.findField('aietype').getValue(),
		        				 up:form.findField('up').getValue(),
		        				 mask:form.findField('mask').getValue(),
		        				 sf:form.findField('sf').getValue(),
		        				 wt:form.findField('wt').getValue(),
		        				 reg:form.findField('reg').getValue()?1:0,
		        				 backoff:form.findField('backoff').getValue(),
		        			        /* form.findField('np').getValue(), */
		        				 name:form.findField('name').getValue(),
		        				/* rf_transmit_en:form.findField('rf_transmit_en').getValue()?1:0,*/
		        				 rf_receive_en:form.findField('rf_receive_en').getValue()?1:0,
		        				offlinech:form.findField('offlinech').getValue(),
		        				aduiorecvport:form.findField('aduiorecvport').getValue(),
		        				offlinerepeaten:form.findField('offlinerepeaten').getValue()?1:0,
		        				admode:form.findField('admode').getValue()?1:0,
		        				
		        			   wan_en:form.findField('wan_en').getValue()?1:0	,	
		        			   wan_centerip:form.findField('wan_centerip').getValue(),
		        			   wan_centerport:form.findField('wan_centerport').getValue(),
		        			   wan_switchip:form.findField('wan_switchip').getValue(),
		        			   wan_switchport:form.findField('wan_switchport').getValue(),
		        			   issimulcast:form.findField('issimulcast').getValue()?1:0,
		        			    gpsnum_delay:form.findField('gpsnum_delay').getValue(),
		        			    gpsunlock_worken:form.findField('gpsunlock_worken').getValue()?1:0,	
		        			    mcsrcen:form.findField('mcsrcen').getValue()?1:0,
		        			   msodisconn_worken:form.findField('msodisconn_worken').getValue()?1:0	,
		        			   bsdisconn_worken:form.findField('bsdisconn_worken').getValue()?1:0	
		        			    		
		        			    		
		        			    		
		        			  
		        						
		        			 },  
		        			 method : 'POST',
		        			 waitTitle : '请等待' ,  
		        			 waitMsg: '正在提交中', 
		        			 
		        			 
		        			 success : function(response) { 
		        				 myMask.hide();
		        				 var rs = Ext.decode(response.responseText); 
		        				 if(rs.success)
		        				 {
// updateForm.form.reset();
		        				 Ext.example.msg("提示",rs.message);
		    		        	 updateWindow.close();
		        				 store.reload();
		        				 grid.getSelectionModel().clearSelections();
		        				 }
		        				 else
		        				 {
		        					 Ext.MessageBox.show({  
			        					 title : "提示",  
			        					 msg :rs.message , 
			        					 icon: Ext.MessageBox.INFO  
			        				 }); 
		        				 }
		        				
		        			 },
		        			 failure: function(response) {
		        				 myMask.hide();
		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg : "数据修改失败!" , 
		        					 icon: Ext.MessageBox.INFO  
		        				 }); 
		        			 }  
		        			 })); } }})
		         } }/*
					 * , {text:'取消', iconCls:'cancel', handler: function(){
					 * updateWindow.hide(); }}
					 */
		         ]

	});
	// store.insert(0,new User());
	updateWindow.show();
	/* updateWindow.maximize(); */
//	
	updateForm.form.loadRecord(record);
	updateForm.form.findField('channelno').setValue(updateForm.form.findField('channelno').getValue()+1);
	updateForm.form.findField('offlinech').setValue(updateForm.form.findField('offlinech').getValue()+1);
	}	
}

// -------------------------------------------添加数据------------------------------------------------------
/* var successfully=0,error=0; */
var success=false;
var flag=0/* ,i=0 */;
function add(){ 
var addForm=new Ext.FormPanel({
	frame :false,
	border:false,
	autoWidth:true,
	autoHeight : true,
	/* autoScroll : true, */
	/* bodyStyle : 'overflow-x:visible; overflow-y:scroll', */
	items:[{
		xtype:"fieldset",
		style:'margin: 5 10 5 10',
		title:'基本属性',
		layout:'form',
		items:[{xtype:'panel',
			layout:'column',border:0,
			items:[{
				xtype:'numberfield',fieldLabel:'<span style="color:red">ID范围</span>',name:'idStart',allowBlank: true,
				hidden:true,labelWidth:80,width:170
			},{
				xtype:'numberfield',fieldLabel:'',name:'idEnd',allowBlank: true,
				hidden:true,labelWidth:1,width:90
			},{
				xtype:'displayfield',fieldLabel:'',name:'say',allowBlank: true,
				hidden:true,labelWidth:1,value:'<span style="color:red">[最多创建100个]</span>'
			}]
		},{
			xtype:'panel',
			layout:"column",
			border:false,
			items:[{
				xtype:'textfield',fieldLabel:'<span style="color:red">基站ID</span>',name:'id',allowBlank: true,
				labelWidth:80,width:170,margin:'0 30 0 0'
			},{
				xtype:'textfield',fieldLabel:'名称',name:'name',
				labelWidth:80,margin:'0 30 0 0',width:170
			},{
				xtype:'textfield',fieldLabel:'IP',name:'ip',
				labelWidth:80,margin:'0 30 0 0',width:170
			}]
		},{
			xtype:'panel',
			layout:'column',
			border:false,
			items:[{
				xtype:'textfield',fieldLabel:'系统识别码',name:'sysidcode',
				labelWidth:80,width:170,margin:'0 30 0 0'
			},{
				xtype:'textfield',fieldLabel:'色码',name:'colorcode',
				labelWidth:80,margin:'0 30 0 0',width:170
			},{
				xtype:'numberfield',fieldLabel:'联网信道',name:'channelno',
				labelWidth:80,margin:'0 30 0 0',width:170,minValue:0
			}]
		},{
			xtype:'panel',
			layout:'column',
			border:false,
			items:[{
				xtype:'numberfield',fieldLabel:'脱网信道',name:'offlinech',
				labelWidth:80,width:170,margin:'0 30 0 0'
			},{
				xtype:'textfield',fieldLabel:'音频端口',name:'aduiorecvport',
				labelWidth:80,margin:'0 30 0 0',width:170,value:'12000'
			},{
				xtype:'checkbox',fieldLabel:'Gps失锁是否工作',name:'gpsunlock_worken',width:170,labelWidth:120,boxLabel:'是',margin:'0 30 0 0'
			}]
		},		{
			xtype:'panel',
			layout:'column',
			border:false,
			items:[{
				xtype:'checkbox',fieldLabel:'组播源',name:'mcsrcen',width:170,labelWidth:60,boxLabel:'是',margin:'0 30 0 0'
			},{
				xtype:'checkbox',fieldLabel:'中心断网是否工作',name:'msodisconn_worken',width:170,labelWidth:120,boxLabel:'是',margin:'0 30 0 0'
			},{
				xtype:'checkbox',fieldLabel:'基站断网是否工作',name:'bsdisconn_worken',width:170,labelWidth:120,boxLabel:'是',margin:'0 30 0 0'
			}]
		}]},{
			xtype:"fieldset",
			style:'margin: 5 10 5 10',
			title:'公网参数',
			layout:'form',
			items:[{xtype:'panel',
				layout:'column',border:0,
				items:[{
					xtype:'checkbox',fieldLabel:'开关',name:'wan_en',width:170,labelWidth:80,boxLabel:'开启',margin:'0 30 0 0'
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'textfield',fieldLabel:'UDP IP',name:'wan_switchip',
					labelWidth:80,width:190,margin:'0 30 0 0'
				},{
					xtype:'numberfield',fieldLabel:'UDP端口',name:'wan_switchport',
					labelWidth:80,margin:'0 30 0 0',width:160
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'textfield',fieldLabel:'TCP IP',name:'wan_centerip',allowBlank: true,
					labelWidth:80,width:190,margin:'0 30 0 0'
				},{
					xtype:'textfield',fieldLabel:'TCP 端口',name:'wan_centerport',allowBlank: true,
					labelWidth:80,width:160,margin:'0 30 0 0'
				},{
					xtype:'numberfield',fieldLabel:'GPS计数延迟[s]',name:'gpsnum_delay',
					labelWidth:110,margin:'0 30 0 0',width:180,value:5
				}]
			}]},{
				xtype:"fieldset",
				style:'margin: 5 10 5 10',
			title:'其他参数',
			layout:'form',
			items:[{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'numberfield',fieldLabel:'0时隙权限',name:'slot0authority',
					labelWidth:80,width:170,value:7,hidden:true
				},{
					xtype:'numberfield',fieldLabel:'1时隙权限',name:'slot1authority',
					labelWidth:80,width:170,margin:'0 30 0 0',value:7,hidden:true
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				hidden:true,
				items:[{
					xtype:'numberfield',fieldLabel:'地址掩码',name:'mask',
					labelWidth:80,minValue:0,maxValue:24,width:170,margin:'0 30 0 0'
				},{
					xtype:'combobox',fieldLabel:'用户等级',name:'up',
					labelWidth:80,
	        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],
	        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
				},{
					xtype:'combobox',fieldLabel:'服务选项',name:'sf',
					labelWidth:80,
	        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],
	        		queryMode:'local',value:0,width:170,margin:'0 30 0 0'
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'combobox',fieldLabel:'接入等待',name:'wt',
					labelWidth:80,
	        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9'],[10,'10'],[11,'11'],[12,'12'],[13,'13'],[14,'14'],[15,'15']],
	        		queryMode:'local',value:6,width:170,margin:'0 30 0 0'
				},{
					xtype:'combobox',fieldLabel:'退避参数',name:'backoff',
					labelWidth:80,
	        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9'],[10,'10'],[11,'11'],[12,'12'],[13,'13'],[14,'14'],[15,'15']],
	        		queryMode:'local',value:4,width:170,margin:'0 30 0 0'
				},{
					xtype:'combobox',fieldLabel:'加密状态',name:'aietype',
					labelWidth:80,width:170,
	        		store:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],
	        		queryMode:'local',value:1,margin:'0 30 0 0'
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'checkbox',fieldLabel:'看门狗',name:'startwatchdog',checked:true,labelWidth:80,boxLabel:'开启'
				},{
					xtype:'checkbox',fieldLabel:'状态',name:'sleepen',labelWidth:30,boxLabel:'单站工作',checked:true,
					margin:'0 0 0 50'
				},{
					xtype:'checkbox',fieldLabel:'移动台激活是否需登记',name:'reg',labelWidth:150,boxLabel:'是',
					margin:'0 0 0 50'
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[/*{
					xtype:'checkbox',fieldLabel:'射频发射',name:'rf_transmit_en',labelWidth:80,checked:true,boxLabel:'允许'
					
				},*/{
					xtype:'checkbox',fieldLabel:'射频接收',name:'rf_receive_en',labelWidth:60,checked:true,boxLabel:'允许',
					margin:'0 0 0 0'
				},{
					xtype:'checkbox',fieldLabel:'脱网转发',name:'offlinerepeaten',labelWidth:60,checked:true,boxLabel:'允许',
					margin:'0 0 0 50'
				},{
					xtype:'checkbox',fieldLabel:'工作模式',name:'admode',labelWidth:60,checked:true,boxLabel:'数字',
					margin:'0 0 0 50'
				}]
			},{
				xtype:'panel',
				layout:'column',
				border:false,
				items:[{
					xtype:'checkbox',fieldLabel:'是否同播',name:'issimulcast',labelWidth:80,checked:true,boxLabel:'是',
					margin:'0 0 0 0'
				}]
			}]
		}]
	});
	var Panel=Ext.create('Ext.Panel',{
		width : 600,
		height:400,
		border:0,
		 
		  bodyStyle :'overflow-x:visible;overflow-y:scroll', //隐藏水平滚动条
			items:[{
			xtype:'toolbar',
			items:[{
				xtype:'button',
				text:'[ 创建 ]',
				handler:function(){
				isAddMany=false;
				addForm.form.findField('id').show();
				addForm.form.findField('say').hide();
				addForm.form.findField('idStart').hide();
				addForm.form.findField('idEnd').hide();
			}
			},{
				xtype:'button',
				text:'[ 批量创建 ]',
				handler:function(){
				isAddMany=true;
				addForm.form.findField('id').hide();
				addForm.form.findField('say').show();
				addForm.form.findField('idStart').show();
				addForm.form.findField('idEnd').show();
			}
			}]
		},addForm]
	});
	var tabPanel=Ext.create("Ext.tab.Panel",{
		region:"center",
		id:"addTab",
		animCollapse:false,
		padding:0,
		border:false,
		// plain:true,
		layout:'fit',  
		frame: false, 
		enableTabScroll:true,
		items:[{
			title:"首页",
			items:Panel
		}]
	});
	if(!addWindow){
	addWindow = new Ext.Window({
		border:0,
		draggable:false,
		width:700,
		height:420,
// plain:true,
		closable: false ,
		/* autoScroll:true, */
		modal:true,
		layout: 'fit',
		title:'添加集群基站',
		iconCls:'add',
		items:Panel,
		closeAction:'close',
		buttons:[
		         {text:'保存',
		        	 iconCls:'save',
		        	 id:'saveBtn',
		        	 handler: function() {
		        	 var form=addForm.getForm(); 
		        	 var myMask = new Ext.LoadMask(Ext.getBody(), {  
	                     msg: '正在验证权限，请稍后！',  
	                     // loadMask: true,
	                     removeMask: true // 完成后移除
	                 });
					 
		        	 if(form.isValid()){
		        		 if(!isAddMany)
		        		 {
		        		 if(form.findField('id').getValue()==null){
		        			 Ext.MessageBox.show({  
	        					 title : "提示",  
	        					 msg :'标示不能为空' , 
	        					 icon: Ext.MessageBox.ERROR
	        				 });
		        			 return ;
		        		 }
		        		 }else{
		        			 if(form.findField('idStart').getValue()==null || form.findField('idEnd').getValue()==null){
			        			 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg :'标示范围不能为空' , 
		        					 icon: Ext.MessageBox.ERROR
		        				 });
			        			 return ;
			        		 }
		        			 if(form.findField('idStart').getValue()>=form.findField('idEnd').getValue()){
		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg :'标示范围不正确' , 
		        					 icon: Ext.MessageBox.ERROR
		        				 });
			        			 return ;
		        			 }
		        			 if(form.findField('idEnd').getValue()-form.findField('idStart').getValue()>100){
		        				 Ext.MessageBox.show({  
		        					 title : "提示",  
		        					 msg :'批量添加最多一次添加数据不能超过100条' , 
		        					 icon: Ext.MessageBox.ERROR
		        				 });
			        			 return ;
		        			 }
		        		 }
		        		 myMask.show();
		        		 Ext.getCmp('saveBtn').disable();
		        		 if(isAddMany){
		        			 var timeout=setInterval(function(){
		        					
		        					if(flag==0){
		        					 flag=1;
		        					if(i<=form.findField('idEnd').getValue()-form.findField('idStart').getValue()){
		        						Run(form,form.findField('idStart').getValue()+i)
		        						i++;
		        						
		        					}else{
		        						clearInterval(timeout);
		        						Ext.MessageBox.show({  
		        							title : "提示",  
		        							msg : "<p>一共执行"+i+"次</p> <p>成功"+successfully+"个</p> <p>失败"+error+"个</p>" , 
		        							icon: Ext.MessageBox.INFO 
		        						});
		        						///tellCenter();
		        						Ext.getCmp('saveBtn').enable();
		        						myMask.hide();
		        						i=0;flag=0;successfully=0;error=0;
		        						
		        						
		        					}
		        					}
		        					
		        			}, 100);  // 每隔 1秒钟
		        	
		        		 }else{
		        			 addRun(form,myMask);
		        			 Ext.getCmp('saveBtn').enable();
		        		 }
		        	
		        	 }

		         } },
		         {text:'重置',
		        	 iconCls:'reset',
		        	 handler: function(){
		        	 addForm.form.reset();
		         }},{
		        	 text:'取消',
		        	 iconCls:'cancel',
		        	 handler:function(){
		        	 addForm.form.reset();
		        	 addWindow.hide();
		         }
		         }
		         ]

	});
	}
	addWindow.show();
	/* addWindow.maximize(); */
	// store.insert(0,new User());
}
function Run(form,id){
	if(addRunMany(form,id)){
		Ext.example.msg("提示","标示 ["+id+"]添加成功");
		successfully++;
		flag=0;
	}else{
		Ext.example.msg("错误提示","标示 ["+id+"]添加失败");
		error++;
		flag=0;
	}
}
function addRun(form,mask){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addBsStation.action',  
				 params : {
				 id:form.findField('id').getValue(),
				 sysidcode:form.findField('sysidcode').getValue(),
				 colorcode:form.findField('colorcode').getValue(),
				 sleepen:form.findField('sleepen').getValue()?1:0,
				 ip:form.findField('ip').getValue(),
				 startwatchdog:form.findField('startwatchdog').getValue()?1:0,
				 channelno:form.findField('channelno').getValue(),
				 slot0authority:form.findField('slot0authority').getValue(),
				 slot1authority:form.findField('slot1authority').getValue(),
				 aietype:form.findField('aietype').getValue(),
				 up:form.findField('up').getValue(),
				 mask:form.findField('mask').getValue(),
				 sf:form.findField('sf').getValue(),
				 wt:form.findField('wt').getValue(),
				 reg:form.findField('reg').getValue()['reg'],
				 backoff:form.findField('backoff').getValue(),
			        /* form.findField('np').getValue(), */
				 name:form.findField('name').getValue(),
				/* rf_transmit_en:form.findField('rf_transmit_en').getValue()?1:0,*/
				 rf_receive_en:form.findField('rf_receive_en').getValue()?1:0,
				offlinech:form.findField('offlinech').getValue(),
	        	aduiorecvport:form.findField('aduiorecvport').getValue(),
	        	offlinerepeaten:form.findField('offlinerepeaten').getValue()?1:0,
	        	admode:form.findField('admode').getValue()?1:0,
	        	wan_en:form.findField('wan_en').getValue()?1:0	,	
	        	wan_centerip:form.findField('wan_centerip').getValue(),
	        	wan_centerport:form.findField('wan_centerport').getValue(),
	        	wan_switchip:form.findField('wan_switchip').getValue(),
	        	wan_switchport:form.findField('wan_switchport').getValue(),
	        	 issimulcast:form.findField('issimulcast').getValue()?1:0,
	        	gpsnum_delay:form.findField('gpsnum_delay').getValue(),
			    gpsunlock_worken:form.findField('gpsunlock_worken').getValue()?1:0	,
			   mcsrcen:form.findField('mcsrcen').getValue()?1:0,
			   msodisconn_worken:form.findField('msodisconn_worken').getValue()?1:0	,
			 bsdisconn_worken:form.findField('bsdisconn_worken').getValue()?1:0				    	
				 
			 },  
			 method : 'POST',
			 success : function(response, opts) {  
				 var rs = Ext.decode(response.responseText); 
				 mask.hide();
				 if(rs.success)
				 {
				 form.reset();		        				
				 Ext.example.msg("提示",rs.message)
				
	        	 addWindow.hide();
				 store.reload();
				// tellCenter();
				 }
				 else
				 {
					 Ext.MessageBox.show({  
    					 title : "提示",  
    					 msg :rs.message , 
    					 icon: Ext.MessageBox.INFO  
    				 }); 
				 }
			 },

			 failure: function(response) {
				 mask.hide();
				 Ext.MessageBox.show({  
					 title : "提示",  
					 msg : "数据添加失败!" , 
					 icon: Ext.MessageBox.INFO  
				 }); 
			 }  
			 })); 
}
function addRunMany(form,id){
	 form.submit(			 
			 Ext.Ajax.request({  
				 url : '../controller/addBsStation.action',  
				 params : {
				 id:id,
				 sysidcode:form.findField('sysidcode').getValue(),
				 colorcode:form.findField('colorcode').getValue(),
				 sleepen:form.findField('sleepen').getValue()?1:0,
				 ip:form.findField('ip').getValue(),
				 startwatchdog:form.findField('startwatchdog').getValue()?1:0,
				 channelno:form.findField('channelno').getValue(),
				 slot0authority:form.findField('slot0authority').getValue(),
				 slot1authority:form.findField('slot1authority').getValue(),
				 aietype:form.findField('aietype').getValue(),
				 up:form.findField('up').getValue(),
				 mask:form.findField('mask').getValue(),
				 sf:form.findField('sf').getValue(),
				 wt:form.findField('wt').getValue(),
				 reg:form.findField('reg').getValue()['reg'],
				 backoff:form.findField('backoff').getValue(),
			        /* form.findField('np').getValue(), */
				 name:form.findField('name').getValue()+id,
				/* rf_transmit_en:form.findField('rf_transmit_en').getValue()?1:0,*/
				 rf_receive_en:form.findField('rf_receive_en').getValue()?1:0,
				offlinech:form.findField('offlinech').getValue(),
	        	aduiorecvport:form.findField('aduiorecvport').getValue(),
	        	offlinerepeaten:form.findField('offlinerepeaten').getValue()?1:0,
	        	admode:form.findField('admode').getValue()?1:0,
	        	wan_en:form.findField('wan_en').getValue()?1:0,	
	        	wan_centerip:form.findField('wan_centerip').getValue(),
	        	wan_centerport:form.findField('wan_centerport').getValue(),
	        	wan_switchip:form.findField('wan_switchip').getValue(),
	        	wan_switchport:form.findField('wan_switchport').getValue(),
	        	 issimulcast:form.findField('issimulcast').getValue()?1:0,
	        	gpsnum_delay:form.findField('gpsnum_delay').getValue(),
			    gpsunlock_worken:form.findField('gpsunlock_worken').getValue()?1:0,
			    		  mcsrcen:form.findField('mcsrcen').getValue()?1:0,
			        			   msodisconn_worken:form.findField('msodisconn_worken').getValue()?1:0	,
			        			   bsdisconn_worken:form.findField('bsdisconn_worken').getValue()?1:0	

				 
			 },  
			 method : 'POST',
			 waitTitle : '请等待' ,  
			 waitMsg: '正在提交中', 
			 async:false,
			 success : function(response, opts) {  
				 var rs = Ext.decode(response.responseText); 
				 if(rs.success)
				 {
				 success=true;
				 store.reload();
				 addWindow.hide();
				 }
				 else
				 {
					 success=false;
					 
				 }
			 },

			 failure: function(response) {

				 success=false;
				
			 }  
			 })); 
	 return success;
}
// 通知中心
function tellCenter(){
	Ext.Ajax.request({  
		url : '../controller/tellCenter.action',  
		params : {  
		table:'basestation'
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		/* alert("success") */

	},
	failure: function(response) {
	}  
	}); 
}
// 设置radiogroup的值
function setRadioChecked(record){
	/*
	 * Ext.getCmp('sleepen').down('radio').setValue(record.get('sleepen'));
	 * Ext.getCmp('startwatchdog').down('radio').setValue(record.get('startwatchdog')?1:0);
	 * Ext.getCmp('reg').down('radio').setValue(record.get('reg'));
	 * Ext.getCmp('rf_transmit_en').down('radio').setValue(record.get('rf_transmit_en'));
	 * Ext.getCmp('rf_receive_en').down('radio').setValue(record.get('rf_receive_en'));
	 */
}