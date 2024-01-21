// document.addEventListener('DOMContentLoaded', function () {
//     const username = 'ry-aki'; // Replace this with any valid GitHub username
//     const profileUrl = `https://api.github.com/users/${username}`;
//     const reposUrl = `https://api.github.com/users/${username}/repos`;

//     let currentPage = 1;
//     let perPage = 10;

//     // Fetch profile information
//     fetch(profileUrl)
//         .then(response => response.json())
//         .then(user => {
//             const profileHTML = `                
//                 <div class="d-flex justify-content-start align-items-start">
//                     <img src="${user.avatar_url}" alt="${user.name}" class="mr-10 rounded-circle" style="width: 150px; height: 150px;" />
//                     <div class="text-start"> 
//                         <h2>${user.name}</h2>
//                         <p>${user.bio}</p>
//                         <p>${user.location}</p>
//                         <p>Twitter: <a href="https://twitter.com/${user.twitter_username}" target="_blank">${user.twitter_username}</a></p>
//                         <p>GitHub: <a href="${user.html_url}" target="_blank">${user.html_url}</a></p>
//                     </div>
//                 </div>

//             `;
//             document.getElementById('profile').innerHTML = profileHTML;
//         });

//     // Fetch repositories
//     fetch(reposUrl)
//         .then(response => response.json())
//         .then(repositories => {
//             let reposHTML = '';
//             repositories.forEach(repo => {
//                 reposHTML += `
//                     <div class="col-md-6 ">
//                         <div class="repository-card">
//                             <h3>${repo.name}</h3>
//                             <p>${repo.description || ''}</p>
//                             <div>${repo.topics.map(topic => `<span class="tag">${topic}</span>`).join('')}</div>
//                         </div>
//                     </div>
//                 `;
//             });
//             document.getElementById('repositories').innerHTML = reposHTML;
//         });

//         function fetchRepositories(page, perPage) {
//             const reposUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;
        
//             // Fetch repositories with pagination
//             fetch(reposUrl)
//                 .then(response => response.json())
//                 .then(repositories => {
//                     // ...process and display repositories...
//                     // ...update pagination...
//                 })
//                 .catch(error => console.error('Error fetching repositories:', error));
//         }
        
//         document.getElementById('perPage').addEventListener('change', function() {
//             perPage = this.value;
//             currentPage = 1; // Reset to the first page
//             fetchRepositories(currentPage, perPage);
//         });
        
//         // Initial fetch
//         fetchRepositories(currentPage, perPage);
        
//         // Function to handle page change
//         function changePage(newPage) {
//             currentPage = newPage;
//             fetchRepositories(currentPage, perPage);
//         }
// });


const apiRoot = 'https://api.github.com/users/';
const user = 'johnpapa'; // Replace with the username you want to query
let currentPage = 1;
const perPage = 10;
let searchQuery = ''; 


const repoList = document.getElementById('repoList');
const pagination = document.getElementById('pagination');


function fetchProfile() {
    fetch(`${apiRoot}${user}`)
        .then(response => response.json())
        .then(data => {
            displayProfile(data);
            fetchRepositories(); // Fetch repositories after profile is loaded
        })
        .catch(error => console.error('Error fetching profile:', error));
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
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const repos = document.querySelectorAll('.repository');
    repos.forEach(repo => {
        const title = repo.querySelector('h2').textContent.toLowerCase();
        repo.style.display = title.includes(searchValue) ? '' : 'none';
    });
}

function fetchRepositories() {
    fetch(`${apiRoot}${user}/repos?page=${currentPage}&per_page=${perPage}&sort=updated`)
        .then(response => response.json())
        .then(data => {
            displayRepositories(data);
            updatePagination();
            
        })
        .catch(error => console.error('Error fetching repositories:', error));
}

function displayRepositories(repositories) {
    repoList.innerHTML = ''; // Clear the list
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
    pagination.innerHTML = ''; // Clear existing pagination

    // Create left arrow button for going to the previous page
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = '&laquo;';
    prevPageButton.disabled = currentPage === 1;
    prevPageButton.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevPageButton);

    // Calculate page numbers to show
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

    // Create right arrow button for going to the next page
    const nextPageButton = document.createElement('button');
    nextPageButton.innerHTML = '&raquo;';
    // Disabled state should be set based on whether there are more pages
    nextPageButton.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextPageButton);

    // "Newer" and "Older" buttons on the next line
    const controlRow = document.createElement('div');
    controlRow.className = 'pagination-controls';

    // Create "Newer" button to decrease the range of page numbers
    const newerRangeButton = document.createElement('button');
    newerRangeButton.textContent = 'Newer';
    newerRangeButton.disabled = pageGroup === 0; // Disable if we are in the first group
    newerRangeButton.onclick = () => updatePaginationRange(startPage - 10);
    controlRow.appendChild(newerRangeButton);

    // Create "Older" button to increase the range of page numbers
    const olderRangeButton = document.createElement('button');
    olderRangeButton.textContent = 'Older';
    // Disabled state should be set based on whether there are more pages
    olderRangeButton.onclick = () => updatePaginationRange(startPage + 10);
    controlRow.appendChild(olderRangeButton);

    // Append the control row to the pagination container
    pagination.appendChild(controlRow);
}

function updatePaginationRange(newStartPage) {
    // Calculate new page range and update the current page
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


// Initial fetch
fetchProfile();
fetchRepositories();
