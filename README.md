# Auth Example

## This is an example of basic web authentication use Express, Sessions, Password Hashing and CSRF tokens.

### Sessions
These are handled with an npm package, ```clinet-sessions``` and express middlewear. The app checkes for a session in the request cookie and lacking one sends them to the login page. If one is found then the app uses that data to query the database and create a ```req.user``` object which holds the users information.

### Password Hashing
This is handled with another npm package, ```bcryptjs```. Again, use this package and some middlewear the app ensures that only hashed passwords are stored in the database and compared when checking authentication.

### CSRF Tokens
Again another package, ```csruf``` helps to handle this. We put a hidden input element in our form that is being submitted. This has a valuse which is our csrf token variable. Back in the app, we use ```csruf``` as a middle wear on all routes, and any route that renders a page with a form we pass it a csrfToken key value pair; ```csrfToken: req.csrfToken()```. Now the page served has a token and when the user posts said page the token will run through the middlewear which will confirm accuracy of the form.

## Final Lesson
Ideally, don't do this yourself. While web authentication is easy, edge cases are hard and those are the ones you really have to worry about. Instead build on someone elses work like the following:
- Passport
- Node-Login
- Aqua
- Okta