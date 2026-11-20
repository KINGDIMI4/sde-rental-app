from fastapi import FastAPI

app = FastAPI(
    title="SDE Rental App",
    description="Fleet and Vehicle Rental Management System",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to SDE Rental App Backend",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }