$(document).ready(function(){

  var yourNavigation = $("header");
  stickyDiv = "scrolled";
  yourHeader = $('header').height();

  $(window).scroll(function() {
      if( $(this).scrollTop() > 0 ) {
          yourNavigation.addClass(stickyDiv);
          if(window.innerWidth <= 1024){
              $(".nav").addClass("scrolled");
          }
      } else {
          yourNavigation.removeClass(stickyDiv);
          if(window.innerWidth <= 1024){
              $(".nav").removeClass("scrolled");
          }
      }
  });

  $(".burger").click(function(){
    $(".menu").toggleClass("show");
    $($(this).children("i")).toggleClass("fa-bars fa-times");
  });

  var addClassOnScroll = function () {
    var windowTop = $(window).scrollTop();
    $('section[id]').each(function (index, elem) {
      var offsetTop = $(elem).offset().top;
      var outerHeight = $(this).outerHeight(true);

      if (windowTop > (offsetTop - 50) && windowTop < (offsetTop + outerHeight)) {
        var elemId = $(elem).attr('id');
        $(".menu-item.active").removeClass('active');
        $(".menu-item[href='#" + elemId + "']").addClass('active');
      }
    });
  };

  var addFadeOnScroll = function () {
    var windowBottom = $(this).scrollTop() + $(this).innerHeight();
    

    $(".fade-in").each(function() {
        
        var objectBottom = $(this).offset().top + $(this).outerHeight();
       
        if (objectBottom < windowBottom) {
          if ($(this).css("opacity")==0) {$(this).fadeTo(1000,1);}
        } else { 
          if ($(this).css("opacity")==1) {$(this).fadeTo(1000,0);}
        }
      });
  };

  $(function () {
    $(window).on('scroll', function () {
      addClassOnScroll();
      addFadeOnScroll();
    });
  });
  
    
  $(".tab-header a").click(function(ttt){
    ttt.preventDefault();
    $(".tab-header a").removeClass("active");
    $(".tab-ct .ct").removeClass("show");

    $(this).addClass("active");
    $($(this).attr("href")).addClass("show");

    
  });

});