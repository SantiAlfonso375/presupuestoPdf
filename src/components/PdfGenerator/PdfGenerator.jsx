import React, { useState, useRef } from "react";

import jsPDF from "jspdf";
import "./PdfGenerator.css";

const PdfGenerator = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    invoiceItems: [{ description: "", price: "", quantity: "" }],
  });

  const logoRef = useRef(null);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "description" || name === "price" || name === "quantity") {
      const updatedItems = [...formData.invoiceItems];
      if (index !== undefined) {
        updatedItems[index] = {
          ...updatedItems[index],
          [name]:
            name === "price" || name === "quantity" ? parseFloat(value) : value,
        };
      }
      setFormData({ ...formData, invoiceItems: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addInvoiceItem = () => {
    setFormData({
      ...formData,
      invoiceItems: [
        ...formData.invoiceItems,
        { description: "", price: "", quantity: "" },
      ],
    });
  };

  const removeInvoiceItem = (index) => {
    const updatedItems = formData.invoiceItems.filter((_, i) => i !== index);
    setFormData({ ...formData, invoiceItems: updatedItems });
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      invoiceItems: [{ description: "", price: "", quantity: "" }],
    });
    if (logoRef.current) {
      logoRef.current.value = "";
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Obtener la fecha en formato DD-MM-YYYY
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getFullYear()}`;

    // Calcular el total
    const totalAmount = formData.invoiceItems.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0,
    );

    let logoDataURL = "";
    if (logoRef.current?.files?.[0]) {
      const logoFile = logoRef.current.files[0];
      logoDataURL = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(logoFile);
      });
    }

    // Estilos generales
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PRESUPUESTO", 105, 20, { align: "center" });

    // Agregar logo si existe
    if (logoDataURL) {
      doc.addImage(logoDataURL, "JPEG", 150, 10, 40, 20);
    }

    // Información del cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${formData.clientName}`, 10, 40);
    doc.text(`Correo: ${formData.clientEmail}`, 10, 50);
    doc.text(`Fecha: ${formattedDate}`, 10, 60);

    // Línea divisoria
    doc.line(10, 70, 200, 70);

    // Encabezado de tabla estilo grilla
    doc.setFont("helvetica", "bold");
    doc.text("Descripción", 10, 80);
    doc.text("Cantidad", 85, 80, { align: "center" });
    doc.text("Precio Unitario", 130, 80, { align: "center" });
    doc.text("Subtotal", 180, 80, { align: "center" });

    // Dibujar la grilla
    let yOffset = 85;
    doc.line(10, yOffset, 200, yOffset); // Línea superior de la tabla
    yOffset += 5;

    formData.invoiceItems.forEach((item) => {
      const subtotal = item.price * item.quantity;

      doc.setFont("helvetica", "normal");
      doc.text(item.description, 10, yOffset + 5);
      doc.text(item.quantity.toString(), 90, yOffset + 5, { align: "center" });
      doc.text(`$${item.price.toFixed(2)}`, 130, yOffset + 5, {
        align: "center",
      });
      doc.text(`$${subtotal.toFixed(2)}`, 180, yOffset + 5, {
        align: "center",
      });

      // Línea divisoria para cada fila
      yOffset += 10;
      doc.line(10, yOffset, 200, yOffset);
    });

    // Línea divisoria antes del total
    // doc.line(10, yOffset + 5, 200, yOffset + 5)

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Total: $${totalAmount.toFixed(2)}`, 140, yOffset + 15, {
      align: "center",
    });

    // Mensaje de agradecimiento
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      `©${today.getFullYear()} ${formData.clientName}. Este documento es un presupuesto y no es válido como factura.`,
      10,
      yOffset + 30,
      {
        align: "justify",
      },
    );

    // Guardar PDF con formato Presupuesto[fecha].pdf
    doc.save(`Presupuesto_${formattedDate}.pdf`);
    resetForm();
  };

  return (
    <div className="container">
      <h1 className="title">Generador de Presupuesto</h1>

      <div className="input-group imgLogo">
        <label>Logo de tu Empresa:</label>
        <input type="file" ref={logoRef} accept="image/*" />
      </div>
      <div className="inputGrup">
        <div className="input-group">
          <label>Nombre de tu empresa:</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="input-group">
          <label>Email de tu empresa:</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            className="input"
          />
        </div>
      </div>

      <div className="items-container">
        <h2 className="subTitle">Items de Herramientas:</h2>
        {formData.invoiceItems.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              name="description"
              value={item.description}
              onChange={(e) => handleInputChange(e, index)}
              className="input"
              placeholder="Nombre/descripción"
            />
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleInputChange(e, index)}
              className="input small-input"
              placeholder="Precio Unitario"
            />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, index)}
              className="input small-input"
              placeholder="Cantidad"
            />
            <button
              onClick={() => removeInvoiceItem(index)}
              className="button button-red"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button onClick={addInvoiceItem} className="button button-blue">
          Agregar Item
        </button>
      </div>

      <div className="generateContainer">
        <button onClick={generatePDF} className=" button-green">
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default PdfGenerator;
