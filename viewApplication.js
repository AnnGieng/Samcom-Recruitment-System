import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app",
};

initializeApp(firebaseConfig);

const db = getDatabase();
const storage = getStorage();

const urlParams = new URLSearchParams(window.location.search);
const applicationId = urlParams.get('applicationId');

get(ref(db, `application/${applicationId}`)).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById('applicant-details').innerHTML = `
            <p><strong>Name:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Occupation:</strong> ${data.roleName}</p>
            <p><strong>Description:</strong> ${data.details}</p>
        `;

        get(ref(db, `jobs/${data.roleId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const jobData = snapshot.val()
                    document.getElementById('job-details').innerHTML = `
                    <p><strong>experienceDescription:</strong>${jobData.experienceDescription}</p>
                    <p><strong>expectationDescription:</strong>${jobData.expectationDescription}</p>
                    `;
                }
            })



        const downloadCvButton = document.getElementById('download-cv');
        downloadCvButton.addEventListener('click', () => {
            getDownloadURL(storageRef(storage, `cv/${data.cvFileName}`))
                .then((url) => {
                    window.open(url, '_blank');
                })
                .catch((error) => {
                    console.error("Error downloading CV: ", error);
                });
        });

        document.getElementById('approve').onclick = () => {
            document.getElementById('interview-section').style.display = 'block';
        };

        document.getElementById('submit-interview').onclick = () => {
            const interviewDate = document.getElementById('interview-date').value;
            if (interviewDate) {
                update(ref(db, `application/${applicationId}`), {
                    interviewDate: interviewDate,
                    applicationStatus: 'Interview Scheduled'
                }).then(() => {
                    alert('Interview date set successfully.');
                    document.getElementById('interview-section').style.display = 'none';
                }).catch((error) => {
                    console.error("Error updating interview date: ", error);
                });
            } else {
                alert('Please select a date.');
            }
        };
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error("Error fetching data: ", error);
});
