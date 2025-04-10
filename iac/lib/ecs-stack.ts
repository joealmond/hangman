import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";

interface EcsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
  ecrRepositoryName: string;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    // Reference existing ECR repository
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "AppRepository",
      props.ecrRepositoryName
    );

    // Create IAM role for EC2 instances to use ECS
    const ecsInstanceRole = new iam.Role(this, "EcsInstanceRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonEC2ContainerServiceforEC2Role"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ), // For SSM access
      ],
    });

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, "AppCluster", {
      vpc: props.vpc,
      clusterName: "hangman-cluster", // Added specific cluster name
    });

    // Add EC2 capacity to the cluster (t3.micro for free tier)
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, "ASG", {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      securityGroup: props.securityGroup,
      role: ecsInstanceRole,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      associatePublicIpAddress: true,
      minCapacity: 1,
      maxCapacity: 1
    });

    const capacityProvider = new ecs.AsgCapacityProvider(
      this,
      "AsgCapacityProvider",
      {
        autoScalingGroup,
        capacityProviderName: "HangmanCapacityProvider",
      }
    );
    cluster.addAsgCapacityProvider(capacityProvider);

    // Create a task definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, "AppTaskDef");

    // Add container to task definition
    const container = taskDefinition.addContainer("AppContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      memoryLimitMiB: 896,
      cpu: 512,
      logging: new ecs.AwsLogDriver({
        streamPrefix: "nestjs-app",
      }),
      environment: {
        // Add your environment variables here
        NODE_ENV: "production",
      },
    });

    // Add port mapping
    container.addPortMappings({
      containerPort: 3000, // Your NestJS app port
      hostPort: 80, // Map to host port 80
      protocol: ecs.Protocol.TCP,
    });

    // Create an ECS service
    const service = new ecs.Ec2Service(this, "AppService", {
      cluster,
      taskDefinition,
      desiredCount: 1,
      serviceName: "hangaman-service", // Added specific service name (with the exact spelling as requested)
    });

    // // Output the public IP address of the EC2 instance
    // new cdk.CfnOutput(this, "EC2PublicIP", {
    //   value: `http://${autoScalingGroup.instanceId}:80`,
    //   description: "Public IP address of the EC2 instance",
    // });

    // // Output the Auto Scaling Group name
    // new cdk.CfnOutput(this, "ASGName", {
    //   value: autoScalingGroup.autoScalingGroupName,
    //   description: "Name of the Auto Scaling Group"
    // });

    // Output instructions for accessing the application
    new cdk.CfnOutput(this, "EC2AccessInstructions", {
      value: [
        "To access your application:",
        "1. Go to the EC2 Console",
        "2. Find the instance in the ASG named: " + autoScalingGroup.autoScalingGroupName,
        "3. Use the Public IP address with port 80 (http://PUBLIC_IP:80)"
      ].join("\n"),
      description: "Instructions to access the application"
    });
  }
}
