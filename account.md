# Gaming Solution Server APi.
## Required headers
HTTP Headers
1. 'GF-API-KEY': 'abcedef'
2. 'GF-AFFILIATE-CODE': 'abcde'

This is the value the client needs to communicate with the server.
The value for each client is different.
Please manage your affiliate code and API key through Sveltekit's env.

## sign-up API
> Send a auth code by email
- endpoint: /api/account/sign-up/email
- method: post
- data: email (string)

#### response
````
//success
{
    code: 1001,
    message: "sent a verification code to your email.",
    timeout: EMAIL_VERIFICATION_TIME // <-- The auth code expiration time.
}

// error
{
    code: 2100,
    message: "The email is a duplicate."
}

{
    code: 3000,
    message: "Email delivery failed, please try again."
}
````

> Sign up
- endpoint: /api/account/sign-up
- method: post
- data: email(string), authCode(string), promoCode(stirng)/optional, password(string)

#### response
````
//success
{
    code: 1000, 
    message: "Sign up successfully 🎉"
}

// error
{
    code: 2100,
    message: "The email is a duplicate."
}
{
    code: 2000,
    message: "Invalid header information. "
}
{
    code: 2200,
    message: "Invalid authentication code."
}
{
    code: 2201,
    message: "Invalid promo code."
}
````

> Social sign-up
- endpoint: /api/account/social/sign-up/
- method: post
- data: email(string), password(string)/ Create a password by combining the data provided by the API, loginType/google, facebook etc..

````
// success   
{
    code: 1000, 
    message: "Sign up successfully 🎉"
}

// error
{
    code: 2001,
    message: "The email is a duplicate."
}

logic
success -> sign-up -> sign-in
error -> sign-in
````

## Sign in API
> Sign in
- endpoint: /api/account/sign-in
- method: post
- data: email(string), password(string)
- cookie name: accesstoken, refreshtoken
- credentials:"include" (fetch), withCredentials: true (axios)

#### response
````
// success
{
    code: 1002, 
    message: "Sign in successfully 🎉"
}

// error
{
    code: 3005,
    message: "The email or password is incorrect."
} 
````

> Sign in success
- endpoint: /api/account/sign-in/success
- method: post
- credentials:"include" (fetch), withCredentials: true (axios)
- description: Gets information about the accesstoken.

#### response
````
// error
{
    code: 4001,
    message: "The token has expired."
}
````

> Sign in success
- endpoint: /api/account/sign-in/refresh
- method: post
- credentials:"include" (fetch), withCredentials: true (axios)
- description: Reissue the access and refresh tokens. If the refreshtoken has expired, it will raise an error.

#### response
````
// success
{
    code: 1003,
    message: "Token Recreate"
}

// error
{
    code: 4001,
    message: "The token has expired."
}
````

## Sign out API
>sign out
- endpoint: /api/account/sign-out
- method: post
- credentials:"include" (fetch), withCredentials: true (axios)
- description: Initialiseer het accesstoken.

#### response
````
// success
{
    code: 1004,
    message: "Sign out successfully"
}
````

## Forgot password API

> Send a auth code by email
- endpoint: /api/account/forgot-password/email
- method: post
- data: email (string)

#### response
````
//success
{
    code: 1001,
    message: "sent a verification code to your email.",
    timeout: EMAIL_VERIFICATION_TIME // <-- The auth code expiration time.
}

// error
{
    code: 3000,
    message: "Email delivery failed, please try again."
}
````

> Change password
- endpoint: /api/account/forgot-password/change
- method: post
- data: email (string), password(string), authCode(string)

#### response
````
//success
{
    code: 1005,
    message: "password change successfully"
}
````

## Profile API
> Change the profile image.
- endpoint: /api/account/profile/image
- method: post
- data: memberIdx(number), profileImage(string)

#### response
````
//success
{
    code: 1006,
    message: "Profile image change successfully"
}
````

> Change the nick.
- endpoint: /api/account/profile/nick
- method: post
- data: memberIdx(number), nick(string)

#### response
````
//success
{
    code: 1006,
    message: "Nick change successfully"
}
````
