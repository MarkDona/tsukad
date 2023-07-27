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

// Assuming you have already initialized Firebase and obtained a reference to your database
const agentsRef = firebase.database().ref("agents");
let myChart; // Global variable to hold the chart instance
let myPieChart;

function createPieChart() {

  var barColors = [
  "#6978F0",
  "#27AE60",
  "#FEC901",
  ];
    // Destroy the existing chart if it exists
    if (myPieChart) {
      myPieChart.destroy();
    }

    // Initialize counters for token statuses
    let totalVerified = 0;
    let totalActive = 0;
    let totalUnverified = 0;

    // Retrieve agents' data from Firebase
    agentsRef.once("value")
        .then(snapshot => {
        const agents = snapshot.val();

        // Loop through each agent and sum up token statuses
        Object.values(agents).forEach(agent => {
            Object.values(agent.tokens || {}).forEach(token => {
            if (token.tokenStatus === "verified") {
                totalVerified++;
            } else if (token.tokenStatus === "Active") {
                totalActive++;
            } else if (token.tokenStatus === "unverified") {
                totalUnverified++;
            }
            });
        });

        // Calculate the total number of tokens
        const totalTokens = totalVerified + totalActive + totalUnverified;

        // Calculate the percentages of each token status
        const verifiedPercentage = ((totalVerified / totalTokens) * 100).toFixed(2);
        const activePercentage = ((totalActive / totalTokens) * 100).toFixed(2);
        const unverifiedPercentage = ((totalUnverified / totalTokens) * 100).toFixed(2);

        myPieChart = new Chart("pie", {
          type: "pie",
          data: {
            labels: ["Active: " + activePercentage + "%", "Unverified: " + unverifiedPercentage + "%", "Verified: " + verifiedPercentage + "%"],
            datasets: [{
              backgroundColor: barColors,
              data: [activePercentage, unverifiedPercentage, verifiedPercentage]
            }]
          },
          options: {
          }
        }).catch(error => {
        console.log("Error retrieving agents from Firebase:", error);
        });
      })
        
    }

// Function to create a bar chart for top 5 agents by links generated
function createBarChart() {
// Destroy the existing chart if it exists
if (myChart) {
   myChart.destroy();
}

// Initialize an array to store agents and their links generated
const agentLinksData = [];

// Retrieve agents' data from Firebase
agentsRef.once("value")
   .then(snapshot => {
   const agents = snapshot.val();

   // Loop through each agent and calculate the number of links generated
   Object.keys(agents).forEach(agentId => {
       const agent = agents[agentId];
       const agentNames = agent.agentName;
       const linksGenerated = Object.keys(agent.tokens || {}).length;
       agentLinksData.push({ agentNames, linksGenerated });
   });

   // Sort agents by links generated in descending order
   agentLinksData.sort((a, b) => b.linksGenerated - a.linksGenerated);

   // Get the top 5 agents
   const top5Agents = agentLinksData.slice(0, 5);

   // Create the data arrays for the chart
   const labels = top5Agents.map(agent => `Agent ${agent.agentNames}`);
   const data = top5Agents.map(agent => agent.linksGenerated);

   // Create the chart data object
   
    var barColors = ["#27AE60", "#27AE60","#27AE60","#27AE60","#27AE60"];

    new Chart("myChart", {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: barColors,
          data: data
        }]
      },
      options: {
        legend: {display: false},
      }
    });
   
   })
   .catch(error => {
     console.log("Error retrieving agents from Firebase:", error);
   });
}

// Function to count total tokens, verified tokens, unverified tokens, and active tokens
function countTokensByAgents() {

  var agentsRef = firebase.database().ref("agents");

  agentsRef.once("value").then(function(snapshot) {
    var agents = snapshot.val();

    var totalTokens = 0;
    var totalVerifiedTokens = 0;
    var totalUnverifiedTokens = 0;
    var totalActiveTokens = 0;

    // Iterate through each agent
    for (var agentId in agents) {
      var agent = agents[agentId];

      // Iterate through each token
      for (var tokenId in agent.tokens) {
        var token = agent.tokens[tokenId];
        totalTokens++;

        document.getElementById("total-Tokens").innerHTML = "Total Tokens Generated: " + totalTokens;

        if (token.tokenStatus === "unverified") {
          totalUnverifiedTokens++;
          document.getElementById("total-Unverified-Tokens").innerHTML = "Total Unverified Tokens:" + totalUnverifiedTokens;
        }
        else if (token.tokenStatus === "Active") {
          totalActiveTokens++;
          document.getElementById("total-Active-Tokens").innerHTML = "Total Active Tokens:" + totalActiveTokens;
        }
      }
    }

    console.log("Total Tokens:", totalTokens);
    console.log("Total Unverified Tokens:", totalUnverifiedTokens);
    console.log("Total Active Tokens:", totalActiveTokens);

  }).catch(function(error) {
    console.log("Error retrieving agent data:", error);
  });
}


// Call the function to create the bar chart
createBarChart();
createPieChart();
countTokensByAgents();