import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const chatifyServer = new ec2.Instance(this, 'chatify', {
      vpc: ec2.Vpc.fromVpcAttributes(this, 'chatify-vpc', {
        vpcId: 'chatify-vpc-id',
        availabilityZones: ['eu-central-1a'],
        publicSubnetIds: ['chatify-public-subnet-id'],
        publicSubnetRouteTableIds: ['chatify-public-subnet-route-table-id'],
        vpcCidrBlock: '10.0.0.0/16',
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      keyName: 'chatify',
      userData: ec2.UserData.custom(`
        #!/bin/bash
        yum update -y
        yum install -y git
        yum install -y docker
        service docker start
        usermod -a -G docker ec2-user
        chkconfig docker on
        systemctl enable docker
        systemctl start docker
        cd /home/ec2-user
        git clone XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX chatify-app
        cd chatify-app
        docker compose up -d
      `),
    });
  }
}
