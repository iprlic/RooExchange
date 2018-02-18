module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 4, // Rinkeby ID
      from: "0xc237f4557C835B7fc7EdCdF50BC7b261824b8748",
      gas: 7002305
    }
  }
};