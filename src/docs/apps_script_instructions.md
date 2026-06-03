# Integración de Correos Automatizados (Google Apps Script)

Esta guía contiene las instrucciones y el código necesario para actualizar tu Google Apps Script. Esto permitirá que cuando un usuario envíe el formulario de contacto principal:
1. Se guarde la información en tu hoja de cálculo de Google (como ya lo hace).
2. Se te envíe una notificación instantánea a tu correo con los detalles del usuario.
3. Se le envíe un correo electrónico de confirmación de recepción automático y personalizado al usuario.

Ambos correos están diseñados con una **plantilla HTML responsive** que utiliza el estilo estético oscuro con acentos de neón (cyan y violeta) de tu portafolio.

---

## Instrucciones de Instalación

1. Ve a tu cuenta de Google Drive y abre la hoja de cálculo donde recibes los mensajes.
2. En la barra superior, haz clic en **Extensiones** ➔ **Apps Script**.
3. Reemplaza todo el código del editor por el código proporcionado a continuación.
4. Recuerda reemplazar el correo `gjvo93@gmail.com` por el correo donde deseas recibir tus notificaciones (en la línea 24).
5. Guarda el proyecto (icono de disquete) y haz clic en **Implementar** ➔ **Gestionar implementaciones** ➔ **Editar** (icono de lápiz) ➔ **Nueva versión** ➔ **Implementar**.
6. Acepta los permisos de Google que te solicite para enviar correos en tu nombre.

---

## Código Completo de Google Apps Script

```javascript
function doPost(e) {
  // Configuración de CORS y respuesta base
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // 1. Guardar en la hoja de cálculo de Google Sheets
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.fecha,
      data.nombre,
      data.email,
      data.telefono,
      data.pais,
      data.mensaje
    ]);
    
    // 2. Ejecutar envíos de correos electrónicos automatizados
    sendNotificationEmails(data);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

// Permitir peticiones preflight OPTIONS si ocurriesen
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

function sendNotificationEmails(data) {
  var adminEmail = "gjvo93@gmail.com"; // <-- REEMPLAZA CON TU CORREO PARA RECIBIR NOTIFICACIONES
  
  // 1. Enviar notificación al Administrador (Gabriel)
  var adminSubject = "⚡ Nuevo Mensaje del Portafolio: " + data.nombre;
  var adminBody = getAdminEmailHtml(data);
  MailApp.sendEmail({
    to: adminEmail,
    subject: adminSubject,
    htmlBody: adminBody
  });
  
  // 2. Enviar confirmación al Usuario
  var userSubject = "🚀 ¡Mensaje recibido! Gracias por contactarme";
  var userBody = getUserEmailHtml(data);
  MailApp.sendEmail({
    to: data.email,
    subject: userSubject,
    htmlBody: userBody
  });
}

// ── PLANTILLA 1: CORREO PARA EL ADMINISTRADOR (GABRIEL) ───────────────────────
function getAdminEmailHtml(data) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body style="background-color: #0a0a0c; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px 20px; color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #111115; border-radius: 20px; border: 1px solid #1f1f2e; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      
      <!-- Top Neon Accent line -->
      <div style="height: 4px; background: linear-gradient(90deg, #00f2fe, #7c3aed);"></div>
      
      <!-- Content Area -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #00f2fe; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">⚡ NUEVO MENSAJE REGISTRADO</h2>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">Un usuario ha completado el formulario de contacto directo en tu portafolio. A continuación se detallan los datos ingresados:</p>
        
        <!-- Data Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #94a3b8; font-size: 13px; font-weight: 600; width: 30%;">Nombre:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #f8fafc; font-size: 14px; font-weight: 700;">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #94a3b8; font-size: 13px; font-weight: 600;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #00f2fe; font-size: 14px; font-weight: 700;"><a href="mailto:${data.email}" style="color:#00f2fe; text-decoration:none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #94a3b8; font-size: 13px; font-weight: 600;">Teléfono:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #f8fafc; font-size: 14px; font-weight: 700;">${data.telefono}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #94a3b8; font-size: 13px; font-weight: 600;">País:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #f8fafc; font-size: 14px; font-weight: 700;">${data.pais}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #94a3b8; font-size: 13px; font-weight: 600;">Fecha:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1f1f2e; color: #f8fafc; font-size: 13px;">${data.fecha}</td>
          </tr>
        </table>
        
        <!-- Message Box -->
        <div style="background-color: #07070a; border-radius: 12px; padding: 20px; border-left: 3px solid #7c3aed; margin-bottom: 30px;">
          <h4 style="color: #f8fafc; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje enviado:</h4>
          <p style="color: #e2e8f0; font-size: 13.5px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.mensaje}</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #07070a; padding: 20px 30px; text-align: center; border-top: 1px solid #1f1f2e;">
        <p style="color: #64748b; font-size: 11px; margin: 0;">Este correo fue generado automáticamente por el formulario de tu portafolio.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// ── PLANTILLA 2: CORREO DE CONFIRMACIÓN PARA EL USUARIO ──────────────────────
function getUserEmailHtml(data) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body style="background-color: #0a0a0c; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px 20px; color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #111115; border-radius: 20px; border: 1px solid #1f1f2e; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      
      <!-- Top Neon Accent line -->
      <div style="height: 4px; background: linear-gradient(90deg, #00f2fe, #7c3aed);"></div>
      
      <!-- Content Area -->
      <div style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h3 style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">GABRIEL VAZQUEZ</h3>
          <h1 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">¡Gracias por ponerte en contacto!</h1>
        </div>
        
        <p style="color: #e2e8f0; font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">Hola <strong>${data.nombre}</strong>,</p>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">He recibido correctamente tu mensaje desde mi portafolio. Ya estoy revisando la información y me pondré en contacto contigo a la brevedad posible para que podamos agendar un **diagnóstico tecnológico gratuito** y conversar sobre tu proyecto.</p>
        
        <!-- Summary Box -->
        <div style="background-color: #07070a; border-radius: 12px; padding: 20px; border: 1px solid #1f1f2e; margin-bottom: 35px;">
          <h4 style="color: #00f2fe; margin: 0 0 15px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Resumen del registro recibido:</h4>
          
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="color: #64748b; padding: 4px 0; width: 25%;">Teléfono:</td>
              <td style="color: #e2e8f0; padding: 4px 0; font-weight: 600;">${data.telefono}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 4px 0; vertical-align: top;">Mensaje:</td>
              <td style="color: #e2e8f0; padding: 4px 0; font-style: italic; line-height: 1.5;">"${data.mensaje.length > 120 ? data.mensaje.substring(0, 120) + '...' : data.mensaje}"</td>
            </tr>
          </table>
        </div>

        <!-- Call To Action Button -->
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="https://gabrielvazquez.dev" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #00f2fe, #7c3aed); color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 14px; font-weight: 700; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,242,254,0.25); transition: transform 0.2s;">
            Explorar mi portafolio
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; text-align: center; margin: 0;">Quedamos en contacto,</p>
        <p style="color: #00f2fe; font-size: 14px; font-weight: 700; text-align: center; margin: 5px 0 0 0;">Gabriel Vazquez</p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #07070a; padding: 25px 30px; text-align: center; border-top: 1px solid #1f1f2e;">
        <p style="color: #64748b; font-size: 11px; margin: 0 0 8px 0;">Ingeniero de Sistemas & Desarrollador Fullstack</p>
        <p style="color: #475569; font-size: 10px; margin: 0;">Si crees que recibiste este correo por error, por favor ignóralo.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
```
