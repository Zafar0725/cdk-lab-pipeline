// lib/service-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function
    const helloFn = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
      environment: {
        STAGE: 'dev',
      },
    });

    // API Gateway REST API
    const api = new apigw.RestApi(this, 'HelloApi', {
      restApiName: 'Cdk Hello API',
      description: 'Simple Hello API created by AWS CDK',
    });

    // /hello resource
    const helloResource = api.root.addResource('hello');

    // GET /hello → Lambda
    helloResource.addMethod('GET', new apigw.LambdaIntegration(helloFn));

    // Output the API base URL
    new cdk.CfnOutput(this, 'ApiBaseUrl', {
      value: api.url,
      description: 'Base URL for the Hello API',
    });
  }
}
