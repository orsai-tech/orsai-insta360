$(document).ready(function() {
    var canvas = document.getElementById("joystick");
    var context = canvas.getContext("2d");

    var joystick = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 50,
        dragging: false
    };

    // Variables de estado
    var isJoystickMoving = false;

    // Obtén el contenedor del slider
    var sliderContainer = document.getElementById('slider');

    // Eventos del mouse
    canvas.addEventListener("mousedown", startJoystick);
    canvas.addEventListener("mousemove", moveJoystick);
    canvas.addEventListener("mouseup", stopJoystick);

    // Eventos táctiles
    canvas.addEventListener("touchstart", startJoystick);
    canvas.addEventListener("touchmove", moveJoystick);
    canvas.addEventListener("touchend", stopJoystick);

    // Función para iniciar el movimiento del joystick
    function startJoystick(event) {
        event.preventDefault();
        isJoystickMoving = true;
        updateJoystickPosition(event);
        updatePositions();
        }

    // Función para detener el movimiento del joystick
    function stopJoystick(event) {
        event.preventDefault();
        isJoystickMoving = false;
        resetJoystickPosition();
        updatePositions();
        }

    // Función para actualizar la posición del joystick
    function moveJoystick(event) {
        event.preventDefault();
        if (isJoystickMoving) {
            updateJoystickPosition(event);
            updatePositions();
        }
    }

    // Crea el deslizador utilizando noUiSlider
    noUiSlider.create(sliderContainer, {
        start: [50], // Valor inicial del deslizador
        range: {
            min: 0, // Valor mínimo del deslizador
            max: 100, // Valor máximo del deslizador
        }
    });

    // Manejar el evento de clic en el botón
    $("#myButton").click(function() {
        $.ajax({
            url: "/button_click",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Button click sent successfully.");
            },
            error: function(error) {
                console.error("Error sending button click:", error);
            }
        });
    });

    // Manejar el evento de clic en el botón "SAVE"
    $("#Save1").click(function() {
        $.ajax({
            url: "/save_button_click1",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Button click sent successfully.");
            },
            error: function(error) {
                console.error("Error sending button click:", error);
            }
        });
    });

    // Manejar el evento de clic en el botón "SAVE"
    $("#Escena1").click(function() {
        $.ajax({
            url: "/load_button_click1",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Button click sent successfully.");
            },
            error: function(error) {
                console.error("Error sending button click:", error);
            }
        });
    });

    // Manejar el evento de clic en el botón "SAVE"
    $("#Save2").click(function() {
        $.ajax({
            url: "/save_button_click2",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Button click sent successfully.");
            },
            error: function(error) {
                console.error("Error sending button click:", error);
            }
        });
    });

    // Manejar el evento de clic en el botón "SAVE"
    $("#Escena2").click(function() {
        $.ajax({
            url: "/load_button_click2",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Button click sent successfully.");
            },
            error: function(error) {
                console.error("Error sending button click:", error);
            }
        });
    });


    // Manejar el cambio de selección en la lista desplegable
    $("#myDropdown").change(function() {
        var selectedOption = $(this).val();
        $.ajax({
            url: "/dropdown_select",
            type: "POST",
            data: JSON.stringify({ selectedOption: selectedOption }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Dropdown select sent successfully.");
            },
            error: function(error) {
                console.error("Error sending dropdown select:", error);
            }
        });
    });  
    
    sliderContainer.noUiSlider.on('update', function (values, handle) {
        var value = values[handle];
        
        // Envía el valor del deslizador al servidor utilizando una solicitud AJAX
        $.ajax({
          url: '/update_slider', // Ruta de la URL del servidor donde se manejará la solicitud
          type: 'POST', // Método de la solicitud
          data: { value: value }, // Datos que se enviarán al servidor
          success: function (response) {
            // La solicitud se ha completado exitosamente
            console.log(response);
          },
          error: function (error) {
            // Ocurrió un error durante la solicitud
            console.log(error);
          }
        });
    });

    function drawJoystick() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();

        // Dibujar el círculo interior
        context.arc(canvas.width/2, canvas.height/2, joystick.radius*0.4, 0, Math.PI * 2);
        context.fillStyle = "rgba(30, 30, 30, 1)";
        context.fill();
        context.lineWidth = 5;
        context.stroke();
        
        // Dibujar el círculo exterior
        context.beginPath();
        context.arc(joystick.x, joystick.y, joystick.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 0, 0, 1)";
        context.lineWidth = 3;
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.stroke();
        context.fill();

        // Agregar el reflejo blanco al círculo exterior
        context.globalAlpha = 0.25; // Establecer la opacidad del reflejo
        context.beginPath();
        context.arc(joystick.x-10, joystick.y-15, joystick.radius*0.5, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
        context.globalAlpha = 1; // Restaurar la opacidad predeterminada   
    }

    function updateJoystickPosition(event) {
        var rect = canvas.getBoundingClientRect();
        var clientX, clientY;

        if (event.type === "touchmove") {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        joystick.x = clientX - rect.left;
        joystick.y = clientY - rect.top;

        // Limitar la posición del joystick dentro del canvas
        if (joystick.x < joystick.radius) {
            joystick.x = joystick.radius;
        } else if (joystick.x > canvas.width - joystick.radius) {
            joystick.x = canvas.width - joystick.radius;
        }

        if (joystick.y < joystick.radius) {
            joystick.y = joystick.radius;
        } else if (joystick.y > canvas.height - joystick.radius) {
            joystick.y = canvas.height - joystick.radius;
        }
        drawJoystick();
        sendJoystickPosition();

    }

    // Función para restablecer la posición del joystick al centro del canvas
    function resetJoystickPosition() {
        joystick.x = canvas.width / 2;
        joystick.y = canvas.height / 2;
        drawJoystick();
        sendJoystickPosition();
    }

    function sendJoystickPosition() {
        var data = {
            x: joystick.x,
            y: joystick.y
        };
    
        $.ajax({
            url: "/update",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log("Joystick position sent successfully.");
            },
            error: function(error) {
                console.error("Error sending joystick position:", error);
            }
        });
    }
    
    function updatePositions() {
        $.getJSON('/get_positions', function(data) {
            var positions = data.positions;
            var position1 = positions[0];
            var position2 = positions[1];

            $('#pan_absolute').text(position1);
            $('#tilt_absolute').text(position2);
        });
    }


    // Call the updateNumbers function initially
    $(document).ready(function() {
        updatePositions();
    });

    $(document).ready(function() {
        $('.button').on('click', function(e) {
          e.preventDefault();
          var buttonValue = $(this).val();
        
          $.ajax({
            url: '/scenes',
            type: 'POST',
            data: {button: buttonValue},
            success: function(response) {
              $('#result').text('Result: ' + response.number);
            }
          });
        });
      });

    // Llama a la función sendJoystickPosition repetidamente para actualizar la posición del joystick en el servidor cada 100ms
    setInterval(sendJoystickPosition, 5000);
    
    // Dibujar el joystick inicialmente en el centro del canvas
    resetJoystickPosition();
});
