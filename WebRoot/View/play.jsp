
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
<object id="player" height="180" width="400" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" title="˫����������Ļ����ȫ��">
<embed src="<%=wavPath %>" autoold=true loop=1 hidden=false 
 type="audio/x-wav" height=200 width=340 controls=smallconsole palette="#FF7F50" align="middle"></embed>
<param NAME="AutoStart" VALUE="1">
<!--�Ƿ��Զ�����-->
<param NAME="Balance" VALUE="0">
<!--������������ƽ��,ͬ����ɲ���������-->
<param name="enabled" value="1">
<!--�������Ƿ����Ϊ����-->
<param NAME="EnableContextMenu" VALUE="1">
<!--�Ƿ����������Ĳ˵�-->
<param NAME="url" VALUE="<%=wavPath %>">
<!--���ŵ��ļ���ַ-->
<param NAME="PlayCount" VALUE="1">
<!--���Ŵ�������,Ϊ����-->
<param name="rate" value="1">
<!--�������ʿ���,1Ϊ����,����С��,1.0-2.0-->
<param name="currentPosition" value="0">
<!--�ؼ�����:��ǰλ��-->
<param name="currentMarker" value="0">
<!--�ؼ�����:��ǰ���-->
<param name="defaultFrame" value="1">
<!--��ʾĬ�Ͽ��-->
<param name="invokeURLs" value="0">
<!--�ű���������:�Ƿ����URL-->
<param name="baseURL" value="">
<!--�ű���������:�����õ�URL-->
<param name="stretchToFit" value="1">
<!--�Ƿ񰴱�����չ-->
<param name="volume" value="50">
<!--Ĭ��������С0%-100%,50��Ϊ50%-->
<param name="mute" value="0">
<!--�Ƿ���-->
<param name="uiMode" value="Full">
<!--��������ʾģʽ:Full��ʾȫ��;mini���;None����ʾ���ſ���,ֻ��ʾ��Ƶ����;invisibleȫ������ʾ-->
<param name="windowlessVideo" value="0">
<!--�����0��������ȫ��,����ֻ���ڴ����в鿴-->
<param name="fullScreen" value="0">
<!--��ʼ�����Ƿ��Զ�ȫ��-->
<param name="enableErrorDialogs" value="-1">
<!--�Ƿ����ô�����ʾ����-->
<param name="SAMIStyle" value="1">
<!--SAMI��ʽ-->
<param name="SAMILang" value="1">
<!--SAMI����-->
<param name="SAMIFilename" value="1">
<!--��ĻID-->
<param name="ShowStatusBar" value="1">
</object>

</body>
</html>
