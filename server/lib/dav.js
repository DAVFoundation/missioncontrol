// const Rx = require('rxjs/Rx');
const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const BasicMissionArtifact = require('../build/contracts/BasicMission.json');
const { getLatestMission, updateMission } = require('../store/missions');

class DavSDK {
  constructor() {
    let web3Provider = new Web3
      .providers
      .HttpProvider(process.env.ETH_NODE_URL);
    this.web3 = new Web3(web3Provider);
    this.BasicMissionContract = TruffleContract(BasicMissionArtifact);
    this.BasicMissionContract.setProvider(this.web3.currentProvider);
  }

  async init() {
    this.BasicMissionContractInstance = await this.BasicMissionContract.deployed();
    this.createMissionEvent = this.BasicMissionContractInstance.Create();
    // let signedMissionEvent = this.BasicMissionContractInstance.Signed();

    // Wrap Callback
    // this.createMissionObservable = Rx.Observable.create(observer => {
    //   createMissionEvent.watch(
    //     (error, response) => {
    //       if(error) {
    //         observer.error(error);
    //       } else {
    //         observer.next(response);
    //       }
    //     }
    //   );
    // });

    this.createMissionEvent.watch(
      async (error, response) => {
        if(error) {
          console.log(error);
        } else {
          console.log(response);
          let contractId = response.args.id.toLowerCase();
          let userId = response.args.buyerId;
          let vehicleId = response.args.sellerId;
          console.log(userId);
          let mission = null;
          while(!mission) {
            mission = await getLatestMission(userId);
            if(mission.status !== 'awaiting_signatures' || mission.vehicle_id !== vehicleId) {
              mission = null;
            }
          }
          console.log(mission);
          await updateMission(mission.mission_id, {
            'status': 'in_progress',
            'vehicle_signed_at': Date.now(),
            'contract_id': contractId
          });
        }
      }
    );
  }

  async dispose() {
    this.contractUpdates.unsubscribe();
  }
}

module.exports = new DavSDK();