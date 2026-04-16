import numpy as np
import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
from sklearn.metrics import precision_recall_curve, auc
import tensorflow as tf

# load model
model = tf.keras.models.load_model("enhanced_breast_cancer_model.h5", compile=False)

# reuse validation data
from tensorflow.keras.preprocessing.image import ImageDataGenerator

dataset_path = r"D:\Breast cancer\BreakHis - Breast Cancer Histopathological Database\dataset_cancer_v1\dataset_cancer_v1\classificacao_binaria\100X"

val_gen = ImageDataGenerator(rescale=1./255, validation_split=0.2).flow_from_directory(
    dataset_path,
    target_size=(224,224),
    batch_size=32,
    class_mode="binary",
    subset="validation",
    shuffle=False
)

# predictions
y_pred = model.predict(val_gen).ravel()
y_true = val_gen.classes

precision, recall, _ = precision_recall_curve(y_true, y_pred)
pr_auc = auc(recall, precision)

# plot
plt.figure(figsize=(6,5))
plt.plot(recall, precision, label=f"PR AUC = {pr_auc:.2f}", color="orange")
plt.xlabel("Recall")
plt.ylabel("Precision")
plt.title("Precision-Recall Curve")
plt.legend()
plt.grid()

plt.savefig("output_plots/precision_recall_curve.png", dpi=300)

print(f"✅ Graph generated! PR AUC: {pr_auc:.2f}")