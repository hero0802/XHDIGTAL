package com.smsnet;

public class StringUtil {
	 /** 
     * 将PDU编码的十六进制字符串 如“4F60597DFF01” 转换成unicode "\u4F60\u597D\uFF01" 
     * @param str 要转化的字符串 
     * @return 转换后的十六进制字符串 
     */  
    public static String analyseStr(String str) {  
        StringBuffer sb = new StringBuffer();  
        if (!(str.length() % 4 == 0))  
            return str;  
        for (int i = 0; i < str.length(); i++) {  
            if (i == 0 || i % 4 == 0) {  
                sb.append("\\u");  
            }  
            sb.append(str.charAt(i));  
        }  
        return Unicode2GBK(sb.toString());  
    }  
  
    /** 
     * 将unicode编码 "\u4F60\u597D\uFF01" 转换成中文 "你好！" 
     * @param dataStr 要转化的字符串 
     * @return 转换后的中文字符串 
     */  
    public static String Unicode2GBK(String str) {  
        int index = 0;  
        StringBuffer buffer = new StringBuffer();  
        while (index < str.length()) {  
            if (!"\\u".equals(str.substring(index, index + 2))) {  
                buffer.append(str.charAt(index));  
                index++;  
                continue;  
            }  
            String charStr = "";  
            charStr = str.substring(index + 2, index + 6);  
            char letter = 0;  
            try{letter = (char) Integer.parseInt(charStr, 16);}catch (Exception e) {}  
            buffer.append(letter);  
            index += 6;  
        }  
        return buffer.toString();  
    }  
  
    /** 
     * 将中文字符串转换成Unicode 
     * @param str 要转换的中文字符串 
     * @return 转换后的Unicode 
     */  
    public static String GBK2Unicode(String str) {  
  
        StringBuffer result = new StringBuffer();  
  
        for (int i = 0; i < str.length(); i++) {  
  
            char chr1 = (char) str.charAt(i);  
  
            if (!isNeedConvert(chr1)) {  
  
                result.append(chr1);  
  
                continue;  
  
            }  
            try{result.append("\\u" + Integer.toHexString((int) chr1));}catch (Exception e) {}  
  
        }  
  
        return result.toString();  
  
    }  
  
    /** 
     * 在中文字符串转换成Unicode方法中判断是否需要转换 
     * @param para 要转化的字符 
     * @return boolean 
     */  
    public static boolean isNeedConvert(char para) {  
        return ((para & (0x00FF)) != para);  
  
    }  
  
    /** 
     * 使用Sms 的 SendSms()方法发送短信时,调用此方法将其短信内容转换成十六进制 
     * @param msg 短信内容 
     * @return 转换后的十六进制短信 
     */  
    public static final String encodeHex(String str) {  
        byte[] bytes = null;  
        try {  
            bytes = str.getBytes("GBK");  
        } catch (java.io.UnsupportedEncodingException e) {  
            e.printStackTrace();  
        }  
        StringBuffer buff = new StringBuffer(bytes.length * 4);  
        String b = "";  
        char a;  
        int n = 0;  
        int m = 0;  
        for (int i = 0; i < bytes.length; i++) {  
            try{b = Integer.toHexString(bytes[i]);}catch (Exception e) {}  
            if (bytes[i] > 0) {  
                buff.append("00");  
                buff.append(b);  
                n = n + 1;  
            } else {  
                a = str.charAt((i - n) / 2 + n);  
                m = a;  
                try{b = Integer.toHexString(m);}catch (Exception e) {}  
                buff.append(b.substring(0, 4));  
  
                i = i + 1;  
            }  
        }  
        return buff.toString();  
    }  
}
