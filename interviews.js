import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
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

    onValue(ref(db, 'application'), (snapshot) => {
        const data = snapshot.val();
        const dataTableBody = document.getElementById('interviews-table').getElementsByTagName('tbody')[0];
        dataTableBody.innerHTML = ''; // Clear existing content

        for (let key in data) {
            if (data[key].applicationStatus === 'Interview Scheduled') {
                let row = dataTableBody.insertRow();
                let cellName = row.insertCell(0);
                let cellInterviewer = row.insertCell(1);
                let cellDate = row.insertCell(2);
                let cellTime = row.insertCell(3);
                let cellAction = row.insertCell(4);

                cellName.textContent = data[key].userName;
                cellInterviewer.textContent = data[key].interviewer || 'N/A';
                cellDate.textContent = data[key].interviewDate;
                cellTime.textContent = data[key].interviewTime;

                let editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('btn', 'btn-primary');
                editButton.addEventListener('click', () => {
                    window.location.href = `edit_interview.html?applicationId=${key}`;
                });
                cellAction.appendChild(editButton);
            }
        }
    });

    document.getElementById('generate-report').addEventListener('click', generateReport);

    function generateReport() {
        const dataRef = ref(db, 'application');
        get(dataRef).then((snapshot) => {
            const data = snapshot.val();
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Applicant Name,Interviewer Name,Interview Date,Interview Time\n";

            for (let key in data) {
                if (data[key].applicationStatus === 'Interview Scheduled') {
                    const interview = data[key];
                    csvContent += `${interview.userName},${interview.interviewer || 'N/A'},${interview.interviewDate},${interview.interviewTime}\n`;
                }
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "interview_report.csv");
            document.body.appendChild(link);
            link.click();
        }).catch((error) => {
            console.error("Error generating report: ", error);
        });
    }
});
