import os
import uuid
import numpy as np
import tensorflow as tf
import cv2
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
from datetime import datetime

# REPORTLAB
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER

app = Flask(__name__)
CORS(app)

# ================= PATHS =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.h5")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

print("Loading AI Model...")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("Model Loaded Successfully!")

# ================= IMAGE PREPROCESS =================
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224,224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)/255.0
    return img

# ================= RISK =================
def calculate_risk(conf):
    if conf > 85:
        return "High Risk"
    elif conf > 65:
        return "Medium Risk"
    else:
        return "Low Risk"

# ================= GRADCAM =================
def generate_gradcam(img_array):
    last_conv = [l.name for l in model.layers if "conv" in l.name][-1]

    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_out, preds = grad_model(img_array)
        loss = preds[:,0]

    grads = tape.gradient(loss, conv_out)
    pooled_grads = tf.reduce_mean(grads, axis=(0,1,2))
    conv_out = conv_out[0]

    heatmap = conv_out @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap).numpy()

    heatmap = np.maximum(heatmap,0)
    heatmap = heatmap / (np.max(heatmap) + 1e-8)

    heatmap = cv2.resize(heatmap,(224,224))
    heatmap = np.uint8(255*heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    filename = str(uuid.uuid4()) + ".png"
    cv2.imwrite(os.path.join(UPLOAD_FOLDER, filename), heatmap)

    return filename

# ================= PDF GENERATOR =================
def create_pdf(data):
    
    # ✅ ONLY FIX: hospital name (DO NOT TOUCH ANYTHING ELSE)
    hospital = data.get("hospitalName")
    if not hospital:
        hospital = "Hospital"

    doctor = data.get("doctorName", "Doctor")
    patient = data.get("patientName", "")
    age = data.get("age", "")
    gender = data.get("gender", "")
    prediction = data.get("prediction", "")
    confidence = data.get("confidence", "")
    risk = data.get("risk", "")

    original_file = data.get("original")
    gradcam_file = data.get("gradcam")

    original_img = os.path.join(UPLOAD_FOLDER, original_file) if original_file else None
    gradcam_img = os.path.join(UPLOAD_FOLDER, gradcam_file) if gradcam_file else None

    filename = f"{patient}_report.pdf"
    pdf_path = os.path.join(REPORT_FOLDER, filename)

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()
    story = []

    # ================= HEADER =================
    hospital_style = ParagraphStyle("hospital", alignment=TA_CENTER, fontSize=20)
    title_style = ParagraphStyle("title", alignment=TA_CENTER, fontSize=16)

    # ✅ ONLY CHANGE HERE (hospital dynamic)
    story.append(Paragraph(f"<b>{hospital}</b>", hospital_style))
    story.append(Spacer(1,8))

    story.append(Paragraph("<b>AI DIAGNOSIS REPORT</b>", title_style))
    story.append(Spacer(1,8))

    today = datetime.now().strftime("%d %B %Y   %I:%M %p")
    story.append(Paragraph(f"<para align=right>{today}</para>", styles['Normal']))
    story.append(Spacer(1,20))

    # ================= TABLE =================
    table_data = [
        ["Patient Name", patient],
        ["Age", age],
        ["Gender", gender],
        ["Prediction", prediction],
        ["Confidence", f"{confidence}%"],
        ["Risk Level", risk],
    ]

    table = Table(table_data, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),1,colors.black),
        ("INNERGRID",(0,0),(-1,-1),0.5,colors.grey),
        ("BACKGROUND",(0,0),(0,-1),colors.lightgrey),
        ("PADDING",(0,0),(-1,-1),8),
    ]))

    story.append(table)
    story.append(Spacer(1,20))

    # ================= IMAGES (RESTORED) =================
    if original_img and gradcam_img and os.path.exists(original_img) and os.path.exists(gradcam_img):
        story.append(Paragraph("<para align=center><b>Original Image & GradCAM</b></para>", styles['Heading2']))
        story.append(Spacer(1,10))

        img_table = Table([
            [
                Image(original_img, 2.4*inch, 2.4*inch),
                Image(gradcam_img, 2.4*inch, 2.4*inch)
            ]
        ])
        story.append(img_table)
        story.append(Spacer(1,20))

    # ================= DOCTOR SIGN =================
    story.append(Paragraph(f"Doctor: <b>{doctor}</b>", styles['Normal']))
    story.append(Spacer(1,25))
    story.append(Paragraph("Signature: ____________________", styles['Normal']))
    story.append(Spacer(1,20))

    # ================= DISCLAIMER =================
    disclaimer = """
    <para align=center>
    <font size=8>
    This AI-generated report is a clinical decision support tool. Final diagnosis must be confirmed by certified medical professionals.
    </font>
    </para>
    """
    story.append(Paragraph(disclaimer, styles['Normal']))

    doc.build(story)

    return filename

# ================= PREDICT =================
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files['file']

    filename = str(uuid.uuid4()) + ".png"
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    img = preprocess_image(path)
    pred = model.predict(img)[0][0]

    confidence = round(float(pred * 100), 2)
    label = "Malignant" if pred > 0.5 else "Benign"
    risk = calculate_risk(confidence)

    gradcam_file = generate_gradcam(img)

    return jsonify({
        "prediction": label,
        "confidence": confidence,
        "risk": risk,
        "gradcam": gradcam_file,
        "original": filename
    })

# ================= GENERATE REPORT =================
@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        data = request.json

        pdf_name = create_pdf(data)

        return jsonify({
            "pdf": pdf_name
        })

    except Exception as e:
        print("PDF ERROR:", e)
        return jsonify({"error": str(e)}), 500

# ================= SERVE FILES =================
@app.route("/uploads/<filename>")
def serve_upload(filename):
    path = os.path.join(UPLOAD_FOLDER, filename)

    if os.path.exists(path):
        return send_file(path)

    return "Image not found", 404

@app.route("/download/<filename>")
def download_file(filename):
    path = os.path.join(REPORT_FOLDER, filename)

    if os.path.exists(path):
        return send_file(path, as_attachment=True)

    return "File not found", 404

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True)