const API_BASE_URL =
    "https://favehub.pythonanywhere.com/api";


function getAccessToken() {

    return localStorage.getItem(
        "datahub_access_token"
    );

}


function getRefreshToken() {

    return localStorage.getItem(
        "datahub_refresh_token"
    );

}


function saveTokens(
    access,
    refresh
) {

    if (access) {

        localStorage.setItem(
            "datahub_access_token",
            access
        );

    }


    if (refresh) {

        localStorage.setItem(
            "datahub_refresh_token",
            refresh
        );

    }

}


function clearTokens() {

    localStorage.removeItem(
        "datahub_access_token"
    );

    localStorage.removeItem(
        "datahub_refresh_token"
    );

    localStorage.removeItem(
        "datahub_logged_in"
    );

}


async function refreshAccessToken() {

    const refreshToken =
        getRefreshToken();


    if (!refreshToken) {

        return false;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/auth/token/refresh/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        refresh:
                            refreshToken
                    })
                }
            );


        if (!response.ok) {

            clearTokens();

            return false;

        }


        const data =
            await response.json();


        if (!data.access) {

            clearTokens();

            return false;

        }


        localStorage.setItem(
            "datahub_access_token",
            data.access
        );


        return true;

    } catch (error) {

        console.error(
            "Token refresh failed:",
            error
        );

        return false;

    }

}


async function apiFetch(
    endpoint,
    options = {}
) {

    let token =
        getAccessToken();


    const headers = {

        "Accept":
            "application/json",

        ...(options.headers || {})

    };


    if (
        !(options.body instanceof FormData)
    ) {

        headers[
            "Content-Type"
        ] =
            "application/json";

    }


    if (token) {

        headers[
            "Authorization"
        ] =
            `Bearer ${token}`;

    }


    let response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    // ==========================================
    // ACCESS TOKEN EXPIRED
    // ==========================================

    if (
        response.status === 401
    ) {

        const refreshed =
            await refreshAccessToken();


        if (refreshed) {

            token =
                getAccessToken();


            headers[
                "Authorization"
            ] =
                `Bearer ${token}`;


            response =
                await fetch(
                    `${API_BASE_URL}${endpoint}`,
                    {
                        ...options,
                        headers
                    }
                );

        }

    }


    return response;

}
