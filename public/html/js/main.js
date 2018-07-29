// JavaScript Document *Ibrahim Najib

$( document ).ready(function() {
    'use strict';
	
	
	function bodypaddingtop(){
		var headerHeight = $('header').outerHeight();
		$('body,.leftNav').css('padding-top',headerHeight);
		$('.teams').css('opacity','1');
	}
	bodypaddingtop();
	
	if ( $('.datedropper').length > 0 ){
		$('.datedropper').dateDropper();
	}
	
	$(window).on('resize', function(){
		  bodypaddingtop();
	}); //Window resize
	
	//If admin bar visible
	var wpAdminBar = $('#wpadminbar');
	if (wpAdminBar.length) {
		var adminBarHeight = $('#wpadminbar').outerHeight();
		$('header').css('top', adminBarHeight);
	}
	
	//checkbox class
	
	$('.collection input:checkbox').change(function(){
		if($(this).is(":checked")) {
			$(this).addClass("c_checked");
			$(this).parent().parent().parent().addClass("c_checked");
		} else {
			$(this).parent().parent().parent().removeClass("c_checked");
			$(this).removeClass("c_checked");
		}
	});
	$('.doubles input:checkbox').change(function(){
		if($(this).is(":checked")) {
			$(this).parent().parent().parent().addClass("d_checked");
		} else {
			$(this).parent().parent().parent().removeClass("d_checked");
		}
	});
	$('.trade input:checkbox').attr('disabled', true);
	
	
	//Thank you Company name
	$("#companyname").on("change paste keyup", function() {
	   $('.cname').text($("#companyname").val());
	});
	// Mob Menu
	jQuery.fn.clickToggle = function(a,b) {
	  function cb(){ [b,a][this._tog^=1].call(this); }
	  return this.on("click", cb);
	};
	
	$(".mobMenu").clickToggle(function() {   
			$(this).addClass('open');
			$('.leftNav').addClass('isopen');
		}, function() {
			$(this).removeClass('open');
			$('.leftNav').removeClass('isopen');
	});
	
	// custom-drop-1
	if ($('.custom-drop-1').length > 0){
		$('.custom-drop-1').selectpicker({
		  style: 'btn-select',
		  size: 4,
		  width: '100%',
		  container:'body'
		});
	}
	
}); // Document ready