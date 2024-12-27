// app.js

// Connecting to the blockchain and contract
let web3;
let votingContract;

const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract address
const contractABI = [
    // Replace with your contract ABI
];

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        console.log("Connected account:", accounts[0]);
        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        loadCandidates();
    } else {
        alert("Please install MetaMask to use this application.");
    }
};

// Load candidates into the dropdown
async function loadCandidates() {
    try {
        const candidatesCount = await votingContract.methods.candidatesCount().call();
        const candidateList = document.getElementById("candidateList");

        for (let i = 1; i <= candidatesCount; i++) {
            const candidate = await votingContract.methods.candidates(i).call();
            const option = document.createElement("option");
            option.value = candidate.id;
            option.text = candidate.name;
            candidateList.add(option);
        }
    } catch (error) {
        console.error("Error loading candidates:", error);
    }
}

// Register voter
document.getElementById("registerBtn").onclick = async () => {
    const voterAddress = document.getElementById("voterAddress").value;
    try {
        await votingContract.methods.authorizeVoter(voterAddress).send({ from: (await web3.eth.getAccounts())[0] });
        document.getElementById("registerMessage").innerText = "Voter registered successfully!";
    } catch (error) {
        console.error("Error registering voter:", error);
    }
};

// Vote for a candidate
document.getElementById("voteBtn").onclick = async () => {
    const candidateId = document.getElementById("candidateList").value;
    try {
        await votingContract.methods.vote(candidateId).send({ from: (await web3.eth.getAccounts())[0] });
        document.getElementById("voteMessage").innerText = "Vote cast successfully!";
    } catch (error) {
        console.error("Error casting vote:", error);
    }
};

// View results
document.getElementById("resultsBtn").onclick = async () => {
    const resultsDisplay = document.getElementById("resultsDisplay");
    resultsDisplay.innerHTML = ""; // Clear previous results

    try {
        const candidatesCount = await votingContract.methods.candidatesCount().call();
        for (let i = 1; i <= candidatesCount; i++) {
            const candidate = await votingContract.methods.candidates(i).call();
            const result = document.createElement("p");
            result.innerText = `${candidate.name}: ${candidate.voteCount} votes`;
            resultsDisplay.appendChild(result);
        }
    } catch (error) {
        console.error("Error fetching results:", error);
    }
};
