import { Result, ResultEmailSendSuccess } from "../types/response.types"
import { EMAIL_VERIFICATION_TIME } from "./setting.config"

// success
export const signUpSuccess: Result = {
    code: 1000, 
    message: "Sign up successfully 🎉"
}

export const emailSendSuccess: ResultEmailSendSuccess = {
    code: 1001,
    message: "Sent a auth code to your email.",
    timeout: EMAIL_VERIFICATION_TIME
}

export const signInSuccess: Result = {
    code: 1002, 
    message: "Sign in successfully 🎉"
}

export const tokenRecreate: Result = {
    code: 1003,
    message: "Token Recreate"
}

export const signOutSuccess: Result = {
    code: 1004,
    message: "Sign out successfully"
}

export const passwordChangeSuccess: Result = {
    code: 1005,
    message: "Password change successfully"
}

export const profileImageChangeSuccess: Result ={
    code: 1006,
    message: "Profile image change successfully"
}

export const nickChangeSuccess: Result ={
    code: 1007,
    message: "Nick change successfully"
}

// Duplicate //
export const emailDuplicateError: Result = {
    code: 2001,
    message: "The email is a duplicate."
}

// invalid //
export const headersValidationError: Result = {
    code: 3002,
    message: "Invalid header information. "
}

export const authCodeValidationError: Result = {
    code: 3003,
    message: "Invalid authentication code."
}

export const promoCodeValidationError: Result = {
    code: 3004,
    message: "Invalid promo code."
}

export const memberValidationError: Result = {
    code: 3005,
    message: "The email or password is incorrect."
} 

// failed
export const emailFailedSend: Result = {
    code: 4000,
    message: "Email sending failed, please try again."
}

export const tokenVerificationFailed: Result = {
    code: 4001,
    message: "The token has expired."
}

export const insufficientBalanceFailed: Result = {
    code: 4002,
    message: "The agent's balance is lower than the user's game money."
}

export const noneUserFailed: Result = {
    code: 4003,
    message: "This user does not exist."
} 