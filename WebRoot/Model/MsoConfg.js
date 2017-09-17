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
checkUserPower();
//创建Model
Ext.define('radiouser',{
	extend:'Ext.data.Model',
	fields:[
	        {name: 'id'},
	        {name: 'np'},
	        {name: 'msoip'},
	        {name: 'mso_domainname'},
	        {name: 'msoip_vt1'},
	        {name: 'msoip_vt2'},
	        {name: 'port'},
	        {name: 'swip'},
	        {name: 'unified_caller_number'},
	        {name: 'swport'},
	        {name: 'swip_vt1'},
	        {name: 'swip_vt2'},
	        {name: 'recordip'},
	        {name: 'recordport'},
	        {name: 'audioconvertorip'},
	        {name: 'monitorip'},
	        {name: 'monitorport'},
	        {name: 'msogateip'},
	        {name: 'msogateport'},
	        {name: 'applicationip'},
	        {name: 'applicationport'},
	        {name: 'tsccswitch_time'},
	        {name: 'max_meet_time'},
	        {name: 'max_ptton_time'},
	        {name: 'max_pttoff_time'},
	        {name: 'max_ptton_novoice_time'},
	        {name: 'max_gcall_waittime'},
	        {name: 'max_icall_waittime'},
	        {name: 'max_queen_length'},
	        {name: 'max_queen_waittime'},
	        {name: 'pttoff_slotdelay_time'},
	        {name: 'deactive_slotdelay_time'},
	        {name: 'bs_reconn_center_time'},
	        {name: 'voice_cache_num'},
	        {name: 'groupcallmode'},
	        {name: 'interfere_sampling_period'},
	        {name: 'adv_authen'},
	        {name: 'aucip'},
	        {name: 'aucport'},
	        {name: 'issimulcast'},
	        {name: 'multicastip'},
	        {name: 'multicastport'},
	        {name: 'wait_rssi_time'},
	        {name: 'rssil1_threshold'},
	        {name: 'rssidiffl1_reselect'},
	        {name: 'rssil2_threshold'},
	        {name: 'rssidiffl2_reselect'},
	        {name: 'cal_rssi_interval_time'},
	        {name:'unified_caller_number'},
	        {name:'mtuip'},
	        {name:'mtuport'},
	        {name:'key2'},
	        {name:'e2ee_down'},
	        {name:'only_allow_encryptms'}
	        
	        ], 
	        idProperty : 'id'
})
//创建数据源
var store = Ext.create('Ext.data.Store',{
	model:'radiouser',	
	remoteSort: true,
//	设置分页大小
	pageSize:30,
	proxy: {
	type: 'ajax',
	url : '../data/msoConfig.action',
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

 //创建多选 
     var selModel = Ext.create('Ext.selection.CheckboxModel'); 
     var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
	        clicksToEdit: 2
	     }); 
//创建Action
//创建菜单
var updateForm=new Ext.FormPanel({
	/*title:'系统参数配置',*/
	region:'center',
	autoScroll : true,
	bodyStyle : 'overflow-x:hidden; overflow-y:scroll',
	bodyPadding:'10 20 0 20',
	layout:'column',
	frame :false,
	items:[{
		xtype:"panel",
		title:'<span>中心交换设置</span>',
		layout:'form',
		margin: '5',
		bodyPadding:'10',
		width:300,height:180,
		hidden:parseInt(getcookie("groupid"))!=10000,
		/*collapsible : true, // 设置可折叠,
*/		frame:false,
		/*baseCls:'x-fieldset',*/
		/*columnWidth:.20,*/
		items:[{
			xtype:'panel',border:false,layout:'column',
			items:[{
				xtype:'textfield',fieldLabel:'中心IP',name:'msoip',allowBlank: true,
				labelWidth:90,width:200/*,anchor: '20%'*/,margin:'0 40 5 0'
			},{
				xtype:'numberfield',fieldLabel:'中心端口',name:'port',
				labelWidth:90,width:200,margin:'0 40 5 0',minValue:0,value:'12000'
			},{
				xtype:'textfield',fieldLabel:'交换IP',name:'swip',
				labelWidth:90,width:200,margin:'0 40 5 0'
			},{
				xtype:'numberfield',fieldLabel:'交换端口',name:'swport',
				labelWidth:90,width:200,margin:'0 40 5 0',minValue:0,value:'12001'
			},{
				xtype:'textfield',fieldLabel:'虚拟IP1',name:'msoip_vt1',
				labelWidth:70,width:180,margin:'0 40 5 0',hidden:true
			},{
				xtype:'textfield',fieldLabel:'虚拟IP2',name:'msoip_vt2',
				labelWidth:70,width:180,margin:'0 40 5 0',hidden:true
			},{
				xtype:'textfield',fieldLabel:'监控IP',name:'monitorip',
				labelWidth:70,width:180,margin:'0 40 5 0',hidden:true
			},{
				xtype:'numberfield',fieldLabel:'监控端口',name:'monitorport',
				labelWidth:70,width:180,margin:'0 40 5 0',hidden:true,minValue:0
			}]
		}]},{
		    xtype:"panel",
			title:'组播设置',
			frame:false,
			width:300,height:180,
			margin: '5',
			hidden:parseInt(getcookie("groupid"))!=10000,
			/*collapsible : true, */// 设置可折叠,
			bodyPadding:'10',
			layout:'form',
			items:[{
				xtype:'panel',border:false,layout:'column',
				items:[{
					xtype:'textfield',fieldLabel:'组播IP',name:'multicastip',
					labelWidth:100,width:250,margin:'0 40 5 0',minValue:0,value:'224.1.2.3'
                },{
	                xtype:'numberfield',fieldLabel:'组播端口',name:'multicastport',           
	                labelWidth:100,width:250,margin:'0 40 5 0',minValue:0,value:'5000'
                }]
			}]},{
				xtype:"panel",
				title:'音频设置',
				hidden:parseInt(getcookie("groupid"))!=10000,
				width:300,height:180,
				/*collapsible : true, */// 设置可折叠,
				frame:false,
				margin: '5',
				bodyPadding:'10',
				layout:'form',
				items:[{
					xtype:'panel',border:false,layout:'column',
					items:[{
						xtype:'textfield',fieldLabel:'虚拟IP1',name:'swip_vt1',
						labelWidth:90,width:200,margin:'0 40 5 0',hidden:true
					},{
						xtype:'textfield',fieldLabel:'虚拟IP2',name:'swip_vt2',
						labelWidth:90,width:200,margin:'0 40 5 0',hidden:true
					},{
						xtype:'textfield',fieldLabel:'录音服务IP',name:'recordip',
						labelWidth:90,width:200,margin:'0 40 5 0'
					},{
						xtype:'numberfield',fieldLabel:'录音服务端口',name:'recordport',
						labelWidth:90,width:200,margin:'0 40 5 0',minValue:0
					},{
						xtype:'textfield',fieldLabel:'音频转换IP',name:'audioconvertorip',
						labelWidth:90,width:200,margin:'0 40 5 0'
					}]
				}]},{
			    xtype:"panel",
				title:'联网设置',
				frame:false,
				hidden:parseInt(getcookie("groupid"))!=10000,
				width:300,height:180,
				margin: '5',
				/*collapsible : true,*/ // 设置可折叠,
				bodyPadding:'10',
				layout:'form',
				items:[{
					xtype:'panel',border:false,layout:'column',
					items:[{
						xtype:'textfield',fieldLabel:'联网网关IP<span style="color:red"></span>',name:'msogateip',allowBlank: true,
						labelWidth:100,width:200,margin:'0 40 5 0'
					},{
						xtype:'numberfield',fieldLabel:'联网网关端口',name:'msogateport',
						labelWidth:100,width:200,margin:'0 40 5 0',minValue:0
					},{
						xtype:'textfield',fieldLabel:'应用网关IP',name:'applicationip',
						labelWidth:100,width:200,margin:'0 40 5 0'
					},{
						xtype:'numberfield',fieldLabel:'应用网关端口',name:'applicationport',
						labelWidth:100,width:200,margin:'0 40 5 0',minValue:0
					}]
				}]},{
				    xtype:"panel",
					title:'PTT设置',
					frame:false,
					hidden:parseInt(getcookie("groupid"))!=10000,
					width:300,height:180,
					margin: '5',
					/*collapsible : true, */// 设置可折叠,
					bodyPadding:'10',
					layout:'form',
					items:[{
						xtype:'panel',border:false,layout:'column',
						items:[{
							xtype:'numberfield',fieldLabel:'Ptt静默时长(s)',name:'max_pttoff_time',
							labelWidth:150,emptyText:'单位：s',width:250,margin:'0 40 5 0',minValue:0,value:'10'
		                },{
			                xtype:'numberfield',fieldLabel:'PTT_ON超时时长(ms)',name:'max_ptton_novoice_time',           
			                labelWidth:150,emptyText:'单位：ms',width:250,margin:'0 40 5 0',minValue:0,value:'1200'
		                },{
			                xtype:'numberfield',fieldLabel:'Ptt时隙延迟时长(ms)',name:'pttoff_slotdelay_time',           
			                labelWidth:150,emptyText:'单位：ms',width:250,margin:'0 40 5 0',minValue:0,value:'200'
		                }]
					}]},{
					    xtype:"panel",
						title:'呼叫限制',
						frame:false,
						hidden:parseInt(getcookie("groupid"))!=10000,
						width:300,height:180,
						margin: '5',
						/*collapsible : true, */// 设置可折叠,
						bodyPadding:'10',
						layout:'form',
						items:[{
							xtype:'panel',border:false,layout:'column',
							items:[{
								xtype:'numberfield',fieldLabel:'最大通话时长(s)',name:'max_meet_time',
								labelWidth:150,emptyText:'单位：s',width:250,margin:'0 40 5 0',minValue:0,value:'300'
							},{
								xtype:'numberfield',fieldLabel:'单次呼叫时长(s)',name:'max_ptton_time',
								labelWidth:150,emptyText:'单位：s',width:250,margin:'0 40 5 0',minValue:0
							},{
				                xtype:'numberfield',fieldLabel:'组呼最大等待时长(s)',name:'max_gcall_waittime',           
				                labelWidth:150,emptyText:'单位：s',width:250,margin:'0 40 5 0',minValue:0,value:'10'
			                },{
				                xtype:'numberfield',fieldLabel:'单呼最大等待时长(s)',name:'max_icall_waittime',           
				                labelWidth:150,emptyText:'单位：s',width:250,margin:'0 40 5 0',minValue:0,value:'10'
			                }]
						}]},{
						    xtype:"panel",
							title:'场强设置',
							frame:false,
							width:300,height:180,
							hidden:parseInt(getcookie("groupid"))!=10000,
							margin: '5',
							/*collapsible : true,*/ // 设置可折叠,
							bodyPadding:'10',
							layout:'form',
							items:[{
								xtype:'panel',border:false,layout:'column',
								items:[{
									xtype:'numberfield',fieldLabel:'一级门限[dBm]',name:'rssil1_threshold',
									labelWidth:100,emptyText:'单位：dBm',width:170,margin:'2',minValue:0,value:'80'
							    },{
									xtype:'numberfield',fieldLabel:'分辨率',name:'rssidiffl1_reselect',
									labelWidth:50,emptyText:'单位：dBm',width:100,margin:'2',minValue:0,value:'5'
							    },{
									xtype:'numberfield',fieldLabel:'二级门限[dBm]',name:'rssil2_threshold',
									labelWidth:100,emptyText:'单位：dBm',width:170,margin:'2',minValue:0,value:'100'
							    },{
									xtype:'numberfield',fieldLabel:'分辨率',name:'rssidiffl2_reselect',
									labelWidth:50,emptyText:'单位：dBm',width:100,margin:'2',minValue:0,value:'2'
							    },{
									xtype:'numberfield',fieldLabel:'首次判选时间(ms)',name:'wait_rssi_time',
									labelWidth:110,emptyText:'单位：ms',width:200,margin:'0 40 5 0',minValue:0,value:'300'
							    },{
					                xtype:'numberfield',fieldLabel:'场强统计周期(s)',name:'cal_rssi_interval_time',           
					                labelWidth:110,emptyText:'[1-10]单位：s',width:200,margin:'0 40 5 0',minValue:0,value:'3'
				                }]
							}]},{
								xtype:"panel",
								title:'时间限制参数',
								margin: '5',
								hidden:parseInt(getcookie("groupid"))!=10000,
								bodyPadding:'10',
								/*collapsible : true,*/ // 设置可折叠,
								frame:false,
								width:300,height:180,
								layout:'form',
								items:[{
									xtype:'panel',border:false,layout:'column',
									items:[{
										xtype:'numberfield',fieldLabel:'TSCC 切换时间间隔(m)',name:'tsccswitch_time',minValue:0,
										labelWidth:150,emptyText:'[为0不切换][单位：m]',width:250,margin:'0 40 5 0',hidden:true
									},{
						                xtype:'numberfield',fieldLabel:'队列最大长度',name:'max_queen_length',           
						                labelWidth:150,width:250,margin:'0 40 5 0',minValue:0,value:'10'
					                },{
						                xtype:'numberfield',fieldLabel:'最大排队等待时长[s]',name:'max_queen_waittime',           
						                labelWidth:150,emptyText:'单位：s',width:250,margin:'0 40 5 0',minValue:0,value:'10'
					                },{
						                xtype:'numberfield',fieldLabel:'去激活时隙延迟时长(ms)',name:'deactive_slotdelay_time',           
						                labelWidth:150,emptyText:'单位：ms',width:250,margin:'0 40 5 0',minValue:0,value:'200'
					                },{
						                xtype:'numberfield',fieldLabel:'基站重连间隔(ms)',name:'bs_reconn_center_time',           
						                labelWidth:150,emptyText:'单位：ms',width:250,margin:'0 40 5 0',minValue:0,value:'3000'
					                }]
								}
		            ]},{
				            	xtype:"panel",
								title:'其他参数',
								margin: '5',
								bodyPadding:'10',
								hidden:parseInt(getcookie("groupid"))!=10000,
								/*collapsible : true,*/ // 设置可折叠,
								frame:false,
								width:300,height:180,
								layout:'form',
								items:[{
									xtype:'panel',border:false,layout:'column',
									items:[{
										xtype:'radiogroup',fieldLabel:'组呼模式',name:'groupcallmode',id:'groupcallmode',labelWidth:60,layout:'column',
										width:300,margin:'0 40 5 0',hidden:true,
										items: [
									            { boxLabel: '静态', name:'groupcallmode', inputValue: '1',checked:true},
									            { boxLabel: '动态', name:'groupcallmode', inputValue: '2'},
									            { boxLabel: '动静态交集', name:'groupcallmode', inputValue: '3'}
									        ]
									},{
										xtype:'checkbox',fieldLabel:'高级鉴权',name:'adv_authen',labelWidth:60,
										width:100,margin:'0 40 5 0',hidden:true
									},{
										xtype:'textfield',fieldLabel:'高级鉴权IP',name:'aucip',
										labelWidth:100,width:200,margin:'0 40 5 0',hidden:true
								},{
									xtype:'numberfield',fieldLabel:'高级鉴权端口',name:'aucport',
									labelWidth:100,width:200,margin:'0 40 5 0',hidden:true,minValue:0
							    },{
									xtype:'textfield',fieldLabel:'NTPServer',name:'multicastip',
									labelWidth:90,width:200,margin:'0 40 5 0',value:'224.1.1.3'
							    },{
									xtype:'numberfield',fieldLabel:'NTP Port',name:'multicastport',
									labelWidth:90,width:200,margin:'0 40 5 0',minValue:0,value:'5000'
							    },{
					                xtype:'numberfield',fieldLabel:'帧缓存数量',name:'voice_cache_num',           
					                labelWidth:90,width:200,margin:'0 40 5 0',minValue:0
				                },{
					                xtype:'numberfield',fieldLabel:'干扰采样周期[ms]',name:'interfere_sampling_period',           
					                labelWidth:110,width:200,margin:'0 40 5 0',minValue:0,value:'5000'
				                }]
								}]},{
									xtype:"panel",
									title:'呼叫配置',
									margin: '5',
									bodyPadding:'10',
									hidden:parseInt(getcookie("groupid"))!=10000,
									/*collapsible : true,*/ // 设置可折叠,
									frame:false,
									width:300,height:180,
									layout:'form',
									items:[{
										xtype:'panel',border:false,layout:'column',
										items:[{
											xtype:'numberfield',fieldLabel:'统一主叫号码',name:'unified_caller_number',minValue:0,
											labelWidth:100,emptyText:'0不转换，非0号码转移',width:250,margin:'0 40 5 0',
										},{
											xtype:'radiogroup',fieldLabel:'工作模式',name:'issimulcast',id:'issimulcast',labelWidth:100,layout:'column',margin:'0 30 0 0',
											items: [
										            { boxLabel: '单播', name:'issimulcast', inputValue: 0,checked: true },
										            { boxLabel: '同播', name:'issimulcast', inputValue: 1,margin:'0 0 0 10'}
										]}]
									}
			            ]},{
							xtype:"panel",
							title:'加密网管',
							hidden:parseInt(getcookie("groupid"))!=10000,
							margin: '5',
							bodyPadding:'10',
							/*collapsible : true,*/ // 设置可折叠,
							frame:false,
							width:300,height:180,
							layout:'form',
							items:[{
								xtype:'panel',border:false,layout:'column',
								items:[{
									xtype:'textfield',fieldLabel:'IP',name:'mtuip',minValue:0,
									labelWidth:50,width:250,margin:'0 40 5 0'
								},{
									xtype:'numberfield',fieldLabel:'端口',name:'mtuport',minValue:0,
									labelWidth:50,width:250,margin:'0 40 5 0'
								}]
							}
	            ]},{
					xtype:"panel",
					title:'语音加密',
					margin: '5',
					bodyPadding:'10',
					/*collapsible : true,*/ // 设置可折叠,
					frame:false,
					width:300,height:180,
					layout:'form',
					items:[{
						xtype:'combobox',fieldLabel:'基站下行加密标志',name:'e2ee_down',id:'e2ee_down',minValue:0,
						labelWidth:110,width:210,margin:'0 40 5 0',/*readOnly:true,*/
						store:[[0,'不加密'],[1,'按上行ID加密'],[2,'key2键值加密'],[3,'与上行加密状态一致']],
						queryMode:'local',value:0
					},{
						xtype:'panel',border:false,layout:'column',
						items:[{
							xtype:'numberfield',fieldLabel:'基站下行加密键值',name:'key2',minValue:0,
							labelWidth:110,width:220,margin:'0 10 5 0'
						},{
							xtype:'button',text:'随机',handler:key2
						}]
					},{
						xtype:'radiogroup',fieldLabel:'基站上行接入条件',name:'only_allow_encryptms',id:'only_allow_encryptms',labelWidth:100,layout:'column',margin:'0 30 0 0',
						items: [
					            { boxLabel: '允许所有手台接入', name:'only_allow_encryptms', inputValue: 0,checked: true },
					            { boxLabel: '仅允许加密手台接入', name:'only_allow_encryptms', inputValue: 1}
					]}
        ]}],
	buttons:[{
		text:'更新参数',
		iconCls:'update',
		allowDepress: true,     //是否允许按钮被按下的状态
	    enableToggle: true,     //是否允许按钮在弹起和按下两种状态中切换
	   /* scale: 'medium',*/
	    /*iconAlign: 'top',*/
	    disabled:updateConfig?false:true,
	    handler:save
	}],
	buttonAlign:'center'
	});

    store.on('load', function (store, options) {  
	if(store.getCount()<1){return;}
	var record=store.getAt(0);
	updateForm.getForm().loadRecord(record) ;
	Ext.getCmp('issimulcast').down('radio').setValue(record.get('issimulcast')?1:0);
	Ext.getCmp('only_allow_encryptms').down('radio').setValue(record.get('only_allow_encryptms')?1:0);
	/*Ext.getCmp('adv_authen').down('radio').setValue(record.get('adv_authen'));only_allow_encryptms
	Ext.getCmp('issimulcast').down('radio').setValue(record.get('issimulcast')?1:0);*/
	/*var modified = store.modified;
	alert(store.modified);*/

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
	items:updateForm
     })
	store.load({params:{start:0,limit:30}}); 
});



//增加、删除，修改功能

//-----------------表单---------------------------------
var updateWindow;
var addWindow;
var ExcelWin;
var record;
//---------------更新数据---------------------------------------
function save(){
	Ext.Msg.confirm("请确认", "系统需要复位重启，确定要更新吗？", function(button, text) {  
		if (button == "yes") { 
		
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {  
        msg: '正在验证数据，请稍后！',  
        //loadMask: true, 
        removeMask: true //完成后移除  
    });
	record = store.getAt(0); 
	var json = [];
    Ext.each(record, function(item) {
	        json.push(item.data);
	  });
    myMask.show();
    var form=updateForm.getForm();
	 Ext.Ajax.request({  
		 url : '../controller/updateMsoConfg.action',  
		 params : {
		 data:Ext.JSON.encode(json),
		 msoip:form.findField('msoip').getValue(),
		 msoip_vt1:form.findField('msoip_vt1').getValue(),
		 msoip_vt2:form.findField('msoip_vt2').getValue(),
		 port:form.findField('port').getValue(),
		 swip:form.findField('swip').getValue(),
		 swport:form.findField('swport').getValue(),
		 swip_vt1:form.findField('swip_vt1').getValue(),
		 swip_vt2:form.findField('swip_vt2').getValue(),
		 recordip:form.findField('recordip').getValue(),
		 recordport:form.findField('recordport').getValue(),
		 audioconvertorip:form.findField('audioconvertorip').getValue(),
		 monitorip:form.findField('monitorip').getValue(),
		 monitorport:form.findField('monitorport').getValue(),
		 msogateip:form.findField('msogateip').getValue(),
		 msogateport:form.findField('msogateport').getValue(),
		 applicationip:form.findField('applicationip').getValue(),
		 applicationport:form.findField('applicationport').getValue(),
		 tsccswitch_time:form.findField('tsccswitch_time').getValue(),
		 max_meet_time:form.findField('max_meet_time').getValue(),
		 max_ptton_time:form.findField('max_ptton_time').getValue(),
		 max_pttoff_time:form.findField('max_pttoff_time').getValue(),
		 max_ptton_novoice_time:form.findField('max_ptton_novoice_time').getValue(),
		 max_gcall_waittime:form.findField('max_gcall_waittime').getValue(),
		 max_icall_waittime:form.findField('max_icall_waittime').getValue(),
		 max_queen_length:form.findField('max_queen_length').getValue(),
		 max_queen_waittime:form.findField('max_queen_waittime').getValue(),
		 pttoff_slotdelay_time:form.findField('pttoff_slotdelay_time').getValue(),
		 deactive_slotdelay_time:form.findField('deactive_slotdelay_time').getValue(),
		 bs_reconn_center_time:form.findField('bs_reconn_center_time').getValue(),
		 voice_cache_num:form.findField('voice_cache_num').getValue(),
		 groupcallmode:form.findField('groupcallmode').getValue()['groupcallmode'],
		 interfere_sampling_period:form.findField('interfere_sampling_period').getValue(),
		 adv_authen:form.findField('adv_authen').getValue()?1:0,
		 aucip:form.findField('aucip').getValue(),
		 aucport:form.findField('aucport').getValue(),
		 issimulcast:form.findField('issimulcast').getValue(),
		 multicastip:form.findField('multicastip').getValue(),
		 multicastport:form.findField('multicastport').getValue(),
		 wait_rssi_time:form.findField('wait_rssi_time').getValue(),
		 rssil1_threshold:form.findField('rssil1_threshold').getValue(),
		 rssidiffl1_reselect:form.findField('rssidiffl1_reselect').getValue(),
		 rssil2_threshold:form.findField('rssil2_threshold').getValue(),
		 rssidiffl2_reselect:form.findField('rssidiffl2_reselect').getValue(),
		 cal_rssi_interval_time:form.findField('cal_rssi_interval_time').getValue(),
		 unified_caller_number:form.findField('unified_caller_number').getValue(),
		 mtuip:form.findField('mtuip').getValue(),
		 mtuport:form.findField('mtuport').getValue(),
		 key2:form.findField('key2').getValue(),
		 e2ee_down:form.findField('e2ee_down').getValue(),
		 only_allow_encryptms:form.findField('only_allow_encryptms').getValue()
	 },  
	 method : 'POST',
	 waitTitle : '请等待' ,  
	 waitMsg: '正在提交中', 
	 
	 
	 success : function(response) { 
		 myMask.hide();
		 var rs = Ext.decode(response.responseText); 
		 if(rs.success)
		 {
//		 updateForm.form.reset();    	  				 
		 Ext.example.msg("提示","修改信息成功");
		 store.load();
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
	 });
	 
		}});
}

function key2(){
	Ext.Ajax.request({  
		url : '../controller/key2.action',  
		params : { 
			//id:id
	},  
	method : 'POST',
	async:false,
    success : function(response, opts) {  
		var rs = Ext.decode(response.responseText); 
		updateForm.getForm().findField('key2').setValue(rs.key2);
		// 当后台数据同步成功时
		/*if(rs.success){
			Ext.example.msg("提示","设置成功");
		}else{
			Ext.example.msg("提示","设置失败");
		}*/

	},
	failure: function(response) {
		//Ext.example.msg("提示","设置失败");
	}  
	}); 
}
function getcookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
};
