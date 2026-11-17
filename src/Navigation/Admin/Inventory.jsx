import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, Factory, Package, Plus, RefreshCw, Save, X } from 'lucide-react';
import { customerApi } from '../../services/customerApi';
import './Inventory.css';

const emptyMaterial = { name: '', category: 'madera', unit: 'unidad', stockQuantity: '0', minimumQuantity: '0', notes: '' };
const categories = [['madera','Madera'],['cuero','Cuero'],['metales','Metales'],['virola','Virola'],['insumos','Insumos'],['otros','Otros']];
const units = ['unidad','g','kg','ml','l','cm','m','mm','par','hoja'];

export default function AdminInventory() {
  const [data, setData] = useState({ materials: [], products: [], movements: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('materials');
  const [showMaterial, setShowMaterial] = useState(false);
  const [material, setMaterial] = useState(emptyMaterial);
  const [movement, setMovement] = useState({ entityType: 'material', entityId: '', movementType: 'entry', quantity: '', note: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await customerApi('admin/inventory')); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const lowStock = useMemo(() => data.materials.filter(x => x.active && x.stock_quantity <= x.minimum_quantity), [data.materials]);
  const availableProducts = useMemo(() => data.products.filter(x => x.available > 0), [data.products]);

  async function createMaterial(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await customerApi('admin/inventory/materials', { method: 'POST', body: JSON.stringify({ ...material, stockQuantity: Number(material.stockQuantity), minimumQuantity: Number(material.minimumQuantity) }) });
      setMaterial(emptyMaterial); setShowMaterial(false); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function saveMovement(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await customerApi('admin/inventory/movements', { method: 'POST', body: JSON.stringify({ ...movement, quantity: Number(movement.quantity) }) });
      setMovement(v => ({ ...v, quantity: '', note: '' })); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  const movementOptions = movement.entityType === 'material'
    ? [['entry','Entrada'],['consumption','Consumo'],['adjustment','Ajuste de stock']]
    : [['entry','Ingreso'],['production','Producción'],['dispatch','Salida'],['adjustment','Ajuste de stock']];

  return <section className="inventory-page">
    <header className="inventory-heading">
      <div><span className="inventory-eyebrow">GESTIÓN INTERNA</span><h1>Inventario</h1><p>Controlá materiales, productos terminados y movimientos de stock.</p></div>
      <button className="inventory-primary" onClick={() => setShowMaterial(true)}><Plus size={17}/> Nuevo material</button>
    </header>
    {error && <div className="inventory-alert"><AlertTriangle size={17}/>{error}</div>}
    <div className="inventory-stats">
      <article><span>Materias primas</span><strong>{data.materials.filter(x=>x.active).length}</strong><small>Materiales activos</small></article>
      <article><span>Productos terminados</span><strong>{data.products.length}</strong><small>Productos del catálogo</small></article>
      <article className={lowStock.length ? 'is-warning' : ''}><span>Stock bajo</span><strong>{lowStock.length}</strong><small>En el mínimo o por debajo</small></article>
      <article><span>Movimientos</span><strong>{data.movements.length}</strong><small>Últimos registros</small></article>
    </div>
    <nav className="inventory-tabs">
      <button className={tab==='materials'?'active':''} onClick={()=>setTab('materials')}>Materias primas</button>
      <button className={tab==='products'?'active':''} onClick={()=>setTab('products')}>Productos terminados</button>
      <button className={tab==='movements'?'active':''} onClick={()=>setTab('movements')}>Movimientos</button>
    </nav>
    {loading ? <div className="inventory-empty"><RefreshCw className="inventory-spin"/> Cargando inventario…</div> : <>
      {tab==='materials' && <div className="inventory-table-wrap"><table className="inventory-table"><thead><tr><th>Material</th><th>Categoría</th><th>Existencia</th><th>Stock mínimo</th><th>Estado</th></tr></thead><tbody>
        {data.materials.filter(x=>x.active).map(x=><tr key={x.id}><td><strong>{x.name}</strong>{x.notes&&<small>{x.notes}</small>}</td><td>{categories.find(c=>c[0]===x.category)?.[1]||x.category}</td><td>{x.stock_quantity} {x.unit}</td><td>{x.minimum_quantity} {x.unit}</td><td><span className={x.stock_quantity<=x.minimum_quantity?'inventory-status low':'inventory-status ok'}>{x.stock_quantity<=x.minimum_quantity?'Stock bajo':'Disponible'}</span></td></tr>)}
        {!data.materials.some(x=>x.active)&&<tr><td colSpan="5" className="inventory-no-data">Todavía no cargaste materias primas.</td></tr>}
      </tbody></table></div>}
      {tab==='products' && <div className="inventory-table-wrap"><table className="inventory-table"><thead><tr><th>Producto</th><th>En existencia</th><th>Reservado</th><th>Disponible</th></tr></thead><tbody>
        {data.products.map(x=><tr key={x.id}><td><strong>{x.name||x.title||'Producto sin nombre'}</strong></td><td>{x.onHand}</td><td>{x.reserved}</td><td><strong>{x.available}</strong></td></tr>)}
        {!data.products.length&&<tr><td colSpan="4" className="inventory-no-data">No hay productos activos en el catálogo.</td></tr>}
      </tbody></table></div>}
      {tab==='movements' && <div className="inventory-movement-layout">
        <form className="inventory-form-card" onSubmit={saveMovement}><h2>Registrar movimiento</h2>
          <label>Tipo de inventario<select value={movement.entityType} onChange={e=>setMovement(v=>({...v,entityType:e.target.value,entityId:'',movementType:e.target.value==='material'?'entry':'entry'}))}><option value="material">Materia prima</option><option value="finished_product">Producto terminado</option></select></label>
          <label>Elemento<select required value={movement.entityId} onChange={e=>setMovement(v=>({...v,entityId:e.target.value}))}><option value="">Seleccionar…</option>{(movement.entityType==='material'?data.materials.filter(x=>x.active):data.products).map(x=><option key={x.id} value={x.id}>{x.name||x.title||x.id}</option>)}</select></label>
          <label>Movimiento<select value={movement.movementType} onChange={e=>setMovement(v=>({...v,movementType:e.target.value}))}>{movementOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
          <label>Cantidad<input required type="number" min="0.001" step="any" value={movement.quantity} onChange={e=>setMovement(v=>({...v,quantity:e.target.value}))}/></label>
          <label>Nota (opcional)<textarea rows="2" value={movement.note} onChange={e=>setMovement(v=>({...v,note:e.target.value}))} placeholder="Motivo o referencia del movimiento"/></label>
          <button className="inventory-primary" disabled={saving}><Save size={16}/> Guardar movimiento</button>
        </form>
        <div className="inventory-recent"><h2>Últimos movimientos</h2>{data.movements.slice(0,12).map(x=><article key={x.id}><span className="inventory-movement-icon">{['entry','initial','production'].includes(x.movement_type)?<ArrowDownToLine size={16}/>:<ArrowUpFromLine size={16}/>}</span><div><strong>{x.note||x.movement_type}</strong><small>{x.entity_type==='material'?'Materia prima':'Producto terminado'} · {new Date(x.created_at).toLocaleString('es-AR')}</small></div><b>{x.movement_type==='entry'||x.movement_type==='production'?'+':'−'}{x.quantity}</b></article>)}{!data.movements.length&&<p className="inventory-no-data">Aún no hay movimientos registrados.</p>}</div>
      </div>}
    </>}
    {showMaterial && <div className="inventory-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowMaterial(false)}}><form className="inventory-modal" onSubmit={createMaterial}>
      <header><div><span className="inventory-eyebrow">NUEVO REGISTRO</span><h2>Agregar materia prima</h2></div><button type="button" className="inventory-close" onClick={()=>setShowMaterial(false)} aria-label="Cerrar"><X/></button></header>
      <label>Nombre<input required maxLength="120" value={material.name} onChange={e=>setMaterial(v=>({...v,name:e.target.value}))} placeholder="Ej. Cuero vacuno"/></label>
      <div className="inventory-form-grid"><label>Categoría<select value={material.category} onChange={e=>setMaterial(v=>({...v,category:e.target.value}))}>{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>Unidad<select value={material.unit} onChange={e=>setMaterial(v=>({...v,unit:e.target.value}))}>{units.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <div className="inventory-form-grid"><label>Stock inicial<input type="number" min="0" step="any" value={material.stockQuantity} onChange={e=>setMaterial(v=>({...v,stockQuantity:e.target.value}))}/></label><label>Stock mínimo<input type="number" min="0" step="any" value={material.minimumQuantity} onChange={e=>setMaterial(v=>({...v,minimumQuantity:e.target.value}))}/></label></div>
      <label>Notas<textarea rows="2" value={material.notes} onChange={e=>setMaterial(v=>({...v,notes:e.target.value}))}/></label>
      <footer><button type="button" className="inventory-secondary" onClick={()=>setShowMaterial(false)}>Cancelar</button><button className="inventory-primary" disabled={saving}><Save size={16}/> Guardar material</button></footer>
    </form></div>}
  </section>;
}
