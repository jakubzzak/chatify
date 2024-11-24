import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

// unused, just for reference
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'chatify-vpc', {
      vpcId: process.env.VPC_ID,
    });

    const securityGroup = new ec2.SecurityGroup(
      this,
      'chatify-security-group',
      {
        vpc: vpc,
        description: 'Allow web traffic',
        allowAllOutbound: true,
      },
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic',
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic',
    );

    const chatifyServer = new ec2.Instance(this, 'chatify', {
      vpc: vpc,
      securityGroup,
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
        yum install -y git docker nginx

        # Configure docker
        service docker start
        usermod -a -G docker ec2-user
        chkconfig docker on
        systemctl enable docker
        systemctl start docker

        # Configure nginx as reverse proxy
        cat > /etc/nginx/conf.d/default.conf << 'EOF'
        server {
            listen 80;
            server_name _;

            location / {
              proxy_pass http://localhost:3000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
            }
        }
        EOF

        systemctl enable nginx
        systemctl start nginx

        # Clone the repository
        cd /home/ec2-user
        git clone git@github.com:jakubzzak/chatify.git
        cd chatify

        # Set up environment variables
        touch ./server/.env
        echo "FIREBASE_SERVICE_ACCOUNT_OBJECT=${process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT}" >> ./server/.env
        touch ./client/.env
        echo "NEXT_PUBLIC_FIREBASE_CONFIG=${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}" >> ./client/.env

        # Build & run the services
        docker compose --env-file ./client/.env up --build -d
      `),
    });
  }
}
