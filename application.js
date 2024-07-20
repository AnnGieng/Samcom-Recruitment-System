import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app"
};

initializeApp(firebaseConfig);
const db = getDatabase();

onValue(ref(db, 'applications'), (snapshot) => {
    const data = snapshot.val();
    const dataTableBody = document.getElementById('applications-table').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = ''; // Clear existing content

    if (data) {
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
            cellTitle.textContent = '*';
            console.log("Applicant Name: " + data[key].userName);
        }
    } else {
        console.error("No data available");
    }
}, (error) => {
    console.error("Error fetching data: ", error);
});
