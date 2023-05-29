from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='template', static_folder='static')

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
    # Realiza alguna acción con los valores x e y, por ejemplo, imprimirlos en la consola
    print("Joystick position - X:", x, "Y:", y)
    
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
    value = request.form.get('value')
    # Realiza las acciones deseadas con el valor recibido
    print(value)
    # Puedes devolver una respuesta al cliente si es necesario
    
    return 'OK'

if __name__ == '__main__':
    """
    Función principal para ejecutar la aplicación Flask.

    Inicia el servidor Flask en modo de depuración (debug) en la dirección '0.0.0.0' y el puerto 5000.

    """
    
    app.run(debug=True, host='0.0.0.0', port=5000)
