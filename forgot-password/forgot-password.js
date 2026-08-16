// ============================================================
// DATAHUB FORGOT PASSWORD
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // ELEMENTS
    // ========================================================

    const form =
        document.getElementById(
            "forgotPasswordForm"
        );


    const emailInput =
        document.getElementById(
            "email"
        );


    const button =
        document.getElementById(
            "forgotPasswordButton"
        );


    const buttonText =
        document.getElementById(
            "forgotButtonText"
        );


    const loader =
        document.getElementById(
            "forgotLoader"
        );


    const errorBox =
        document.getElementById(
            "forgotPasswordError"
        );


    const successBox =
        document.getElementById(
            "forgotPasswordSuccess"
        );


    const successMessage =
        document.getElementById(
            "successMessage"
        );


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
    // SUBMIT
    // ========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            hideError();


            successBox.classList.add(
                "hidden"
            );


            const email =
                emailInput.value.trim();


            // ----------------------------------------------
            // VALIDATION
            // ----------------------------------------------

            if (!email) {

                showError(
                    "Please enter your email address."
                );

                return;

            }


            setLoading(true);


            try {

                const response =
                    await apiFetch(
                        "/auth/forgot-password/",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                email: email
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


                if (!response.ok) {

                    let message =
                        "Unable to process your request.";


                    if (data.detail) {

                        message =
                            data.detail;

                    }

                    else if (data.email) {

                        message =
                            Array.isArray(data.email)
                                ? data.email[0]
                                : data.email;

                    }


                    showError(message);

                    setLoading(false);

                    return;

                }


                // ------------------------------------------
                // SUCCESS
                // ------------------------------------------

                successMessage.textContent =
                    data.message ||
                    "If an account exists with that email, a password reset link has been sent.";


                successBox.classList.remove(
                    "hidden"
                );


                emailInput.value = "";


                setLoading(false);

            }


            catch (error) {

                console.error(
                    "Forgot password error:",
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