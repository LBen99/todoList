// *********************************
// *Login/Signup Modal Selection
// *********************************

$(() => {
    $(".login-button").click(() => {
        $("#signupModalLabel").removeClass("active")
        $("#modalSignupForm").hide()   
        $("#loginModalLabel").addClass("active")
        $("#modalLoginForm").show()
    })
})

$(() => {
    $(".signup-button").click(() => {
        $("#loginModalLabel").removeClass("active")
        $("#modalLoginForm").hide()   
        $("#signupModalLabel").addClass("active")
        $("#modalSignupForm").show()
    })
})

$(() => {
    $("#loginModalLabel").click(() => {
        $("#signupModalLabel").removeClass("active")
        $("#modalSignupForm").hide()
        $("#loginModalLabel").addClass("active")
        $("#modalLoginForm").show()
    })
})

$(() => {
    $("#signupModalLabel").click(() => {
        $("#loginModalLabel").removeClass("active")
        $("#modalLoginForm").hide()
        $("#signupModalLabel").addClass("active")
        $("#modalSignupForm").show()
    })
})

// *********************************
// *List Selection Dropdown
// *********************************

$(function() {
    $(".dropdown-menu li a").click(function() {      
        $(".btn:first-child").text($(this).text())
        $(".btn:first-child").val($(this).text())
        $("#submit-item-btn").val($(this).text())
        $("#thisId").val($(this).data("value"))
    })  
  })
