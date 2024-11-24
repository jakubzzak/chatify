import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ChatifyStackProps } from '../chatify-stack';

dotenv.config({ path: '../client/.env', debug: true });

interface FrontendConstructProps extends ChatifyStackProps {
  apiUrl: string;
}

export class FrontendConstruct extends Construct {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: FrontendConstructProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, `${id}Bucket`, {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(30),
            },
          ],
        },
      ],
    });

    this.distribution = new cloudfront.Distribution(this, `${id}Distribution`, {
      defaultBehavior: {
        origin: new origins.HttpOrigin(bucket.bucketWebsiteDomainName),
        compress: true,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: new cloudfront.Function(this, `${id}UrlRewriteFunction`, {
              code: cloudfront.FunctionCode.fromInline(`
              function handler(event) {
                var request = event.request;
                var uri = request.uri;
                
                // Handle root path
                if (uri === '/') {
                  request.uri = '/index.html';
                }
                // Handle clean URLs
                else if (!uri.includes('.')) {
                  request.uri = uri + '.html';
                }
                
                return request;
              }
            `),
            }),
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      additionalBehaviors: {
        '/_next/*': {
          origin: new origins.HttpOrigin(bucket.bucketWebsiteDomainName),
          compress: true,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      enableLogging: false,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    new s3deploy.BucketDeployment(this, `${id}Deployment`, {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, '../../../client/.next/static'),
          {
            // bundling: {
            //   command: [
            //     'bash',
            //     '-c',
            //     [
            //       `export NEXT_PUBLIC_BACKEND_URL='${props.apiUrl}'`,
            //       `export NEXT_PUBLIC_FIREBASE_CONFIG='${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}'`,
            //       'npm ci && npm run build',
            //     ].join(' && '),
            //   ],
            //   image: cdk.DockerImage.fromRegistry('node:20'),
            // workingDirectory: '/var/task',
            // },
          },
        ),
        // s3deploy.Source.asset(path.join(__dirname, '../../../client/out')),
      ],
      destinationBucket: bucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
    });
  }
}
