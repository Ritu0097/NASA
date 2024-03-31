document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('btn');
    const searchInput = document.getElementById('search-input');
    const currentImageContainer = document.getElementById('current-image-container');
    const searchHistory = document.querySelector('.search-history');

    const apiKey = 'MmJ8XDUgqhhjg5QQjR0wYkvNCk1zQldRogtCFBAG';

    function getCurrentImageOfTheDay(selectedDate) {
        fetchImageData(selectedDate);
    }
    function getImageOfTheDay(selectedDate) {
        fetchImageData(selectedDate);
        saveSearch(selectedDate);
    }
    function saveSearch(selectedDate) {
        let searches = JSON.parse(localStorage.getItem('searches')) || [];
        searches.push(selectedDate);
        localStorage.setItem('searches', JSON.stringify(searches));
        addSearchToHistory();
    }
    function fetchImageData(date) {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Failed to fetch data');
                }
                return resp.json();
            })
            .then(data => {
                displayImage(data);
            })
            .catch(error => {
                displayError(error.message);
            });
    }
    function displayImage(data) {
        if (data.media_type === 'image') {
            currentImageContainer.innerHTML = `<img src="${data.url}" alt="Astronomy Picture of the Day">`;
        } else if (data.media_type === 'video') {
            currentImageContainer.innerHTML = `<iframe width="560" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
        }
    }
    function displayError(message) {
        currentImageContainer.innerHTML = `<p class="error">${message}</p>`;
    }
    function addSearchToHistory() {
        searchHistory.innerHTML = '';
        let searches = JSON.parse(localStorage.getItem('searches')) || [];
        searches.forEach(date => {
            const listItem = document.createElement('li');
            listItem.textContent = date;
            listItem.addEventListener('click', function () {
                getImageOfTheDay(date);
            });
            searchHistory.appendChild(listItem);
        });
    }
    getCurrentImageOfTheDay(new Date().toISOString().split('T')[0]);
    button.addEventListener('click', function () {
        const selectedDate = searchInput.value;
        getImageOfTheDay(selectedDate);
    });

    addSearchToHistory();
});
