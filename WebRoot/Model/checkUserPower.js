var updateConfig;
var addBs;
var updateBs;
var delBs;
var addRadioUser;
var updateRadioUser;
var delRadioUser;
var stunRadio;
var reviveRadio;
var killRadio;
var addUserGroup;
var updateUserGroup;
var delUserGroup;
var addWebUser;
var updateWebUser;
var delWebUser;
var editUserPower;
var addWebGroup;
var updateWebGroup;
var delWebGroup;
var editGroupPower;

// 组变量
var updateConfig_g;
var addBs_g;
var updateBs_g;
var delBs_g;
var addRadioUser_g;
var updateRadioUser_g;
var delRadioUser_g;
var stunRadio_g;
var reviveRadio_g;
var killRadio_g;
var addUserGroup_g;
var updateUserGroup_g;
var delUserGroup_g;
var addWebUser_g;
var updateWebUser_g;
var delWebUser_g;
var editUserPower_g;
var addWebGroup_g;
var updateWebGroup_g;
var delWebGroup_g;
var editGroupPower_g;

// 检查文件
/* ************************************************************************** */

function getcookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
}
// 写cookies
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
// 创建数据源
function getRootPath() {
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
}
function checkUserPower() {
	Ext.Ajax.request({
		url : '../controller/userPower.action',
		params : {
			userid : getcookie("userid")
		},
		async : false,
		method : 'POST',
		success : function(response, opts) {
			var rs = Ext.decode(response.responseText);
			updateConfig = rs.updateConfig;
			addBs = rs.addBs;
			updateBs = rs.updateBs;
			delBs = rs.delBs;

			addRadioUser = rs.addRadioUser;
			updateRadioUser = rs.updateRadioUser;
			delRadioUser = rs.delRadioUser;

			stunRadio = rs.stunRadio;
			reviveRadio = rs.reviveRadio;
			killRadio = rs.reviveRadio;

			addUserGroup = rs.addUserGroup;
			updateUserGroup = rs.updateUserGroup;
			delUserGroup = rs.delUserGroup;

			addWebUser = rs.addWebUser;
			updateWebUser = rs.updateWebUser;
			delWebUser = rs.delWebUser;
			editUserPower = rs.editUserPower;

			addWebGroup = rs.addWebGroup;
			updateWebGroup = rs.updateWebGroup;
			delWebGroup = rs.delWebGroup;
			editGroupPower = rs.editGroupPower;

		}
	})
}
// 会员组权限
function checkGroupPower() {
	Ext.Ajax.request({
		url : '../controller/groupPower.action',
		params : {
			groupid : getcookie("groupid")
		},
		async : false,
		method : 'POST',
		success : function(response, opts) {
			var rs = Ext.decode(response.responseText);
			updateConfig_g = rs.updateConfig;
			addBs_g = rs.addBs;
			updateBs_g = rs.updateBs;
			delBs_g = rs.delBs;

			addRadioUser_g = rs.addRadioUser;
			updateRadioUser_g = rs.updateRadioUser;
			delRadioUser_g = rs.delRadioUser;

			stunRadio_g = rs.stunRadio;
			reviveRadio_g = rs.reviveRadio;
			killRadio_g = rs.reviveRadio;

			addUserGroup_g = rs.addUserGroup;
			updateUserGroup_g = rs.updateUserGroup;
			delUserGroup_g = rs.delUserGroup;

			addWebUser_g = rs.addWebUser;
			updateWebUser_g = rs.updateWebUser;
			delWebUser_g = rs.delWebUser;
			editUserPower_g = rs.editUserPower;

			addWebGroup_g = rs.addWebGroup;
			updateWebGroup_g = rs.updateWebGroup;
			delWebGroup_g = rs.delWebGroup;
			editGroupPower_g = rs.editGroupPower;

		}
	})
}
// 会员组权限
function checkSystem() {
	Ext.Ajax.request({
		url : getRootPath() + '/data/lockExists.action',
		params : {},
		async : false,
		method : 'POST',
		success : function(response, opts) {
			var rs = Ext.decode(response.responseText);
			if (rs.success) {

			} else {
				window.location.href = "View/loadData.html";
			}
		}
	})
}
