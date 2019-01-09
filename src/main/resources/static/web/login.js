<<<<<<< HEAD
const email = () => document.getElementById("email-login").value
const password = () => document.getElementById("pass-login").value

const login = () => {
    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "username=" + email() + "&password=" + pass()
    }).then(response => {
        if (response.status === 200) {
            window.location.reload()
        } else if (response.status === 401) {
            alert("Can't login: wrong user or pass");
        } else {
            alert("A problem has occurred: " + response.status);
        }
    }).catch(error => console.log("An error has ocurred: ", error))
}

const logout = () => fetch('http://localhost:8080/api/logout', {
    method: 'POST',
    credentials: 'include'
}).then(() => window.location.reload())
    .catch(error => console.log("An error has ocurred: ", error))

const signup = () => {
    fetch('http://localhost:8080/api/players', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email(), password: pass()})
    }).then(response => {
        if (201 === response.status) {
            login()
            return response.json()
        } else {
            console.log("Algo salió mal: " + response.status)
            if (403 === response.status){
                alert("Username already in use")
            }
            throw new Error("Something went wrong: " + response)
        }
    }).then(r => console.log(r.status))
        .catch(error => console.log("An error has ocurred: ", error))
=======
const email = () => document.getElementById("email-login").value
const password = () => document.getElementById("pass-login").value

const login = () => {
    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "username=" + email() + "&password=" + pass()
    }).then(response => {
        if (response.status === 200) {
            window.location.reload()
        } else if (response.status === 401) {
            alert("Can't login: wrong user or pass");
        } else {
            alert("A problem has occurred: " + response.status);
        }
    }).catch(error => console.log("An error has ocurred: ", error))
}

const logout = () => fetch('http://localhost:8080/api/logout', {
    method: 'POST',
    credentials: 'include'
}).then(() => window.location.reload())
    .catch(error => console.log("An error has ocurred: ", error))

const signup = () => {
    fetch('http://localhost:8080/api/players', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email(), password: pass()})
    }).then(response => {
        if (201 === response.status) {
            login()
            return response.json()
        } else {
            console.log("Algo salió mal: " + response.status)
            if (403 === response.status){
                alert("Username already in use")
            }
            throw new Error("Something went wrong: " + response)
        }
    }).then(r => console.log(r.status))
        .catch(error => console.log("An error has ocurred: ", error))
>>>>>>> ecbb5b69e1a26bb351d994792946895e9c1ed972
}