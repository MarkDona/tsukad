// Initialize Firebase
  // Replace the Firebase configuration with your own
   // Your web app's Firebase configuration
   const firebaseConfig = {
        apiKey: "AIzaSyBC_dZWmvdBt0tc9Z8H2Xcl0UTExlb5N_A",
        authDomain: "tsuk-1d7b1.firebaseapp.com",
        databaseURL: "https://tsuk-1d7b1-default-rtdb.firebaseio.com",
        projectId: "tsuk-1d7b1",
        storageBucket: "tsuk-1d7b1.appspot.com",
        messagingSenderId: "462961223565",
        appId: "1:462961223565:web:f5f8838f0beffb475effc4",
        measurementId: "G-S30WZ6ZXX3"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

  // Reference to the agents in the database
  var agentsRef = firebase.database().ref("agents");

  // Function to update the agent's status in Firebase
  function updateAgentStatus(agentId, newStatus) {
    agentsRef.child(agentId).update({ accountStatus: newStatus })
      .then(function() {
        console.log("Agent status updated for agent", agentId);
      })
      .catch(function(error) {
        console.log("Error updating agent status:", error);
      });
  }

  // Fetch agent data and populate the DataTable
  agentsRef.once("value").then(function(snapshot) {
    var agents = snapshot.val();

    // Initialize DataTable
    var table = $('#agentsTable').DataTable();

    // Iterate through each agent
    for (var agentId in agents) {
      var agent = agents[agentId];

      // Add a row to the DataTable
      table.row.add([
        agentId,
        agent.agentName,
        agent.accountStatus,
        '<button onclick="toggleStatus(\'' + agentId + '\', \'' + agent.accountStatus + '\')">' +
        ((agent.accountStatus === "approved") ? "Disapprove" : "Approve") +
        '</button>'
      ]).draw();
    }
  }).catch(function(error) {
    console.log("Error retrieving agent data:", error);
  });

  // Function to toggle the agent's status
  function toggleStatus(agentId, currentStatus) {
    var newStatus = (currentStatus === "approved") ? "unapproved" : "approved";
    updateAgentStatus(agentId, newStatus);

    // Refresh DataTable to update the button text
    $('#agentsTable').DataTable().ajax.reload();
  }
