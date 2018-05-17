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
    const timeNow = new Date(Date.now()).toISOString();
    return this.database.updateRecord({
      status: 'Sent',
      sent_at: timeNow,
      message_id: object.message_id
    }, 'communications', 'id', object.communication_id)
  }
}

module.exports = Communications;