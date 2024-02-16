import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { config } from 'dotenv';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

config();

export class CartServiceCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartServiceLambda = new NodejsFunction(this, 'NestJSLambda', {
      functionName: 'NestJSLambda',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/handler.ts',
      environment: {
        DB_HOST: process.env.HOST!,
        DB_NAME: process.env.NAME!,
        DB_USERNAME: process.env.DB_USERNAME!,
        DB_PASSWORD: process.env.PASSWORD!,
        PORT: process.env.PORT!
      }
    });

    const api = new apigateway.RestApi(this, 'cart Api', {
      defaultCorsPreflightOptions: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: ['*'],
        allowCredentials: true
      }
    });

    api.root.addResource('{proxy+}').addMethod('ANY', new apigateway.LambdaIntegration(cartServiceLambda));

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
