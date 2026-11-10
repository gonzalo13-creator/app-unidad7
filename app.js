// --- SISTEMA DE CONTRASEÑA ---
function checkPassword() {
    const pass = document.getElementById('pass-input').value;
    // ⚠️ ACÁ PODÉS CAMBIAR LA CONTRASEÑA "silos2026" POR LA QUE QUIERAS
    if (pass === 'silos2026') { 
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
        sessionStorage.setItem('loggedIn', 'true');
        init(); // Arranca la app
    } else {
        document.getElementById('pass-error').style.display = 'block';
    }
}
// -----------------------------

window.onerror = function(msg, url, line, col, error) {
    console.error("Error crítico:", msg, {url, line, col, error});
    let errDiv = document.getElementById('error-fatal');
    if(!errDiv) {
        errDiv = document.createElement('div');
        errDiv.id = 'error-fatal';
        errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#ef4444;color:white;padding:15px;z-index:99999;font-size:14px;text-align:center;';
        document.body.appendChild(errDiv);
    }
    errDiv.innerHTML = "<b>⚠️ Ocurrió un error.</b><br>Por favor, recargá la página (Ctrl+F5) o borrá los datos del sitio.";
    return false;
};

const DB_VERSION = 41;
const DB_KEY = 'unidad7_db_v41';
const PH_BASE = 80;

const TABLA_SILOS = [[0,1221],[0.5,1204],[1,1187],[1.5,1170],[2,1153],[2.5,1136],[3,1119],[3.5,1102],[4,1085],[4.5,1068],[5,1051],[5.5,1034],[6,1017],[6.5,1000],[7,983],[7.5,966],[8,949],[8.5,932],[9,915],[9.5,898],[10,881],[10.5,864],[11,847],[11.5,830],[12,813],[12.5,796],[13,779],[13.5,762],[14,745],[14.5,728],[15,711],[15.5,694],[16,677],[16.5,660],[17,643],[17.5,626],[18,609],[18.5,592],[19,575],[19.5,558],[20,541],[20.5,524],[21,507],[21.5,490],[22,473],[22.5,456],[23,439],[23.5,422],[24,405],[24.5,388],[25,371],[25.5,354],[26,337],[26.5,320],[27,303],[27.5,286],[28,269],[28.5,252],[29,235],[29.5,218],[30,201],[30.5,184],[31,167],[31.5,150],[32,133],[32.5,116],[33,99],[33.5,82],[34,65],[34.5,48],[35,31],[35.5,23],[36,13],[36.5,8],[37,3.4],[37.5,1]];
const TABLA_ENTRESILOS = [[0,311.5],[0.5,307.25],[1,303],[1.5,298.75],[2,294.5],[2.5,290.25],[3,286],[3.5,281.75],[4,277.5],[4.5,273.25],[5,269],[5.5,264.75],[6,260.5],[6.5,256.25],[7,252],[7.5,247.75],[8,243.5],[8.5,239.25],[9,235],[9.5,230.75],[10,226.5],[10.5,222.25],[11,218],[11.5,213.75],[12,209.5],[12.5,205.25],[13,201],[13.5,196.75],[14,192.5],[14.5,188.25],[15,184],[15.5,179.75],[16,175.5],[16.5,171.25],[17,167],[17.5,162.75],[18,158.5],[18.5,154.25],[19,150],[19.5,145.75],[20,141.5],[20.5,137.25],[21,133],[21.5,128.75],[22,124.5],[22.5,120.25],[23,116],[23.5,111.75],[24,107.5],[24.5,103.25],[25,99],[25.5,94.75],[26,90.5],[26.5,86.25],[27,82],[27.5,77.75],[28,73.5],[28.5,69.25],[29,65],[29.5,60.75],[30,56.5],[30.5,52.25],[31,48],[31.5,43.75],[32,39.5],[32.5,35.25],[33,31],[33.5,26.75],[34,22.5],[34.5,18.25],[35,14],[35.5,9.75],[36,6.5],[36.5,3.75],[37,1.25],[37.5,0.6]];
const SILOS_MANUALES = [701, 703, 704, 706, 707, 709, 710, 712, 713, 715, 716, 718];
const MIN_14 = [702, 705, 708, 711, 714, 717];
const MIN_10 = [502, 505, 508, 511, 514, 517];

const TANQUES_CONFIG = [
    { id: 'CTM', piso: 1, max: 130, padre: 'SSE5' }, { id: 'IL1', piso: 1, max: 230, padre: 'SL1' }, { id: 'IL2', piso: 1, max: 230, padre: 'SL2' }, { id: 'IL3', piso: 1, max: 230, padre: 'SL3' }, { id: 'IL4', piso: 1, max: 230, padre: 'SL4' }, { id: 'ISE1', piso: 1, max: 120, padre: 'SSE1' }, { id: 'ISE2', piso: 1, max: 130, padre: 'SSE2' }, { id: 'ISE3', piso: 2, max: 130, padre: 'SSE3' }, { id: 'ISE4', piso: 2, max: 130, padre: 'SSE4' }, { id: 'P3', piso: 3, max: 330, padre: 'TA2' }, { id: 'R1', piso: 2, max: 200, padre: 'P2' }, { id: 'R2', piso: 2, max: 200, padre: 'P4' },
    { id: 'SSE5', piso: 3, max: 200, padre: null }, { id: 'SL1', piso: 3, max: 210, padre: null }, { id: 'SL2', piso: 3, max: 210, padre: null }, { id: 'SL3', piso: 3, max: 210, padre: null }, { id: 'SL4', piso: 3, max: 210, padre: null }, { id: 'SSE1', piso: 3, max: 180, padre: null }, { id: 'SSE2', piso: 3, max: 190, padre: 'TN2' }, { id: 'SSE3', piso: 3, max: 110, padre: 'TA3' }, { id: 'SSE4', piso: 3, max: 110, padre: null }, { id: 'P2', piso: 3, max: 200, padre: null }, { id: 'P4', piso: 3, max: 200, padre: null },
    { id: 'TN2', piso: 6, max: 70, padre: null }, { id: 'TA3', piso: 6, max: 120, padre: 'TA4' }, { id: 'TA1', piso: 6, max: 130, padre: 'TN4' }, { id: 'TA4', piso: 6, max: 140, padre: null }, { id: 'TN4', piso: 6, max: 260, padre: null }, { id: 'TA2', piso: 6, max: 130, padre: 'TA1' }
];

const padresIds = TANQUES_CONFIG.map(t => t.padre).filter(p => p);
const TANQUES_FINALES = TANQUES_CONFIG.filter(t => !padresIds.includes(t.id));
const UNIDADES_PASO_CONFIG = [
    { id: 'CER', tipo: 'CER', nombre: 'CER (Pulmón U6)' }, { id: 'CANO-1', tipo: 'CAÑO', nombre: 'CAÑO 1' }, { id: 'CANO-2', tipo: 'CAÑO', nombre: 'CAÑO 2' }, { id: 'CANO-3', tipo: 'CAÑO', nombre: 'CAÑO 3' }, { id: 'CANO-4', tipo: 'CAÑO', nombre: 'CAÑO 4' }, { id: 'CANO-5', tipo: 'CAÑO', nombre: 'CAÑO 5' }, { id: 'CANO-6', tipo: 'CAÑO', nombre: 'CAÑO 6' },
    { id: 'TOLVA-1', tipo: 'TOLVA', nombre: 'TOLVA 1 (Plataforma 10)' }, { id: 'TOLVA-2', tipo: 'TOLVA', nombre: 'TOLVA 2 (Plataforma 9)' }, { id: 'TOLVA-3', tipo: 'TOLVA', nombre: 'TOLVA 3' }, { id: 'TOLVA-4', tipo: 'TOLVA', nombre: 'TOLVA 4' },
    { id: 'BALANZA-1', tipo: 'BALANZA', nombre: 'BALANZA 1' }, { id: 'BALANZA-2', tipo: 'BALANZA', nombre: 'BALANZA 2' }, { id: 'BALANZA-3', tipo: 'BALANZA', nombre: 'BALANZA 3' }, { id: 'BALANZA-4', tipo: 'BALANZA', nombre: 'BALANZA 4' }, { id: 'BALANZA-5', tipo: 'BALANZA', nombre: 'BALANZA 5' }, { id: 'BALANZA-6', tipo: 'BALANZA', nombre: 'BALANZA 6' }
];

const FILAS_TABLERO = {
    '700': [701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718], '600': [601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617], '500': [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518], '400': [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417], '300': [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318], '200': [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217], '100': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118]
};

let TODOS_LOS_SILOS = [];
Object.keys(FILAS_TABLERO).forEach(k => TODOS_LOS_SILOS = TODOS_LOS_SILOS.concat(FILAS_TABLERO[k]));
const CINTAS = { C1: { nombre: "Extracción 1 (700s / 600s)" }, C2: { nombre: "Extracción 2 (500s / 400s Pares)" }, C3: { nombre: "Extracción 3 (300s / 400s Impares)" }, C4: { nombre: "Extracción 4 (100s / 200s)" } };

let db = { __version: DB_VERSION, cereales: [], silos: {}, herramienta: { cereales: [], silos: {} }, cierres: [] };
let backupDB = null;
let cintaRellenoAbierta = null;
let cintasStockAbiertas = {};
let silosModificadosReciente = [];
let confirmCallback = null;
let estadoFiltradoActual = null;
let tanqueAbierto = null;
let historialFiltroActual = 'TODOS';
let historialSiloActivo = null;
let botContext = { lastCereal: null, lastSilo: null, lastUnit: null, justAskedHelp: false };

const ESTANDARES_CALIDAD = {
    'MAIZ': { nombre: 'MAÍZ (Norma XII)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 75 kg/hl. Dañados < 3%. Quebrados < 2%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 72 kg/hl. Dañados < 5%. Quebrados < 3%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 69 kg/hl. Dañados < 8%. Quebrados < 5%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2. Límite máx. humedad: 14.5%.</i>' },
    'TRIGO': { nombre: 'TRIGO PAN (Norma XX)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 79 kg/hl. Dañados < 1.5%. Mat. extrañas < 0.5%.<br>• <b>Grado 2:</b> P.H. > 76 kg/hl. Dañados < 3%. Mat. extrañas < 1%.<br>• <b>Grado 3:</b> P.H. > 73 kg/hl. Dañados < 5%. Mat. extrañas < 1.5%.<br><br><i>Base: Humedad 14%, Grado 2. Límite máx. humedad: 14.5%.</i>' },
    'SOJA': { nombre: 'SOJA (Norma XVII)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Materias extrañas 1.0%, Granos quebrados 20.0%, Granos dañados 5.0%.<br>• <b>Conforme:</b> La mercadería que no excede las tolerancias de recibo se considera <b>Conforme</b>.<br>• <b>Fuera de Base:</b> La mercadería que excede las tolerancias de recibo se considera <b>Fuera de Base</b> (o Fuera de Estándar), con rebajas.<br><br><i>Base: Humedad 13.5%. Límite máx. humedad: 14%.</i>' },
    'GIRASOL': { nombre: 'GIRASOL (Norma IX)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Materia grasa 42% (s/ sustancia seca y limpia), Acidez 1.5% (hasta 31/8) o 2% (desde 1/9), Humedad 11%, Chamico libre.<br>• <b>Tolerancias de Recibo:</b> Humedad máx. 14%, Materias extrañas máx. 3%, Chamico máx. 0.25%.<br>• <b>Conforme / Fuera de Base:</b> La mercadería dentro de las tolerancias es <b>Conforme</b>; la que las excede es <b>Fuera de Base</b>.' },
    'SORGO': { nombre: 'SORGO GRANÍFERO (Norma XVIII - Mod. 2025)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 74 kg/hl. Dañados < 3%. Quebrados < 1%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 72 kg/hl. Dañados < 5%. Quebrados < 2%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 70 kg/hl. Dañados < 8%. Quebrados < 3%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2. Límite máx. humedad: 14.5%.</i>' },
    'ARVEJA': { nombre: 'ARVEJA (Norma XXVII)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Humedad 14% máx. Materias extrañas 1.0% máx. Granos dañados 3.0% máx. Granos quebrados 2.0% máx.<br>• <b>Conforme / Fuera de Base:</b> Se aplica el criterio de tolerancias de recibo. La mercadería que excede las tolerancias se considera <b>Fuera de Base</b> (con rebajas).' },
    'GARBANZO': { nombre: 'GARBANZO (Norma XXX - Res. 48/2025)', sistema: 'base', detalle: '• <b>Garbanzo Natural (XXX-A):</b> Materias extrañas máx. 2.0%. Defectos y daños leves máx. 7.0%. Defectos y daños intensos máx. 3.0%. Granos quebrados máx. 4.0%.<br>• <b>Garbanzo Seleccionado (XXX-B):</b> Calibres de 7, 8, 9 y 10 mm.<br><br><i>Base: Humedad 14%.</i>' },
    'LENTEJA': { nombre: 'LENTEJA (Norma XXIX)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Materias extrañas 1.0%, Granos dañados 3.0%, Granos quebrados 2.0%.<br><br><i>Base: Humedad 14%.</i>' },
    'POROTO': { nombre: 'POROTO (Norma XVI)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Humedad 15% máx. Libres de insectos vivos. Porotos contrastantes máx. 2%. Porotos de otras clases máx. 5%.<br>• <b>Conforme / Fuera de Base:</b> Se aplica el criterio de tolerancias de recibo.' },
    'PELLETS': { nombre: 'PELLETS DE AFRECHILLO (Norma XV)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Humedad 14% máx. Desmenuzado 6% máx. Cenizas 10% máx. Almidón 28% (s/ sustancia tal cual). Aglutinantes 1.5% máx.<br>• <b>Ventas según muestra:</b> Los pellets que excedan tolerancias o presenten olores objetables se someten a arbitraje.' },
    'CEBADA': { nombre: 'CEBADA (Norma VI)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 64 kg/hl. Dañados < 2%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 62 kg/hl. Dañados < 4%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 60 kg/hl. Dañados < 6%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2.</i>' },
    'AVENA': { nombre: 'AVENA (Norma III)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 52 kg/hl. Dañados < 2%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 50 kg/hl. Dañados < 4%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 48 kg/hl. Dañados < 6%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2.</i>' },
    'CENTENO': { nombre: 'CENTENO (Norma VII)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 71 kg/hl. Dañados < 2%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 69 kg/hl. Dañados < 4%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 67 kg/hl. Dañados < 6%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2.</i>' },
    'COLZA': { nombre: 'COLZA (Norma VIII)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Materias extrañas 1.0%, Granos dañados 3.0%, Humedad 10%.<br>• <b>Conforme / Fuera de Base:</b> Se aplica el criterio de tolerancias de recibo.' },
    'LINO': { nombre: 'LINO (Norma X)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Materias extrañas 1.0%, Granos dañados 3.0%, Humedad 10%.<br>• <b>Conforme / Fuera de Base:</b> Se aplica el criterio de tolerancias de recibo.' },
    'MANI': { nombre: 'MANÍ (Norma XIII)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 50 kg/hl. Dañados < 3%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 48 kg/hl. Dañados < 5%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 46 kg/hl. Dañados < 8%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 9%, Grado 2.</i>' },
    'MIJO': { nombre: 'MIJO (Norma XIV)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 72 kg/hl. Dañados < 3%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 70 kg/hl. Dañados < 5%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 68 kg/hl. Dañados < 8%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2.</i>' },
    'ALPISTE': { nombre: 'ALPISTE (Norma I)', sistema: 'grados', detalle: '• <b>Grado 1:</b> P.H. > 68 kg/hl. Dañados < 2%. Mat. extrañas < 1%.<br>• <b>Grado 2:</b> P.H. > 66 kg/hl. Dañados < 4%. Mat. extrañas < 1.5%.<br>• <b>Grado 3:</b> P.H. > 64 kg/hl. Dañados < 6%. Mat. extrañas < 2%.<br><br><i>Base: Humedad 14%, Grado 2.</i>' },
    'CARTAMO': { nombre: 'CÁRTAMO (Norma IV)', sistema: 'base', detalle: '• <b>Base de Comercialización:</b> Materias extrañas 2.0%, Granos dañados 5.0%, Humedad 10%.<br>• <b>Conforme / Fuera de Base:</b> Se aplica el criterio de tolerancias de recibo.' }
};

function showToast(msg, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = msg;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    return toast;
}
function showConfirm(title, msg, callback) { document.getElementById('confirm-title').innerText = title; document.getElementById('confirm-msg').innerText = msg; document.getElementById('custom-confirm').classList.add('active'); confirmCallback = callback; }
function closeConfirm(result) { document.getElementById('custom-confirm').classList.remove('active'); if (confirmCallback) { confirmCallback(result); confirmCallback = null; } }
function getFechaLocal() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function parseFechaLocal(str) { if(!str) return new Date(0); const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d); }

let refreshing = false;
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast();
                });
            });
        }).catch(err => console.log('SW Error:', err));
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!refreshing) { window.location.reload(); refreshing = true; } });
}
function showUpdateToast() {
    const toast = showToast("🚀 Nueva versión disponible. Tocá aquí para actualizar.", "update", 15000);
    toast.onclick = () => { toast.innerHTML = "Actualizando..."; if (navigator.serviceWorker.controller) navigator.serviceWorker.postMessage({ action: 'skipWaiting' }); };
}

function init() {
    if(localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    try {
        let saved = localStorage.getItem(DB_KEY);
        if (!saved) {
            let old = localStorage.getItem('unidad7_db_v40') || localStorage.getItem('unidad7_db_v39');
            if (old) { db = JSON.parse(old); db.__version = DB_VERSION; if(!db.cierres) db.cierres = []; }
        } else { db = JSON.parse(saved); }
    } catch(e) { db = { __version: DB_VERSION, cereales: [], silos: {}, herramienta: { cereales: [], silos: {} }, cierres: [] }; }

    if (!db.cereales || db.cereales.length === 0) {
        db.cereales = [
            {id:'MAIZ', nombre:'MAÍZ', ph:76, color:'#f97316'}, {id:'SORGO', nombre:'SORGO', ph:72, color:'#3b82f6'}, {id:'SOJA', nombre:'SOJA', ph:71, color:'#eab308'}, {id:'TRIGO', nombre:'TRIGO', ph:78, color:'#16a34a'}, {id:'GIRASOL', nombre:'GIRASOL', ph:42, color:'#64748b'}, {id:'CEBADA', nombre:'CEBADA', ph:66, color:'#b45309'}, {id:'ARVEJA', nombre:'ARVEJA', ph:78, color:'#84cc16'}, {id:'GARBANZO', nombre:'GARBANZO', ph:75, color:'#eab308'}, {id:'LENTEJA', nombre:'LENTEJA', ph:75, color:'#f43f5e'}, {id:'POROTO', nombre:'POROTO', ph:75, color:'#8b5cf6'}, {id:'PELLETS', nombre:'PELLETS', ph:60, color:'#a16207'}, {id:'AVENA', nombre:'AVENA', ph:50, color:'#94a3b8'}, {id:'CENTENO', nombre:'CENTENO', ph:70, color:'#475569'}, {id:'COLZA', nombre:'COLZA', ph:65, color:'#fbbf24'}, {id:'LINO', nombre:'LINO', ph:65, color:'#d97706'}, {id:'MANI', nombre:'MANÍ', ph:50, color:'#b45309'}, {id:'MIJO', nombre:'MIJO', ph:75, color:'#ca8a04'}, {id:'ALPISTE', nombre:'ALPISTE', ph:70, color:'#65a30d'}, {id:'CARTAMO', nombre:'CÁRTAMO', ph:60, color:'#ea580c'}, {id:'MEZCLA', nombre:'MEZCLA', ph:75, color:'#ec4899'}
        ];
    }
    if (!db.silos) db.silos = {};
    if (!db.herramienta) db.herramienta = { cereales: [], silos: {} };
    if (!db.cierres) db.cierres = [];
    
    TANQUES_CONFIG.forEach(t => {
        if(!db.silos[t.id]) { db.silos[t.id] = { estado: 'VACIO', cereal: '', calidad: '', tonelaje: 0, historial: [], alerta_manual: false, fecha_primera_carga: null, fumigacion_fecha: null, fumigacion_tipo: null, origen: null, lastUpdate: 0, tipo: 'TANQUE', piso: t.piso, max: t.max, padre: t.padre }; }
        else { db.silos[t.id].tipo = 'TANQUE'; db.silos[t.id].piso = t.piso; db.silos[t.id].max = t.max; db.silos[t.id].padre = t.padre; }
    });

    UNIDADES_PASO_CONFIG.forEach(u => {
        if(!db.silos[u.id]) { db.silos[u.id] = { estado: 'VACIO', cereal: '', calidad: '', tonelaje: 0, historial: [], alerta_manual: false, fecha_primera_carga: null, fumigacion_fecha: null, fumigacion_tipo: null, origen: null, lastUpdate: 0, tipo: u.tipo, extra: u.nombre }; }
        else { db.silos[u.id].tipo = u.tipo; db.silos[u.id].extra = u.nombre; }
    });

    Object.keys(db.silos).forEach(num => {
        let d = db.silos[num];
        if(d.fumigacion_fecha && !d.fumigacion_tipo) d.fumigacion_tipo = 'TOTAL';
        if(!d.tipo) {
            if (TANQUES_CONFIG.find(t => t.id === num)) d.tipo = 'TANQUE';
            else if (UNIDADES_PASO_CONFIG.find(u => u.id === num)) d.tipo = UNIDADES_PASO_CONFIG.find(u => u.id === num).tipo;
            else d.tipo = (Number(num) >= 101 && Number(num) <= 718) ? (esSiloTipo(Number(num)) === 'SILO' ? 'SILO' : 'ENTRESILO') : 'TANQUE';
        }
    });

    guardarDB();
    actualizarSelects(); dibujarTablero(); dibujarTanques(); dibujarCierres(); restaurarBorrador();
    if(document.querySelectorAll('#lista-movimientos .row-inputs').length === 0) agregarFilaMovimiento();
    renderHerramientaCerealesChk(); actualizarExistencias(); updateOnlineStatus();
}

function updateOnlineStatus() {
    const dot = document.getElementById('status-dot'); if(!dot) return;
    if(navigator.onLine) { dot.className = 'online-dot'; dot.title = 'Conectado a Internet'; }
    else { dot.className = 'offline-dot'; dot.title = 'Sin conexión (Modo Offline)'; }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); localStorage.setItem('darkMode', document.body.classList.contains('dark-mode')); }
function guardarDB() { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch(e) { showToast("⚠️ Memoria llena. Usá el Archivador en Admin.", "error"); } }

function cambiarTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active'); if(btn) btn.classList.add('active');
    if(id === 'existencias') { actualizarExistencias(); calcularStock(); }
    if(id === 'alertas') dibujarAlertas();
    if(id === 'tanques') { dibujarTanques(); actualizarResumenTanques(); }
    if(id === 'rellenos') { actualizarOpcionesRelleno(); }
    if(id === 'tablero') { dibujarTablero(); }
    if(id === 'herramienta') renderHerramientaCintas();
}

function cambiarSubTab(id, btn) {
    document.querySelectorAll('#rellenos > div[id^="sub-"]').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = 'block'; btn.classList.add('active');
}

function interpolar(tabla, metros) {
    if(metros <= tabla[0][0]) return tabla[0][1];
    if(metros >= tabla[tabla.length-1][0]) return tabla[tabla.length-1][1];
    for(let i=0; i<tabla.length-1; i++) { let a = tabla[i], b = tabla[i+1]; if(metros >= a[0] && metros <= b[0]) return a[1] + (b[1]-a[1]) * ((metros - a[0]) / (b[0] - a[0])); }
    return 0;
}

function getSiloData(num) {
    if(!db.silos[num]) {
        let tipo = 'SILO'; let isNum = !isNaN(num) && num !== '';
        if(!isNum) { let tConf = TANQUES_CONFIG.find(t => t.id === num); if(tConf) tipo = 'TANQUE'; else { let uConf = UNIDADES_PASO_CONFIG.find(u => u.id === num); if(uConf) tipo = uConf.tipo; else tipo = 'TANQUE'; } }
        else { let n = parseInt(num); if (!(n >= 101 && n <= 118) && !(n >= 301 && n <= 318) && !(n >= 501 && n <= 518) && !(n >= 701 && n <= 718)) tipo = 'ENTRESILO'; }
        db.silos[num] = { estado: 'VACIO', cereal: '', calidad: '', tonelaje: 0, historial: [], relleno_manual: null, alerta_manual: false, fecha_primera_carga: null, fumigacion_fecha: null, fumigacion_tipo: null, origen: null, lastUpdate: 0, tipo: tipo };
    }
    if(!db.silos[num].historial) db.silos[num].historial = [];
    if(!db.silos[num].lastUpdate) db.silos[num].lastUpdate = 0;
    if(!db.silos[num].tipo) {
        let isNum = !isNaN(num) && num !== '';
        if(!isNum) { let tConf = TANQUES_CONFIG.find(t => t.id === num); if(tConf) db.silos[num].tipo = 'TANQUE'; else { let uConf = UNIDADES_PASO_CONFIG.find(u => u.id === num); if(uConf) db.silos[num].tipo = uConf.tipo; else db.silos[num].tipo = 'TANQUE'; } }
        else { let n = parseInt(num); db.silos[num].tipo = ((n >= 101 && n <= 118) || (n >= 301 && n <= 318) || (n >= 501 && n <= 518) || (n >= 701 && n <= 718)) ? 'SILO' : 'ENTRESILO'; }
    }
    return db.silos[num];
}
function esSiloTipo(num) { return ((num >= 101 && num <= 118) || (num >= 301 && num <= 318) || (num >= 501 && num <= 518) || (num >= 701 && num <= 718)) ? 'SILO' : 'ENTRESILO'; }
function esUnidadValida(u) {
    if (typeof u === 'number' || !isNaN(u)) { let num = parseInt(u); return (num >= 101 && num <= 118) || (num >= 201 && num <= 217) || (num >= 301 && num <= 318) || (num >= 401 && num <= 417) || (num >= 501 && num <= 518) || (num >= 601 && num <= 617) || (num >= 701 && num <= 718); }
    return true;
}
function obtenerTopeMetros(num) { if(MIN_14.includes(num)) return 14; if(MIN_10.includes(num)) return 10; return 0; }
function getEspacioDisp(num) {
    let d = db.silos[num]; if(!d || (d.estado !== 'CON_CARGA' && d.estado !== 'TAPADA')) return 0;
    let cereal = db.cereales.find(c => c.id === d.cereal); if(!cereal) return 0;
    let n = parseInt(num); let tipo = esSiloTipo(n);
    if(SILOS_MANUALES.includes(n)) return d.relleno_manual || 0;
    let topeMetros = obtenerTopeMetros(n); let capMaxRefTope = interpolar(tipo === 'SILO' ? TABLA_SILOS : TABLA_ENTRESILOS, topeMetros);
    let capMaxTonTope = Math.round(capMaxRefTope * cereal.ph / PH_BASE); let actual = parseFloat(d.tonelaje) || 0;
    return capMaxTonTope - actual;
}

let searchTimeout;
function filtrarSmartSearchDebounce() { clearTimeout(searchTimeout); searchTimeout = setTimeout(calcularStock, 300); }
function guardarBorrador() { let lista = document.getElementById('lista-movimientos'); if(lista) localStorage.setItem('movimientos_borrador', lista.innerHTML); }
function restaurarBorrador() { let draft = localStorage.getItem('movimientos_borrador'); let lista = document.getElementById('lista-movimientos'); if(draft && lista) { lista.innerHTML = draft; lista.querySelectorAll('.m-tipo-accion').forEach(sel => cambiarTipoAccion(sel)); lista.querySelectorAll('.m-tipo-unidad').forEach(sel => cambiarTipoUnidad(sel)); showToast("📝 Borrador de movimientos restaurado", "info"); } }
function limpiarBorrador() { localStorage.removeItem('movimientos_borrador'); }

function agregarFilaMovimiento() {
    let div = document.createElement('div'); div.className = 'row-inputs';
    div.innerHTML = `
        <div class="header-actions"><span style="font-weight:bold; color:var(--primary);">Nueva Acción</span><div><button class="btn-dup" aria-label="Duplicar fila" onclick="duplicarFila(this)" type="button">📋 Duplicar</button><button class="btn-del" aria-label="Eliminar fila" onclick="this.closest('.row-inputs').remove(); guardarBorrador();" type="button">🗑️ Eliminar</button></div></div>
        <div class="form-group full"><label>Tipo de Acción</label><select class="m-tipo-accion" onchange="cambiarTipoAccion(this); guardarBorrador();" style="font-weight:bold;"><option value="INGRESO">📥 Ingreso de Mercadería</option><option value="EGRESO">📤 Egreso / Baja</option><option value="RECIRCULACION">🔄 Recirculación</option><option value="ESTADO">🚫 Cambio de Estado</option></select></div>
        <div class="form-group"><label>Tipo de Unidad</label><select class="m-tipo-unidad" onchange="cambiarTipoUnidad(this); guardarBorrador();"><option value="SILO">Silo / Entresilo</option><option value="TANQUE">Tanque</option><option value="PASO">Caño / Tolva / Balanza / CER</option></select></div>
        <div class="form-group"><label>Unidad</label><input type="number" placeholder="Ej: 501" class="m-silo" min="1" inputmode="numeric" oninput="autocompletarSilo(this); guardarBorrador();"><select class="m-silo-select" style="display:none;" onchange="autocompletarSiloSelect(this); guardarBorrador();"></select></div>
        <div class="form-group"><label>Fecha</label><input type="date" class="m-fecha" onchange="guardarBorrador();"></div>
        <div class="campos-dinamicos" style="display:contents;"></div>
        <div class="form-group full"><label>Observaciones (Opcional)</label><input type="text" placeholder="Ej: Mercadería húmeda..." class="m-obs" oninput="guardarBorrador();"></div>
    `;
    div.querySelector('.m-fecha').value = '';
    document.getElementById('lista-movimientos').appendChild(div);
    cambiarTipoAccion(div.querySelector('.m-tipo-accion')); cambiarTipoUnidad(div.querySelector('.m-tipo-unidad')); guardarBorrador();
}

function cambiarTipoUnidad(select) {
    let row = select.closest('.row-inputs'); let tipo = select.value;
    let inputSilo = row.querySelector('.m-silo'); let selSilo = row.querySelector('.m-silo-select');
    if (tipo === 'SILO') { inputSilo.style.display = 'block'; selSilo.style.display = 'none'; inputSilo.value = ''; inputSilo.classList.remove('ignore'); }
    else {
        inputSilo.style.display = 'none'; selSilo.style.display = 'block'; inputSilo.classList.add('ignore');
        if (tipo === 'TANQUE') { selSilo.innerHTML = TANQUES_CONFIG.map(t => `<option value="${t.id}">${t.id} (Piso ${t.piso})</option>`).join(''); }
        else if (tipo === 'PASO') { selSilo.innerHTML = UNIDADES_PASO_CONFIG.map(u => `<option value="${u.id}">${u.nombre}</option>`).join(''); }
    }
    cambiarTipoAccion(row.querySelector('.m-tipo-accion'));
}

function cambiarTipoAccion(select) {
    let row = select.closest('.row-inputs'); let tipoAccion = select.value; let tipoUnidad = row.querySelector('.m-tipo-unidad').value;
    let container = row.querySelector('.campos-dinamicos'); if(!container) return; container.innerHTML = '';
    let inputSilo = row.querySelector('.m-silo'); if(inputSilo) inputSilo.oninput = function() { autocompletarSilo(this); guardarBorrador(); };
    let esSilo = (tipoUnidad === 'SILO'); let esFumigable = (tipoUnidad === 'SILO' || tipoUnidad === 'TANQUE');

    if(tipoAccion === 'INGRESO') {
        let campos = `<div class="form-group"><label>Origen</label><select class="m-origen" onchange="validarOrigen(this); guardarBorrador();"><option value="CAMIONES">Camiones</option><option value="VAGONES">Vagones</option><option value="TRANSILE">Transile</option><option value="TRANSFERENCIA">Transferencia (U6)</option><option value="LIMPIEZA">Limpieza</option></select></div><div class="form-group" id="div-unidad-origen" style="display:none;"><label>Unidad Origen</label><input type="text" class="m-unidad-origen" placeholder="Ej: Silo 305" oninput="guardarBorrador();"></div><div class="form-group"><label>Cereal</label><select class="m-cereal" onchange="validarMezclaFila(this.closest('.row-inputs')); guardarBorrador();">${db.cereales.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}</select></div><div class="form-group"><label>Calidad</label><input type="text" class="m-calidad" placeholder="Ej: G2" oninput="guardarBorrador();"></div>`;
        if (esFumigable) campos += `<div class="form-group"><label>¿Fumigado?</label><select class="m-fumigo" onchange="guardarBorrador();"><option value="NO">No se fumigó</option><option value="TOTAL">Fumigación Total</option><option value="LIQUIDO">Solo Líquido</option><option value="PASTILLAS">Solo Pastillas</option></select></div>`;
        if (esSilo) campos += `<div class="form-group"><label>Metros Vacío</label><input type="number" class="m-metros" step="0.5" min="0" inputmode="decimal" oninput="autoCalcularFila(this); guardarBorrador();"></div><div class="form-group"><label>Tonelaje</label><input type="number" class="m-tons" min="0" placeholder="0" inputmode="decimal" oninput="guardarBorrador();"></div>`;
        else campos += `<div class="form-group full"><label>Tonelaje (Manual)</label><input type="number" class="m-tons-manual" min="0" placeholder="0" inputmode="decimal" oninput="guardarBorrador();"></div>`;
        container.innerHTML = campos;
    }
    else if(tipoAccion === 'EGRESO') {
        let campos = `<div class="form-group"><label>Motivo Baja</label><select class="m-motivo-baja" onchange="guardarBorrador();"><option value="EMBARQUE">Embarque</option><option value="RECARGA">Recarga</option><option value="TRANSFERENCIA">Transferencia (U6)</option><option value="TRANSILE">Transile</option><option value="LIMPIEZA">Limpieza</option></select></div>`;
        if (esSilo) campos += `<div class="form-group"><label>Nueva Medida (m)</label><input type="number" class="m-nuevos-metros" step="0.5" min="0" inputmode="decimal" oninput="calcularEgresoPorMetros(this); guardarBorrador();" placeholder="Metros Vacíos"></div>`;
        campos += `<div class="form-group"><label>Tonelaje a restar</label><input type="number" class="m-tons-baja" min="0" placeholder="0" inputmode="decimal" oninput="guardarBorrador();"></div>`;
        container.innerHTML = campos;
    }
    else if(tipoAccion === 'RECIRCULACION') {
        let campos = `<div class="form-group"><label>Motivo</label><select class="m-motivo-recir" onchange="guardarBorrador();"><option value="FUMIGACION">Fumigación</option><option value="MUESTREO">Muestreo / Control</option><option value="TEMPERATURA">Bajar Temperatura</option></select></div>`;
        if (esFumigable) campos += `<div class="form-group"><label>¿Se fumigó en este evento?</label><select class="m-fumigo-recir" onchange="guardarBorrador();"><option value="NO">No se fumigó</option><option value="TOTAL">Fumigación Total</option><option value="LIQUIDO">Solo Líquido</option><option value="PASTILLAS">Solo Pastillas</option></select></div>`;
        container.innerHTML = campos;
    }
    else if(tipoAccion === 'ESTADO') {
        container.innerHTML = `<div class="form-group"><label>Nuevo Estado</label><select class="m-nuevo-estado" onchange="guardarBorrador();"><option value="TAPADA">Tapado</option><option value="FUERA_SERVICIO">Fuera de Servicio</option><option value="VACIO">Vacío (Borrar Carga)</option></select></div>`;
    }
}

function validarOrigen(select) { let row = select.closest('.row-inputs'); let divUnidad = row.querySelector('#div-unidad-origen'); if(select.value === 'TRANSILE') divUnidad.style.display = 'flex'; else divUnidad.style.display = 'none'; }
function validarMezclaFila(row) {
    let inputSilo = row.querySelector('.m-silo'); let selSilo = row.querySelector('.m-silo-select'); let inputCereal = row.querySelector('.m-cereal'); if(!inputCereal) return;
    let silo = inputSilo.style.display !== 'none' ? parseInt(inputSilo.value) : selSilo.value; let cereal = inputCereal.value; if(!silo || !cereal) return;
    let d = getSiloData(silo);
    if(d.cereal && d.cereal !== cereal && d.estado === 'CON_CARGA') { row.style.border = "2px solid #ef4444"; row.title = "⚠️ Ojo: Esta unidad ya contiene " + d.cereal; }
    else { row.style.border = "1px solid var(--border)"; row.title = ""; }
}

function duplicarFila(btn) {
    let row = btn.closest('.row-inputs'); let newRow = document.createElement('div'); newRow.className = 'row-inputs'; newRow.innerHTML = row.innerHTML;
    newRow.querySelector('.m-silo').value = ''; newRow.querySelector('.m-fecha').value = ''; let obs = newRow.querySelector('.m-obs'); if(obs) obs.value = '';
    document.getElementById('lista-movimientos').appendChild(newRow);
    cambiarTipoAccion(newRow.querySelector('.m-tipo-accion')); cambiarTipoUnidad(newRow.querySelector('.m-tipo-unidad'));
    let oldCampos = row.querySelector('.campos-dinamicos'); let newCampos = newRow.querySelector('.campos-dinamicos');
    if(oldCampos && newCampos) { let oldInputs = oldCampos.querySelectorAll('input, select'); let newInputs = newCampos.querySelectorAll('input, select'); oldInputs.forEach((inp, idx) => { if(inp.type !== 'number' && newInputs[idx]) newInputs[idx].value = inp.value; }); }
    guardarBorrador();
}

function autocompletarSilo(input) {
    let row = input.closest('.row-inputs'); let num = parseInt(input.value); if(!num || !db.silos[num]) return;
    let d = db.silos[num]; let selCereal = row.querySelector('.m-cereal'); let inputCalidad = row.querySelector('.m-calidad');
    if(selCereal && inputCalidad && d.cereal) { selCereal.value = d.cereal; inputCalidad.value = d.calidad || ''; validarMezclaFila(row); }
}
function autocompletarSiloSelect(select) {
    let row = select.closest('.row-inputs'); let val = select.value; if(!val || !db.silos[val]) return;
    let d = db.silos[val]; let selCereal = row.querySelector('.m-cereal'); let inputCalidad = row.querySelector('.m-calidad');
    if(selCereal && inputCalidad && d.cereal) { selCereal.value = d.cereal; inputCalidad.value = d.calidad || ''; validarMezclaFila(row); }
}

function autoCalcularFila(input) {
    let row = input.closest('.row-inputs'); let inputSilo = row.querySelector('.m-silo'); let inputCereal = row.querySelector('.m-cereal'); let inputMetros = row.querySelector('.m-metros'); let inputTons = row.querySelector('.m-tons');
    if(!inputSilo || !inputCereal || !inputMetros || !inputTons) return;
    let silo = parseInt(inputSilo.value); let cerealId = inputCereal.value; let metros = parseFloat(inputMetros.value);
    if(!silo || silo < 0) { row.style.border = "2px solid #ef4444"; inputTons.value = ''; return; }
    if(!cerealId || isNaN(metros) || metros < 0) { inputTons.value = ''; return; }
    if(SILOS_MANUALES.includes(silo)) { inputTons.value = ''; inputTons.placeholder = "Manual!"; return; }
    if(MIN_14.includes(silo) && metros < 14) { row.style.border = "2px solid #ef4444"; inputTons.value = ''; return; }
    if(MIN_10.includes(silo) && metros < 10) { row.style.border = "2px solid #ef4444"; inputTons.value = ''; return; }
    validarMezclaFila(row);
    let cereal = db.cereales.find(c => c.id === cerealId); let tipo = esSiloTipo(silo);
    let phRef = interpolar(tipo === 'SILO' ? TABLA_SILOS : TABLA_ENTRESILOS, metros);
    let tons = Math.round(phRef * cereal.ph / PH_BASE); inputTons.value = tons;
}

function calcularEgresoPorMetros(input) {
    let row = input.closest('.row-inputs'); let inputSilo = row.querySelector('.m-silo'); let inputNuevosMetros = row.querySelector('.m-nuevos-metros'); let inputTonsBaja = row.querySelector('.m-tons-baja');
    if(!inputSilo || !inputNuevosMetros || !inputTonsBaja) return;
    let silo = parseInt(inputSilo.value); let metros = parseFloat(inputNuevosMetros.value); if(!silo || isNaN(metros) || metros < 0) return;
    let d = getSiloData(silo); if(d.estado === 'VACIO') { inputTonsBaja.value = 0; return; }
    let cereal = db.cereales.find(c => c.id === d.cereal); if(!cereal) return;
    let tipo = esSiloTipo(silo); let topeMetros = obtenerTopeMetros(silo);
    let capMaxRefTope = interpolar(tipo === 'SILO' ? TABLA_SILOS : TABLA_ENTRESILOS, topeMetros);
    let capMaxTon = Math.round(capMaxRefTope * cereal.ph / PH_BASE);
    let refNuevosMetros = interpolar(tipo === 'SILO' ? TABLA_SILOS : TABLA_ENTRESILOS, metros);
    let capacidadRestante = Math.round(refNuevosMetros * cereal.ph / PH_BASE);
    let nuevoTonelaje = capMaxTon - capacidadRestante; if(nuevoTonelaje < 0) nuevoTonelaje = 0;
    let tonsRestadas = (parseFloat(d.tonelaje) || 0) - nuevoTonelaje; if(tonsRestadas < 0) tonsRestadas = 0;
    inputTonsBaja.value = tonsRestadas;
}

function procesarMovimientos() {
    let btn = document.getElementById('btn-guardar-todos'); if(btn.disabled) return;
    let filas = document.querySelectorAll('#lista-movimientos .row-inputs'); let silosEnLote = new Set(); let pendingMoves = []; let errores = []; let warningMsg = "";
    let hoy = new Date(); hoy.setHours(0,0,0,0);

    for (let i = 0; i < filas.length; i++) {
        let row = filas[i]; let tipoAccion = row.querySelector('.m-tipo-accion').value; let tipoUnidad = row.querySelector('.m-tipo-unidad').value;
        let inputSilo = row.querySelector('.m-silo'); let selSilo = row.querySelector('.m-silo-select'); let inputFecha = row.querySelector('.m-fecha'); let inputObs = row.querySelector('.m-obs');
        let silo = inputSilo.style.display !== 'none' ? parseInt(inputSilo.value) : selSilo.value;
        if(!silo) continue;
        let fecha = inputFecha.value; let obs = inputObs ? inputObs.value : '';
        if(!esUnidadValida(silo)) { errores.push(`Unidad ${silo} no existe.`); continue; }
        if(silosEnLote.has(silo)) { errores.push(`Unidad ${silo} está duplicada.`); continue; }
        if(!fecha) { errores.push(`Unidad ${silo}: Falta la fecha.`); continue; }
        let fDate = parseFechaLocal(fecha); if (fDate > hoy) { errores.push(`Unidad ${silo}: La fecha no puede ser futura.`); continue; }
        let d = getSiloData(silo); let moveData = { silo, fecha, tipo: tipoAccion, obs, d };

        if(tipoAccion === 'INGRESO') {
            let cereal = row.querySelector('.m-cereal').value; let calidad = row.querySelector('.m-calidad').value.toUpperCase().trim();
            let fumigo = row.querySelector('.m-fumigo') ? row.querySelector('.m-fumigo').value : 'NO'; let origen = row.querySelector('.m-origen').value; let uniOrigen = row.querySelector('.m-unidad-origen') ? row.querySelector('.m-unidad-origen').value : '';
            let tons = 0; let metros = 0;
            if (tipoUnidad === 'SILO') {
                metros = parseFloat(row.querySelector('.m-metros').value) || 0; tons = parseFloat(row.querySelector('.m-tons').value) || 0;
                if(MIN_14.includes(silo) && metros < 14) { errores.push(`Silo ${silo} requiere mín. 14m.`); continue; }
                if(MIN_10.includes(silo) && metros < 10) { errores.push(`Silo ${silo} requiere mín. 10m.`); continue; }
                let tipoU = esSiloTipo(silo); let topeMetros = obtenerTopeMetros(silo);
                let capMaxRefTope = interpolar(tipoU === 'SILO' ? TABLA_SILOS : TABLA_ENTRESILOS, topeMetros);
                let cerealObj = db.cereales.find(c => c.id === cereal); let capMaxTon = Math.round(capMaxRefTope * (cerealObj ? cerealObj.ph : PH_BASE) / PH_BASE);
                if(tons > capMaxTon) { errores.push(`Silo ${silo}: Capacidad máxima excedida (~${capMaxTon}t).`); continue; }
            } else { tons = parseFloat(row.querySelector('.m-tons-manual').value) || 0; }
            if(tons <= 0) { errores.push(`Unidad ${silo}: Tonelaje debe ser > 0.`); continue; }
            if(d.cereal && d.cereal !== cereal && d.estado === 'CON_CARGA') { errores.push(`Unidad ${silo} ya contiene ${d.cereal}.`); continue; }
            if(!calidad) { errores.push(`Unidad ${silo}: Falta calidad.`); continue; }
            let detalleOrigen = origen; if(origen === 'TRANSILE' && uniOrigen) detalleOrigen += ` (desde ${uniOrigen})`;
            let txtFum = (tipoUnidad === 'SILO' || tipoUnidad === 'TANQUE') ? (fumigo === 'NO' ? 'No fumigado' : `Fumigado (${fumigo})`) : 'No aplica';
            moveData.detalle = `Ingreso: ${tons}t - ${cereal} (${calidad}) | Origen: ${detalleOrigen} | ${txtFum}`; moveData.tons = tons; moveData.cereal = cereal;
            moveData.nuevoEstado = { estado: 'CON_CARGA', cereal, calidad, tonelaje: tons, fumigacion_fecha: (fumigo !== 'NO' && (tipoUnidad === 'SILO' || tipoUnidad === 'TANQUE')) ? fecha : null, fumigacion_tipo: (fumigo !== 'NO' && (tipoUnidad === 'SILO' || tipoUnidad === 'TANQUE')) ? fumigo : null, fecha_primera_carga: d.fecha_primera_carga || fecha, origen: detalleOrigen };
        }
        else if(tipoAccion === 'EGRESO') {
            let motivo = row.querySelector('.m-motivo-baja').value; let tonsBaja = parseFloat(row.querySelector('.m-tons-baja').value) || 0;
            if(tonsBaja <= 0) { errores.push(`Unidad ${silo}: Tonelaje a restar debe ser > 0.`); continue; }
            if(tonsBaja > (parseFloat(d.tonelaje) || 0)) { errores.push(`Unidad ${silo}: Resta (${tonsBaja}t) supera stock actual (${d.tonelaje}t).`); continue; }
            let nuevoTonelaje = (parseFloat(d.tonelaje) || 0) - tonsBaja;
            if(nuevoTonelaje <= 0) warningMsg += `La unidad ${silo} quedará VACÍA.\n`;
            else if(tonsBaja >= d.tonelaje * 0.5) warningMsg += `La unidad ${silo} perderá más del 50% de su carga.\n`;
            moveData.detalle = `Egreso: ${tonsBaja}t por ${motivo}`; moveData.tons = tonsBaja; moveData.cereal = d.cereal;
            moveData.nuevoEstado = nuevoTonelaje <= 0 ? { estado: 'VACIO', cereal: '', calidad: '', tonelaje: 0, fecha_primera_carga: null, fumigacion_fecha: null, fumigacion_tipo: null, alerta_manual: false, relleno_manual: null, origen: null } : { tonelaje: nuevoTonelaje };
        }
        else if(tipoAccion === 'RECIRCULACION') {
            if(d.estado === 'VACIO') { errores.push(`Unidad ${silo}: No se puede recircular vacía.`); continue; }
            let motivo = row.querySelector('.m-motivo-recir').value; let fumigo = row.querySelector('.m-fumigo-recir') ? row.querySelector('.m-fumigo-recir').value : 'NO';
            let txtFum = (tipoUnidad === 'SILO' || tipoUnidad === 'TANQUE') ? (fumigo === 'NO' ? 'No fumigado' : `Fumigado (${fumigo})`) : 'No aplica';
            moveData.detalle = `Recirculación: ${motivo} | ${txtFum}`; moveData.tons = 0; moveData.cereal = d.cereal;
            moveData.nuevoEstado = (fumigo !== 'NO' && (tipoUnidad === 'SILO' || tipoUnidad === 'TANQUE')) ? { fumigacion_fecha: fecha, fumigacion_tipo: fumigo } : {};
        }
        else if(tipoAccion === 'ESTADO') {
            let nuevoEstado = row.querySelector('.m-nuevo-estado').value;
            if(nuevoEstado === 'FUERA_SERVICIO' && (parseFloat(d.tonelaje) > 0 || d.estado === 'CON_CARGA')) { errores.push(`Unidad ${silo}: No se puede poner Fuera de Servicio porque tiene mercadería (${d.tonelaje}t). Debe vaciarla primero.`); continue; }
            if(nuevoEstado === 'VACIO' && d.tonelaje > 0) warningMsg += `La unidad ${silo} TIENE CARGA y se borrará al pasarla a VACÍO.\n`;
            moveData.detalle = `Cambio estado a: ${nuevoEstado.replace('_',' ')}`; moveData.tons = 0; moveData.cereal = d.cereal;
            moveData.nuevoEstado = nuevoEstado === 'VACIO' ? { estado: 'VACIO', cereal: '', calidad: '', tonelaje: 0, fecha_primera_carga: null, fumigacion_fecha: null, fumigacion_tipo: null, alerta_manual: false, relleno_manual: null, origen: null } : { estado: nuevoEstado };
        }
        silosEnLote.add(silo); pendingMoves.push(moveData);
    }

    if (errores.length > 0) { showToast(errores[0] + (errores.length > 1 ? ` (y ${errores.length-1} más)` : ""), "error"); console.error("Errores:", errores); return; }
    if (pendingMoves.length === 0) { showToast("No hay datos nuevos para guardar.", "info"); return; }
    if (warningMsg) { showConfirm("⚠️ Advertencia", warningMsg + "\n¿Estás seguro de continuar?", (ok) => { if(ok) ejecutarMovimientos(pendingMoves); }); }
    else { ejecutarMovimientos(pendingMoves); }
}

function ejecutarMovimientos(moves) {
    let btn = document.getElementById('btn-guardar-todos'); btn.disabled = true; btn.innerHTML = "⏳ Guardando...";
    setTimeout(() => {
        backupDB = JSON.parse(JSON.stringify(db)); silosModificadosReciente = [];
        moves.forEach(m => { let d = m.d; d.historial.push({ fecha: m.fecha, tipo: m.tipo, obs: m.obs, detalle: m.detalle, tons: m.tons, cereal: m.cereal }); Object.assign(d, m.nuevoEstado); d.lastUpdate = Date.now(); silosModificadosReciente.push(m.silo); });
        guardarDB(); limpiarBorrador(); document.getElementById('lista-movimientos').innerHTML = ''; agregarFilaMovimiento(); dibujarTablero(); dibujarTanques(); actualizarExistencias();
        if (document.getElementById('existencias').classList.contains('active')) calcularStock();
        if (document.getElementById('rellenos').classList.contains('active')) calcularRellenos();
        showToast(`✅ Se guardaron ${moves.length} acciones.`, "success"); document.getElementById('btn-desahacer').style.display = 'block';
        btn.disabled = false; btn.innerHTML = "✅ GUARDAR TODOS";
    }, 100);
}

function deshacerUltimoCambio() {
    if(!backupDB) return;
    showConfirm("↩️ Deshacer", "Se restaurará el estado anterior de las unidades. ¿Continuar?", (ok) => {
        if(!ok) return;
        db = backupDB; guardarDB(); document.getElementById('btn-desahacer').style.display = 'none'; document.getElementById('lista-movimientos').innerHTML = ''; agregarFilaMovimiento(); dibujarTablero(); dibujarTanques(); actualizarExistencias(); showToast("Cambios revertidos.", "success");
    });
}

// ... (El resto de las funciones son idénticas al archivo anterior, las copio y pego aquí adentro)
// NOTA: Para no hacer el mensaje infinito, asumí que ya pegaste el resto de las funciones (dibujarTablero, dibujarTanques, etc.) aquí abajo.
// Si te falta alguna, avisame y te la paso de nuevo.
