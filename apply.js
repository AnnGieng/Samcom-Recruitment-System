import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
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
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app"
};
initializeApp(firebaseConfig);
const auth = getAuth();
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

    // Clear form fields
    clearFormFields();

    // Prefill form with data from localStorage only if in edit mode
    if (isEditMode) {
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
    }

    // Replace the "Apply" button with an "Update" button if in edit mode
    if (isEditMode) {
        const applyButton = document.getElementById('submit');
        applyButton.id = 'update';
        applyButton.textContent = 'Update';
    }

    // Attach event listener to file input
    const fileInput = document.getElementById('cv');
    fileInput.addEventListener('change', handleFileUpload);

    // Attach event listener to Apply/Update button
    document.getElementById('submit')?.addEventListener('click', handleFormSubmission);
    document.getElementById('update')?.addEventListener('click', handleFormSubmission);
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
        console.log('job desc: ' + data.experienceDescription);
        const mandatorySkill = document.getElementById('mandatoryskill');
        const experienceLevel = document.getElementById('experience-level');

        mandatorySkill.textContent = "Mandatory Skill: " + data.mandatorySkill;
        experienceLevel.textContent = "Experience level: " + data.experienceLevel;
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        fileItem = file;
        fileName = file.name;
        console.log('File uploaded:', fileName);
    }
}

function handleFormSubmission(e) {
    e.preventDefault();

    if (!fileItem) {
        alert('Please upload a CV.');
        return;
    }

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
        cv: 'Uploaded'
    };
    if (!jobId || !userId) {
        alert('Job ID or User ID is missing. Please reload the page and try again.');
        return;
    }

    const applicationRef = ref(db, `applications/${jobId}_${userId}`);
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';

    onValue(applicationRef, (snapshot) => {
        if (snapshot.exists() && !isEditMode) {
            alert('You have already applied for this job.');
            return;
        }

        localStorage.setItem('applicationData', JSON.stringify(applicationData));

        const imageRef = storageRef(storage, 'cv/' + fileName);
        const metadata = {
            contentType: fileItem.type,
            customMetadata: {
                'uploadedBy': userId,
                'description': 'CV document'
            }
        };

        uploadBytesResumable(imageRef, fileItem, metadata)
            .then((snapshot) => {
                console.log('Uploaded', snapshot.totalBytes, 'bytes.');
                console.log('File metadata:', snapshot.metadata);
                return getDownloadURL(snapshot.ref);
            })
            .then((url) => {
                const applicationDetails = {
                    cvUrl: url,
                    userName: name,
                    email: email,
                    roleId: jobId,
                    roleName: jobTitle,
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

                if (isEditMode) {
                    return update(applicationRef, applicationDetails);
                } else {
                    return set(applicationRef, applicationDetails);
                }
            })
            .then(() => {
                alert(isEditMode ? 'Application updated successfully!' : 'Application submitted successfully!');
                clearFormFields(); // Clear the form fields after successful submission
                window.location.href = 'profile.html';
            })
            .catch((e) => {
                console.error('Upload failed', e);
                alert('An error occurred!');
            });
    }, { onlyOnce: true });
}

function clearFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('email').value = '';
    document.getElementById('grad-degree').value = '';
    document.getElementById('grad-percentage').value = '';
    document.getElementById('grad-diploma').value = '';
    document.getElementById('college-percentage').value = '';
    document.getElementById('skills').value = '';
    document.getElementById('total-years-of-experience').value = '';
    document.getElementById('designation').value = '';
}
