import numpy as np
import cv2
import tensorflow as tf
import tkinter as tk
from tkinter import filedialog
from tensorflow.keras.models import load_model
from PIL import Image, ImageTk

MODEL_PATH = "enhanced_breast_cancer_model.h5"
IMG_SIZE = 224
THRESHOLD = 0.6  # 🔥 improved threshold

model = load_model(MODEL_PATH)

# ===============================
# LOAD IMAGE
# ===============================
def load_image(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

    # 🔥 noise reduction
    img = cv2.GaussianBlur(img, (3,3), 0)

    img_array = img / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array, img

# ===============================
# GRAD CAM
# ===============================
def grad_cam(img_path):
    img_array, original_img = load_image(img_path)

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer("block5_conv3").output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0,1,2))

    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)

    heatmap = np.maximum(heatmap, 0)
    heatmap /= np.max(heatmap) + 1e-10

    heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    superimposed_img = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)

    prob = float(predictions[0][0])
    class_index = int(prob > THRESHOLD)

    confidence = prob if class_index == 1 else 1 - prob

    return class_index, confidence, superimposed_img

# ===============================
# CLASSIFY
# ===============================
def classify_image():
    file_path = filedialog.askopenfilename()

    if not file_path:
        return

    class_index, confidence, heatmap_img = grad_cam(file_path)

    original = Image.open(file_path).resize((300,300))
    original_tk = ImageTk.PhotoImage(original)

    heatmap = Image.fromarray(cv2.cvtColor(heatmap_img, cv2.COLOR_BGR2RGB)).resize((300,300))
    heatmap_tk = ImageTk.PhotoImage(heatmap)

    img_label.config(image=original_tk)
    img_label.image = original_tk

    heatmap_label.config(image=heatmap_tk)
    heatmap_label.image = heatmap_tk

    diagnosis = "Malignant 🔴" if class_index else "Benign 🟢"

    result_label.config(
        text=f"Prediction: {diagnosis}\nConfidence: {confidence*100:.2f}%",
        fg="blue",
        font=("Arial", 13, "bold")
    )

# ===============================
# GUI
# ===============================
root = tk.Tk()
root.title("Breast Cancer Detection")
root.geometry("720x720")

tk.Label(root, text="Breast Cancer Detection", font=("Arial",16,"bold")).pack(pady=10)

tk.Button(root, text="Select Image", command=classify_image, font=("Arial",14)).pack(pady=10)

img_label = tk.Label(root)
img_label.pack()

heatmap_label = tk.Label(root)
heatmap_label.pack()

result_label = tk.Label(root, text="")
result_label.pack(pady=15)

root.mainloop()