let web3;
let votingContract;
let account;
let isAdmin = false;

const contractABI = [ /* Paste full ABI after compilation */ ];
const contractAddress = "0x..."; // Will be updated after deployment

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
    } else {
        alert("Please install MetaMask!");
    }
}

async function connectWallet() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];
        document.getElementById('account').innerHTML = `Connected: ${account.substring(0,6)}...${account.substring(38)}`;
        
        // Load contract (update address after deployment)
        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        
        document.getElementById('connect-section').classList.add('hidden');
        document.getElementById('voting-section').classList.remove('hidden');
        
        loadCandidates();
        checkAdmin();
    } catch (error) {
        console.error(error);
    }
}

async function loadCandidates() {
    const count = await votingContract.methods.getCandidatesCount().call();
    const list = document.getElementById('candidates-list');
    list.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const [name, votes] = await votingContract.methods.getCandidate(i).call();
        const div = document.createElement('div');
        div.className = 'candidate';
        div.innerHTML = `
            <span><strong>${name}</strong> - ${votes} votes</span>
            <button onclick="castVote(${i})">Vote</button>
        `;
        list.appendChild(div);
    }
}

async function castVote(index) {
    try {
        await votingContract.methods.vote(index).send({ from: account });
        alert("Vote cast successfully!");
        loadCandidates();
    } catch (err) {
        alert(err.message);
    }
}

async function checkAdmin() {
    const admin = await votingContract.methods.admin().call();
    if (account.toLowerCase() === admin.toLowerCase()) {
        isAdmin = true;
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    }
}

// Add event listeners for admin buttons
document.getElementById('start-voting').addEventListener('click', async () => {
    await votingContract.methods.startVoting().send({from: account});
    alert("Voting started!");
});

document.getElementById('end-voting').addEventListener('click', async () => {
    await votingContract.methods.endVoting().send({from: account});
    alert("Voting ended!");
});

window.onload = init;
