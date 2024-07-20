import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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

initializeApp(firebaseConfig);
const db = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    const uid = localStorage.getItem('auth-token');

    if (uid) {
        const applicationsRef = ref(db, 'applications');
        onValue(applicationsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                console.log('No applications found.');
                return;
            }

            let profileData = null;
            for (let key in data) {
                if (data[key].userId === uid) {
                    profileData = data[key];
                    break;
                }
            }

            if (profileData) {
                document.getElementById('profile-name').textContent = profileData.userName;
                document.getElementById('profile-age').textContent = profileData.age;
                document.getElementById('profile-address').textContent = profileData.address;
                document.getElementById('profile-phone').textContent = profileData.phone;
                document.getElementById('profile-gender').textContent = profileData.gender;
                document.getElementById('profile-email').textContent = profileData.email;
                document.getElementById('profile-grad-degree').textContent = profileData.gradDegree;
                document.getElementById('profile-grad-percentage').textContent = profileData.gradPercentage;
                document.getElementById('profile-grad-diploma').textContent = profileData.gradDiploma;
                document.getElementById('profile-college-percentage').textContent = profileData.collegePercentage;
                document.getElementById('profile-designation').textContent = profileData.designation;
                document.getElementById('profile-total-years-of-experience').textContent = profileData.totalYears;
                document.getElementById('profile-skills').textContent = profileData.skills;
                document.getElementById('profile-cv').textContent = 'Uploaded';
            } else {
                console.log('No profile data found for this user.');
            }
        });
    } else {
        console.log('User ID not found in localStorage.');
    }

    // Edit button event listener
    document.getElementById('edit-button').addEventListener('click', function() {
        window.location.href = 'apply.html?edit=true';
    });
});
