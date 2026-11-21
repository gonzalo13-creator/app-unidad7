const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let dbSilos = {};
let dbCereales = {};
let usuarioActual = null;
let rolActual = 'LECTOR';

// TABLAS COMPLETAS DE INTERPOLACIÓN
const TABLA_SILOS = [[0,1221],[0.5,1204],[1,1187],[1.5,1170],[2,1153],[2.5,1136],[3,1119],[3.5,1102],[4,1085],[4.5,1068],[5,1051],[5.5,1034],[6,1017],[6.5,1000],[7,983],[7.5,966],[8,949],[8.5,932],[9,915],[9.5,898],[10,881],[10.5,864],[11,847],[11.5,830],[12,813],[12.5,796],[13,779],[13.5,762],[14,745],[14.5,728],[15,711],[15.5,694],[16,677],[16.5,660],[17,643],[17.5,626],[18,609],[18.5,592],[19,575],[19.5,558],[20,541],[20.5,524],[21,507],[21.5,490],[22,473],[22.5,456],[23,439],[23.5,422],[24,405],[24.5,388],[25,371],[25.5,354],[26,337],[26.5,320],[27,303],[27.5,286],[28,269],[28.5,252],[29,235],[29.5,218],[30,201],[30.5,184],[31,167],[31.5,150],[32,133],[32.5,116],[33,99],[33.5,82],[34,65],[34.5,48],[35,31],[35.5,23],[36,13],[36.5,8],[37,3.4],[37.5,1]];
const TABLA_ENTRESILOS = [[0,311.5],[0.5,307.25],[1,303],[1.5,298.75],[2,294.5],[2.5,290.25],[3,286],[3.5,281.75],[4,277.5],[4.5,273.25],[5,269],[5.5,264.75],[6,260.5],[6.5,256.25],[7,252],[7.5,247.75],[8,243.5],[8.5,239.25],[9,235],[9.5,230.75],[10,226.5],[10.5,222.25],[11,218],[11.5,213.75],[12,209.5],[12.5,205.25],[13,201],[13.5,196.75],[14,192.5],[14.5,188.25],[15,184],[15.5,179.75],[16,175.5],[16.5,171.25],[17,167],[17.5,162.75],[18,158.5],[18.5,154.25],[19,150],[19.5,145.75],[20,141.5],[20.5,137.25],[21,133],[21.5,128.75],[22,124.5],[22.5,120.25],[23,116],[23.5,111.75],[24,107.5],[24.5,103.25],[25,99],[25.5,94.75],[26,90.5],[26.5,86.25],[27,82],[27.5,77.75],[28,73.5],[28.5,69.25],[29,65],[29.5,60.75],[30,56.5],[30.5,52.25],[31,48],[31.5,43.75],[32,39.5],[32.5,35.25],[33,31],[33.5,26.75],[34,22.5],[34.5,18.25],[35,14],[35.5,9.75],[36,6.5],[36.5,3.75],[37,1.25],[37.5,0.6]];

const SILOS_MANUALES = [701, 703, 704, 706, 707, 709, 710, 712, 713, 715, 716, 718];
const MIN_14 = [702, 705, 708, 711, 714, 717];
const MIN_10 = [502, 505, 508, 511, 514, 517];
const PH_BASE = 80;

// INICIAR SESIÓN
async function iniciarSesion() {
    const username = document.getElementById('login-user').value.toLowerCase().trim();
    const password = document.getElementById('login-pass').value;
    const msg = document.getElementById('login-msg');
    
    if(!username || !password) { msg.innerText = "Complete ambos campos"; return; }

    const email = `${username}@spc.local`;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (error) { msg.innerText = "Usuario o contraseña incorrectos"; } 
    else { usuarioActual = data.user; iniciarApp(); }
}

async function cerrarSesion() { await supabaseClient.auth.signOut(); location.reload(); }

// VERIFICAR SESIÓN AL CARGAR
async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) { usuarioActual = session.user; iniciarApp(); }
}

// INICIAR LA APP
async function iniciarApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';

    // Obtener rol del usuario
    const { data: perfil } = await supabaseClient.from('profiles').select('role, username').eq('id', usuarioActual.id).single();
    if(perfil) {
        rolActual = perfil.role;
        document.getElementById('user-display').innerText = `${perfil.username} (${perfil.role})`;
        if (rolActual === 'ADMIN') document.getElementById('nav-admin').style.display = 'block';
    }

    // Cargar datos
    const { data: cereales } = await supabaseClient.from('cereales').select('*');
    cereales.forEach(c => dbCereales[c.id] = c);

    const { data: silos } = await supabaseClient.from('silos').select('*');
    silos.forEach(s => dbSilos[s.id] = s);

    document.getElementById('edit-cereal').innerHTML = Object.values(dbCereales).map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    
    dibujarTablero();
    dibujarTanques();
    dibujarCanos();
    actualizarStock();
}

// LÓGICA DE CÁLCULO
function interpolar(tabla, metros) {
    if(metros <= tabla[0][0]) return tabla[0][1]; 
    if(metros >= tabla[tabla.length-1][0]) return tabla[tabla.length-1][1]; 
    for(let i=0; i<tabla.length-1; i++) { 
        let a = tabla[i], b = tabla[i+1]; 
        if(metros >= a[0] && metros <= b[0]) return a[1] + (b[1]-a[1]) * ((metros - a[0]) / (b[0] - a[0])); 
    } 
    return 0; 
}

function calcularTonelaje() {
    const id = document.getElementById('edit-id').value;
    const metros = parseFloat(document.getElementById('edit-metros').value) || 0;
    const cerealId = document.getElementById('edit-cereal').value;
    const cereal = dbCereales[cerealId];
    if(!cereal) return;

    const num = parseInt(id);
    // Lógica para saber si es entresilo (termina en 1, 2, 3, o es de la serie 200/400/600)
    let esEntresilo = (num >= 200 && num <= 217) || (num >= 400 && num <= 417) || (num >= 600 && num <= 617);
    let tabla = esEntresilo ? TABLA_ENTRESILOS : TABLA_SILOS;
    
    let capRef = interpolar(tabla, metros);
    let tons = Math.round(capRef * cereal.ph / PH_BASE);

    if (SILOS_MANUALES.includes(num)) {
        document.getElementById('edit-tons-calc').value = tons;
    } else {
        document.getElementById('edit-tons-auto').value = tons;
    }
}

// RENDERIZADO
function dibujarTablero() {
    const grid = document.getElementById('grid-tablero');
    grid.innerHTML = '';
    
    // Todos los IDs de silos (100 al 718)
    let silosKeys = [];
    for(let i=101; i<=118; i++) silosKeys.push(String(i));
    for(let i=201; i<=217; i++) silosKeys.push(String(i));
    for(let i=301; i<=318; i++) silosKeys.push(String(i));
    for(let i=401; i<=417; i++) silosKeys.push(String(i));
    for(let i=501; i<=518; i++) silosKeys.push(String(i));
    for(let i=601; i<=617; i++) silosKeys.push(String(i));
    for(let i=701; i<=718; i++) silosKeys.push(String(i));

    silosKeys.forEach(id => {
        const s = dbSilos[id] || { estado: 'VACIO' };
        const card = document.createElement('div');
        
        let claseBg = 'bg-VACIO';
        if (s.estado !== 'VACIO' && s.cereal) claseBg = `bg-${s.cereal}`;
        card.className = `tarjeta ${claseBg}`;
        card.onclick = () => abrirPanel(id);

        // Calcular relleno
        let libre = 0;
        if (s.estado !== 'VACIO') {
            if (SILOS_MANUALES.includes(Number(id))) {
                libre = s.tonelaje_relleno || 0;
            } else {
                const num = parseInt(id);
                let esEntresilo = (num >= 200 && num <= 217) || (num >= 400 && num <= 417) || (num >= 600 && num <= 617);
                let topeM = esEntresilo ? 4 : 1;
                if (MIN_14.includes(num)) topeM = 14;
                if (MIN_10.includes(num)) topeM = 10;
                
                const cereal = dbCereales[s.cereal] || {ph: 80};
                let tabla = esEntresilo ? TABLA_ENTRESILOS : TABLA_SILOS;
                let maxTons = Math.round(interpolar(tabla, topeM) * cereal.ph / PH_BASE);
                libre = Math.max(0, maxTons - (s.tonelaje_real || 0));
            }
        }

        let alertaHtml = s.alerta ? `<div class="alerta-icon">⚠️</div>` : '';
        let dataHtml = s.estado === 'VACIO' ? '' : `
            <div class="t-data">${s.tonelaje_real} t</div>
            <div class="t-libre">Libre: ${libre} t</div>
        `;

        card.innerHTML = `
            ${alertaHtml}
            <div class="t-num">${id}</div>
            <div class="t-cereal">${s.cereal || 'VACÍO'}</div>
            ${dataHtml}
        `;
        grid.appendChild(card);
    });
}

function dibujarTanques() {
    const grid = document.getElementById('grid-tanques');
    grid.innerHTML = '';
    const tanques = ['CTM', 'IL1', 'IL2', 'IL3', 'IL4', 'ISE1', 'ISE2', 'ISE3', 'ISE4', 'P3', 'R1', 'R2', 'SSE5', 'SL1', 'SL2', 'SL3', 'SL4', 'SSE1', 'SSE2', 'SSE3', 'SSE4', 'P2', 'P4', 'TN2', 'TA3', 'TA1', 'TA4', 'TN4', 'TA2'];
    
    tanques.forEach(id => {
        const s = dbSilos[id] || { estado: 'VACIO' };
        const card = document.createElement('div');
        card.className = `tarjeta ${s.estado !== 'VACIO' && s.cereal ? 'bg-'+s.cereal : 'bg-VACIO'}`;
        card.onclick = () => abrirPanel(id);
        card.innerHTML = `
            <div class="t-num" style="font-size:1rem;">${id}</div>
            <div class="t-cereal">${s.cereal || 'VACÍO'}</div>
            <div class="t-data">${s.estado !== 'VACIO' ? s.tonelaje_real + ' t' : ''}</div>
        `;
        grid.appendChild(card);
    });
}

function dibujarCanos() {
    const grid = document.getElementById('grid-canos');
    grid.innerHTML = '';
    const canos = ['CER', 'CANO-1', 'CANO-2', 'CANO-3', 'CANO-4', 'CANO-5', 'CANO-6'];
    
    canos.forEach(id => {
        const s = dbSilos[id] || { estado: 'VACIO' };
        const card = document.createElement('div');
        card.className = `tarjeta ${s.estado !== 'VACIO' && s.cereal ? 'bg-'+s.cereal : 'bg-VACIO'}`;
        card.onclick = () => abrirPanel(id);
        card.innerHTML = `
            <div class="t-num" style="font-size:1rem;">${id}</div>
            <div class="t-cereal">${s.cereal || 'VACÍO'}</div>
            <div class="t-data">${s.estado !== 'VACIO' ? s.tonelaje_real + ' t' : ''}</div>
        `;
        grid.appendChild(card);
    });
}

function actualizarStock() {
    const container = document.getElementById('stock-container');
    let stock = {};
    Object.keys(dbCereales).forEach(k => stock[k] = 0);

    Object.values(dbSilos).forEach(s => {
        if (s.estado !== 'VACIO' && s.cereal && stock[s.cereal] !== undefined) {
            stock[s.cereal] += Number(s.tonelaje_real) || 0;
        }
    });

    container.innerHTML = Object.values(dbCereales).map(c => `
        <div style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid var(--border); font-size:1.1rem;">
            <span style="font-weight:bold; color:${c.color};">${c.nombre}</span>
            <span style="font-weight:bold;">${stock[c.id].toLocaleString()} t</span>
        </div>
    `).join('');
}

// PANEL LATERAL
function abrirPanel(id) {
    const s = dbSilos[id] || { estado: 'VACIO', fumigacion_tipo: 'NO' };
    document.getElementById('edit-id').value = id;
    document.getElementById('panel-title').innerText = `Editar Unidad ${id}`;
    document.getElementById('edit-estado').value = s.estado;
    document.getElementById('edit-cereal').value = s.cereal || 'MAIZ';
    document.getElementById('edit-calidad').value = s.calidad || '';
    document.getElementById('edit-origen').value = s.origen || 'CAMIONES';
    document.getElementById('edit-fecha-carga').value = s.fecha_carga || '';
    document.getElementById('edit-metros').value = s.metros || '';
    document.getElementById('edit-fumigacion-tipo').value = s.fumigacion_tipo || 'NO';
    document.getElementById('edit-alerta').checked = s.alerta || false;
    document.getElementById('edit-alerta-motivo').value = s.alerta_motivo || '';
    document.getElementById('edit-recir-motivo').value = s.recirculacion_motivo || '';
    document.getElementById('edit-recir-fecha').value = s.recirculacion_fecha || '';

    const num = parseInt(id);
    const esSilo = !isNaN(num);
    const esManual = SILOS_MANUALES.includes(num);
    
    document.getElementById('group-metros').style.display = esSilo ? 'block' : 'none';
    document.getElementById('seccion-700').style.display = esManual ? 'block' : 'none';
    document.getElementById('seccion-auto').style.display = (esSilo && !esManual) ? 'block' : 'none';

    if(esManual) {
        document.getElementById('edit-tons-reales').value = s.tonelaje_real || 0;
        document.getElementById('edit-tons-relleno').value = s.tonelaje_relleno || 0;
        calcularTonelaje();
    } else if(esSilo) {
        calcularTonelaje();
    } else {
        // Para Tanques y Caños, usamos el campo automático como manual
        document.getElementById('edit-tons-auto').value = s.tonelaje_real || 0;
        document.getElementById('edit-tons-auto').readOnly = false; // Permitir edición manual
    }

    if(s.alerta) {
        let panelAlerta = document.getElementById('panel-alerta');
        panelAlerta.style.display = 'block';
        panelAlerta.innerText = "⚠️ Alerta: " + (s.alerta_motivo || 'Revisión necesaria');
    } else {
        document.getElementById('panel-alerta').style.display = 'none';
    }

    toggleCamposCarga();
    toggleAlertaMotivo();
    document.getElementById('slide-panel').classList.add('open');
}

function cerrarPanel() { document.getElementById('slide-panel').classList.remove('open'); }

function toggleCamposCarga() {
    const estado = document.getElementById('edit-estado').value;
    document.getElementById('campos-carga').style.display = (estado === 'VACIO') ? 'none' : 'block';
}

function toggleAlertaMotivo() {
    const checked = document.getElementById('edit-alerta').checked;
    document.getElementById('group-alerta-motivo').style.display = checked ? 'block' : 'none';
}

async function guardarEdicion() {
    const id = document.getElementById('edit-id').value;
    const num = parseInt(id);
    const esManual = SILOS_MANUALES.includes(num);
    const esSilo = !isNaN(num);

    let tonelaje_real = 0;
    let tonelaje_relleno = 0;

    if (esManual) {
        tonelaje_real = parseFloat(document.getElementById('edit-tons-reales').value) || 0;
        tonelaje_relleno = parseFloat(document.getElementById('edit-tons-relleno').value) || 0;
    } else if (esSilo) {
        tonelaje_real = parseFloat(document.getElementById('edit-tons-auto').value) || 0;
    } else {
        tonelaje_real = parseFloat(document.getElementById('edit-tons-auto').value) || 0;
    }

    const datos = {
        estado: document.getElementById('edit-estado').value,
        cereal: document.getElementById('edit-cereal').value,
        calidad: document.getElementById('edit-calidad').value.toUpperCase(),
        origen: document.getElementById('edit-origen').value,
        fecha_carga: document.getElementById('edit-fecha-carga').value || null,
        metros: parseFloat(document.getElementById('edit-metros').value) || 0,
        tonelaje_real: tonelaje_real,
        tonelaje_relleno: tonelaje_relleno,
        fumigacion_tipo: document.getElementById('edit-fumigacion-tipo').value,
        alerta: document.getElementById('edit-alerta').checked,
        alerta_motivo: document.getElementById('edit-alerta-motivo').value,
        recirculacion_motivo: document.getElementById('edit-recir-motivo').value || null,
        recirculacion_fecha: document.getElementById('edit-recir-fecha').value || null,
        last_update: Date.now()
    };

    if (datos.estado === 'VACIO') {
        datos.cereal = null;
        datos.tonelaje_real = 0;
        datos.tonelaje_relleno = 0;
        datos.alerta = false;
    }

    const { error } = await supabaseClient.from('silos').upsert({ id: id, ...datos });

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        dbSilos[id] = { id: id, ...datos };
        dibujarTablero(); dibujarTanques(); dibujarCanos(); actualizarStock();
        cerrarPanel();
    }
}

// ADMINISTRACIÓN
async function crearUsuario() {
    const username = document.getElementById('new-user-name').value.toLowerCase().trim();
    const password = document.getElementById('new-user-pass').value;
    const role = document.getElementById('new-user-role').value;
    const msg = document.getElementById('admin-msg');

    if(!username || !password) { msg.innerText = "Complete todos los campos"; return; }
    msg.innerText = "Creando usuario...";

    // Llamada a la Edge Function
    const { data, error } = await supabaseClient.functions.invoke('crear-usuario', {
        body: { username, password, role }
    });

    if (error) {
        msg.innerText = "Error: " + error.message;
    } else {
        msg.innerText = `✅ Usuario '${username}' creado con éxito.`;
        document.getElementById('new-user-name').value = '';
    }
}

// UTILIDADES
function cambiarTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

// INICIO
window.onload = checkSession;
