// JavaScript Document
"use strict";


/*********************************************************************************************************/
var baseCanvas;
var nodeCanvas;
var zoomMultiple = 1.0;   //画布的缩放倍数
var click = 0;      //是否在点击画布
var imgIsLoad = false;
var jsonIsLoad = false;
var ctx;
var tableDiv = document.getElementById("myDiv");;
var img = new Image();
var path;
var myInfo = ""; //存储台区节点信息
var myRemarks; //存储台区备注信息
var REGION_NAME;
var wire_color = "#09c7f7";
var wire_size = 3;
var userNode_size = 2;
var minCoordinate = [0, 0]; //记录节点分布最小坐标
var maxCoordinate = [0, 0]; //记录节点分布的最大坐标
var withBackGround = true;
var logoUrl; //获得logo的dataUrl;
var userMaxLength = [24, 36, 48, 24, 24, 48] //获取用户参数中最长的长度(初始参数为表格头的长度)

//去掉默认的contextMenu事件，否则会和右键事件同时出现
document.oncontextmenu = function(e) {
	e.preventDefault();
};

$("#upload_getImagePath").change(function () {
	//如果文件为空
	console.log("执行方法");
	if ($(this).val() === '') {
		return;
	}
	console.log("上传");
	$("#submitForm_getImagePath").ajaxSubmit({
		url: "/output_report_test/getImagePath",
		type: "POST",
		dataType: "json",
		headers: {
			"ClientCallMode": "ajax"
		}, //可以添加请求头部
		success: function (result) {
			//result.url为底图的地址
			img.src = result.url;

			img.onload = function () {
				baseCanvas = $("#baseCanvas")[0];
				$("#baseCanvas").css("display", "block");
				ctx = baseCanvas.getContext("2d");
				$("#screenViewport div").eq(0).css("display", "none");
				ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
				ctx.drawImage(img, 0, 0);
				$(".switchBackGround").addClass("hide").removeClass("show");
				$(".switchBackGround").siblings("span").text("隐藏底图");
				imgIsLoad = true;
			};

		},
		error: function (result) {
			alert("上传失败");
			console.log(result);
		}
	});
});
//导入excel
$("#upload_getExcel").click(function() {
	$("#submitForm_getExcel").ajaxSubmit({
		url : "/output_report_test/getExcel",
		type : "POST",
		data: {
            newJson : JSON.stringify(myInfo)
        },
		dataType : "json",
		cache : true,
		async : false,
		headers : {
			"ClientCallMode" : "ajax"
		}, //可以添加请求头部
		success : function(result) {

			console.log(result);
			$.download(result.url,'post',result.url);
		},
		error : function(result) {
			alert("下载失败");
			console.log(result);
		}
	});
});
//下载压缩包（传参为新的json对象字符串）
$("#upload_downloadZip").click(function() {
	$.ajax({
		url : "/output_report_test/getZip",
		type : "POST",
		data: {
            newJson: JSON.stringify(myInfo),
			imgName: img.src,
			jsonName: REGION_NAME
        },
		dataType : "json",
		cache : true,
		async : false,
		headers : {
			"ClientCallMode" : "ajax"
		}, //可以添加请求头部
		success : function(result) {

			console.log(result);
			$.download(result.url,'post',result.url);
		},
		error : function(result) {
			alert("下载失败");
			console.log(result);
		}
	});
});


//download方法
$.download = function(url, method, filedir) {
	jQuery(
			'<form action="' + url + '" method="' + (method || 'post') + '">' + '<input type="text" name="filePath" value="' + filedir + '"/>'+'</form>').appendTo('body').submit().remove();
};

$("#upload_getJSON").change(function () {
	//如果文件为空
	if ($(this).val() === '') {
		return;
	}
	//如果还没有上传底图,则返回
	if (!imgIsLoad) {
		alert("请先上传底图");
		return;
	}

	$("#submitForm_getJSON").ajaxSubmit({
		url: "/output_report_test/getJSON",
		type: "POST",
		dataType: "json",
		headers: {
			"ClientCallMode": "ajax"
		}, //可以添加请求头部
		success: function (result) {
			path = document.getElementById("upload_getJSON").value;
			path = path.split('\\')[2].split('.')[0];
			$(".title").children("span").text(path);
			minCoordinate = [0, 0];
			maxCoordinate = [0, 0];
//			X_AMOUNT = result.baseInfo.transformX;
//			Y_AMOUNT = result.baseInfo.transformY;
			REGION_NAME = result.taiQuName;
			myInfo = result;
			myInfo.powerNode[0].nodeName = REGION_NAME;
//			//生成表格
			showTable(myInfo.powerNode);
			//做节点信息面积的存储
			saveArea(myInfo.powerNode);
			//做节点面积的存储
			saveAreaOfPoint(myInfo.powerNode);
			//画图
			showAll();
			//记录节点分布的最大最小坐标
			saveMapArea(myInfo.powerNode);
			//记录用户参数的最大长度
			saveUserMaxLength(myInfo.powerNode);
			setColor(myInfo.powerNode);
			baseCanvas.onmousedown = function (event) {
				if (event.button === 0) {
					drag(event);
				} 
			};
			jsonIsLoad = true;
		},
		error: function (result) {
			alert("上传失败");
			console.log(result);
		}
	});
});

$("#upload_continueJSON").change(function (event) {
	var imgName;
	var jsonName;
    function handleFile(f) {
        JSZip.loadAsync(f)                                 
        .then(function(zip) {
            zip.forEach(function (relativePath, zipEntry) {
            	console.log(zipEntry.name);            	
            	if(zipEntry.name.split('.')[1] == "jpg" || zipEntry.name.split('.')[1] == "png") {
            		imgName = zipEntry.name;
            		      		
            	} else {
            		jsonName = zipEntry.name;
            		
            	}
            });
            zip.file(imgName).async("base64")
    		.then(function(base64) {
    			base64 = "data:image/jpg;base64," + base64;
				$.ajax({
					url : "/output_report_test/generateImage",
					type : "POST",
					data: {
						imgStr: base64,
			            name: imgName
			        },
					dataType : "json",
					cache : true,
					async : false,
					timeout: 10000,
					headers : {
						"ClientCallMode" : "ajax"
					}, //可以添加请求头部
					success : function(result) {
						alert("成功！");
						img.src = result.url;
		    			img.onload = function () {   //图片加载完成后才加载json
		    				baseCanvas = $("#baseCanvas")[0];
		    				$("#baseCanvas").css("display", "block");
		    				ctx = baseCanvas.getContext("2d");
		    				$("#screenViewport div").eq(0).css("display", "none");
		    				ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
		    				ctx.drawImage(img, 0, 0);
		    				$(".switchBackGround").addClass("hide").removeClass("show");
		    				$(".switchBackGround").siblings("span").text("隐藏底图");
		    				imgIsLoad = true;
		    				zip.file(jsonName).async("string")
		    	    		.then(function(string) {
		    	    			var result = JSON.parse(string);
		    	    			path = jsonName;
		    	    			path = path.split('.')[0];
		    	    			$(".title").children("span").text(path);
		    	    			minCoordinate = [0, 0];
		    	    			maxCoordinate = [0, 0];
//		    	    			X_AMOUNT = result.baseInfo.transformX;
//		    	    			Y_AMOUNT = result.baseInfo.transformY;
		    	    			REGION_NAME = result.taiQuName;
		    	    			myInfo = result;
		    	    			myInfo.powerNode[0].nodeName = REGION_NAME;
//		    	    			//生成表格
		    	    			showTable(myInfo.powerNode);
		    	    			//做节点信息面积的存储
		    	    			saveArea(myInfo.powerNode);
		    	    			//做节点面积的存储
		    	    			saveAreaOfPoint(myInfo.powerNode);
		    	    			//画图
		    	    			showAll();
		    	    			//记录节点分布的最大最小坐标
		    	    			saveMapArea(myInfo.powerNode);
		    	    			//记录用户参数的最大长度
		    	    			saveUserMaxLength(myInfo.powerNode);
		    	    			setColor(myInfo.powerNode);
		    	    			baseCanvas.onmousedown = function (event) {
		    	    				if (event.button === 0) {
		    	    					drag(event);
		    	    				} 
		    	    			};
		    	    		});
		    			};
					},
					error : function(result) {
						alert("失败！");
						console.log(result);
					}
				});

    		});    
            
        }, function (e) {
        	console.log("Error reading " + f.name + ": " + e.message);
        });
    }
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }
});

	$(".UserColor").ColorPicker({
        onChange: function(hsb, hex, rgb) {
            $(".UserColor").css("backgroundColor", "#" + hex);
        } 
    });
	$(".TColor").ColorPicker({
        onChange: function(hsb, hex, rgb) {
            $(".TColor").css("backgroundColor", "#" + hex);
        } 
    });
	$(".VColor").ColorPicker({
        onChange: function(hsb, hex, rgb) {
            $(".VColor").css("backgroundColor", "#" + hex);
        } 
    });
	$(".TransformerColor").ColorPicker({
        onChange: function(hsb, hex, rgb) {
            $(".TransformerColor").css("backgroundColor", "#" + hex);
        } 
    });
	$(".WireColor").ColorPicker({
        onChange: function(hsb, hex, rgb) {
            $(".WireColor").css("backgroundColor", "#" + hex);
        } 
    });