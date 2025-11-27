#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ServiceStack } from '../lib/service-stack';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

// Use your real AWS account and region
const env = {
  account: '674339657595',
  region: 'us-east-1',
};

// Service stack (Lambda + API Gateway)
const serviceStack = new ServiceStack(app, 'ServiceStack', {
  env,
});

// Pipeline stack (GitHub → CodeBuild → CloudFormation)
new PipelineStack(app, 'PipelineStack', {
  env,
  githubOwner: 'YOUR_GITHUB_USERNAME',          // <-- change later
  githubRepo: 'YOUR_REPO_NAME',                 // <-- change later
  githubBranch: 'main',                         // or 'master'
  connectionArn: 'arn:aws:codestar-connections:us-east-1:674339657595:connection/XXXX', // <-- change later
  serviceStackName: serviceStack.stackName,     // "ServiceStack"
});
