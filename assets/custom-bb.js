var lineNumber = 1;
var badgeText = "";
var badgeText2 = "";
var colorName = "Blue";

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function sanitizeText(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function selectVerticalBadgeBottom() {
  $(".selectedColor").css({width: "129px", "margin-left": "68px", "margin-top": "-121px", height: "86px"});
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
  $(".selectedBadge").attr('src', '//cdn.shopify.com/s/files/1/1260/4809/products/BB-1XL-CUSTOM-BLUE-H.png?v=1688152738');

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
  $(".selectedBadge").attr('src', '//www.specialistid.com/cdn/shop/t/68/assets/BB-1XL-CUSTOM-RED-V_800x800.png?v=136908169347785232851690782186');

  $(".verimg").css("display", "none");
  $("#imgVertical").css("border", "3px solid #F5911F");
  $("#tab2").addClass("vertical-badge-buddies-1xl");

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

function resetApp() {
  $("#inputQuntity").val("6");

  var custom_bb_type = $(".custom_bb_type").val();

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

  resetText();
}

function resetText(){
    $("#inputText1").val("");
    $("#badgeOneLine").val("");

    $("#inputText2").val("");
    $("#badgeSecondLine").val("");

    setBadgeText('');
    setBadgeText('',true);
}

function fixTextPosition(tab){
	if(wide){
		$('#badge-preview-text').attr( "class", "badge-preview-text-tab"+tab +"w");
	}else{
		$('#badge-preview-text').attr( "class", "badge-preview-text-tab"+tab );
	}

	if(lineNumber==2){
		$('#badge-preview-text').attr( "class", $('#badge-preview-text').attr( "class") + "line2");
	}
}

function setBadgeText(txt, secondLine) {
    if (secondLine) {
        badgeText2 = txt;
    } else {
        badgeText = txt;
    }

    // Determine line count based on whether line 2 actually has content
    var line2Val = $(".custom-line-2 input[type=text]").val() || "";
    var hasSecondLine = (badgeText2 && badgeText2 !== "") || (line2Val !== "");
	if(hasSecondLine){
		lineNumber = 2;
	}else{
		lineNumber = 1;
	}
    if(badgeText == undefined){
    	badgeText = "";
    }

    if(badgeText2 == undefined){
    	badgeText2 = "";
    }

    var html;

    if (lineNumber == 2 && secondLine) {
    	html = '<div id="txtSpan1" style="width:100%;height:50%;"><span id="doubleSpan1" style="display:inline-block">' + badgeText + '</span></div>';
    	html += '<div id="txtSpan2" style="width:100%;height:50%;"><span id="doubleSpan2" style="display:inline-block">' + txt + '</span></div>';
    } else if (lineNumber == 2) {
    	html = '<div id="txtSpan1" style="width:100%;height:50%;"><span id="doubleSpan1" style="display:inline-block">' + txt+'</span></div>';
        html += '<div id="txtSpan2" style="width:100%;height:50%;"><span id="doubleSpan2" style="display:inline-block">'+ badgeText2 + '</span></div>';
    } else {
        html = "<div id='txtSingle' style='width:100%;height:100%;'><span id='singleSpan' style='display:inline-block'>" + badgeText + '</span></div>';
    }

    $("#badge-preview-text").html(html);

    if ($.fn.textfill) {
        $("#txtSpan1").textfill({
            maxFontPixels:40
        });

        $("#txtSpan2").textfill({
            maxFontPixels:40
        });

        $("#txtSingle").textfill({
            maxFontPixels:60
        });
    }

    // Adjust line-height for descender characters (p, q, y, g, j)
    if(badgeText.length <= 7 && badgeText.length >0 && lineNumber==1){
     	if(checkForKeys(badgeText)){
			if(!wide){
				$("#singleSpan").css("line-height","57px");
			}else{
				$("#singleSpan").css("line-height","53px");
			}
     	}
    }

    if(badgeText2.length <= 7 && lineNumber==2 && !wide){
    	if(checkForKeys(badgeText2)){
			$("#doubleSpan2").css("line-height","34px");
    	}
    }

    if(badgeText.length <= 7 && lineNumber==2 && !wide){
    	if(checkForKeys(badgeText)){
			$("#doubleSpan2").css("line-height","34px");
    	}
    }

    if(badgeText2.length < 14 && lineNumber==2 && wide){
    	if(checkForKeys(badgeText2)){
			$("#doubleSpan2").css("line-height","34px");
    	}
	}

    if(lineNumber==2 && !wide){
    	if(badgeText.length >= 4 && badgeText2.length >=4){
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
        if(height<46){
        	$("#singleSpan").css("line-height","85px");
        }
    }

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

function checkForKeys(text){
	if (/[qypgjJ]/.test(text)){
		tilted = true;
		return true;
	} else return false;
}

function cleanStyleValue(value){
	return Number(parseFloat(value));
}

function replaceKey(value){
    if (!value) return value;

    var val = sanitizeText(value);

    if (val.match(/\s/g)) {
        val = val.replace(/\s/g, '<span class="myUnderscore">a</span>');
        return val;
    } else if (val.match('-')) {
        val = val.replace('-', '<span >-</span>');
        return val;
    } else {
        return val;
    }
}

function changeColor(color) {
    if (!color) return;

    var $productContainer = $(".product").first();
    if ($productContainer.length === 0) {
        $productContainer = $("body");
    }

    $productContainer.removeClass(function (index, className) {
        return (className.match (/(^|\s)product-variant-color-\S+/g) || []).join(' ');
    });

    var colorClass = 'product-variant-color-' + color.replace(/\s+/g, '-').toLowerCase();
    $productContainer.addClass(colorClass);
}

$(document).ready(function() {
    resetApp();

    // Detect initial color selection
    var startColor = null;
    $("input[type='radio']:checked").each(function() {
        var inputName = $(this).attr('name');
        if (inputName && inputName.toLowerCase().indexOf('color') !== -1) {
            startColor = $(this).val();
            return false;
        }
    });

    if (startColor) {
        changeColor(startColor);
    } else {
        $("input[type='radio']").each(function() {
            var inputName = $(this).attr('name');
            if (inputName && inputName.toLowerCase().indexOf('color') !== -1) {
                startColor = $(this).val();
                changeColor(startColor);
                return false;
            }
        });
    }

    // Text input listeners
    $('#infiniteoptions-container').on('input', '.custom-line-1 input[type=text]', function() {
        setBadgeText(replaceKey($(this).val()));
        $("#bb_option_custom_line_1").val($(this).val());
    });

    $('#infiniteoptions-container').on('input', '.custom-line-2 input[type=text]', function() {
        setBadgeText(replaceKey($(this).val()), true);
        $("#bb_option_custom_line_2").val($(this).val());
    });

    // Single color change listener that handles all color-related radio inputs
    $(document).on('change', 'input[type="radio"]', function() {
        var inputName = $(this).attr('name');
        if (inputName && inputName.toLowerCase().indexOf('color') !== -1) {
            changeColor($(this).val());
        }
    });

    // MutationObserver for infinite options container (pre-fill from URL params)
    var target = $('#infiniteoptions-container')[0];

    if (target) {
        var observer = new MutationObserver(function() {
            var line1Input = $('.custom-line-1 input[type=text]').val();
            if (line1Input && line1Input !== "") return;

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

        var config = { attributes: true, childList: true, characterData: true, subtree: true };
        observer.observe(target, config);
    }
});