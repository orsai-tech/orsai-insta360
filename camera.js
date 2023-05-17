const express = require('express');
const { execSync } = require('child_process');
const NodeWebcam = require('node-webcam');

// UVC camera parameter limits
const PAN_MIN = -648000;
const PAN_MAX = 648000;
const TILT_MIN = -648000;
const TILT_MAX = 648000;

// Create an Express app
const app = express();
const port = 3000;

// Function to execute a shell command
function executeCommand(command) {
    try {
        const output = execSync(command).toString().trim();
        return output;
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        return null;
    }
}

// Get the current absolute pan value
function getAbsolutePan() {
    const output = executeCommand('uvcc get absolute_pan');
    return parseInt(output, 10);
}

// Get the current absolute tilt value
function getAbsoluteTilt() {
    const output = executeCommand('uvcc get absolute_tilt');
    return parseInt(output, 10);
}

// Set the absolute pan and tilt values
function setAbsolutePanTilt(pan, tilt) {
    const command = `uvcc set absolute_pan_tilt ${pan} ${tilt}`;
    executeCommand(command);
}

// Set up a route for the home page
app.get('/', (req, res) => {
    const currentPan = 0 //getAbsolutePan();
    const currentTilt = 360 //getAbsoluteTilt();

    res.send(`
    <html>
    <head>
      <title>UVC Camera Control</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://kit.fontawesome.com/09a6c5ab77.js" crossorigin="anonymous"></script>
      <style>
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }
        .fas {
            font-size: 20rem;
        }
      </style>
    </head>
    <body>
      <h1>UVC Camera Control</h1>
      <div class="flex justify-center items-center h-screen">
  <div class="flex flex-col gap-4 justify-center items-center">
    <div>
      <button class="button" onclick="moveCamera(0, 30000)">
        <i class="fas  fa-caret-up"></i>
      </button>
    </div>
    <div class="flex justify-between" style="width:400px">
      <button class="button me-10" onclick="moveCamera(30000, 0)">
        <i class="fas  fa-caret-left"></i>
      </button>
      <button class="button" onclick="moveCamera(-30000, 0)">
        <i class="fas  fa-caret-right"></i>
      </button>
    </div>
    <div>
      <button class="button" onclick="moveCamera(0, -30000)">
        <i class="fas  fa-caret-down"></i>
      </button>
    </div>
  </div>
</div>


      <script>
      let currentPan = ${currentPan};
        let currentTilt = ${currentTilt};
      function moveCamera(panChange, tiltChange) {
        const newPan = currentPan + panChange;
        const newTilt = currentTilt + tiltChange;
        setPanTilt(newPan, newTilt);
      }

      function setPanTilt(pan, tilt) {

        currentPan = pan;
        currentTilt = tilt;

        const command = \`uvcc set absolute_pan_tilt $\{pan\} $\{tilt\}\`;
        console.log(command)
        fetch(\`/command?command=$\{encodeURIComponent(command)}\`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error executing command');
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      </script>
    </body>
    </html>
  `);
});

// Set up a route to handle camera movement commands
app.get('/command', (req, res) => {
    const { command } = req.query;
    console.log(`Received command: ${command}`)

    try {
        // Execute the camera movement command
        executeCommand(command);
        res.sendStatus(200);
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        res.sendStatus(500);
    }
});

// Set up a route to serve the styles.css file
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/styles.css');
});

// Configure the webcam
const Webcam = NodeWebcam.create({
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: false,
    output: 'jpeg',
    callbackReturn: 'buffer',
});

// Define a route to capture and stream the webcam video
app.get('/video-stream', (req, res) => {
    // Set the content type of the response to video/mp4
    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Transfer-Encoding': 'chunked',
    });

    // Continuously capture frames from the webcam and send them as a stream
    const interval = setInterval(() => {
        Webcam.capture((err, buffer) => {
            if (err) {
                console.error('Error capturing frame:', err);
                clearInterval(interval);
                res.end();
                return;
            }

            res.write(buffer);
        }, 'buffer');
    }, 100); // Adjust the interval (in milliseconds) between each frame capture if needed

    // Clean up the interval when the response is closed
    res.on('close', () => {
        clearInterval(interval);
    });
});

// Serve the joystick.html file+
app.get('/joystick', (req, res) => {
    res.sendFile(__dirname + '/joystick.html');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


