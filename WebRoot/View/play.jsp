
<%@ page contentType="text/html;charset=gb2312"%> 

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
  <head>
    <base href="<%=basePath%>">   
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
  </head>
<style>
html,body{padding:0; margin:0}
</style>
<body>
<%
String wavPath=request.getParameter("playerID");
//wavPath="wav/Ring.wav";
 %>
<object id="player" height="180" width="400" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" title="双击播放器屏幕可以全屏">
<embed src="<%=wavPath %>" autoold=true loop=1 hidden=false 
 type="audio/x-wav" height=200 width=340 controls=smallconsole palette="#FF7F50" align="middle"></embed>
<param NAME="AutoStart" VALUE="1">
<!--是否自动播放-->
<param NAME="Balance" VALUE="0">
<!--调整左右声道平衡,同上面旧播放器代码-->
<param name="enabled" value="1">
<!--播放器是否可人为控制-->
<param NAME="EnableContextMenu" VALUE="1">
<!--是否启用上下文菜单-->
<param NAME="url" VALUE="<%=wavPath %>">
<!--播放的文件地址-->
<param NAME="PlayCount" VALUE="1">
<!--播放次数控制,为整数-->
<param name="rate" value="1">
<!--播放速率控制,1为正常,允许小数,1.0-2.0-->
<param name="currentPosition" value="0">
<!--控件设置:当前位置-->
<param name="currentMarker" value="0">
<!--控件设置:当前标记-->
<param name="defaultFrame" value="1">
<!--显示默认框架-->
<param name="invokeURLs" value="0">
<!--脚本命令设置:是否调用URL-->
<param name="baseURL" value="">
<!--脚本命令设置:被调用的URL-->
<param name="stretchToFit" value="1">
<!--是否按比例伸展-->
<param name="volume" value="50">
<!--默认声音大小0%-100%,50则为50%-->
<param name="mute" value="0">
<!--是否静音-->
<param name="uiMode" value="Full">
<!--播放器显示模式:Full显示全部;mini最简化;None不显示播放控制,只显示视频窗口;invisible全部不显示-->
<param name="windowlessVideo" value="0">
<!--如果是0可以允许全屏,否则只能在窗口中查看-->
<param name="fullScreen" value="0">
<!--开始播放是否自动全屏-->
<param name="enableErrorDialogs" value="-1">
<!--是否启用错误提示报告-->
<param name="SAMIStyle" value="1">
<!--SAMI样式-->
<param name="SAMILang" value="1">
<!--SAMI语言-->
<param name="SAMIFilename" value="1">
<!--字幕ID-->
<param name="ShowStatusBar" value="1">
</object>

</body>
</html>
