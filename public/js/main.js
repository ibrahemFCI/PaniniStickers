

$( document ).ready(function() {
    'use strict';
	$('#chat_window_1').click(function(){
		$('.panel-heading').css('background-color','#f5f5f5');
		$('#unread_counter').html('');
	});
	
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



    //Menu icon
var icons_array= ['<span class="icon icon-collection"></span>','<span class="icon icon-doubles"></span>','<span class="icon icon-trade"></span>'];
    $(".leftNav ul li").each(function() {
        var $this = $(this);
        $this.children('a').prepend( icons_array[$this.index()]);
	});
	
    $("#search_form").submit(function(e) {
        e.preventDefault();
		$('.search_result').html('LOADING...');
        $('.submitBtn').attr('disabled', true);
        var fd = {};
        var images = [];
        $('input[type="checkbox"][name="images"]').each(function(_, ele1) {
            if ($(ele1).is(":checked")) {
                images.push($(ele1).val());
            }
        });


			fd.images=images;

			var userdoubles = [];
        $('input[type="checkbox"][name="userdoubles"]').each(function(_, ele1) {
            if ($(ele1).is(":checked")) {
                userdoubles.push($(ele1).val());
            }
        });


			fd.userdoubles=userdoubles;
        //Append here your necessary data
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/search',
            data: JSON.stringify(fd),
            contentType: 'application/json',
            success: function(data){
                 $('.submitBtn').attr('disabled', false);
				
				var search_result_html='<div class="table-responsive"><table class="teams" style="text-align: center;"><b><tr><td>user name</td><td>user mail</td><td>user id</td><td>user Images</td><td>user Needs</td></tr></b>';
				var counter=0;
				if(data.length>0){
				data.forEach(user_data => {
					
					$.ajax({
						type:'GET',
						url:'/users/'+user_data.user_id,
						success:function(data2){
							search_result_html+='<tr><td>'+data2.name+'</td><td>'+data2.email+'</td><td><button class="send-message submitBtn" data-name="'+data2.name+'" data-attr="'+data2._id+'">Send Message</button></td><td>'+user_data.user_images+'</td><td>'+user_data.user_needs+'</td></tr>';
							counter++;
							if(counter === data.length)
							{
								search_result_html+='</table></div>';
		
								$('.search_result').html(search_result_html);
								$('.teams').css('opacity', '1');
								// alert(search_result_html);
								$('.send-message').click(function(){
									console.log($(this).attr('data-attr'));
									var data = {
										message:'hi',
										from:$('#username').val(),
										to:$(this).attr('data-name'),
										to_id:$(this).attr('data-attr'),
										sender:1
									}
									chat_box(data);
									
								});
							}
						},
						err:function(err){
							console.log(err)
						},
					});
					
				});
			}
			else
			{
				$('.search_result').html('');
			}

				


            },
            error: function(MLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }

        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	socket.on('new_message',function(data){
		data.sender = 0;
	chat_box(data);
	$('.panel-heading').css('background-color','#139be9');
	if($('#unread_counter').html() == '')
	{
		$('#unread_counter').html('0');
	}
	var unread_counter = parseInt($('#unread_counter').html())+1;
	$('#unread_counter').html(unread_counter);
		console.log(data);
	});
	
}); // Document ready


$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
     size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
	// $( "#chat_window_1" ).remove();
	$('#chat_window_1').html('');
});


function chat_box(data){
	if(data.sender == 0)
	{
		var boxtitle = data.from;
		var boxclass = 'receive';
		var sendto = data.from_id;
	}
else
	{
		var boxtitle = data.to;
		var boxclass = 'send';
		var sendto = data.to_id;
	}
	if($('#chat_window_1').html() ==''){
		// alert(data.sender);

		$('#chat_window_1').html('<div class="col-xs-12 col-md-12">'+
		'<div class="panel panel-default">'+
			'<div class="panel-heading top-bar">'+
				'<div class="col-md-8 col-xs-8">'+
					'<h3 class="panel-title"><span class="glyphicon glyphicon-comment"></span>'+boxtitle+'  <span id="unread_counter"></span></h3>'+
				'</div>'+
				'<div class="col-md-4 col-xs-4" style="text-align: right;">'+
					'<a href="#"><span id="minim_chat_window" class="glyphicon glyphicon-minus icon_minim"></span></a>'+
					'<a href="#"><span class="glyphicon glyphicon-remove icon_close" data-id="chat_window_1"></span></a>'+
				'</div>'+
			'</div>'+
			'<div class="panel-body msg_container_base" id="chat_box">'+
			'</div>'+
			'<div class="panel-footer">'+
				'<div class="input-group">'+
					'<input id="btn-input" type="text" class="form-control input-sm chat_input" placeholder="Write your message here..." />'+
					'<span class="input-group-btn">'+
					'<button class="btn btn-primary btn-sm send-message2" data-name="'+boxtitle+'" data-attr="'+sendto+'" id="btn-chat">Send</button>'+
					'</span>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>');
	$('.send-message2').on( 'click',function(){
		console.log($(this).attr('data-attr'));
		if($('#btn-input').val()){

			socket.emit('send_new_message',{
				message:$('#btn-input').val(),
				from:$('#username').val(),
				from_id:$('#userid').val(),
				to:$(this).attr('data-attr')
			})
			var data = {
				message:$('#btn-input').val(),
				from:$('#username').val(),
				to:$(this).attr('data-name'),
				to_id:$(this).attr('data-attr'),
				sender:1
			}
			$('#btn-input').val('');
			show_message(data);
		}
		
		
	});
	}
	
	

if(data.sender == 0)
	{
	show_message(data);
}

}

function show_message(data){
	if(data.sender == 0)
	{
		var boxtitle = data.from;
		var boxclass = 'receive';
		var sendto = data.from_id;
		$('#chat_box').append('<div class="row msg_container base_'+boxclass+'">'+
		'<div class="col-md-2 col-xs-2 avatar">'+
			'<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">'+
		'</div>'+
		'<div class="col-md-10 col-xs-10">'+
			'<div class="messages-chat msg_'+boxclass+'">'+
				'<p>'+data.message+'</p>'+
				'<time datetime="2009-11-13T20:00">'+data.from+' • 51 min</time>'+
			'</div>'+
		'</div>'+
	'</div>');
	}
else
	{
		var boxtitle = data.to;
		var boxclass = 'send';
		var sendto = data.to_id;
		$('#chat_box').append('<div class="row msg_container base_'+boxclass+'">'+
		
		'<div class="col-md-10 col-xs-10">'+
			'<div class="messages-chat msg_'+boxclass+'">'+
				'<p>'+data.message+'</p>'+
				'<time datetime="2009-11-13T20:00">'+data.from+' • 51 min</time>'+
			'</div>'+
		'</div>'+
		'<div class="col-md-2 col-xs-2 avatar">'+
			'<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">'+
		'</div>'+
	'</div>');
	}
}