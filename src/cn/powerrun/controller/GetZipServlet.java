package cn.powerrun.controller;

import cn.powerrun.utils.DateUtils;
import cn.powerrun.utils.ZipUtils;
import com.alibaba.fastjson.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;


public class GetZipServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private String zipPath;
    private String returnZipPath;
    private String imgPath;
    private String jsonPath;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //设置用户访问到的zip文件路径
        returnZipPath = "upload" + File.separator + "zip" + File.separator + DateUtils.getDateFileName() + File.separator;
        //设置zip文件存储路径
        zipPath = req.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "zip" + File.separator + DateUtils.getDateFileName() + File.separator;
        //设置img文件储存路径
        imgPath = req.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "img" + File.separator + DateUtils.getDateFileName() + File.separator;
        //设置json文件储存路径
        jsonPath = req.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "newJson" + File.separator + DateUtils.getDateFileName() + File.separator;;

        String jsonString = req.getParameter("newJson");
        String imgName = URLDecoder.decode(req.getParameter("imgName"),"UTF-8");
        String jsonName = URLDecoder.decode(req.getParameter("jsonName"),"UTF-8");

        System.out.println(jsonString);
        System.out.println(imgName);
        System.out.println(jsonName);

        //定位图片名
        int index = imgName.indexOf("/");
        index = imgName.indexOf("/",index+1);
        index = imgName.indexOf("/",index+1);
        index = imgName.indexOf("/",index+1);
        index = imgName.indexOf("/",index+1);
        index = imgName.indexOf("/",index+1);
        index = imgName.indexOf("/",index+1);
        String realFileName = imgName.substring(index+1, imgName.length());

        File jsonFile = new File(jsonPath + jsonName + ".json");
        if (!jsonFile.getParentFile().exists()) {
            jsonFile.getParentFile().mkdirs();
        }
        if (!jsonFile.exists()) {
            jsonFile.createNewFile();
        }
        PrintWriter pw = new PrintWriter(jsonFile);
        pw.print(jsonString);
        pw.flush();
        pw.close();

        File zip = new File(zipPath + jsonName + "导出包" + ".zip");
        if (!zip.getParentFile().exists()) {
            zip.getParentFile().mkdirs();
        }
        if (!zip.exists()) {
            zip.createNewFile();
        }
        FileOutputStream fos = new FileOutputStream(zip);
        List<File> fileList = new ArrayList<>();
        fileList.add(jsonFile);
        fileList.add(new File(imgPath + realFileName));
        ZipUtils.toZip(fileList, fos);
        fos.close();

        String url = req.getServletContext().getContextPath() + File.separator + returnZipPath + zip.getName();
        resp.getWriter().write(getResponse(url).toString());
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    //设置response的返回数据
    public JSONObject getResponse(String url) {
        JSONObject result = new JSONObject();
        result.put("url", url);
        return result;
    }
}
