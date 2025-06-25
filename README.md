# Marvel Character Full-Stack Application

## Overview

This is a full-stack web application for managing Marvel characters. Users can view, add, update, and delete characters, as well as explore detailed information about each character. The application is built using React for the frontend and Flask for the backend, with MySQL as the database.

## Features

- **Home Page**: Displays an introduction to the application.
- **Character Listings**: View a list of Marvel characters.
- **Character Details**: View detailed information about a specific character.
- **Add Character**: Add a new Marvel character to the database.
- **Update Character**: Modify existing character information.
- **Delete Character**: Remove a character from the database.
- **Error Handling**: Displays alerts for errors and loading states.

## Technologies Used

### Frontend
- React
- React Router
- Bootstrap
- Axios

### Backend

- Flask
- Flask-CORS
- Flask-SQLAlchemy

### Database

- MySQL

## Project Structure

### Frontend (`marvel-character-app`)

- **`src/App.jsx`**: Main application file that defines routes and manages global states.
- **`src/components`**: Contains React components for different pages and functionalities:
  - `NavBar.jsx`: Navigation bar.
  - `Home.jsx`: Home page.
  - `CharacterListings.jsx`: Displays a list of characters.
  - `CharacterDetails.jsx`: Shows detailed information about a character.
  - `AddCharacter.jsx`: Form to add a new character.
  - `UpdateCharacter.jsx`: Form to update character information.
  - `DeleteCharacter.jsx`: Confirmation for deleting a character.
  - `NotFound.jsx`: Page displayed for invalid routes.

### Backend (`m7project/backend`)

- **`server.py`**: Flask server that handles API requests.
- **`marvel_characters.sql`**: SQL file for database schema.
- **`requirements.txt`**: Contains Python dependencies.

## Installation

### Prerequisites

- Node.js
- Python 3.13+
- MySQL

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Set up the backend:

   ```bash
   cd m7project/backend
   python -m venv m7_project_backend
   source m7_project_backend/Scripts/activate
   pip install -r requirements.txt
   ```

3. Import the database schema:

   ```bash
   mysql -u <username> -p <database_name> < marvel_characters.sql
   ```

4. Start the Flask server:

   ```bash
   python server.py
   ```

5. Set up the frontend:

   ```bash
   cd marvel-character-app
   npm install
   npm run dev
   ```

6. Open the application in your browser:
    - use the link provided in the terminal or navigate to :

   ```text
   http://localhost:5173
   ```

## Usage

- Navigate through the application using the navbar.
  - The `NavBar` component provides links to all major sections of the application, including Home, Character Listings, and CRUD operations.
- View, add, update, or delete characters.
  - **View** the characters in the Database using the "Heros/Villains" link in the Navbar or by going to the /Characters route.
  
    The `CharacterListings` component fetches and displays a list of characters from the backend, with loading and error handling.
  - **Selecting** a hero or villain in the CharacterListings component brings up the `CharacterDetails` component showing detailed information about a specific character, including their alignment and powers and buttons for quick management of information about the characters.
  - The **`AddCharacter`** component provides a form to add a new character, with validation and error handling and is accessible by the "Add a character" link in the Navbar Dropdown menu.
  - The **`UpdateCharacter`** component allows users to modify existing character information, with preloaded data for the selected character and is accessible by the "Update/Modify a Character" link in the Navbar Dropdown menu.
  - The **`DeleteCharacter`** component confirms the deletion of a character and removes them from the database and is accessible by the "Delete a Character" link in the Navbar Dropdown menu.

## Contributing

Feel free to fork the repository and submit pull requests for improvements or new features.

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, please contact [your-email@example.com].

## Acknowledgements

- **Backgrounds**: Special thanks to the authors of the backgrounds used in this project.
  - s_h_i_e_l_d__badge_insignia_wallpaper_by_viperaviator_d7i18xo.png by viperaviator @ <https://deviantart.com>
  - S.H.I.E.L.D.png modified by me, source: <https://hero.fandom.com/wiki/S.H.I.E.L.D._(Marvel)?file=SHIELD-Marvel.png> added by Dalvin98
