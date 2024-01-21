# GitHub Repository Viewer

## Overview
This web application allows users to view public GitHub repositories for a specific user.  

## Live Demo
This project is deployed on Vercel. The live application can be viewed here: [GitHub Repository Viewer on Vercel](https://repo-viewer-three.vercel.app/)

## Features
- Server-side pagination with a default of 10 repositories per page and a dynamic option to choose the number of repositories displayed per page and display up to 100 repositories per page.
- Loading indicators are shown during API calls.
- Search functionality to filter repositories by name.
- Display of repository description and topics.
- Handles various edge cases such as invalid usernames, no repositories, pagination edge cases and more.

## Technologies Used
- HTML
- CSS
- JavaScript
- [GitHub REST API](https://docs.github.com/en/rest/reference)

## Getting Started

### Prerequisites
- A modern web browser (preferably chrome).
- Internet connection (for API calls to GitHub).

### Running the Project Locally
1. **Clone the Repository:** Clone this repository to your local machine using `git clone https://github.com/ry-aki/Repo-Viewer.git`

2. **Navigate to the Project Directory:** Change directory to the root of the project using `cd Repo-Viewer` 

3. **Open index.html:** Open the `index.html` file in a web browser. 

4. **Enter a GitHub Username:** Once the application is running, enter a GitHub username in the provided input field and click the load button to view the repositories.

## Usage Instructions
- **View Repositories:** Enter a valid GitHub username and click the load button to view their public repositories.
- **Pagination:** Use the pagination controls at the bottom of the page to navigate between pages of repositories.
- **Change Repositories Per Page:** Select a different number from the dropdown menu to change the number of repositories displayed per page.
- **Search Repositories:** Use the search bar to filter the displayed repositories by name.

## Contributing
Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License
This project is open-source and available under the [MIT License](LICENSE).
