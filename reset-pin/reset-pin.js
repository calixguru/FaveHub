// ============================================================
// DATAHUB RESET PIN
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // ELEMENTS
    // ========================================================

    const form =
        document.getElementById(
            "resetPinForm"
        );


    const currentPassword =
        document.getElementById(
            "currentPassword"
        );


    const newPin =
        document.getElementById(
            "newPin"
        );


    const confirmPin =
        document.getElementById(
            "confirmPin"
        );


    const button =
        document.getElementById(
            "resetPinButton"
        );


    const buttonText =
        document.getElementById(
            "resetPinButtonText"
        );


    const loader =
        document.getElementById(
            "resetPinLoader"
        );


    const errorBox =
        document.getElementById(
            "resetPinError"
        );


    // ========================================================
    // CHECK ELEMENTS
    // ========================================================

    if (!form) {

        return;

    }


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

        errorBox.textContent =
            "";

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

        }

        else {

            buttonText.classList.remove(
                "hidden"
            );

            loader.classList.add(
                "hidden"
            );

        }

    }


    // ========================================================
    // DJANGO ERROR
    // ========================================================

    function getErrorMessage(data) {

        if (!data) {

            return "Unable to reset your PIN.";

        }


        if (
            typeof data.detail ===
            "string"
        ) {

            return data.detail;

        }


        const errors = [];


        for (
            const field in data
        ) {

            const value =
                data[field];


            if (
                Array.isArray(value)
            ) {

                errors.push(
                    value.join(" ")
                );

            }

            else if (
                typeof value ===
                "string"
            ) {

                errors.push(
                    value
                );

            }

        }


        if (errors.length) {

            return errors.join(" ");

        }


        return "Unable to reset your PIN.";

    }


    // ========================================================
    // SUCCESS MODAL
    // ========================================================

    function showSuccessModal() {

        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "pinResetSuccessOverlay";


        overlay.className = `
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            px-5
            bg-slate-950/50
            dark:bg-black/70
            backdrop-blur-md
        `;


        overlay.innerHTML = `

            <div
                id="pinResetSuccessCard"
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
                    scale-95
                    opacity-0
                    transition-all
                    duration-300
                "
            >

                <!-- ICON -->

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
                    PIN Reset Successfully
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
                    Your transaction PIN has been
                    successfully changed.
                </p>


                <div
                    class="
                        mt-5
                        rounded-xl
                        bg-green-50
                        dark:bg-green-500/10
                        px-4
                        py-3
                        text-xs
                        font-medium
                        text-green-700
                        dark:text-green-400
                    "
                >
                    Your new PIN is now active.
                </div>


                <!-- BUTTON -->

                <button
                    id="pinResetDoneButton"
                    type="button"
                    class="
                        mt-6
                        w-full
                        h-11
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-500
                        text-white
                        text-sm
                        font-semibold
                        transition
                    "
                >
                    Done
                </button>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        // Animate

        requestAnimationFrame(() => {

            const card =
                document.getElementById(
                    "pinResetSuccessCard"
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


        // Done

        document
            .getElementById(
                "pinResetDoneButton"
            )
            .addEventListener(
                "click",
                function () {

                    overlay.remove();

                }
            );

    }


    // ========================================================
    // ONLY ALLOW DIGITS IN PIN
    // ========================================================

    function restrictPinInput(input) {

        input.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

            }
        );

    }


    restrictPinInput(
        newPin
    );


    restrictPinInput(
        confirmPin
    );


    // ========================================================
    // SUBMIT
    // ========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            hideError();


            const password =
                currentPassword.value.trim();


            const pin =
                newPin.value.trim();


            const confirmation =
                confirmPin.value.trim();


            // ============================================
            // VALIDATION
            // ============================================

            if (!password) {

                showError(
                    "Please enter your current password."
                );

                return;

            }


            if (!/^\d{4}$/.test(pin)) {

                showError(
                    "Your new PIN must be exactly 4 digits."
                );

                return;

            }


            if (
                !/^\d{4}$/.test(
                    confirmation
                )
            ) {

                showError(
                    "Your confirmation PIN must be exactly 4 digits."
                );

                return;

            }


            if (pin !== confirmation) {

                showError(
                    "Your new PINs do not match."
                );

                return;

            }


            setLoading(true);


            try {

                // ========================================
                // API REQUEST
                // ========================================

                const response =
                    await apiFetch(
                        "/auth/reset-pin/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                current_password:
                                    password,

                                new_pin:
                                    pin,

                                confirm_pin:
                                    confirmation

                            })
                        }
                    );


                let data = {};


                try {

                    data =
                        await response.json();

                }

                catch (error) {

                    data = {};

                }


                // ========================================
                // FAILED
                // ========================================

                if (!response.ok) {

                    showError(
                        getErrorMessage(
                            data
                        )
                    );

                    setLoading(false);

                    return;

                }


                // ========================================
                // SUCCESS
                // ========================================

                form.reset();

                setLoading(false);

                showSuccessModal();

            }


            catch (error) {

                console.error(
                    "PIN reset error:",
                    error
                );


                showError(
                    "Unable to connect to DataHub. Please try again."
                );


                setLoading(false);

            }

        }
    );

})();