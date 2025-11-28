# AWS CDK CI/CD Pipeline – Assignment

### Student Details  
- **Name:** Zafar Ahmed  
- **Student ID:** 9027671  
- **Repository:** https://github.com/Zafar0725/cdk-lab-pipeline  

---

## 📘 Project Overview

This project implements a fully automated CI/CD pipeline using **AWS CDK**, **CodePipeline**, **CodeBuild**, and **GitHub**.  
Whenever code is pushed to GitHub, the pipeline automatically:

1️⃣ Fetches source code from GitHub using CodeStar connection  
2️⃣ Runs CDK build and synthesizes CloudFormation templates  
3️⃣ Deploys infrastructure using CloudFormation  

The deployed service includes:
- A **Lambda function**
- An **API Gateway** endpoint: `/hello`

---

## 🏗 Architecture


---
GitHub → CodePipeline → CodeBuild → CloudFormation → Lambda + API Gateway
## 📁 Main Files

| File | Description |
|------|-------------|
| `bin/cdk-lab-pipeline.ts` | CDK entry point that initializes stacks |
| `lib/service-stack.ts` | Deploys Lambda + API Gateway |
| `lib/pipeline-stack.ts` | Creates CI/CD pipeline with GitHub integration |
| `buildspec.yml` | CodeBuild instructions |

---

## 🚀 Deployment Steps (Simplified)

```bash
npm install
npm run build
cdk bootstrap
cdk deploy PipelineStack
