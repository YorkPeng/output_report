package cn.powerrun.controller;

import cn.powerrun.utils.DateUtils;
import cn.powerrun.utils.GenerateImageUtils;
import com.alibaba.fastjson.JSONObject;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;

public class GenerateImageServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private String uploadPath;
    private String returnImgPath;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req,resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 设置上传文件存储的路径
        uploadPath = req.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "img" + File.separator + DateUtils.getDateFileName()+ File.separator;
        returnImgPath = "upload" + File.separator + "img" + File.separator + DateUtils.getDateFileName() + File.separator;

        String imgStr = req.getParameter("imgStr");
        String imgName = URLDecoder.decode(req.getParameter("name"),"UTF-8");
        String imgCode = imgStr.split(",")[1];

        BufferedImage bufferedImage = GenerateImageUtils.GenerateImage(imgCode);
        File img  = new File(uploadPath + imgName);
        if (!img.getParentFile().exists()) {
            img.getParentFile().mkdirs();
        }
        if (!img.exists()) {
            img.createNewFile();
        }
        ImageIO.write(bufferedImage,"png",img);

        String url = req.getServletContext().getContextPath() + File.separator + returnImgPath + img.getName();
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
