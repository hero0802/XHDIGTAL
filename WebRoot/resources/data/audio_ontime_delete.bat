@echo off
::��ʾ��ɾ��ָ��·����ָ������֮ǰ�����ļ������а����������ַ���Ϊ׼�����ļ��С�
::�����ʾ������󣬰�rdǰ���echoȥ��������ʵ������ɾ����
::���������ļ������а����������ַ��������磺20091225��

rem ָ����ɾ���ļ��еĴ��·��
set SrcDir=d:/wamp/www/wav
rem ָ������
set DaysAgo=90
>"%temp%/DstDate.vbs" echo LastDate=date()-%DaysAgo%
>>"%temp%/DstDate.vbs" echo FmtDate=right(year(LastDate),4) ^& right("0" ^& month(LastDate),2) ^& right("0" ^& day(LastDate),2)
>>"%temp%/DstDate.vbs" echo wscript.echo FmtDate
for /f %%a in ('cscript /nologo "%temp%/DstDate.vbs"') do (
  set "DstDate=%%a"
)
set DstDate=%DstDate:~0,4%%DstDate:~4,2%%DstDate:~6,2%

setlocal enabledelayedexpansion
for /d  %%a in ("%SrcDir%/*.*") do (
  if "%%~na" leq "%DstDate%" (
        if exist "%SrcDir%/%%~na/" (
            rd /s /q "%SrcDir%/%%~na"
        )
    )
  )
)
endlocal