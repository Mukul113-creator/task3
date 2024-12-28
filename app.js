const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form on the root route
app.get('/', (req, res) => {
    res.send(`
        <!doctype html>
        <html>
            <head>
                <title>Submit Phone Number</title>
            </head>
            <body>
                <form action="/post" method="post">
                    <label for="phonenumber">Phone Number:</label>
                    <input type="text" id="phonenumber" name="phonenumber" required>
                    <button type="submit">Submit</button>
                </form>
            </body>
        </html>
    `);
});

// Handle form submission
app.post('/post', async (req, res) => {
    const phonenumber = req.body.phonenumber;

    try {
        // Make POST request to the API
        const response = await axios.post('https://chimpu.online/api/post.php', {
            phonenumber: phonenumber,
        });

        // Extract headers from the response
        const headers = response.headers;

        // Generate HTML to display headers
        let headerHTML = '<h1>Received Headers</h1><ul>';
        for (const [key, value] of Object.entries(headers)) {
            headerHTML += `<li><strong>${key}</strong>: ${value}</li>`;
        }
        headerHTML += '</ul>';

        res.send(`
            <!doctype html>
            <html>
                <head>
                    <title>Headers Received</title>
                </head>
                <body>
                    ${headerHTML}
                    <a href="/">Back</a>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error occurred while posting data to the API.');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
