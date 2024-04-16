let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});



fetch('/api/cases')
    .then(response => response.json())
    .then(data => {
        const caseTable = document.getElementById('caseTable');
        const tbody = caseTable.querySelector('tbody');

        const totalCases = document.getElementById('totalCases');
        const pendingCases = document.getElementById('pendingCases');
        const solvedCases = document.getElementById('solvedCases');
        const runningCases = document.getElementById('runningCases');

        totalCases.innerHTML = `<h3>Registered Cases</h3><p>${data.length}</p>`;

        const pendingCount = data.filter(caseItem => caseItem.caseStatus[0] === 'Pending').length;
        const solvedCount = data.filter(caseItem => caseItem.caseStatus[0] === 'Solved').length;
        const runningCount = data.filter(caseItem => caseItem.caseStatus[0] === 'Running').length;

        pendingCases.innerHTML = `<h3>Pending Cases</h3><p>${pendingCount}</p>`;
        solvedCases.innerHTML = `<h3>Solved Cases</h3><p>${solvedCount}</p>`;
        runningCases.innerHTML = `<h3>Running Cases</h3><p>${runningCount}</p>`;

        data.forEach(caseItem => {
            const row = document.createElement('tr');

            const cin = document.createElement('td');
            cin.textContent = caseItem.cin;
            row.appendChild(cin);

            const defendantName = document.createElement('td');
            defendantName.textContent = caseItem.defendantName;
            row.appendChild(defendantName);

            const crimeType = document.createElement('td');
            crimeType.textContent = caseItem.crimeType.join(", ");
            row.appendChild(crimeType);

            const dateCommitted = document.createElement('td');
            dateCommitted.textContent = new Date(caseItem.dateCommitted).toDateString();
            row.appendChild(dateCommitted);

            const caseStatus = document.createElement('td');
            caseStatus.textContent = caseItem.caseStatus;
            row.appendChild(caseStatus);

            const judgeAssigned = document.createElement('td');
            judgeAssigned.textContent = caseItem.judgeAssigned;
            row.appendChild(judgeAssigned);

            const lawyer = document.createElement('td');
            lawyer.textContent = caseItem.lawyer;
            row.appendChild(lawyer);

            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching cases:', error));



document.addEventListener('DOMContentLoaded', () => {
    loadCases();
    document.getElementById('searchInput').addEventListener('keyup', searchCases);
});

async function loadCases() {
    try {
        const response = await fetch('/api/cases');
        const data = await response.json();

        const caseList = document.getElementById('caseList');
        caseList.innerHTML = '';

        const totalCases = document.getElementById('totalCases');
        const pendingCases = document.getElementById('pendingCases');
        const solvedCases = document.getElementById('solvedCases');
        const runningCases = document.getElementById('runningCases');

        totalCases.innerHTML = `<h3>Registered Cases</h3><p>${data.length}</p>`;

        const pendingCount = data.filter(caseItem => caseItem.caseStatus[0] === 'Pending').length;
        const solvedCount = data.filter(caseItem => caseItem.caseStatus[0] === 'Solved').length;
        const runningCount = data.filter(caseItem => caseItem.caseStatus[0] === 'Running').length;

        pendingCases.innerHTML = `<h3>Pending Cases</h3><p>${pendingCount}</p>`;
        solvedCases.innerHTML = `<h3>Solved Cases</h3><p>${solvedCount}</p>`;
        runningCases.innerHTML = `<h3>Running Cases</h3><p>${runningCount}</p>`;




        // Sort the data by start date
        data.sort((a, b) => new Date(a.dateCommitted) - new Date(b.dateCommitted));

        data.forEach(caseItem => {
            if (caseItem.caseStatus == 'Solved' || 'Running' || 'Pending') {
                const caseBlock = document.createElement('div');
                caseBlock.className = 'case-block';
                caseBlock.dataset.caseId = caseItem._id;
                caseBlock.innerHTML = `
                    <h2>${caseItem.cin}</h2>
                    <p>Start Date: ${caseItem.dateCommitted.split('T')[0]}</p>
                `;
                caseList.appendChild(caseBlock);

                caseBlock.addEventListener('click', () => {
                    displayCaseDetails(caseItem);
                });
            }
        });
    } catch (error) {
        console.error('Error fetching solved cases:', error);
    }
}



app.post('/api/resetCount', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Register.findOneAndUpdate(
            { email: email, loginType: 'lawyer' },
            { $set: { count: 0 } },
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ success: true, message: 'Count reset successfully', count: user.count });
    } catch (error) {
        console.error('Error resetting count:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function fetchCases() {
    try {
        const response = await fetch('/api/cases');
        const data = await response.json();



        const caseList = document.getElementById('caseList');
        if (!caseList) {
            console.error('Error: caseList is null');
            return;
        }

        caseList.innerHTML = ''; // Clear existing content

        data.forEach(caseItem => {
            const caseBlock = document.createElement('div');
            caseBlock.className = 'case-block';
            caseBlock.dataset.caseId = caseItem._id;
            caseBlock.innerHTML = `
                <h2>${caseItem.cin}</h2>
                <p>Defendant Name: ${caseItem.defendantName}</p>
            `;
            caseList.appendChild(caseBlock);

            caseBlock.addEventListener('click', () => {
                displayCaseDetails(caseItem);
            });
        });
    } catch (error) {
        console.error('Error fetching cases:', error);
    }
}

async function searchCases() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const searchBy = document.getElementById('searchBy').value;

    const response = await fetch('/api/cases');
    const data = await response.json();

    const caseList = document.getElementById('caseList');
    if (!caseList) {
        console.error('Error: caseList is null');
        return;
    }

    const filteredCases = data.filter(caseItem => {
        if (searchBy === 'crimeType') {
            return caseItem.crimeType.includes(searchTerm);
        } else {
            const property = caseItem[searchBy];
            return typeof property === 'string' && property.toLowerCase().includes(searchTerm);
        }
    });

    caseList.innerHTML = '';

    filteredCases.forEach(caseItem => {
        const caseBlock = document.createElement('div');
        caseBlock.className = 'case-block';
        caseBlock.dataset.caseId = caseItem._id;

        let displayText = '';
        if (searchBy === 'crimeType') {
            displayText = `Crime Type: ${caseItem.crimeType.join(', ')}`;
        } else {
            displayText = `${searchBy}: ${caseItem[searchBy]}`;
        }

        caseBlock.innerHTML = `
            <h2>${caseItem.cin}</h2>
            <p>${displayText}</p>
        `;

        caseList.appendChild(caseBlock);

        caseBlock.addEventListener('click', () => {
            displayCaseDetails(caseItem);
        });
    });
}



function displayCaseDetails(caseItem) {
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
            <h2> ${caseItem.cin}</h2>
            <p>${caseItem.dateCommitted.split('T')[0]}</p>
            <p>Delivered Date: ${caseItem.dateOfArrest.split('T')[0]}</p>
            <p>Attending Judge: ${caseItem.judgeAssigned}</p>
            <h2>${caseItem.defendantName}</h2>
            <p><span class="cin">CIN: ${caseItem.cin}</span></p>
            <p>Crime Type: ${caseItem.crimeType.join(', ')}</p>
            <p>Date Committed: ${new Date(caseItem.dateCommitted).toLocaleDateString()}</p>
            <p>Case Status: ${caseItem.caseStatus}</p>
            <p>Lawyer: ${caseItem.lawyer}</p>
            <p>Public Prosecutor: ${caseItem.publicProsecutor}</p>
        `;

    for (let i = 0; i < caseItem.hearings.length; i++) {
        const hearing = caseItem.hearings[i];
        detailsContent.innerHTML += `
                <h3>Hearing ${i + 1}</h3>
                <p>Date: ${new Date(hearing.hearingDate).toLocaleDateString()}</p>
                <p>Slot: ${hearing.hearingSlot}</p>
                <p>Adjourned Reason: ${hearing.adjorned_Reason}</p>
                <p>Summary: ${hearing.summary}</p>
            `;
    }

    detailsContent.innerHTML += `
            <p>Judgement Summary: ${caseItem.judgement}</p>
        `;

    const caseDetails = document.getElementById('caseDetails');
    caseDetails.style.display = 'block';

    const closeDetails = document.getElementById('closeDetails');
    closeDetails.addEventListener('click', () => {
        caseDetails.style.display = 'none';
    });
    const downloadPdfBtn = document.getElementById('downloadPdf');
    downloadPdfBtn.addEventListener('click', () => {
        downloadPdf(caseItem);
    });
}

function downloadPdf(caseItem) {
    const content = document.getElementById('detailsContent').innerHTML;
    const opt = {
        margin:       1,
        filename:     `${caseItem.cin}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
}

// Update the search function based on the selected option
function updateSearchFunction() {
    const searchBy = document.getElementById('searchBy').value;

    switch (searchBy) {
        case 'cin':
            searchFunction = () => searchCases('cin', 'Defendant Name');
            break;
        case 'crimeType':
            searchFunction = () => searchCases('crimeType', 'Crime Type');
            break;
        case 'lawyer':
            searchFunction = () => searchCases('lawyer', 'Lawyer');
            break;
        case 'judgeAssigned':
            searchFunction = () => searchCases('judgeAssigned', 'Judge');
            break;
        default:
            searchFunction = () => searchCases('cin', 'Defendant Name');
            break;
    }
}

// Function to perform the search
function performSearch() {
    updateSearchFunction();
    searchFunction();
}




