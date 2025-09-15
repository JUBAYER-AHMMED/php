from PIL import Image
import numpy as np

# -------------------------
# Encode HTML file inside image
# -------------------------
def encode_file(image_path, file_path, output_path):
    # Load image
    img = Image.open(image_path)
    arr = np.array(img)
    
    # Read file bytes
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    
    # Convert bytes to binary
    binary_text = ''.join(format(b, '08b') for b in file_bytes)
    binary_text += '1111111111111110'  # delimiter
    
    flat = arr.flatten().astype(np.uint8)
    
    if len(binary_text) > len(flat):
        raise ValueError(f"File too big! Max capacity = {len(flat)//8} bytes")
    
    # Hide bits in LSB
    for i in range(len(binary_text)):
        flat[i] = np.uint8((int(flat[i]) & ~1) | int(binary_text[i]))
    
    arr = flat.reshape(arr.shape).astype(np.uint8)
    Image.fromarray(arr).save(output_path)
    print(f"✅ HTML file hidden inside {output_path}")


# -------------------------
# Decode HTML file from image
# -------------------------
def decode_file(image_path, output_file):
    img = Image.open(image_path)
    arr = np.array(img).flatten()
    
    bits = [str(int(b)&1) for b in arr]
    
    chars = [''.join(bits[i:i+8]) for i in range(0, len(bits), 8)]
    file_bytes = bytearray()
    
    for c in chars:
        if c == '11111110':  # delimiter
            break
        file_bytes.append(int(c, 2))
    
    with open(output_file, "wb") as f:
        f.write(file_bytes)
    
    print(f"🔍 Extracted HTML saved as {output_file}")


# -------------------------
# Example usage
# -------------------------
encode_file("home-burger.png", "index.html", "output1.png")      # hide
decode_file("output.png", "recovered.html")           # extract
