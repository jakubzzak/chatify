import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ChatifyStackProps } from '../chatify-stack';

dotenv.config({ path: '../server/.env', debug: true });

export class BackendConstruct extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: ChatifyStackProps) {
    super(scope, id);

    const handler = new nodejs.NodejsFunction(this, `${id}Handler`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../server/dist'),
        {
          exclude: ['tsconfig.build.tsbuildinfo'],
        },
      ),
      bundling: {
        minify: true, // Cost optimization: Reduce cold start
        sourceMap: false,
        target: 'node20',
        esbuildArgs: {
          '--tree-shaking': 'true',
          '--platform': 'node',
        },
      },
      environment: {
        NODE_ENV: 'production',
        FIREBASE_SERVICE_ACCOUNT_OBJECT:
          process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT!,
      },
    });

    this.api = new apigateway.RestApi(this, `${id}API`, {
      deployOptions: {
        cachingEnabled: false,
        throttlingBurstLimit: 1000,
        throttlingRateLimit: 500,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL],
    });

    const integration = new apigateway.LambdaIntegration(handler, {
      proxy: true,
      allowTestInvoke: false,
    });

    this.api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });
  }
}
