console.log("Hello")

$(() => {
    $(".login-button").click(() => {
        $("#signupModalLabel").removeClass("active")
        $("#modalSignupForm").hide()   
        $("#loginModalLabel").addClass("active")
        $("#modalLoginForm").show()
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
