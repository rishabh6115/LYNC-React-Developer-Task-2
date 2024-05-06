# Online Drive Application

## Overview
This Online Drive application is designed to mimic the functionalities of Google Drive with additional features such as Web3 interactions for enhanced security and decentralization. Users can create, upload, delete, rename files and folders, browse through the file structure, authenticate using Ethereum wallet addresses, and store files using IPFS (Pinata).

## Key Features
- **Browsing and Creating**: Users can create new files and folders, upload files, delete existing files or folders, rename files or folders, and browse through the file structure.
- **Web3 Interactions**: Blockchain-based user authentication using Ethereum wallet addresses, decentralized storage solutions using IPFS.
- **Sidebar and Breadcrumbs**: Intuitive navigation through a sidebar displaying folders and files, along with breadcrumbs and a back button.
- **Duplicate Prevention**: Logic implemented to prevent duplicate file and folder creation.
- **Wallet Address Display**: Display of connected wallet address with the ability to copy it.
- **Automatic Logout**: Users are logged out upon disconnecting their wallet or changing the connected address.

## Setup Instructions
1. Clone the repository: `git clone https://github.com/rishabh6115/LYNC-React-Developer-Task-2.git`
2. Navigate to the project directory:
3. Install dependencies: `npm install`
4. Please keep the .env received in the project parent directory.
5. Start the development server: `npm run dev`
6. Open your browser and visit `http://localhost:5173` to access the application.

## Usage Guide
- Upon accessing the application, users can navigate through folders by double-clicking on them.
- To create a new file or folder, click on the respective buttons and provide the necessary details.
- To upload a file, click on the upload button and select the file from your local system.
- To delete or rename a file or folder, click on the respective icons and select the desired action from the context menu.
- Users can authenticate using their Ethereum wallet addresses. The connected wallet address is displayed, and users can copy it by clicking on it.
- Users are automatically logged out upon disconnecting their wallet or changing the connected address.

## Dependencies
- Shadcn - `For UI`
- React
- React Router: `For navigation`
- react-hot-toast: `For toast messages`
- react-icons: `For icons`



