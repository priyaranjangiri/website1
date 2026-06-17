console.log("LOGIN.JS LOADED");

const loginTab =
document.getElementById("login-tab");

const registerTab =
document.getElementById("register-tab");

const loginForm =
document.getElementById("login-form");

const registerForm =
document.getElementById("register-form");

const messageBox =
document.getElementById("message-box");

/* =========================
TAB SWITCHING
========================= */

loginTab.addEventListener("click", () => {


loginTab.classList.add("active");
registerTab.classList.remove("active");

loginForm.style.display = "block";
registerForm.style.display = "none";

messageBox.textContent = "";


});

registerTab.addEventListener("click", () => {


registerTab.classList.add("active");
loginTab.classList.remove("active");

registerForm.style.display = "block";
loginForm.style.display = "none";

messageBox.textContent = "";


});

/* =========================
LOGIN
========================= */

loginForm.addEventListener(
"submit",
async (e) => {


    e.preventDefault();

    const email =
        document.getElementById(
            "login-username"
        ).value.trim();

    const password =
        document.getElementById(
            "login-password"
        ).value;

    const { data, error } =
        await window.supabaseClient.auth
        .signInWithPassword({

            email,
            password
        });

    if(error){

        messageBox.textContent =
            error.message;

        return;
    }

    localStorage.setItem(
        "learnhub_user",
        data.user.email
    );

    localStorage.setItem(
        "user_id",
        data.user.id
    );

    const {
        data: assessmentRows,
        error: assessmentError
    } =
        await window.supabaseClient
        .from("assessments")
        .select("*")
        .eq(
            "user_id",
            data.user.id
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if(assessmentError){

        console.error(
            assessmentError
        );

        messageBox.textContent =
            "Failed to check assessment.";

        return;
    }

    if(
        assessmentRows &&
        assessmentRows.length > 0
    ){

        const latestAssessment =
            assessmentRows[0];

        const learnerProfile = {

            user_id:
                latestAssessment.user_id,

            username:
                latestAssessment.username,

            score:
                latestAssessment.knowledge_score,

            completionTime:
                latestAssessment.completion_time,

            familiarity:
                latestAssessment.familiarity,

            previousStudy:
                latestAssessment.previous_study,

            learningStyle:
                latestAssessment.learning_style,

            hoursPerWeek:
                latestAssessment.learning_pace,

            goal:
                latestAssessment.goal,

            targetLevel:
                latestAssessment.target_level,

            activities:
                latestAssessment.activities,

            challenge:
                latestAssessment.challenge
        };

        localStorage.setItem(
            "learnerProfile",
            JSON.stringify(
                learnerProfile
            )
        );

        window.location.href =
            "dashboard.html";
    }
    else{

        window.location.href =
            "assessment.html";
    }
}


);

/* =========================
REGISTER
========================= */

registerForm.addEventListener(
"submit",
async (e) => {


    e.preventDefault();

    const email =
        document.getElementById(
            "register-email"
        ).value.trim();

    const password =
        document.getElementById(
            "register-password"
        ).value;

    const { error } =
        await window.supabaseClient.auth
        .signUp({

            email,
            password
        });

    if(error){

        messageBox.textContent =
            error.message;

        return;
    }

    messageBox.textContent =
        "Registration successful. Please login.";

    loginTab.click();
}


);
