document.getElementById('square').addEventListener('mouseover', function () {
    document.querySelector('.behind').style.top = '60%';
});

document.getElementById('square').addEventListener('mouseout', function () {
    document.querySelector('.behind').style.top = '41%';
});

document.getElementById('square').addEventListener('mouseover', function () {
    document.querySelector('.smallcircle').style.background = 'black';
});

document.getElementById('square').addEventListener('mouseout', function () {
    document.querySelector('.smallcircle').style.background = '#ecbe98';
});

// Get a reference to the square element
const square = document.getElementById('square');

// Add click event listener to the square
square.addEventListener('click', function () {
    // Navigate to another page
    window.location.href = '/playlists';
});
