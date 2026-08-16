// ============================================================
// DATAHUB SHARED LAYOUT
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // ROUTING CONFIGURATION
    // ========================================================
    //
    // CHANGE YOUR URLS HERE ONLY.
    //
    // Anywhere in this file that needs a route should use:
    //
    // route("home")
    // route("login")
    // route("register")
    // route("app")
    // route("chat")
    // route("support")
    //
    // If you change a URL here, it changes everywhere.
    // ========================================================

    const ROUTES = {

        home:
            "index.html",

        login:
            "login/",

        register:
            "register/",

        dashboard: "app/",

        chat: "chat/",

        support: "support/",

        transactions: "transactions/",

        buy: "buy/",

        dataPlans: "data-plans/",

        wallet: "wallet/",

        walletTopUp: "/wallet/top-up",

        forgotPassword: "forgot-password/",

        terms: "terms/",

        privacy: "privacy/"

    };


    // ========================================================
    // ROUTE HELPER
    // ========================================================

    function route(name) {

        return ROUTES[name] || "/";

    }


    // Make route available globally if needed by other JS
    window.datahubRoute = route;


    // ========================================================
    // PUBLIC PAGES
    // ========================================================

    const PUBLIC_PAGES = [

        route("home"),

        route("login"),

        route("register"),

        route("forgotPassword"),

        route("support")

    ];


    // ========================================================
    // CURRENT PATH
    // ========================================================

    const currentPath =
        window.location.pathname.replace(/\/$/, "") || "/";


    // ========================================================
    // CHECK PUBLIC PAGE
    // ========================================================

    function isPublicPage() {

        return PUBLIC_PAGES.includes(
            currentPath
        );

    }


    // ========================================================
    // HTML ESCAPE
    // ========================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ========================================================
    // THEME
    // ========================================================

    function applyTheme() {

        const savedTheme =
            localStorage.getItem(
                "datahub_theme"
            );


        if (savedTheme === "light") {

            document.documentElement.classList.remove(
                "dark"
            );

        } else {

            document.documentElement.classList.add(
                "dark"
            );

        }


        updateThemeIcon();

    }


    function toggleTheme() {

        const isDark =
            document.documentElement.classList.contains(
                "dark"
            );


        if (isDark) {

            document.documentElement.classList.remove(
                "dark"
            );

            localStorage.setItem(
                "datahub_theme",
                "light"
            );

        } else {

            document.documentElement.classList.add(
                "dark"
            );

            localStorage.setItem(
                "datahub_theme",
                "dark"
            );

        }


        updateThemeIcon();

    }


    function updateThemeIcon() {

        const icon =
            document.getElementById(
                "themeIcon"
            );


        if (!icon) {
            return;
        }


        const isDark =
            document.documentElement.classList.contains(
                "dark"
            );


        icon.textContent =
            isDark
                ? "☼"
                : "☾";

    }


    window.toggleTheme =
        toggleTheme;


    applyTheme();


    // ========================================================
    // NAVBAR
    // ========================================================

    function createNavbar(user) {

        const header =
            document.createElement(
                "header"
            );


        header.id =
            "datahubNavbar";


        header.className = `
            sticky top-0 z-50
            border-b
            border-slate-200
            dark:border-white/10
            bg-white/80
            dark:bg-slate-950/75
            backdrop-blur-xl
        `;


        header.innerHTML = `

            <div class="
                max-w-7xl
                mx-auto
                px-5 sm:px-8
            ">

                <div class="
                    min-h-16
                    flex
                    items-center
                    justify-between
                    gap-3
                ">


                    <!-- ================================== -->
                    <!-- LOGO -->
                    <!-- ================================== -->

                    <a
                        href="${route("home")}"
                        class="
                            flex
                            items-center
                            gap-3
                            shrink-0
                        "
                    >

                        <div class="
                            w-9 h-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            bg-blue-600
                            text-white
                            font-black
                            shadow-lg
                            shadow-blue-600/20
                        ">
                            D
                        </div>


                        <div>

                            <div class="
                                font-bold
                                tracking-tight
                            ">
                                FaveHub
                            </div>

                            <div class="
                                text-[9px]
                                uppercase
                                tracking-[0.18em]
                                text-slate-400
                                dark:text-white/40
                            ">
                                Everything, simpler
                            </div>

                        </div>

                    </a>


                    <!-- ================================== -->
                    <!-- DESKTOP NAV -->
                    <!-- ================================== -->

                    <nav class="
                        hidden
                        md:flex
                        items-center
                        gap-7
                    ">

                        <a
                            href="${route("home")}"
                            class="
                                text-sm
                                text-slate-500
                                hover:text-slate-900
                                dark:text-white/50
                                dark:hover:text-white
                                transition
                            "
                        >
                            Home
                        </a>


                        <a
                            href="${route("app")}"
                            class="
                                text-sm
                                text-slate-500
                                hover:text-slate-900
                                dark:text-white/50
                                dark:hover:text-white
                                transition
                            "
                        >
                            Dashboard
                        </a>


                        <a
                            href="${route("chat")}"
                            class="
                                text-sm
                                text-slate-500
                                hover:text-slate-900
                                dark:text-white/50
                                dark:hover:text-white
                                transition
                            "
                        >
                            Chat
                        </a>


                        <a
                            href="${route("support")}"
                            class="
                                text-sm
                                text-slate-500
                                hover:text-slate-900
                                dark:text-white/50
                                dark:hover:text-white
                                transition
                            "
                        >
                            Support
                        </a>

                    </nav>


                    <!-- ================================== -->
                    <!-- ACTIONS -->
                    <!-- ================================== -->

                    <div class="
                        flex
                        items-center
                        gap-2
                        ml-auto
                    ">


                        <!-- THEME -->

                        <button
                            id="themeButton"
                            type="button"
                            class="
                                w-10 h-10
                                shrink-0
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                border
                                border-slate-200
                                dark:border-white/10
                                bg-slate-100
                                dark:bg-white/5
                                hover:bg-slate-200
                                dark:hover:bg-white/10
                                transition
                            "
                            aria-label="Toggle theme"
                        >

                            <span id="themeIcon">
                                ☼
                            </span>

                        </button>


                        ${
                            user
                                ? createLoggedInActions(user)
                                : createLoggedOutActions()
                        }

                    </div>

                </div>

            </div>

        `;


        return header;

    }


    // ========================================================
    // LOGGED OUT ACTIONS
    // ========================================================

    function createLoggedOutActions() {

        return `

            <!-- LOGIN -->

            <a
                href="${route("login")}"
                class="
                    hidden
                    sm:flex
                    h-10
                    px-4
                    items-center
                    justify-center
                    rounded-xl
                    text-sm
                    font-semibold
                    border
                    border-slate-200
                    dark:border-white/10
                    hover:bg-slate-100
                    dark:hover:bg-white/5
                    transition
                "
            >
                Login
            </a>


            <!-- REGISTER -->

            <a
                href="${route("register")}"
                class="
                    h-10
                    px-4
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-500
                    text-white
                    text-sm
                    font-semibold
                    transition
                    shadow-lg
                    shadow-blue-600/20
                "
            >
                Get Started
            </a>

        `;

    }


    // ========================================================
    // LOGGED IN ACTIONS
    // ========================================================

    function createLoggedInActions(user) {

        const firstName =
            user.first_name ||
            user.name ||
            user.username ||
            "User";


        const safeFirstName =
            escapeHTML(firstName);


        return `

            <!-- ========================================== -->
            <!-- DESKTOP USER -->
            <!-- ========================================== -->

            <div
                class="
                    hidden
                    sm:flex
                    items-center
                    gap-3
                    ml-2
                "
            >

                <!-- WELCOME -->

                <div
                    class="
                        hidden
                        lg:block
                        text-right
                    "
                >

                    <div
                        class="
                            text-xs
                            font-semibold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        Welcome,
                        ${safeFirstName}
                    </div>

                </div>


                <!-- LOGOUT -->

                <button
                    id="logoutButton"
                    type="button"
                    class="
                        h-10
                        px-4
                        rounded-xl
                        border
                        border-slate-200
                        dark:border-white/10
                        text-sm
                        font-semibold
                        text-slate-600
                        dark:text-white/70
                        hover:bg-slate-100
                        dark:hover:bg-white/5
                        hover:text-red-500
                        transition
                        flex
                        items-center
                        gap-2
                    "
                >

                    <span>
                        Logout
                    </span>

                </button>

            </div>


            <!-- ========================================== -->
            <!-- MOBILE USER -->
            <!-- ========================================== -->

            <div
                class="
                    sm:hidden
                    flex
                    items-center
                    gap-2
                "
            >

                <!-- HELLO NAME -->

                <div
                    class="
                        text-xs
                        font-semibold
                        text-slate-700
                        dark:text-white
                        whitespace-nowrap
                    "
                >

                    Hello,
                    ${safeFirstName}

                </div>


                <!-- MOBILE LOGOUT -->

                <button
                    id="mobileUserButton"
                    type="button"
                    class="
                        h-10
                        px-3
                        rounded-xl
                        border
                        border-slate-200
                        dark:border-white/10
                        text-xs
                        font-semibold
                        text-slate-600
                        dark:text-white/70
                        hover:bg-slate-100
                        dark:hover:bg-white/5
                        hover:text-red-500
                        transition
                        flex
                        items-center
                        gap-1.5
                    "
                    aria-label="Logout"
                >

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        `;

    }


    // ========================================================
    // FOOTER
    // ========================================================

    function createFooter() {

        const footer =
            document.createElement(
                "footer"
            );


        footer.id =
            "datahubFooter";


        footer.className = `
            border-t
            border-slate-200
            dark:border-white/10
        `;


        footer.innerHTML = `

            <div class="
                max-w-7xl
                mx-auto
                px-5 sm:px-8
                py-8
                flex
                flex-col
                sm:flex-row
                justify-between
                gap-4
            ">


                <div class="
                    text-xs
                    text-slate-400
                    dark:text-white/30
                ">
                    © 2026 DataHub.
                    All rights reserved.
                </div>


                <div class="
                    flex
                    gap-5
                    text-xs
                    text-slate-400
                    dark:text-white/30
                ">

                    <a
                        href="${route("support")}"
                        class="
                            hover:text-slate-900
                            dark:hover:text-white
                            transition
                        "
                    >
                        Help & Support
                    </a>


                    <a
                        href="${route("home")}"
                        class="
                            hover:text-slate-900
                            dark:hover:text-white
                            transition
                        "
                    >
                        Home
                    </a>

                </div>

            </div>

        `;


        return footer;

    }


    // ========================================================
    // GET CURRENT USER
    // ========================================================

    async function getCurrentUser() {

        const token =
            getAccessToken();


        if (!token) {

            return null;

        }


        try {

            const response =
                await apiFetch(
                    "/auth/me/"
                );


            if (!response) {

                return null;

            }


            if (!response.ok) {

                return null;

            }


            const user =
                await response.json();


            return user;

        }

        catch (error) {

            console.error(
                "Could not retrieve user:",
                error
            );

            return null;

        }

    }


    // ========================================================
    // LOGOUT CONFIRMATION MODAL
    // ========================================================

    function showLogoutModal() {

        return new Promise(
            function (resolve) {

                const existing =
                    document.getElementById(
                        "datahubLogoutModal"
                    );


                if (existing) {

                    existing.remove();

                }


                const modal =
                    document.createElement(
                        "div"
                    );


                modal.id =
                    "datahubLogoutModal";


                modal.className = `
                    fixed
                    inset-0
                    z-[9999]
                    flex
                    items-center
                    justify-center
                    p-4
                    bg-slate-950/60
                    backdrop-blur-sm
                `;


                modal.innerHTML = `

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
                            overflow-hidden
                            transform
                            transition
                        "
                    >

                        <!-- ICON -->

                        <div class="
                            pt-7
                            flex
                            justify-center
                        ">

                            <div class="
                                w-14
                                h-14
                                rounded-2xl
                                bg-red-500/10
                                text-red-500
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">
                                ⇥
                            </div>

                        </div>


                        <!-- CONTENT -->

                        <div class="
                            px-6
                            pt-5
                            pb-6
                            text-center
                        ">

                            <h3
                                class="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Log out of DataHub?
                            </h3>


                            <p
                                class="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    dark:text-white/45
                                "
                            >
                                Are you sure you want to log
                                out of your account?
                            </p>


                            <!-- BUTTONS -->

                            <div
                                class="
                                    mt-6
                                    grid
                                    grid-cols-2
                                    gap-3
                                "
                            >

                                <button
                                    id="cancelLogout"
                                    type="button"
                                    class="
                                        h-11
                                        rounded-xl
                                        border
                                        border-slate-200
                                        dark:border-white/10
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        dark:text-white/60
                                        hover:bg-slate-100
                                        dark:hover:bg-white/5
                                        transition
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    id="confirmLogout"
                                    type="button"
                                    class="
                                        h-11
                                        rounded-xl
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        text-sm
                                        font-semibold
                                        transition
                                        shadow-lg
                                        shadow-red-500/20
                                    "
                                >
                                    Yes, Log Out
                                </button>

                            </div>

                        </div>

                    </div>

                `;


                document.body.appendChild(
                    modal
                );


                // ========================================
                // CANCEL
                // ========================================

                document
                    .getElementById(
                        "cancelLogout"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            modal.remove();

                            resolve(false);

                        }
                    );


                // ========================================
                // CONFIRM
                // ========================================

                document
                    .getElementById(
                        "confirmLogout"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            modal.remove();

                            resolve(true);

                        }
                    );


                // ========================================
                // CLICK OUTSIDE
                // ========================================

                modal.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            modal
                        ) {

                            modal.remove();

                            resolve(false);

                        }

                    }
                );


                // ========================================
                // ESCAPE KEY
                // ========================================

                function escapeHandler(event) {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        modal.remove();

                        document.removeEventListener(
                            "keydown",
                            escapeHandler
                        );

                        resolve(false);

                    }

                }


                document.addEventListener(
                    "keydown",
                    escapeHandler
                );

            }
        );

    }


    // ========================================================
    // LOGOUT
    // ========================================================

    async function logout() {

        const confirmed =
            await showLogoutModal();


        if (!confirmed) {

            return;

        }


        // --------------------------------------------
        // CLEAR LOCAL AUTH DATA
        // --------------------------------------------

        clearTokens();


        localStorage.removeItem(
            "datahub_logged_in"
        );


        // --------------------------------------------
        // REDIRECT
        // --------------------------------------------

        window.location.href =
            route("login");

    }


    // ========================================================
    // BUILD PAGE
    // ========================================================

    async function initializeLayout() {

        const main =
            document.querySelector(
                "main"
            );


        if (!main) {

            console.error(
                "DataHub layout requires a <main> element."
            );

            return;

        }


        // --------------------------------------------
        // GET USER
        // --------------------------------------------

        let user = null;


        if (getAccessToken()) {

            user =
                await getCurrentUser();

        }


        // --------------------------------------------
        // PROTECTED PAGE
        // --------------------------------------------

        const requiresAuth =
            document.body.dataset.auth ===
            "required";


        if (
            requiresAuth &&
            !user
        ) {

            clearTokens();

            localStorage.removeItem(
                "datahub_logged_in"
            );


            window.location.href =
                route("login");


            return;

        }


        // --------------------------------------------
        // NAVBAR
        // --------------------------------------------

        const navbar =
            createNavbar(user);


        main.parentNode.insertBefore(
            navbar,
            main
        );


        // --------------------------------------------
        // FOOTER
        // --------------------------------------------

        const footer =
            createFooter();


        main.parentNode.appendChild(
            footer
        );


        // --------------------------------------------
        // THEME
        // --------------------------------------------

        const themeButton =
            document.getElementById(
                "themeButton"
            );


        if (themeButton) {

            themeButton.addEventListener(
                "click",
                toggleTheme
            );

        }


        // --------------------------------------------
        // DESKTOP LOGOUT
        // --------------------------------------------

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        // --------------------------------------------
        // MOBILE LOGOUT
        // --------------------------------------------

        const mobileUserButton =
            document.getElementById(
                "mobileUserButton"
            );


        if (mobileUserButton) {

            mobileUserButton.addEventListener(
                "click",
                logout
            );

        }

    }


    // ========================================================
    // START
    // ========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeLayout
        );

    } else {

        initializeLayout();

    }


})();
