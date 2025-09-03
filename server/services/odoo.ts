import xmlrpc from 'xmlrpc';

// Configuración de Odoo desde variables de entorno
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'https://alpha-tauro.odoo.com',
  username: process.env.ODOO_USERNAME || 'alan.avalos@alpha-tauro.com',
  password: process.env.ODOO_PASSWORD || 'pqa6zxj-uej2zrz1GFP',
  companyId: parseInt(process.env.ODOO_COMPANY_ID || '1'),
  database: process.env.ODOO_DATABASE || 'alpha-tauro'
};

// Función para crear cliente XML-RPC con configuración robusta
function createOdooClient(endpoint: 'common' | 'object') {
  const url = new URL(ODOO_CONFIG.url);
  const port = url.port ? parseInt(url.port) : (url.protocol === 'https:' ? 443 : 80);
  
  console.log(`🔧 Creating Odoo client for endpoint: ${endpoint}`);
  console.log(`🔧 Host: ${url.hostname}, Port: ${port}, Path: /xmlrpc/2/${endpoint}`);
  
  return xmlrpc.createClient({
    host: url.hostname,
    port: port,
    path: `/xmlrpc/2/${endpoint}`,
    headers: {
      'User-Agent': 'AmericanChassisDepot/1.0',
      'Accept': 'text/xml, application/xml',
      'Content-Type': 'text/xml'
    }
  });
}

// Función para autenticarse en Odoo con debugging detallado
async function authenticateOdoo(): Promise<number | null> {
  return new Promise((resolve) => {
    console.log('🔐 Starting Odoo authentication...');
    console.log(`🔐 Database: ${ODOO_CONFIG.database}`);
    console.log(`🔐 Username: ${ODOO_CONFIG.username}`);
    console.log(`🔐 URL: ${ODOO_CONFIG.url}`);
    
    const authClient = createOdooClient('common');
    
    // Timeout de 20 segundos
    const timeout = setTimeout(() => {
      console.error('⏰ Odoo authentication timeout after 20 seconds');
      resolve(null);
    }, 20000);

    // Nota: xmlrpc Client no tiene eventos 'on', pero podemos hacer debugging del request

    console.log('📤 Sending authentication request...');
    
    authClient.methodCall('authenticate', [
      ODOO_CONFIG.database,
      ODOO_CONFIG.username,
      ODOO_CONFIG.password,
      {}
    ], (error: any, uid: any) => {
      clearTimeout(timeout);
      
      if (error) {
        console.error('❌ Error authenticating with Odoo:', error);
        
        // Análisis detallado del error
        if (error.message) {
          if (error.message.includes('Unknown XML-RPC tag')) {
            console.error('🚨 CRITICAL: Odoo is returning HTML instead of XML-RPC');
            console.error('🚨 This usually means the endpoint is wrong or there are redirects');
            console.error('🚨 Expected: XML-RPC response');
            console.error('🚨 Received: HTML response (likely login page)');
          } else if (error.message.includes('ECONNREFUSED')) {
            console.error('🚨 CRITICAL: Connection refused - check host/port');
          } else if (error.message.includes('timeout')) {
            console.error('🚨 CRITICAL: Connection timeout - check network/firewall');
          }
        }
        
        resolve(null);
        return;
      }
      
      console.log('📥 Raw response from Odoo:', uid);
      console.log('📥 Response type:', typeof uid);
      console.log('📥 Response value:', uid);
      
      if (uid && typeof uid === 'number') {
        console.log('✅ Successfully authenticated with Odoo, UID:', uid);
        resolve(uid);
      } else {
        console.error('❌ Invalid UID received from Odoo:', uid);
        console.error('❌ Expected: number, Received:', typeof uid, uid);
        resolve(null);
      }
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
    console.log('📝 Creating Odoo lead...');
    const uid = await authenticateOdoo();
    if (!uid) {
      console.error('❌ Failed to authenticate with Odoo for lead creation');
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
      company_id: ODOO_CONFIG.companyId,
      user_id: uid,
      stage_id: 1,
      source_id: false,
      medium_id: false,
      campaign_id: false
    };

    console.log('📤 Sending lead creation request...');

    return new Promise((resolve) => {
      const objectClient = createOdooClient('object');
      
      const timeout = setTimeout(() => {
        console.error('⏰ Odoo lead creation timeout after 20 seconds');
        resolve(null);
      }, 20000);

      objectClient.methodCall('execute_kw', [
        ODOO_CONFIG.database,
        uid,
        ODOO_CONFIG.password,
        'crm.lead',
        'create',
        [leadValues]
      ], (error: any, leadId: any) => {
        clearTimeout(timeout);
        
        if (error) {
          console.error('❌ Error creating lead in Odoo:', error);
          resolve(null);
        } else {
          console.log('✅ Successfully created lead in Odoo, ID:', leadId);
          resolve(leadId);
        }
      });
    });

  } catch (error) {
    console.error('❌ Error in createOdooLead:', error);
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
    console.log('👤 Creating Odoo contact...');
    const uid = await authenticateOdoo();
    if (!uid) {
      console.error('❌ Failed to authenticate with Odoo for contact creation');
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
      company_id: ODOO_CONFIG.companyId,
      user_id: uid
    };

    console.log('📤 Sending contact creation request...');

    return new Promise((resolve) => {
      const objectClient = createOdooClient('object');
      
      const timeout = setTimeout(() => {
        console.error('⏰ Odoo contact creation timeout after 20 seconds');
        resolve(null);
      }, 20000);

      objectClient.methodCall('execute_kw', [
        ODOO_CONFIG.database,
        uid,
        ODOO_CONFIG.password,
        'res.partner',
        'create',
        [contactValues]
      ], (error: any, contactId: any) => {
        clearTimeout(timeout);
        
        if (error) {
          console.error('❌ Error creating contact in Odoo:', error);
          resolve(null);
        } else {
          console.log('✅ Successfully created contact in Odoo, ID:', contactId);
          resolve(contactId);
        }
      });
    });

  } catch (error) {
    console.error('❌ Error in createOdooContact:', error);
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
    console.log('🚀 Processing form submission for Odoo:', formData);

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.ODOO_PASSWORD || process.env.ODOO_PASSWORD === 'your_odoo_password') {
      console.warn('⚠️ Odoo credentials not properly configured, skipping Odoo integration');
      return {
        success: false,
        message: 'Formulario procesado localmente (Odoo no configurado)'
      };
    }

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
      console.log('🎉 Odoo integration successful!');
      return {
        success: true,
        odooLeadId: leadId,
        odooContactId: contactId,
        message: 'Formulario procesado exitosamente en Odoo'
      };
    } else {
      // Fallback: aunque Odoo falle, el formulario se procesó localmente
      console.warn('⚠️ Odoo integration failed, but form was processed locally');
      return {
        success: false,
        message: 'Formulario procesado localmente (Odoo temporalmente no disponible)'
      };
    }

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
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
  config?: {
    url: string;
    database: string;
    username: string;
    hasPassword: boolean;
  };
}> {
  try {
    console.log('🔍 Testing Odoo connection...');
    
    // Verificar configuración
    if (!process.env.ODOO_PASSWORD || process.env.ODOO_PASSWORD === 'your_odoo_password') {
      console.warn('⚠️ Odoo credentials not properly configured');
      return {
        success: false,
        message: 'Credenciales de Odoo no configuradas correctamente',
        config: {
          url: ODOO_CONFIG.url,
          database: ODOO_CONFIG.database,
          username: ODOO_CONFIG.username,
          hasPassword: false
        }
      };
    }

    const uid = await authenticateOdoo();
    if (uid) {
      console.log('✅ Odoo connection test successful');
      return {
        success: true,
        message: `Conexión exitosa con Odoo. UID: ${uid}`,
        uid,
        config: {
          url: ODOO_CONFIG.url,
          database: ODOO_CONFIG.database,
          username: ODOO_CONFIG.username,
          hasPassword: true
        }
      };
    } else {
      console.log('❌ Odoo connection test failed');
      return {
        success: false,
        message: 'No se pudo autenticar con Odoo',
        config: {
          url: ODOO_CONFIG.url,
          database: ODOO_CONFIG.database,
          username: ODOO_CONFIG.username,
          hasPassword: true
        }
      };
    }
  } catch (error) {
    console.error('❌ Error testing Odoo connection:', error);
    return {
      success: false,
      message: `Error de conexión: ${error}`,
      config: {
        url: ODOO_CONFIG.url,
        database: ODOO_CONFIG.database,
        username: ODOO_CONFIG.username,
        hasPassword: !!(process.env.ODOO_PASSWORD && process.env.ODOO_PASSWORD !== 'your_odoo_password')
      }
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
    console.log('📊 Getting Odoo lead statistics...');
    const uid = await authenticateOdoo();
    if (!uid) {
      console.error('❌ Failed to authenticate with Odoo for stats');
      return {
        success: false,
        message: 'No se pudo autenticar con Odoo'
      };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return new Promise((resolve) => {
      const objectClient = createOdooClient('object');
      
      const timeout = setTimeout(() => {
        console.error('⏰ Odoo stats timeout after 20 seconds');
        resolve({
          success: false,
          message: 'Timeout obteniendo estadísticas de Odoo'
        });
      }, 20000);

      objectClient.methodCall('execute_kw', [
        ODOO_CONFIG.database,
        uid,
        ODOO_CONFIG.password,
        'crm.lead',
        'search_count',
        [[
          ['create_date', '>=', todayStr],
          ['name', 'ilike', 'American Chassis Depot']
        ]]
      ], (error: any, todayCount: any) => {
        clearTimeout(timeout);
        
        if (error) {
          console.error('❌ Error getting Odoo stats:', error);
          resolve({
            success: false,
            message: `Error obteniendo estadísticas: ${error}`
          });
          return;
        }

        console.log('✅ Odoo stats retrieved successfully');
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
    console.error('❌ Error getting Odoo lead stats:', error);
    return {
      success: false,
      message: `Error obteniendo estadísticas: ${error}`
    };
  }
}
