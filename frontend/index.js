const createPostBtn = document.querySelector(".createPost")
const loginBtn = document.querySelector(".loginBtn")
const signUpBtn = document.querySelector(".signUpBtn")

createPostBtn.addEventListener('click', () => {
    window.location.href="createpost.html"
})

loginBtn.addEventListener('click', () => {
    window.location.href="login.html"
})

signUpBtn.addEventListener('click', () => {
    window.location.href="signup.html"
})