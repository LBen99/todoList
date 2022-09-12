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
// *New Task/List Modal Selection
// *********************************

$(() => {
    $(".new-item-button").click(() => {
        $("#addListModalLabel").removeClass("active")
        $("#modalAddListForm").hide()
        $("#addItemModalLabel").addClass("active")
        $("#modalAddItemForm").show()
        $(".add-item-list-nav").text("Create New Task!")
    })
})

$(() => {
    $("#addItemModalLabel").click(() => {
        $("#addListModalLabel").removeClass("active")
        $("#modalAddListForm").hide()
        $("#addItemModalLabel").addClass("active")
        $("#modalAddItemForm").show()
        $(".add-item-list-nav").text("Create New Task!")
    })
})

$(() => {
    $("#addListModalLabel").click(() => {
        $("#addItemModalLabel").removeClass("active")
        $("#modalAddItemForm").hide()
        $("#addListModalLabel").addClass("active")
        $("#modalAddListForm").show()
        $(".add-item-list-nav").text("Create New List!")
    })
})

// *********************************
// *List Selection Dropdown
// *********************************

$(function() {
    $(".dropdown-menu li a").click(function() {
        const id = $(this).attr("id")
        const list = $(this).attr("name")
        $(".add-item-modal-dropdown").text($(this).text())
        $(".save-list-id").attr("value", id)
        $(".save-item-button").attr("value", list)
    })  
  })

  $(function() {
    const list = $(".add-item-modal-dropdown").text()
    $("#saveListId").attr("value", list)
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