// ============================================================
// DATAHUB BUY DATA
// ============================================================

const phoneInput =
    document.getElementById("phoneNumber");

const networkBadge =
    document.getElementById("networkBadge");

const networkMessage =
    document.getElementById("networkMessage");

const plansGrid =
    document.getElementById("plansGrid");

const plansSubtitle =
    document.getElementById("plansSubtitle");

const walletBalance =
    document.getElementById("walletBalance");


// ============================================================
// MODALS
// ============================================================

const confirmModal =
    document.getElementById("confirmModal");

const resultModal =
    document.getElementById("resultModal");

const cancelPurchase =
    document.getElementById("cancelPurchase");

const confirmPurchase =
    document.getElementById("confirmPurchase");

const closeResult =
    document.getElementById("closeResult");

const purchasePin =
    document.getElementById("purchasePin");

const purchaseError =
    document.getElementById("purchaseError");


// ============================================================
// STATE
// ============================================================

let currentNetwork = null;

let currentPlans = [];

let selectedPlan = null;


// ============================================================
// MONEY
// ============================================================

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN"
        }
    ).format(
        Number(amount)
    );

}


// ============================================================
// WALLET
// ============================================================

async function loadWallet() {

    try {

        const response =
            await apiFetch(
                "/wallet/"
            );


        if (!response || !response.ok) {

            return;

        }


        const data =
            await response.json();


        walletBalance.textContent =
            formatMoney(
                data.balance
            );


    } catch (error) {

        console.error(
            "Wallet error:",
            error
        );

    }

}


// ============================================================
// DETECT NETWORK
// ============================================================

let detectTimer = null;


phoneInput.addEventListener(
    "input",
    function () {

        clearTimeout(
            detectTimer
        );


        const value =
            phoneInput.value.trim();


        currentNetwork = null;

        networkBadge.classList.add(
            "hidden"
        );


        plansGrid.innerHTML = "";

        plansSubtitle.textContent =
            "Detecting network...";


        if (value.length < 4) {

            networkMessage.textContent =
                "Your network will be detected automatically.";

            plansSubtitle.textContent =
                "Enter a phone number to view plans.";

            return;

        }


        detectTimer =
            setTimeout(
                detectNetwork,
                350
            );

    }
);


// ============================================================
// DETECT
// ============================================================

async function detectNetwork() {

    try {

        const response =
            await apiFetch(
                "/data/detect-network/",
                {
                    method: "POST",

                    body:
                        JSON.stringify({

                            phone_number:
                                phoneInput.value.trim()

                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            networkMessage.textContent =
                data.detail ||
                "Unable to detect network.";

            plansGrid.innerHTML = "";

            plansSubtitle.textContent =
                "No plans available.";

            return;

        }


        currentNetwork =
            data.network;


        networkBadge.textContent =
            currentNetwork;

        networkBadge.classList.remove(
            "hidden"
        );


        networkMessage.textContent =
            `${currentNetwork} detected automatically.`;


        loadPlans();


    } catch (error) {

        console.error(
            error
        );

        networkMessage.textContent =
            "Unable to detect network right now.";

    }

}


// ============================================================
// LOAD PLANS
// ============================================================

async function loadPlans() {

    plansGrid.innerHTML = `

        <div class="
            col-span-full
            py-10
            text-center
            text-sm
            text-slate-400
        ">
            Loading plans...
        </div>

    `;


    try {

        const response =
            await apiFetch(
                "/data/plans/"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load plans."
            );

        }


        const data =
            await response.json();


        currentPlans =
            data.plans[
                currentNetwork
            ] || [];


        renderPlans();


    } catch (error) {

        console.error(
            error
        );


        plansGrid.innerHTML = `

            <div class="
                col-span-full
                py-10
                text-center
                text-sm
                text-red-500
            ">
                Unable to load plans.
            </div>

        `;

    }

}


// ============================================================
// RENDER PLANS
// ============================================================

function renderPlans() {

    plansGrid.innerHTML = "";


    plansSubtitle.textContent =
        `${currentNetwork} plans`;


    if (!currentPlans.length) {

        plansGrid.innerHTML = `

            <div class="
                col-span-full
                py-10
                text-center
                text-sm
                text-slate-400
            ">
                No plans are currently available.
            </div>

        `;

        return;

    }


    currentPlans.forEach(
        function (plan) {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className = `
                text-left
                p-5
                rounded-2xl
                border
                border-slate-200
                dark:border-white/10
                bg-white
                dark:bg-white/[0.025]
                hover:border-blue-500/50
                hover:-translate-y-1
                transition
            `;


            card.innerHTML = `

                <div class="
                    text-xs
                    uppercase
                    tracking-wider
                    font-bold
                    text-blue-500
                ">
                    ${escapeHTML(plan.validity)}
                </div>


                <div class="
                    mt-3
                    text-2xl
                    font-black
                ">
                    ${escapeHTML(plan.size)}
                </div>


                <div class="
                    mt-2
                    text-xs
                    text-slate-400
                ">
                    ${escapeHTML(plan.name)}
                </div>


                <div class="
                    mt-5
                    text-lg
                    font-black
                ">
                    ${formatMoney(plan.price)}
                </div>


                <div class="
                    mt-4
                    h-10
                    rounded-xl
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                ">
                    Select plan
                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    openConfirmation(
                        plan
                    );

                }
            );


            plansGrid.appendChild(
                card
            );

        }
    );

}


// ============================================================
// CONFIRMATION
// ============================================================

function openConfirmation(plan) {

    selectedPlan =
        plan;


    document.getElementById(
        "confirmNetwork"
    ).textContent =
        currentNetwork;


    document.getElementById(
        "confirmPhone"
    ).textContent =
        phoneInput.value.trim();


    document.getElementById(
        "confirmPlan"
    ).textContent =
        plan.name;


    document.getElementById(
        "confirmAmount"
    ).textContent =
        formatMoney(
            plan.price
        );


    purchasePin.value = "";

    purchaseError.classList.add(
        "hidden"
    );


    confirmPurchase.disabled =
        false;


    confirmModal.classList.remove(
        "hidden"
    );


    confirmModal.classList.add(
        "flex"
    );


    setTimeout(
        function () {

            purchasePin.focus();

        },
        100
    );

}


// ============================================================
// CLOSE CONFIRMATION
// ============================================================

function closeConfirmation() {

    confirmModal.classList.add(
        "hidden"
    );

    confirmModal.classList.remove(
        "flex"
    );

}


cancelPurchase.addEventListener(
    "click",
    closeConfirmation
);


// ============================================================
// BUY
// ============================================================

confirmPurchase.addEventListener(
    "click",
    buyPlan
);


async function buyPlan() {

    if (!selectedPlan) {

        return;

    }


    const pin =
        purchasePin.value.trim();


    if (!/^\d{4}$/.test(pin)) {

        purchaseError.textContent =
            "Enter your 4-digit transaction PIN.";

        purchaseError.classList.remove(
            "hidden"
        );

        return;

    }


    confirmPurchase.disabled =
        true;


    confirmPurchase.textContent =
        "Processing...";


    purchaseError.classList.add(
        "hidden"
    );


    try {

        const response =
            await apiFetch(
                "/data/buy/",
                {
                    method: "POST",

                    body:
                        JSON.stringify({

                            phone_number:
                                phoneInput.value.trim(),

                            plan_code:
                                selectedPlan.code,

                            pin:
                                pin

                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            purchaseError.textContent =
                data.detail ||
                "Purchase could not be completed.";

            purchaseError.classList.remove(
                "hidden"
            );


            confirmPurchase.disabled =
                false;

            confirmPurchase.textContent =
                "Buy now";

            return;

        }


        closeConfirmation();


        if (
            data.wallet_balance !== undefined
        ) {

            walletBalance.textContent =
                formatMoney(
                    data.wallet_balance
                );

        }


        showResult(
            true,
            "Purchase successful",
            data.message ||
            "Your data purchase was completed successfully."
        );


    } catch (error) {

        console.error(
            "Purchase error:",
            error
        );


        purchaseError.textContent =
            "Unable to connect to DataHub. Please try again.";

        purchaseError.classList.remove(
            "hidden"
        );


        confirmPurchase.disabled =
            false;

        confirmPurchase.textContent =
            "Buy now";

    }

}


// ============================================================
// RESULT MODAL
// ============================================================

function showResult(
    success,
    title,
    message
) {

    const icon =
        document.getElementById(
            "resultIcon"
        );


    icon.textContent =
        success
            ? "✓"
            : "!";


    icon.className = `
        mx-auto
        w-16
        h-16
        rounded-full
        flex
        items-center
        justify-center
        text-2xl
        font-black
        ${
            success
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
        }
    `;


    document.getElementById(
        "resultTitle"
    ).textContent =
        title;


    document.getElementById(
        "resultMessage"
    ).textContent =
        message;


    resultModal.classList.remove(
        "hidden"
    );


    resultModal.classList.add(
        "flex"
    );

}


closeResult.addEventListener(
    "click",
    function () {

        resultModal.classList.add(
            "hidden"
        );

        resultModal.classList.remove(
            "flex"
        );

    }
);


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadWallet();

    }
);