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
var isAddMany=false
checkUserPower();
// 创建Model
Ext.define('radiouser',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'np'},
	        {name: 'type'},
	        {name: 'regstatus'},
	        {name: 'authoritystatus'},
	        {name: 'name'},
	        {name: 'stun_group'}
	        ], 
	        idProperty : 'id'
});
// 创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
// 设置分页大小
	pageSize:100,
	proxy: {
	type: 'ajax',
	url : '../data/radioUser.action',
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
var addstore=Ext.create('Ext.data.Store',{
//	mscId,issi,gssi,groupname,attached,cou,operation,status
	fields:[{name:'id'},{name:'name'},{name: 'authoritystatus'}],
	autoLoad:true,
	data:[]
})
var searchAction=Ext.create('Ext.Action',{
	text:'查询',
	iconCls:'search',
	tooltip:'查询',
    handler:function(){store.loadPage(1);}
});
var stunAction=Ext.create('Ext.Action',{
	iconCls:'start',
	text:'遥晕',
	tooltip:'遥晕',
	disabled:stunRadio?false:true,
	handler:stun
});
var reviveAction=Ext.create('Ext.Action',{
	iconCls:'start',
	text:'复活',
	tooltip:'复活',
	disabled:reviveRadio?false:true,
	handler:revive
});
var killAction=Ext.create('Ext.Action',{
	iconCls:'start',
	text:'遥毙',
	tooltip:'遥毙',
	disabled:killRadio?false:true,
	handler:killRadio
});
 // 创建多选
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建grid
var grid
if(!grid)
{ grid=Ext.create('Ext.grid.Panel',{
	title:'当前位置:终端信息>>遥晕遥毙',
	iconCls:'icon-location',
	region:'west',
	width:800,
	store:store,
	trackMouseOver: false,
	renderTo: Ext.getBody(),
	disableSelection: false,
	
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "用户ID", width:100, dataIndex: 'id', sortable: true
	         },{text: "名称", width:150, dataIndex: 'name', sortable: false
	         },{text: "类型", width:60, dataIndex: 'type', sortable: false,
	        	 renderer:function(v){
	        	 if(v==0){return "移动台";}
	        	 else if(v==1){return "车载台";}
	        	 else if(v==2){return "调度台";}
	        	 else{return "未知";}
	         }
	         },{text: "用户状态", width:70, dataIndex: 'authoritystatus', sortable: false,
	        	 renderer:function(v){
	        	 if(v==0){return "<span class='badge' style='background:green'>正常</span>"}
	        	 else if(v==1){return "<span class='badge' >复活中</span>"}
	        	 else if(v==2){return "<span class='badge' style='background:yellow'>摇晕</span>"}
	        	 else if(v==3){return "<span class='badge'>摇晕中</span>"}
	        	 else if(v==4){return "<span class='badge' style='background:red'>摇毙</span>"}
	        	 else if(v==5){return "<span class='badge' >摇毙中</span>"}
	        	 else{return "<span>未知</span>"}
	         }
	         },{text: "遥晕组", width:150, dataIndex: 'stun_group', sortable: false
	         },{text: "用户激活", width:70, dataIndex: 'regstatus', sortable: false,
	        	 renderer:function(v){
	        	 if(v){return "<span><img src='../resources/images/picture/true.png'/></span>"}
	        	 else{return "<span><img src='../resources/images/picture/false.png'/></span>"}
	         }
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
	             loadMask: false,  
	             listeners: {
	                 itemcontextmenu: function(view, rec, node, index, e) {
	                     e.stopEvent();
	                     contextMenu.showAt(e.getXY());
	                     return false;
	                 }
	             }
	         },

	         emptyText:'<span>对不起，没有查询到数据</span>',
	        
	         dockedItems: [{
	        	 dock: 'top',
	             xtype: 'toolbar',
	             items:[{fieldLabel:'用户ID',xtype:'textfield',name:'id',id:'id',labelWidth: 60,width:180,emptyText:'用户ID' },	                    
	                    {fieldLabel:'用户名称',xtype:'textfield',name:'name',id:'name',labelWidth:60,width:180,emptyText:'用户名称'},    
	                    {
	    	 				xtype:'combobox',fieldLabel:'用户状态',id:'authoritystatus',name:'authoritystatus',labelWidth:60,
	    		    		store:[
	    		    		       [10,"不限制"],[0,"正常"],[1,"复活中"],[2,"遥晕"],[3,"遥晕中"]],
	    		    		queryMode:'local',value:10,width:150
	    				}, searchAction,'-',{
	               			  text:'清除',
	               			  iconCls:'clear',
	               			  tooltip:'清除输入的查询数据',
	               			  handler: function(){
	               			  Ext.getCmp("id").reset();
	               			  Ext.getCmp("name").reset();
	               		  }}]
	         },{
	             dock: 'top',
	             xtype: 'pagingtoolbar',
	             // style:'background: skyblue',
	             store: store, 
	          	 displayInfo: true
	          	
	         },{
	             dock: 'right',
	             xtype: 'toolbar',
	             items:[{
	            	 xtype:"button",
	            	 iconCls:'add',
	            	 margin:'200 0 0 0',
	            	 text:'添加至右侧',
	            	 handler:toRight
	             }]
	          	
	         }]

})
};
var  moveBtn=Ext.create('Ext.panel.Panel',{
	    region:'east',
	    width:200,
	    items:[{
	    	xtype:"button",
	    	text:'右移'
	    },{
	    	xtype:"button",
	    	text:'左移'
	    }]
});
var  rightGrid=Ext.create('Ext.grid.Panel',{
	title:'等待处理的手台',
	region:'center',
	store:addstore,
	trackMouseOver: false,
	disableSelection: false,
	margin:'0 0 0 30',
	columns:[
	        /* new Ext.grid.RowNumberer({width:50,text:'#'}), */
	         {text: "用户ID", width:100, dataIndex: 'id', sortable: true,
	        	 renderer : function(v){
	        	 return"<a href='#' onclick=update_btn() title='详细信息' style='color:blue'>"+v+"</a>";
	         }
	         },{text: "名称", width:150, dataIndex: 'name', sortable: false
	         },{text: "操作", width:150, dataIndex: 'id',renderer:function(value, metaData, record, rowIndex, colIndex, store){
	        	 return "<a href='#' onclick='delStore("+rowIndex+")'>删除</a>";
	         }
	         }
	         ],
	         frame:false,
	         border:true,
	         forceFit: false,
	         columnLines : true, 
	         height:document.documentElement.clientHeight,
	         viewConfig: {
	             stripeRows: true,
	             loadMask: false
	         },
	         /*selModel: Ext.create('Ext.selection.CheckboxModel'),*/
	         emptyText:'<span>没有数据</span>',
	        
	         dockedItems: [{
	             dock: 'top',
	             xtype: 'toolbar',
	             items:[{xtype:'numberfield', fieldLabel:'时隙',id:'slot',minValue:0,maxValue:1,value:0,labelWidth:40,width:100}]
	          	
	         },{
	             dock: 'right',
	             xtype: 'toolbar',
	             items:[{
          			  text:'清空',
           			  iconCls:'clear',
           			  tooltip:'清除所有数据',
           			  handler: function(){
           			  addstore.reload()           		  }},stunAction,reviveAction/*,killAction*/]
	          	
	         }]

});
store.on('beforeload', function (store, options) {  
    var new_params = { 
    		id: Ext.getCmp('id').getValue(),
    		name: Ext.getCmp('name').getValue(),
    		authoritystatus: Ext.getCmp('authoritystatus').getValue()
    		};  
    Ext.apply(store.proxy.extraParams, new_params);  

});
//显示表格
Ext.QuickTips.init(); 
// 禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
	new Ext.Viewport({
	layout:"border",	
	items:[grid,rightGrid]
     })
	store.load({params:{start:0,limit:100}}); 
});
//摇晕对讲机
function stun(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在验证数据，请稍后！',  
        loadMask: true,
        removeMask: true // 完成后移除
    });
	if (addstore.getCount()<1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没选择手台!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	
	else
	{ 
		Ext.Msg.confirm("请确认", "是否真的要遥晕对讲机", function(button, text) {  
			if (button == "yes") { 
				 myMask.show();
				var mscIds=[];
				addstore.each(function(record){
					var bsid=record.get('id');
					if(bsid){mscIds.push(bsid);}				
				}); 
				
	
	Ext.Ajax.request({  
		url : '../controller/stunRadio.action',  
		params : {  
		mscIds: mscIds.join(','),
		slot:Ext.getCmp('slot').getValue()
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		myMask.hide();
		// 当后台数据同步成功时
		if(rs.success)
		{
			
			 Ext.example.msg("提示","摇晕执行成功");
			 store.reload();
		}
		else
		{
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "执行错误" , 
				icon: Ext.MessageBox.ERROR  
			}); 
		}

	},
	failure: function(response) {
		myMask.hide();
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "响应服务器失败" , 
			icon: Ext.MessageBox.ERROR  
		});}  
	}); 
			}})
	}
}
// 复活对讲机
function revive(){
	if (addstore.getCount()<1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没选择手台!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	}
	
	else
	{ 	console.log(addstore.getCount());
		Ext.Msg.confirm("请确认", "是否真的要复活对讲机", function(button, text) {  
			if (button == "yes") { 	
				var mscIds=[];
				addstore.each(function(record){
					var bsid=record.get('id');
					if(bsid){mscIds.push(bsid);}
				
				}); 
	
	Ext.Ajax.request({  
		url : '../controller/reviveRadio.action',  
		params : {  
		mscIds:mscIds.join(','),
		slot:Ext.getCmp('slot').getValue()
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			 store.reload();
			 Ext.example.msg("提示","复活执行成功");
		}
		else
		{
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "执行错误" , 
				icon: Ext.MessageBox.ERROR  
			}); 
		}

	},
	failure: function(response) {

		Ext.MessageBox.show({  
			title : "提示",  
			msg : "响应服务器失败" , 
			icon: Ext.MessageBox.ERROR  
		});}  
	});
			}})
	}
}
// 摇毙对讲机
function killRadio(){
	if (addstore.getCount()<1) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "你还没选择手台!" , 
			icon: Ext.MessageBox.ERROR  
		});  
		return;  
	} 
	else
	{ 
		Ext.Msg.confirm("请确认", "是否真的要遥毙对讲机", function(button, text) {  
			if (button == "yes") { 
	// data = grid.getSelectionModel().getLastSelected();
	var mscIds=[];
	addstore.each(function(record){
		var bsid=record.get('id');
		if(bsid){mscIds.push(bsid);}
	
	}); 
	Ext.Ajax.request({  
		url : '../controller/killRadio.action',  
		params : {  
		mscIds: mscIds.join(',')
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		// 当后台数据同步成功时
		if(rs.success)
		{
			 store.reload();
			 Ext.example.msg("提示","摇毙执行成功");
		}
		else
		{
			Ext.MessageBox.show({  
				title : "提示",  
				msg : "执行错误" , 
				icon: Ext.MessageBox.ERROR  
			}); 
		}

	},
	failure: function(response) {

		Ext.MessageBox.show({  
			title : "提示",  
			msg : "响应服务器失败" , 
			icon: Ext.MessageBox.ERROR  
		});}  
	});
			}})
	}
}
//添加到右侧
function  toRight(){
	var data = grid.getSelectionModel().getSelection(); 
	if (data.length == 0) {  
		Ext.MessageBox.show({  
			title : "提示",  
			msg : "请先选择您要操作的手台!" , 
			icon: Ext.MessageBox.INFO 
		});  
		return;  
	}else{
		Ext.Array.each(data, function(record) {  
			var userId=record.get('id'); 
			var userName=record.get('name'); 
			var tag=false;
			addstore.each(function(record){
				if(record.get('id')==userId){
					tag=true;
				}
			});
			if(!tag){
				addstore.addSorted({id:userId,name:userName});
			}else{
				tag=false;
			}

		}); 
	}
}
//删除store
function delStore(index){
	addstore.remove(addstore.getAt(index));
}