// lib/pipeline-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

export interface PipelineStackProps extends cdk.StackProps {
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  connectionArn: string;
  serviceStackName: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact('CdkBuildOutput');

    // Source stage: GitHub via CodeStar connection
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      owner: props.githubOwner,
      repo: props.githubRepo,
      branch: props.githubBranch,
      connectionArn: props.connectionArn,
      output: sourceOutput,
      triggerOnPush: true, // auto-run when you push
    });

    // Build stage: CodeBuild project
    const buildProject = new codebuild.PipelineProject(this, 'CdkBuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CDK_Build',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    // Deploy stage: CloudFormation
    const deployAction = new codepipeline_actions.CloudFormationCreateUpdateStackAction({
      actionName: 'CFN_Deploy',
      stackName: props.serviceStackName, // "ServiceStack"
      templatePath: buildOutput.atPath(`${props.serviceStackName}.template.json`),
      adminPermissions: true,
    });

    const pipeline = new codepipeline.Pipeline(this, 'CdkLabPipeline', {
      pipelineName: 'CdkLabPipeline',
      restartExecutionOnUpdate: true,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

    new cdk.CfnOutput(this, 'PipelineName', {
      value: pipeline.pipelineName,
    });
  }
}
