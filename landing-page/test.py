import sys
print(sys.version)
try:
    import PIL
    from PIL import Image
    print("Pillow is installed")
except ImportError:
    print("Pillow is NOT installed")
