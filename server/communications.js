class Communications {
  constructor(database) {
    this.database = database;
  }

  getCommunicationsByCampaign(campaignId) {
    return new Promise((resolve, reject) => {
      this.database.getRecords('campaign_id', campaignId, 'communications')
      .then(resolve)
      .catch(reject)

    })
  }

  createCommunication(communication) {
    this.database.createRecord(communication, 'communications')
    .then(console.log)
    .catch(console.error)
  }

  updateCommunication(updateObj, key, val) {
    this.database.updateRecord(updateObj, 'communications', key, val)
    .then(console.log)
    .catch(console.error)
  }

  markAsSent(object) {
    return this.database.updateRecord({
      status: 'Sent',
      message_id: object.message_id
    }, 'communications', 'id', object.communication_id)
  }
}

module.exports = Communications;