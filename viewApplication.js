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

if (applicationId) {
    // Fetch applicant details
    get(ref(db, `applications/${applicationId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById('applicant-details').innerHTML = `
            <p><strong>Name:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Occupation:</strong> ${data.roleName}</p>
            <p><strong>Skills:</strong> ${data.description}</p>
            <p><strong>Age:</strong> ${data.age}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Phone Number:</strong> ${data.phone}</p>
            <p><strong>Gender:</strong> ${data.gender}</p>
            <p><strong>Graduation Degree:</strong> ${data.gradDegree}</p>
            <p><strong>Graduation Percentage:</strong> ${data.gradPercentage}</p>
            <p><strong>Graduation Diploma:</strong> ${data.gradDiploma}</p>
            <p><strong>College Percentage:</strong> ${data.collegePercentage}</p>
            <p><strong>Total Years of Experience:</strong> ${data.totalYears}</p>
            <p><strong>Designation:</strong> ${data.designation}</p>
            <p><strong>CV:</strong> ${data.cvUrl ? 'Uploaded' : 'Not Uploaded'}</p>
        `;

            // Fetch job details
            get(ref(db, `jobs/${data.roleId}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const jobData = snapshot.val();
                        document.getElementById('job-details').innerHTML = `
                            
                        `;
                    }
                })
                .catch((error) => {
                    console.error("Error fetching job details: ", error);
                });

            // Handle CV download
            const downloadCvButton = document.getElementById('download-cv');
            downloadCvButton.addEventListener('click', () => {
                window.open(data.cvUrl, '_blank');
            });

            // Handle application approval
            document.getElementById('approve').onclick = () => {
                document.getElementById('interview-section').style.display = 'block';
            };

            // Handle interview submission
            document.getElementById('submit-interview').onclick = () => {
                const interviewDate = document.getElementById('interview-date').value;
                const interviewTime = document.getElementById('interview-time').value;
                const interviewType = document.querySelector('input[name="interview-type"]:checked').value;
                const interviewLink = interviewType === 'online' 
                    ? document.getElementById('google-meet-link').value
                    : document.getElementById('google-map-link').value;

                if (interviewDate && interviewTime) {
                    update(ref(db, `applications/${applicationId}`), {
                        interviewDate: interviewDate,
                        interviewTime: interviewTime,
                        interviewType: interviewType,
                        interviewLink: interviewLink,
                        applicationStatus: 'Interview Scheduled'
                    }).then(() => {
                        alert('Interview details updated successfully.');
                        document.getElementById('interview-section').style.display = 'none';
                    }).catch((error) => {
                        console.error("Error updating interview details: ", error);
                    });
                } else {
                    alert('Please select both date and time.');
                }
            };
        } else {
            console.log("No data available for the application ID.");
        }
    }).catch((error) => {
        console.error("Error fetching applicant data: ", error);
    });
} else {
    console.error("No application ID found in the URL.");
}
