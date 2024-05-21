const slider = document.querySelector('.slider');

// Function to handle slider navigation
function activate(e) {
    const items = document.querySelectorAll('.item');
    e.target.matches('.prev') && slider.append(items[0]);
    e.target.matches('.next') && slider.prepend(items[items.length - 1]);
}

// Add event listener for slider navigation
document.addEventListener('click', activate, false);

// Get references to the button and form container
const toggleFormButton = document.querySelector('.addItemButton');
const formContainer = document.getElementById('formContainer');
const cancelButton = document.querySelector('.cancel');

// Function to hide the form
function hideForm() {
    formContainer.style.display = 'none';
}

// Add click event listener to the cancel button
cancelButton.addEventListener('click', hideForm);

// Add click event listener to toggle form button
toggleFormButton.addEventListener('click', function () {
    // Toggle the visibility of the form container
    formContainer.style.display = formContainer.style.display === 'none' || formContainer.style.display === '' ? 'block' : 'none';
});

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    hideForm();
    // Clear form fields
    document.getElementById('img').value = '';
    document.getElementById('art').value = '';
}

// Add submit event listener to the form
document.getElementById('formContainer').addEventListener('submit', handleSubmit);
