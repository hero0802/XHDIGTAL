package com.func;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.export.Data;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import com.config.config;
import com.socket.TcpKeepAliveClient;


public class WebFun {
	private static config INI = new config();
	public config config = new config();
	public static USC usc = new USC();
	private Utf8Utils utf8Utils = new Utf8Utils();

	private final static byte B_10000000 = 128 - 256;
	private final static byte B_11000000 = 192 - 256;
	private final static byte B_11100000 = 224 - 256;
	private final static byte B_11110000 = 240 - 256;
	private final static byte B_00011100 = 28;
	private final static byte B_00000011 = 3;
	private final static byte B_00111111 = 63;
	private final static byte B_00001111 = 15;
	private final static byte B_00111100 = 60;
	
	
	
	
	protected final static Log log = LogFactory.getLog(WebFun.class);
	
	public String xmlPath(){
		String str=WebFun.class.getResource("/conf.xml").getPath();
		return str;
	}
	//项目目录
	/*public static String proDir(){
		return System.getProperty("user.dir");
	}*/
	public String webPath(){
		String str=WebFun.class.getResource("/").getPath();
		str=str.substring(0, str.length()-17);
		return str;
		
	}
	
	//2进制转10进制
	public int hex_2_10(String str){
		if (str==null) {
			return 0;
		}else {
			return Integer.valueOf(str,2);
		}
	}
	//16进制转2进制
	public String  hex_16_2(String  str){
		if (str.equals("0")) {
			return "00000000";
		}
		String a=Integer.toBinaryString(Integer.parseInt(str,16));
		String b="";
		if (a.length()<8) {
			
			for (int i = 0; i <8-a.length(); i++) {
				b+="0";
			}
		}
		a=b+a;
		return a;
	}
	// 转16进制
	public String HexString(byte[] src) {
		String str = "";
		int v1 = src[0] & 0xFF;
		int v2 = src[1] & 0xFF;
		str = Integer.toHexString(v1) + Integer.toHexString(v2);
		return str;
	}
	public String HexString(int src) {
		String str = "";
		str=Integer.toHexString(src);
		if (str.length()<2) {
			str="0"+str;
		}
		return str;
	}
	
	  /** 
     * @功能 短整型与字节的转换 
     * @param 短整型 
     * @return 两位的字节数组 
     */  
    public static byte[] shortToByte(short number) {  
        int temp = number;  
        byte[] b = new byte[2];  
        for (int i = 0; i < b.length; i++) {  
            b[i] = new Integer(temp & 0xff).byteValue();// 将最低位保存在最低位  
            temp = temp >> 8; // 向右移8位  
        }  
        return b;  
    } 
	
	//获取整形

	// 生成数字加字符串的随机字符串
	public String RandomWord() {
		String[] beforeShuffle = new String[] { "1", "2", "3", "4", "5", "6",
				"7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
				"J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
				"V", "W", "X", "Y", "Z" };
		List list = Arrays.asList(beforeShuffle);
		Collections.shuffle(list);
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < list.size(); i++) {
			sb.append(list.get(i));
		}
		String afterShuffle = sb.toString();
		String result = afterShuffle.substring(1, 9);
		return result;
	}
	public String RandomInt() {
		String[] beforeShuffle = new String[] { "1", "2", "3", "4", "5", "6",
				"7", "8", "9", "0" };
		List list = Arrays.asList(beforeShuffle);
		Collections.shuffle(list);
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < list.size(); i++) {
			sb.append(list.get(i));
		}
		String afterShuffle = sb.toString();
		String result = afterShuffle.substring(1, 6);
		return result;
	}

	// 创建文件
	public boolean creatTxtFile(String path) throws IOException {
		boolean flag = false;
		File filename = new File(path);
		if (!filename.exists()) {
			filename.createNewFile();
			flag = true;
		}
		return flag;
	}

	public void createVoiceFile(String path) throws IOException {
		String filePath = path.substring(0, path.lastIndexOf("/"));
		File filename = new File(path);
		File filePathstr = new File(filePath);
		if (!filePathstr.exists() && !filePathstr.isDirectory()) {
			filePathstr.mkdirs();
		} else {
		}
		if (!filename.exists()) {
			filename.createNewFile();
		}

	}

	// 判断文件是否为空
	public boolean fileIsNull(String file) {
		FileReader fir = null;
		boolean flg = false;
		try {
			fir = new FileReader(file);
		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			if (fir.read() == -1) {
				flg = true;
			} else {
				flg = false;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			fir.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return flg;

	}

	/**
	 * 删除单个文件
	 * 
	 * @param sPath
	 *            被删除文件的文件名
	 * @return 单个文件删除成功返回true，否则返回false
	 */
	public boolean deleteFile(String sPath) {
		boolean flag = false;
		File file = new File(sPath);
		// 路径为文件且不为空则进行删除
		if (file.isFile() && file.exists()) {
			file.delete();
			flag = true;
		}
		return flag;
	}
	//读取声音二进制文件
	public byte[] readVoiceFile(String filename){
		String filePath = webPath()+config.ReadConfig("voicePath") + "/" + filename+ ".wav";
		File file=new File( filePath);
		 int bufferSize = Integer.valueOf(String.valueOf(file.length())) ;  
		 byte[] fileData = new byte[bufferSize]; 
		try {
			InputStream in=new FileInputStream(file);		
			in.read(fileData);			
			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			System.out.print("找不到文件");;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return fileData;
		
	}

	// 写二进制文件
	public void writeVoiceFile(String filename, byte[] str) throws IOException {
		/*
		 * if(!creatTxtFile(filename)){ return ; };
		 */
		String filePath = webPath()+config.ReadConfig("voicePath") + "/" + filename+ ".wav";
		//建立输出字节流
		//FileOutputStream fos = new FileOutputStream(filePath);
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(filePath, true);
			fos.write(str);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (fos != null) {
				fos.close();
				fos = null;
			}
		}

	}
	public void writeVoiceFile(String filename, byte[] str,boolean flag) throws IOException {
		/*
		 * if(!creatTxtFile(filename)){ return ; };
		 */
		//建立输出字节流
		//FileOutputStream fos = new FileOutputStream(filePath);
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(filename,flag);
			fos.write(str);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (fos != null) {
				fos.close();
				fos = null;
			}
		}

	}
	public void writeTxtFile(String filename, String newStr) throws IOException {
		/*
		 * if(!creatTxtFile(filename)){ return ; };
		 */
		String filePath = webPath()+config.ReadConfig("voicePath") + "/" + filename
				+ ".dat";
		OutputStreamWriter os = null;
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(filePath, true);
			os = new OutputStreamWriter(fos, "UTF-8");
			os.write(newStr);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (os != null) {
				os.close();
				os = null;
			}
			if (fos != null) {
				fos.close();
				fos = null;
			}
		}

	}

	// 获取当前时间
	public String nowDate() {
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		String date = dd.format(new Date());
		return date;
	}
	public String nowHoureMini() {
		SimpleDateFormat dd = new SimpleDateFormat("HH:mm");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		String date = dd.format(new Date());
		return date;
	}
	@SuppressWarnings("deprecation")
	public long nowDateTime(String dString) {
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		Date date;
		long time=0;
		try {
			date = dd.parse(dString);
			time=date.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return time;
		
	}
	public long nowTimeMill(String dString) {
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		Date date;
		long time=0;
		try {
			date = dd.parse(dString);
			time=date.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return time;
		
	}
	public long nowHourTime(String dString) {
		SimpleDateFormat dd = new SimpleDateFormat("HH:mm");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		Date date;
		long time=0;
		try {
			date = dd.parse(dString);
			time=date.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return time;
		
	}
	public String nowDateMill() {
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		String date = dd.format(new Date());
		return date;
	}
	public String Time(long time){
		Date date=new Date(time);
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		
		String str= dd.format(date);
		return str;
	}
	public String BeforeDate(int index){
		long time=new Date().getTime();
		long time2=new Date().getTime()-index*24*60*60*1000;
		Date date=new Date(time2);
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		
		String str= dd.format(date);
		return str;
		
	}
	public String DateMinus(int index){
		long time=new Date().getTime();
		long time2=new Date().getTime()-index*60*1000;
		Date date=new Date(time2);
		SimpleDateFormat dd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dd.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		
		String str= dd.format(date);
		return str;
		
	}
	//712
	public byte[] utf8ToUsc2_712(String str) {

		try {
			ByteArray byteArray = new ByteArray();
			byte[] data = str.getBytes("utf-8");
			for (int i = 0; i < data.length; i++) {
				byte b = data[i];
				if (0 == (b & 0x80)) {
					byteArray.addByte((byte) 0x00);
					byteArray.addByte(b);
				} else if (0 == (b & 0x20)) {
					byte a = data[++i];
					byteArray.addByte((byte) ((b & 0x3F) >> 2));
					byteArray.addByte((byte) (a & 0x3F | b << 6));

				} else if (0 == (b & 0x10)) {
					byte a = data[++i];
					byte c = data[++i];
					byteArray.addByte((byte) (b << 4 | (a & 0x3F) >> 2));
					byteArray.addByte((byte) (a << 6 | c & 0x3F));
				}

			}

			byte[] arr = byteArray.toArray();
			return arr;
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	public static byte[] utf8ToUsc2(String str) {

		try {
			ByteArray byteArray = new ByteArray();
			byte[] data = str.getBytes("utf-8");
			for (int i = 0; i < data.length; i++) {
				byte b = data[i];
				if (0 == (b & 0x80)) {
					byteArray.addByte((byte) 0x00);
					byteArray.addByte(b);
				} else if (0 == (b & 0x20)) {
					byte a = data[++i];
					byteArray.addByte((byte) ((b & 0x3F) >> 2));
					byteArray.addByte((byte) (a & 0x3F | b << 6));

				} else if (0 == (b & 0x10)) {
					byte a = data[++i];
					byte c = data[++i];
					byteArray.addByte((byte) (b << 4 | (a & 0x3F) >> 2));
					byteArray.addByte((byte) (a << 6 | c & 0x3F));
				}

			}

			byte[] arr = byteArray.toArray();

			for (int i = 0; i < arr.length; i += 2) {
				byte[] temp1 = new byte[1];
				temp1[0] = arr[i];
				arr[i] = arr[i + 1];
				arr[i + 1] = temp1[0];
			}
			return arr;
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch(ArrayIndexOutOfBoundsException e){
			log.error(e.getStackTrace());;
		}
		return null;
	}

	public static byte[] ucs2ToUtf8(byte[] arr) {
		if (arr.length < 1 || (arr.length%2)>0) {
			return null;
		}
		//大端转小端

		for (int i = 0; i < arr.length; i += 2) {
			byte[] temp1 = new byte[1];
			temp1[0] = arr[i];
			arr[i] = arr[i + 1];
			arr[i + 1] = temp1[0];
		}
		
		
		
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		for (int i = 0; i < arr.length; i += 2) {
			char ch = (char) (arr[i] * 128 + arr[i + 1]);
			if (ch <= 0x007F) {
				baos.write(ch);
			} else if (ch >0x007F && ch <= 0x07FF) {
				byte ub1 = arr[i];
				byte ub2 = arr[i + 1];
				byte b1 = (byte) (0xc0 | (ub1 << 2) | (ub2 >> 6));
				byte b2 = (byte) (0x80 | (ub2 & 0x3F));
				baos.write(b1);
				baos.write(b2);
			} else {
				byte ub1 = arr[i];
				byte ub2 = arr[i + 1];
				byte b1 = (byte) (0xe0 | ((ub1 >> 4) & 0x0F));
				byte b2 = (byte) (0x80 | ((ub1 & 0x0F) << 2) & 0x3c | (ub2 >> 6) & 0x03);
				byte b3 = (byte) (0x80 | (ub2 & 0x3F));
				baos.write(b1);
				baos.write(b2);
				baos.write(b3);
			}
		}
		byte[] aa=baos.toByteArray();
		return aa;

	}
	
	

	// 读取xml文档
	public String readXml(String str1, String str2) {
		String fileName = xmlPath();
		String value = "";
		try {
			File f = new File(fileName);
			if (!f.exists()) {
				System.out.println("  Error : Config file doesn't exist!");
				System.exit(1);
			}
			SAXReader reader = new SAXReader();
			Document doc;
			doc = reader.read(f);
			Element root = doc.getRootElement();
			Element data;
			Iterator<?> itr = root.elementIterator(str1);
			data = (Element) itr.next();

			value = data.elementText(str2).trim();

		} catch (Exception ex) {
			System.out.println("Error : " + ex.toString());
		}
		return value;

	}

	public char[] getChars(byte[] bytes) {
		Charset cs = Charset.forName("UTF-8");
		ByteBuffer bb = ByteBuffer.allocate(bytes.length);
		bb.put(bytes);
		bb.flip();
		CharBuffer cb = cs.decode(bb);

		return cb.array();
	}

	public void updateXML(String str1, String str2, String value)
			throws Exception {

		String filename = xmlPath();
		SAXReader sax = new SAXReader();
		Document xmlDoc = sax.read(new File(filename));
		List<Element> eleList = xmlDoc.selectNodes("/config/" + str1 + "/"+ str2);
		Iterator<Element> eleIter = eleList.iterator();
		if (eleIter.hasNext()) {
			Element ownerElement = eleIter.next();
			ownerElement.setText(value);
		}
		OutputFormat format = OutputFormat.createPrettyPrint();
		// 利用格式化类对编码进行设置
		format.setEncoding("UTF-8");
		FileOutputStream output = new FileOutputStream(new File(filename));
		XMLWriter writer = new XMLWriter(output, format);
		writer.write(xmlDoc);
		writer.flush();
		writer.close();
	}
	
	public static String BytesToHexS(byte[] str){
		if (str==null) {
			return "";
		}else {
			String string="";
			for (byte b : str) {
				String c=Integer.toHexString(b& 0xFF);
				if (c.length()==1) {
					c="0"+c;
				}
				string+=c+" ";
			}
			return string;
		}
	}
	public static String ByteToHexS(byte str){
		String string="";
		String c=Integer.toHexString(str& 0xFF);
		if (c.length()==1) {
			c="0"+c;
		}
		string+=c;
	   return string;
		
	}
	
	public int StringToInt(String str){
		int value=-1;
		try {
			value= Integer.parseInt(str.trim());
		} catch (NumberFormatException e) {
			// TODO: handle exception
			log.info("数字字符串解析失败");
		}catch (NullPointerException e) {
			// TODO: handle exception
			log.info("数字字符串为空");
		}
		return value;
	}

	public String getIpAddr(HttpServletRequest request) {
		 String ip = request.getHeader("x-forwarded-for");
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("Proxy-Client-IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("WL-Proxy-Client-IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("HTTP_CLIENT_IP");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		    }
		    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		        ip = request.getRemoteAddr();
		    }
		    return ip;
		}

}
