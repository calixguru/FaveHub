// ============================================================
// DATAHUB RESET PASSWORD
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // ELEMENTS
    // ========================================================

    const form =
        document.getElementById(
            "resetPasswordForm"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword"
        );


    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    const toggleConfirmPassword =
        document.getElementById(
            "toggleConfirmPassword"
        );


    const button =
        document.getElementById(
            "resetPasswordButton"
        );


    const buttonText =
        document.getElementById(
            "resetButtonText"
        );


    const loader =
        document.getElementById(
            "resetLoader"
        );


    const errorBox =
        document.getElementById(
            "resetPasswordError"
        );


    const successBox =
        document.getElementById(
            "resetPasswordSuccess"
        );


    // ========================================================
    // GET RESET PARAMETERS
    // ========================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const uid =
        params.get("uid");


    const token =
        params.get("token");


    // ========================================================
    // ERROR
    // ========================================================

    function showError(message) {

        errorBox.textContent =
            message;

        errorBox.classList.remove(
            "hidden"
        );

    }


    function hideError() {

        errorBox.textContent = "";

        errorBox.classList.add(
            "hidden"
        );

    }


    // ========================================================
    // PASSWORD VISIBILITY
    // ========================================================

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


    // ========================================================
    // LOADING
    // ========================================================

    function setLoading(loading) {

        button.disabled =
            loading;


        if (loading) {

            buttonText.classList.add(
                "hidden"
            );

            loader.classList.remove(
                "hidden"
            );

        } else {

            buttonText.classList.remove(
                "hidden"
            );

            loader.classList.add(
                "hidden"
            );

        }

    }


    // ========================================================
    // CHECK LINK
    // ========================================================

    if (!uid || !token) {

        showError(
            "This password reset link is incomplete or invalid."
        );


        form.querySelectorAll(
            "input, button[type='submit']"
        ).forEach(
            element => {
                element.disabled = true;
            }
        );

    }


    // ========================================================
    // SUBMIT
    // ========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            hideError();


            const password =
                passwordInput.value;


            const confirmPassword =
                confirmPasswordInput.value;


            // ----------------------------------------------
            // LINK VALIDATION
            // ----------------------------------------------

            if (!uid || !token) {

                showError(
                    "This password reset link is invalid."
                );

                return;

            }


            // ----------------------------------------------
            // PASSWORD VALIDATION
            // ----------------------------------------------

            if (!password) {

                showError(
                    "Please enter your new password."
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
                    "The passwords do not match."
                );

                return;

            }


            setLoading(true);


            try {

                const response =
                    await apiFetch(
                        "/auth/reset-password/",
                        {
                            method: "POST",

                            body: JSON.stringify({

                                uid: uid,

                                token: token,

                                password: password

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


                // ------------------------------------------
                // FAILED
                // ------------------------------------------

                if (!response.ok) {

                    showError(
                        data.detail ||
                        data.password ||
                        "Unable to reset your password."
                    );


                    setLoading(false);

                    return;

                }


                // ------------------------------------------
                // SUCCESS
                // ------------------------------------------

                successBox.classList.remove(
                    "hidden"
                );


                form.querySelectorAll(
                    "input, button"
                ).forEach(
                    element => {
                        element.disabled = true;
                    }
                );


                // Make sure old JWT credentials aren't
                // accidentally reused after a password change.

                if (
                    typeof clearTokens ===
                    "function"
                ) {

                    clearTokens();

                }


                // ------------------------------------------
                // REDIRECT
                // ------------------------------------------

                setTimeout(
                    function () {

                        window.location.href =
                            "/login";

                    },
                    1800
                );

            }


            catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );


                showError(
                    "Unable to connect to DataHub. Please check your internet connection and try again."
                );


                setLoading(false);

            }

        }
    );

})();