package com.xhp.crowdfunding.util;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-03-27
 * Time: 11:24
 */
@Component
public class FTPUtil {

    private static final Logger logger = LoggerFactory.getLogger(FTPUtil.class);

    @Value("${ftp.server.ip}")
    private  String ftpIp;
    @Value("${ftp.server.user}")
    private  String ftpUser;
    @Value("${ftp.server.pass}")
    private  String ftpPass;

//    private FTPClient ftpClient;
    @Value("${ftp.server.path}")
    private String FTP_BASEPATH;


//    public boolean uploadFile(List<File> fileList) throws IOException {
////        FTPUtil ftpUtil = new FTPUtil(ftpIp,21,ftpUser,ftpPass);
//        logger.info("开始连接ftp服务器");
//        boolean result = uploadFile("img",fileList);
//        logger.info("开始连接ftp服务器，结束上传，上传结果::{}",result);
//        return result;
//    }

    public boolean uploadFile(String originFileName,InputStream input){
        boolean success = false;
//        FTPUtil ftpUtil = new FTPUtil(ftpIp,21,ftpUser,ftpPass);
        FTPClient ftp = new FTPClient();
//        ftp.enterLocalPassiveMode();
        ftp.setBufferSize(1024);
        ftp.setControlEncoding("UTF-8");
        try {
            int reply;
            ftp.connect(ftpIp, 21);// 连接FTP服务器
            ftp.login(ftpUser,ftpPass);// 登录
            reply = ftp.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                ftp.disconnect();
                return success;
            }
            ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
            ftp.enterLocalPassiveMode();
//            ftp.makeDirectory(FTP_BASEPATH );
            ftp.changeWorkingDirectory(FTP_BASEPATH );
            success = ftp.storeFile(originFileName,input);
            input.close();
            ftp.logout();
//            success = true;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (ftp.isConnected()) {
                try {
                    ftp.disconnect();
                } catch (IOException ioe) {
                }
            }
        }
        return success;
    }

//    private boolean uploadFile(String remotePath,List<File> fileList) throws IOException {
//        boolean uploaded= true;
//        FileInputStream fis = null;
//        //链接ftp服务器
//        if (connectServer(this.getIp(),this.getPort(),this.getUser(),this.getPass())){
//            try {
//                ftpClient.changeWorkingDirectory(remotePath);
//                ftpClient.setBufferSize(1024);
//                ftpClient.setControlEncoding("UTF-8");
//                ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
//                ftpClient.enterLocalPassiveMode();
//                for (File fileItem:fileList){
//                    fis = new FileInputStream(fileItem);
//                    ftpClient.storeFile(fileItem.getName(),fis);
//                }
//
//
//            } catch (IOException e) {
//                logger.error("上传文件异常",e);
//                uploaded = false;
//                e.printStackTrace();
//            }finally {
//                fis.close();
//                ftpClient.disconnect();
//            }
//        }
//        return uploaded;
//    }

//    private boolean connectServer(String ip,Integer port,String user,String pass){
//
//        boolean isSuccess = false;
//        ftpClient = new FTPClient();
//        try {
//            ftpClient.connect(ip);
//            isSuccess = ftpClient.login(user,pass);
//        } catch (IOException e) {
//            logger.error("连接FTP服务器异常",e);
//        }
//        return isSuccess;
//    }
}
