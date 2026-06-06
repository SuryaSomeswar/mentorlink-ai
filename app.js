// ======================================
// FIREBASE IMPORTS
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    collection,
    query,
    where,
    onSnapshot,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ======================================
// FIREBASE CONFIG
// ======================================

const firebaseConfig = {
  apiKey: "AIzaSyBhsy0W5NRK1ataTNMyk4c_PbQZHIQctpY",
  authDomain: "mentorlink-ai-95522.firebaseapp.com",
  projectId: "mentorlink-ai-95522",
  storageBucket: "mentorlink-ai-95522.firebasestorage.app",
  messagingSenderId: "406797652563",
  appId: "1:406797652563:web:7cb1f652a72ad947b7eca6",
  measurementId: "G-0Y0YE4TK1E"
};

// ======================================
// FIREBASE INIT
// ======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ======================================
// GLOBAL STATE
// ======================================

const state = {
    currentUser: null,
    currentUserData: null,
    authMode: "login",

    alumni: [],
    filteredAlumni: [],
    bookings: [],

    selectedAlumni: null,
    selectedSlot: null,

    unsubscribeAlumni: null
};

// ======================================
// DOM REFERENCES
// ======================================

const body = document.getElementById("body");

const navbar = document.getElementById("navbar");

const authView = document.getElementById("authView");

const dashboardView =
    document.getElementById("dashboardView");

const profileView =
    document.getElementById("profileView");

const sessionsView =
    document.getElementById("sessionsView");

const toastContainer =
    document.getElementById("toastContainer");

const themeToggle =
    document.getElementById("themeToggle");

const logoutBtn =
    document.getElementById("logoutBtn");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const profileBtn =
    document.getElementById("profileBtn");

const sessionsBtn =
    document.getElementById("sessionsBtn");

const userEmail =
    document.getElementById("userEmail");

const userRole =
    document.getElementById("userRole");

const userInfo =
    document.getElementById("userInfo");


// ======================================
// AUTH DOM
// ======================================

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const toggleAuth =
    document.getElementById("toggleAuth");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const signupName =
    document.getElementById("signupName");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const signupConfirmPassword =
    document.getElementById("signupConfirmPassword");

const signupRole =
    document.getElementById("signupRole");


// ======================================
// UTILITIES
// ======================================

function showView(view) {

    authView.classList.add("hidden");
    dashboardView.classList.add("hidden");
    profileView.classList.add("hidden");
    sessionsView.classList.add("hidden");

    view.classList.remove("hidden");
}

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function generateAvatar(name) {

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;

}


// ======================================
// THEME SYSTEM
// ======================================

function applyTheme(theme) {

    if (theme === "dark") {

        document.documentElement.classList.add("dark");

        body.classList.remove("light-bg");

        body.classList.add("gradient-bg");

        themeToggle.textContent = "☀️";

    } else {

        document.documentElement.classList.remove("dark");

        body.classList.remove("gradient-bg");

        body.classList.add("light-bg");

        themeToggle.textContent = "🌙";
    }

    localStorage.setItem(
        "mentorlink-theme",
        theme
    );
}

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "mentorlink-theme"
        ) || "light";

    applyTheme(savedTheme);
}

themeToggle.addEventListener(
    "click",
    () => {

        const darkMode =
            document.documentElement.classList.contains("dark");

        applyTheme(
            darkMode
                ? "light"
                : "dark"
        );
    }
);


// ======================================
// TOAST SYSTEM
// ======================================

function showToast(
    message,
    type = "info"
) {

    const colors = {

        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };

    const toast =
        document.createElement("div");

    toast.className = `
        ${colors[type]}
        text-white
        px-5
        py-4
        rounded-2xl
        shadow-xl
        min-w-[260px]
        animate-bounce
    `;

    toast.textContent =
        message;

    toastContainer.appendChild(
        toast
    );

    setTimeout(
        () => {

            toast.remove();

        },
        3500
    );
}


// ======================================
// AUTH MODE SWITCH
// ======================================

function switchToSignup() {

    state.authMode = "signup";

    loginForm.classList.add("hidden");

    signupForm.classList.remove("hidden");

    authTitle.textContent =
        "Create Account";

    authSubtitle.textContent =
        "Join MentorLink AI";

    toggleAuth.textContent =
        "Already have an account?";
}

function switchToLogin() {

    state.authMode = "login";

    signupForm.classList.add("hidden");

    loginForm.classList.remove("hidden");

    authTitle.textContent =
        "Welcome Back";

    authSubtitle.textContent =
        "Login to continue";

    toggleAuth.textContent =
        "Create an account";
}

toggleAuth.addEventListener(
    "click",
    () => {

        if (
            state.authMode === "login"
        ) {

            switchToSignup();

        } else {

            switchToLogin();
        }
    }
);


// ======================================
// CREATE USER PROFILE
// ======================================

async function createUserDocument(
    user,
    fullName,
    role
) {

    await setDoc(
        doc(
            db,
            "users",
            user.uid
        ),
        {
            uid: user.uid,
            fullName,
            email: user.email,
            role,
            profilePhoto:
                generateAvatar(fullName),
            bio: "",
            createdAt:
                serverTimestamp()
        }
    );
}


// ======================================
// SIGNUP
// ======================================

signupForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const name =
            signupName.value.trim();

        const email =
            signupEmail.value.trim();

        const password =
            signupPassword.value;

        const confirm =
            signupConfirmPassword.value;

        const role =
            signupRole.value;

        if (!name) {

            return showToast(
                "Full name required",
                "error"
            );
        }

        if (
            !validEmail(email)
        ) {

            return showToast(
                "Invalid email",
                "error"
            );
        }

        if (
            password.length < 6
        ) {

            return showToast(
                "Password must be at least 6 characters",
                "error"
            );
        }

        if (
            password !== confirm
        ) {

            return showToast(
                "Passwords do not match",
                "error"
            );
        }

        try {

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            await createUserDocument(
                credential.user,
                name,
                role
            );

            showToast(
                "Account created successfully",
                "success"
            );

        } catch (error) {

            showToast(
                error.message,
                "error"
            );
        }
    }
);


// ======================================
// LOGIN
// ======================================

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;

        if (
            !validEmail(email)
        ) {

            return showToast(
                "Invalid email",
                "error"
            );
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            showToast(
                "Login successful",
                "success"
            );

        } catch (error) {

            showToast(
                "Login failed",
                "error"
            );
        }
    }
);


// ======================================
// LOGOUT
// ======================================

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            showToast(
                "Logged out",
                "info"
            );

        } catch {

            showToast(
                "Logout failed",
                "error"
            );
        }
    }
);


// ======================================
// AUTH STATE
// ======================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            state.currentUser = null;

            navbar.classList.add("hidden");

            showView(authView);

            return;
        }

        state.currentUser = user;

        const snap =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid
                )
            );

        if (!snap.exists()) {

            return;
        }

        state.currentUserData =
            snap.data();

        navbar.classList.remove("hidden");

        dashboardBtn.classList.remove("hidden");

        profileBtn.classList.remove("hidden");

        sessionsBtn.classList.remove("hidden");

        logoutBtn.classList.remove("hidden");

        userInfo.classList.remove("hidden");

        userEmail.textContent =
            state.currentUserData.email;

        userRole.textContent =
            state.currentUserData.role;

       showView(
    dashboardView
);

initializeDashboard();
    }
);


// ======================================
// NAVIGATION
// ======================================

dashboardBtn.addEventListener(
    "click",
    () => {

       showView(
    dashboardView
);

    }
);

profileBtn.addEventListener(
    "click",
    () => {

        showView(
            profileView
        );
    }
);

sessionsBtn.addEventListener(
    "click",
    () => {

        showView(
            sessionsView
        );
    }
);


// ======================================
// INIT
// ======================================

initializeTheme();

console.log(
    "MentorLink MVP Loaded"
);
// ======================================
// ALUMNI DISCOVERY
// DASHBOARD ANALYTICS
// SEARCH
// REALTIME FIRESTORE
// ======================================


// ======================================
// DOM REFERENCES
// ======================================

const alumniGrid =
    document.getElementById("alumniGrid");

const searchInput =
    document.getElementById("searchInput");

const emptyState =
    document.getElementById("emptyState");

const totalAlumni =
    document.getElementById("totalAlumni");

const totalBookings =
    document.getElementById("totalBookings");

const upcomingSessions =
    document.getElementById("upcomingSessions");




// ======================================
// ALUMNI CARD
// ======================================

function createAlumniCard(
    alumni
) {

    return `
        <div
        class="
        glass
        rounded-3xl
        p-6
        hover-lift
        "
        >

            <div
            class="
            flex
            items-center
            gap-4
            "
            >

                <img
                src="${
                    alumni.profilePhoto ||
                    generateAvatar(
                        alumni.fullName
                    )
                }"
                class="
                w-16
                h-16
                rounded-full
                object-cover
                "
                >

                <div>

                    <h3
                    class="
                    text-xl
                    font-bold
                    "
                    >
                        ${alumni.fullName}
                    </h3>

                    <p
                    class="
                    text-sm
                    opacity-70
                    "
                    >
                        ${alumni.email}
                    </p>

                </div>

            </div>

            <p
            class="
            mt-4
            text-sm
            opacity-80
            "
            >
                ${
                    alumni.bio ||
                    "Experienced alumni mentor."
                }
            </p>

            <div
            class="
            mt-5
            "
            >

                ${
    state.currentUserData?.role === "student"
    ? `
        <button
        class="
        book-session-btn
        w-full
        py-3
        rounded-xl
        bg-indigo-600
        text-white
        "
        data-id="${alumni.uid}"
        >
            Book Session
        </button>
      `
    : ""
}
            </div>

        </div>
    `;
}


// ======================================
// RENDER ALUMNI
// ======================================

function renderAlumni() {

    if (
        !state.filteredAlumni.length
    ) {

        alumniGrid.innerHTML = "";

        emptyState.classList.remove(
            "hidden"
        );

        return;
    }

    emptyState.classList.add(
        "hidden"
    );

    alumniGrid.innerHTML =
        state.filteredAlumni
            .map(
                alumni =>
                    createAlumniCard(
                        alumni
                    )
            )
            .join("");
}


// ======================================
// SEARCH
// ======================================

function filterAlumni(
    keyword
) {

    if (!keyword) {

        state.filteredAlumni =
            [...state.alumni];

        renderAlumni();

        return;
    }

    const search =
        keyword.toLowerCase();

    state.filteredAlumni =
        state.alumni.filter(
            alumni =>
                alumni.fullName
                    ?.toLowerCase()
                    .includes(search)
                ||
                alumni.email
                    ?.toLowerCase()
                    .includes(search)
        );

    renderAlumni();
}

searchInput?.addEventListener(
    "input",
    event => {

        filterAlumni(
            event.target.value
        );
    }
);


// ======================================
// ANALYTICS
// ======================================

function updateAnalytics() {

    totalAlumni.textContent =
        state.alumni.length;

    if (
        !state.currentUser
    ) return;

    const myBookings =
        state.bookings.filter(
            booking => {

                return (
                    booking.studentId ===
                    state.currentUser.uid
                );
            }
        );

    totalBookings.textContent =
        myBookings.length;

    upcomingSessions.textContent =
        myBookings.length;
}


// ======================================
// LOAD BOOKINGS COUNT
// ======================================

async function loadBookingAnalytics() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "bookings"
                )
            );

        state.bookings = [];

        snapshot.forEach(
            document => {

                state.bookings.push({
                    id:
                        document.id,
                    ...document.data()
                });
            }
        );

        updateAnalytics();

    } catch (error) {

        console.error(
            error
        );
    }
}


// ======================================
// REALTIME ALUMNI
// ======================================

function subscribeToAlumni() {

    if (
        state.unsubscribeAlumni
    ) {

        state.unsubscribeAlumni();
    }

    const alumniQuery =
        query(
            collection(
                db,
                "users"
            ),
            where(
                "role",
                "==",
                "alumni"
            )
        );

    state.unsubscribeAlumni =
        onSnapshot(
            alumniQuery,
            snapshot => {

                state.alumni = [];

                snapshot.forEach(
                    document => {

                        state.alumni.push({
                            id:
                                document.id,
                            ...document.data()
                        });
                    }
                );

                state.filteredAlumni =
                    [...state.alumni];

                renderAlumni();

                updateAnalytics();

            },
            error => {

                console.error(
                    error
                );

                showToast(
                    "Failed to load alumni",
                    "error"
                );
            }
        );
}


// ======================================
// REALTIME BOOKING COUNTS
// ======================================

function subscribeToBookings() {

    const bookingQuery =
        collection(
            db,
            "bookings"
        );

    onSnapshot(
        bookingQuery,
        snapshot => {

            state.bookings = [];

            snapshot.forEach(
                document => {

                    state.bookings.push({
                        id:
                            document.id,
                        ...document.data()
                    });
                }
            );

            updateAnalytics();

        }
    );
}


// ======================================
// START DASHBOARD
// ======================================

function initializeDashboard() {

    subscribeToAlumni();

    subscribeToBookings();

    loadBookingAnalytics();
}
// ======================================
// BOOKING MODULE
// ======================================

const bookingModal =
    document.getElementById("bookingModal");

const closeBookingModal =
    document.getElementById("closeBookingModal");

const cancelBookingBtn =
    document.getElementById("cancelBookingBtn");

const confirmBookingBtn =
    document.getElementById("confirmBookingBtn");

const bookingDate =
    document.getElementById("bookingDate");

const selectedAlumniName =
    document.getElementById("selectedAlumniName");

const slotButtons =
    document.querySelectorAll(".slot-btn");


// ======================================
// OPEN BOOKING MODAL
// ======================================

function openBookingModal(alumniId) {

    const alumni =
        state.alumni.find(
            item => item.uid === alumniId
        );

    if (!alumni) return;

    state.selectedAlumni = alumni;
    state.selectedSlot = null;

    selectedAlumniName.textContent =
        alumni.fullName;

    bookingDate.value = "";

    slotButtons.forEach(btn => {

        btn.classList.remove(
            "bg-indigo-600",
            "text-white"
        );

        btn.disabled = false;
    });

    bookingModal.classList.remove(
        "hidden"
    );
}


// ======================================
// CLOSE BOOKING MODAL
// ======================================

function closeModal() {

    bookingModal.classList.add(
        "hidden"
    );

    state.selectedAlumni = null;
    state.selectedSlot = null;
}

closeBookingModal?.addEventListener(
    "click",
    closeModal
);

cancelBookingBtn?.addEventListener(
    "click",
    closeModal
);


// ======================================
// SLOT SELECTION
// ======================================

slotButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            slotButtons.forEach(btn => {

                btn.classList.remove(
                    "bg-indigo-600",
                    "text-white"
                );
            });

            button.classList.add(
                "bg-indigo-600",
                "text-white"
            );

            state.selectedSlot =
                button.dataset.time;
        }
    );
});


// ======================================
// BOOK SESSION BUTTON
// ======================================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".book-session-btn"
            );

        if (!button) return;

        openBookingModal(
            button.dataset.id
        );
    }
);


// ======================================
// CHECK SLOT AVAILABILITY
// ======================================

async function slotAlreadyBooked(
    alumniId,
    date,
    time
) {

    const bookingQuery =
        query(
            collection(
                db,
                "bookings"
            ),
            where(
                "alumniId",
                "==",
                alumniId
            ),
            where(
                "date",
                "==",
                date
            ),
            where(
                "time",
                "==",
                time
            )
        );

    const snapshot =
        await getDocs(
            bookingQuery
        );

    return !snapshot.empty;
}


// ======================================
// BOOKING VALIDATION
// ======================================

function isPastDate(date) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const selected =
        new Date(date);

    selected.setHours(
        0,
        0,
        0,
        0
    );

    return selected < today;
}


// ======================================
// CREATE BOOKING
// ======================================

confirmBookingBtn?.addEventListener(
    "click",
    async () => {

        if (
            !state.selectedAlumni
        ) {

            return showToast(
                "Select alumni",
                "error"
            );
        }

        if (
            !bookingDate.value
        ) {

            return showToast(
                "Select date",
                "error"
            );
        }

        if (
            !state.selectedSlot
        ) {

            return showToast(
                "Select time slot",
                "error"
            );
        }

        if (
            isPastDate(
                bookingDate.value
            )
        ) {

            return showToast(
                "Past dates not allowed",
                "error"
            );
        }

        try {

            confirmBookingBtn.disabled =
                true;

            const alreadyBooked =
                await slotAlreadyBooked(
                    state.selectedAlumni.uid,
                    bookingDate.value,
                    state.selectedSlot
                );

            if (
                alreadyBooked
            ) {

                showToast(
                    "Slot already booked",
                    "error"
                );

                confirmBookingBtn.disabled =
                    false;

                return;
            }

            await addDoc(
                collection(
                    db,
                    "bookings"
                ),
                {
                    bookingId:
                        crypto.randomUUID(),

                    studentId:
                        state.currentUser.uid,

                    studentName:
                        state.currentUserData.fullName,

                    alumniId:
                        state.selectedAlumni.uid,

                    alumniName:
                        state.selectedAlumni.fullName,

                    date:
                        bookingDate.value,

                    time:
                        state.selectedSlot,

                    status:
                        "Confirmed",

                    createdAt:
                        serverTimestamp()
                }
            );

            showToast(
                "Session booked successfully",
                "success"
            );

            closeModal();

        } catch (error) {

            console.error(
                error
            );

            showToast(
                "Booking failed",
                "error"
            );

        } finally {

            confirmBookingBtn.disabled =
                false;
        }
    }
);


// ======================================
// REALTIME BOOKINGS
// ======================================

function subscribeToBookingsRealtime() {

    onSnapshot(
        collection(
            db,
            "bookings"
        ),
        snapshot => {

            state.bookings = [];

            snapshot.forEach(
                document => {

                    state.bookings.push({
                        id:
                            document.id,
                        ...document.data()
                    });
                }
            );

            updateAnalytics();
        }
    );
}

subscribeToBookingsRealtime();

console.log(
    "Booking Module Loaded"
);
