const loginForm = document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginLoader =
    document.getElementById("loginLoader");

const loginError =
    document.getElementById("loginError");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


// --------------------------------------------------
// SHOW / HIDE PASSWORD
// --------------------------------------------------

togglePassword.addEventListener(
    "click",
    function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

        } else {

            passwordInput.type = "password";

        }

    }
);


// --------------------------------------------------
// DISPLAY ERROR
// --------------------------------------------------

function showError(message) {

    loginError.textContent = message;

    loginError.classList.remove("hidden");

}


function hideError() {

    loginError.textContent = "";

    loginError.classList.add("hidden");

}


// --------------------------------------------------
// LOADING STATE
// --------------------------------------------------

function setLoading(loading) {

    loginButton.disabled = loading;

    if (loading) {

        loginButtonText.classList.add("hidden");

        loginLoader.classList.remove("hidden");

    } else {

        loginButtonText.classList.remove("hidden");

        loginLoader.classList.add("hidden");

    }

}


// --------------------------------------------------
// SUCCESS MESSAGE
// --------------------------------------------------

function showLoginSuccess() {

    // Create overlay
    const overlay = document.createElement("div");

    overlay.id = "loginSuccessOverlay";

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
            id="loginSuccessCard"
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
                Login Successful
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
                Welcome back to FaveHub
            </p>


            <!-- LOADING BAR -->

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
                    id="loginSuccessProgress"
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


    // Animate card in
    requestAnimationFrame(() => {

        const card =
            document.getElementById(
                "loginSuccessCard"
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


    // Animate progress bar
    requestAnimationFrame(() => {

        const progress =
            document.getElementById(
                "loginSuccessProgress"
            );

        progress.style.transition =
            "width 1.5s linear";

        progress.style.width =
            "100%";

    });


    // Redirect after animation
    setTimeout(() => {


        const homePage = '/FaveHub/';

        window.location.href = `${homePage}`;

    }, 1500);

}


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        hideError();


        const identifier =
            document
                .getElementById("identifier")
                .value
                .trim();


        const password =
            passwordInput.value;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!identifier) {

            showError(
                "Please enter your email or phone number."
            );

            return;

        }


        if (!password) {

            showError(
                "Please enter your password."
            );

            return;

        }


        setLoading(true);


        try {

            // --------------------------------------
            // SEND LOGIN REQUEST
            // --------------------------------------

            const response = await apiFetch(
                "/auth/login/",
                {
                    method: "POST",

                    body: JSON.stringify({

                        identifier: identifier,

                        password: password

                    })
                }
            );


            let data = {};


            try {

                data = await response.json();

            } catch (error) {

                data = {};

            }


            // --------------------------------------
            // LOGIN FAILED
            // --------------------------------------

            if (!response.ok) {

                let message =
                    "Unable to sign in.";


                if (data.detail) {

                    message =
                        data.detail;

                }

                else if (
                    data.non_field_errors
                ) {

                    message =
                        Array.isArray(
                            data.non_field_errors
                        )
                            ? data.non_field_errors[0]
                            : data.non_field_errors;

                }

                else if (data.identifier) {

                    message =
                        Array.isArray(
                            data.identifier
                        )
                            ? data.identifier[0]
                            : data.identifier;

                }

                else if (data.password) {

                    message =
                        Array.isArray(
                            data.password
                        )
                            ? data.password[0]
                            : data.password;

                }


                showError(message);

                setLoading(false);

                return;

            }


            // --------------------------------------
            // SUCCESS
            // --------------------------------------

            const accessToken =
                data.access;


            const refreshToken =
                data.refresh;


            if (!accessToken) {

                showError(
                    "Login succeeded, but no access token was returned."
                );

                setLoading(false);

                return;

            }


            // --------------------------------------
            // SAVE TOKENS
            // --------------------------------------

            saveTokens(
                accessToken,
                refreshToken
            );


            localStorage.setItem(
                "datahub_logged_in",
                "true"
            );


            // --------------------------------------
            // SUCCESS UI
            // --------------------------------------

            setLoading(false);

            showLoginSuccess();

        }


        catch (error) {

            console.error(
                "Login error:",
                error
            );


            showError(
                "Unable to connect to DataHub. Please check your internet connection and try again."
            );


            setLoading(false);

        }

    }
);
