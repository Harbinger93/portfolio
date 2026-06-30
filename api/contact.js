import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Supabase credentials are not defined in environment variables' 
      });
    }

    // Parse the body (handles stringified payloads from no-cors plain text requests)
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { nombre, email, telefono, pais, mensaje } = bodyData;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Nombre, email y mensaje son campos obligatorios.' });
    }

    // Insert into contact table using Supabase PostgREST REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/contact`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        nombre,
        email,
        telefono,
        pais,
        mensaje
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Supabase returned an error: ${errorText}` 
      });
    }

    // Send email notifications via Resend
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        // Resolve templates paths
        const internalTemplatePath = path.join(process.cwd(), 'templates', 'plantilla-email.html');
        const clientTemplatePath = path.join(process.cwd(), 'templates', 'email-contacto-cliente.html');

        let internalHtmlBase = '';
        let clientHtmlBase = '';

        try {
          internalHtmlBase = fs.readFileSync(internalTemplatePath, 'utf8');
        } catch (readErr) {
          console.error('Error reading internal template:', readErr);
        }

        try {
          clientHtmlBase = fs.readFileSync(clientTemplatePath, 'utf8');
        } catch (readErr) {
          console.error('Error reading client contact template:', readErr);
        }

        // 1. Notification to Gabriel
        let gabrielEmailHtml = '';
        if (internalHtmlBase) {
          const content = `
            <p>¡Hola Gabriel! Tienes un nuevo mensaje desde el formulario de contacto de tu portafolio. Aquí tienes los detalles:</p>
            <div style="background-color: rgba(0, 242, 254, 0.05); border-left: 4px solid #00f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00f2fe; text-decoration: none;">${email}</a></p>
              <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${telefono || 'No provisto'}</p>
              <p style="margin: 5px 0;"><strong>País:</strong> ${pais || 'Desconocido'}</p>
            </div>
            <p><strong>Mensaje escrito:</strong></p>
            <div style="background-color: rgba(0, 0, 0, 0.02); border: 1px solid rgba(0, 0, 0, 0.06); padding: 15px; border-radius: 8px; font-style: italic; white-space: pre-wrap; line-height: 1.5;">
              ${mensaje}
            </div>
          `;
          gabrielEmailHtml = internalHtmlBase
            .replace('{{ASUNTO}}', `Nuevo contacto de ${nombre}`)
            .replace('{{TITULO}}', '📬 Nuevo Mensaje de Contacto')
            .replace('{{CONTENIDO_PRINCIPAL}}', content);
        } else {
          gabrielEmailHtml = `Nuevo mensaje de ${nombre} (${email}): ${mensaje}`;
        }

        const resGabriel = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portafolio <hola@gabrielvazquez.dev>',
            to: ['dev.gabo23@gmail.com'],
            subject: `📬 Nuevo contacto de ${nombre}`,
            html: gabrielEmailHtml
          })
        });

        if (!resGabriel.ok) {
          const errData = await resGabriel.json();
          console.error('Error from Resend (Gabriel notification):', errData);
        }

        // 2. Confirmation to Client (wrapped in try/catch for Sandbox restrictions)
        try {
          let clientEmailHtml = '';
          if (clientHtmlBase) {
            clientEmailHtml = clientHtmlBase
              .replace('{{NOMBRE}}', nombre);
          } else {
            clientEmailHtml = `¡Hola ${nombre}! He recibido tu mensaje correctamente.`;
          }

          const resClient = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Gabriel J. Vazquez <hola@gabrielvazquez.dev>',
              to: [email],
              subject: '¡Mensaje recibido con éxito!',
              html: clientEmailHtml
            })
          });

          if (!resClient.ok) {
            const errData = await resClient.json();
            console.error('Error from Resend (Client confirmation):', errData);
          }
        } catch (clientEmailErr) {
          console.error('Error sending confirmation email to client:', clientEmailErr);
        }
      }
    } catch (emailErr) {
      console.error('Error in Resend email integration:', emailErr);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
