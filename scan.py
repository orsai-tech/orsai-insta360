import usb
import usb.core
import usb.util

def reverse_engineer_usb():
    # Find the webcam device using its vendor ID and product ID
    vendor_id = 0x2e1a  # Replace with the actual vendor ID
    product_id = 0x4c01  # Replace with the actual product ID
    dev = usb.core.find(idVendor=vendor_id, idProduct=product_id)
    
    if dev is None:
        print("Webcam device not found.")
        return
    
    print("Ok here.")

    # Set the configuration for the device
    dev.set_configuration()
    
    # Get the first interface and endpoint
    interface = dev.get_active_configuration()[(0, 0)]
    endpoint = usb.util.find_descriptor(interface, custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_IN)
    
    if endpoint is None:
        print("Endpoint not found.")
        return
    
    try:
        while True:
            # Read USB packets from the endpoint
            data = dev.read(endpoint.bEndpointAddress, endpoint.wMaxPacketSize)
            
            # Display the USB packet data
            print(f"Received: {data}")
    
    except KeyboardInterrupt:
        pass
    
    finally:
        # Release the USB device
        usb.util.release_interface(dev, interface)
        usb.util.dispose_resources(dev)
if __name__ == "__main__":
    reverse_engineer_usb()