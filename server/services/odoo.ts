// Configuración de Odoo desde variables de entorno
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  username: process.env.ODOO_USERNAME || '',
  password: process.env.ODOO_PASSWORD || '',
  companyId: parseInt(process.env.ODOO_COMPANY_ID || '1'),
  database: process.env.ODOO_DATABASE || ''
};

if (!ODOO_CONFIG.url || !ODOO_CONFIG.username || !ODOO_CONFIG.password) {
  console.warn('⚠️ Odoo credentials not configured. Set ODOO_URL, ODOO_USERNAME, ODOO_PASSWORD, and ODOO_DATABASE in environment variables.');
}

// Interfaz para la respuesta JSON-RPC de Odoo
interface OdooJsonRpcResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data: {
      name: string;
      message: string;
      arguments: string[];
      type: string;
      debug: string;
    };
  };
}

// Interfaz para el request JSON-RPC
interface OdooJsonRpcRequest {
  jsonrpc: string;
  method: string;
  params: {
    service: string;
    method: string;
    args: any[];
  };
  id: number;
}

// Función para hacer request JSON-RPC a Odoo
async function makeOdooRequest<T = any>(
  service: string,
  method: string,
  args: any[]
): Promise<T> {
  try {
    const request: OdooJsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service,
        method,
        args
      },
      id: Math.floor(Math.random() * 1000000)
    };

    const requestUrl = `${ODOO_CONFIG.url}/jsonrpc`;
    
    console.log(`📤 Making JSON-RPC request to: ${requestUrl}`);
    console.log(`📤 Service: ${service}, Method: ${method}`);
    // Do NOT log `args` — it contains ODOO_CONFIG.password in cleartext.

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AmericanChassisDepot/1.0',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: OdooJsonRpcResponse<T> = await response.json();
    console.log(`📥 Raw JSON-RPC response:`, JSON.stringify(responseData, null, 2));

    // Verificar si hay error en la respuesta
    if (responseData.error) {
      console.error(`🚨 Odoo JSON-RPC Error:`);
      console.error(`🚨 Error Code: ${responseData.error.code}`);
      console.error(`🚨 Error Message: ${responseData.error.message}`);
      console.error(`🚨 Error Data:`, responseData.error.data);
      throw new Error(`Odoo JSON-RPC Error: ${responseData.error.code} - ${responseData.error.message}`);
    }

    // Verificar que tenemos resultado
    if (responseData.result === undefined) {
      throw new Error('No result in JSON-RPC response');
    }

    console.log(`✅ Parsed result:`, responseData.result);
    return responseData.result;

  } catch (error) {
    console.error(`❌ Error making Odoo request:`, error);
    throw error;
  }
}

// Autenticación con Odoo usando JSON-RPC
async function authenticateOdoo(): Promise<number> {
  try {
    console.log('🔐 Starting Odoo authentication...');
    console.log('🔐 Database:', ODOO_CONFIG.database);
    console.log('🔐 Username:', ODOO_CONFIG.username);
    console.log('🔐 URL:', ODOO_CONFIG.url);

    const uid = await makeOdooRequest<number>(
      'common',
      'authenticate',
      [ODOO_CONFIG.database, ODOO_CONFIG.username, ODOO_CONFIG.password, {}]
    );

    if (uid && typeof uid === 'number' && uid > 0) {
      console.log('✅ Successfully authenticated with Odoo, UID:', uid);
      return uid;
    } else {
      throw new Error(`Invalid UID returned: ${uid}`);
    }

  } catch (error) {
    console.error('❌ Error authenticating with Odoo:', error);
    throw error;
  }
}

// Crear lead en Odoo usando JSON-RPC
async function createOdooLead(uid: number, leadData: any): Promise<number> {
  try {
    console.log('📝 Creating Odoo lead...');
    
    const leadId = await makeOdooRequest<number>(
      'object',
      'execute_kw',
      [ODOO_CONFIG.database, uid, ODOO_CONFIG.password, 'crm.lead', 'create', [leadData]]
    );

    if (leadId && typeof leadId === 'number' && leadId > 0) {
      console.log('✅ Successfully created lead in Odoo, ID:', leadId);
      return leadId;
    } else {
      throw new Error(`Invalid lead ID returned: ${leadId}`);
    }

  } catch (error) {
    console.error('❌ Error in createOdooLead:', error);
    throw error;
  }
}

// Crear contacto en Odoo usando JSON-RPC
async function createOdooContact(uid: number, contactData: any): Promise<number> {
  try {
    console.log('👤 Creating Odoo contact...');
    
    const contactId = await makeOdooRequest<number>(
      'object',
      'execute_kw',
      [ODOO_CONFIG.database, uid, ODOO_CONFIG.password, 'res.partner', 'create', [contactData]]
    );

    if (contactId && typeof contactId === 'number' && contactId > 0) {
      console.log('✅ Successfully created contact in Odoo, ID:', contactId);
      return contactId;
    } else {
      throw new Error(`Invalid contact ID returned: ${contactId}`);
    }

  } catch (error) {
    console.error('❌ Error in createOdooContact:', error);
    throw error;
  }
}

// Interfaz para el procesamiento de formularios
interface FormSubmissionData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  source?: string;
  product?: string;
  actionType: 'contact' | 'quote' | 'brochure';
  language: 'en' | 'es';
  units?: string;
  interest?: string;
}

// Interfaz para el resultado del procesamiento
interface FormSubmissionResult {
  success: boolean;
  message: string;
  odooLeadId?: number;
  odooContactId?: number;
}

// Procesar formulario y enviar a Odoo
export async function processFormSubmission(data: FormSubmissionData): Promise<FormSubmissionResult> {
  try {
    console.log('🚀 Processing form submission for Odoo:', data);

    // Verificar configuración
    if (!ODOO_CONFIG.url || !ODOO_CONFIG.username || !ODOO_CONFIG.password) {
      console.warn('⚠️ Odoo credentials not properly configured');
      return {
        success: false,
        message: 'Odoo not configured'
      };
    }

    // Autenticación
    const uid = await authenticateOdoo();

    // Crear lead
    console.log('📝 Creating Odoo lead...');
    const leadData = {
      name: `${data.actionType === 'contact' ? 'Contacto General' : data.actionType === 'quote' ? 'Cotización' : 'Descarga Folleto'} - ${data.name}`,
      email_from: data.email,
      phone: data.phone || '',
      contact_name: data.name, // Campo específico para el nombre del contacto
      description: `
${data.actionType === 'contact' ? 'Solicitud de Contacto General' : data.actionType === 'quote' ? 'Solicitud de Cotización' : 'Descarga de Folleto Técnico'}

**Datos del Cliente:**
- Nombre: ${data.name}
- Email: ${data.email}
- Empresa: ${data.company || 'No especificada'}
- Teléfono: ${data.phone || 'No especificado'}
- Unidades: ${data.units || 'No especificadas'}
- Interés: ${data.interest || 'No especificado'}
- Producto: ${data.product || 'No especificado'}
- Idioma: ${data.language === 'es' ? 'Español' : 'English'}
- Fuente: ${data.source || 'Website'}

**Mensaje:**
${data.message}

**Detalles Técnicos:**
- Timestamp: ${new Date().toISOString()}
- Acción: ${data.actionType}
- Sistema: American Chassis Depot Website
      `,
      partner_name: data.company || data.name,
      type: 'lead',
      team_id: false,
      company_id: ODOO_CONFIG.companyId,
      user_id: uid,
      stage_id: 1,
      source_id: false,
      medium_id: false,
      campaign_id: false
    };

    const leadId = await createOdooLead(uid, leadData);

    // Crear contacto
    console.log('👤 Creating Odoo contact...');
    const contactData = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company_type: 'person',
      is_company: false,
      parent_id: false,
      comment: `
Contacto creado desde American Chassis Depot Website

**Información:**
- Nombre: ${data.name}
- Email: ${data.email}
- Empresa: ${data.company || 'No especificada'}
- Teléfono: ${data.phone || 'No especificado'}
- Idioma: ${data.language === 'es' ? 'Español' : 'English'}
- Fuente: Website
- Timestamp: ${new Date().toISOString()}
      `,
      company_id: ODOO_CONFIG.companyId,
      user_id: uid
    };

    const contactId = await createOdooContact(uid, contactData);

    console.log('✅ Form submission processed successfully in Odoo');
    return {
      success: true,
      message: 'Formulario procesado exitosamente en Odoo',
      odooLeadId: leadId,
      odooContactId: contactId
    };

  } catch (error) {
    console.error('❌ Error processing form submission for Odoo:', error);
    return {
      success: false,
      message: `Error al procesar formulario en Odoo: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Test de conexión con Odoo
export async function testOdooConnection(): Promise<{ success: boolean; message: string; uid?: number }> {
  try {
    console.log('🧪 Testing Odoo connection...');
    
    if (!ODOO_CONFIG.url || !ODOO_CONFIG.username || !ODOO_CONFIG.password) {
      return {
        success: false,
        message: 'Odoo credentials not configured'
      };
    }

    const uid = await authenticateOdoo();
    
    return {
      success: true,
      message: `Successfully connected to Odoo. UID: ${uid}`,
      uid
    };

  } catch (error) {
    console.error('❌ Odoo connection test failed:', error);
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Obtener estadísticas de leads en Odoo
export async function getOdooLeadStats(): Promise<{ success: boolean; message: string; stats?: any }> {
  try {
    console.log('📊 Getting Odoo lead statistics...');
    
    if (!ODOO_CONFIG.url || !ODOO_CONFIG.username || !ODOO_CONFIG.password) {
      return {
        success: false,
        message: 'Odoo credentials not configured'
      };
    }

    const uid = await authenticateOdoo();

    // Obtener estadísticas básicas
    const today = new Date().toISOString().split('T')[0];
    
    const todayCount = await makeOdooRequest<number>(
      'object',
      'execute_kw',
      [ODOO_CONFIG.database, uid, ODOO_CONFIG.password, 'crm.lead', 'search_count', [[['create_date', '>=', today]]]]
    );

    const totalCount = await makeOdooRequest<number>(
      'object',
      'execute_kw',
      [ODOO_CONFIG.database, uid, ODOO_CONFIG.password, 'crm.lead', 'search_count', [[]]]
    );

    const stats = {
      todayLeads: todayCount,
      totalLeads: totalCount,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Successfully retrieved Odoo lead statistics:', stats);
    
    return {
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      stats
    };

  } catch (error) {
    console.error('❌ Error getting Odoo lead stats:', error);
    return {
      success: false,
      message: `Error obteniendo estadísticas: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
