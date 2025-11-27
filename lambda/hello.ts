// lambda/hello.ts
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('Request event:', JSON.stringify(event));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello from CDK Lambda!',
      time: new Date().toISOString(),
    }),
  };
};
