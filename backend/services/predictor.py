import tensorflow as tf
import numpy as np
import cv2
import os
import uuid
from tensorflow.keras.models import load_model

# -------------------------------
# 🔴 CUSTOM F1 SCORE (VERY IMPORTANT)
# -------------------------------
def f1_score(y_true, y_pred):
    y_pred = tf.round(y_pred)

    tp = tf.reduce_sum(tf.cast(y_true * y_pred, tf.float32))
    precision = tp / (tf.reduce_sum(y_pred) + 1e-7)
    recall = tp / (tf.reduce_sum(y_true) + 1e-7)

    return 2 * ((precision * recall) / (precision + recall + 1e-7))


# -------------------------------
# LOAD TRAINED MODEL
# -------------------------------
MODEL_PATH = "model/enhanced_breast_cancer_model.keras"

model = load_model(
    MODEL_PATH,
    custom_objects={"f1_score": f1_score}   # ⭐ THIS FIXES ERROR
)

IMG_SIZE = 224

# -------------------------------
# IMAGE PREPROCESS
# -------------------------------
def preprocess_image(path):
    img = cv2.imread(path)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    img = np.reshape(img, (1, IMG_SIZE, IMG_SIZE, 3))
    return img


# -------------------------------
# PREDICTION FUNCTION
# -------------------------------
def predict_image(image_path):
    img = preprocess_image(image_path)

    pred = model.predict(img)[0][0]

    prediction = "Malignant" if pred > 0.5 else "Benign"
    confidence = round(float(pred if pred > 0.5 else 1 - pred) * 100, 2)

    risk = "High Risk" if confidence > 80 else "Medium Risk" if confidence > 60 else "Low Risk"

    return {
        "prediction": prediction,
        "confidence": confidence,
        "risk_level": risk
    }


# -------------------------------
# GRADCAM
# -------------------------------
# -------------------------------
# GRADCAM (FINAL FIXED VERSION)
# -------------------------------
def save_gradcam(image_path):
    img = preprocess_image(image_path)

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer("block5_conv3").output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # ⭐ FIXED PART
    heatmap = np.maximum(heatmap, 0)
    heatmap /= np.max(heatmap)

    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    original = cv2.imread(image_path)
    original = cv2.resize(original, (224, 224))

    superimposed = cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)

    filename = f"{uuid.uuid4()}.png"
    save_path = os.path.join("uploads", filename)
    cv2.imwrite(save_path, superimposed)

    return save_path

    # Save GradCAM image
