const apiRoot = 'https://api.github.com/users/';
let user = 'ry-aki'; 
let currentPage = 1;
const perPage = 10;
let searchQuery = ''; 

const repoList = document.getElementById('repoList');
const pagination = document.getElementById('pagination');

function updateUser() {
    const inputUsername = document.getElementById('input-username').value.trim();
    if (inputUsername) {
        user = inputUsername;
        currentPage = 1; 
        fetchProfile();
        fetchRepositories();
    } else {
        alert("Please enter a GitHub username.");
    }
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function fetchProfile() {
    showLoader();
    fetch(`${apiRoot}${user}`)
        .then(response => response.json())
        .then(data => {
            displayProfile(data);
            fetchRepositories(); 
        })
        .catch(error => {
            console.error('Error fetching profile:', error)
            hideLoader();
        });
}

function displayProfile(profileData) {
    const profileElement = document.getElementById('profile');
    profileElement.innerHTML = `
        <div class="profile-image">
            <img src="${profileData.avatar_url}" alt="${profileData.name}" style="width: 100%;">
        </div>
        <div class="profile-details">
            <h2>${profileData.name || user}</h2>
            <p>${profileData.bio || ''}</p>
            <p><i class="fa-solid fa-location-dot"></i>${profileData.location || ''}</p>
            <p>Twitter: <a href="https://twitter.com/${profileData.twitter_username}" target="_blank">${profileData.twitter_username}</a></p>
            <p>
                <i class="fa-solid fa-link"></i>
                <a href="${profileData.html_url}" target="_blank">${profileData.html_url}</a>
            </p>
        </div>
    `;
}

function filterRepositories() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const repos = document.querySelectorAll('.repository');
    repos.forEach(repo => {
        const title = repo.querySelector('h2').textContent.toLowerCase();
        repo.style.display = title.includes(searchValue) ? '' : 'none';
    });
}

function fetchRepositories() {
    showLoader();
    fetch(`${apiRoot}${user}/repos?page=${currentPage}&per_page=${perPage}&sort=updated`)
        .then(response => response.json())
        .then(data => {
            displayRepositories(data);
            updatePagination();
            hideLoader();
            
        })
        .catch(error => {
            console.error('Error fetching repositories:', error)
            hideLoader();
        });
}

function displayRepositories(repositories) {
    repoList.innerHTML = ''; 
    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repository';
        repoElement.innerHTML = `
            <h2>${repo.name}</h2>
            <p>${repo.description || ' '}</p>
            <div class="repository-topics">${repo.topics.map(topic => `<span class="tag">${topic}</span>`).join('')}</div>              
        `;
        repoList.appendChild(repoElement);
    });
}

function updatePagination() {
    pagination.innerHTML = ''; 
    //left arrow button 
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = '&laquo;';
    prevPageButton.disabled = currentPage === 1;
    prevPageButton.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevPageButton);

    
    const pageGroup = Math.floor((currentPage - 1) / 10);
    const startPage = pageGroup * 10 + 1;
    const endPage = startPage + 9;
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => changePage(i);
        pagination.appendChild(pageButton);
    }

    //right arrow 
    const nextPageButton = document.createElement('button');
    nextPageButton.innerHTML = '&raquo;';
    
    nextPageButton.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextPageButton);

    //pagination-controls div
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = ''; 

    //newer button 
    const newerRangeButton = document.createElement('button');
    newerRangeButton.textContent = 'Newer';
    newerRangeButton.disabled = pageGroup === 0; // Disable if we are in the first group
    newerRangeButton.onclick = () => updatePaginationRange(startPage - 10);
    paginationControls.appendChild(newerRangeButton);

    // older button 
    const olderRangeButton = document.createElement('button');
    olderRangeButton.textContent = 'Older';
    
    olderRangeButton.onclick = () => updatePaginationRange(startPage + 10);
    paginationControls.appendChild(olderRangeButton);
}

function updatePaginationRange(newStartPage) {
    const newPageGroup = Math.floor((newStartPage - 1) / 10);
    currentPage = newPageGroup * 10 + 1;
    updatePagination();
    fetchRepositories();
}

function changePage(newPage) {
    currentPage = newPage;
    fetchRepositories();
    updatePagination();

}





fetchProfile();
fetchRepositories();