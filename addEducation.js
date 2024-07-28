document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save-education').addEventListener('click', function () {
        const degree = document.getElementById('degree').value;
        const course = document.getElementById('course').value;
        const institution = document.getElementById('institution').value;
        const graduationDate = document.getElementById('graduation-date').value;

        if (degree && course && institution && graduationDate) {
            const newEducationDetail = {
                degree,
                course,
                institution,
                graduationDate
            };
            let applicationData = JSON.parse(localStorage.getItem('applicationData'));
            if (!applicationData.educationDetails) {
                applicationData.educationDetails = [];
            }
            applicationData.educationDetails.push(newEducationDetail);
            localStorage.setItem('applicationData', JSON.stringify(applicationData));
            window.location.href = 'mainForm.html';
        } else {
            alert('Please fill all fields.');
        }
    });
});
