package com.sound;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;

import com.func.SoundHandler;
import com.struct.WavHeaderStruct;

public class WavPlay {
	static SoundHandler sound = new SoundHandler();

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		byte[] a = {};
		play(a);
	}

	public static void play(byte[] cc) {
		// 获取音频编码对象
		int offset = 0;
		try {
			int bufferSize = cc.length;
			byte[] audioData2 = new byte[bufferSize * 2];
			int c = 0;
			for (int i = 0; i < bufferSize; i++) {
				byte[] a = new byte[2];
				a = shortToByte(sound.ulaw2liner2(cc[i]));
				System.arraycopy(a, 0, audioData2, c, 2);
				c = c + 2;
			}
			float sampleRate = 8000; // sampleRate - 每秒的样本数
			int sampleSizeInBits = 16; // sampleSizeInBits - 每个样本中的位数
			int channels = 1; // channels - 声道数（单声道 1 个，立体声 2 个）
			boolean signed = true; // signed - 指示数据是有符号的，还是无符号的
			boolean bigEndian = false; // bigEndian - 指示是否以 big-endian
										// 字节顺序存储单个样本中的数据（false 意味着
			// little-endian）
			AudioFormat af = new AudioFormat(sampleRate, sampleSizeInBits,
					channels, signed, bigEndian);
			SourceDataLine.Info info = new DataLine.Info(SourceDataLine.class,
					af, bufferSize * 2);
			SourceDataLine sdl = (SourceDataLine) AudioSystem.getLine(info);
			sdl.open(af);
			sdl.start();
			while (offset < audioData2.length) {
				offset += sdl.write(audioData2, offset, bufferSize * 2);
			}
			/*sdl.drain();
            sdl.close();*/
		} catch (LineUnavailableException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO: handle exception
			System.out.println("语音格式不对");
		}

	}

	public static byte[] shortToByte(short number) {
		int temp = number;
		byte[] b = new byte[2];
		for (int i = 0; i < b.length; i++) {
			b[i] = new Integer(temp & 0xff).byteValue();// 将最低位保存在最低位
			temp = temp >> 8; // 向右移8位
		}
		return b;
	}

}
