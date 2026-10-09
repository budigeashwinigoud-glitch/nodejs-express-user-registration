const registrationForm =
    document.getElementById("registrationForm");

const message =
    document.getElementById("message");

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");

const registerButton =
    document.getElementById("registerButton");

const buttonText =
    document.getElementById("buttonText");


// =========================
// SHOW / HIDE PASSWORD
// =========================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        password.type = "password";

        togglePassword.textContent = "Show";
    }

});


// =========================
// PASSWORD STRENGTH
// =========================

password.addEventListener("input", () => {

    const value = password.value;

    let strength = 0;

    if (value.length >= 6) {
        strength++;
    }

    if (/[A-Z]/.test(value)) {
        strength++;
    }

    if (/[0-9]/.test(value)) {
        strength++;
    }

    if (/[^A-Za-z0-9]/.test(value)) {
        strength++;
    }


    if (value.length === 0) {

        strengthBar.style.width = "0%";

        strengthText.textContent =
            "Password strength";

    } else if (strength <= 1) {

        strengthBar.style.width = "25%";

        strengthText.textContent =
            "Weak password";

    } else if (strength === 2) {

        strengthBar.style.width = "50%";

        strengthText.textContent =
            "Fair password";

    } else if (strength === 3) {

        strengthBar.style.width = "75%";

        strengthText.textContent =
            "Good password";

    } else {

        strengthBar.style.width = "100%";

        strengthText.textContent =
            "Strong password";
    }

});


// =========================
// REGISTRATION
// =========================

registrationForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const passwordValue =
        password.value;


    message.textContent =
        "Creating your account...";

    message.style.color = "#2563eb";


    registerButton.disabled = true;

    buttonText.textContent =
        "Creating Account...";


    try {

        const response = await fetch(
            "/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: passwordValue
                })
            }
        );


        const data =
            await response.json();


        if (response.ok) {

            message.textContent =
                "✓ " + data.message;

            message.style.color =
                "#15803d";


            registrationForm.reset();

            strengthBar.style.width =
                "0%";

            strengthText.textContent =
                "Password strength";


        } else {

            message.textContent =
                data.message || "Registration failed";

            message.style.color =
                "#dc2626";
        }


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";

        message.style.color =
            "#dc2626";

    } finally {

        registerButton.disabled =
            false;

        buttonText.textContent =
            "Create Account";
    }

});