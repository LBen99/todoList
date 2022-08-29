const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const wd = new Date()
let day = days[wd.getDay()]

const d = new Date()
let date = d.getDate()

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const m = new Date()
let month = months[m.getMonth()]

let fullDate = day + " " + date + " " + month

export default fullDate