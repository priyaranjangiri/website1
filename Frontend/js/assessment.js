const questions = [

{
    id: "familiarity",
    question: "How familiar are you with this subject?",
    options: [
        "Beginner",
        "Intermediate",
        "Advanced"
    ]
},

{
    id: "previousStudy",
    question: "Have you studied this topic before?",
    options: [
        "Never",
        "Basic understanding",
        "Completed a course",
        "Practical experience"
    ]
},

{
    id: "variableQuestion",
    question: "What does a variable do in programming?",
    options: [
        "Store data",
        "Delete data",
        "Connect to internet",
        "I don't know"
    ],
    correct: "Store data"
},

{
    id: "datatypeQuestion",
    question: "Which data type stores text?",
    options: [
        "Integer",
        "String",
        "Boolean",
        "Float"
    ],
    correct: "String"
},

{
    id: "hoursPerWeek",
    question: "How many hours per week can you dedicate to learning?",
    options: [
        "<2",
        "2-5",
        "5-10",
        "10+"
    ]
},

{
    id: "learningStyle",
    question: "How do you learn best?",
    options: [
        "Videos",
        "Reading material",
        "Interactive exercises",
        "Projects"
    ]
},

{
    id: "activities",
    question: "Which activities do you enjoy most?",
    options: [
        "Watching tutorials",
        "Solving quizzes",
        "Building projects",
        "Group discussions"
    ]
},

{
    id: "challenge",
    question: "How much challenge do you prefer?",
    options: [
        "Easy",
        "Moderate",
        "Difficult",
        "Expert"
    ]
},

{
    id: "goal",
    question: "What is your primary goal?",
    options: [
        "Understand basics",
        "Gain practical skills",
        "Pass exams",
        "Become job-ready"
    ]
},

{
    id: "targetLevel",
    question: "What level would you like to reach?",
    options: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert"
    ]
}

];

let currentQuestion = 0;
let score = 0;
let startTime = Date.now();

const answers = {};

const thread =
    document.getElementById(
        "thread"
    );

function addBotMessage(text){

    const msg =
        document.createElement("div");

    msg.className =
        "msg bot";

    msg.innerHTML = `
        <div class="avatar">
            <img
                src="assets/logo.jpeg"
                alt="LearnHub"
            >
        </div>

        <div class="bubble">
            ${text}
        </div>
    `;


    thread.appendChild(msg);

    scrollToBottom();
}

function addUserMessage(text){

    const msg =
        document.createElement("div");

    msg.className =
        "msg user";

    msg.innerHTML = `
        <div class="avatar">You</div>
        <div class="bubble">${text}</div>
    `;

    thread.appendChild(msg);

    scrollToBottom();
}

function scrollToBottom(){

    thread.scrollTop =
        thread.scrollHeight;
}

function showQuestion(){

    const q =
        questions[currentQuestion];

    addBotMessage(
        q.question
    );

    const replies =
        document.createElement(
            "div"
        );

    replies.className =
        "quick-replies";

    q.options.forEach(option => {

        const btn =
            document.createElement(
                "button"
            );

        btn.className =
            "qr-btn";

        btn.textContent =
            option;

        btn.onclick =
            () => handleAnswer(option);

        replies.appendChild(btn);

    });

    thread.appendChild(replies);

    scrollToBottom();
}

function handleAnswer(answer){

    const q =
        questions[currentQuestion];

    answers[q.id] =
        answer;

    if(
        q.correct &&
        answer === q.correct
    ){
        score++;
    }

    addUserMessage(answer);

    currentQuestion++;

    if(
        currentQuestion <
        questions.length
    ){

        setTimeout(
            showQuestion,
            500
        );

    }
    else{

        finishAssessment();
    }
}

async function finishAssessment() {

    console.log("finishAssessment started");

    const totalTime =
        Math.floor(
            (Date.now() - startTime) / 1000
        );

    const learnerProfile = {

        user_id:
            localStorage.getItem(
                "user_id"
            ),

        username:
            localStorage.getItem(
                "learnhub_user"
            ),

        score,

        completionTime:
            totalTime,

        ...answers
    };

    localStorage.setItem(
        "learnerProfile",
        JSON.stringify(
            learnerProfile
        )
    );

    const assessmentData = {

        user_id:
            localStorage.getItem(
                "user_id"
            ),

        username:
            localStorage.getItem(
                "learnhub_user"
            ),

        familiarity:
            answers.familiarity,

        previous_study:
            answers.previousStudy,

        knowledge_score:
            score,

        learning_style:
            answers.learningStyle,

        learning_pace:
            answers.hoursPerWeek,

        goal:
            answers.goal,

        target_level:
            answers.targetLevel,

        activities:
            answers.activities,

        challenge:
            answers.challenge,

        completion_time:
            totalTime
    };

    console.log(
        "Data prepared:",
        assessmentData
    );

    const { error } =
        await window.supabaseClient
        .from("assessments")
        .insert([
            assessmentData
        ]);

    if(error){

        console.error(
            "Supabase error:",
            error
        );

        alert(
            error.message
        );

        return;
    }

    console.log(
        "Redirecting..."
    );

    window.location.href =
        "dashboard.html";
}


const existingAssessment =
    localStorage.getItem(
        "learnerProfile"
    );

if(existingAssessment){

    document
        .getElementById(
            "backButton"
        )
        .style.display =
            "block";
}


showQuestion();