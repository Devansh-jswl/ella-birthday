import { SITE } from "./data.js";


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) =>
    [...document.querySelectorAll(selector)];

const esc = (value) =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");


/* =========================================================
   EMAILJS CONFIGURATION
   ========================================================= */

const EMAILJS_SERVICE_ID = "service_3udm6tn";
const EMAILJS_TEMPLATE_ID = "template_ws761cn";
const EMAILJS_PUBLIC_KEY = "N_WBOlxjm6oqzWUgO";

let emailNotificationSent = false;


/* =========================================================
   SEND GMAIL NOTIFICATION
   ========================================================= */

async function sendProposalNotification(answer, message) {

    if (emailNotificationSent) {
        console.log("Proposal notification already sent.");
        return;
    }

    if (typeof window.emailjs === "undefined") {

        console.error(
            "EmailJS is not loaded. Check index.html."
        );

        return;
    }

    const now = new Date();

    const time = now.toLocaleString(
        "en-IN",
        {
            dateStyle: "full",
            timeStyle: "medium"
        }
    );

    const device = navigator.userAgent;

    try {

        await window.emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                answer: answer,
                message: message,
                time: time,
                device: device
            }
        );

        emailNotificationSent = true;

        console.log(
            "Proposal notification sent successfully."
        );

    } catch (error) {

        console.error(
            "EmailJS notification failed:",
            error
        );

    }
}


/* =========================================================
   PHOTO SYSTEM
   ========================================================= */

const PHOTO_EXTENSIONS = [
    "webp",
    "jpg",
    "jpeg",
    "png"
];


function imageCandidates(filename) {

    const base = String(filename)
        .replace(
            /\.(webp|jpg|jpeg|png)$/i,
            ""
        );

    return PHOTO_EXTENSIONS.map(
        extension =>
            `assets/photos/${base}.${extension}`
    );
}


function placeholderImage(number) {

    return (
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(`

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 1000"
            >

                <rect
                    width="100%"
                    height="100%"
                    fill="#21101c"
                />

                <text
                    x="50%"
                    y="48%"
                    text-anchor="middle"
                    fill="#ffc0d3"
                    font-size="130"
                    font-family="Georgia"
                >
                    ${number}
                </text>

                <text
                    x="50%"
                    y="58%"
                    text-anchor="middle"
                    fill="#aaa"
                    font-size="22"
                    font-family="Arial"
                >
                    ADD PHOTO
                </text>

            </svg>

        `)
    );
}


function setImageSource(
    image,
    filename,
    index = 0
) {

    if (!image) return;

    const urls =
        imageCandidates(filename);

    let current = 0;

    function tryNextImage() {

        if (current >= urls.length) {

            image.src =
                placeholderImage(index + 1);

            image.onerror = null;

            return;
        }

        image.src =
            urls[current];

        current++;
    }

    image.onerror =
        tryNextImage;

    tryNextImage();
}


function loadImage(
    image,
    filename,
    index = 0
) {

    setImageSource(
        image,
        filename,
        Math.max(0, index - 1)
    );
}


/* =========================================================
   STORY
   ========================================================= */

const storyQuote =
    $("#storyQuote");

if (storyQuote) {

    storyQuote.textContent =
        SITE.storyQuote;
}


/* =========================================================
   LOVE LETTER
   ========================================================= */

const letterText =
    $("#letterText");

if (letterText) {

    letterText.innerHTML =
        SITE.letter
            .map(
                paragraph =>
                    `<p>${esc(paragraph)}</p>`
            )
            .join("");
}


/* =========================================================
   TIMELINE
   ========================================================= */

const timelineList =
    $("#timelineList");

if (timelineList) {

    timelineList.innerHTML =
        SITE.timeline
            .map(
                item => `

                    <article class="event reveal">

                        <i class="dot"></i>

                        <small>
                            ${esc(item[0])}
                        </small>

                        <h3>
                            ${esc(item[1])}
                        </h3>

                        <p>
                            ${esc(item[2])}
                        </p>

                    </article>

                `
            )
            .join("");
}


/* =========================================================
   MEMORY GRID
   ========================================================= */

const memoryGrid =
    $("#memoryGrid");

if (memoryGrid) {

    memoryGrid.innerHTML =
        SITE.memories
            .map(
                (memory, index) => `

                    <article
                        class="memory reveal"
                        data-i="${index}"
                        tabindex="0"
                        role="button"
                        aria-label="Open memory ${
                            index + 1
                        }"
                    >

                        <img
                            data-photo-name="${esc(memory[0])}"
                            alt="${esc(memory[1])}"
                            loading="${
                                index < 6
                                    ? "eager"
                                    : "lazy"
                            }"
                        >

                        <div class="memory-info">

                            <small>
                                MEMORY
                                ${
                                    String(index + 1)
                                        .padStart(2, "0")
                                }
                            </small>

                            <h3>
                                ${esc(memory[1])}
                            </h3>

                            <p>
                                Tap to open
                            </p>

                        </div>

                    </article>

                `
            )
            .join("");
}


/* =========================================================
   LOAD PHOTOGRAPHS
   ========================================================= */

$$("[data-photo-name]")
    .forEach(
        (image, index) => {

            setImageSource(
                image,
                image.dataset.photoName,
                index
            );

        }
    );


/* =========================================================
   NORMAL MEMORY MODAL
   ========================================================= */

const modal =
    $("#modal");


function openNormalMemory(index) {

    const memory =
        SITE.memories[index];

    if (!memory || !modal) return;


    const label =
        $("#modalLabel");

    const title =
        $("#modalTitle");

    const quote =
        $("#modalQuote");

    const image =
        $("#modalImg");


    if (label) {

        label.textContent =
            `MEMORY ${
                String(index + 1)
                    .padStart(2, "0")
            }`;

    }


    if (title) {

        title.textContent =
            memory[1];

    }


    if (quote) {

        quote.textContent =
            memory[2];

    }


    if (image) {

        loadImage(
            image,
            memory[0],
            index + 1
        );

        image.alt =
            memory[1];

    }


    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


/* =========================================================
   MEMORY CLICK
   ========================================================= */

if (memoryGrid) {

    memoryGrid.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    ".memory"
                );

            if (!card) return;

            const index =
                Number(
                    card.dataset.i
                );


            /*
                LAST PHOTO = PROPOSAL

                If there are 29 memories,
                index 28 = Photo 29.
            */

            if (
                index ===
                SITE.memories.length - 1
            ) {

                openProposal(
                    SITE.memories[index]
                );

                return;
            }


            openNormalMemory(index);

        }
    );


    memoryGrid.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }


            const card =
                event.target.closest(
                    ".memory"
                );

            if (!card) return;

            event.preventDefault();


            const index =
                Number(
                    card.dataset.i
                );


            if (
                index ===
                SITE.memories.length - 1
            ) {

                openProposal(
                    SITE.memories[index]
                );

                return;
            }


            openNormalMemory(index);

        }
    );

}


/* =========================================================
   CLOSE NORMAL MEMORY MODAL
   ========================================================= */

$$("[data-close]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (!modal) return;

                    modal.classList.remove(
                        "open"
                    );

                    modal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }
            );

        }
    );


/* =========================================================
   VIDEO SYSTEM
   ========================================================= */

const videoGrid =
    $("#videoGrid");

const videoModal =
    $("#videoModal");

const modalVideo =
    $("#modalVideo");


if (
    videoGrid &&
    Array.isArray(SITE.videos)
) {

    videoGrid.innerHTML =
        SITE.videos
            .map(
                (video, index) => `

                    <article
                        class="video-card reveal"
                        data-video-i="${index}"
                        tabindex="0"
                        role="button"
                        aria-label="Open video"
                    >

                        <div class="video-thumb">

                            <video
                                src="assets/videos/${esc(video[0])}"
                                muted
                                playsinline
                                preload="metadata"
                            ></video>

                            <span class="play">
                                ▶
                            </span>

                            <span class="video-badge">
                                VIDEO
                                ${
                                    String(index + 1)
                                        .padStart(2, "0")
                                }
                            </span>

                        </div>


                        <div class="video-info">

                            <small>
                                A LITTLE PIECE OF US
                            </small>

                            <h3>
                                ${esc(video[1])}
                            </h3>

                            <p>
                                ${esc(video[2])}
                            </p>

                        </div>

                    </article>

                `
            )
            .join("");
}


function openVideo(index) {

    if (
        !videoModal ||
        !modalVideo
    ) {
        return;
    }


    const video =
        SITE.videos[index];

    if (!video) return;


    const label =
        $("#modalVideoLabel");

    const title =
        $("#modalVideoTitle");

    const quote =
        $("#modalVideoQuote");


    if (label) {

        label.textContent =
            `VIDEO ${
                String(index + 1)
                    .padStart(2, "0")
            }`;

    }


    if (title) {

        title.textContent =
            video[1];

    }


    if (quote) {

        quote.textContent =
            video[2];

    }


    modalVideo.src =
        `assets/videos/${video[0]}`;


    videoModal.classList.add(
        "open"
    );


    videoModal.setAttribute(
        "aria-hidden",
        "false"
    );


    modalVideo
        .play()
        .catch(
            () => {}
        );
}


function closeVideo() {

    if (
        !videoModal ||
        !modalVideo
    ) {
        return;
    }


    modalVideo.pause();

    modalVideo.removeAttribute(
        "src"
    );

    modalVideo.load();


    videoModal.classList.remove(
        "open"
    );


    videoModal.setAttribute(
        "aria-hidden",
        "true"
    );
}


$$("[data-video-close]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                closeVideo
            );

        }
    );


if (videoGrid) {

    videoGrid.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    ".video-card"
                );

            if (!card) return;


            openVideo(
                Number(
                    card.dataset.videoI
                )
            );

        }
    );


    videoGrid.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }


            const card =
                event.target.closest(
                    ".video-card"
                );

            if (!card) return;

            event.preventDefault();


            openVideo(
                Number(
                    card.dataset.videoI
                )
            );

        }
    );

}


/* =========================================================
   PROPOSAL SYSTEM
   ========================================================= */

let proposalElement = null;

let noAttempts = 0;


/* =========================================================
   PROPOSAL MESSAGES
   ========================================================= */

const noMessages = [

    "Think twice... ❤️",

    "Are you sure? 🥺",

    "Think thrice... 💕",

    "Hmm... maybe your heart wants Yes? 😌",

    "You almost caught it! 😏",

    "Okay... seriously, think again. ❤️",

    "The No button seems a little shy. 😂",

    "It keeps running... 🏃‍♂️💨",

    "Maybe your heart already knows the answer. ❤️",

    "I'll give you one more chance... 💗"

];


/* =========================================================
   CLOSE PROPOSAL
   ========================================================= */

function closeProposal() {

    if (!proposalElement) {
        return;
    }


    proposalElement.remove();

    proposalElement =
        null;

    noAttempts = 0;
}


/* =========================================================
   MOVE NO BUTTON
   ========================================================= */

function moveNoButton(
    button,
    container,
    response
) {

    if (
        !button ||
        !container
    ) {
        return;
    }


    noAttempts++;


    /*
        Show progressively playful messages.
    */

    if (response) {

        response.textContent =
            noMessages[
                Math.min(
                    noAttempts - 1,
                    noMessages.length - 1
                )
            ];

    }


    /*
        Small vibration on supported phones.
    */

    if (
        navigator.vibrate
    ) {

        try {

            navigator.vibrate(
                [20, 20, 20]
            );

        } catch {}

    }


    /*
        Make button absolute
        after first attempt.
    */

    button.style.position =
        "absolute";


    const containerWidth =
        container.clientWidth;

    const containerHeight =
        Math.max(
            120,
            container.clientHeight
        );


    const buttonWidth =
        button.offsetWidth;

    const buttonHeight =
        button.offsetHeight;


    /*
        Keep button completely
        inside the proposal area.
    */

    const maxX =
        Math.max(
            0,
            containerWidth -
            buttonWidth -
            5
        );


    const maxY =
        Math.max(
            0,
            containerHeight -
            buttonHeight -
            5
        );


    /*
        Random position.
    */

    const x =
        Math.random() *
        maxX;


    const y =
        Math.random() *
        maxY;


    button.style.left =
        `${x}px`;

    button.style.top =
        `${y}px`;


    /*
        Make No progressively smaller.
    */

    if (
        noAttempts >= 3
    ) {

        const scale =
            Math.max(
                0.68,
                1 -
                noAttempts *
                0.035
            );


        button.style.transform =
            `scale(${scale})`;

    }


    /*
        Make it move faster
        after several attempts.
    */

    if (
        noAttempts >= 5
    ) {

        button.style.transition =
            "left .15s ease, top .15s ease, transform .15s ease";

    }

}


/* =========================================================
   OPEN PROPOSAL
   ========================================================= */

function openProposal(memory) {

    if (!memory) {

        console.error(
            "Proposal memory does not exist."
        );

        return;
    }


    /*
        Close any previous proposal.
    */

    closeProposal();


    noAttempts = 0;


    /*
        Full-screen proposal overlay.
    */

    proposalElement =
        document.createElement(
            "div"
        );


    proposalElement.id =
        "proposalReveal";


    Object.assign(
        proposalElement.style,
        {

            position: "fixed",

            inset: "0",

            zIndex: "999999",

            background:
                "radial-gradient(circle at center, rgba(60,15,35,.96), rgba(5,2,7,.98))",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            padding: "20px",

            overflow: "auto",

            boxSizing: "border-box"

        }
    );


    /*
        Proposal box.
    */

    const box =
        document.createElement(
            "div"
        );


    Object.assign(
        box.style,
        {

            position: "relative",

            width:
                "min(1000px, 95vw)",

            maxHeight: "92vh",

            overflow: "auto",

            display: "grid",

            gridTemplateColumns:
                "1fr 1fr",

            background:
                "linear-gradient(145deg,#170b16,#0d070d)",

            border:
                "1px solid rgba(255,190,210,.3)",

            borderRadius:
                "22px",

            boxShadow:
                "0 30px 100px rgba(0,0,0,.85), 0 0 80px rgba(180,60,110,.12)",

            boxSizing:
                "border-box",

            overflowWrap:
                "break-word"

        }
    );


    /*
        Proposal image.
    */

    const imageWrap =
        document.createElement(
            "div"
        );


    Object.assign(
        imageWrap.style,
        {

            minHeight:
                "500px",

            position:
                "relative",

            overflow:
                "hidden"

        }
    );


    const proposalImage =
        document.createElement(
            "img"
        );


    Object.assign(
        proposalImage.style,
        {

            width: "100%",

            height: "100%",

            minHeight:
                "500px",

            objectFit:
                "cover",

            display:
                "block"

        }
    );


    proposalImage.alt =
        "Ella — one last question";


    /*
        Load Photo 29.
    */

    setImageSource(
        proposalImage,
        memory[0],
        SITE.memories.length - 1
    );


    imageWrap.appendChild(
        proposalImage
    );


    /*
        Soft image overlay.
    */

    const imageGlow =
        document.createElement(
            "div"
        );


    Object.assign(
        imageGlow.style,
        {

            position:
                "absolute",

            inset:
                "0",

            pointerEvents:
                "none",

            background:
                "linear-gradient(to top, rgba(8,2,8,.4), transparent 45%)"

        }
    );


    imageWrap.appendChild(
        imageGlow
    );


    /*
        Proposal content.
    */

    const content =
        document.createElement(
            "div"
        );


    Object.assign(
        content.style,
        {

            padding:
                "50px",

            display:
                "flex",

            flexDirection:
                "column",

            justifyContent:
                "center",

            color:
                "#fff0f5",

            boxSizing:
                "border-box"

        }
    );


    content.innerHTML = `

        <small
            style="
                color:#f5a8bf;
                letter-spacing:.2em;
                font-weight:bold;
                font-size:.72rem;
            "
        >
            THE LAST MEMORY
        </small>


        <div
            style="
                font-size:3rem;
                margin:15px 0 5px;
                animation:proposalRingFloat 2.5s ease-in-out infinite;
                filter:drop-shadow(0 0 15px rgba(255,190,210,.35));
            "
        >
            💍
        </div>


        <h2
            style="
                font-family:Georgia,serif;
                font-size:clamp(2.7rem,6vw,4.8rem);
                margin:10px 0 15px;
                font-weight:500;
                line-height:.95;
                color:#fff4f7;
            "
        >
            Ella...
        </h2>


        <p
            style="
                color:#b8a8b0;
                line-height:1.8;
                font-size:1rem;
                margin:0 0 8px;
            "
        >
            I saved this memory for the very end
            because there is something I want to ask you.
        </p>


        <p
            style="
                color:#d8c3cb;
                line-height:1.7;
                font-size:.98rem;
                margin:0 0 8px;
            "
        >
            I could have ended this website with
            a birthday wish...
            but somehow that didn't feel like enough
            for someone as special as you.
        </p>


        <h3
            style="
                color:#ffc0d3;
                font-family:Georgia,serif;
                font-size:clamp(1.7rem,4vw,2.7rem);
                line-height:1.15;
                font-weight:500;
                margin:25px 0;
            "
        >
            Will you keep making
            beautiful memories with me?
        </h3>


        <div
            id="proposalButtons"
            style="
                position:relative;
                min-height:120px;
                display:flex;
                align-items:center;
                gap:12px;
                flex-wrap:wrap;
                width:100%;
            "
        >

            <button
                id="finalYes"
                type="button"
                style="
                    padding:14px 30px;
                    border-radius:999px;
                    border:1px solid #d66b91;
                    background:linear-gradient(135deg,#a83e68,#762449);
                    color:white;
                    cursor:pointer;
                    font-size:1rem;
                    position:relative;
                    z-index:10;
                    transition:
                        transform .2s ease,
                        box-shadow .2s ease;
                    box-shadow:
                        0 8px 25px rgba(150,45,90,.25);
                "
            >
                Yes ❤️
            </button>


            <button
                id="finalNo"
                type="button"
                style="
                    padding:14px 30px;
                    border-radius:999px;
                    border:1px solid rgba(255,255,255,.2);
                    background:rgba(255,255,255,.06);
                    color:#fff;
                    cursor:pointer;
                    font-size:1rem;
                    position:relative;
                    z-index:20;
                    transition:
                        left .25s ease,
                        top .25s ease,
                        transform .25s ease;
                    touch-action:none;
                "
            >
                No 😢
            </button>

        </div>


        <div
            id="finalResponse"
            aria-live="polite"
            style="
                margin-top:5px;
                min-height:45px;
                color:#ffc0d3;
                font-family:Georgia,serif;
                font-size:1.25rem;
                line-height:1.4;
            "
        ></div>

    `;


    /*
        Close button.
    */

    const closeButton =
        document.createElement(
            "button"
        );


    closeButton.textContent =
        "×";


    closeButton.type =
        "button";


    closeButton.setAttribute(
        "aria-label",
        "Close proposal"
    );


    Object.assign(
        closeButton.style,
        {

            position:
                "absolute",

            top:
                "12px",

            right:
                "12px",

            zIndex:
                "100",

            width:
                "42px",

            height:
                "42px",

            borderRadius:
                "50%",

            border:
                "1px solid rgba(255,255,255,.25)",

            background:
                "rgba(0,0,0,.7)",

            color:
                "white",

            fontSize:
                "25px",

            lineHeight:
                "1",

            cursor:
                "pointer"

        }
    );


    closeButton.addEventListener(
        "click",
        closeProposal
    );


    /*
        Build proposal.
    */

    box.appendChild(
        closeButton
    );

    box.appendChild(
        imageWrap
    );

    box.appendChild(
        content
    );


    proposalElement.appendChild(
        box
    );


    document.body.appendChild(
        proposalElement
    );


    /*
        Small proposal animation style.
    */

    if (
        !document.getElementById(
            "proposalAnimationStyles"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "proposalAnimationStyles";


        style.textContent = `

            @keyframes proposalRingFloat {

                0%,100% {
                    transform:
                        translateY(0)
                        rotate(-4deg);
                }

                50% {
                    transform:
                        translateY(-8px)
                        rotate(4deg);
                }

            }

            @keyframes proposalYesPulse {

                0% {
                    transform:scale(1);
                }

                50% {
                    transform:scale(1.12);
                }

                100% {
                    transform:scale(1);
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /*
        YES BUTTON
    */

    const finalYes =
        content.querySelector(
            "#finalYes"
        );


    /*
        NO BUTTON
    */

    const finalNo =
        content.querySelector(
            "#finalNo"
        );


    const proposalButtons =
        content.querySelector(
            "#proposalButtons"
        );


    const response =
        content.querySelector(
            "#finalResponse"
        );


    /* =====================================================
       YES ACTION
    ===================================================== */

    if (finalYes) {

        finalYes.addEventListener(
            "click",
            async () => {

                if (response) {

                    response.innerHTML =
                        `
                        <strong>
                            You just made my heart very happy. ❤️
                        </strong>
                        <br>
                        <span style="
                            font-size:.95rem;
                            color:#bfaab2;
                        ">
                            Then let's keep writing our story together.
                        </span>
                        `;

                }


                finalYes.style.animation =
                    "proposalYesPulse .55s ease";


                finalYes.style.boxShadow =
                    "0 0 35px rgba(255,100,160,.55)";


                createProposalHearts();

                chime();


                /*
                    SEND GMAIL NOTIFICATION
                */

                await sendProposalNotification(
                    "YES ❤️",
                    "Ella said YES! ❤️ She chose to keep making beautiful memories with you."
                );

            }
        );

    }


    /* =====================================================
       NO ACTION
    ===================================================== */

    function escapeNo() {

        moveNoButton(
            finalNo,
            proposalButtons,
            response
        );

    }


    if (finalNo) {

        /*
            Desktop:
            Move when mouse approaches.
        */

        finalNo.addEventListener(
            "mouseenter",
            escapeNo
        );


        finalNo.addEventListener(
            "mouseover",
            escapeNo
        );


        /*
            Touchscreen:
            Move before she can tap it.
        */

        finalNo.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                escapeNo();

            },
            {
                passive:false
            }
        );


        /*
            Pointer support.
        */

        finalNo.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.pointerType ===
                    "touch"
                ) {

                    event.preventDefault();

                    escapeNo();

                }

            }
        );


        /*
            If she somehow catches it,
            show message and send NO notification.
        */

        finalNo.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                if (response) {

                    response.textContent =
                        "You actually caught it... 🥺❤️";

                }


                await sendProposalNotification(
                    "NO 😢",
                    "Ella managed to catch the No button."
                );


                escapeNo();

            }
        );

    }


    /*
        Click outside proposal box
        closes it.
    */

    proposalElement.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                proposalElement
            ) {

                closeProposal();

            }

        }
    );


    /*
        MOBILE LAYOUT
    */

    function updateProposalLayout() {

        if (
            window.innerWidth <= 700
        ) {

            box.style.gridTemplateColumns =
                "1fr";


            proposalImage.style.minHeight =
                "280px";


            imageWrap.style.minHeight =
                "280px";


            content.style.padding =
                "30px 24px 35px";


            proposalElement.style.padding =
                "10px";


            box.style.maxHeight =
                "95vh";

        } else {

            box.style.gridTemplateColumns =
                "1fr 1fr";


            proposalImage.style.minHeight =
                "500px";


            imageWrap.style.minHeight =
                "500px";


            content.style.padding =
                "50px";


            proposalElement.style.padding =
                "20px";

        }

    }


    updateProposalLayout();


    window.addEventListener(
        "resize",
        updateProposalLayout,
        {
            passive:true
        }
    );


    console.log(
        "PROPOSAL CREATED SUCCESSFULLY"
    );

}


/* =========================================================
   HEART ANIMATION
   ========================================================= */

function createProposalHearts() {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.textContent =
            Math.random() > 0.25
                ? "♥"
                : "✦";


        Object.assign(
            heart.style,
            {

                position:
                    "fixed",

                zIndex:
                    "1000000",

                left:
                    `${
                        45 +
                        (Math.random() - 0.5) *
                        30
                    }%`,

                top:
                    "65%",

                color:
                    "#ffb8cf",

                fontSize:
                    `${
                        12 +
                        Math.random() * 22
                    }px`,

                pointerEvents:
                    "none",

                transition:
                    "transform 1.7s ease-out, opacity 1.7s ease-out",

                textShadow:
                    "0 0 15px rgba(255,130,170,.6)"

            }
        );


        document.body.appendChild(
            heart
        );


        requestAnimationFrame(
            () => {

                heart.style.transform =
                    `
                    translate(
                        ${
                            (Math.random() - 0.5) *
                            350
                        }px,
                        ${
                            -150 -
                            Math.random() * 350
                        }px
                    )
                    rotate(
                        ${
                            (Math.random() - 0.5) *
                            120
                        }deg
                    )
                    `;


                heart.style.opacity =
                    "0";

            }
        );


        setTimeout(
            () => heart.remove(),
            1800
        );

    }

}


/* =========================================================
   GLADIOLUS FLOWERS
   ========================================================= */

const garden =
    $("#garden");


const flowerStyles = [

    {
        name: "blush",

        colors: [
            "#ffd8e5",
            "#f5a0bd",
            "#d96d97"
        ],

        center:
            "#ffe8ef"
    },


    {
        name: "snow",

        colors: [
            "#fffafc",
            "#f4dce7",
            "#d6a7ba"
        ],

        center:
            "#fff4b8"
    },


    {
        name: "ruby",

        colors: [
            "#ffb0c5",
            "#e75d7f",
            "#a62f52"
        ],

        center:
            "#ffd1dc"
    },


    {
        name: "lavender",

        colors: [
            "#ead9ff",
            "#c08de2",
            "#8954a8"
        ],

        center:
            "#f7eaff"
    },


    {
        name: "coral",

        colors: [
            "#ffd2c4",
            "#f58f78",
            "#cf5d55"
        ],

        center:
            "#ffe8c7"
    },


    {
        name: "gold",

        colors: [
            "#fff4b0",
            "#f6cf61",
            "#d99c2b"
        ],

        center:
            "#fff9d8"
    },


    {
        name: "magenta",

        colors: [
            "#f9c4e2",
            "#dc72b4",
            "#9b3f83"
        ],

        center:
            "#ffe0f0"
    },


    {
        name: "peach",

        colors: [
            "#ffe1c8",
            "#f4ad87",
            "#cf745e"
        ],

        center:
            "#fff0d7"
    }

];


function makeFlower(
    index,
    side,
    top,
    scale
) {

    if (!garden) return;


    const palette =
        flowerStyles[
            (index - 1) %
            flowerStyles.length
        ];


    const flower =
        document.createElement(
            "div"
        );


    flower.className =
        `flower ${side} flower-${index} ${palette.name}`;


    flower.style.top =
        top;


    flower.style.setProperty(
        "--scale",
        scale
    );


    flower.style.setProperty(
        "--c1",
        palette.colors[0]
    );


    flower.style.setProperty(
        "--c2",
        palette.colors[1]
    );


    flower.style.setProperty(
        "--c3",
        palette.colors[2]
    );


    flower.style.setProperty(
        "--center",
        palette.center
    );


    /*
        Six gladiolus florets
        arranged along the flower spike.
    */

    const florets =
        Array.from(
            {
                length: 6
            },
            (_, number) => `

                <span
                    class="floret floret-${number + 1}"
                >

                    <i class="petal p1"></i>
                    <i class="petal p2"></i>
                    <i class="petal p3"></i>
                    <i class="petal p4"></i>
                    <i class="petal p5"></i>
                    <i class="petal p6"></i>

                    <i class="throat"></i>

                    <i class="stamen"></i>

                </span>

            `
        )
        .join("");


    flower.innerHTML = `

        <button
            type="button"
            aria-label="
                ${palette.name}
                gladiolus flower
                ${index}
            "
        >

            <span class="stem"></span>

            <span class="leaf l"></span>

            <span class="leaf r"></span>

            <span class="spike">
                ${florets}
            </span>

        </button>

    `;


    const button =
        flower.querySelector(
            "button"
        );


    if (button) {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const quote =
                    SITE.flowerQuotes[
                        (index - 1) %
                        SITE.flowerQuotes.length
                    ];


                const quoteBox =
                    $("#flowerQuote");


                if (quoteBox) {

                    quoteBox.innerHTML = `

                        <small>

                            ${
                                palette.name
                                    .toUpperCase()
                            }

                            GLADIOLUS · BLOOM

                            ${
                                String(index)
                                    .padStart(2, "0")
                            }

                        </small>

                        <p>
                            ${esc(quote)}
                        </p>

                    `;

                }


                flower.classList.remove(
                    "blooming"
                );


                void flower.offsetWidth;


                flower.classList.add(
                    "blooming"
                );


                chime();

            }
        );

    }


    garden.appendChild(
        flower
    );

}


/* =========================================================
   CREATE GLADIOLUS FLOWERS
   ========================================================= */

[
    [1, "left", "8%", 1.02],
    [2, "right", "19%", 0.86],
    [3, "left", "34%", 0.72],
    [4, "right", "43%", 1.00],
    [5, "left", "57%", 0.88],
    [6, "right", "64%", 0.70],
    [7, "left", "74%", 0.76],
    [8, "right", "79%", 0.92]
].forEach(
    flower =>
        makeFlower(
            ...flower
        )
);


/* =========================================================
   SOUND
   ========================================================= */

let audioContext =
    null;


function chime() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) return;


        if (!audioContext) {

            audioContext =
                new AudioContext();

        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        const start =
            audioContext.currentTime;


        [
            523.25,
            659.25,
            783.99
        ].forEach(
            (frequency, index) => {

                const oscillator =
                    audioContext
                        .createOscillator();


                const gain =
                    audioContext
                        .createGain();


                const time =
                    start +
                    index * 0.1;


                oscillator.type =
                    "sine";


                oscillator.frequency.value =
                    frequency;


                gain.gain.setValueAtTime(
                    0,
                    time
                );


                gain.gain.linearRampToValueAtTime(
                    0.04,
                    time + 0.03
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    time + 0.65
                );


                oscillator.connect(
                    gain
                );


                gain.connect(
                    audioContext.destination
                );


                oscillator.start(
                    time
                );


                oscillator.stop(
                    time + 0.7
                );

            }
        );

    } catch (error) {

        console.log(
            "Audio unavailable:",
            error
        );

    }

}


const soundButton =
    $("#soundBtn");


if (soundButton) {

    soundButton.addEventListener(
        "click",
        chime
    );

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

$$("[data-scroll]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        $(button.dataset.scroll);

                    if (!target) return;


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth"
                        }
                    );

                }
            );

        }
    );


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        if (modal) {

            modal.classList.remove(
                "open"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        closeVideo();

        closeProposal();

    }
);


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

if (
    "IntersectionObserver"
    in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.12
            }
        );


    $$(".reveal")
        .forEach(
            element =>
                observer.observe(
                    element
                )
        );

} else {

    /*
        Fallback for very old browsers.
    */

    $$(".reveal")
        .forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );

}


/* =========================================================
   BIRTHDAY COUNTDOWN
   ========================================================= */

let birthdayTarget =
    (() => {

        const now =
            new Date();


        const year =
            now.getFullYear();


        let date =
            new Date(
                year,
                SITE.birthdayMonth,
                SITE.birthdayDay
            );


        if (
            date <= now
        ) {

            date =
                new Date(
                    year + 1,
                    SITE.birthdayMonth,
                    SITE.birthdayDay
                );

        }


        return date;

    })();


const yearElement =
    $("#year");


if (yearElement) {

    yearElement.textContent =
        birthdayTarget.getFullYear();

}


function countdown() {

    const remaining =
        Math.max(
            0,
            birthdayTarget -
            Date.now()
        );


    const days =
        Math.floor(
            remaining /
            86400000
        );


    const hours =
        Math.floor(
            (remaining %
                86400000) /
            3600000
        );


    const minutes =
        Math.floor(
            (remaining %
                3600000) /
            60000
        );


    const seconds =
        Math.floor(
            (remaining %
                60000) /
            1000
        );


    const d =
        $("#d");

    const h =
        $("#h");

    const m =
        $("#m");

    const s =
        $("#s");


    if (d) {

        d.textContent =
            String(days)
                .padStart(2, "0");

    }


    if (h) {

        h.textContent =
            String(hours)
                .padStart(2, "0");

    }


    if (m) {

        m.textContent =
            String(minutes)
                .padStart(2, "0");

    }


    if (s) {

        s.textContent =
            String(seconds)
                .padStart(2, "0");

    }

}


countdown();


setInterval(
    countdown,
    1000
);


/* =========================================================
   PAGE LOADING
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                const boot =
                    $("#boot");


                if (boot) {

                    boot.classList.add(
                        "hide"
                    );

                }

            },
            450
        );

    }
);


/* =========================================================
   FINAL DEBUG MESSAGE
   ========================================================= */

console.log(
    "Ella birthday website loaded successfully ❤️"
);

console.log(
    `Memories loaded: ${SITE.memories.length}`
);

console.log(
    `Videos loaded: ${SITE.videos.length}`
);