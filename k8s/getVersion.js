#!/usr/bin/env node

const drc = require('docker-registry-client');
const client = drc.createClientV2({
  name: 'davnetwork/dav-api',
});
client.listTags(function(err, res) {
  const tag = res.tags
    .filter(tag => /^\d{6}\-\d{4}$/.test(tag))
    .sort()
    .reverse()[0];
  console.log(tag);
  client.close();
});
