from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from recommender import (
    recommend_for_user
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

@app.get("/")
def home():

    return {
        "message":
        "LearnHub API Running"
    }


@app.post("/recommend")
def recommend(profile: dict):

    recommendations = (
        recommend_for_user(
            profile
        )
    )

    return recommendations

@app.post("/recommend")
def recommend(profile: dict):

    print("REQUEST RECEIVED")
    print(profile)

    recommendations = recommend_for_user(profile)

    print("RETURNING:")
    print(recommendations)

    return recommendations