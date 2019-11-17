local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['zookeeper-deployment'];
local resources = params.resources;
local version = std.extVar('IMAGE_VERSION');
{
  apiVersion: 'apps/v1',
  kind: 'StatefulSet',
  metadata: {
    name: 'zookeeper',
    namespace: params.davnnNamespace,
  },
  spec: {
    selector: {
      matchLabels: {
        app: 'zookeeper',
      },
    },
    serviceName: 'zookeeper',
    replicas: 3,
    template: {
      metadata: {
        labels: {
          app: 'zookeeper',
          storage: 'ephemeral',
        },
        annotations: null,
      },
      spec: {
        terminationGracePeriodSeconds: 10,
        initContainers: [{
          name: 'init-config',
          image: 'davnetwork/zookeeper-init:' + version,
          command: [
            '/bin/bash',
            '/etc/kafka-configmap/init.sh',
          ],
          resources: resources['init-config'],
          volumeMounts: [
            {
              name: 'zookeeper-configmap',
              mountPath: '/etc/kafka-configmap',
            },
            {
              name: 'zookeeper-configs',
              mountPath: '/etc/kafka',
            },
            {
              name: 'zookeeper-data',
              mountPath: '/var/lib/zookeeper/data',
            },
          ],
        }],
        containers: [{
          name: 'zookeeper',
          image: 'davnetwork/zookeeper:' + version,
          resources: resources.zookeeper,
          env: [{
            name: 'KAFKA_LOG4J_OPTS',
            value: '-Dlog4j.configuration=file:/etc/kafka/log4j.properties',
          }],
          command: [
            './bin/zookeeper-server-start.sh',
            '/etc/kafka/zookeeper.properties',
          ],
          ports: [
            {
              containerPort: 2181,
              name: 'client',
            },
            {
              containerPort: 2888,
              name: 'peer',
            },
            {
              containerPort: 3888,
              name: 'leader-election',
            },
          ],
          readinessProbe: {
            exec: {
              command: [
                '/bin/sh',
                '-c',
                '[ "imok" = "$(echo ruok | nc -w 1 -q 1 127.0.0.1 2181)" ]',
              ],
            },
          },
          volumeMounts: [
            {
              name: 'zookeeper-configs',
              mountPath: '/etc/kafka',
            },
            {
              name: 'zookeeper-data',
              mountPath: '/var/lib/zookeeper/data',
            },
          ],
        }],
        volumes: [
          {
            name: 'zookeeper-configmap',
            configMap: {
              name: 'zookeeper-configmap',
            },
          },
          {
            name: 'zookeeper-configs',
            emptyDir: {},
          },
          {
            name: 'zookeeper-data',
            emptyDir: {},
          },
        ],
      },
    },
  },
}
