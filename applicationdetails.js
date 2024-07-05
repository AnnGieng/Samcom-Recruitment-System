import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app"
};

initializeApp(firebaseConfig)
const db = getDatabase();
var applicationId;

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    applicationId = urlParams.get('applicationId');
    if (applicationId) {
        console.log('Application Id is ' + applicationId);
        getApplicationDetails(applicationId)
    } else {
        console.log('Application Id is null');
    }
});

function getApplicationDetails(id) {
    onValue(ref(db, "application/" + id), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(`Date is ${data.interviewDate}`);
            document.getElementById('time').textContent = "Time: " + data.interviewTime;
            document.getElementById('date').textContent = "Date: " + data.interviewDate;
            document.getElementById('interviewType').textContent = "Interview type: " + data.interviewType;
            if (data.interviewType == 'online') {
                document.getElementById('meetingLink').textContent = "Google meet link: " + data.googleMeetLink;;
            } else {
                document.getElementById('meetingLink').textContent = "Google Map link: " + data.googleMapsLink;
            }
        } else {
            console.log(`Data is null`);
        }
    });
}
