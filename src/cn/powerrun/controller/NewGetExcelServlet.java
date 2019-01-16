package cn.powerrun.controller;

import cn.powerrun.utils.DateUtils;
import cn.powerrun.utils.NewExcelUtils;
import com.alibaba.fastjson.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;

public class NewGetExcelServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private String excelPath;
    private String returnExcelPath;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        //设置用户访问到的excel文件路径
        returnExcelPath = "upload" + File.separator + "excel" + File.separator + DateUtils.getDateFileName() + File.separator;
        //设置excel文件存储路径
        excelPath = request.getSession().getServletContext().getRealPath("") + "upload" + File.separator + "excel" + File.separator + DateUtils.getDateFileName() + File.separator;
        try {
            String jsonString = request.getParameter("newJson");
            System.out.println(jsonString);
            if (jsonString == null) {
                return;
            }
            JSONObject jsonObject = JSONObject.parseObject(jsonString);
            HSSFWorkbook workbook = NewExcelUtils.getExcel(jsonObject);
            //将文件写入本地
            File excel = new File(excelPath + jsonObject.getString("taiQuName") + ".xls");
            if (!excel.getParentFile().exists()) {
                excel.getParentFile().mkdirs();
            }
            if (!excel.exists()) {
                excel.createNewFile();
            }

            String url = request.getServletContext().getContextPath() + File.separator + returnExcelPath + excel.getName();
            System.out.println(url);
            FileOutputStream fos = new FileOutputStream(excel);
            workbook.write(fos);
            //刷新并强制写出所有数据
            fos.flush();
            fos.close();

            System.out.println(getResponse(url).toString());


            response.getWriter().write(getResponse(url).toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }
    }

    //设置response的返回数据
    public JSONObject getResponse(String url) {
        JSONObject result = new JSONObject();
        result.put("url", url);
        return result;
    }
}
