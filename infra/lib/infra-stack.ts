import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../server/.env', debug: false });
dotenv.config({ path: '../client/.env', debug: false });

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const chatifyServer = new ec2.Instance(this, 'chatify', {
      vpc: ec2.Vpc.fromLookup(this, 'chatify-vpc', {
        vpcId: 'vpc-0b23ea52aecddd280', // _ (default)
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      keyPair: ec2.KeyPair.fromKeyPairName(
        this,
        'chatify-access-keypair',
        'chatify-ec2-2024-11-09',
      ),
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
        git clone git@github.com:jakubzzak/chatify.git
        cd chatify

        touch ./server/.env
        echo "FIREBASE_SERVICE_ACCOUNT_OBJECT=${process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT}" >> ./server/.env
        touch ./client/.env
        echo "NEXT_PUBLIC_FIREBASE_CONFIG=${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}" >> ./client/.env

        docker compose --env-file ./client/.env up --build -d
      `),
    });
  }
}
