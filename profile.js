document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from localStorage
    const profileData = JSON.parse(localStorage.getItem('applicationData'));

    if (profileData) {
        document.getElementById('profile-name').textContent = profileData.name;
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
        document.getElementById('profile-total-years-of-experience').textContent = profileData.totalYearsOfExperience;
        document.getElementById('profile-skills').textContent = profileData.skills;
        document.getElementById('profile-cv').textContent = profileData.cv;
    }

    // Edit button event listener
    document.getElementById('edit-button').addEventListener('click', function() {
        window.location.href = 'apply.html?edit=true';
    });
});
