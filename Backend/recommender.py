import os
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ----------------------------
# Load Dataset
# ----------------------------

BASE_DIR = os.path.dirname(__file__)

csv_path = os.path.join(
    BASE_DIR,
    "coursera_courses.csv"
)

df = pd.read_csv(csv_path)

# Fill missing values

text_columns = [
    "course_title",
    "course_skills",
    "course_summary",
    "course_description"
]

for column in text_columns:
    df[column] = df[column].fillna("")

# Create combined text

df["combined_features"] = (
    df["course_title"] + " " +
    df["course_skills"] + " " +
    df["course_summary"] + " " +
    df["course_description"]
)

# ----------------------------
# Build TF-IDF Model
# ----------------------------

tfidf = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)

tfidf_matrix = tfidf.fit_transform(
    df["combined_features"]
)

cosine_sim = cosine_similarity(
    tfidf_matrix,
    tfidf_matrix
)

indices = pd.Series(
    df.index,
    index=df["course_title"]
).drop_duplicates()

# ----------------------------
# Recommendation Function
# ----------------------------

def get_recommendations(
    course_title,
    top_n=10
):

    if course_title not in indices:
        return []

    idx = indices[course_title]

    sim_scores = list(
        enumerate(
            cosine_sim[idx]
        )
    )

    sim_scores = sorted(
        sim_scores,
        key=lambda x: x[1],
        reverse=True
    )

    sim_scores = sim_scores[1:top_n + 1]

    course_indices = [
        i[0]
        for i in sim_scores
    ]

    return (
    df["course_title"]
    .iloc[course_indices]
    .tolist()
)

def recommend_for_user(profile, top_n=10):

    query = ""

    query += profile.get("goal", "") + " "
    query += profile.get("learning_style", "") + " "
    query += profile.get("target_level", "") + " "
    query += profile.get("activities", "") + " "

    user_vector = tfidf.transform([query])

    similarity_scores = cosine_similarity(
        user_vector,
        tfidf_matrix
    )

    scores = list(
        enumerate(
            similarity_scores[0]
        )
    )

    scores = sorted(
        scores,
        key=lambda x: x[1],
        reverse=True
    )

    top_courses = scores[:top_n]

    results = []

    for index, score in top_courses:

        course = df.iloc[index]

    results.append({

        "course_title":
            course["course_title"],

        "course_difficulty":
            course.get(
                "course_difficulty",
                "Unknown"
            ),

        "course_skills":
            course.get(
                "course_skills",
                ""
            ),

        "course_organization":
            course.get(
                "course_organization",
                ""
            ),

        "course_rating":
            course.get(
                "course_rating",
                ""
            ),

        "course_url":
            course.get(
                "course_url",
                ""
            ),

        "match_score":
            round(score * 100, 2)
})

    return results

if __name__ == "__main__":

    sample_profile = {

        "goal":
            "Become job-ready",

        "learning_style":
            "Projects",

        "target_level":
            "Advanced",

        "activities":
            "Building projects"
    }

    recommendations = recommend_for_user(
        sample_profile
    )

    for course in recommendations:
        print(course)