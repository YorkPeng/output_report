package cn.powerrun.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * 
 * @author Lai
 *
 */
public class JsonUtils {

	// 输入一个json文件，输出一个处理过后的JSONObject
	public static String FileToJson(File file) {
		String content = "";
		try {
			System.out.println(EncodingDetect.detect(file));
			content = FileUtils.readFileToString(file, EncodingDetect.detect(file));
			System.out.println("content:"+content); 
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JSONObject jsonObject = new JSONObject(content);
		JSONArray powerNode = JsonUtils.jsonToArr(jsonObject.get("head").toString());
		JSONObject result = new JSONObject();
		/*mapData制图数据*/
		JSONObject mapData = new JSONObject();
		JSONArray mapDataPoint = new JSONArray();
		JSONObject firstPoint = new JSONObject();
		JSONObject secondPoint = new JSONObject();
		JSONObject thirdPoint = new JSONObject();
		firstPoint.put("longtitude", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("transformLongtitude"));
		firstPoint.put("latitude", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("transformLatitude"));
		firstPoint.put("mapX", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("transformX"));
		firstPoint.put("mapY", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("transformY"));
		secondPoint.put("longtitude", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("secondLongtitude"));
		secondPoint.put("latitude", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("secondLatitude"));
		secondPoint.put("mapX", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("secondX"));
		secondPoint.put("mapY", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("secondY"));
		thirdPoint.put("longtitude", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("thirdLongtitude"));
		thirdPoint.put("latitude", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("thirdLatitude"));
		thirdPoint.put("mapX", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("thirdX"));
		thirdPoint.put("mapY", ((JSONObject)jsonObject.get("taiQuMapInfo")).get("thirdY"));
		mapDataPoint.put(firstPoint);
		mapDataPoint.put(secondPoint);
		mapDataPoint.put(thirdPoint);
		mapData.put("imageName", "");
		mapData.put("mapDataPoint", mapDataPoint);
		/*MapRemark地图备注*/
		JSONArray mapRemark = new JSONArray();
		JSONObject defaultRemark = new JSONObject();
		defaultRemark.put("mapRemarkContent", jsonObject.get("name"));
		defaultRemark.put("mapRemarkX", 0);
		defaultRemark.put("mapRemarkY", 0);
		mapRemark.put(defaultRemark);
		/*创建powerNode数组*/
		//
		result.put("taiQuName", jsonObject.get("name"));
		result.put("mapData", mapData);
		result.put("mapRemark", mapRemark);
		result.put("powerNode", powerNode);
		JsonUtils.magnifyCoordinate(result);
		return result.toString();
	}

	public static JSONArray jsonToArr(String json) {
		JSONArray result = new JSONArray();
		JSONObject jsonObject = new JSONObject(json);

		getJSONObject(result, jsonObject);
		number = -1;
		return result;

	}
	static int[] pixel = {0, 0};
	static int number = -1;
	public static void getJSONObject(JSONArray jsonArray, JSONObject jsonObject) {
		JSONObject temp = new JSONObject();
		if (!jsonObject.get("vnodekind").equals("headnode")) {
			if (jsonObject.get("vnodekind").equals("user")) {
				if(pixel[0] == ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).getInt(0) && pixel[1] == ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).getInt(1)) {
					JSONObject myUser = new JSONObject();
					myUser.put("id", getValueByKeyFilterTheNull(jsonObject, "id"));
					myUser.put("userAssetNumber", getValueByKeyFilterTheNull(jsonObject, "assetNumber"));
					myUser.put("userName", getValueByKeyFilterTheNull(jsonObject, "userName"));
					myUser.put("userAddress", getValueByKeyFilterTheNull(jsonObject, "address"));
					myUser.put("userPhase", getValueByKeyFilterTheNull(jsonObject, "phase"));
					((JSONArray) ((JSONObject) jsonArray.get(number)).get("user")).put(myUser);
				} else {
					JSONArray user = new JSONArray();
					JSONObject myUser = new JSONObject();
					myUser.put("id", getValueByKeyFilterTheNull(jsonObject, "id"));
					myUser.put("userAssetNumber", getValueByKeyFilterTheNull(jsonObject, "assetNumber"));
					myUser.put("userName", getValueByKeyFilterTheNull(jsonObject, "userName"));
					myUser.put("userAddress", getValueByKeyFilterTheNull(jsonObject, "address"));
					myUser.put("userPhase", getValueByKeyFilterTheNull(jsonObject, "phase"));
					user.put(myUser);
					temp.put("nodeName", getValueByKeyFilterTheNull(jsonObject, "vnodeName"));
					temp.put("nodeType", getValueByKeyFilterTheNull(jsonObject, "vnodekind"));
					/*线缆对象*/
					JSONObject wire = new JSONObject();
					wire.put("wireName", getValueByKeyFilterTheNull(jsonObject, "wireName"));
					wire.put("material", getValueByKeyFilterTheNull(jsonObject, "material"));
					wire.put("wireLength", getValueByKeyFilterTheNull(jsonObject, "wireLength"));
					wire.put("csArea", getValueByKeyFilterTheNull(jsonObject, "csArea"));
					temp.put("wire", wire);
					// 这两个不做判空
					temp.put("cartesian", ((JSONObject) jsonObject.get("myCoSys")).get("cartesian"));
					temp.put("father_location", getValueByKeyFilterTheNull(jsonObject, "father_location"));
					temp.put("original", ((JSONObject) jsonObject.get("myCoSys")).get("original"));
					temp.put("nodeColor", "#ED843E");
					temp.put("user", user);
					if(jsonObject.has("wireLength")) {
						int x1 = (int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(0);
						int y1 = (int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(1);
						int x2 = (int) ((JSONArray) jsonObject.get("father_location")).get(0);
						int y2 = (int) ((JSONArray) jsonObject.get("father_location")).get(1);
						int x = x1 > x2 ? (x2 + (x1 - x2) / 2) : (x1 + (x2 - x1) / 2);
						int y = y1 > y2 ? (y2 + (y1 - y2) / 2) : (y1 + (y2 - y1) / 2);
						JSONArray wireLengthCoordinate = new JSONArray();
						wireLengthCoordinate.put(x);
						wireLengthCoordinate.put(y);
						temp.put("wireLengthCoordinate", wireLengthCoordinate);
					}
					if(jsonObject.has("vnodeName")) {
						JSONArray PointInfoCoordinate = new JSONArray();
						PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(0));
						PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(1) - 15);
						temp.put("pointInfoCoordinate", PointInfoCoordinate);	
					}
//					JSONObject userTemp2 = userTemp;
					jsonArray.put(temp);
					pixel[0] = ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).getInt(0);
					pixel[1] = ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).getInt(1);
					number++;
				}

			} else {
				temp.put("nodeName", getValueByKeyFilterTheNull(jsonObject, "vnodeName"));
				temp.put("nodeType", getValueByKeyFilterTheNull(jsonObject, "vnodekind"));
				/*线缆对象*/
				JSONObject wire = new JSONObject();
				wire.put("wireName", getValueByKeyFilterTheNull(jsonObject, "wireName"));
				wire.put("material", getValueByKeyFilterTheNull(jsonObject, "material"));
				wire.put("wireLength", getValueByKeyFilterTheNull(jsonObject, "wireLength"));
				wire.put("csArea", getValueByKeyFilterTheNull(jsonObject, "csArea"));
				temp.put("wire", wire);
				// 这两个不做判空
				temp.put("phase", getValueByKeyFilterTheNull(jsonObject, "phase"));
				temp.put("cartesian", ((JSONObject) jsonObject.get("myCoSys")).get("cartesian"));
				temp.put("father_location", getValueByKeyFilterTheNull(jsonObject, "father_location"));
				temp.put("original", ((JSONObject) jsonObject.get("myCoSys")).get("original"));
				if(jsonObject.has("wireLength")) {
					int x1 = (int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(0);
					int y1 = (int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(1);
					int x2 = (int) ((JSONArray) jsonObject.get("father_location")).get(0);
					int y2 = (int) ((JSONArray) jsonObject.get("father_location")).get(1);
					int x = x1 > x2 ? (x2 + (x1 - x2) / 2) : (x1 + (x2 - x1) / 2);
					int y = y1 > y2 ? (y2 + (y1 - y2) / 2) : (y1 + (y2 - y1) / 2);
					JSONArray wireLengthCoordinate = new JSONArray();
					wireLengthCoordinate.put(x);
					wireLengthCoordinate.put(y);
					temp.put("wireLengthCoordinate", wireLengthCoordinate);
				}
				if(jsonObject.get("vnodekind").equals("transformer")) {
					JSONArray PointInfoCoordinate = new JSONArray();
					PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(0));
					PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(1) - 15);
					temp.put("nodeColor", "red");
					temp.put("pointInfoCoordinate", PointInfoCoordinate);
				} else if(jsonObject.get("vnodekind").equals("virtual")){
					temp.put("nodeColor", "#1736EC");
					if(jsonObject.has("vnodeName")) {
						JSONArray PointInfoCoordinate = new JSONArray();
						PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(0));
						PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(1) - 15);
						temp.put("pointInfoCoordinate", PointInfoCoordinate);	
					}
				}else {
					temp.put("nodeColor", "#1736EC");
					if(jsonObject.has("vnodeName")) {
						JSONArray PointInfoCoordinate = new JSONArray();
						PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(0));
						PointInfoCoordinate.put((int) ((JSONArray) ((JSONObject) jsonObject.get("myCoSys")).get("cartesian")).get(1) - 15);
						temp.put("pointInfoCoordinate", PointInfoCoordinate);	
					}
				}
				jsonArray.put(temp);
				number++;
			}
		}
		JSONArray son_node_list = jsonObject.getJSONArray("son_node_list");
		for (Object object : son_node_list) {
			JSONObject myJSONObject = (JSONObject) object;
			if (!jsonObject.get("vnodekind").equals("headnode")) {
				myJSONObject.put("father_location", ((JSONObject) jsonObject.get("myCoSys")).get("cartesian"));
			}

			getJSONObject(jsonArray, myJSONObject);
		}

	}

	public static Object getValueByKeyFilterTheNull(JSONObject jsonObject, String key) {
		return jsonObject.has(key) ? jsonObject.get(key) : "";
	}

	public static void magnifyCoordinate(JSONObject jsonObject) {
		JSONArray jsonArray = (JSONArray) jsonObject.get("powerNode");
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject temp = (JSONObject) jsonArray.get(i);
			JSONArray myArray = (JSONArray) temp.get("cartesian");
			myArray.put(0, myArray.getInt(0) * 1);
			myArray.put(1, myArray.getInt(1) * 1);
		}
	}
}
