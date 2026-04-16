import os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.metrics import precision_recall_curve, auc
import tensorflow.keras.backend as K

# ===============================
# CONFIG
# ===============================
dataset_path = r"D:\Breast cancer\BreakHis - Breast Cancer Histopathological Database\dataset_cancer_v1\dataset_cancer_v1\classificacao_binaria\100X"
img_size = 224
batch_size = 32
epochs = 25   # 🔥 increased

os.makedirs("output_plots", exist_ok=True)

# ===============================
# DATA
# ===============================
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=25,
    zoom_range=0.3,
    horizontal_flip=True,
    width_shift_range=0.1,
    height_shift_range=0.1
)

val_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_gen = train_datagen.flow_from_directory(
    dataset_path,
    target_size=(img_size, img_size),
    batch_size=batch_size,
    class_mode="binary",
    subset="training",
    shuffle=True
)

val_gen = val_datagen.flow_from_directory(
    dataset_path,
    target_size=(img_size, img_size),
    batch_size=batch_size,
    class_mode="binary",
    subset="validation",
    shuffle=False
)

# ===============================
# MODEL
# ===============================
base_model = VGG16(weights="imagenet", include_top=False, input_shape=(img_size, img_size, 3))

# 🔥 more layers train
for layer in base_model.layers[:-20]:
    layer.trainable = False
for layer in base_model.layers[-20:]:
    layer.trainable = True

x = Flatten()(base_model.output)

x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)

x = Dense(256, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)

output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base_model.input, outputs=output)

# ===============================
# 🔥 FOCAL LOSS (KEY BOOST)
# ===============================
def focal_loss(alpha=0.25, gamma=2.0):
    def loss(y_true, y_pred):
        y_pred = K.clip(y_pred, 1e-7, 1 - 1e-7)
        pt = tf.where(tf.equal(y_true, 1), y_pred, 1 - y_pred)
        return -K.mean(alpha * K.pow(1. - pt, gamma) * K.log(pt))
    return loss

model.compile(
    optimizer=Adam(learning_rate=0.00003),  # 🔥 lower LR
    loss=focal_loss(),
    metrics=[
        "accuracy",
        tf.keras.metrics.Precision(name="precision"),
        tf.keras.metrics.Recall(name="recall")
    ]
)

# ===============================
# CALLBACKS
# ===============================
early_stop = EarlyStopping(monitor='val_loss', patience=6, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3)

# ===============================
# 🔥 STRONG CLASS WEIGHT
# ===============================
class_weight = {0: 1.0, 1: 2.5}

# ===============================
# TRAIN
# ===============================
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=epochs,
    callbacks=[early_stop, reduce_lr],
    class_weight=class_weight
)

# ===============================
# SAVE MODEL
# ===============================
model.save("enhanced_breast_cancer_model.h5")
print("✅ Model Saved")

# ===============================
# PR CURVE
# ===============================
print("\n📊 Generating PR Curve...")

val_gen.reset()

y_pred = model.predict(val_gen).ravel()
y_true = val_gen.classes

precision, recall, _ = precision_recall_curve(y_true, y_pred)
pr_auc = auc(recall, precision)

print(f"🔥 FINAL PR AUC: {pr_auc:.2f}")

# ===============================
# GRAPH
# ===============================
plt.style.use("dark_background")

plt.figure(figsize=(6,5))
plt.plot(recall, precision, color="orange", linewidth=2, label=f"PR AUC = {pr_auc:.2f}")

plt.xlabel("Recall")
plt.ylabel("Precision")
plt.title("Precision-Recall Curve")
plt.legend()
plt.grid(True)

plt.savefig("output_plots/precision_recall_curve.png", dpi=300)
plt.show()

print("📁 Graph saved successfully!")