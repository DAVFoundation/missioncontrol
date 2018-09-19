local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['davnn-deployment'];
local globals = import '../components/globals.libsonnet';
local resources = params.resources;
{
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: params.name,
    namespace: globals.davnnNamespace,
  },
  spec: {
    selector: {
      matchLabels: {
        app: params.name,
      },
    },
    replicas: globals.replicas,
    template: {
      metadata: {
        labels: {
          app: params.name,
        },
        annotations: null,
      },
      spec: {
        terminationGracePeriodSeconds: 30,
        initContainers: [{
          name: 'davnn-init-config',
          image: 'davnetwork/dav-kafka-init:' + params.version,
          resources: resources['davnn-init-config'],
          env: [
            {
              name: 'NODE_NAME',
              valueFrom: {
                fieldRef: {
                  fieldPath: 'spec.nodeName',
                },
              },
            },
            {
              name: 'POD_NAME',
              valueFrom: {
                fieldRef: {
                  fieldPath: 'metadata.name',
                },
              },
            },
            {
              name: 'POD_NAMESPACE',
              valueFrom: {
                fieldRef: {
                  fieldPath: 'metadata.namespace',
                },
              },
            },
          ],
          command: [
            '/bin/bash',
            '/etc/kafka-configmap/init.sh',
          ],
          volumeMounts: [
            {
              name: 'kafka-configmap',
              mountPath: '/etc/kafka-configmap',
            },
            {
              name: 'kafka-config',
              mountPath: '/etc/kafka',
            },
          ],
        }],
        containers: [
          {
            name: 'nginx',
            image: 'davnetwork/dav-nginx:' + params.version,
            resources: resources.nginx,
            env: [
              {
                name: 'WEB_REVERSE_PROXY_PORT',
                value: '3005',
              },
              {
                name: 'NGINX_PORT',
                value: '80',
              },
            ],
            ports: [{
              containerPort: 80,
            }],
            command: [
              '/bin/bash',
            ],
            args: [
              '-c',
              "envsubst < /etc/nginx/templates/app.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'",
            ],
            volumeMounts: [{
              name: 'nginx-configmap',
              mountPath: '/etc/nginx/templates',
            }],
          },
          {
            name: 'api',
            image: 'davnetwork/dav-api:' + params.version,
            resources: resources.api,
            env: [
              {
                name: 'CASSANDRA_KEYSPACE',
                value: 'davnn',
              },
              {
                name: 'CASSANDRA_ENDPOINTS',
                value: 'localhost',
              },
              {
                name: 'KAFKA_HOST',
                value: 'localhost:9092',
              },
            ],
            ports: [
              {
                containerPort: 3005,
              },
              {
                containerPort: 9229,
              },
            ],
            command: [
              '/bin/bash',
            ],
            args: [
              '-c',
              "nodemon --watch 'src/**/*.ts' --ignore 'src/**/*.spec.ts' --exec 'ts-node' src/index.ts --inspect 9229",
            ],
          },
          {
            name: 'kafka',
            image: 'davnetwork/dav-kafka:' + params.version,
            resources: resources.kafka,
            env: [
              {
                name: 'KAFKA_LOG4J_OPTS',
                value: '-Dlog4j.configuration=file:/etc/kafka/log4j.properties',
              },
              {
                name: 'JMX_PORT',
                value: '5555',
              },
            ],
            ports: [
              {
                name: 'inside',
                containerPort: 9092,
              },
              {
                name: 'outside',
                containerPort: 9094,
              },
              {
                name: 'jmx',
                containerPort: 5555,
              },
            ],
            command: [
              './bin/kafka-server-start.sh',
              '/etc/kafka/server.properties',
            ],
            readinessProbe: {
              tcpSocket: {
                port: 9092,
              },
              timeoutSeconds: 1,
            },
            volumeMounts: [
              {
                name: 'kafka-config',
                mountPath: '/etc/kafka',
              },
              {
                name: 'kafka-data',
                mountPath: '/var/lib/kafka/data',
              },
            ],
          },
          {
            name: 'cassandra',
            image: 'davnetwork/dav-cassandra:' + params.version,
            resources: resources.cassandra,
            ports: [
              {
                containerPort: 7000,
                name: 'intra-node',
              },
              {
                containerPort: 7001,
                name: 'tls-intra-node',
              },
              {
                containerPort: 7199,
                name: 'jmx',
              },
              {
                containerPort: 9042,
                name: 'cql',
              },
            ],
            securityContext: {
              capabilities: {
                add: [
                  'IPC_LOCK',
                ],
              },
            },
            lifecycle: {
              preStop: {
                exec: {
                  command: [
                    '/bin/sh',
                    '-c',
                    'nodetool drain',
                  ],
                },
              },
            },
            env: [
              {
                name: 'MAX_HEAP_SIZE',
                value: '512M',
              },
              {
                name: 'HEAP_NEWSIZE',
                value: '100M',
              },
              {
                name: 'CASSANDRA_CLUSTER_NAME',
                value: 'ride-hailing',
              },
              {
                name: 'CASSANDRA_DC',
                value: 'DC1',
              },
              {
                name: 'CASSANDRA_RACK',
                value: 'Rack1',
              },
              {
                name: 'POD_IP',
                valueFrom: {
                  fieldRef: {
                    fieldPath: 'status.podIP',
                  },
                },
              },
            ],
            readinessProbe: {
              exec: {
                command: [
                  '/bin/bash',
                  '-c',
                  '/ready-probe.sh',
                ],
              },
              initialDelaySeconds: 15,
              timeoutSeconds: 5,
            },
            volumeMounts: [{
              name: 'cassandra-data',
              mountPath: '/cassandra_data',
            }],
          },
        ],
        volumes: [
          {
            name: 'nginx-configmap',
            configMap: {
              name: 'nginx-configmap',
            },
          },
          {
            name: 'kafka-configmap',
            configMap: {
              name: 'kafka-configmap',
            },
          },
          {
            name: 'kafka-config',
            emptyDir: {},
          },
          {
            name: 'kafka-data',
            emptyDir: {},
          },
          {
            name: 'cassandra-data',
            emptyDir: {},
          },
        ],
      },
    },
  },
}
