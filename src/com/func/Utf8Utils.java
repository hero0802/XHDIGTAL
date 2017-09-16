package com.func;
import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;

public class Utf8Utils {

	private final static byte B_10000000 = 128 - 256;
	private final static byte B_11000000 = 192 - 256;
	private final static byte B_11100000 = 224 - 256;
	private final static byte B_11110000 = 240 - 256;
	private final static byte B_00011100 = 28;
	private final static byte B_00000011 = 3;
	private final static byte B_00111111 = 63;
	private final static byte B_00001111 = 15;
	private final static byte B_00111100 = 60;
	
	/** Convert from UTF8 bytes to UNICODE character */
	public static char[] toUCS2(byte[] utf8Bytes) {
		CharList charList = new CharList();
		byte b2 = 0, b3 = 0;
		int ub1 = 0, ub2 = 0;
		
		for (int i = 0; i < utf8Bytes.length; i++) {
			byte b = utf8Bytes[i];
			if (isNotHead(b)) {
				// start with 10xxxxxx, skip it.
				continue;
			} else if (b > 0) {
				// 1 byte, ASCII
				charList.add((char) b);
			} else if ((b & B_11110000) == B_11110000) {
				// UCS-4, here we skip it
				continue;
			} else if ((b & B_11100000) == B_11100000) {
				// 3 bytes
				b2 = utf8Bytes[i+1];
				if (!isNotHead(b2)) continue;
				i++;
				b3 = utf8Bytes[i+1];
				if (!isNotHead(b3)) continue;
				i++;
				ub1 = ((b & B_00001111) << 4) + ((b2 & B_00111100) >> 2);
				ub2 = ((b2 & B_00000011) << 6) + ((b3 & B_00111111));
				charList.add(makeChar(ub1, ub2));
			} else {
				// 2 bytes
				b2 = utf8Bytes[i+1];
				if (!isNotHead(b2)) continue;
				i++;
				ub1 = (b & B_00011100) >> 2;
				ub2 = ((b & B_00000011) << 6) + (b2 & B_00111111);
				charList.add(makeChar(ub1, ub2));
			}
		}
		
		return charList.toArray();
	}
	
	private static boolean isNotHead(byte b) {
		return (b & B_11000000) == B_10000000;
	}
	
	private static char makeChar(int b1, int b2) {
		return (char) ((b1 << 8) + b2);
	}
	
	public static byte[] fromUCS2(char[] ucs2Array) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		for (int i = 0; i < ucs2Array.length; i++) {
			char ch = ucs2Array[i];
			if (ch <= 0x007F) {
				baos.write(ch);
			} else if (ch <= 0x07FF) {
				int ub1 = ch >> 8;
				int ub2 = ch & 0xFF;
				int b1 = B_11000000 + (ub1 << 2) +  (ub2 >> 6);
				int b2 = B_10000000 + (ub2 & B_00111111);
				baos.write(b1);
				baos.write(b2);
			} else {
				int ub1 = ch >> 8;
				int ub2 = ch & 0xFF;
				int b1 = B_11100000 + (ub1 >> 4);
				int b2 = B_10000000 + ((ub1 & B_00001111) << 2) + (ub2 >> 6);
				int b3 = B_10000000 + (ub2 & B_00111111);
				baos.write(b1);
				baos.write(b2);
				baos.write(b3);
			}
		}
		return baos.toByteArray();
	}
	
	private static class CharList {
		private char[] data = null;
		private int used = 0;
		public void add(char c) {
			if (data == null) {
				data = new char[16];
			} else if (used >= data.length) {
				char[] temp = new char[data.length * 2];
				System.arraycopy(data, 0, temp, 0, used);
				data = temp;
			}
			data[used++] = c;
		}
		public char[] toArray() {
			char[] chars = new char[used];
			System.arraycopy(data, 0, chars, 0, used);
			return chars;
		}
	}
	
	private static void assert1(String s) throws UnsupportedEncodingException {
		byte[] b = s.getBytes("utf-8");
		char[] c = toUCS2(b);
		if (!s.equals(new String(c))) {
			throw new RuntimeException("Can not pass assert1 for: " + s);
		}
	}
	
	private static void assert2(String s) throws UnsupportedEncodingException {
		byte[] b = s.getBytes("utf-8");
		byte[] b2 = fromUCS2(s.toCharArray());
		if (b.length == b2.length) {
			int i;
			for (i = 0; i < b.length; i++) {
				if (b[i] != b2[i]) {
					break;
				}
			}
			if (i == b.length) {
				return;
			}
		}
		throw new RuntimeException("Can not pass assert2 for: " + s);
	}
	public static byte[] getBytes (char[] chars) {
		   Charset cs = Charset.forName ("UTF-8");
		   CharBuffer cb = CharBuffer.allocate (chars.length);
		   cb.put (chars);
		                 cb.flip ();
		   ByteBuffer bb = cs.encode (cb);
		  
		   return bb.array();
		         }
	public static void main(String[] args) throws Exception {
		String s="123";
		byte[] b = s.getBytes("utf-8");
		char[] c = toUCS2(b);
		
		System.out.println(getBytes(c));
	}

}
