const profile =
    JSON.parse(
        localStorage.getItem(
            "learnerProfile"
        )
    );

if(!profile){

    window.location.href =
        "index.html";

    throw new Error(
        "No learner profile found"
    );
}

/* =========================
   USER INFO
========================= */

document
.getElementById(
    "welcome-message"
)
.textContent =
`Welcome, ${
    profile.username
    .split("@")[0]
}`;

document
.getElementById(
    "score-card"
)
.textContent =
profile.score;

document
.getElementById(
    "time-card"
)
.textContent =
profile.completionTime +
" sec";

document
.getElementById(
    "style-card"
)
.textContent =
profile.learningStyle ??
"N/A";

document
.getElementById(
    "target-card"
)
.textContent =
profile.targetLevel ??
"N/A";

/* =========================
   FETCH RECOMMENDATIONS
========================= */

fetch(
    "http://127.0.0.1:8000/recommend",
    {

        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:
            JSON.stringify({

                goal:
                    profile.goal,

                learning_style:
                    profile.learningStyle,

                target_level:
                    profile.targetLevel,

                activities:
                    profile.activities
            })
    }
)
.then(response => {

    if(!response.ok){

        throw new Error(
            "Failed to fetch recommendations"
        );
    }

    return response.json();
})
.then(data => {

    console.log(
        "Recommendations:",
        data
    );

    displayCourses(data);
})
.catch(error => {

    console.error(
        "Backend Error:",
        error
    );

    const courseGrid =
        document.getElementById(
            "course-grid"
        );

    if(courseGrid){

        courseGrid.innerHTML =
        `
        <div class="course-card">
            <h3>
                Unable to load recommendations
            </h3>

            <p>
                Make sure the backend
                server is running.
            </p>
        </div>
        `;
    }
});

/* =========================
   DISPLAY COURSES
========================= */

function displayCourses(
    courses
){

    const courseGrid =
        document.getElementById(
            "course-grid"
        );

    if(!courseGrid){
        return;
    }

    courseGrid.innerHTML = "";

    courses.forEach(course => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "course-card";

        card.innerHTML =
        `
        <h3>
            ${course.course_title}
        </h3>

        <p>
            <strong>
                Difficulty:
            </strong>
            ${
                course.course_difficulty ||
                "Unknown"
            }
        </p>

        <p>
            <strong>
                Match Score:
            </strong>
            ${
                course.match_score
            }%
        </p>

        <p>
            ${
                course.course_skills ||
                ""
            }
        </p>
        `;

        if(
            course.course_url
        ){

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                course.course_url;

            link.target =
                "_blank";

            link.textContent =
                "View Course";
            link.className =
                "course-btn";

            link.style.display =
                "inline-block";

            link.style.marginTop =
                "10px";

            card.appendChild(
                link
            );
        }

        courseGrid.appendChild(
            card
        );
    });
}

/* =========================
   LOGOUT
========================= */

function logout(){

    localStorage.clear();

    window.location.href =
        "index.html";
}