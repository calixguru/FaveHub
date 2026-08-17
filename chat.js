// ============================================================
// DATAHUB CHAT
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // ELEMENTS
    // ========================================================

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    const chatForm =
        document.getElementById(
            "chatForm"
        );


    const chatInput =
        document.getElementById(
            "chatInput"
        );


    const sendButton =
        document.getElementById(
            "sendButton"
        );


    const voiceButton =
        document.getElementById(
            "voiceButton"
        );


    const voiceIcon =
        document.getElementById(
            "voiceIcon"
        );


    const typingIndicator =
        document.getElementById(
            "typingIndicator"
        );


    const wordCounter =
        document.getElementById(
            "wordCounter"
        );


    const chatEmpty =
        document.getElementById(
            "chatEmpty"
        );


    // ========================================================
    // STATE
    // ========================================================

    let mediaRecorder = null;

    let audioChunks = [];

    let recordingTimer = null;

    let recordingSeconds = 0;

    let isAuthenticated = false;

    let authenticationChecked = false;


    // ========================================================
    // TOKEN
    // ========================================================

    function getAccessToken() {

        return localStorage.getItem(
            "datahub_access_token"
        );

    }


    // ========================================================
    // CHARACTER COUNT
    // ========================================================

    function getCharacterCount(text) {

        return text.length;

    }


    function updateCharacterCounter() {

        if (!wordCounter) {

            return;

        }


        const count =
            getCharacterCount(
                chatInput.value
            );


        wordCounter.textContent =
            `${count}/50`;

    }


    // ========================================================
    // INPUT
    // ========================================================

    if (chatInput) {

        chatInput.addEventListener(
            "input",
            function () {

                updateCharacterCounter();

            }
        );

    }


    // ========================================================
    // ADD MESSAGE
    // ========================================================

    function addMessage(
        message,
        sender,
        messageType = "text",
        audioUrl = null
    ) {

        if (!chatMessages) {

            return;

        }


        // Remove empty state

        if (chatEmpty) {

            chatEmpty.remove();

        }


        const wrapper =
            document.createElement(
                "div"
            );


        if (sender === "user") {

            wrapper.className =
                "ml-auto max-w-[80%]";

        }

        else {

            wrapper.className =
                "max-w-[80%]";

        }


        const bubble =
            document.createElement(
                "div"
            );


        if (sender === "user") {

            bubble.className = `
                rounded-2xl
                rounded-tr-md
                px-4 py-3
                bg-blue-600
                text-white
                text-sm
                break-words
            `;

        }

        else {

            bubble.className = `
                rounded-2xl
                rounded-tl-md
                px-4 py-3
                bg-slate-100
                dark:bg-white/5
                text-sm
                text-slate-600
                dark:text-white/65
                break-words
            `;

        }


        // ==============================================
        // VOICE MESSAGE
        // ==============================================

        if (
            messageType === "voice" &&
            audioUrl
        ) {

            const audio =
                document.createElement(
                    "audio"
                );


            audio.controls = true;

            audio.src = audioUrl;

            audio.className =
                "max-w-full";


            bubble.appendChild(
                audio
            );

        }


        // ==============================================
        // TEXT MESSAGE
        // ==============================================

        else {

            bubble.textContent =
                message || "";

        }


        wrapper.appendChild(
            bubble
        );


        chatMessages.appendChild(
            wrapper
        );


        chatMessages.scrollTo({

            top:
                chatMessages.scrollHeight,

            behavior:
                "smooth"

        });

    }


    // ========================================================
    // LOGIN REQUIRED MESSAGE
    // ========================================================

    function showLoginRequired() {

        if (!chatMessages) {

            return;

        }


        if (chatEmpty) {

            chatEmpty.remove();

        }


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className = `
            flex
            justify-center
            px-4
            py-8
        `;


        wrapper.innerHTML = `

            <div
                class="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-blue-200
                    dark:border-blue-500/20
                    bg-blue-50
                    dark:bg-blue-500/10
                    p-6
                    text-center
                "
            >

                <div
                    class="
                        mx-auto
                        w-14
                        h-14
                        rounded-2xl
                        bg-blue-100
                        dark:bg-blue-500/10
                        flex
                        items-center
                        justify-center
                        text-2xl
                    "
                >
                    🔐
                </div>


                <h3
                    class="
                        mt-4
                        text-lg
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    Login required
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
                    Please log in to use FaveHub Chat.
                    Once you're logged in, your personal
                    conversation will be available here.
                </p>


                <div
                    class="
                        mt-5
                        flex
                        justify-center
                        gap-3
                    "
                >

                    <a
                        href="/FaveHub/login"
                        class="
                            h-10
                            px-5
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-500
                            text-white
                            text-sm
                            font-semibold
                            flex
                            items-center
                            justify-center
                            transition
                        "
                    >
                        Login
                    </a>


                    <a
                        href="/FaveHub/register"
                        class="
                            h-10
                            px-5
                            rounded-xl
                            border
                            border-slate-200
                            dark:border-white/10
                            text-slate-700
                            dark:text-white/70
                            text-sm
                            font-semibold
                            flex
                            items-center
                            justify-center
                            hover:bg-slate-100
                            dark:hover:bg-white/5
                            transition
                        "
                    >
                        Create account
                    </a>

                </div>

            </div>

        `;


        chatMessages.appendChild(
            wrapper
        );


        chatMessages.scrollTo({

            top:
                chatMessages.scrollHeight,

            behavior:
                "smooth"

        });

    }


    // ========================================================
    // DISABLE CHAT
    // ========================================================

    function disableChat() {

        if (chatInput) {

            chatInput.disabled =
                true;

        }


        if (sendButton) {

            sendButton.disabled =
                true;

        }


        if (voiceButton) {

            voiceButton.disabled =
                true;

        }

    }


    // ========================================================
    // ENABLE CHAT
    // ========================================================

    function enableChat() {

        if (chatInput) {

            chatInput.disabled =
                false;

        }


        if (sendButton) {

            sendButton.disabled =
                false;

        }


        if (voiceButton) {

            voiceButton.disabled =
                false;

        }

    }


    // ========================================================
    // TYPING
    // ========================================================

    function showTyping() {

        if (!typingIndicator) {

            return;

        }


        typingIndicator.classList.remove(
            "hidden"
        );


        if (chatMessages) {

            chatMessages.scrollTo({

                top:
                    chatMessages.scrollHeight,

                behavior:
                    "smooth"

            });

        }

    }


    function hideTyping() {

        if (!typingIndicator) {

            return;

        }


        typingIndicator.classList.add(
            "hidden"
        );

    }


    // ========================================================
    // CHECK AUTHENTICATION
    // ========================================================

    async function checkAuthentication() {

        const token =
            getAccessToken();


        // --------------------------------------------
        // No access token
        // --------------------------------------------

        if (!token) {

            isAuthenticated =
                false;

            authenticationChecked =
                true;

            return false;

        }


        try {

            /*
             * /auth/me/ is protected by
             * IsAuthenticated.
             *
             * Therefore a successful response
             * means the user is authenticated.
             */

            const response =
                await apiFetch(
                    "/auth/me/"
                );


            if (!response) {

                isAuthenticated =
                    false;

                authenticationChecked =
                    true;

                return false;

            }


            if (response.status === 401) {

                isAuthenticated =
                    false;

                authenticationChecked =
                    true;

                return false;

            }


            if (!response.ok) {

                isAuthenticated =
                    false;

                authenticationChecked =
                    true;

                return false;

            }


            const user =
                await response.json();


            /*
             * Store useful information locally
             * only for UI purposes.
             *
             * The backend remains the source
             * of truth.
             */

            if (user) {

                localStorage.setItem(
                    "datahub_user",
                    JSON.stringify(user)
                );

            }


            isAuthenticated =
                true;

            authenticationChecked =
                true;


            return true;

        }

        catch (error) {

            console.error(
                "Authentication check failed:",
                error
            );


            isAuthenticated =
                false;

            authenticationChecked =
                true;


            return false;

        }

    }


    // ========================================================
    // HANDLE UNAUTHENTICATED USER
    // ========================================================

    function handleNotAuthenticated() {

        isAuthenticated =
            false;


        disableChat();


        hideTyping();


        showLoginRequired();

    }


    // ========================================================
    // LOAD CHAT HISTORY
    // ========================================================

    async function loadChat() {

        /*
         * First make absolutely sure we know
         * who is using the chat.
         */

        const authenticated =
            await checkAuthentication();


        if (!authenticated) {

            handleNotAuthenticated();

            return;

        }


        try {

            const response =
                await apiFetch(
                    "/chat/"
                );


            if (!response) {

                handleNotAuthenticated();

                return;

            }


            // ==========================================
            // UNAUTHORIZED
            // ==========================================

            if (
                response.status ===
                401
            ) {

                handleNotAuthenticated();

                return;

            }


            // ==========================================
            // OTHER ERROR
            // ==========================================

            if (!response.ok) {

                console.error(
                    "Unable to load chat history."
                );

                return;

            }


            const messages =
                await response.json();


            // ==========================================
            // EMPTY CHAT
            // ==========================================

            if (
                !Array.isArray(messages) ||
                messages.length === 0
            ) {

                return;

            }


            if (chatEmpty) {

                chatEmpty.remove();

            }


            // ==========================================
            // DISPLAY HISTORY
            // ==========================================

            messages.forEach(
                function (item) {

                    addMessage(

                        item.message,

                        item.sender,

                        item.message_type,

                        item.audio

                    );

                }
            );


            // ==========================================
            // SCROLL TO BOTTOM
            // ==========================================

            if (chatMessages) {

                chatMessages.scrollTop =
                    chatMessages.scrollHeight;

            }

        }

        catch (error) {

            console.error(
                "Could not load chat history:",
                error
            );

        }

    }


    // ========================================================
    // SEND TEXT MESSAGE
    // ========================================================

    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ==========================================
                // AUTH CHECK
                // ==========================================

                if (!isAuthenticated) {

                    showLoginRequired();

                    return;

                }


                const message =
                    chatInput.value.trim();


                if (!message) {

                    return;

                }


                // ==========================================
                // 50 CHARACTER LIMIT
                // ==========================================

                if (
                    message.length >
                    50
                ) {

                    addMessage(

                        "Your message cannot exceed 50 characters.",

                        "assistant"

                    );

                    return;

                }


                // ==========================================
                // CLEAR INPUT
                // ==========================================

                chatInput.value = "";

                updateCharacterCounter();


                // ==========================================
                // SHOW USER MESSAGE
                // ==========================================

                addMessage(

                    message,

                    "user"

                );


                sendButton.disabled =
                    true;

                chatInput.disabled =
                    true;


                showTyping();


                // ==========================================
                // ARTIFICIAL DELAY
                // ==========================================

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            500
                        )
                );


                try {

                    const response =
                        await apiFetch(
                            "/chat/",
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        message:
                                            message
                                    })
                            }
                        );


                    // ==================================
                    // NO RESPONSE
                    // ==================================

                    if (!response) {

                        hideTyping();

                        return;

                    }


                    // ==================================
                    // UNAUTHORIZED
                    // ==================================

                    if (
                        response.status ===
                        401
                    ) {

                        hideTyping();

                        handleNotAuthenticated();

                        return;

                    }


                    let data = {};


                    try {

                        data =
                            await response.json();

                    }

                    catch (error) {

                        data = {};

                    }


                    // ==================================
                    // BACKEND ERROR
                    // ==================================

                    if (!response.ok) {

                        hideTyping();


                        addMessage(

                            data.detail ||
                            "Something went wrong while processing your message.",

                            "assistant"

                        );


                        return;

                    }


                    // ==================================
                    // WAIT FOR TYPING EFFECT
                    // ==================================

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                500
                            )
                    );


                    hideTyping();


                    // ==================================
                    // BACKEND RESPONSE
                    // ==================================

                    if (
                        data.assistant_message
                    ) {

                        addMessage(

                            data
                                .assistant_message
                                .message,

                            "assistant",

                            data
                                .assistant_message
                                .message_type ||
                                "text"

                        );

                    }

                    else {

                        addMessage(

                            "DataHub received your message.",

                            "assistant"

                        );

                    }

                }

                catch (error) {

                    console.error(
                        "Chat error:",
                        error
                    );


                    hideTyping();


                    addMessage(

                        "Sorry, I couldn't connect to DataHub right now.",

                        "assistant"

                    );

                }

                finally {

                    if (
                        isAuthenticated
                    ) {

                        sendButton.disabled =
                            false;

                        chatInput.disabled =
                            false;

                        chatInput.focus();

                    }

                }

            }
        );

    }


    // ========================================================
    // VOICE BUTTON
    // ========================================================

    if (voiceButton) {

        voiceButton.addEventListener(
            "click",
            async function () {

                // ==========================================
                // AUTH CHECK
                // ==========================================

                if (!isAuthenticated) {

                    showLoginRequired();

                    return;

                }


                if (
                    mediaRecorder &&
                    mediaRecorder.state ===
                    "recording"
                ) {

                    stopRecording();

                    return;

                }


                await startRecording();

            }
        );

    }


    // ========================================================
    // START RECORDING
    // ========================================================

    async function startRecording() {

        if (!isAuthenticated) {

            showLoginRequired();

            return;

        }


        try {

            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        audio: true
                    });


            audioChunks = [];

            recordingSeconds = 0;


            mediaRecorder =
                new MediaRecorder(
                    stream
                );


            mediaRecorder.ondataavailable =
                function (event) {

                    if (
                        event.data.size >
                        0
                    ) {

                        audioChunks.push(
                            event.data
                        );

                    }

                };


            mediaRecorder.onstop =
                async function () {

                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );


                    clearInterval(
                        recordingTimer
                    );


                    voiceIcon.textContent =
                        "🎙";


                    voiceButton.classList.remove(
                        "bg-red-500",
                        "text-white"
                    );


                    const audioBlob =
                        new Blob(
                            audioChunks,
                            {
                                type:
                                    mediaRecorder.mimeType
                            }
                        );


                    await sendVoiceMessage(
                        audioBlob
                    );

                };


            mediaRecorder.start();


            voiceIcon.textContent =
                "⏹";


            voiceButton.classList.add(
                "bg-red-500",
                "text-white"
            );


            // ==========================================
            // MAXIMUM 50 SECONDS
            // ==========================================

            recordingTimer =
                setInterval(
                    function () {

                        recordingSeconds++;


                        if (
                            recordingSeconds >=
                            50
                        ) {

                            stopRecording();

                        }

                    },
                    1000
                );

        }

        catch (error) {

            console.error(
                "Microphone error:",
                error
            );


            addMessage(

                "Microphone permission is required to send a voice message.",

                "assistant"

            );

        }

    }


    // ========================================================
    // STOP RECORDING
    // ========================================================

    function stopRecording() {

        if (
            mediaRecorder &&
            mediaRecorder.state ===
            "recording"
        ) {

            mediaRecorder.stop();

        }

    }


    // ========================================================
    // SEND VOICE MESSAGE
    // ========================================================

    async function sendVoiceMessage(
        audioBlob
    ) {

        if (!isAuthenticated) {

            showLoginRequired();

            return;

        }


        const localAudioUrl =
            URL.createObjectURL(
                audioBlob
            );


        // ==========================================
        // SHOW USER VOICE MESSAGE
        // ==========================================

        addMessage(

            "",

            "user",

            "voice",

            localAudioUrl

        );


        showTyping();


        try {

            const formData =
                new FormData();


            formData.append(

                "audio",

                audioBlob,

                "voice-message.webm"

            );


            const response =
                await apiFetch(
                    "/chat/",
                    {
                        method:
                            "POST",

                        body:
                            formData
                    }
                );


            if (!response) {

                hideTyping();

                return;

            }


            // ==========================================
            // UNAUTHORIZED
            // ==========================================

            if (
                response.status ===
                401
            ) {

                hideTyping();

                handleNotAuthenticated();

                return;

            }


            let data = {};


            try {

                data =
                    await response.json();

            }

            catch (error) {

                data = {};

            }


            // ==========================================
            // BACKEND ERROR
            // ==========================================

            if (!response.ok) {

                hideTyping();


                addMessage(

                    data.detail ||
                    "Unable to send voice message.",

                    "assistant"

                );


                return;

            }


            // ==========================================
            // TYPING DELAY
            // ==========================================

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        700
                    )
            );


            hideTyping();


            // ==========================================
            // BACKEND RESPONSE
            // ==========================================

            if (
                data.assistant_message
            ) {

                addMessage(

                    data
                        .assistant_message
                        .message,

                    "assistant",

                    data
                        .assistant_message
                        .message_type ||
                        "text"

                );

            }

            else {

                addMessage(

                    "Your voice message was received.",

                    "assistant"

                );

            }

        }

        catch (error) {

            console.error(
                "Voice chat error:",
                error
            );


            hideTyping();


            addMessage(

                "I couldn't connect to DataHub right now.",

                "assistant"

            );

        }

    }


    // ========================================================
    // INITIALIZE
    // ========================================================

    async function initializeChat() {

        if (!chatMessages) {

            return;

        }


        /*
         * We deliberately check authentication before
         * loading /chat/.
         *
         * This means an anonymous visitor never
         * attempts to access the protected endpoint.
         */

        await loadChat();

    }


    // ========================================================
    // PAGE START
    // ========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeChat
        );

    }

    else {

        initializeChat();

    }


})();
