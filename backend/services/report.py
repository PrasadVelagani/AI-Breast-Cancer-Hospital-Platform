from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import os

def generate_report(data, gradcam_path=None):
    reports_dir = "reports"
    os.makedirs(reports_dir, exist_ok=True)

    timestamp = datetime.now()
    filename = f"breast_cancer_report_{timestamp.strftime('%Y%m%d_%H%M%S')}.pdf"
    file_path = os.path.join(reports_dir, filename)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    # ---------------- HEADER ----------------
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(
        width / 2,
        height - 50,
        "ABC MULTI-SPECIALITY HOSPITAL"
    )

    c.setFont("Helvetica", 11)
    c.drawCentredString(
        width / 2,
        height - 75,
        "AI-Based Breast Cancer Diagnostic Report"
    )

    # ---------------- DATE & TIME ----------------
    c.setFont("Helvetica", 10)
    c.drawRightString(
        width - 50,
        height - 110,
        f"Report Generated: {timestamp.strftime('%d-%m-%Y %H:%M:%S')}"
    )

    # ---------------- PATIENT DETAILS ----------------
    y = height - 150
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Patient Details")
    y -= 20

    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Patient Name: {data.get('patient_name')}")
    y -= 18
    c.drawString(50, y, f"Prediction: {data.get('prediction')}")
    y -= 18
    c.drawString(50, y, f"Confidence: {data.get('confidence')}%")
    y -= 18
    c.drawString(50, y, f"Risk Level: {data.get('risk_level')}")

    # ---------------- GRAD-CAM IMAGE (CENTERED) ----------------
    if gradcam_path and os.path.exists(gradcam_path):
        y -= 40
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(width / 2, y, "Grad-CAM Visualization")

        image_width = 320
        image_height = 220
        x_centered = (width - image_width) / 2

        c.drawImage(
            gradcam_path,
            x_centered,
            y - image_height - 10,
            width=image_width,
            height=image_height,
            preserveAspectRatio=True
        )

    # ---------------- DOCTOR SIGNATURE ----------------
    signature_y = 150

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, signature_y, "Doctor Verification")

    c.setFont("Helvetica", 10)
    c.drawString(50, signature_y - 25, "Doctor Name: Dr. ________________________")
    c.drawString(50, signature_y - 45, "Specialization: Oncologist / Pathologist")

    # Signature line (LEFT)
    c.line(50, signature_y - 80, 250, signature_y - 80)
    c.drawString(50, signature_y - 95, "Signature")

    # Date (RIGHT)
    c.drawString(350, signature_y - 95, f"Date: {timestamp.strftime('%d-%m-%Y')}")

    # ---------------- DISCLAIMER (SHORT & CLEAN) ----------------
    disclaimer_text = (
        "Disclaimer: This AI-generated report is intended for clinical decision support only. "
        "Final diagnosis and treatment decisions must be made by a certified medical professional."
    )

    c.setFont("Helvetica-Oblique", 9)
    c.drawCentredString(
        width / 2,
        30,
        disclaimer_text
    )

    # ---------------- SAVE PDF ----------------
    c.save()
    return file_path
