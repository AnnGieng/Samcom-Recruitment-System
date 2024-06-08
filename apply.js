import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

var fileItem;
var fileName;

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
const storage = getStorage();

var jobId;
var jobTitle;
var userId;

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    jobTitle = urlParams.get('jobTitle');
    jobId = urlParams.get('id');
    userId = urlParams.get('userId');
    if (userId) {
        getUserInformation(userId);
    }

    if (jobTitle && jobId) {
        getJobDetails(jobId);
        document.getElementById('job-title').textContent = `APPLY FOR THE ${decodeURIComponent(jobTitle)} ROLE`;
    } else {
        document.getElementById('job-title').textContent = 'Job Title: Not specified';
    }
});

function getUserInformation(id) {
    onValue(ref(db, 'users/' + id), (snapshot) => {
        const data = snapshot.val();
        email = data.email;
        userName = data.userName;

    });
}

function getJobDetails(jobId) {
    onValue(ref(db, 'jobs/' + jobId), (snapshot) => {
        const data = snapshot.val();
        console.log('jod desc: ' + data.experienceDescription);
        const mandatorySkill = document.getElementById('mandatoryskill');
        const experienceLevel = document.getElementById('experience-level');

        mandatorySkill.textContent = "Mandatory Skill: " + data.mandatorySkill;
        experienceLevel.textContent = "Experience level: " + data.experienceLevel;
    });
}

const submit = document.getElementById('submit');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    const imageRef = storageRef(storage, 'images/' + fileName);
    const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
            'uploadedBy': 'user123',
            'description': 'Profile picture'
        }
    };

    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const email = document.getElementById('email').value.trim();
    const gradDegree = document.getElementById('grad-degree').value.trim();
    const gradPercentage = document.getElementById('grad-percentage').value.trim();
    const gradDiploma = document.getElementById('grad-diploma').value.trim();
    const collegePercentage = document.getElementById('college-percentage').value.trim();
    const skills = document.getElementById('skills').value.trim();
    const totalYears = document.getElementById('total-years-of-experience').value.trim();
    const designation = document.getElementById('designation').value.trim();

    
    uploadBytesResumable(imageRef, fileItem, metadata)
        .then((snapshot) => {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            getDownloadURL(snapshot.ref).then((url) => {
                const applicationId = generateRandomString();
    
                const applicationDetails = {
                    cvUrl: url,
                    userName: name,
                    email: email,
                    roleId: jobId,
                    roleName: jobTitle,
                    applicationId: applicationId,
                    applicationStatus: 'pending',
                    description: skills,
                    age:age,
                    address:address,
                    phone:phone,
                    gender:gender,
                    gradDegree:gradDegree,
                    gradPercentage:gradPercentage,
                    gradDiploma:gradDiploma,
                    collegePercentage:collegePercentage,
                    designation:designation,
                    totalYears:totalYears,
                    jobId:jobId,
                    userId:userId
                }

                const jobRef = ref(db, 'application/' + applicationId);
                set(jobRef, applicationDetails)
                    .then(() => {
                        alert('Application successful !!')
                    })
                    .catch((e) => {
                        alert('error occurred !!')
                    })

            });
        }).catch((error) => {
            console.error('Upload failed', error);
            // ...
        });
})


function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



