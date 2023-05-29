from flask import Flask, render_template, request, jsonify
import subprocess

app = Flask(__name__, template_folder='template', static_folder='static')

#Global variables
sensibility = 0

@app.route("/")
def index():
    """
    Ruta principal del servidor Flask.

    Retorna la plantilla 'index.html' con las opciones para un menú desplegable.

    Returns:
        render_template: Plantilla 'index.html' con las opciones para el menú desplegable.
    """

    dropdown_options = ["Option 12", "Option 2", "Option 3"]
    
    return render_template('index.html', dropdown_options=dropdown_options)

@app.route('/update', methods=['POST'])
def update():
    """
    Ruta para actualizar los valores de posición de un joystick.

    Obtiene los datos JSON enviados mediante una solicitud POST y realiza una acción con los valores recibidos.

    Returns:
        jsonify: Respuesta JSON con un indicador de éxito.
    """

    data = request.get_json()
    x = data['x']
    y = data['y']
    
    #Mapeo: EL joystick tiene va 50 a 170, con pasos de a 1, en cada eje. 
    #El eje X en los enteros y el Y siempre con .125 de decimal (excepto en los extremos)
    #pan_absolute y tilt_absolute van de -648000 a 648000 de pasos de a 3600 (359 estados)
    global sensibility
    
    move_pan  = (x - 110)/60 * sensibility * 3600
    move_tilt = (y - 110)/60 * sensibility * 3600
    
    print("Joystick movement - X:", move_pan, "Y:", move_tilt)

    pan_abs, tilt_abs = get_camera()
    
    if abs(pan_abs) < 648000 and abs(tilt_abs) < 648000:
        move_camera(pan_abs + move_pan, tilt_abs + move_tilt)
    elif abs(pan_abs) >= 648000 and abs(tilt_abs) < 648000:
        move_camera(pan_abs, tilt_abs + move_tilt)
    elif abs(pan_abs) < 648000 and abs(tilt_abs) >= 648000:
        move_camera(pan_abs + move_pan, tilt_abs)
    
    return jsonify(success=True)

@app.route('/button_click', methods=['POST'])
def button_click():
    """
    Ruta para realizar una acción al hacer clic en un botón.

    Realiza alguna acción específica al recibir una solicitud POST al hacer clic en el botón.

    Returns:
        jsonify: Respuesta JSON con un indicador de éxito.
    """

    # Realiza alguna acción al hacer clic en el botón
    print("Button clicked")
    
    return jsonify(success=True)

@app.route('/dropdown_select', methods=['POST'])
def dropdown_select():
    """
    Ruta para realizar una acción al seleccionar una opción de una lista desplegable.

    Obtiene los datos JSON enviados mediante una solicitud POST y realiza una acción con la opción seleccionada.

    Returns:
        jsonify: Respuesta JSON con un indicador de éxito.
    """

    data = request.get_json()
    selected_option = data['selectedOption']
    # Realiza alguna acción con la opción seleccionada en la lista desplegable
    print("Selected option:", selected_option)
    
    return jsonify(success=True)

@app.route('/update_slider', methods=['POST'])
def update_slider():
    """
    Ruta para actualizar un valor de un control deslizante.

    Obtiene el valor enviado mediante una solicitud POST y realiza las acciones deseadas con el valor recibido.

    Returns:
        str: Cadena de texto 'OK' como indicador de éxito.
    """
    
    global sensibility
    sensibility = float(request.form.get('value'))/10
    # Realiza las acciones deseadas con el valor recibido
    print('Sensibility', sensibility)
    # Puedes devolver una respuesta al cliente si es necesario
    
    return 'OK'

# Function to send the pan and tilt commands to the camera
def move_camera(pan, tilt):
    command = f"v4l2-ctl -d /dev/vido0 --set-ctrl=pan_absolute={pan} --set-ctrl=tilt_absolute{tilt}"
    subprocess.run(
        command, shell=True
    )  # Replace with the appropriate command for your camera control

def get_camera():
    command = f"v4l2-ctl -d /dev/vido0 --get-ctrl=pan_absolute --get-ctrl=tilt_absolute"
    proc = subprocess.run(
        command, shell=True
    )  # Replace with the appropriate command for your camera control
    
    proc_output = proc.stdout.splitlines()
    
    pan_abs = int(proc_output[0][14:])
    tilt_abs = int(proc_output[1][15:])

    return pan_abs, tilt_abs

if __name__ == '__main__':
    """
    Función principal para ejecutar la aplicación Flask.

    Inicia el servidor Flask en modo de depuración (debug) en la dirección '0.0.0.0' y el puerto 5000.

    """
    
    app.run(debug=True, host='0.0.0.0', port=5000)
