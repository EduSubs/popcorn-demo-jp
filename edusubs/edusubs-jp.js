// Popcorn Macbeth Style Markup extended for Japanese: 
//     [defn]（ちゅうとう）Mittlerer Osten > 中東[/defn]
// http://katehudsondesign.com/demos/popcornmacbeth/

(function(Popcorn) {

	var _PM = {};	
	Popcorn.EduSubsJP = _PM;
	
	var pattern = /\[defn\]\s*(?:（(.+?)）)?(.*?) > (.*?)\s*\[\/defn\]/g;	
	
	_PM.parseSubtitles = function (args) {
		var popcorn = args.popcorn;
		var subtitles = args.subs; // result of Popcorn.edusubs.parseSRT(jp);
		var footnoteTarget = args.footnoteTarget;
		var transcriptContainer = args.transcriptContainer;
		var termsContainer = args.termsContainer;
	
		var terms = [];
		
		$.each(subtitles, function (index, sub) {

			//transcript
			var transcript = _PM.getVideoControlTranscriptLine(sub.text, sub.start);
			$(transcriptContainer).append(transcript);

			//terms
			sub.text = _PM.parseLines(sub.text, index, sub.start, terms);

			//footnotes
			sub["target"] = footnoteTarget;     			
			popcorn.footnote(sub);
			//popcorn.supertext(sub);
		});

		/*
		//dl variante:
		var dl = $('<dl/>')
			.appendTo($(termsContainer));
		$.each(terms, function (index, term) {
			//<a class="defn" href="#13.88" onclick="getHash();">原発</a>
			var spelling = '<a class="defn" href="#' + term.start + '" onclick="getHash();">' + term.spelling + '</a>';
			var di = "<dt>" + spelling + "</dt>";
			$.each([term.reading, term.meaning], function (j, info) {
				if (info) {
					di += "<dd>" + info + "</dd>";
				}
			});
			dl.append(di);
		});
		*/
		
		
		// table variante:
		var table = $('<table/>').appendTo($(termsContainer));
		$.each(terms, function (index, term) {
			//<a class="defn" href="#13.88" onclick="getHash();">原発</a>
			var spelling = '<a class="defn" href="#' + term.start + '" onclick="getHash();">' + term.spelling + '</a>';
			var tr = $("<tr/>");
			$.each([spelling, term.reading, term.meaning], function (j, info) {
				if (!info) {
					info = "";
				}
				tr.append("<td>" + info + "</td>");
			});
			table.append(tr);
		});
	}

	_PM.parseLines = function (text, id, start, terms){ 
		//Creates a formatted version from the line
				
		var match;
		while (match = pattern.exec(text)) {
			//console.log(match);
			var term = {};
			term.start = start;
			term.reading = match[1];
			term.meaning = match[2];
			term.spelling = match[3];
			terms.push(term);
		}
		//console.log(terms);
		
		var parsed = ('<p id="line-' + id + '" class="ln">' + text + '</p>')
			.replace(/\[defn\]/g, '<span class="defn" start="' + start + '"><b>')
			.replace(/ \> /g, '</b>')
			.replace(/\[\/defn\]/g, '</span>')
			.replace(/<b>（(.+?)）/g,'<b>$1<br/>');
			//.replace(/<b>（(.+?)）/g,'<i>$1</i><b>');
		return parsed;
	}
	
	_PM.getVideoControlTranscriptLine = function (text, start){
		var parsed = ('<a class="defn" onclick="getHash();" href="#' + start + '">' + text + '</a><br/>')
		.replace(/ \/ /g, '<br/>')
		.replace(/\[defn\].*\> /g, '')
		.replace(/\[\/defn\]/g, '');
		return parsed;
	}

})(Popcorn);

