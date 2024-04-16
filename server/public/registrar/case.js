// window.onload = async function() {
//     try {
//         const response = await fetch('/add_case');
//         const data = await response.json();
//         const cinInput = document.getElementById("cin");
//         cinInput.value = data.cin;
//     } catch (error) {
//         console.error("Error fetching CIN:", error);
//     }
// };

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cin = urlParams.get('cin');
    document.getElementById('cin').value = cin;
};