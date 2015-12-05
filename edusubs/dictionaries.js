// Based on
// http://www.codetoad.com/javascript_get_selected_text.asp
// http://mark.kolich.com

(function(global) {

	if(!global.Dictionaries){
		global.Dictionaries = {};
	}
	
	var getSelectedText = function (){
		var t = "";
		if (window.getSelection){
			t = window.getSelection();
		} else if (document.getSelection){
			t = document.getSelection();
		} else if (document.selection){
			t = document.selection.createRange().text;
		}
		return t;
	}
	
	var createFrame = function (url, source) {
		var text = getSelectedText();
		if (text != ""){
			var url = url+text;
			var resize = $("<div/>")
				.addClass('dict-frame-container')
				.addClass('panel')
				.resizable()
				.appendTo($("#dictionaries"));
			$('<div/>')
				.addClass('source-title')
				.append(source)
				.appendTo(resize);
			$('<a class="close-x">×</a>')
				.click(function(){ resize.remove(); })
				.appendTo(resize);
			$("<iframe/>")
				.addClass('dict-frame')
				.attr("src", url)
				.appendTo(resize);
		}
	
	}
	
	Dictionaries.active_dict = "kanjiabc";
		
	Dictionaries.lookup = function () {
		if ($("#simpleContained3Tab").hasClass("active")) {
			Dictionaries[Dictionaries.active_dict]();
		}
	}
		
	Dictionaries.kanjiabc = function() {
		var url = "http://kanjiabc.net/index.cgi?rm=lookup;lang=DE;cut_paste=";
		createFrame(url, "Kanji ABC");
	}
	
	// blank
	Dictionaries.wadoku_eu = function() {
		var url = "http://wadoku.eu/?query=";
		createFrame(url, "WaDoku");
	}
	
	Dictionaries.wadoku_de = function() {
		var url = "http://wadoku.de/search/";
		createFrame(url, "WaDoku");
	}
	
	Dictionaries.wadokukeizai = function() {
		var url = "http://www.wadokukeizai.de/suchen/";
		createFrame(url, "Wadokukeizai");
	}
	
})(window);
