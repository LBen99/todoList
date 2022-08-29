$(function(){
    $(".dropdown-menu li a").click(function(){      
        $(".btn:first-child").text($(this).text())
        $(".btn:first-child").val($(this).text())
        $("#submit-item-btn").val($(this).text())
        $("#thisId").val($(this).data("value"))
    })  
  })