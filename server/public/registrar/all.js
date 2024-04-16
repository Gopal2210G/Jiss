document.addEventListener('DOMContentLoaded', () => {
    loadCases();

    document.getElementById('searchInput').addEventListener('input', filterCases);
    const detailsContainer = document.getElementById('caseDetails');
    detailsContainer.addEventListener('dragstart', dragStart);
    detailsContainer.addEventListener('dragend', dragEnd);
});

async function loadCases() {
    try {
        const response = await fetch('/api/cases');
        const data = await response.json();

        const caseList = document.getElementById('caseList');
        caseList.innerHTML = ''; 

        data.forEach(caseItem => {
            const caseBlock = document.createElement('div');
            caseBlock.classList.add('case-block');
            caseBlock.innerHTML = `
                <h2>${caseItem.defendantName}</h2>
                <p><span class="cin">CIN: ${caseItem.cin}</span></p>
            `;

            caseBlock.addEventListener('click', () => showCaseDetails(caseItem));
            caseList.appendChild(caseBlock);
        });
    } catch (error) {
        console.error('Error loading cases:', error);
    }
}

function filterCases() {
    const searchValue = document.getElementById('searchInput').value.toUpperCase();
    const caseBlocks = document.querySelectorAll('.case-block');

    caseBlocks.forEach(caseBlock => {
        const cin = caseBlock.querySelector('.cin').textContent.toUpperCase();

        if (cin.includes(searchValue)) {
            caseBlock.style.display = '';
        } else {
            caseBlock.style.display = 'none';
        }
    });
}

function showCaseDetails(caseItem) {
    const detailsContainer = document.getElementById('caseDetails');
    detailsContainer.innerHTML = `
        <h2>${caseItem.defendantName}</h2>
        <p><span class="cin">CIN: ${caseItem.cin}</span></p>
        <p>Crime Type: ${caseItem.crimeType.join(', ')}</p>
        <p>Date Committed: ${new Date(caseItem.dateCommitted).toLocaleDateString()}</p>
        <p>Case Status: ${caseItem.caseStatus}</p>
        <p>Judge Assigned: ${caseItem.judgeAssigned}</p>
        <p>Lawyer: ${caseItem.lawyer}</p>
        <p>Public Prosecutor: ${caseItem.publicProsecutor}</p>
    `;

    detailsContainer.setAttribute('draggable', 'true');
}

function dragStart(e) {
    this.style.opacity = '0.5';
}

function dragEnd(e) {
    this.style.opacity = '1';
}


document.addEventListener('DOMContentLoaded', () => {
    loadCases();

    document.getElementById('searchInput').addEventListener('input', filterCases);
    const detailsContainer=documents.getElementById('caseDetails');
    detailsContainer.addEventListener('dragstart',dragStart);
    detailsContainer.addEventListener('dragend',dragEnd);
});

async function loadCases() {
    try {
        const response = await fetch('/api/cases');
        const data = await response.json();

        const caseList = document.getElementById('caseList');
        caseList.innerHTML = '';  

        data.forEach(caseItem => {
            const caseBlock = document.createElement('div');
            caseBlock.classList.add('case-block');
            caseBlock.innerHTML = `
                <h2>${caseItem.lawyer}</h2>
                <p><span class="cin">CIN: ${caseItem.cin}</span></p>
            `;

            caseBlock.addEventListener('click', () => showCaseDetails(caseItem));
            caseList.appendChild(caseBlock);
        });
    } catch (error) {
        console.error('Error loading cases:', error);
    }
}

function filterCases() {
    const searchValue = document.getElementById('searchInput').value.toUpperCase();
    const caseBlocks = document.querySelectorAll('.case-block');

    caseBlocks.forEach(caseBlock => {
        const cin = caseBlock.querySelector('.cin').textContent.toUpperCase();

        if (cin.includes(searchValue)) {
            caseBlock.style.display = '';
        } else {
            caseBlock.style.display = 'none';
        }
    });
}

function showCaseDetails(caseItem) {
    const detailsContainer = document.getElementById('caseDetails');
    detailsContainer.innerHTML = `
        <h2>${caseItem.defendantName}</h2>
        <p><span class="cin">CIN: ${caseItem.cin}</span></p>
        <p>Crime Type: ${caseItem.crimeType.join(', ')}</p>
        <p>Date Committed: ${new Date(caseItem.dateCommitted).toLocaleDateString()}</p>
        <label>
            Case Status: 
            <select id="caseStatus">
                <option value="Solved" ${caseItem.caseStatus === 'Solved' ? 'selected' : ''}>Solved</option>
                <option value="Running" ${caseItem.caseStatus === 'Running' ? 'selected' : ''}>Running</option>
                <option value="Pending" ${caseItem.caseStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            </select>
        </label><br>
        <label>
            Judge Assigned: 
            <input type="text" id="judgeAssigned" value="${caseItem.judgeAssigned}">
        </label><br>
        <label>
            Lawyer: 
            <input type="text" id="lawyer" value="${caseItem.lawyer}">
        </label><br>
        <label>
            Public Prosecutor: 
            <input type="text" id="publicProsecutor" value="${caseItem.publicProsecutor}">
        </label><br>
        <label>
            Judgement:
            <input type="text" id="judgement" value="${caseItem.judgement}">
        </label><br>
        <button onclick="editCase('${caseItem._id}')">Edit</button> <!-- Edit button -->
    `;

    // Enable drag for the details container
    detailsContainer.setAttribute('draggable', 'true');
}

async function editCase(caseId) {
    const caseStatus = document.getElementById('caseStatus').value;
    const judgeAssigned = document.getElementById('judgeAssigned').value;
    const lawyer = document.getElementById('lawyer').value;
    const publicProsecutor = document.getElementById('publicProsecutor').value;
    const judgement = document.getElementById('judgement').value;

    try {
        const response = await fetch(`/api/cases/${caseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ caseStatus, judgeAssigned, lawyer, publicProsecutor, judgement })
        });

        if (response.ok) {
            const updatedCase = await response.json();
            showCaseDetails(updatedCase);
            loadCases(); 
            alert('Case updated successfully');
        } else {
            console.error('Failed to edit case:', response.statusText);
        }
    } catch (error) {
        console.error('Error editing case:', error);
    }
}
function dragStart(e){
    this.style.opacity='0.5';
}



