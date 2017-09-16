@echo off
::演示：删除指定路径下指定天数之前（以文件夹名中包含的日期字符串为准）的文件夹。
::如果演示结果无误，把rd前面的echo去掉，即可实现真正删除。
::本例假设文件夹名中包含的日期字符串（比如：20091225）

rem 指定待删除文件夹的存放路径
set SrcDir=d:/wamp/www/wav
rem 指定天数
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