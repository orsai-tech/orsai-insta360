import pygame
import subprocess
import time

# Initialize pygame
pygame.init()


# Set the width and height of the window
window_width, window_height = 1000, 1000
window = pygame.display.set_mode((window_width, window_height))
pygame.display.set_caption("Joystick Camera Control")

# Camera configuration
pan_range = 648000  # Total range of pan (horizontal) movement
tilt_range = 648000  # Total range of tilt (vertical) movement

# Joystick configuration
joystick_radius = 500
joystick_pos = [window_width // 2, window_height // 2]
joystick_offset = [0, 0]

# Colors
white = (255, 255, 255)
black = (0, 0, 0)
blue = (0, 0, 255)

camera_positions = {
    pygame.K_LEFT: (0, 0),  # Center position
    pygame.K_RIGHT: (pan_range, 0),  # Full right position
    pygame.K_2: (-pan_range, 0),  # Full left position
    pygame.K_3: (0, tilt_range),  # Full up position
    pygame.K_4: (0, -tilt_range),  # Full down position
    # Add more key-value pairs as needed for additional camera positions
}


# Function to send the pan and tilt commands to the camera
def move_camera(pan, tilt):
    command = f"uvcc --vendor 11802 --product 19457 set absolute_pan_tilt {pan} {tilt}"
    subprocess.run(
        command, shell=True
    )  # Replace with the appropriate command for your camera control


# Debounce configuration
debounce_delay = 0  # Delay between consecutive camera movements (in seconds)
last_move_time = time.time() - debounce_delay  # Initialize last movement time

# Main loop
running = True
while running:
    # Handle key press events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key in camera_positions:
                print(f"Moving to position {event.key}")
                pan, tilt = camera_positions[event.key]
                move_camera(pan, tilt)
                # Delay 5 seconds
                time.sleep(5)

    # Clear the window
    window.fill(white)

    # Get mouse position
    mouse_pos = pygame.mouse.get_pos()

    # Calculate joystick offset based on mouse position
    joystick_offset = [mouse_pos[0] - joystick_pos[0], mouse_pos[1] - joystick_pos[1]]

    # Calculate joystick input based on offset and radius
    horizontal_axis = joystick_offset[0] / joystick_radius
    vertical_axis = joystick_offset[1] / joystick_radius

    # Limit joystick input to range [-1, 1]
    horizontal_axis = max(-1, min(horizontal_axis, 1))
    vertical_axis = max(-1, min(vertical_axis, 1))

    # Calculate joystick offset based on mouse position with smoothing
    smoothing_factor = (
        0.1  # Adjust this value to control the smoothing effect (0.0 to 1.0)
    )
    smoothed_joystick_offset = [
        joystick_offset[0] + (horizontal_axis - joystick_offset[0]) * smoothing_factor,
        joystick_offset[1] + (vertical_axis - joystick_offset[1]) * smoothing_factor,
    ]

    # Calculate pan and tilt angles based on joystick positions
    pan_angle = int(smoothed_joystick_offset[0] / joystick_radius * pan_range)
    tilt_angle = int(-smoothed_joystick_offset[1] / joystick_radius * tilt_range)

    # Draw joystick base
    pygame.draw.circle(window, black, joystick_pos, joystick_radius, 2)

    # Draw joystick handle
    handle_pos = [
        joystick_pos[0] + joystick_offset[0],
        joystick_pos[1] + joystick_offset[1],
    ]
    pygame.draw.circle(window, blue, handle_pos, 20)

    # Check debounce timer
    # current_time = time.time()
    # if current_time - last_move_time >= debounce_delay:
    # Send the pan and tilt commands to the camera
    move_camera(pan_angle, tilt_angle)
    # last_move_time = current_time

    # Update the window
    pygame.display.flip()


# Quit the program
pygame.quit()
