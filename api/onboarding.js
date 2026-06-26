// Serverless function to handle onboarding briefings. Deployed to Vercel.
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

    const { action, id } = bodyData;

    if (!id) {
      return res.status(400).json({ error: 'El ID de onboarding es obligatorio.' });
    }

    if (action === 'onboarding_update_drive') {
      const { driveFolderLink, updatedAt } = bodyData;

      if (!driveFolderLink) {
        return res.status(400).json({ error: 'El enlace de Drive es obligatorio para actualizar.' });
      }

      // Update in Supabase onboarding table
      const response = await fetch(`${supabaseUrl}/rest/v1/onboarding?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          drive_folder_link: driveFolderLink,
          updated_at: updatedAt || new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `Supabase update error: ${errorText}` 
        });
      }

      // Send notification to Gabriel about the new Drive link
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Briefing Web <onboarding@resend.dev>',
              to: ['dev.gabo23@gmail.com'],
              subject: `📂 Carpeta de Drive cargada para Onboarding: ${id}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                  <h2 style="color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #00f2fe; padding-bottom: 10px;">Enlace de Drive Recibido</h2>
                  <p>Un cliente ha actualizado su briefing de onboarding cargando la carpeta de trabajo del proyecto.</p>
                  <p><strong>ID del Onboarding:</strong> ${id}</p>
                  <p><strong>Enlace del Espacio de Trabajo:</strong></p>
                  <div style="padding: 15px; background-color: #f8fafc; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; margin-top: 15px;">
                    <a href="${driveFolderLink}" target="_blank" style="color: #00f2fe; font-weight: bold; text-decoration: none; font-size: 14px;">Abrir carpeta en Google Drive / Nube</a>
                  </div>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p style="font-size: 11px; color: #64748b; text-align: center;">Enviado desde el sistema de briefings de Gabriel Jesse.</p>
                </div>
              `
            })
          });
        }
      } catch (emailErr) {
        console.error('Error sending Drive update email via Resend:', emailErr);
      }

      return res.status(200).json({ success: true });
    } else {
      // Default: Initial Onboarding Submission
      const {
        clientUuid,
        companyName,
        contactPerson,
        email,
        phone,
        currentWebsite,
        businessDescription,
        targetAudience,
        primaryGoal,
        hostingStatus,
        brandAssetsStatus,
        requiredSections,
        featuresSelected,
        deadline,
        estimatedBudgetRange,
        driveFolderLink,
        privacyPolicyAccepted,
        consentTimestamp,
        consentVersion,
        ipAddressHash,
        status
      } = bodyData;

      if (!companyName || !contactPerson || !email) {
        return res.status(400).json({ error: 'Campos requeridos incompletos.' });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/onboarding`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id,
          client_uuid: clientUuid,
          company_name: companyName,
          contact_person: contactPerson,
          email,
          phone,
          current_website: currentWebsite,
          business_description: businessDescription,
          target_audience: targetAudience,
          primary_goal: primaryGoal,
          hosting_status: hostingStatus,
          brand_assets_status: brandAssetsStatus,
          required_sections: requiredSections,
          features_selected: featuresSelected,
          deadline,
          estimated_budget_range: estimatedBudgetRange,
          drive_folder_link: driveFolderLink || '',
          privacy_policy_accepted: privacyPolicyAccepted,
          consent_timestamp: consentTimestamp,
          consent_version: consentVersion,
          ip_address_hash: ipAddressHash,
          status: status || 'Awaiting_Content'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `Supabase insert error: ${errorText}` 
        });
      }

      // Send email notifications via Resend
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          // 1. Notification to Gabriel with briefing details
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Briefing Web <onboarding@resend.dev>',
              to: ['dev.gabo23@gmail.com'],
              subject: `🚀 Nuevo Briefing: ${companyName} (${contactPerson})`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                  <h2 style="color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #00f2fe; padding-bottom: 10px;">Nuevo Briefing Recibido</h2>
                  <p><strong>Empresa:</strong> ${companyName}</p>
                  <p><strong>Persona de Contacto:</strong> ${contactPerson}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p><strong>Teléfono:</strong> ${phone || 'No provisto'}</p>
                  <p><strong>Sitio Web Actual:</strong> ${currentWebsite || 'No tiene'}</p>
                  <p><strong>Propósito / Negocio:</strong> ${businessDescription}</p>
                  <p><strong>Público Objetivo:</strong> ${targetAudience}</p>
                  <p><strong>Objetivo Principal:</strong> ${primaryGoal}</p>
                  <p><strong>Hosting y Dominio:</strong> ${hostingStatus}</p>
                  <p><strong>Identidad Visual:</strong> ${brandAssetsStatus}</p>
                  <p><strong>Secciones Solicitadas:</strong> ${requiredSections}</p>
                  <p><strong>Funciones Especiales:</strong> ${featuresSelected || 'Ninguna'}</p>
                  <p><strong>Fecha Límite:</strong> ${deadline || 'No especificada'}</p>
                  <p><strong>Rango de Presupuesto:</strong> ${estimatedBudgetRange}</p>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p style="font-size: 11px; color: #64748b; text-align: center;">ID del Briefing: ${id}</p>
                </div>
              `
            })
          });

          // 2. Welcome and instructions to the Client
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
                subject: '¡Briefing recibido! Comencemos con tu proyecto web',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #334155; line-height: 1.6;">
                    <h2 style="color: #0f172a; border-bottom: 2px solid #00f2fe; padding-bottom: 10px;">¡Hola ${contactPerson}!</h2>
                    <p>He recibido correctamente el briefing para el desarrollo de la web de <strong>${companyName}</strong>. ¡Muchas gracias por confiar en mi trabajo!</p>
                    
                    <p>El diseño y éxito de tu sitio web depende de la organización de tu contenido. Para comenzar a trabajar de la manera más ágil, te recomiendo seguir estos sencillos pasos:</p>
                    
                    <h3 style="color: #0f172a; margin-top: 20px;">Pasos sugeridos para organizar tu material:</h3>
                    <ol>
                      <li><strong>Workspace en la Nube:</strong> Crea una carpeta en Google Drive, Dropbox o OneDrive llamada "<em>${companyName} - Proyecto Web</em>".</li>
                      <li><strong>Estructura:</strong> Dentro de esa carpeta principal, organiza tres subcarpetas:
                        <ul>
                          <li><code>01. Identidad Visual</code> (Logotipos en alta resolución, manual de marca, paleta de colores).</li>
                          <li><code>02. Textos</code> (Los textos explicativos de las secciones: ${requiredSections}).</li>
                          <li><code>03. Multimedia</code> (Imágenes reales de tu negocio, videos, gráficos).</li>
                        </ul>
                      </li>
                      <li><strong>Comparte el enlace:</strong> Configura la carpeta como <em>"Cualquier persona con el enlace puede editar"</em> y pega ese enlace en la pantalla final de onboarding de tu navegador para que se vincule a tu proyecto.</li>
                    </ol>

                    <p>Si tienes alguna consulta, puedes responder directamente a este correo electrónico.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #64748b; text-align: center;">Gabriel Jesse Vazquez — Desarrollador Web Frontend</p>
                  </div>
                `
              })
            });
          } catch (clientEmailErr) {
            console.error('Error sending welcome email to client:', clientEmailErr);
          }
        }
      } catch (emailErr) {
        console.error('Error in Resend onboarding email integration:', emailErr);
      }

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
