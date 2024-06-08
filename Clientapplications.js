document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("application-tbody");

    applications.forEach(app => {
        const row = document.createElement("tr");

        const roleCell = document.createElement("td");
        roleCell.textContent = app.role;
        row.appendChild(roleCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = app.status;
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        if (app.status === "Approved") {
            const viewButton = document.createElement("button");
            viewButton.textContent = "View";
            viewButton.classList.add("view-btn");
            viewButton.addEventListener("click", () => {
                alert(`Interview Details:
                    Date: ${app.interview.date}
                    Time: ${app.interview.time}
                    Link: ${app.interview.link}`);
            });
            actionCell.appendChild(viewButton);
        }

        row.appendChild(actionCell);

        tbody.appendChild(row);
    });

    const newApplicantButton = document.getElementById("new-applicant");
    newApplicantButton.addEventListener("click", () => {
        // You can add functionality to handle the addition of new applicants
        alert("New Applicant button clicked!");
    });
});



