var popcorn, config; 

$(document).ready(function(){

	$("#simpleContained1Tab, #simpleContained2Tab, #simpleContained3Tab").resizable();

	var parser = Popcorn.EduSubsJP;

     $.getJSON('data/config.json')
     	.then(function (data) {
     		config = data;
      		$('title').html(config.title);
      		$('#title').html(config.title);
      		popcorn = getVideo(config);
      		return config;
     	})
     	.then(function(config) {
     		return $.ajax(config.subtitles.jp);
     	})
     	.then(function(data){
     		var sub_jp = Popcorn.edusubs.parseSRT(data); 
     		parser.parseSubtitles({
     			"popcorn" : popcorn,
     			"subs" : sub_jp,
     			"footnoteTarget" : "subtitle-jp",
     			"transcriptContainer" : "#transcript",
     			"termsContainer" : "#terms"
     		});
     	})
     	.then(function(){
     		return $.ajax(config.subtitles.de);
     	})
     	.then(function(data){
     		var subs = Popcorn.edusubs.parseSRT(data); 
     		$.each(subs, function (index, sub) {
     			sub["target"] = "subtitle-de";
     			popcorn.footnote(sub);
     			//popcorn.subtitle(sub);
     			//popcorn.supertext(sub);
     		});
     	});
/*     
     $.each(["jp", "de"], function (index, lang) {
		 $("#button-"+lang).click(function(e){
			e.preventDefault();
			if ($(this).hasClass("secondary")) {
				$(this).removeClass("secondary");
				$("#subtitle-"+lang).show();
			} else {
				$(this).addClass("secondary");
				$("#subtitle-"+lang).hide();
			}
		 });
     });
*/
	
	$("#controls a").click(function(e){
		e.preventDefault();
		$("#controls a").addClass("secondary");
		$(this).removeClass("secondary");
		var link = $(this);
		switch(link.attr("href")){
			case "jp":
				$("#subtitle-jp").show();
				$("#subtitle-de").hide();
				break;
			case "de":
				$("#subtitle-jp").hide();
				$("#subtitle-de").show();
				break;
			case "bi":
				$("#subtitle-jp").show();
				$("#subtitle-de").show();
				break;
		}
	});
	
	$("#simpleContained3Tab a").click(function(e){
		e.preventDefault();
		$("#simpleContained3Tab a").addClass("secondary");
		$(this).removeClass("secondary");
		Dictionaries.active_dict = $(this).attr("href");		
	});

     $(window).bind('hashchange', getHash);
     
     // Dictionaries:
     $("#subtitle-jp").bind("mouseup", Dictionaries.lookup);
});


function getHash(){
    var posn = window.location.hash.substr(1);
    //console.log("hash: ", posn);

	var start_pattern = /^\d+(\.\d+)?/;
    if (popcorn && start_pattern.test(posn)) {
        popcorn.currentTime(posn);
        popcorn.play();
    } 

	var tab_pattern = /simpleContained\d/;
	if (tab_pattern.test(posn)) {
		var tab = $('a[href="#' + posn + '"]').parent();
		var activeTab = tab.closest('dl, ul').find('.active');

		var content = $('#'+posn+'Tab');
		content.closest('.tabs-content').children('li')
			.removeClass('active').hide();
    	content.css('display', 'block').addClass('active');
    	activeTab.removeClass('active');
    	tab.addClass('active');
	}

/*    
    else {
		console.log("hash: "+ posn);
    	window.location.hash = posn;
    }
*/
}

function getVideo(config) {
    var popcorn;
    var video = config.video;
    console.log("video: ",video);
    if (typeof video === "string") {
      	popcorn = Popcorn.smart('video-container', video);
/*      
		//with popcorn-complete.1_1_2.js
    	var player = $('<div id="video"/>')
    		.appendTo($("#video-container"));
      	if (/vimeo/.test(video)) {
      		popcorn = Popcorn.vimeo('video', video);
      	}
      	if (/youtube/.test(video)) {
      		popcorn = Popcorn.youtube('video', video);
      	}
*/      	
    } else {
    	var player = $('<video id="video" controls/>')
    		.appendTo($("#video-container"));
      	$.each(video, function(index, path) {
      		var source = $("<source />").attr("src",path);
      		//mp4 has to be the first
      		if (/mp4$/.test(path)) {
      			source.prependTo(player);
      		} else {
      			source.appendTo(player);
      		}
      	});
      	popcorn = Popcorn("#video");
	} 
	return popcorn;
}

