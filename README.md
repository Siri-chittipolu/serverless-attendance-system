# Serverless Attendance System using AWS Rekognition (In Progress)

This is a serverless attendance system built using **React** on the frontend and **AWS Rekognition**, **Lambda**, **S3**, and **DynamoDB** on the backend. The goal is to provide a face-recognition-based attendance system with minimal infrastructure management, relying entirely on AWS serverless services.


---

##  Project Goal

Build a fully functional attendance system that:
- Uses **webcam capture** to take a photo of a user
- Uploads the photo to **Amazon S3**
- Triggers a **Lambda function** to detect and match the face using **AWS Rekognition**
- Logs attendance in **DynamoDB**
- Provides **real-time feedback** to the frontend (e.g., "Marked Present", "No Match")
- Includes **login authentication** via **AWS Cognito**

---

## 🔨 Current Progress

| Component                     |  Status          |
|-------------------------------|------------------|
| React frontend (basic UI)     |  Done            |
| Webcam capture functionality  |  Done            |
| Presigned URL Lambda          |  Working         |
| S3 Bucket upload              |  Working         |
| Rekognition collection setup  |  Done            |
| Attendance Processor Lambda   |  Working         |
| DynamoDB log writing          |  Working         |
| AWS Cognito Login             |  In progress     |
| Frontend log viewer           |  Coming soon     |
| Complete integration          |  In progress     |

---

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- AWS SDK v3

### Backend
- AWS Lambda
- Amazon S3
- AWS Rekognition
- DynamoDB
- API Gateway
- Cognito (planned)

---

##  Setup (WIP)

Setup instructions will be added soon.

For now, backend setup includes:
- S3 bucket: `attendance-uploads-demo`
- Rekognition collection: `employee_faces`
- IAM roles for Lambda execution
- DynamoDB table for attendance logs

---

## Architecture (Simplified)

