
var leftPanel=Ext.create('Ext.Panel',{
	title:'短信',
	width:100,
	region:'west',
	layout:'form',
	items:[{
		xtype:'button',
		margin:'5 0 0 10',
		text:'收件箱',
		handler:function(){
			Ext.get("main-view").dom.src = "../View/recvsms.html"
		}
	},{
		xtype:'button',
		margin:'5 0 0 10',
		text:'发件箱',
		handler:function(){
			Ext.get("main-view").dom.src = "../View/sendsms.html"
		}
	},{
		xtype:'button',
		margin:'5 0 0 10',
		text:'编辑短信',
		handler:function(){
			Ext.get("main-view").dom.src = "../View/writesms.html"
		}
	}]
})
var centerPanel=Ext.create('Ext.Panel',{
	region:'center',
	html : '<iframe id="main-view" name="main-view" scrolling="auto" frameborder="0" width="100%" height="100%" src="../View/recvsms.html"></iframe>'
})

Ext.QuickTips.init();
//禁止整个页面的右键
Ext.getDoc().on("contextmenu", function(e){
      e.stopEvent();
});
Ext.onReady(function(){
 
	var frame=new Ext.Viewport({
	layout:"border",	
	items:[leftPanel,centerPanel]
     })
	frame.show();
	store.load({
		params:{start:0,limit:50},
		callback: function(records, operation, success) {
	        // do something after the load finishes
			a=2;
	    },
	    scope: this
	}); 
});