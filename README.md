# OdooAPI Project

This project is a ticket management system that utilizes the Odoo API for backend operations. It consists of a Flask web server for handling requests and a simple frontend for user interaction.

## Project Structure

```
OdooAPI
├── backend
│   ├── app.py          # Main application file with Flask routes
│   ├── odoo_api.py     # OdooAPI class for communication with Odoo server
│   └── __init__.py     # Marks the backend directory as a Python package
├── frontend
│   ├── index.html      # Main HTML file for the frontend
│   ├── script.js       # JavaScript code for API interaction
│   └── style.css       # Styles for the frontend application
├── requirements.txt     # Python dependencies for the project
└── README.md            # Documentation for the project
```

## Setup Instructions

1. **Install Dependencies**: 
   Run the following command in your terminal to install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

2. **Start the Flask Server**: 
   Execute the following command to start the Flask server:
   ```
   python backend/app.py
   ```

3. **Access the Application**: 
   Open `frontend/index.html` in a web browser to access the application.

## Usage

- **Listing Tickets**: The application will display a list of tickets retrieved from the Odoo server.
- **Creating Tickets**: Users can fill out the form to create new tickets, which will be sent to the Odoo server for processing.

## Additional Information

Make sure that your Odoo server is running and accessible at the specified host and port in the `backend/odoo_api.py` file. Adjust the connection parameters as necessary to match your Odoo server configuration.