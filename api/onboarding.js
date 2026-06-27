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

    const { action, id } = bodyData;

    if (!id) {
      return res.status(400).json({ error: 'El ID de onboarding es obligatorio.' });
    }

    // Resolve templates paths
    const internalTemplatePath = path.join(process.cwd(), 'templates', 'plantilla-email.html');
    const clientTemplatePath = path.join(process.cwd(), 'templates', 'email-onboarding-cliente.html');

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
      console.error('Error reading client onboarding template:', readErr);
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
          let driveEmailHtml = '';
          if (internalHtmlBase) {
            const content = `
              <p>¡Hola Gabriel Jesse! El cliente del proyecto ha actualizado su briefing de onboarding cargando la carpeta de trabajo del proyecto.</p>
              <div style="background-color: rgba(0, 242, 254, 0.05); border-left: 4px solid #00f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>ID del Onboarding:</strong> ${id}</p>
              </div>
              <p><strong>Enlace del Espacio de Trabajo:</strong></p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${driveFolderLink}" target="_blank" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #00f2fe 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 10px rgba(0, 242, 254, 0.25); text-transform: uppercase; font-size: 12px;">Abrir carpeta en Google Drive / Nube</a>
              </div>
            `;
            driveEmailHtml = internalHtmlBase
              .replace('{{ASUNTO}}', `Carpeta de Drive cargada para Onboarding: ${id}`)
              .replace('{{TITULO}}', '📂 Enlace de Drive Recibido')
              .replace('{{CONTENIDO_PRINCIPAL}}', content);
          } else {
            driveEmailHtml = `Drive Link for ${id}: ${driveFolderLink}`;
          }

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
              html: driveEmailHtml
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
          let gabrielOnboardingHtml = '';
          if (internalHtmlBase) {
            const content = `
              <p>¡Hola Gabriel! Has recibido un nuevo briefing detallado para el desarrollo de la web de <strong>${companyName}</strong>:</p>
              <div style="background-color: rgba(0, 242, 254, 0.05); border-left: 4px solid #00f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; line-height: 1.5;">
                <p style="margin: 5px 0;"><strong>Empresa:</strong> ${companyName}</p>
                <p style="margin: 5px 0;"><strong>Persona de Contacto:</strong> ${contactPerson}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00f2fe; text-decoration: none;">${email}</a></p>
                <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${phone || 'No provisto'}</p>
                <p style="margin: 5px 0;"><strong>Sitio Web Actual:</strong> ${currentWebsite || 'No tiene'}</p>
                <p style="margin: 5px 0;"><strong>Propósito / Negocio:</strong> ${businessDescription}</p>
                <p style="margin: 5px 0;"><strong>Público Objetivo:</strong> ${targetAudience}</p>
                <p style="margin: 5px 0;"><strong>Objetivo Principal:</strong> ${primaryGoal}</p>
                <p style="margin: 5px 0;"><strong>Hosting y Dominio:</strong> ${hostingStatus}</p>
                <p style="margin: 5px 0;"><strong>Identidad Visual:</strong> ${brandAssetsStatus}</p>
                <p style="margin: 5px 0;"><strong>Secciones Solicitadas:</strong> ${requiredSections}</p>
                <p style="margin: 5px 0;"><strong>Funciones Especiales:</strong> ${featuresSelected || 'Ninguna'}</p>
                <p style="margin: 5px 0;"><strong>Fecha Límite:</strong> ${deadline || 'No especificada'}</p>
                <p style="margin: 5px 0;"><strong>Rango de Presupuesto:</strong> ${estimatedBudgetRange}</p>
              </div>
            `;
            gabrielOnboardingHtml = internalHtmlBase
              .replace('{{ASUNTO}}', `Nuevo Briefing: ${companyName}`)
              .replace('{{TITULO}}', '🚀 Nuevo Briefing Recibido')
              .replace('{{CONTENIDO_PRINCIPAL}}', content);
          } else {
            gabrielOnboardingHtml = `Nuevo Briefing de ${companyName} (${contactPerson})`;
          }

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
              html: gabrielOnboardingHtml
            })
          });

          // 2. Welcome and instructions to the Client
          try {
            let clientOnboardingHtml = '';
            if (clientHtmlBase) {
              clientOnboardingHtml = clientHtmlBase
                .replace('{{NOMBRE}}', contactPerson)
                .replace('{{COMPANIA}}', companyName)
                .replace('{{SECCIONES}}', requiredSections)
                .replace('{{DRIVE_LINK}}', driveFolderLink || 'https://drive.google.com');
            } else {
              clientOnboardingHtml = `¡Hola ${contactPerson}! He recibido el briefing de ${companyName} correctamente.`;
            }

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
                html: clientOnboardingHtml
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
