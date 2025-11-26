import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as dotenv from 'dotenv';
import { dot } from 'node:test/reporters';

export class AwsCicdTutorialStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCicdTutorialQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    dotenv.config();
    const table = new dynamodb.Table(this, 'VisitedCountTable', {
      partitionKey: { name: 'key', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const lambdaFunction = new lambda.Function(this , 'LambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'main.handler',
      environment: {
        TABLE_NAME: table.tableName,
        VERSION: process.env.VERSION || "dev"
      }
      
    });
    table.grantReadWriteData(lambdaFunction);
    
    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      }
    });

    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: functionUrl.url
    });
  }
}
