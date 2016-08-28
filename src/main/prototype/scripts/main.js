$(document).ready(function(){ 
	var cover = $('#cover');
	/*var about = $('#about');
	var services = $('#services');
	var portfolio = $('#portfolio');
	var skills = $('#skills');
	var resume = $('#resume');
	var testimonials = $('#testimonials');
	var contact = $('#contact');*/
	var content = ['cover', 'about','services','portfolio','skills','resume','testimonials','contact'];
	var $content = [];
	$(content).each(function(i,item){ 
		$content[i] = $('#' + item);
	})

	var navBar = $('#nav');  

 	isFixBar();

 	function isFixBar(){
 		if( window.scrollY > cover.height() ){
			navBar.addClass('navFixed');
			$('#blank').css('visibility','visible');//make the about region the same value
		}
		else{
			navBar.removeClass('navFixed');
			$('#blank').css('visibility','hidden');
		}
 	}

	$(window).scroll(function(){
		isFixBar();
		highlightNar();
	})

	$('.m-nav, .m-cover').click(function(e){
		var href = e.target.href;
		if( href){
			var id= href.split('#')[1];
			var target = $('#' + id); 

			$('html, body').stop().animate({
		        'scrollTop': target.offset().top
		    }, 500, 'linear');
		} 
		highlightNar();
	})

	function highlightNar(){ 
		for (var i = 0; i < $content.length-1; i++) { 
			comparePosition($content[i], $content[i+1], content[i+1]);
		}; 
		//hack when the contact height is not larger than the window height
		if( $(window).scrollTop() + $(window).height() == $(document).height() ) {
	       $("#contact").addClass('hover');
	       $("#testimonials").removeClass('hover');
	   }
	}

	function comparePosition(start, end, target){
		var select = 'a[href="#'+ target  + '"]';

		//hightlight only when the element is static
		var isAnimating = $("html, body").is(':animated'); 
		if(isAnimating){
			$(select).removeClass('hover'); 
			return;
		}

		if( window.scrollY >= start.offset().top + start.height() && window.scrollY < end.offset().top + end.height()){
			$(select).addClass('hover');
		}
		else{
			$(select).removeClass('hover');
		}
	}
})