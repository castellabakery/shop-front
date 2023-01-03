import {atom} from "recoil"

const isAuthenticated = atom({
    key: "isAuthenticated",
    default: false
})

export { isAuthenticated }