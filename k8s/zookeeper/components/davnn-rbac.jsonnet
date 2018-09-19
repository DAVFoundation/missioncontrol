local env = std.extVar("__ksonnet/environments");
local params = std.extVar("__ksonnet/params").components["davnn-rbac"];
{
    "apiVersion": "rbac.authorization.k8s.io/v1beta1",
    "kind": "ClusterRoleBinding",
    "metadata": {
        "name": "davnn-rbac",
        "namespace": params.davnnNamespace
    },
    "subjects": [
        {
            "kind": "ServiceAccount",
            "name": "default",
            "namespace": params.davnnNamespace
        }
    ],
    "roleRef": {
        "kind": "ClusterRole",
        "name": "cluster-admin",
        "apiGroup": "rbac.authorization.k8s.io"
    }
}
