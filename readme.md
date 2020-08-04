# Shopping App
A multivendor Ecommerce app building with Express.js, mongoose.js and mongodb.
Clone project, Run npm install and then run npm start to start the project on localhost:3000

Admin credentials: { `To be POST send through Request Body`
  email: admin1
  password: admin1234
}


## User Endpoints
1. For signup (localhost:3000/api/users/signup)
  while signing up we do post request passing data in request body: {name, email, username, password, confirmPassord} 

2. For Login (localhost:3000/api/users/login)
  To login we make post request by passing data: {username or email, password} in request body. This will generate a jwt toekn and save it into the cookies

3. For Forgot Password (localhost:3000/api/users/forgotpassword)
  we make a post request with data: {email or username} to the server. This will further send an email to user's email. Currently, mailtrap is integrated which will not send our email to the user but it will capture the email in its inbox. To check mailtrap you can add your mailtrap username and password to the config.env file fields= EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT generated after the signup for the smtp server.

4. For Reset Password (localhost:3000/api/users/resetpassword/token)
  In this Endpoint the token will be the original token of 32 characters. The User will click this link from its email and will then make a patch request to the server by providing data: {password, confirmPassword} to generate new password.

5. For Update Password (localhost:3000/api/users/updatepassword) User must Login before accessing this route.
  In this Endpoint user will update their password. User must login before accessing this route. User will provide {currentPassword, password, confirmPassword} in data.

## Products Endpoints (Proected Routes User must login)

1. For all Products (localhost:3000/api/products)
  Shows all products with GET request.

  1. URL have functionality like filter data ex:- `localhost:3000/api/products?catagory=cloth&price[lte]=500`. This will fetch the data of a product which have a catagory: cloth and price =< 700

  2. URL for sorting data will be ex:- `localhost:3000/api/products?catagory=cloth&price[lte]=500&filter=-ratingsAverage`. This will fetch the same data as above but now it will sort the data in a descending rating manner. The minus sign before ratingAverage will send the data in descending manner and no sign will send the data in ascending manner.


2. For single product (localhost:3000/api/products/productId)
  Shows the data of single product by making GET request.
