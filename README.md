# Orsai Insta360

A brief description of what this project does.
Este proyecto permite controlar el movimiento de una cámara Insta360 Link desde una webapp y su transmisión de video utilizando una Raspberry Pi4 Model B.
## Tabla de contenidos

- [Características](#características)
- [Instalación](#Instalacion)
- [Uso](uso)

## Características

![image](https://github.com/orsai-tech/orsai-insta360/assets/120752749/580f2fe3-61da-4c6d-8686-64cdb9fb930c)

En la webapp se cuenta con:
- Joystick: Permite mover la cámara según el punto de vista de lo observado en la transmisión.
- Indicador de posición: Indica la posición en ambos ejes, los valores van desde 1 hasta 360.
- Sensibilidad: Con un deslizable permite controlar la relación de movimiento de la cámara relativo al del joystick.  
- Menú de escenas: Permite alamcenar y cargar hasta 3 posiciones de la cámara.

## Instalación

Para la puesta en marcha del sistema se deben seguir los siguientes pasos:
1. Instalación del sistema operativo

Se flashea una Micro SD con el sistema _Raspberry Pi OS (64-bits) Debian Bullseye_ y se actualizó utilizando `sudo apt-get update && upgrade`.

2. Instalación de dependencias
  
Se instalan las siguientes librerias:

`sudo apt-get install v4l-utils`

`sudo apt install unclutter`

`sudo apt install ffmpeg`

`sudo apt install xdotool`

`sudo apt install xterm`

3. Clonación de archivos

Se debe clonar el repositorio y colocar las siguientes carpetas en los directorios especificados:

- Los 3 servicios (_inicio_app.service_, _inicio_kiosko.service_, _inicio_max.service_)  --->  _/etc/systemd/system_
- La carpeta _app/_  --->  _/home/camara/orsai-insta360/_
- El archivo _xtermin_init.sh_  --->  _/home/camara/Kiosko/_
- El archivo _xterm_max.sh_  --->  _/home/camara/Kiosko/_

## Uso

Para la utilización del equipo se debe conectar la cámara, la salida HDMI y la alimentación y esperar a que el sistema cargue y se observe correctamente la transmisión del video.

Si se observa algún tipo de delay o problemas de transmisión se recomienda desconectar la alimentación del equipo, esperar 20 segundos y reconectarla.

A su vez, se debe utilizar un scaner de Ips (Como puede ser el Angry IP Scanner) para encontrar la dirección IP asignada a la Rasberry Pi y colocarla en algún navegador con la forma de _http://192.168.X.XX:5000/_ para poder utilizar la webapp.

