const transactionsContainer =
    document.getElementById(
        "transactionsContainer"
    );

const loadingState =
    document.getElementById(
        "loadingState"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );


// ========================================
// LOAD TRANSACTIONS
// ========================================

async function loadTransactions() {

    try {

        const response =
            await apiFetch(
                "/transactions/"
            );


        if (!response) {

            return;

        }


        if (response.status === 401) {

            window.location.href =
                "/login";

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Unable to load transactions."
            );

        }


        const transactions =
            await response.json();


        loadingState.classList.add(
            "hidden"
        );


        if (
            !transactions ||
            transactions.length === 0
        ) {

            emptyState.classList.remove(
                "hidden"
            );

            return;

        }


        renderTransactions(
            transactions
        );


    } catch (error) {

        console.error(
            "Transaction history error:",
            error
        );


        loadingState.textContent =
            "Unable to load your transactions.";

    }

}


// ========================================
// RENDER
// ========================================

function renderTransactions(
    transactions
) {

    transactionsContainer.innerHTML = "";


    transactions.forEach(
        function (transaction) {

            const card =
                document.createElement(
                    "div"
                );


            card.className = `
                p-5
                rounded-2xl
                border
                border-slate-200
                dark:border-white/10
                bg-white
                dark:bg-white/[0.025]
                hover:border-blue-400/30
                transition
            `;


            const type =
                transaction.transaction_type
                    .toLowerCase();


            const isSuccessful =
                transaction.status ===
                "successful";


            const isFailed =
                transaction.status ===
                "failed";


            let statusClass =
                "text-yellow-600 bg-yellow-500/10";


            if (isSuccessful) {

                statusClass =
                    "text-green-600 bg-green-500/10";

            }


            if (isFailed) {

                statusClass =
                    "text-red-600 bg-red-500/10";

            }


            const date =
                new Date(
                    transaction.created_at
                );


            const formattedDate =
                date.toLocaleString(
                    "en-NG",
                    {
                        dateStyle:
                            "medium",

                        timeStyle:
                            "short"
                    }
                );


            card.innerHTML = `

                <div class="
                    flex
                    items-start
                    justify-between
                    gap-4
                ">

                    <div class="flex items-start gap-3">

                        <div class="
                            w-11 h-11
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            bg-blue-500/10
                            text-blue-500
                            font-bold
                        ">

                            ${
                                type === "data"
                                    ? "◉"
                                    : "₦"
                            }

                        </div>


                        <div>

                            <div class="
                                font-bold
                                text-slate-900
                                dark:text-white
                            ">

                                ${
                                    transaction.plan_name ||
                                    (
                                        type === "data"
                                            ? "Data purchase"
                                            : "Airtime purchase"
                                    )
                                }

                            </div>


                            <div class="
                                mt-1
                                text-xs
                                text-slate-400
                                dark:text-white/35
                            ">

                                ${
                                    transaction.network
                                }
                                ·
                                ${
                                    transaction.phone_number
                                }

                            </div>

                        </div>

                    </div>


                    <div class="
                        text-right
                    ">

                        <div class="
                            font-bold
                            text-slate-900
                            dark:text-white
                        ">

                            ₦${Number(
                                transaction.amount
                            ).toLocaleString()}

                        </div>


                        <span class="
                            inline-block
                            mt-2
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            uppercase
                            ${statusClass}
                        ">

                            ${
                                transaction.status
                            }

                        </span>

                    </div>

                </div>


                <div class="
                    mt-4
                    pt-4
                    border-t
                    border-slate-100
                    dark:border-white/5
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-xs
                    text-slate-400
                    dark:text-white/30
                ">

                    <span>
                        ${formattedDate}
                    </span>

                    <span>
                        Ref:
                        ${transaction.reference}
                    </span>

                </div>

            `;


            transactionsContainer.appendChild(
                card
            );

        }
    );

}


// ========================================
// START
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTransactions();

    }
);