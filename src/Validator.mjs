export const textValidator = {
    msg:{
        notEmpty:{errorMessage:"Message should not be empty"}
    },
    subject:{
        notEmpty:{errorMessage:"Subject should not be empty"}
    }
}
export const signinValidator={
    username:{
        notEmpty:{errorMessage:"Username Shoudnot be empty"}
    },
        password:{
        notEmpty:{errorMessage:"password Shoudnot be empty"},
        isLength:{
            options:{min:6},
            errorMessage:"Password must more than 6 characters"
        }
    }
}