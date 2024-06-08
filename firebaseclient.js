import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";


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
var uid;
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    uid = urlParams.get('uid');
    if (uid) {
       
    } 
});

onValue(ref(db, 'jobs'), (snapshot) => {
    const data = snapshot.val();
    const dataTableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = ''
    for (let key in data) {
        let row = dataTableBody.insertRow();
        let cellTitle = row.insertCell(0);
        let cellLevel = row.insertCell(1);
        let cellMandatory = row.insertCell(2);
        let cellApply = row.insertCell(3);

        // Create an anchor element for the "Apply" link
        let applyLink = document.createElement('a');
        applyLink.textContent = 'Apply';
        applyLink.href = `apply.html?jobTitle=${encodeURIComponent(data[key].jobTitle)}&&id=${encodeURIComponent(data[key].id)}&&userId=${uid}`;
        // applyLink.target = '_blank';

        cellApply.appendChild(applyLink);

        cellTitle.textContent = data[key].jobTitle;
        cellMandatory.textContent = data[key].mandatorySkill;
        cellLevel.textContent = data[key].experienceLevel;
        console.log("Job Title: " + data[key].jobTitle);
    }
});

const applicationElement = document.getElementById('application');

applicationElement.addEventListener('click',(e)=>{
    e.preventDefault()
    applicationElement.setAttribute(`href', 'Clientapplications.html?userId=${uid}`)
    applicationElement.click()
})