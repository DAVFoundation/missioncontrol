local globals = import '../components/globals.libsonnet';
{
  global: globals,
  components: {
    // Component-level parameters, defined initially from 'ks prototype use ...'
    // Each object below should correspond to a component in the components/ directory
    'davnn-deployment': {
      name: 'davnn',
    },
    'kafka-configmap': {
      name: 'kafka-configmap',
    },
    'nginx-configmap': {
      name: 'nginx-configmap',
    },
  },
}
