#!/bin/bash


# Get environment or exit with error message
envs="Int Test Live"
valid_opt=false

usage () {
	echo "Usage: './apply-stack.sh -e <target environment>'";
	echo "Example './apply-stack.sh -e Int'";
	echo "Supported environments are ($envs)";
	exit 1;
 }

while getopts ":e:" opt; do
	case ${opt} in
		e )
			valid_opt=true;

			if [[ ${envs} =~ (^|[[:space:]])$OPTARG($|[[:space:]]) ]]; then
				env=$OPTARG;
			else
				echo "Invalid option argument: -$OPTARG" 1>&2;
				usage;
			fi
		;;
		\? )
			echo "Invalid Option: -$OPTARG" 1>&2
			usage;
		;;
		: )
			echo "Invalid Option: -$OPTARG requires an argument" 1>&2
			usage;
		;;
		 * )
			echo "Unimplemented option" 1>&2
			usage;
		;;
	esac
done
shift $((OPTIND -1))

if [[ ${valid_opt} = false ]]; then
	echo "Missing argument";
	usage;
fi

stack_name=$(jq ".${env}" ../stacks/stack_names.json | tr -d '"')

stack_description=$(aws cloudformation describe-stacks --stack-name ${stack_name})

if [[ "$?" -ne 0 ]]; then
	echo "ERROR: Stack $stack_name does not exist";
  	exit 1;
fi

bucket_name=$(echo ${stack_description} | jq '.Stacks[0].Outputs[0] | select(.OutputKey=="S3BucketSecureURL")
	| .OutputValue' \
	| tr -d '"' \
	| sed -E 's/http(.*)(\.s3\.amazonaws.com)/s3\1/')

cd ../build

echo "Ready to sync files for stack ${stack_name} to S3 bucket ${bucket_name}"

message=$(aws s3 sync . ${bucket_name} --exclude "*.map" --exclude "asset-manifest.json" --exclude "service-worker.js" \
	--acl public-read);

if [[ "$?" -ne 0 ]]; then
	echo "ERROR: Failed to sync to S3  bucket ${bucket_name} for stack ${stack_name}";
	echo ${message}
    exit 1;
fi

echo "S3 sync completed"