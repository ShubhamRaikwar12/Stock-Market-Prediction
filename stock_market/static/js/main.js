$(window).on('load', function() { // makes sure the whole site is loaded 
  $('.spinner').fadeOut(); // will first fade out the loading animation 
  $('.preloader').delay(250).fadeOut('slow'); // will fade out the white DIV that covers the website. 
  $('body').delay(250).css({'overflow':'visible'});
})


$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 150) {
        $("#main").css('background', '#f3f7f8');
        $(".hicon").css('color', '#095BAF');
        $(".hps").css('position', 'fixed');
        //$('meta[name=theme-color]').attr('content','#f3f7f8');
    } else {
        $("#main").css('background', 'transparent');
        $(".hicon").css('color', '#fff');
        $(".hps").css('position', 'sticky');
        //$('meta[name=theme-color]').attr('content','#095baf');
    }
});
setInterval(function(){ 
   // toggle the class every five second
   $('#notifications').toggleClass('bell');  
   setTimeout(function(){
     // toggle back after 1.5 second
     $('#notifications').toggleClass('bell');  
   },1500)

},30000);
function openNav() {
  document.getElementById("mySidenav").style.width = "310px";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("sidenavfull").style.width= "100%";
}

$(document).ready(function(){
$(".show-btn").click(function(){$("#details-box").css("left", "0");});
$(".hide-btn").click(function(){$("#details-box").css("left", "100%");});
$("input").click(function(){$(".cpfoi").fadeOut("fast");});
$("input").focusout(function(){$(".cpfoi").fadeIn("fast");});
var shortText = $("#shortText").text();
function trim_text (str, length, ending) {
    if (length == null) {
      length = 35;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };
$("#shortText").text(trim_text(shortText));
});

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("sidenavfull").style.width= "0";
}

window.onhashchange = function() {       
    if (location.hash.length > 0) {        
     parseInt(location.hash.replace('#',''),10);     
    } else {
         0;
         $(".cbox").css('width', '0');
         $(".cbox2").css('left', '100%');
    }
}

 function shareimage()
    {
        
    var shareText= "Finally found a simple and smart way to find IFSC , SWIFT , BSR , CSC , LPG and PIN code. 100+ financial tools are on this app.\n\nGive it a try!";
    
    var shareLink= "https://play.google.com/store/apps/details?id=com.sarkaribank";
    
    var shareType="1";
    
    Android.shareButtonClicked(shareText, shareLink, shareType);
    }
    
    
    function sharetext()
    {
        
    var shareText= "Finally found a simple and smart way to find IFSC , SWIFT , BSR , CSC , LPG and PIN code. 100+ financial tools are on this app.\n\nGive it a try!";
    
    var shareLink= "https://play.google.com/store/apps/details?id=com.sarkaribank";
    
    var shareType="0";
    
    Android.shareButtonClicked(shareText, shareLink, shareType);
    }

document.addEventListener('contextmenu', event => event.preventDefault());
var tmt_str='';
var decimal=false;
var grate='0';
var selected='agst';
var namt=0;
var total_amt=0;

function iamt_numpad(x) {
//checking 0 and 00
if(x=='0' || x == '00')
{
	if(tmt_str != 0){
		tmt_str=tmt_str.concat(x);
	}
}
//checking .
if(x=='.'){
	if(tmt_str.length=='0'){
		tmt_str='0'.concat(tmt_str.concat(x));
		decimal=true;
	}
	else if(!decimal){
		tmt_str=tmt_str.concat(x);
		decimal=true;
	}
}
//checking 1-9
if (Number(x)>0 && Number(x)<=9)
{
	tmt_str=tmt_str.concat(x);
}

//checking backspace
$('#iamt').val(tmt_str);
showresult();

}

function backspace()
{
	var lastChar = tmt_str[tmt_str.length -1];
	if (lastChar=='.')
	{
		decimal=false;
	}

	if(tmt_str.length > 0)
	{
		tmt_str = tmt_str.substring(0, tmt_str.length-1);
	}

	$('#iamt').val(tmt_str);

	showresult();
}





function gratep(x)
{
grate=x.substring(0,x.length-1);
$('#grate').val(x);
showresult();
}


function addgst()
{
	var initial_amt=Number(tmt_str);
	var grate_n=Number(grate);
	var gst_amt1=(grate_n/100)*initial_amt;
	total_amt=initial_amt+gst_amt1;

	total_amt=Math.round(total_amt*100)/100;
	gst_amt1=Math.round(gst_amt1*100)/100;

	$('#namt').val(initial_amt);
	$('#gamt').val(gst_amt1);
	$('#tamt').val(total_amt);
	$('#igst').val(grate_n.toString()+'%');
	$('#igstamt').val(gst_amt1);
	$('#cgst').val((grate_n/2).toString()+'%');
	$('#cgstamt').val(gst_amt1/2);
	$('#sgst2').val((grate_n/2).toString()+'%');
	$('#sgstamt').val(gst_amt1/2);
	

}

function removegst()
{
	var initial_amt=Number(tmt_str);
	var grate_n=Number(grate);
	namt=(100*initial_amt)/(100+grate_n);
	gst_amt2=initial_amt - namt;

	namt=Math.round(namt*100)/100;
	gst_amt2=Math.round(gst_amt2*100)/100;

	$('#namt').val(namt);
	$('#gamt').val(gst_amt2);
	$('#tamt').val(initial_amt);
	$('#igst').val(grate_n.toString()+'%');
	$('#igstamt').val(gst_amt2);
	$('#cgst').val((grate_n/2).toString()+'%');
	$('#cgstamt').val(gst_amt2/2);
	$('#sgst2').val((grate_n/2).toString()+'%');
	$('#sgstamt').val(gst_amt2/2);

}

function showresult()
{
	if (tmt_str!='0')
	{
	if (selected=='agst'){
		addgst();
	}
	else
	{
		removegst();
	}
}
}


$(document).ready(function(){
$(".num").click(function(){
    iamt_numpad($(this).val())
    });
$('#back').click(function(){
backspace();
});

$('.clear').click(function(){
	$('#iamt').val('');
	$('#grate').val('0%');
	$('#namt').val('0');
	$('#gamt').val('0');
	$('#tamt').val('0');
	$('#igst').val('0%');
	$('#igstamt').val('0');
	$('#cgst').val('0%');
	$('#cgstamt').val('0');
	$('#sgst2').val('0%');
	$('#sgstamt').val('0');
	tmt_str='';
	grate='0'
});

$('#hide').click(function(){
document.getElementById("keypad").style.bottom = "-400px";
});

$(".gstp").click(function(){
gratep($(this).val());
});

$('#iamt').click(function(){
document.getElementById("keypad").style.bottom = "0";


});

$('#grate').click(function(){
	$('.calculator-pad').show();

});

$('#agst').click(function(){
	selected='agst';
	$('#agst').addClass('cgr');
	$('#sgst').removeClass('cgr');
	showresult();
});

$('#sgst').click(function(){
selected='sgst';
	$('#sgst').addClass('cgr');
	$('#agst').removeClass('cgr');
showresult();
});

});