#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkingStack } from '../lib/networking-stack';
import { EcsStack } from '../lib/ecs-stack';

const app = new cdk.App();

// Create networking stack
const networkingStack = new NetworkingStack(app, 'NetworkingStack');

// Create ECS stack that depends on networking
new EcsStack(app, 'EcsStack', {
  vpc: networkingStack.vpc,
  securityGroup: networkingStack.securityGroup,
  ecrRepositoryName: 'van/hangman',
});