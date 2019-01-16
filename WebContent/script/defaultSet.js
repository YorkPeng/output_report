// JavaScript Document
$(document).ready(function() {
	"use strict";
	$(document).keydown(function(event) {         //禁止通过"+""-"来对页面缩放
		if((event.ctrlKey === true || event.metaKey === true) && (event.which === 61 || event.which === 107 || event.which === 173 || event.which === 109 || event.which === 187 || event.which === 189)) {
			event.preventDefault();
		}
	});
	$(window).on("mousewheel DOMMouseScroll", function(event) {     //firefox禁止通过鼠标滚轮对页面缩放
		if (event.ctrlKey === true || event.metaKey) {
			event.preventDefault();
		}
	});
	$(document).mousewheel(function(event) {              //IE和Chrome禁止对页面的缩放
		if (event.ctrlKey === true || event.metaKey === true) {
			return false;
		}
	});
	
	$("#screenViewport").mousewheel(function(event, delta) {
		if($("#screenViewport div").eq(0).is(":hidden")) {
			if (event.ctrlKey === true || event.metaKey) {  //ctrl + 滚轮放大缩小
				var scrollTop = $(this).scrollTop();
				var scrollLeft = $(this).scrollLeft();
				var click_x = event.clientX - baseCanvas.getBoundingClientRect().left; //获取鼠标点击的canvas的x坐标
				var click_y = event.clientY - baseCanvas.getBoundingClientRect().top; //获取鼠标点击的canvas的y坐标
				var transferX;
				var transferY;
				var translationDistanceX;  //需要平移的x距离
				var translationDistanceY;  //需要平移的y距离
				zoomMultiple = $(".canvasArea").css("transform").split('(')[1].split(')')[0].split(',')[0];  //获取transform属性的scale值
				zoomMultiple = parseFloat(zoomMultiple);
				transferX = click_x / zoomMultiple;
				transferY = click_y / zoomMultiple;
				if(delta > 0) {
					if(zoomMultiple < 2.0) {     //限制最大尺寸
						zoomMultiple = zoomMultiple + 0.05;        
					}
				}else {
					if(zoomMultiple > 0.3) {      //限制最小尺寸
						zoomMultiple = zoomMultiple - 0.05;
					}	
				}
				translationDistanceX = transferX * zoomMultiple - click_x;
				translationDistanceY = transferY * zoomMultiple - click_y;
				$(this).scrollTop(scrollTop + translationDistanceY);
				$(this).scrollLeft(scrollLeft + translationDistanceX);
				$(".canvasArea").css("transform", "scale(" + zoomMultiple + ")");
				return false;
			}
		}
	});
	
	$("#screenViewport")[0].ondblclick = function(event) {
		if($("#screenViewport div").eq(0).is(":hidden")) {
			var scrollTop = $(this).scrollTop();
			var scrollLeft = $(this).scrollLeft();
			var click_x = event.clientX - baseCanvas.getBoundingClientRect().left; //获取鼠标点击的canvas的x坐标
			var click_y = event.clientY - baseCanvas.getBoundingClientRect().top; //获取鼠标点击的canvas的y坐标
			var transferX;
			var transferY;
			var translationDistanceX;  //需要平移的x距离
			var translationDistanceY;  //需要平移的y距离
			zoomMultiple = $(".canvasArea").css("transform").split('(')[1].split(')')[0].split(',')[0];  //获取transform属性的scale值
			zoomMultiple = parseFloat(zoomMultiple);
			transferX = click_x / zoomMultiple;
			transferY = click_y / zoomMultiple;
			if(event.button == 0) {
				zoomMultiple = zoomMultiple + 0.2;	
			} else if(event.button == 2) {
				zoomMultiple = zoomMultiple - 0.2;	
			}
			translationDistanceX = transferX * zoomMultiple - click_x;
			translationDistanceY = transferY * zoomMultiple - click_y;
			$(this).scrollTop(scrollTop + translationDistanceY);
			$(this).scrollLeft(scrollLeft + translationDistanceX);
			$(".canvasArea").css("transform", "scale(" + zoomMultiple + ")");
		}
	}
	
	
});