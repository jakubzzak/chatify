import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackendConstruct } from './constructs/backend';
import { FrontendConstruct } from './constructs/frontend';
// import { Network } from './constructs/network';

export interface ChatifyStackProps extends cdk.StackProps {
  isLocal?: boolean;
}

export class ChatifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ChatifyStackProps) {
    super(scope, id, props);

    const isLocal = props?.isLocal || process.env.CDK_LOCAL === 'true';

    // const network = new Network(this, 'Network', { isLocal });

    const backend = new BackendConstruct(this, 'ChatifyBackend', {
      // vpc: network.vpc,
      isLocal,
    });

    const frontend = new FrontendConstruct(this, 'ChatifyFrontend', {
      apiUrl: backend.api.url,
      isLocal,
    });

    // Outputs
    new cdk.CfnOutput(this, `${id}ApiUrl`, { value: backend.api.url });
    new cdk.CfnOutput(this, `${id}WebsiteUrl`, {
      value: isLocal
        ? `http://localhost:4566/_localstack/s3/${frontend.distribution.domainName}/index.html`
        : `https://${frontend.distribution.distributionDomainName}`,
    });
  }
}
