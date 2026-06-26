// Serverless function to handle contact form submissions. Deployed to Vercel.
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
        // 1. Notification to Gabriel
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portafolio <onboarding@resend.dev>',
            to: ['dev.gabo23@gmail.com'],
            subject: `📬 Nuevo contacto de ${nombre}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #00f2fe; padding-bottom: 10px;">Nuevo Mensaje de Contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Teléfono:</strong> ${telefono || 'No provisto'}</p>
                <p><strong>País:</strong> ${pais || 'Desconocido'}</p>
                <p><strong>Mensaje:</strong></p>
                <div style="padding: 15px; background-color: #f8fafc; border-left: 4px solid #00f2fe; border-radius: 4px; font-style: italic; white-space: pre-wrap; color: #334155;">
                  ${mensaje}
                </div>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b; text-align: center;">Enviado desde el formulario de contacto del Portafolio.</p>
              </div>
            `
          })
        });

        // 2. Confirmation to Client (wrapped in try/catch for Sandbox restrictions)
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Gabriel J. Vazquez <onboarding@resend.dev>',
              to: [email],
              subject: '¡Mensaje recibido con éxito!',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #334155;">
                  <h2 style="color: #0f172a;">¡Hola ${nombre}!</h2>
                  <p>Gracias por ponerte en contacto conmigo. He recibido tu mensaje correctamente y te responderé lo antes posible (generalmente en menos de 24 horas).</p>
                  <p>Mientras tanto, si quieres ver más de mi trabajo o seguir en comunicación, te invito a visitar mis redes sociales:</p>
                  <p>
                    <a href="https://www.linkedin.com/in/gabriel-jesse-vazquez/" style="color: #00f2fe; text-decoration: none; font-weight: bold; margin-right: 15px;">LinkedIn</a>
                    <a href="https://www.instagram.com/gjvo23/" style="color: #7c3aed; text-decoration: none; font-weight: bold;">Instagram</a>
                  </p>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p style="font-size: 11px; color: #64748b; text-align: center;">Gabriel Jesse Vazquez — Desarrollador Frontend</p>
                </div>
              `
            })
          });
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
