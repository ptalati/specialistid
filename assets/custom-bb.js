var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
var isEdge = false;
var lineNumber = 1;
var badgeTxt;
var badgeText2 = "";
var colorName = "Blue";

if (/Edge/i.test(navigator.userAgent)){
    // This is Microsoft Edge
    isEdge = true;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function selectVerticalBadgeBottom() {
  if (isChrome) {
    $(".selectedColor").css({width: "129px", "margin-left": "68px", "margin-top": "-121px", height: "86px"});
    // $("#badge-preview-text").css({width: "124px", "margin-top": "-116px"});
  }
  if (isFirefox) {
    $(".selectedColor").css({width: "129px", "margin-left": "68px", "margin-top": "-121px", height: "86px"});
    // $("#badge-preview-text").css({width: "124px", "margin-top": "-116px"});
  }
  if (isIE) {
    $(".selectedColor").css({width: "129px", "margin-left": "68px", "margin-top": "-121px", height: "86px"});
    // $("#badge-preview-text").css({
    //   width: "124px",
    //   "margin-top": "-116px",
    //   "margin-left": "72px"
    // });
  }
  if (isEdge) {
    $(".selectedColor").css({width: "129px", "margin-left": "68px", "margin-top": "-121px", height: "86px"});
    // $("#badge-preview-text").css({
    //   width: "124px",
    //   "margin-top": "-116px",
    //   "margin-left": "72px"
    // });
  }
  $(".selectedBadge").attr("src", "//cdn.shopify.com/s/files/1/1260/4809/files/bbottomvertical.webp?v=1689698730");

  $("#imgHorizontal").css("border", "0px");
  $(".horimg").css("display", "none");
  $("#imgVertical").css("border", "3px solid #F5911F");
  wide = false;
  $(".product_code").text("BADGEBOTTOMS-V");
  productCode = "BADGEBOTTOMS-V";
  fixTextPosition(1);
  resetText();
}

function selectHorizontalBadgeBottom() {
  $(".selectedColor").css({width: "190px", "margin-left": "45px", "margin-top": "-90px", height: "61px"});
  $("#tab1").css({"margin-bottom": "-100px"});
  $(".selectedBadge").attr("src", "//cdn.shopify.com/s/files/1/1260/4809/files/bbottomhorizon.jpg?v=1689699832");

  $(".verimg").css("display", "none");
  $("#imgHorizontal").css("border", "3px solid #F5911F");

  $("#imgVertical").css("border", "0px");
  $(".product_code").text("BADGEBOTTOMS-H");
  productCode = "BADGEBOTTOMS-H";
  wide = true;
  fixTextPosition(1);
  resetText();
}

function selectHorizontalBadgeBuddiesXL() {
  $(".selectedColor").css({width: "183px", "margin-left": "53px", "margin-top": "-83px", height: "61px"});
  $("#tab1").css({"margin-bottom": "-100px"});
  $(".selectedBadge").attr('src', '{{ "BB-1XL-CUSTOM-BLUE-H.png" | asset_img_url: "800x800" }}');

  $(".verimg").css("display", "none");
  $("#imgHorizontal").css("border", "3px solid #F5911F");

  $("#imgVertical").css("border", "0px");
  $(".product_code").text("BADGEBOTTOMS-H-1XL");
  productCode = "BADGEBOTTOMS-H-1XL";
  wide = true;
  fixTextPosition(1);
  resetText();
}

function selectVerticalBadgeBuddiesXL() {
  $(".selectedColor").css({width: "122px", "margin-left": "143px", "margin-top": "-116px", height: "84px"});
  $("#tab1").css({"margin-bottom": "-100px"});
  $(".selectedBadge").attr('src', '{{ "BB-1XL-CUSTOM-RED-V.png" | asset_img_url: "800x800" }}');

  $(".verimg").css("display", "none");
  $("#imgVertical").css("border", "3px solid #F5911F");
  $("#tab2").addClass("vertical-badge-buddies-1xl")

  $("#imgVertical").css("border", "0px");
  $(".product_code").text("BADGEBOTTOMS-H-1XL");
  productCode = "BADGEBOTTOMS-H-1XL";
  wide = true;
  fixTextPosition(1);
  resetText();
}

function selectHorizontalClear() {
  $(".selectedColor").css({width: "244px", "margin-left": "10px", "margin-top": "-226px", height: "88px"});
  
  $(".selectedBadge").attr("src", "//cdn.shopify.com/s/files/1/1260/4809/files/bbhorizontal.webp?v=1689698297");
  $(".selectedBadge").css({"pointer-events": "none"});
  $(".textHolder").css({"pointer-events": "auto"});

  $("#imgHorizontal").css("border", "3px solid #F5911F");
  $("#imgVertical").css("border", "0px");
  $(".product_code").text("BB-CUSTOM-COLOR-H");
  $("#tab2").addClass("badge-buddies-clear-horizontal");
  productCode = "BB-CUSTOM-COLOR-H";
  wide = true;
  fixTextPosition(1);
  resetText();
}

function selectVerticalClear() {
  $(".selectedColor").css({width: "146px", "margin-left": "60px", "margin-top": "-136px", height: "95px"});

  $(".selectedBadge").attr("src", "//cdn.shopify.com/s/files/1/1260/4809/files/bbvertical.webp?v=1689698740");
  $("#imgHorizontal").css("border", "0px");
  $("#imgVertical").css("border", "3px solid #F5911F");
  wide = false;
  $(".product_code").text("BB-CUSTOM-COLOR-V");
  $("#tab2").addClass("badge-buddies-clear-vertical");
  productCode = "BB-CUSTOM-COLOR-V";
  fixTextPosition(1);
  resetText();
}

function selectHorizontal() {
  $(".selectedColor").css({width: "225px", "margin-left": "20px", "margin-top": "-226px", height: "78px"});
  
  $(".selectedBadge").attr("src", "//cdn.shopify.com/s/files/1/1260/4809/files/bbhorizontal.webp?v=1689698297");
  $(".selectedBadge").css({"pointer-events": "none"});
  $(".textHolder").css({"pointer-events": "auto"});

  $("#imgHorizontal").css("border", "3px solid #F5911F");
  $("#imgVertical").css("border", "0px");
  $(".product_code").text("BB-CUSTOM-COLOR-H");
  productCode = "BB-CUSTOM-COLOR-H";
  wide = true;
  fixTextPosition(1);
  resetText();
}

function selectVertical() {
  $(".selectedColor").css({width: "129px", "margin-left": "70px", "margin-top": "-136px", height: "86px"});

  $(".selectedBadge").attr("src", "//cdn.shopify.com/s/files/1/1260/4809/files/bbvertical.webp?v=1689698740");
  $("#imgHorizontal").css("border", "0px");
  $("#imgVertical").css("border", "3px solid #F5911F");
  wide = false;
  $(".product_code").text("BB-CUSTOM-COLOR-V");
  productCode = "BB-CUSTOM-COLOR-V";
  fixTextPosition(1);
  resetText();
}

function selectColor(selColor) {}

function resetApp() {
  $("#inputQuntity").val("6");

  var title = document.getElementsByTagName("title")[0].innerHTML.replace('™', '');
  var custom_bb_type = $(".custom_bb_type").val();
  console.log(custom_bb_type);

  switch (custom_bb_type) {
    case 'Badge Buddy - Horizontal':
      selectHorizontal();
      break;
    case 'Badge Buddy - Vertical':
      selectVertical();
      break;
    case 'Badge Buddy Clear - Horizontal':
      selectHorizontalClear();
      break;
    case 'Badge Buddy Clear - Vertical':
      selectVerticalClear();
      break;
    case 'Badge Buddy - XL - Horizontal':
      selectHorizontalBadgeBuddiesXL();
      break;
    case 'Badge Buddy - XL - Vertical':
      selectVerticalBadgeBuddiesXL();
      break;
    case 'Badge Bottoms - Horizontal':
      selectHorizontalBadgeBottom();
      break;
    case 'Badge Bottoms - Vertical':
      selectVerticalBadgeBottom();
      break;
  }

// select vertical
  // if (title.indexOf("Custom Printed Badge Buddy Vertical") != -1) {
  //   selectVertical();
  // } else if (title.indexOf("Oversized Custom Printed Badge Buddy Horizontal XL") != -1) {
  //   selectHorizontalBadgeBuddiesXL();
  // } else if (title.indexOf("Oversized Custom Vertical Badge Buddy XL") != -1) {
  //   selectVerticalBadgeBuddiesXL();
  // } else if (title.indexOf("Custom Printed BadgeBottoms® Vertical") != -1) {
  //   selectVerticalBadgeBottom();
  // } else if (title.indexOf("Custom Printed BadgeBottoms® Horizontal") != -1) {
  //   selectHorizontalBadgeBottom();
  // } else {
  //   selectHorizontal();
  // }
  
// reset txt
  resetText();

// select first color
  selectColor("rgb(1, 103, 177)");
}

function resetText(){
    //reset txt field 1
    $("#inputText1").val("");
    $("#badgeOneLine").val("");

    //reset txt field 2
    $("#inputText2").val("");
    $("#badgeSecondLine").val("");

    setBadgeText('');
    setBadgeText('',true);
}

function fixTextPosition(tab){
	if(wide){
		$('#badge-preview-text').attr( "class", "badge-preview-text-tab"+tab +"w");
	}else
	$('#badge-preview-text').attr( "class", "badge-preview-text-tab"+tab );
	
	if(lineNumber==2){
		$('#badge-preview-text').attr( "class", $('#badge-preview-text').attr( "class") + "line2");
	}
	
	$('#badge-preview-text').appendTo('#tab'+tab);	
}

function setBadgeText(txt, secondLine) {
  console.log($(".custom-line-2 input[type=text]").length);
	if(secondLine || ($(".custom-line-2 input[type=text]").length && $(".custom-line-2 input[type=text]").val() != "")){
		lineNumber = 2;
	}else{
		lineNumber = 1;
	}

    console.log(lineNumber);
	
    if (secondLine) {
        this.badgeText2 = txt;
    } else {
        this.badgeText = txt;
    }
    if(this.badgeText == undefined){
    	this.badgeText = "";
    }

    console.log(secondLine);
    console.log(this.badgeText2);

    if(this.badgeText2 == undefined){
    	this.badgeText2 = "";
    }

    var width = $("#badge-preview-text").width();

    var html;
	
    if (lineNumber == 2 && secondLine) { // two lines and editing second line
    	html = '<div id="txtSpan1" style="width:100%;margin-bottom: -13px;"><span id="doubleSpan1" style="display:inline-block">' + this.badgeText + '</span></div>';
    	html += '<div id="txtSpan2" style="width:100%;"><span id="doubleSpan2" style="display:inline-block">' + txt + '</span></div>';
    	        //html = '<table><tr><td>' + this.badgeText;
        //html += '</td></tr><tr><td>' + txt + '</tr></td></table>';
    } else if (lineNumber == 2) { // two lines and editing first line
    	html = '<div id="txtSpan1" style="width:100%;margin-bottom: -13px;"><span id="doubleSpan1" style="display:inline-block">' + txt+'</span></div>';
        html += '<div id="txtSpan2" style="width:100%;"><span id="doubleSpan2" style="display:inline-block">'+ this.badgeText2 + '</span></div>';
       // html = '<table><tr><td>' + txt;
        //html += '</td></tr><tr><td>' + this.badgeText2 + '</tr></td></table>';
    } else { // only one line of text
      //  html = '<span style="font-size:' + fontSize + 'pt;">' + txt + '</span>';
        html = "<div id='txtSingle' style='width:100%;height:78px;'><span id='singleSpan' style='display:inline-block'>" + this.badgeText + '</span></div>';
    }

    $("#badge-preview-text").html(html);

    // Check if textfill is available before using it
    if ($.fn.textfill) {
        $("#txtSpan1").textfill({
            widthOnly: true,
            maxFontPixels:30
        });

        $("#txtSpan2").textfill({
            widthOnly: true,
            maxFontPixels:30
        });

        $("#txtSingle").textfill({
            widthOnly: true,
            maxFontPixels:60
        });
    }

    //Changes undescroe color
    // $('.myUnderscore').css("color",$(".selectedColor").css("background-color") );

    //single line vertical and horizonrtal movce up on p,q,y..
    if(this.badgeText.length <= 7 && this.badgeText.length >0 && lineNumber==1){
     	if(checkForKeys(this.badgeText)){
			if(!wide){
				if(isIE || isChrome){
					$("#singleSpan").css("line-height","57px");
				}else
					$("#singleSpan").css("line-height","57px");
			}else{
				if(isIE || isChrome){
					$("#singleSpan").css("line-height","53px");
				}else
					$("#singleSpan").css("line-height","53px");
			}
     	}
    }

    //vertical 2 lines less tahn 7 chars p,q,y... text field2
    if(this.badgeText2.length <= 7 && lineNumber==2 && !wide){
    	if(checkForKeys(this.badgeText2)){
			$("#doubleSpan2").css("line-height","34px");
    	}
    }

    //vertical 2 lines less tahn 7 chars p,q,y... text field1
    if(this.badgeText.length <= 7 && lineNumber==2 && !wide){
    	if(checkForKeys(this.badgeText)){
			$("#doubleSpan2").css("line-height","34px");
    	}
    }

    //horizontal move up on the pqy
    if(this.badgeText2.length < 14 && lineNumber==2 && wide){
    	if(checkForKeys(this.badgeText2)){
			$("#doubleSpan2").css("line-height","34px");
    	}
	}
    
    if(lineNumber==2 && !wide){
    	if(this.badgeText.length >= 4 && this.badgeText2.length >=4){
    		var fSize1 = cleanStyleValue( $("#doubleSpan1").css("font-size"));
    		var fSize2 = cleanStyleValue( $("#doubleSpan2").css("font-size"));
    		if(fSize1>fSize2){
    			$("#doubleSpan1").css("font-size",fSize2);
    		}else {
    			$("#doubleSpan2").css("font-size",fSize1);
    		}
    	}
    	
    }

    var height;
    if(lineNumber==1){
    	height = $("#singleSpan").css("font-size");
    	height = Number(cleanStyleValue(height));
    	 //if height is to small stick at one postion vertical / horizontal
        if(height<46){
        	$("#singleSpan").css("line-height","85px");
        }
    }
    
    //two lines
    if(lineNumber==2){
    	height = $("#doubleSpan2").css("font-size");
    	height = Number(cleanStyleValue(height));
    	if(height<25 && !wide){
    		$("#doubleSpan2").css("line-height","56px");
        }
    	if(height<24 && wide){
    		$("#doubleSpan2").css("line-height","52px");
        }
    }
}

//check for q and y and reposition margins
function checkForKeys(text){
	if (text.search("q")>-1 || text.search("y")>-1 ||  text.search("p")>-1 ||  text.search("g")>-1 ||  text.search("j")>-1 ||  text.search("J")>-1){
		tilted = true;
		return true;
	} else return false;
}

function cleanStyleValue(value){
	var val = value;
	val = val.substring(0,val.length-2);
	return Number(val);
}

function replaceKey(value){
    if (!value) return value;

    var val = value;

    if (value.match(/\s/g)) {
        val = val.replace(/\s/g, '<span class="myUnderscore">a</span>');
        return val;
    } else if (value.match('-')) {
        val = val.replace('-', '<span >-</span>');
        return val;
    } else {
        return val;
    }
}

function changeColor(color) {
    if (!color) return;

    console.log('Changing color to:', color);

    // Remove all existing color variant classes
    $(".product.product--thumbnail_slider").removeClass (function (index, className) {
        return (className.match (/(^|\s)product-variant-color-\S+/g) || []).join(' ');
    });

    // Convert color name to CSS class format (replace all spaces with dashes, lowercase)
    var colorClass = 'product-variant-color-' + color.replace(/\s+/g, '-').toLowerCase();
    console.log('Adding class:', colorClass);

    $(".product.product--thumbnail_slider").addClass(colorClass);
}

$(document).ready(function() {
    //reset app
    resetApp();

    // Check for initial color selection (multiple possible selectors)
    var startColor = $("fieldset.product-form__input input[name='Color']:checked").val() ||
                     $(".color-swatch-wrapper input[name='Color']:checked").val() ||
                     $("input[name='Color']:checked").val();
    console.log('Initial color:', startColor);
    if (startColor) changeColor(startColor);

    $('#infiniteoptions-container').on('input', '.custom-line-1 input[type=text]', function() {
        console.log($(this).val());
        setBadgeText(replaceKey($(this).val()));
        $("#bb_option_custom_line_1").val($(this).val());
    });

    $('#infiniteoptions-container').on('input', '.custom-line-2 input[type=text]', function() {
        console.log($(this).val());
        setBadgeText(replaceKey($(this).val()), true);
        $("#bb_option_custom_line_2").val($(this).val());
    });

    // Listen for color changes - multiple possible selectors
    $(document).on('change', 'fieldset.product-form__input input[name="Color"]', function() {
        var selectedColor = $(this).val();
        console.log('Color changed to:', selectedColor);
        changeColor(selectedColor);
    });

    // Fallback for other color swatch implementations
    $(".color-swatch-wrapper .color-swatch-item, fieldset input[type='radio'][name='Color']").on('change click', function() {
        var selectedColor = $(this).val();
        console.log('Color selected:', selectedColor);
        changeColor(selectedColor);
    });
});

$(document).ready(function() {
  var target = $('#infiniteoptions-container')[0]; // [0] to get the native DOM element from jQuery object
  
  if (target) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log('Detected change in inner HTML');

        var line1Input = $('.custom-line-1 input[type=text]').val();
        if (line1Input && line1Input !== "") return;
        
        // Perform your logic here
        var line1 = getParameterByName('line1');
        var line2 = getParameterByName('line2');

        if (line1 || line2) {
          if (line1) {
            $('input[name="properties[Custom Line 1]"]').val(line1);
            setBadgeText(replaceKey(line1));
            $("#bb_option_custom_line_1").val(line1);
          }

          if (line2) {
            $('input[name="properties[Custom Line 2]"]').val(line2);
            setBadgeText(replaceKey(line2), true);
            $("#bb_option_custom_line_2").val(line2);
          }
        }
      });
    });

    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);
  } else {
    console.log('Element with ID infiniteoptions-container not found');
  }
});