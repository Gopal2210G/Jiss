
async function init() {
    try {
        const response = await fetch('/api/cases');
        const data = await response.json();
        const cases = data.map(c => ({ cin: c.cin }));

        const caseIdDropdown = document.getElementById('caseId');
        cases.forEach(c => {
            const option = document.createElement('option');
            option.value = c.cin;
            option.textContent = c.cin;
            caseIdDropdown.appendChild(option);
        });
        updateSlots();
    } catch (error) {
        console.error('Error initializing the page:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfiles();
    check_upcoming();
});


async function loadUpcomingHearings() {
    try {
        const response = await fetch('/api/upcomingHearings');
        const data = await response.json();

        const upcomingHearingsContainer = document.getElementById('upcomingHearings');
        upcomingHearingsContainer.innerHTML = ''; 
        const heading = document.createElement('h2');
        heading.textContent = 'Upcoming Hearings';
        upcomingHearingsContainer.appendChild(heading);

        const list = document.createElement('ul');

        data.forEach(hearing => {
            const listItem = document.createElement('li');
            listItem.textContent = `Case ID: ${hearing.caseId}, Date: ${hearing.hearingDate}, Slot: ${hearing.hearingSlot}`;
            list.appendChild(listItem);
        });

        upcomingHearingsContainer.appendChild(list);
    } catch (error) {
        console.error('Error loading upcoming hearings:', error);
    }
}


async function check_upcoming() {
    try {
        const response = await fetch('/api/upcomingHearings');
        const data = await response.json();

        if (data.length > 0) {
            let message = 'Upcoming hearings:\n';
            data.forEach(caseItem => {
                caseItem.hearings.forEach(hearing => {
                    if (new Date(hearing.hearingDate) >= new Date()) {
                        message += `- Case ID: ${caseItem.cin}, Hearing Date: ${new Date(hearing.hearingDate).toLocaleDateString()}\n`;
                    }
                });
            });
            alert(message);
        } else {
            alert('No upcoming hearings found.');
        }
    } catch (error) {
        console.error('Error checking upcoming hearings:', error);
    }
}

async function updateSlots() {
    try {
        const caseId = document.getElementById('caseId').value;
        const hearingDate = document.getElementById('hearingDate').value;

        const response = await fetch(`/api/scheduledHearings?hearingDate=${hearingDate}`);
        const scheduledHearings = await response.json();


        const allSlots = ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM'];

        const availableSlots = allSlots.filter(slot => !scheduledHearings.includes(slot));

        const hearingSlotDropdown = document.getElementById('hearingSlot');
        hearingSlotDropdown.innerHTML = '';  

        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            hearingSlotDropdown.appendChild(option);
        });


        allSlots.forEach(slot => {
            const option = hearingSlotDropdown.querySelector(`option[value="${slot}"]`);
            if (!availableSlots.includes(slot)) {
                option.classList.add('option-unavailable');
            } else {
                option.classList.remove('option-unavailable');
            }
        });
    } catch (error) {
        console.error('Error updating slots:', error);
    }
}

async function scheduleHearing() {
    try {
        const caseId = document.getElementById('caseId').value;
        const hearingDate = document.getElementById('hearingDate').value;
        const hearingSlot = document.getElementById('hearingSlot').value;
        const adjornedReason = document.getElementById('adjornedReason').value;
        const summary = document.getElementById('summary').value;

        // Send data to the server to schedule hearing
        const response = await fetch('/api/scheduleHearing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                caseId,
                hearingDate,
                hearingSlot,
                adjornedReason,
                summary
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(`Hearing scheduled for ${caseId} on ${hearingDate} at ${hearingSlot}`);
            updateSlots();  // Update slots after scheduling
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error scheduling hearing:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    init();
    document.getElementById('upcoming').addEventListener('click', check_upcoming);
});