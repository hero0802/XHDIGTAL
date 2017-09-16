package com.action;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.func.WebFun;

public class HtmlData {
	public static String regularGroup(String pattern, String matcher) {
        Pattern p = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(matcher);
        if (m.find()) { // 如果读到
            return m.group();// 返回捕获的数据
        } else {
            return ""; // 否则返回一个空字符串
        }
    }

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		WebFun func=new WebFun();
		// TODO Auto-generated method stub
		String strUrl = "http://www.003782.com/play/jnd28/map.aspx";
		try {
			func.createVoiceFile("D:/apache-tomcat/webapps/XHDIGITAL/resources/wav/html.dat");
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
        try {
            // 创建一个url对象来指向 该网站链接 括号里()装载的是该网站链接的路径
            // 更多可以看看 http://wenku.baidu.com/view/8186caf4f61fb7360b4c6547.html
            URL url = new URL(strUrl);
            // InputStreamReader 是一个输入流读取器 用于将读取的字节转换成字符
            // 更多可以看看 http://blog.sina.com.cn/s/blog_44a05959010004il.html
            InputStreamReader isr = new InputStreamReader(url.openStream(),
                    "utf-8"); // 统一使用utf-8 编码模式
            // 使用 BufferedReader 来读取 InputStreamReader 转换成的字符
            BufferedReader br = new BufferedReader(isr);
            
            String strRead = ""; // 新增一个空字符串strRead来装载 BufferedReader 读取到的内容

            // 定义3个正则 用于匹配我们需要的数据
            String regularDate = "((((1[6-9]|[2-9]\\d)\\d{2})-(1[02]|0?[13578])-([12]\\d|3[01]|0?[1-9]))|(((1[6-9]|[2-9]\\d)\\d{2})-(1[012]|0?[13456789])-([12]\\d|30|0?[1-9]))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(1\\d|2[0-8]|0?[1-9]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))";
            String regularTwoTeam = ">[^<>]*</a>";
            String regularResult = ">(\\d{1,2}-\\d{1,2})</TD>";

            // 创建一个GroupMethod类的对象 gMethod 方便后期调用其类里的 regularGroup方法
            int i =0;  //定义一个i来记录循环次数  即收集到的球队比赛结果数
            int index = 0; // 定义一个索引 用于获取分离 2个球队的数据 因为2个球队正则是相同的
           
            // 如果 BufferedReader 读到的内容不为空
            while ((strRead=br.readLine()) != null) {
                // 则打印出来 这里打印出来的结果 应该是整个网站的
            	/**
                 * 用于捕获日期数据
                 */
                String strGet = regularGroup(regularDate, strRead);
                System.out.println(strGet);
                func.writeTxtFile("html",strGet);
            }
            br.close(); // 读取完成后关闭读取器
        } catch (IOException e) {
            // 如果出错 抛出异常
            e.printStackTrace();
        }

	}

}
