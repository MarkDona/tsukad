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

    // Firebase Realtime Database reference
    const agentsRef = firebase.database().ref("agents");
    const tokenRef = firebase.database().ref("agents/tokens");

    var totalTokens = 0;
    var activeTokens = 0;
    var unverifiedTokens = 0;
    var verifiedTokens = 0;
    

    function displayAgentsByRoles() {
    // Retrieve agents' data from Firebase
    agentsRef.once("value")
        .then(snapshot => {
        const agentsData = snapshot.val();

        // Initialize arrays to store agents and staff data
        const agents = [];
        const staff = [];

        // Group agents based on their roles (agent or staff)
        Object.entries(agentsData).forEach(([agentId, agent]) => {
            const agentInfo = [agentId, agent.agentName, agent.role];
            if (agent.role === "agent") {
            agents.push(agentInfo);
            } else if (agent.role === "staff") {
            staff.push(agentInfo);
            }
        });

        // Initialize DataTables for agents table
        const agentsTable = $('#agent').DataTable({
            data: agents,
            "responsive": true, "lengthChange": false, "autoWidth": false,
        })

        // Initialize DataTables for staff table
        const staffTable = $('#staff').DataTable({
            data: staff,
            "responsive": true, "lengthChange": false, "autoWidth": false,
        });

        // Add click event listener to agents table cells to show modal with agent ID
        $('#agent tbody').on('click', 'td', function () {
            const agentId = agentsTable.row($(this).closest('tr')).data()[0];
            const agentName = agentsTable.row($(this).closest('tr')).data()[1];
            showModal(agentId, agentName);
        });

        // Add click event listener to staff table cells to show modal with agent ID
        $('#staff tbody').on('click', 'td', function () {
            const agentId = staffTable.row($(this).closest('tr')).data()[0];
            const agentName = staffTable.row($(this).closest('tr')).data()[1];
            showModal(agentId, agentName);
        });

        })
        .catch(error => {
            console.log("Error retrieving agents from Firebase:", error);
        });
    }

    function showModal(agentId, agentName) {
        // Replace "myModal" with the ID of your modal element in the HTML
        console.log(agentName)
        const modalElement = $("#modal-xl");
        modalElement.find("modal-body").text(`Agent ID: ${agentId}`);
        modalElement.modal("show");
        loadAgentURLTable(agentId, agentName);
      }


    displayAgentsByRoles();
  

    let myLinksGeneratedChart;

    // Function to create a bar chart for links generated by a selected agent in the last one month
    function createLinksGeneratedBarChart(agentId) {

    // Destroy the existing chart if it exists
    if (myLinksGeneratedChart) {
        myLinksGeneratedChart.destroy();
    }
        
    // Get the current date
    const currentDate = new Date();
    // Set the start date to one month ago
    const startDate = new Date(currentDate);
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);

    // Initialize an array to store weekly data
    const weeklyData = [];

    // Initialize the data object for the chart
    const chartData = {
        labels: [],
        datasets: [{
        label: 'Links Generated',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
        }]
    };

    // Retrieve the selected agent's data from Firebase
    agentsRef.child(agentId).once("value")
        .then(snapshot => {
        const agentData = snapshot.val();

        // Loop through each token and check if it was generated within the last month
        for (let i = 0; i < 4; i++) {
            const startDateOfWeek = new Date(startDate);
            startDateOfWeek.setDate(startDateOfWeek.getDate() + (i * 7));
            const endDateOfWeek = new Date(startDate);
            endDateOfWeek.setDate(endDateOfWeek.getDate() + ((i + 1) * 7));

            let linksInWeek = 0;

            Object.values(agentData.tokens || {}).forEach(token => {
            const tokenDate = new Date(token.createdAt);
            
            if (tokenDate >= startDateOfWeek && tokenDate < endDateOfWeek) {
                linksInWeek++;
            }
            });

            weeklyData.push(linksInWeek);
        }

        // Generate the labels for the chart based on the number of weeks
        chartData.labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

        // Fill the data array for the chart with the weekly data
        chartData.datasets[0].data = weeklyData;

        // Create the bar chart
        const ctx = document.getElementById('chart').getContext('2d');
        myLinksGeneratedChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });
        })
        .catch(error => {
        console.log("Error retrieving agent data from Firebase:", error);
        });
    }

    let myVerifiedFormChart;

    // Function to create a bar chart for verified token statuses in the last one month
    function createVerifiedFormBarChart(agentId) {
    // Destroy the existing chart if it exists
    if (myVerifiedFormChart) {
        myVerifiedFormChart.destroy();
    }

    // Get the current date
    const currentDate = new Date();
    // Set the start date to one month ago
    const startDate = new Date(currentDate);
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);

    // Initialize an array to store weekly data
    const weeklyData = [];

    // Initialize the data object for the chart
    const chartData = {
        labels: [],
        datasets: [{
        label: 'Verified Token Status',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
        }]
    };

    // Retrieve the selected agent's data from Firebase
    agentsRef.child(agentId).once("value")
        .then(snapshot => {
        const agentData = snapshot.val();

        // Calculate the number of weeks in the last month
        const numOfWeeks = Math.ceil((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));

        // Loop through each week and count verified token statuses
        for (let i = 0; i < numOfWeeks; i++) {
            const startDateOfWeek = new Date(startDate);
            startDateOfWeek.setDate(startDateOfWeek.getDate() + (i * 7));
            const endDateOfWeek = new Date(startDate);
            endDateOfWeek.setDate(endDateOfWeek.getDate() + ((i + 1) * 7));

            let verifiedCount = 0;

            // Loop through each token and count verified tokens in the current week
            Object.values(agentData.tokens || {}).forEach(token => {
            const tokenDate = new Date(token.createdAt);
            if (token.tokenStatus === "verified" && tokenDate >= startDateOfWeek && tokenDate < endDateOfWeek) {
                verifiedCount++;
            }
            });

            weeklyData.push(verifiedCount);
        }

        // Generate the labels for the chart based on the number of weeks
        for (let i = 0; i < numOfWeeks; i++) {
            chartData.labels.push(`Week ${i + 1}`);
        }

        // Fill the data array for the chart with the weekly data
        chartData.datasets[0].data = weeklyData;

        // Create the bar chart
        const ctx = document.getElementById('verified-chart').getContext('2d');
        myVerifiedFormChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });
        })
        .catch(error => {
        console.log("Error retrieving agent data from Firebase:", error);
        });
    }

    let myPieChart;

    // Function to create a pie chart for tokens distribution of the selected agent
    function createPieChart(agentId) {

    // Destroy the existing chart if it exists
    if (myPieChart) {
        myPieChart.destroy();
    }

    // Retrieve the selected agent's data from Firebase
    agentsRef.child(agentId).once("value")
        .then(snapshot => {
        const agentData = snapshot.val();

        // Calculate the number of tokens in each status
        let generatedCount = Object.keys(agentData.tokens || {}).length;
        let activeCount = 0;
        let unverifiedCount = 0;
        let verifiedCount = 0;

        Object.values(agentData.tokens || {}).forEach(token => {
            if (token.tokenStatus === "Active") {
            activeCount++;
            } else if (token.tokenStatus === "unverified") {
            unverifiedCount++;
            } else if (token.tokenStatus === "verified") {
            verifiedCount++;
            }
        });

        // Calculate the percentages of each token status
        const activePercentage = ((activeCount / generatedCount) * 100).toFixed(2);
        const unverifiedPercentage = ((unverifiedCount / generatedCount) * 100).toFixed(2);
        const verifiedPercentage = ((verifiedCount / generatedCount) * 100).toFixed(2);

        // Create the data array for the chart
        const chartData = {
            labels: ["Active Links: " + activePercentage + "%", "Links Accessed: " + unverifiedPercentage + "%", "Forms Submitted: " + verifiedPercentage + "%", "Generated Count: " + generatedCount],
            datasets: [{
            data: [activePercentage, unverifiedPercentage, verifiedPercentage],
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
            }]
        };

        // Create the pie chart
        const ctx = document.getElementById('pie-chart').getContext('2d');
        myPieChart = new Chart(ctx, {
            type: 'pie',
            data: chartData
        });
        })
        .catch(error => {
        console.log("Error retrieving agent data from Firebase:", error);
        });
    }




    // Load URL table for a specific agent
    function loadAgentURLTable(agentId, agentName) {
    const urlTableContainer = document.getElementById("urlTable");
    const urlTableContainerm = document.getElementById("urlTablem");


    agentsRef.once("value")
    .then(snapshot => {
        const agents = snapshot.val();



        let totalFormsSubmitted = 0;

        // Convert agents object to an array for sorting
        const agentsFormsArray = Object.keys(agents).map(agentId => {
          const agent = agents[agentId];
          let verifiedFormsSubmitted = 0;

          Object.values(agent.tokens || {}).forEach(token => {
            if (token.tokenStatus === "verified") {
              verifiedFormsSubmitted++;
              totalFormsSubmitted++;
              //console.log(verifiedFormsSubmitted);
            }
          });

          return {
            agentId,
            verifiedFormsSubmitted
          };
        });

        // Sort agents by verified forms submitted in descending order
        agentsFormsArray.sort((a, b) => b.verifiedFormsSubmitted - a.verifiedFormsSubmitted);

        const agentRankFormsSubmitted = agentsFormsArray.findIndex(agent => agent.agentId === agentId);
        console.log(`Agent - Rank For Forms Submitted: ${agentRankFormsSubmitted + 1}`);

        document.getElementById("total-Unverified-Tokens").innerHTML = 0;

        document.getElementById("total-Unverified-Tokens").innerHTML = agentRankFormsSubmitted + 1 + "/" + agentsFormsArray.length;



        // Convert agents object to an array for sorting
        const agentsArray = Object.keys(agents).map(agentId => {
            return {
                agentId,
                tokensGenerated:  Object.keys(agents[agentId].tokens).length || 0
            };
        });

        // Sort agents by tokens generated in descending order
        agentsArray.sort((a, b) => b.tokensGenerated - a.tokensGenerated);

        const rank = agentsArray.findIndex(agent => agent.agentId === agentId);
        console.log(`Agent - Rank For Tokens Generated: ${rank + 1}`);

        document.getElementById("total-Verified-Tokens").innerHTML = 0;

        document.getElementById("total-Verified-Tokens").innerHTML = rank + 1 + "/" + agentsArray.length;
        
    })
    .catch(error => {
        console.log("Error retrieving agents from Firebase:", error);
    });
    

    // Clear previous URL table content
    while (urlTableContainer.firstChild) {
        urlTableContainer.firstChild.remove();
    }

    while (urlTableContainerm.firstChild) {
            urlTableContainerm.firstChild.remove();
        }
    
    // Load agent-specific URL table
    const agentURLsRef = agentsRef.child(agentId).child("tokens");
    agentURLsRef.once("value")
        .then(snapshot => {
        const urls = snapshot.val();

        // Generate URL table
        const urlTable = document.createElement("table");
        const urlTablem = document.createElement("table");
        urlTable.setAttribute('class','table table-gray text-black'); 
        urlTablem.setAttribute('class','table table-gray text-black'); 
        const headerRow = document.createElement("tr");
        const headerRowm = document.createElement("tr");
        const headerCell1 = document.createElement("th");
        const headerCell2 = document.createElement("th");
        const headerCell3 = document.createElement("th");
        const headerCell4 = document.createElement("th");
        const headerCell5 = document.createElement("th");

        headerCell1.textContent = "Link URL";
        headerCell2.textContent = "Candidate Name";
        headerCell3.textContent = "Link Status";
        headerCell4.textContent = "Token Status";
        headerCell5.textContent = "Created At";

        headerRow.appendChild(headerCell1);
        headerRow.appendChild(headerCell2);
        headerRow.appendChild(headerCell3);
        headerRow.appendChild(headerCell4);
        headerRow.appendChild(headerCell5);

        headerRowm.appendChild(headerCell2);
        headerRowm.appendChild(headerCell4);
            
        urlTable.appendChild(headerRow);
        urlTablem.appendChild(headerRowm);

        totalTokens = 0;
        activeTokens = 0;
        unverifiedTokens = 0;
        verifiedTokens = 0;

        document.getElementById("total-Tokens").innerHTML = 0;
        document.getElementById("total-Active-Tokens").innerHTML = 0;
        document.getElementById("total-Unverified-Tokens").innerHTML = 0;
        


        Object.values(urls).forEach(url => {

        if(url){
            totalTokens++;        
            document.getElementById("total-Tokens").innerHTML = totalTokens;      
                               
            if (url.tokenStatus === "verified"){

                verifiedTokens++;
                document.getElementById("total-Active-Tokens").innerHTML = verifiedTokens;
                      
            }

        }

            const urlRow = document.createElement("tr");
            const urlRowm = document.createElement("tr");
            const urlCell = document.createElement("td");
            const candidateNameCell = document.createElement("td");
            const linkStatusCell = document.createElement("td");
            const tokenStatusCell = document.createElement("td");
            const tokenCreatedAtCell = document.createElement("td");

            urlCell.textContent = url.linkWithToken;
            candidateNameCell.textContent = url.candidateName;
            linkStatusCell.textContent = url.linkStatus;
            tokenStatusCell.textContent = url.tokenStatus;
            tokenCreatedAtCell.textContent = url.createdAt;

            urlRow.appendChild(urlCell);
            urlRow.appendChild(candidateNameCell);
            urlRow.appendChild(linkStatusCell);
            urlRow.appendChild(tokenStatusCell);
            urlRow.appendChild(tokenCreatedAtCell);

            urlRowm.appendChild(candidateNameCell);
            urlRowm.appendChild(tokenStatusCell);
            
            urlTable.appendChild(urlRow);
            urlTablem.appendChild(urlRowm);
            
        });
        urlTableContainer.appendChild(urlTable);
        urlTableContainerm.appendChild(urlTablem);
            
        })
        .catch(error => {
        console.log("Error retrieving URLs from Firebase:", error);
        });
        
         //get the last token generated by the agent
        const agentTokensRef = firebase.database().ref(`agents/${agentId}/tokens`);

         let lastTokenGen = '';
         // Load agent insights and charts
         const agentInsightsContainer = document.getElementById("agentInsights");

        agentTokensRef.orderByChild('timestamp').limitToLast(1).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                // Extract the last token from the snapshot
                const tokenId = Object.keys(snapshot.val())[0];
                const lastToken = snapshot.val()[tokenId];

                lastTokenGen = new Date(lastToken.createdAt).toLocaleString();
                
            agentInsightsContainer.innerHTML = `
              Insights and charts for Agent: <span style="color: red;">${agentName}</span>
              last generated a token at: <span style="color: green;">${lastTokenGen}</span>
            `;
                // agentInsightsContainer.textContent = `Insights and charts for Agent:  ${agentName}` +  `       last generated a token at: ${lastTokenGen}` ;
                
                console.log(`Last Token ID: ${tokenId}`);
                console.log(`Timestamp: ${lastTokenGen}`);
                console.log('Token Data:', lastToken);
            
            } else {
                agentInsightsContainer.textContent = `No tokens found for agent:  ${agentName}`
                console.log('No tokens found for this agent.');
            }

            
        })
        .catch(error => {
            console.error('Error retrieving data from Firebase:', error);
        });

    

    createLinksGeneratedBarChart(agentId);
    createVerifiedFormBarChart(agentId);
    createPieChart(agentId);
    
    }


    // // Firebase Realtime Database reference
    // const agentsRef = firebase.database().ref("agents");
    // const tokenRef = firebase.database().ref("agents/tokens");

    // var totalTokens = 0;
    // var activeTokens = 0;
    // var unverifiedTokens = 0;
    // var verifiedTokens = 0;

    // function displayAgentsByRoles() {
    // // Retrieve agents' data from Firebase
    // agentsRef.once("value")
    //     .then(snapshot => {
    //     const agentsData = snapshot.val();

    //     // Initialize arrays to store agents and staff data
    //     const agents = [];
    //     const staff = [];
    //     const agentm = [];
    //     const staffm = [];

    //     // Group agents based on their roles (agent or staff)
    //     Object.entries(agentsData).forEach(([agentId, agent]) => {
    //         const agentInfo = [agentId, agent.agentName, agent.role];
    //         const agentInfoM = [agentId, agent.agentName, agent.role];
    //         if (agent.role === "agent") {
    //             agents.push(agentInfo);
    //             agentm.push(agentInfoM);
    //         } else if (agent.role === "staff") {
    //             staff.push(agentInfo);
    //             staffm.push(agentInfoM);
    //         }
    //     });

    //     // Initialize DataTables for agents table
    //     const agentsTable = $('#agent').DataTable({
    //         data: agents,
    //         "responsive": true, "lengthChange": false, "autoWidth": false,
    //     });
        
    //     const agentsTableM = $('#agent_mobile').DataTable({
    //         data: agentm,
    //         "responsive": true, "lengthChange": false, "autoWidth": false,
    //     });
    //         agentsTableM.column(0).visible(false);
            

    //     // Initialize DataTables for staff table
    //     const staffTable = $('#staff').DataTable({
    //         data: staff,
    //         "responsive": true, "lengthChange": false, "autoWidth": false,
    //     });
            
    //     const staffTableM = $('#staff_mobile').DataTable({
    //         data: staffm,
    //         "responsive": true, "lengthChange": false, "autoWidth": false,
    //     });
    //         staffTableM.column(0).visible(false);
            

    //     // Add click event listener to agents table cells to show modal with agent ID
    //     $('#agent tbody').on('click', 'td', function () {
    //         const agentId = agentsTable.row($(this).closest('tr')).data()[0];
    //         showModal(agentId);
    //     });
            
    //     $('#agent_mobile tbody').on('click', 'td', function () {
    //         const agentId = agentsTableM.row($(this).closest('tr')).data()[0];
    //         showMeModal(agentId);
    //     });

    //     // Add click event listener to staff table cells to show modal with agent ID
    //     $('#staff tbody').on('click', 'td', function () {
    //         const agentId = staffTable.row($(this).closest('tr')).data()[0];
    //         showModal(agentId);
    //     });
        
    //     $('#staff_mobile tbody').on('click', 'td', function () {
    //         const agentId = staffTableM.row($(this).closest('tr')).data()[0];
    //         showMeModal(agentId);
    //     });

    //     })
    //     .catch(error => {
    //         console.log("Error retrieving agents from Firebase:", error);
    //     });
    // }

    // function showModal(agentId) {
    //     // Replace "myModal" with the ID of your modal element in the HTML
    //     const modalElement = $("#modal-xl");
    //     modalElement.find("modal-body").text(`Agent ID: ${agentId}`);
    //     modalElement.modal("show");
    //     loadAgentURLTable(agentId);
    // }

    // function showMeModal(agentId) {
    //     // Replace "myModal" with the ID of your modal element in the HTML
    //     const modalElement = $("#modal-xl");
    //     modalElement.find("modal-body").text(`Agent ID: ${agentId}`);
    //     modalElement.modal("show");
    //     loadAgentURLTable(agentId);
    //   }


    // displayAgentsByRoles();
  

    // let myLinksGeneratedChart;

    // // Function to create a bar chart for links generated by a selected agent in the last one month
    // function createLinksGeneratedBarChart(agentId) {

    // // Destroy the existing chart if it exists
    // if (myLinksGeneratedChart) {
    //     myLinksGeneratedChart.destroy();
    // }
        
    // // Get the current date
    // const currentDate = new Date();
    // // Set the start date to one month ago
    // const startDate = new Date(currentDate);
    // startDate.setMonth(startDate.getMonth() - 1);
    // startDate.setHours(0, 0, 0, 0);

    // // Initialize an array to store weekly data
    // const weeklyData = [];

    // // Initialize the data object for the chart
    // const chartData = {
    //     labels: [],
    //     datasets: [{
    //     label: 'Links Generated',
    //     data: [],
    //     backgroundColor: 'rgba(54, 162, 235, 0.5)',
    //     borderColor: 'rgba(54, 162, 235, 1)',
    //     borderWidth: 1
    //     }]
    // };

    // // Retrieve the selected agent's data from Firebase
    // agentsRef.child(agentId).once("value")
    //     .then(snapshot => {
    //     const agentData = snapshot.val();

    //     // Loop through each token and check if it was generated within the last month
    //     for (let i = 0; i < 4; i++) {
    //         const startDateOfWeek = new Date(startDate);
    //         startDateOfWeek.setDate(startDateOfWeek.getDate() + (i * 7));
    //         const endDateOfWeek = new Date(startDate);
    //         endDateOfWeek.setDate(endDateOfWeek.getDate() + ((i + 1) * 7));

    //         let linksInWeek = 0;

    //         Object.values(agentData.tokens || {}).forEach(token => {
    //         const tokenDate = new Date(token.createdAt);
            
    //         if (tokenDate >= startDateOfWeek && tokenDate < endDateOfWeek) {
    //             linksInWeek++;
    //         }
    //         });

    //         weeklyData.push(linksInWeek);
    //     }

    //     // Generate the labels for the chart based on the number of weeks
    //     chartData.labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

    //     // Fill the data array for the chart with the weekly data
    //     chartData.datasets[0].data = weeklyData;

    //     // Create the bar chart
    //     const ctx = document.getElementById('chart').getContext('2d');
    //     myLinksGeneratedChart = new Chart(ctx, {
    //         type: 'bar',
    //         data: chartData,
    //         options: {
    //         scales: {
    //             y: {
    //             beginAtZero: true
    //             }
    //         }
    //         }
    //     });
    //     })
    //     .catch(error => {
    //     console.log("Error retrieving agent data from Firebase:", error);
    //     });
    // }

    // let myVerifiedFormChart;

    // // Function to create a bar chart for verified token statuses in the last one month
    // function createVerifiedFormBarChart(agentId) {
    // // Destroy the existing chart if it exists
    // if (myVerifiedFormChart) {
    //     myVerifiedFormChart.destroy();
    // }

    // // Get the current date
    // const currentDate = new Date();
    // // Set the start date to one month ago
    // const startDate = new Date(currentDate);
    // startDate.setMonth(startDate.getMonth() - 1);
    // startDate.setHours(0, 0, 0, 0);

    // // Initialize an array to store weekly data
    // const weeklyData = [];

    // // Initialize the data object for the chart
    // const chartData = {
    //     labels: [],
    //     datasets: [{
    //     label: 'Verified Token Status',
    //     data: [],
    //     backgroundColor: 'rgba(75, 192, 192, 0.5)',
    //     borderColor: 'rgba(75, 192, 192, 1)',
    //     borderWidth: 1
    //     }]
    // };

    // // Retrieve the selected agent's data from Firebase
    // agentsRef.child(agentId).once("value")
    //     .then(snapshot => {
    //     const agentData = snapshot.val();

    //     // Calculate the number of weeks in the last month
    //     const numOfWeeks = Math.ceil((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));

    //     // Loop through each week and count verified token statuses
    //     for (let i = 0; i < numOfWeeks; i++) {
    //         const startDateOfWeek = new Date(startDate);
    //         startDateOfWeek.setDate(startDateOfWeek.getDate() + (i * 7));
    //         const endDateOfWeek = new Date(startDate);
    //         endDateOfWeek.setDate(endDateOfWeek.getDate() + ((i + 1) * 7));

    //         let verifiedCount = 0;

    //         // Loop through each token and count verified tokens in the current week
    //         Object.values(agentData.tokens || {}).forEach(token => {
    //         const tokenDate = new Date(token.createdAt);
    //         if (token.tokenStatus === "verified" && tokenDate >= startDateOfWeek && tokenDate < endDateOfWeek) {
    //             verifiedCount++;
    //         }
    //         });

    //         weeklyData.push(verifiedCount);
    //     }

    //     // Generate the labels for the chart based on the number of weeks
    //     for (let i = 0; i < numOfWeeks; i++) {
    //         chartData.labels.push(`Week ${i + 1}`);
    //     }

    //     // Fill the data array for the chart with the weekly data
    //     chartData.datasets[0].data = weeklyData;

    //     // Create the bar chart
    //     const ctx = document.getElementById('verified-chart').getContext('2d');
    //     myVerifiedFormChart = new Chart(ctx, {
    //         type: 'bar',
    //         data: chartData,
    //         options: {
    //         scales: {
    //             y: {
    //             beginAtZero: true
    //             }
    //         }
    //         }
    //     });
    //     })
    //     .catch(error => {
    //     console.log("Error retrieving agent data from Firebase:", error);
    //     });
    // }

    // let myPieChart;

    // // Function to create a pie chart for tokens distribution of the selected agent
    // function createPieChart(agentId) {

    // // Destroy the existing chart if it exists
    // if (myPieChart) {
    //     myPieChart.destroy();
    // }

    // // Retrieve the selected agent's data from Firebase
    // agentsRef.child(agentId).once("value")
    //     .then(snapshot => {
    //     const agentData = snapshot.val();

    //     // Calculate the number of tokens in each status
    //     let generatedCount = Object.keys(agentData.tokens || {}).length;
    //     let activeCount = 0;
    //     let unverifiedCount = 0;
    //     let verifiedCount = 0;

    //     Object.values(agentData.tokens || {}).forEach(token => {
    //         if (token.tokenStatus === "Active") {
    //         activeCount++;
    //         } else if (token.tokenStatus === "unverified") {
    //         unverifiedCount++;
    //         } else if (token.tokenStatus === "verified") {
    //         verifiedCount++;
    //         }
    //     });

    //     // Calculate the percentages of each token status
    //     const activePercentage = ((activeCount / generatedCount) * 100).toFixed(2);
    //     const unverifiedPercentage = ((unverifiedCount / generatedCount) * 100).toFixed(2);
    //     const verifiedPercentage = ((verifiedCount / generatedCount) * 100).toFixed(2);

    //     // Create the data array for the chart
    //     const chartData = {
    //         labels: ["Active Links: " + activePercentage + "%", "Links Accessed: " + unverifiedPercentage + "%", "Forms Submitted: " + verifiedPercentage + "%", "Generated Count: " + generatedCount],
    //         datasets: [{
    //         data: [activePercentage, unverifiedPercentage, verifiedPercentage],
    //         backgroundColor: [
    //             'rgba(54, 162, 235, 0.5)',
    //             'rgba(255, 206, 86, 0.5)',
    //             'rgba(75, 192, 192, 0.5)',
    //         ],
    //         borderColor: [
    //             'rgba(54, 162, 235, 1)',
    //             'rgba(255, 206, 86, 1)',
    //             'rgba(75, 192, 192, 1)',
    //         ],
    //         borderWidth: 1
    //         }]
    //     };

    //     // Create the pie chart
    //     const ctx = document.getElementById('pie-chart').getContext('2d');
    //     myPieChart = new Chart(ctx, {
    //         type: 'pie',
    //         data: chartData
    //     });
    //     })
    //     .catch(error => {
    //     console.log("Error retrieving agent data from Firebase:", error);
    //     });
    // }

    // // Load URL table for a specific agent
    // function loadAgentURLTable(agentId) {
    // const urlTableContainer = document.getElementById("urlTable");


    // agentsRef.once("value")
    // .then(snapshot => {
    //     const agents = snapshot.val();
    //     let totalFormsSubmitted = 0;

    //     // Convert agents object to an array for sorting
    //     const agentsFormsArray = Object.keys(agents).map(agentId => {
    //       const agent = agents[agentId];
    //       let verifiedFormsSubmitted = 0;

    //       Object.values(agent.tokens || {}).forEach(token => {
    //         if (token.tokenStatus === "verified") {
    //           verifiedFormsSubmitted++;
    //           totalFormsSubmitted++;
    //           //console.log(verifiedFormsSubmitted);
    //         }
    //       });

    //       return {
    //         agentId,
    //         verifiedFormsSubmitted
    //       };
    //     });

    //     // Sort agents by verified forms submitted in descending order
    //     agentsFormsArray.sort((a, b) => b.verifiedFormsSubmitted - a.verifiedFormsSubmitted);

    //     const agentRankFormsSubmitted = agentsFormsArray.findIndex(agent => agent.agentId === agentId);
    //     console.log(`Agent - Rank For Forms Submitted: ${agentRankFormsSubmitted + 1}`);

    //     document.getElementById("total-Unverified-Tokens").innerHTML = 0;

    //     document.getElementById("total-Unverified-Tokens").innerHTML = agentRankFormsSubmitted + 1 + "/" + agentsFormsArray.length;



    //     // Convert agents object to an array for sorting
    //     const agentsArray = Object.keys(agents).map(agentId => {
    //         return {
    //             agentId,
    //             tokensGenerated:  Object.keys(agents[agentId].tokens).length || 0
    //         };
    //     });

    //     // Sort agents by tokens generated in descending order
    //     agentsArray.sort((a, b) => b.tokensGenerated - a.tokensGenerated);

    //     const rank = agentsArray.findIndex(agent => agent.agentId === agentId);
    //     console.log(`Agent - Rank For Tokens Generated: ${rank + 1}`);

    //     document.getElementById("total-Verified-Tokens").innerHTML = 0;

    //     document.getElementById("total-Verified-Tokens").innerHTML = rank + 1 + "/" + agentsArray.length;
        
    // })
    // .catch(error => {
    //     console.log("Error retrieving agents from Firebase:", error);
    // });
    

    // // Clear previous URL table content
    // while (urlTableContainer.firstChild) {
    //     urlTableContainer.firstChild.remove();
    // }
    // //console.log(agentR);
    // // Load agent-specific URL table
    // const agentURLsRef = agentsRef.child(agentId).child("tokens");
    // agentURLsRef.once("value")
    //     .then(snapshot => {
    //     const urls = snapshot.val();

    //     // Generate URL table
    //     const urlTable = document.createElement("table");
    //     urlTable.setAttribute('class','table table-gray text-black'); 
    //     const headerRow = document.createElement("tr");
    //     const headerCell1 = document.createElement("th");
    //     const headerCell2 = document.createElement("th");
    //     const headerCell3 = document.createElement("th");
    //     const headerCell4 = document.createElement("th");

    //     headerCell1.textContent = "Link URL";
    //     headerCell2.textContent = "Candidate Name";
    //     headerCell3.textContent = "Link Status";
    //     headerCell4.textContent = "Token Status";

    //     headerCell1.classList.add('hide-column-mobile');
            
    //     headerRow.appendChild(headerCell1);
    //     headerRow.appendChild(headerCell2);
    //     headerRow.appendChild(headerCell3);
    //     headerRow.appendChild(headerCell4);

    //     urlTable.appendChild(headerRow);

    //     totalTokens = 0;
    //     activeTokens = 0;
    //     unverifiedTokens = 0;
    //     verifiedTokens = 0;

    //     document.getElementById("total-Tokens").innerHTML = 0;
    //     document.getElementById("total-Active-Tokens").innerHTML = 0;
    //     document.getElementById("total-Unverified-Tokens").innerHTML = 0;
    

    //     Object.values(urls).forEach(url => {

    //     if(url){
    //         totalTokens++;        
    //         document.getElementById("total-Tokens").innerHTML = totalTokens;      
                               
    //         if (url.tokenStatus === "verified"){

    //             verifiedTokens++;
    //             document.getElementById("total-Active-Tokens").innerHTML = verifiedTokens;
                      
    //         }

    //     }

    //         const urlRow = document.createElement("tr");
    //         const urlCell = document.createElement("td");
    //         const candidateNameCell = document.createElement("td");
    //         const linkStatusCell = document.createElement("td");
    //         const tokenStatusCell = document.createElement("td");
    //         urlCell.textContent = url.linkWithToken;
    //         candidateNameCell.textContent = url.candidateName;
    //         linkStatusCell.textContent = url.linkStatus;
    //         tokenStatusCell.textContent = url.tokenStatus;

    //         urlCell.classList.add('hide-column-mobile');

    //         urlRow.appendChild(urlCell);
    //         urlRow.appendChild(candidateNameCell);
    //         urlRow.appendChild(linkStatusCell);
    //         urlRow.appendChild(tokenStatusCell);

    //         urlTable.appendChild(urlRow);
            
    //     });
        
    //         urlTableContainer.appendChild(urlTable);
    //     })
    //     .catch(error => {
    //     console.log("Error retrieving URLs from Firebase:", error);
    //     });

    // // Load agent insights and charts
    // const agentInsightsContainer = document.getElementById("agentInsights");
    // agentInsightsContainer.textContent = `Insights and charts for Agent ${agentId}`;

    // createLinksGeneratedBarChart(agentId);
    // createVerifiedFormBarChart(agentId);
    // createPieChart(agentId);
    // }
