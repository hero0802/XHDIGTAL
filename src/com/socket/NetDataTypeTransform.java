package com.socket;

import java.io.UnsupportedEncodingException;

public class NetDataTypeTransform {
	public static final String coding = "UTF-8"; // 全局定义，以适应系统其他部分
	// public static final String coding="UTF-8"; //全局定义，以适应系统其他部分

	public NetDataTypeTransform() {

	}

	/**
	 * 将int转为byte数组
	 */
	// 将int 转为小端格式 byte数组
	public byte[] IntToSmallByteArray(int n) {
		byte[] b = new byte[4];
		b[0] = (byte) (n & 0xff);
		b[1] = (byte) (n >> 8 & 0xff);
		b[2] = (byte) (n >> 16 & 0xff);
		b[3] = (byte) (n >> 24 & 0xff);
		return b;
	}

	// 将int 转为大端格式 byte数组
	public byte[] IntToBigByteArray(int n) {
		byte[] b = new byte[4];
		b[3] = (byte) (n & 0xff);
		b[2] = (byte) (n >> 8 & 0xff);
		b[1] = (byte) (n >> 16 & 0xff);
		b[0] = (byte) (n >> 24 & 0xff);
		return b;
	}

	/**
	 * 将long 转为byte数组
	 */
	// 将long转为小端格式 byte数组
	public byte[] LongToSmallByteArray(long n) {
		byte[] b = new byte[8];
		b[0] = (byte) (n & 0xff);
		b[1] = (byte) (n >> 8 & 0xff);
		b[2] = (byte) (n >> 16 & 0xff);
		b[3] = (byte) (n >> 24 & 0xff);
		b[4] = (byte) (n >> 32 & 0xff);
		b[5] = (byte) (n >> 40 & 0xff);
		b[6] = (byte) (n >> 48 & 0xff);
		b[7] = (byte) (n >> 56 & 0xff);

		return b;
	}

	// 将long转为大端格式 byte数组
	public byte[] LongToBigByteArray(long n) {
		byte[] b = new byte[8];
		b[7] = (byte) (n & 0xff);
		b[6] = (byte) (n >> 8 & 0xff);
		b[5] = (byte) (n >> 16 & 0xff);
		b[4] = (byte) (n >> 24 & 0xff);
		b[3] = (byte) (n >> 32 & 0xff);
		b[2] = (byte) (n >> 40 & 0xff);
		b[1] = (byte) (n >> 48 & 0xff);
		b[0] = (byte) (n >> 56 & 0xff);
		return b;
	}

	/**
	 * 将short 转为byte数组
	 */
	// 将short转为小端格式 byte数组
	public byte[] ShortToSmallByteArray(short n) {
		byte[] b = new byte[2];
		b[0] = (byte) (n & 0xff);
		b[1] = (byte) (n >> 8 & 0xff);
		return b;
	}

	// 将short转为大端格式 byte数组
	public byte[] ShortToBigByteArray(short n) {
		byte[] b = new byte[2];
		b[0] = (byte) (n & 0xff);
		b[1] = (byte) (n >> 8 & 0xff);
		return b;
	}

	/**
	 * 将String转化为byte,为了支持中文，转化时用UTF-8编码方式
	 * 
	 * @param str
	 * @return
	 */
	public byte[] StringToByteArray(String str, int index) {
		byte[] temp = new byte[index];
		try {
			temp = str.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return temp;
	}

	/**
	 * 将byte数组转化成String,为了支持中文，转化时用UTF-8编码方式
	 * 
	 * @param valArr
	 * @param maxLen
	 * @return
	 */
	public String ByteArraytoString(byte[] valArr, int start, int maxLen) {

		byte[] str = new byte[maxLen];
		for (int j = 0; j < maxLen; j++) {
			str[j] = valArr[j + start];
		}
		String result = null;
		int index = 0;
		while (index < str.length && index < maxLen) {
			if (str[index] == 0) {
				break;
			}
			index++;
		}
		byte[] temp = new byte[index];
		System.arraycopy(str, 0, temp, 0, index);
		try {
			result = new String(temp, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return result;
	}

	// 将数据转化为指定长度
	public byte[] LongData(String st, int index)
			throws UnsupportedEncodingException {
		if (st.equals(null))
			st = "";
		// st=new String(st.getBytes("iso-8859-1"),"UTF-8");
		byte[] str = new byte[index];
		byte[] temp = st.getBytes("UTF-8");
		// System.out.print(st.getBytes("UTF-8").length);
		for (int i = 0; i < temp.length; i++) {
			str[i] = temp[i];
		}
		return str;

	}

	/**************************************************************************
	 * ******************************数据解码********************************** *
	 **********************************************************************/
	// 大端格式数据转化解码

	/**
	 * byte数组转化为int
	 * 
	 */
	public int BigByteArrayToInt(byte[] bArr, int start) {
		byte[] str = new byte[4];
		for (int j = 0; j < 4; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 4) {
			return -1;
		}
		return (int) ((((str[0] & 0xff) << 24) | ((str[1] & 0xff) << 16)
				| ((str[2] & 0xff) << 8) | ((str[3] & 0xff) << 0)));
	}

	/**
	 * byte数组转化为short
	 * 
	 */
	public int BigByteArrayToShort(byte[] bArr, int start) {
		byte[] str = new byte[2];
		for (int j = 0; j < 2; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 2) {
			return -1;
		}
		return (int) ((((str[0] & 0xff) << 8) | ((str[1] & 0xff) << 0)));
	}

	public int BigByteArrayToOneByte(byte[] bArr, int start) {
		byte[] str = new byte[1];
		for (int j = 0; j < 1; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 1) {
			return -1;
		}
		return (int) ((((str[0] & 0xff) << 0)));
	}

	public int BigByteArrayToThreeByte(byte[] bArr, int start) {
		byte[] str = new byte[3];
		for (int j = 0; j < 1; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 3) {
			return -1;
		}
		return (int) ((((str[0] & 0xff) << 16) | ((str[1] & 0xff) << 8) | ((str[1] & 0xff) << 0)));
	}

	/**
	 * byte数组转化为long
	 * 
	 */
	public int BigByteArrayToLong(byte[] bArr, int start) {
		byte[] str = new byte[8];
		for (int j = 0; j < 8; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 8) {
			return -1;
		}
		return (int) ((((str[0] & 0xff) << 56) | ((str[1] & 0xff) << 48)
				| ((str[2] & 0xff) << 40) | ((str[3] & 0xff) << 32)
				| ((str[4] & 0xff) << 24) | ((str[5] & 0xff) << 16)
				| ((str[6] & 0xff) << 8) | ((str[7] & 0xff) << 0)));
	}

	// 小端格式数据转化解码

	/**
	 * byte数组转化为int
	 * 
	 */
	public int SmallByteArrayToInt(byte[] bArr, int start) {
		byte[] str = new byte[4];
		for (int j = 0; j < 4; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 4) {
			return -1;
		}
		return (int) ((((str[3] & 0xff) << 24) | ((str[2] & 0xff) << 16)
				| ((str[1] & 0xff) << 8) | ((str[0] & 0xff) << 0)));
	}

	/**
	 * byte数组转化为int 字节
	 * 
	 */
	public int SmallByteArrayToOneInt(byte[] bArr, int start) {
		byte[] str = new byte[1];
		for (int j = 0; j < 1; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 1) {
			return -1;
		}
		return (int) ((((str[0] & 0xff) << 0)));
	}

	/**
	 * byte数组转化为short
	 * 
	 */
	public int SmallByteArrayToShort(byte[] bArr, int start) {
		byte[] str = new byte[2];
		for (int j = 0; j < 2; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 2) {
			return -1;
		}
		return (int) ((((str[1] & 0xff) << 8) | ((str[0] & 0xff) << 0)));
	}

	/**
	 * byte数组转化为long
	 * 
	 */
	public int SmallByteArrayToLong(byte[] bArr, int start) {
		byte[] str = new byte[8];
		for (int j = 0; j < 8; j++) {
			str[j] = bArr[j + start];
		}
		if (str.length != 8) {
			return -1;
		}
		return (int) ((((str[7] & 0xff) << 56) | ((str[6] & 0xff) << 48)
				| ((str[5] & 0xff) << 40) | ((str[4] & 0xff) << 32)
				| ((str[3] & 0xff) << 24) | ((str[2] & 0xff) << 16)
				| ((str[1] & 0xff) << 8) | ((str[0] & 0xff) << 0)));
	}

}
