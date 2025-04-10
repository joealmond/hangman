#!/bin/bash

# Variables
AWS_REGION="eu-north-1"
AWS_ACCOUNT_ID="905934951792"
ECR_REPOSITORY_NAMESPACE="van"
ECR_REPOSITORY_NAME="hangman"
IMAGE_TAG="latest"

# Login to AWS ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAMESPACE/$ECR_REPOSITORY_NAME

# Build the Docker image
echo "Building Docker image..."
docker build -t $ECR_REPOSITORY_NAME:$IMAGE_TAG .

# Tag the image for ECR
echo "Tagging image for ECR..."
docker tag $ECR_REPOSITORY_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAMESPACE/$ECR_REPOSITORY_NAME

# Push the image to ECR
echo "Pushing image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAMESPACE/$ECR_REPOSITORY_NAME

echo "Done!"