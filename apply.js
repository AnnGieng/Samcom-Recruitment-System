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
var userId = localStorage.getItem('auth-token');

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';
    jobTitle = urlParams.get('jobTitle');
    jobId = urlParams.get('id');

    if (jobTitle && jobId) {
        getJobDetails(jobId);
        document.getElementById('job-title').textContent = `APPLY FOR THE ${decodeURIComponent(jobTitle)} ROLE`;

    } else {
        document.getElementById('job-title').textContent = 'Job Title: Not specified';
    }

    // Prefill form with data from localStorage
    const applicationData = JSON.parse(localStorage.getItem('applicationData'));
    if (applicationData) {
        document.getElementById('name').value = applicationData.name;
        document.getElementById('age').value = applicationData.age;
        document.getElementById('address').value = applicationData.address;
        document.getElementById('phone').value = applicationData.phone;
        document.getElementById('gender').value = applicationData.gender;
        document.getElementById('email').value = applicationData.email;
        document.getElementById('grad-degree').value = applicationData.gradDegree;
        document.getElementById('grad-percentage').value = applicationData.gradPercentage;
        document.getElementById('grad-diploma').value = applicationData.gradDiploma;
        document.getElementById('college-percentage').value = applicationData.collegePercentage;
        document.getElementById('skills').value = applicationData.skills;
        document.getElementById('total-years-of-experience').value = applicationData.totalYears;
        document.getElementById('designation').value = applicationData.designation;
    }

    // Replace the "Apply" button with an "Update" button if in edit mode
    if (isEditMode) {
        const applyButton = document.getElementById('submit');
        applyButton.id = 'update';
        applyButton.textContent = 'Update';
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

// Submit event for Apply button
const submitButton = document.getElementById('submit');
submitButton?.addEventListener('click', handleFormSubmission);

// Submit event for Update button
const updateButton = document.getElementById('update');
updateButton?.addEventListener('click', handleFormSubmission);

function handleFormSubmission(e) {
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

    const applicationData = {
        name: name,
        age: age,
        address: address,
        phone: phone,
        gender: gender,
        email: email,
        gradDegree: gradDegree,
        gradPercentage: gradPercentage,
        gradDiploma: gradDiploma,
        collegePercentage: collegePercentage,
        skills: skills,
        totalYears: totalYears,
        designation: designation,
        cv: fileName  // Assuming fileName is being set correctly elsewhere
    };

    // Store data in localStorage
    localStorage.setItem('applicationData', JSON.stringify(applicationData));

    // Show alert and redirect to profile page
    alert('Application submitted successfully!');
    window.location.href = 'profile.html';

    // Optionally, handle file upload and database update
    uploadBytesResumable(imageRef, fileItem, metadata)
        .then((snapshot) => {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
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
                age: age,
                address: address,
                phone: phone,
                gender: gender,
                gradDegree: gradDegree,
                gradPercentage: gradPercentage,
                gradDiploma: gradDiploma,
                collegePercentage: collegePercentage,
                designation: designation,
                totalYears: totalYears,
                jobId: jobId,
                userId: userId
            };

            const jobRef = ref(db, 'application/' + applicationId);
            return set(jobRef, applicationDetails);
        })
        .then(() => {
            alert('Application successful!');
        })
        .catch((e) => {
            console.error('Upload failed', e);
            alert('An error occurred!');
        });
}

function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}