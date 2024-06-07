import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "gs://recruitmentmanagement-15313.appspot.com"
};
initializeApp(firebaseConfig);

const db = getDatabase();

onValue(ref(db, 'interviews'), (snapshot) => {
    const data = snapshot.val();
    const dataTableBody = document.getElementById('interviews-table').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = ''; // Clear existing content

    // Loop through each key-value pair in data
    for (let key in data) {
        let row = dataTableBody.insertRow();
        let cellTitle = row.insertCell(0);
        let cellName = row.insertCell(1);
        let cellRole = row.insertCell(2);
        let cellStatus = row.insertCell(3);
        let cellApply = row.insertCell(4);

        // Create an anchor element for the "View" link
        let applyLink = document.createElement('a');
        applyLink.textContent = 'View';
        applyLink.href = `viewApplication.html?applicationId=${encodeURIComponent(key)}`;
        applyLink.target = '_blank';

        cellApply.appendChild(applyLink);

        // Set content for each cell using data[key] properties
        cellName.textContent = data[key].userName;
        cellRole.textContent = data[key].roleName;
        cellStatus.textContent = data[key].applicationStatus;
        cellTitle.textContent = '*'
        console.log("Job Title: " + data[key].userName);
    }
});
// Function to generate report
function generateReport() {
    // Retrieve data from Firebase or any other data source
    const interviewsData = []; // Assuming you have an array of interview data

    // Create a CSV string to represent the report
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add column headers to the CSV content
    csvContent += "Applicant Name, Interviewer Name, Interview Date, Interview Time\n";

    // Loop through each interview data and add it to the CSV content
    interviewsData.forEach(interview => {
        csvContent += `${interview.applicantName},${interview.interviewerName},${interview.interviewDate},${interview.interviewTime}\n`;
    });

    // Encode CSV content to URI format
    const encodedUri = encodeURI(csvContent);

    // Create a temporary link element to download the CSV file
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "interview_report.csv");
    document.body.appendChild(link);

    // Trigger the click event to initiate the download
    link.click();
}

// Example usage:
// Attach the generateReport() function to the "Generate Report" button in your HTML code


