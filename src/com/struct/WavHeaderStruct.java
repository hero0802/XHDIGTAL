package com.struct;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/*标志符（RIFF）
 数据大小
 格式类型（"WAVE"）
 "fmt"
 Sizeof(PCMWAVEFORMAT)
 PCMWAVEFORMAT
 "data"
 声音数据大小
 声音数据*/
public class WavHeaderStruct {
	private char fileID[] = { 'R', 'I', 'F', 'F' }; // 标志符 4byte
	private int fileLength; // 数据长度 4byte 从下一个地址开始到文件尾的总字节数。
	private char wavTag[] = { 'W', 'A', 'V', 'E' }; // WAVE标志 4byte
	private char fmtHdrID[] = { 'f', 'm', 't', ' ' }; // fmt标志，最后一位为空 4byte
	private int fmtHdrLeth = 16;// 量化 4byte sizeof(PCMWAVEFORMAT)
	private short formatTag = 0x0007; // u率格式;
									// //编码格式，包括WAVE_FORMAT_PCM，WAVEFORMAT_ADPCM等
									// 2byte
	public short channels = 1; // 声道数，单声道为1，双声道为2; 2byte
	public short sampleRate = 8000;// 采样频率； 2byte
	public short bitsPerSample = 8; // WAVE文件的采样大小；2byte
									// 本数据位数，0010H即16，一个量化样本占2byte
	private short blockAlign = (short) (channels * bitsPerSample / 8);// 块对齐；
																		// 2byte
																		// formatChannl
																		// *
																		// formatBitsPerSample
																		// /8;
	private int avgBytesPerSec = blockAlign * sampleRate;// 每秒的数据量； 4byte
															// BlockAlign *
															// formatSamplesPerSec;
	private char dataHdrID[] = { 'd', 'a', 't', 'a' }; // data，一个标志而已。 4byte
	private int dataHdrLeth;// 数据包总长度 4byte

	public WavHeaderStruct(int fileLength) {
		this.fileLength = fileLength + (44 - 8);
		this.dataHdrLeth = fileLength;
	}

	/**
	 * @return byte[] 44个字节
	 * @throws IOException
	 */
	public byte[] getHeader() throws IOException {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		WriteChar(bos, fileID);
		WriteInt(bos, fileLength);
		WriteChar(bos, wavTag);
		WriteChar(bos, fmtHdrID);
		WriteInt(bos, fmtHdrLeth);
		WriteShort(bos, formatTag);
		WriteShort(bos, channels);
		WriteInt(bos, sampleRate);
		WriteInt(bos, avgBytesPerSec);
		WriteShort(bos, blockAlign);
		WriteShort(bos, bitsPerSample);
		WriteChar(bos, dataHdrID);
		WriteInt(bos, dataHdrLeth);
		bos.flush();
		byte[] r = bos.toByteArray();
		bos.close();
		return r;
	}

	private void WriteShort(ByteArrayOutputStream bos, int s)
			throws IOException {
		byte[] mybyte = new byte[2];
		mybyte[1] = (byte) ((s << 16) >> 24);
		mybyte[0] = (byte) ((s << 24) >> 24);
		bos.write(mybyte);
	}

	private void WriteInt(ByteArrayOutputStream bos, int n) throws IOException {
		byte[] buf = new byte[4];
		buf[3] = (byte) (n >> 24);
		buf[2] = (byte) ((n << 8) >> 24);
		buf[1] = (byte) ((n << 16) >> 24);
		buf[0] = (byte) ((n << 24) >> 24);
		bos.write(buf);
	}

	private void WriteChar(ByteArrayOutputStream bos, char[] id) {
		for (int i = 0; i < id.length; i++) {
			char c = id[i];
			bos.write(c);
		}
	}

	public char[] getFileID() {
		return fileID;
	}

	public void setFileID(char[] fileID) {
		this.fileID = fileID;
	}

	public int getFileLength() {
		return fileLength;
	}

	public void setFileLength(int fileLength) {
		this.fileLength = fileLength;
	}

	public char[] getWavTag() {
		return wavTag;
	}

	public void setWavTag(char[] wavTag) {
		this.wavTag = wavTag;
	}

	public char[] getFmtHdrID() {
		return fmtHdrID;
	}

	public void setFmtHdrID(char[] fmtHdrID) {
		this.fmtHdrID = fmtHdrID;
	}

	public int getFmtHdrLeth() {
		return fmtHdrLeth;
	}

	public void setFmtHdrLeth(int fmtHdrLeth) {
		this.fmtHdrLeth = fmtHdrLeth;
	}

	public short getFormatTag() {
		return formatTag;
	}

	public void setFormatTag(short formatTag) {
		this.formatTag = formatTag;
	}

	public short getChannels() {
		return channels;
	}

	public void setChannels(short channels) {
		this.channels = channels;
	}

	public short getSampleRate() {
		return sampleRate;
	}

	public void setSampleRate(short sampleRate) {
		this.sampleRate = sampleRate;
	}

	public short getBitsPerSample() {
		return bitsPerSample;
	}

	public void setBitsPerSample(short bitsPerSample) {
		this.bitsPerSample = bitsPerSample;
	}

	public short getBlockAlign() {
		return blockAlign;
	}

	public void setBlockAlign(short blockAlign) {
		this.blockAlign = blockAlign;
	}

	public int getAvgBytesPerSec() {
		return avgBytesPerSec;
	}

	public void setAvgBytesPerSec(int avgBytesPerSec) {
		this.avgBytesPerSec = avgBytesPerSec;
	}

	public char[] getDataHdrID() {
		return dataHdrID;
	}

	public void setDataHdrID(char[] dataHdrID) {
		this.dataHdrID = dataHdrID;
	}

	public int getDataHdrLeth() {
		return dataHdrLeth;
	}

	public void setDataHdrLeth(int dataHdrLeth) {
		this.dataHdrLeth = dataHdrLeth;
	}
	

}
