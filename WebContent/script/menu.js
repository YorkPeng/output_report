// JavaScript Document
$(document).ready(function () {
	"use strict";

	//获取底图
	$.post("#####", {
		//参数空
	}, function(result) {
		console.log(result);
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
	});
	
	//获取新JSON
	$.post("####", {
		//参数空
	}, function(result) {
		path = document.getElementById("upload_getJSON").value;
		path = path.split('\\')[2].split('.')[0];
		$(".title").children("span").text(path);
		minCoordinate = [0, 0];
		maxCoordinate = [0, 0];
//		X_AMOUNT = result.baseInfo.transformX;
//		Y_AMOUNT = result.baseInfo.transformY;
		REGION_NAME = result.taiQuName;
		myInfo = result;
		myInfo.powerNode[0].nodeName = REGION_NAME;
//		//生成表格
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
	
	$(".toolBarCenter div").click(function () {
		$(this).addClass("choosed");
		$(this).siblings().removeClass("choosed");
	});

	$(".switchBackGround").on("click", function () {
		switchBackground();
	});

//	$(".downloadJSON").on("click", function () {
//		var json = JSON.stringify(myInfo);
//		downloadJSON(json);
//	});

	$(".download").on("click", function () {
		downloadPDF();
	});

	$(".toolBarCenter div").eq(0).click(function () {
		$(".restore").css("display", "flex");
		$("#screenViewport div").eq(0).css("display", "none");
		$(".canvasArea").css("display", "block");
	});

	$(".toolBarCenter div").eq(1).click(function () {
		$(".restore").css("display", "none");
		$(".canvasArea").css("display", "none");
		$("#screenViewport div").eq(0).css("display", "block");
	});
	
	$(".toolBarCenter div").click(function() {
		$(this).addClass("choosed");
		$(this).siblings().removeClass("choosed");
	});
	
	$(".changeColor").on("click", function() {
		changeColor(myInfo.powerNode);
		$(".box").hide();
	});
	
	$(".cancel").on("click",function() {
		setColor(myInfo.powerNode); 
		$(".box").hide();
	});
	
	$(".colorPick").on("click", function() {
		$(".box").show();
	});
	
	$(".restore").click(function() {
		$(".canvasArea").css("transform", "scale(1.0)");
		zoomMultiple = 1.0;
	});
});


		//$(".toolBarCenter div").eq(0).click(function () {
		//	$(".main canvas").css("display", "block");
		//	$(".main div").css("display", "none");
		//
		//});
		//
		//$(".toolBarCenter div").eq(1).click(function () {
		//	$(".main canvas").css("display", "none");
		//	$(".main div").css("display", "block");
		//});