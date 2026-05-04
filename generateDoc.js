// Motor de Generación de Documentos · OASYS BASE CAMP
// Genera documentos personalizados desde plantillas maestras

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Genera un documento desde una plantilla
 * @param {string} templateName - Nombre del archivo de plantilla
 * @param {object} data - Objeto con datos para sustituir variables
 * @param {string} outputFileName - Nombre del archivo de salida
 */
function generateDoc(templateName, data, outputFileName) {
    try {
        // Ruta de la plantilla
        const templatePath = path.join(__dirname, 'assets', 'legal', 'templates', templateName);

        // Verificar que existe la plantilla
        if (!fs.existsSync(templatePath)) {
            console.error(`❌ Error: Plantilla no encontrada: ${templatePath}`);
            return false;
        }

        // Leer plantilla
        let content = fs.readFileSync(templatePath, 'utf8');

        // Sustituir variables
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        }

        // Ruta de salida
        const outputPath = path.join(__dirname, outputFileName);

        // Crear directorio de salida si no existe
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Guardar documento generado
        fs.writeFileSync(outputPath, content, 'utf8');

        console.log(`✅ ¡Éxito! Generado: ${outputFileName}`);
        return true;

    } catch (error) {
        console.error(`❌ Error generando documento: ${error.message}`);
        return false;
    }
}

// Datos maestros de Paco para el test de excelencia (fallback)
const pacoData = {
    ID_PLAZA: '13',
    NUMERO_PLAZA: '13',
    NOMBRE_CLIENTE: 'Francisco García Yuste',
    NIF_CLIENTE: '03833458W',
    ALIAS_SOCIO: 'Lolo',
    PRECIO: '450,00',
    FACTURA_ID: 'BSG-2026-013',
    BASE_IMPONIBLE: '371,90',
    IVA: '78,10',
    TOTAL: '450,00',
    FECHA: '16 de mayo de 2026',
    FECHA_FIRMA: '16 de mayo de 2026',
    ESPECIE_MASCOTA: 'Labrador',
    PESO: '40'
};

/**
 * Obtiene datos de una plaza desde Supabase
 * @param {string} id - ID de la plaza
 * @returns {object|null} Datos de la plaza o null si no existe
 */
async function getPlazaData(id) {
    try {
        console.log(`🔍 Buscando plaza ID: ${id} en Supabase...`);

        const { data: plaza, error } = await supabase
            .from('bsg_plazas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`❌ Error Supabase: ${error.message}`);
            console.error(`   Code: ${error.code}, Details: ${error.details}`);
            return null;
        }

        if (!plaza) {
            console.error(`❌ Plaza ID ${id} no encontrada en la base de datos`);
            return null;
        }

        console.log(`✅ Plaza encontrada: ${plaza.numero_plaza} - ${plaza.nombre_fundador || 'Sin nombre'}`);

        // Validar NIF - campo crítico para documentos legales
        if (!plaza.nif || plaza.nif.trim() === "") {
            console.error(`❌ Error: La Plaza ${plaza.id} no tiene NIF. Generación abortada para evitar documentos nulos.`);
            return null;
        }

        // Mapear campos de base de datos a variables de plantilla
        return {
            ID_PLAZA: plaza.id.toString(),
            NUMERO_PLAZA: plaza.numero_plaza?.toString() || plaza.id.toString(),
            NOMBRE_CLIENTE: plaza.nombre_fundador || 'Cliente',
            NIF_CLIENTE: plaza.nif || '',
            ALIAS_SOCIO: plaza.nombre_mascota || '',
            PRECIO: '450,00',
            FACTURA_ID: `BSG-2026-${plaza.id.toString().padStart(3, '0')}`,
            BASE_IMPONIBLE: '371,90',
            IVA: '78,10',
            TOTAL: '450,00',
            FECHA: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            FECHA_FIRMA: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            ESPECIE_MASCOTA: plaza.especie_raza || '',
            PESO: plaza.peso_kg?.toString() || ''
        };
    } catch (error) {
        console.error(`❌ Error conectando a Supabase: ${error.message}`);
        return null;
    }
}

// Función principal async
async function main() {
    // Parsear argumentos de línea de comandos
    const args = process.argv.slice(2);
    const hasArgs = args.length > 0;

    if (hasArgs) {
        // Modo dinámico con argumentos
        const params = {};
        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith('--')) {
                const key = args[i].slice(2);
                const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
                params[key] = value;
                if (value !== true) i++; // Saltar el valor ya procesado
            }
        }

        const id = params.id || '01';
        const template = params.template || 'master_agreement';
        const output = params.output || `generated_${template}_${id}.md`;

        // Mapeo de templates
        const templateMap = {
            'master_agreement': 'Master_Agreement.md',
            'master_invoice': 'Master_Invoice.md',
            'agreement': 'Master_Agreement.md',
            'invoice': 'Master_Invoice.md'
        };

        const templateFile = templateMap[template] || template;

        // Obtener datos reales de Supabase
        const data = await getPlazaData(id);
        if (!data) {
            console.error('❌ No se pudo generar el documento. Verifica el ID de plaza y la conexión a Supabase.');
            return;
        }

        console.log(`🚀 Generando documento: ${template} para ID ${id}...\n`);
        generateDoc(templateFile, data, output);
    } else {
        // Modo test: generar documentos de prueba
        console.log('🚀 Iniciando generación de documentos...\n');

        generateDoc('Master_Agreement.md', pacoData, 'Acuerdo_Paco_FINAL.md');
        generateDoc('Master_Invoice.md', pacoData, 'Factura_Paco_FINAL.md');

        console.log('\n✨ Generación completada. Revisa los archivos generados.');
    }
}

// Ejecutar función principal
main().catch(error => {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
});