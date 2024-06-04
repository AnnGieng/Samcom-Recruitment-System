
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js"

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
var email;
var userName;
var jobId;
var jobTitle;


document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    jobTitle = urlParams.get('jobTitle');
    jobId = urlParams.get('id');
    const userId = urlParams.get('userId');
    if(userId){
        getUserInformation(userId);
    }

    if (jobTitle && jobId) {
        getJobDetails(jobId)
        document.getElementById('job-title').textContent = `APPLY FOR THE ${decodeURIComponent(jobTitle)} ROLE`;
    } else {
        document.getElementById('job-title').textContent = 'Job Title: Not specified';
    }
});

function getUserInformation(id){
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
        const experienceDesc = document.getElementById('experienceDescription');
        const expectationDesc = document.getElementById('expectationDescription');
        const experienceLevel = document.getElementById('experience-level');

        experienceDesc.textContent = "Experience description: " + data.experienceDescription;
        expectationDesc.textContent = "Expectation description: " + data.expectationDescription;
        experienceLevel.textContent = "Experience level: " + data.experienceLevel;
    });
}

const submit = document.getElementById('submit');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    submitTest();
    const imageRef = storageRef(storage, 'images/' + fileName);
    const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'uploadedBy': 'user123',
          'description': 'Profile picture'
        }
      };
    uploadBytesResumable(imageRef, fileItem, metadata)
        .then((snapshot) => {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            getDownloadURL(snapshot.ref).then((url) => {
                const applicationId = generateRandomString();
                const applicationDetails = {
                    cvUrl:url,
                    userName:userName,
                    email:email,
                    roleId: jobId,
                    roleName: jobTitle,
                    applicationId:applicationId,
                    applicationStatus:'pending'
                }

                const jobRef = ref(db,'application/' + applicationId);
                set(jobRef,applicationDetails)
                .then(()=>{
                    alert('Application successful !!')
                })
                .catch((e)=>{
                    alert('error occurred !!')
                })

            });
        }).catch((error) => {
            console.error('Upload failed', error);
            // ...
        });


})

function submitTest() {
    console.log(fileName);
}


document.getElementById('cv').addEventListener('change', function (event) {
    fileItem = event.target.files[0];
    fileName = fileItem.name;
});

function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
document.getElementById('application-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Simulate a successful form submission process
    setTimeout(function() {
        // Hide the form
        document.getElementById('application-form').style.display = 'none';
        
        // Show the back-to-dashboard button
        document.getElementById('back-to-dashboard').style.display = 'block';
    }, 1000); // Simulate a delay of 1 second
});

document.getElementById('back-to-dashboard').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
});





