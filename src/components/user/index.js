const USER = {
}

if (localStorage.getItem('username')) {
    USER['name'] = localStorage.getItem('username')
}
if (localStorage.getItem('usercolor')) {
    USER['color'] = localStorage.getItem('usercolor')
}
console.log(USER)


let userSaved = true

export const changeUser = () => userSaved = false
export const saveUser = () => userSaved = true

export const validUser = () => {
    if (!USER.name) return false
    if (!USER.color) return false
    return true
}


export const getUser = () => validUser() ? USER : null

export const setUserAttr = (attr, val) => {
    USER[attr] = val
    localStorage.setItem(`user${attr}`, val)
    makeValid()
}

const makeValid = () => {
    if (!USER.name) USER.name = "Guest"
    if (!USER.color) USER.color = "wheat"
}