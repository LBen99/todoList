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

$(() => {
    $(".get-started-button").click(() => {
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

// *********************************
// *Strike Through Task Text
// *********************************

$(".task-name").click(function() {
    $(this).toggleClass("is-striked")
    const id = $(this).attr("id")
    const strike = $(this).attr("value")
    $(".task-id").attr("value", id)
    $(".strike-task").attr("value", strike)
    $(".strike-item-form").submit()    
})

$(document).ready(function() {
    $(".strike-status").each(function() {
        const id = $(this).attr("id")
        const strike = $(this).attr("value")
        const doStrike = {id: id, strike: strike}
        $(".task-name").each(function() {
            if (doStrike.strike === "true" && $(this).attr("id") === doStrike.id) {
                $(this).addClass("is-striked")
            } else if (doStrike.strike === "false" && $(this).attr("id") === doStrike.id) {
                $(this).removeClass("is-striked")
            }
        })
    })
})