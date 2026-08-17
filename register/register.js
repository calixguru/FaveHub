const registerForm = document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const registerButtonText =
    document.getElementById("registerButtonText");

const registerLoader =
    document.getElementById("registerLoader");

const registerError =
    document.getElementById("registerError");

const registerSuccess =
    document.getElementById("registerSuccess");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const pinInput =
    document.getElementById("pin");

const confirmPinInput =
    document.getElementById("confirmPin");

const togglePin =
    document.getElementById("togglePin");

const toggleConfirmPin =
    document.getElementById("toggleConfirmPin");


// ----------------------------------------
// PIN VISIBILITY
// ----------------------------------------

togglePin.addEventListener(
    "click",
    function () {

        pinInput.type =
            pinInput.type === "password"
                ? "text"
                : "password";

    }
);


toggleConfirmPin.addEventListener(
    "click",
    function () {

        confirmPinInput.type =
            confirmPinInput.type === "password"
                ? "text"
                : "password";

    }
);


pinInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 4);

    }
);


confirmPinInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 4);

    }
);


// ----------------------------------------
// PASSWORD VISIBILITY
// ----------------------------------------

togglePassword.addEventListener(
    "click",
    function () {

        passwordInput.type =
            passwordInput.type === "password"
                ? "text"
                : "password";

    }
);


toggleConfirmPassword.addEventListener(
    "click",
    function () {

        confirmPasswordInput.type =
            confirmPasswordInput.type === "password"
                ? "text"
                : "password";

    }
);


// ----------------------------------------
// ERROR / SUCCESS
// ----------------------------------------

function showError(message) {

    registerError.textContent = message;

    registerError.classList.remove("hidden");

}


function hideError() {

    registerError.textContent = "";

    registerError.classList.add("hidden");

}


function showSuccess(message) {

    registerSuccess.textContent = message;

    registerSuccess.classList.remove("hidden");

}


// ----------------------------------------
// BEAUTIFUL SUCCESS OVERLAY
// ----------------------------------------

function showRegistrationSuccess() {

    const overlay = document.createElement("div");

    overlay.id = "registrationSuccessOverlay";

    overlay.className = `
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        px-5
        bg-slate-950/40
        dark:bg-black/60
        backdrop-blur-md
    `;


    overlay.innerHTML = `

        <div
            id="registrationSuccessCard"
            class="
                w-full
                max-w-sm
                rounded-3xl
                border
                border-slate-200
                dark:border-white/10
                bg-white
                dark:bg-slate-900
                shadow-2xl
                p-7
                text-center
                transform
                scale-95
                opacity-0
                transition-all
                duration-300
            "
        >

            <!-- SUCCESS ICON -->

            <div
                class="
                    mx-auto
                    w-16
                    h-16
                    rounded-full
                    bg-green-100
                    dark:bg-green-500/10
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    class="
                        w-11
                        h-11
                        rounded-full
                        bg-green-500
                        flex
                        items-center
                        justify-center
                        text-white
                        text-2xl
                        font-bold
                        shadow-lg
                        shadow-green-500/30
                    "
                >
                    ✓
                </div>

            </div>


            <!-- TITLE -->

            <h2
                class="
                    mt-5
                    text-xl
                    font-black
                    text-slate-900
                    dark:text-white
                "
            >
                Account Created!
            </h2>


            <!-- MESSAGE -->

            <p
                class="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-white/45
                "
            >
                Welcome to FaveHub.
                Your account has been created successfully.
            </p>


            <!-- REDIRECT MESSAGE -->

            <div
                class="
                    mt-4
                    text-xs
                    font-medium
                    text-green-600
                    dark:text-green-400
                "
            >
                Taking you to your dashboard...
            </div>


            <!-- PROGRESS -->

            <div
                class="
                    mt-6
                    h-1
                    rounded-full
                    bg-slate-100
                    dark:bg-white/10
                    overflow-hidden
                "
            >

                <div
                    id="registrationSuccessProgress"
                    class="
                        h-full
                        w-0
                        bg-green-500
                        rounded-full
                    "
                ></div>

            </div>

        </div>
    `;


    document.body.appendChild(overlay);


    // ----------------------------------------
    // CARD ANIMATION
    // ----------------------------------------

    requestAnimationFrame(() => {

        const card =
            document.getElementById(
                "registrationSuccessCard"
            );

        card.classList.remove(
            "scale-95",
            "opacity-0"
        );

        card.classList.add(
            "scale-100",
            "opacity-100"
        );

    });


    // ----------------------------------------
    // PROGRESS ANIMATION
    // ----------------------------------------

    requestAnimationFrame(() => {

        const progress =
            document.getElementById(
                "registrationSuccessProgress"
            );

        progress.style.transition =
            "width 1.5s linear";

        progress.style.width =
            "100%";

    });


    // ----------------------------------------
    // REDIRECT
    // ----------------------------------------

    setTimeout(() => {

        window.location.href = "/FaveHub/login";

    }, 1500);

}


// ----------------------------------------
// LOADING
// ----------------------------------------

function setLoading(loading) {

    registerButton.disabled = loading;

    if (loading) {

        registerButtonText.classList.add("hidden");

        registerLoader.classList.remove("hidden");

    } else {

        registerButtonText.classList.remove("hidden");

        registerLoader.classList.add("hidden");

    }

}


// ----------------------------------------
// DISPLAY DJANGO ERRORS
// ----------------------------------------

function getErrorMessage(data) {

    if (!data) {

        return "Registration failed.";

    }


    if (typeof data.detail === "string") {

        return data.detail;

    }


    const errors = [];


    for (const field in data) {

        const value = data[field];


        if (Array.isArray(value)) {

            errors.push(
                `${field}: ${value.join(", ")}`
            );

        }

        else if (typeof value === "string") {

            errors.push(
                `${field}: ${value}`
            );

        }

    }


    if (errors.length > 0) {

        return errors.join(" ");

    }


    return "Unable to create your account.";

}


// ----------------------------------------
// REGISTER
// ----------------------------------------

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        hideError();

        registerSuccess.classList.add("hidden");


        const firstName =
            document
                .getElementById("firstName")
                .value
                .trim();


        const lastName =
            document
                .getElementById("lastName")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const phoneNumber =
            document
                .getElementById("phoneNumber")
                .value
                .trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;

        const pin =
            pinInput.value;

        const confirmPin =
            confirmPinInput.value;


        // ------------------------------------
        // FRONTEND VALIDATION
        // ------------------------------------

        if (!firstName) {

            showError(
                "Please enter your first name."
            );

            return;

        }


        if (!lastName) {

            showError(
                "Please enter your last name."
            );

            return;

        }


        if (!email) {

            showError(
                "Please enter your email address."
            );

            return;

        }


        if (!phoneNumber) {

            showError(
                "Please enter your phone number."
            );

            return;

        }


        if (password.length < 6) {

            showError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (password !== confirmPassword) {

            showError(
                "Passwords do not match."
            );

            return;

        }

        if (!/^\d{4}$/.test(pin)) {

            showError(
                "Your PIN must be exactly 4 digits."
            );

            return;

        }


        if (pin !== confirmPin) {

            showError(
                "PINs do not match."
            );

            return;

        }


        setLoading(true);


        try {

            // --------------------------------
            // REGISTER REQUEST
            // --------------------------------

            const response = await fetch(
                `${API_BASE_URL}/auth/register/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({

                        first_name:
                            firstName,

                        last_name:
                            lastName,

                        email:
                            email,

                        phone_number:
                            phoneNumber,

                        password:
                            password,

                        confirm_password:
                            confirmPassword,

                        pin:
                            pin,

                        confirm_pin:
                            confirmPin

                    })
                }
            );


            let data = {};


            try {

                data =
                    await response.json();

            } catch (error) {

                data = {};

            }


            // --------------------------------
            // FAILED
            // --------------------------------

            if (!response.ok) {

                showError(
                    getErrorMessage(data)
                );

                setLoading(false);

                return;

            }


            // --------------------------------
            // SAVE TOKENS
            // --------------------------------

            if (data.access) {

                localStorage.setItem(
                    "datahub_access_token",
                    data.access
                );

            }


            if (data.refresh) {

                localStorage.setItem(
                    "datahub_refresh_token",
                    data.refresh
                );

            }


            localStorage.setItem(
                "datahub_logged_in",
                "true"
            );


            // --------------------------------
            // SUCCESS
            // --------------------------------

            setLoading(false);

            showRegistrationSuccess();

        }


        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showError(
                "Unable to connect to DataHub. Please try again."
            );


            setLoading(false);

        }

    }
);
