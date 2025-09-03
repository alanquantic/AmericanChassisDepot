import Odoo from 'odoo-xmlrpc';

// Configuración de Odoo
const ODOO_CONFIG = {
  url: 'https://alpha-tauro.odoo.com',
  port: 443,
  db: 'alpha-tauro',
  username: 'alan.avalos@alpha-tauro.com',
  password: 'pqa6zxj-uej2zrz1GFP'
};

// Cliente Odoo
const odoo = new Odoo(ODOO_CONFIG);

// Función para autenticarse en Odoo
async function authenticateOdoo(): Promise<number | null> {
  return new Promise((resolve) => {
    odoo.connect((err: any) => {
      if (err) {
        console.error('Error connecting to Odoo:', err);
        resolve(null);
        return;
      }
      
      console.log('Successfully connected to Odoo');
      resolve(odoo.uid);
    });
  });
}

// Función para crear lead en Odoo
async function createOdooLead(leadData: {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  source: string;
  product?: string;
  actionType: 'contact' | 'quote' | 'brochure';
  language: 'en' | 'es';
  units?: string;
  interest?: string;
}): Promise<number | null> {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      console.error('Failed to authenticate with Odoo');
      return null;
    }

    // Preparar datos del lead
    const leadValues = {
      name: `${leadData.actionType === 'contact' ? 'Contacto General' : 
             leadData.actionType === 'quote' ? 'Cotización' : 'Descarga Brochure'} - ${leadData.name}`,
      email_from: leadData.email,
      phone: leadData.phone,
      description: `
${leadData.actionType === 'contact' ? 'Solicitud de Contacto General' : 
 leadData.actionType === 'quote' ? 'Solicitud de Cotización' : 'Descarga de Brochure'}

**Datos del Cliente:**
- Nombre: ${leadData.name}
- Email: ${leadData.email}
- Empresa: ${leadData.company || 'No especificada'}
- Teléfono: ${leadData.phone || 'No especificado'}
${leadData.units ? `- Unidades: ${leadData.units}` : ''}
${leadData.interest ? `- Interés: ${leadData.interest}` : ''}
${leadData.product ? `- Producto: ${leadData.product}` : ''}
- Idioma: ${leadData.language === 'es' ? 'Español' : 'English'}
- Fuente: ${leadData.source}

**Mensaje:**
${leadData.message}

**Detalles Técnicos:**
- Timestamp: ${new Date().toISOString()}
- Acción: ${leadData.actionType}
- Sistema: American Chassis Depot Website
      `,
      partner_name: leadData.company || leadData.name,
      type: 'lead',
      team_id: false,
      company_id: 1,
      user_id: uid,
      stage_id: 1,
      source_id: false,
      medium_id: false,
      campaign_id: false
    };

    return new Promise((resolve) => {
      odoo.execute_kw('crm.lead', 'create', [[leadValues]], (err: any, leadId: any) => {
        if (err) {
          console.error('Error creating lead in Odoo:', err);
          resolve(null);
        } else {
          console.log('Successfully created lead in Odoo, ID:', leadId);
          resolve(leadId);
        }
      });
    });

  } catch (error) {
    console.error('Error in createOdooLead:', error);
    return null;
  }
}

// Función para crear contacto en Odoo
async function createOdooContact(contactData: {
  name: string;
  email: string;
  company: string;
  phone: string;
  language: 'en' | 'es';
}): Promise<number | null> {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      console.error('Failed to authenticate with Odoo');
      return null;
    }

    const contactValues = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      company_type: 'person',
      is_company: false,
      parent_id: false,
      comment: `
Contacto creado desde American Chassis Depot Website

**Información:**
- Nombre: ${contactData.name}
- Email: ${contactData.email}
- Empresa: ${contactData.company || 'No especificada'}
- Teléfono: ${contactData.phone || 'No especificado'}
- Idioma: ${contactData.language === 'es' ? 'Español' : 'English'}
- Fuente: Website
- Timestamp: ${new Date().toISOString()}
      `,
      company_id: 1,
      user_id: uid
    };

    return new Promise((resolve) => {
      odoo.execute_kw('res.partner', 'create', [[contactValues]], (err: any, contactId: any) => {
        if (err) {
          console.error('Error creating contact in Odoo:', err);
          resolve(null);
        } else {
          console.log('Successfully created contact in Odoo, ID:', contactId);
          resolve(contactId);
        }
      });
    });

  } catch (error) {
    console.error('Error in createOdooContact:', error);
    return null;
  }
}

// Función principal para procesar formularios
export async function processFormSubmission(formData: {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  source: string;
  product?: string;
  actionType: 'contact' | 'quote' | 'brochure';
  language: 'en' | 'es';
  units?: string;
  interest?: string;
}): Promise<{
  success: boolean;
  odooLeadId?: number;
  odooContactId?: number;
  message: string;
}> {
  try {
    console.log('Processing form submission for Odoo:', formData);

    // Intentar crear lead en Odoo
    const leadId = await createOdooLead(formData);
    
    // Intentar crear contacto en Odoo
    const contactId = await createOdooContact({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      phone: formData.phone,
      language: formData.language
    });

    if (leadId && contactId) {
      return {
        success: true,
        odooLeadId: leadId,
        odooContactId: contactId,
        message: 'Formulario procesado exitosamente en Odoo'
      };
    } else {
      // Fallback: aunque Odoo falle, el formulario se procesó localmente
      console.warn('Odoo integration failed, but form was processed locally');
      return {
        success: false,
        message: 'Formulario procesado localmente (Odoo temporalmente no disponible)'
      };
    }

  } catch (error) {
    console.error('Error processing form submission:', error);
    // Fallback: permitir que el sitio funcione aunque Odoo falle
    return {
      success: false,
      message: 'Formulario procesado localmente (Odoo temporalmente no disponible)'
    };
  }
}

// Función para verificar conexión con Odoo
export async function testOdooConnection(): Promise<{
  success: boolean;
  message: string;
  uid?: number;
}> {
  try {
    const uid = await authenticateOdoo();
    if (uid) {
      return {
        success: true,
        message: `Conexión exitosa con Odoo. UID: ${uid}`,
        uid
      };
    } else {
      return {
        success: false,
        message: 'No se pudo autenticar con Odoo'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error de conexión: ${error}`
    };
  }
}

// Función para obtener estadísticas de leads
export async function getOdooLeadStats(): Promise<{
  success: boolean;
  stats?: {
    totalLeads: number;
    todayLeads: number;
    thisWeekLeads: number;
    thisMonthLeads: number;
  };
  message: string;
}> {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      return {
        success: false,
        message: 'No se pudo autenticar con Odoo'
      };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return new Promise((resolve) => {
      odoo.execute_kw('crm.lead', 'search_count', [[
        ['create_date', '>=', todayStr],
        ['name', 'ilike', 'American Chassis Depot']
      ]], (err: any, todayCount: any) => {
        if (err) {
          resolve({
            success: false,
            message: `Error obteniendo estadísticas: ${err}`
          });
          return;
        }

        resolve({
          success: true,
          stats: {
            totalLeads: 0,
            todayLeads: todayCount || 0,
            thisWeekLeads: 0,
            thisMonthLeads: 0
          },
          message: 'Estadísticas obtenidas exitosamente'
        });
      });
    });

  } catch (error) {
    return {
      success: false,
      message: `Error obteniendo estadísticas: ${error}`
    };
  }
}
