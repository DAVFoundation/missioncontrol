#!/usr/bin/env bash

#!/usr/bin/env bash

set -e
set -u

function usage() {
    set -e
    cat <<EOM
##### ecs-deploy #####

Required arguments:
    -c | --cluster                  ECS cluster
    -s | --service                  ECS service name
    -f | --task-definition-file     Json file containing ECS task definition

Options:
    --stop-running-tasks           Stop currently running tasks
    --skip-build                    Skip building of docker image
    -d | --debug                    Turn on debug mode to trace running commands

Requirements:
    aws:  AWS Command Line Interface
    jq:   Command-line JSON processor

EOM

    exit 2
}

function file_does_not_exist () {
    cat <<EOM

task definition file [$1] does not exist!

EOM

    exit 2
}

if [ $# == 0 ]; then usage; fi

# Check requirements
function require {
    command -v "$1" > /dev/null 2>&1 || {
        echo "Some of the required software is not installed:"
        echo "    please install $1" >&2;
        exit 1;
    }
}

# Check for AWS, AWS Command Line Interface
require aws
# Check for jq, Command-line JSON processor
require jq

AWS_CLI=$(which aws)
AWS_ECS="$AWS_CLI --output json ecs"

cluster=false
service=flase
task_definition_file=false
skip_build=false
stop_running_tasks=false
# Loop through arguments, two at a time for key and value
while [[ $# -gt 0 ]]
do
    key="$1"

    case ${key} in
        -c|--cluster)
            cluster="$2"
            shift # past argument
            ;;
        -s|--service)
            service="$2"
            shift # past argument
            ;;
        -f|--task-definition-file)
            task_definition_file="$2"
            shift # past argument
            ;;
        --stop-running-tasks)
            stop_running_tasks=true
            ;;
        --skip-build)
            skip_build=true
            ;;
        -d|--debug)
            set -o xtrace
            ;;
        *)
            usage
            exit 2
        ;;
    esac
    shift # past argument or value
done

if [ ${cluster} == false ] || [ ${service} == false ] || [ ${task_definition_file} == false ]; then
    echo "you must provide [cluster], [service] and [task-definition-file]"
    exit 1
fi

if [ ! -f "$task_definition_file" ]
then
  file_does_not_exist ${task_definition_file}
fi


function delete_old_task_definitions () {

      if [[ ${MAX_DEFINITIONS} -gt 0 ]]; then

        TASK_REVISIONS=`${AWS_ECS} list-task-definitions --family-prefix ${CREATED_TASK_FAMILY} --status ACTIVE --sort ASC`

        NUM_ACTIVE_REVISIONS=$(echo "$TASK_REVISIONS" | jq ".taskDefinitionArns|length")

        if [[ ${NUM_ACTIVE_REVISIONS} -gt ${MAX_DEFINITIONS} ]]; then
            LAST_OUTDATED_INDEX=$(($NUM_ACTIVE_REVISIONS - $MAX_DEFINITIONS - 1))
            for i in $(seq 0 ${LAST_OUTDATED_INDEX}); do
                OUTDATED_REVISION_ARN=$(echo "$TASK_REVISIONS" | jq -r ".taskDefinitionArns[$i]")

                echo "Deregistering outdated task revision: $OUTDATED_REVISION_ARN"

                ${AWS_ECS} deregister-task-definition --task-definition "$OUTDATED_REVISION_ARN" > /dev/null
            done
        fi
      fi

}


image=$(cat ${task_definition_file} | jq -r .containerDefinitions[].image)

image_repo_url=$(echo ${image} | awk 'match($0,/[^\/]+$/) {print substr($0,0,RSTART-2)}')
image_name=$(echo ${image} | awk 'match($0,/[^\/]+:/) {print substr($0,RSTART,RLENGTH-1)}')
image_tag=$(echo ${image} | awk 'match($0,/[^:]+$/) {print substr($0,RSTART,RLENGTH)}')

if [ ${skip_build} != true ]; then

    docker build -t ${image_name}:${image_tag} .

    docker tag ${image_name}:${image_tag} ${image_repo_url}/${image_name}:${image_tag}

    docker push ${image_repo_url}/${image_name}:${image_tag}
else
    echo "skipping build"
fi

echo "registering new task definition"

MAX_DEFINITIONS=10

CREATED_TASK_DEFINITION=$(${AWS_ECS} register-task-definition --cli-input-json file://${task_definition_file} | jq -r '.taskDefinition')
CREATED_TASK_FAMILY=$(echo ${CREATED_TASK_DEFINITION} | jq -r '.family')
CREATED_TASK_REVISION=$(echo ${CREATED_TASK_DEFINITION} | jq -r '.revision')
CREATED_TASK_ARN=$(echo ${CREATED_TASK_DEFINITION} | jq -r '.taskDefinitionArn')

echo "updating service ${service} with task definition ${CREATED_TASK_FAMILY}:${CREATED_TASK_REVISION}"

UPDATE_SERVICE_RESPONSE=$(${AWS_ECS} update-service --cluster ${cluster} --service ${service} --task-definition ${CREATED_TASK_FAMILY}:${CREATED_TASK_REVISION})
CURRENT_SERVICE_TASK_DEFINITION=$(echo ${UPDATE_SERVICE_RESPONSE} | jq -r .service.taskDefinition)

echo "task definition of service ${service} updated to ${CURRENT_SERVICE_TASK_DEFINITION}"

CURRENT_TASK=$(${AWS_ECS} list-tasks --cluster ${cluster} --service-name ${service} | jq -r .taskArns[0])

if [ ${stop_running_tasks} == false ]; then
    delete_old_task_definitions
    exit 0
fi

STOP_TASK_RESPONSE=$(${AWS_ECS} stop-task --cluster ${cluster} --task ${CURRENT_TASK})

echo "stopped currently running task"

echo "waiting for the new task to run"

every=10
i=0
timeout=90
while [ ${i} -lt ${timeout} ]
do

  RUNNING_TASKS=$(${AWS_ECS} list-tasks --cluster ${cluster}  --service-name ${service} --desired-status RUNNING \
      | jq -r '.taskArns[]')

  if [[ ! -z ${RUNNING_TASKS} ]] ; then

    RUNNING=$(${AWS_ECS} describe-tasks --cluster ${cluster} --tasks ${RUNNING_TASKS} \
      | jq ".tasks[]| if .taskDefinitionArn == \"$CREATED_TASK_ARN\" then . else empty end|.lastStatus" \
      | grep -e "RUNNING") || :

    if [ "$RUNNING" ]; then
      echo "Service updated successfully, new task definition [${CREATED_TASK_FAMILY}:${CREATED_TASK_REVISION}] is now running.";

      delete_old_task_definitions

      exit 0
    fi
  fi

  sleep ${every}s
  i=$(( $i + $every ))
done

echo "ERROR: New task definition not running within $timeout seconds"
exit 1
