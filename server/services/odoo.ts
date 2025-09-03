// Configuración de Odoo desde variables de entorno
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'https://alpha-tauro.odoo.com',
  username: process.env.ODOO_USERNAME || 'alan.avalos@alpha-tauro.com',
  password: process.env.ODOO_PASSWORD || 'pqa6zxj-uej2zrz1GFP',
  companyId: parseInt(process.env.ODOO_COMPANY_ID || '1'),
  database: process.env.ODOO_DATABASE || 'alpha-tauro'
};

// Función para crear XML-RPC request manualmente
function createXmlRpcRequest(methodName: string, params: any[]): string {
  const xmlParams = params.map(param => {
    if (typeof param === 'string') {
      return `<value><string>${param}</string></value>`;
    } else if (typeof param === 'number') {
      return `<value><int>${param}</int></value>`;
    } else if (typeof param === 'boolean') {
      return `<value><boolean>${param ? 1 : 0}</boolean></value>`;
    } else if (Array.isArray(param)) {
      return `<value><array><data>${param.map(item => createXmlRpcRequest('', [item]).replace(/<value>|<\/value>/g, '')).join('')}</data></array></value>`;
    } else if (typeof param === 'object') {
      const members = Object.entries(param).map(([key, value]) => 
        `<member><name>${key}</name>${createXmlRpcRequest('', [value]).replace(/<value>|<\/value>/g, '')}</member>`
      ).join('');
      return `<value><struct>${members}</struct></value>`;
    } else {
      return `<value><string>${String(param)}</string></value>`;
    }
  }).join('');

  return `<?xml version="1.0"?>
<methodCall>
<methodName>${methodName}</methodName>
<params>${xmlParams}</params>
</methodCall>`;
}

// Función para parsear respuesta XML-RPC
function parseXmlRpcResponse(xmlResponse: string): any {
  try {
    // Extraer el valor de la respuesta XML-RPC
    const valueMatch = xmlResponse.match(/<value>([\s\S]*?)<\/value>/);
    if (!valueMatch) {
      throw new Error('No value found in XML-RPC response');
    }

    const valueContent = valueMatch[1];
    
    // Parsear diferentes tipos de valores
    if (valueContent.includes('<int>')) {
      const intMatch = valueContent.match(/<int>(\d+)<\/int>/);
      return intMatch ? parseInt(intMatch[1]) : null;
    } else if (valueContent.includes('<string>')) {
      const stringMatch = valueContent.match(/<string>([\s\S]*?)<\/string>/);
      return stringMatch ? stringMatch[1] : null;
    } else if (valueContent.includes('<boolean>')) {
      const boolMatch = valueContent.match(/<boolean>(\d+)<\/boolean>/);
      return boolMatch ? (parseInt(boolMatch[1]) === 1) : null;
    } else if (valueContent.includes('<struct>')) {
      // Parsear struct (objeto)
      const memberMatches = valueContent.match(/<member>([\s\S]*?)<\/member>/g);
      if (memberMatches) {
        const result: any = {};
        memberMatches.forEach(member => {
          const nameMatch = member.match(/<name>([\s\S]*?)<\/name>/);
          const valueMatch = member.match(/<value>([\s\S]*?)<\/value>/);
          if (nameMatch && valueMatch) {
            result[nameMatch[1]] = parseXmlRpcResponse(`<value>${valueMatch[1]}</value>`);
          }
        });
        return result;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing XML-RPC response:', error);
    return null;
  }
}

// Función para hacer request XML-RPC a Odoo
async function makeOdooRequest(endpoint: 'common' | 'object', methodName: string, params: any[]): Promise<any> {
  try {
    const xmlRequest = createXmlRpcRequest(methodName, params);
    const requestUrl = `${ODOO_CONFIG.url}/xmlrpc/2/${endpoint}`;
    
    console.log(`📤 Making XML-RPC request to: ${requestUrl}`);
    console.log(`📤 Method: ${methodName}`);
    console.log(`📤 Params:`, params);
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'AmericanChassisDepot/1.0',
        'Accept': 'text/xml, application/xml'
      },
      body: xmlRequest
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log(`📥 Raw XML-RPC response:`, responseText.substring(0, 200) + '...');
    
    // Verificar que la respuesta sea XML válido
    if (!responseText.includes('<?xml') || !responseText.includes('<methodResponse>')) {
      throw new Error(`Invalid XML-RPC response: ${responseText.substring(0, 200)}`);
    }

    const result = parseXmlRpcResponse(responseText);
    console.log(`✅ Parsed result:`, result);
    
    return result;
  } catch (error) {
    console.error(`❌ Error making Odoo request:`, error);
    throw error;
  }
}

// Función para autenticarse en Odoo
async function authenticateOdoo(): Promise<number | null> {
  try {
    console.log('🔐 Starting Odoo authentication...');
    console.log(`🔐 Database: ${ODOO_CONFIG.database}`);
    console.log(`🔐 Username: ${ODOO_CONFIG.username}`);
    console.log(`🔐 URL: ${ODOO_CONFIG.url}`);
    
    const uid = await makeOdooRequest('common', 'authenticate', [
      ODOO_CONFIG.database,
      ODOO_CONFIG.username,
      ODOO_CONFIG.password,
      {}
    ]);
    
    if (uid && typeof uid === 'number') {
      console.log('✅ Successfully authenticated with Odoo, UID:', uid);
      return uid;
    } else {
      console.error('❌ Invalid UID received from Odoo:', uid);
      return null;
    }
  } catch (error) {
    console.error('❌ Error authenticating with Odoo:', error);
    return null;
  }
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

    const leadId = await makeOdooRequest('object', 'execute_kw', [
      ODOO_CONFIG.database,
      uid,
      ODOO_CONFIG.password,
      'crm.lead',
      'create',
      [leadValues]
    ]);

    if (leadId && typeof leadId === 'number') {
      console.log('✅ Successfully created lead in Odoo, ID:', leadId);
      return leadId;
    } else {
      console.error('❌ Invalid lead ID received:', leadId);
      return null;
    }

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

    const contactId = await makeOdooRequest('object', 'execute_kw', [
      ODOO_CONFIG.database,
      uid,
      ODOO_CONFIG.password,
      'res.partner',
      'create',
      [contactValues]
    ]);

    if (contactId && typeof contactId === 'number') {
      console.log('✅ Successfully created contact in Odoo, ID:', contactId);
      return contactId;
    } else {
      console.error('❌ Invalid contact ID received:', contactId);
      return null;
    }

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

    const todayCount = await makeOdooRequest('object', 'execute_kw', [
      ODOO_CONFIG.database,
      uid,
      ODOO_CONFIG.password,
      'crm.lead',
      'search_count',
      [[
        ['create_date', '>=', todayStr],
        ['name', 'ilike', 'American Chassis Depot']
      ]]
    ]);

    if (typeof todayCount === 'number') {
      console.log('✅ Odoo stats retrieved successfully');
      return {
        success: true,
        stats: {
          totalLeads: 0,
          todayLeads: todayCount,
          thisWeekLeads: 0,
          thisMonthLeads: 0
        },
        message: 'Estadísticas obtenidas exitosamente'
      };
    } else {
      console.error('❌ Invalid stats response:', todayCount);
      return {
        success: false,
        message: 'Respuesta inválida de estadísticas de Odoo'
      };
    }

  } catch (error) {
    console.error('❌ Error getting Odoo lead stats:', error);
    return {
      success: false,
      message: `Error obteniendo estadísticas: ${error}`
    };
  }
}
