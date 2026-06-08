import bcrypt from "bcrypt"
const saltRound = 10
export const hashpassword = (password)=>{
    const salt=bcrypt.genSaltSync(saltRound)
    return bcrypt.hashSync(password,salt)
}
export const compare = (plain,hashed)=>{
    return bcrypt.compareSync(plain,hashed)
}
