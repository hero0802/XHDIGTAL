package com.action;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;
import javax.sound.sampled.UnsupportedAudioFileException;

import org.apache.commons.validator.Var;
import org.apache.poi.ss.formula.ptg.FuncPtg;

import com.func.SoundHandler;
import com.func.WebFun;
import com.sound.WavPlay;

public class Test {
	private static WebFun func=new WebFun();
	private static SoundHandler sound=new SoundHandler();
	
    public static byte[] shortToByte(short number) {  
        int temp = number;  
        byte[] b = new byte[2];  
        for (int i = 0; i < b.length; i++) {  
            b[i] = new Integer(temp & 0xff).byteValue();// 将最低位保存在最低位  
            temp = temp >> 8; // 向右移8位  
        }  
        return b;  
    } 
	
	 public static void main(String[] args) {  
	        // TODO Auto-generated method stub  
		 WavPlay play=new WavPlay();
		 try {  
	            File file = new File("D:/test.pcm");  
	            System.out.println(file.length());  
	            int offset = 0;  
	            int bufferSize = Integer.valueOf(String.valueOf(file.length())) ;  
	            
	            byte[] audioData = new byte[bufferSize];  
	            byte[] audioData2 = new byte[bufferSize*2];  
	          
	            InputStream in = new FileInputStream(file);  
	            in.read(audioData); 
	            play.play(audioData);
	        } catch (FileNotFoundException e) {  
	            // TODO Auto-generated catch block  
	            e.printStackTrace();  
	        } catch (IOException e) {  
	            // TODO Auto-generated catch block  
	            e.printStackTrace();  
	        }   
	  
	    }  
	

	// 播放声音的类

}
class PlaySounds extends Thread {
	private String filename;
	private WebFun func=new WebFun();

	public PlaySounds(String wavfile) {

		filename = "D:/Ring.wav";
	}
	

	public void run() {
		File soundFile = new File(filename);
		AudioInputStream audioInputStream = null;
		
		try {
			audioInputStream = AudioSystem.getAudioInputStream(soundFile);
			/*InputStream sbs = new ByteArrayInputStream(byte[] buf); */
			
		} catch (Exception e1) {
			e1.printStackTrace();
			return;
		}
		AudioFormat format = audioInputStream.getFormat();
		SourceDataLine auline = null;
		DataLine.Info info = new DataLine.Info(SourceDataLine.class, format);
		try {
			auline = (SourceDataLine) AudioSystem.getLine(info);
			auline.open(format);
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}
		auline.start(); //允许数据行执行数据 I/O 
	
		int nBytesRead = 0;
		int i=0;
		// 这是缓冲
		byte[] abData = new byte[44];
		try {
			while (nBytesRead != -1) {
				nBytesRead = audioInputStream.read(abData, 0, abData.length);
				//System.out.print(func.BytesToHexS(abData));
				
				if (nBytesRead >= 0)
				
				if (i==0) {
					System.out.println(nBytesRead);
					System.out.print(func.BytesToHexS(abData));
				}
				i++;
			
				auline.write(abData, 0, nBytesRead);
			}
		} catch (IOException e) {
			e.printStackTrace();
			return;
		} finally {
			auline.drain();
			auline.close();
		}
	}
}

