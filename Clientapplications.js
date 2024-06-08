
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, child, get,onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
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


const uid = localStorage.getItem('auth-token')

if(uid){
    console.log(`Uid is ${uid}`);
}else{
    console.log(`Uid is null`);
}

onValue(ref(db, 'application'), (snapshot) => {
    const data = snapshot.val();
    const dataTableBody = document.getElementById('application-table').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = ''
    for (let key in data) {
        if(data[key].userId === uid){
            let row = dataTableBody.insertRow();
            let cellRole = row.insertCell(0);
            let cellStatus = row.insertCell(1);
            let cellView = row.insertCell(2);
    
            // Create an anchor element for the "Apply" link
            let viewLink = document.createElement('a');
            viewLink.textContent = 'View';
            viewLink.href = `#`;
            // applyLink.target = '_blank';
            if( data[key].applicationStatus === 'Interview Scheduled'){
                cellView.appendChild(viewLink);
            }
            cellRole.textContent = data[key].roleName;
            cellStatus.textContent = data[key].applicationStatus;
            console.log(data[key].userName);
        }
    }
});