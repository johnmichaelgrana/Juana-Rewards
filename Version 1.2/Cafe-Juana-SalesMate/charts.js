/*
 * Cafe Juana SalesMate — interchangeable, code-driven charts (vanilla SVG).
 * All values below are SAMPLE/ILLUSTRATIVE, not synced to Loyverse.
 *
 * Edit a chart's labels, values, and breakdowns here to change its data.
 * The chart-type dropdowns let admins swap Bar / Line / Area and Donut / Pie / Bars.
 * For live data, call CafeJuanaCharts.setData(chartId, period, payload).
 * No image-based graphs, third-party chart libraries, or network dependencies.
 */
(() => {
  'use strict';
  const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct'];
  const days = ['Oct 6','Oct 12','Oct 18','Oct 24','Oct 30','Nov 5'];
  const year = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const colors = ['#0b5633','#a7bc9b','#d7b47d','#7c9d88','#b2926e'];
  const sampleData = {
    'dashboard-activity': {
      kind:'temporal', defaultType:'mixed',
      '7m':{labels:months,series:[{label:'Purchases',values:[460,560,670,780,890,1010,1220],color:'#a7bba4'},{label:'Customers',values:[880,1030,1140,1290,1400,1570,1790],color:'#155d40'}]},
      '30d':{labels:days,series:[{label:'Purchases',values:[160,215,245,229,300,340],color:'#a7bba4'},{label:'Customers',values:[230,270,310,285,355,390],color:'#155d40'}]},
      '12m':{labels:['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],series:[{label:'Purchases',values:[240,300,335,380,440,500,610,690,810,920,1090,1220],color:'#a7bba4'},{label:'Customers',values:[420,470,525,560,630,730,850,970,1130,1380,1540,1790],color:'#155d40'}]}
    },
    'dashboard-rewards': {
      kind:'mix', defaultType:'donut',
      '7m':{total:412,unit:'claims',labels:['Free Beverage','Free Food Item','Discount Voucher','Special Reward','Other'],values:[38,27,18,12,5]},
      '30d':{total:73,unit:'claims',labels:['Free Beverage','Free Food Item','Discount Voucher','Special Reward','Other'],values:[39,25,19,12,5]},
      year:{total:538,unit:'claims',labels:['Free Beverage','Free Food Item','Discount Voucher','Special Reward','Other'],values:[36,28,18,13,5]}
    },
    'customer-growth': {
      kind:'temporal',defaultType:'line',
      '7m':{labels:months,series:[{label:'New members',values:[55,68,65,81,79,90,97]}]},
      '30d':{labels:days,series:[{label:'New members',values:[10,12,14,11,15,16]}]},
      year:{labels:year,series:[{label:'New members',values:[37,42,45,55,68,65,81,79,90,97,84,94]}]}
    },
    'customer-mix': {
      kind:'mix',defaultType:'donut',
      '7m':{labels:['Active','Occasional','New'],values:[60,26,14]},
      '30d':{labels:['Active','Occasional','New'],values:[56,29,15]},
      year:{labels:['Active','Occasional','New'],values:[62,24,14]}
    },
    'stamp-trend': {
      kind:'temporal',defaultType:'bar',
      '7m':{labels:months,series:[{label:'Stamps',values:[80,92,74,122,116,134,160]}]},
      '30d':{labels:days,series:[{label:'Stamps',values:[18,22,20,26,25,31]}]},
      year:{labels:year,series:[{label:'Stamps',values:[50,58,63,80,92,74,122,116,134,160,148,172]}]}
    },
    'stamp-mix': {
      kind:'mix',defaultType:'donut',
      '7m':{labels:['Credited','Not qualifying','Sync issue'],values:[87,9,4]},
      '30d':{labels:['Credited','Not qualifying','Sync issue'],values:[89,8,3]},
      year:{labels:['Credited','Not qualifying','Sync issue'],values:[86,10,4]}
    },
    'redemption-trend': {
      kind:'temporal',defaultType:'bar',
      '7m':{labels:months,series:[{label:'Reward claims',values:[33,45,51,58,64,71,82]}]},
      '30d':{labels:days,series:[{label:'Reward claims',values:[9,12,14,13,19,21]}]},
      year:{labels:year,series:[{label:'Reward claims',values:[22,26,29,33,45,51,58,64,71,82,76,90]}]}
    },
    'redemption-mix': {
      kind:'mix',defaultType:'donut',
      '7m':{labels:['Completed','Pending','Other'],values:[93,4,3]},
      '30d':{labels:['Completed','Pending','Other'],values:[92,5,3]},
      year:{labels:['Completed','Pending','Other'],values:[94,4,2]}
    },
    'ratings-distribution': {
      kind:'ratings',defaultType:'bar',
      '7m':{labels:['1 ★','2 ★','3 ★','4 ★','5 ★'],series:[{label:'Reviews',values:[8,12,21,64,151]}]},
      '30d':{labels:['1 ★','2 ★','3 ★','4 ★','5 ★'],series:[{label:'Reviews',values:[2,4,6,17,39]}]},
      year:{labels:['1 ★','2 ★','3 ★','4 ★','5 ★'],series:[{label:'Reviews',values:[14,20,39,128,301]}]}
    },
    'ratings-mix': {
      kind:'mix',defaultType:'donut',
      '7m':{labels:['Service','Coffee & food','Ambience'],values:[42,38,20]},
      '30d':{labels:['Service','Coffee & food','Ambience'],values:[39,40,21]},
      year:{labels:['Service','Coffee & food','Ambience'],values:[43,36,21]}
    }
  };
  const SVG_NS='http://www.w3.org/2000/svg';
  const fmt = n => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
  function add(parent,tag,attrs={},content){
    const el=document.createElementNS(SVG_NS,tag);
    Object.keys(attrs).forEach(k=>el.setAttribute(k,String(attrs[k])));
    if(content!==undefined)el.textContent=String(content);
    parent.appendChild(el);
    return el;
  }
  function described(shape, description){
    shape.setAttribute('tabindex','0');
    shape.setAttribute('role','img');
    shape.setAttribute('aria-label',description);
    add(shape,'title',{},description);
  }
  function currentPeriod(id){
    const select=document.querySelector(`[data-chart-period="${id}"]`);
    if(select)return select.value;
    return document.querySelector('[data-report-period]')?.value || '7m';
  }
  function currentType(id){return document.querySelector(`[data-chart-type="${id}"]`)?.value||sampleData[id]?.defaultType||'bar';}
  function currentData(id){const m=sampleData[id],p=currentPeriod(id);return m?.[p]||m?.['7m'];}
  function maxAxis(values){
    const raw=Math.max(1,...values);
    const power=Math.pow(10,Math.floor(Math.log10(raw)));
    const normalized=raw/power;
    const nice=normalized<=2?2:normalized<=5?5:10;
    const step=nice*power/5;
    return Math.max(step*5,Math.ceil(raw/step)*step);
  }
  function getVisible(id,series){
    if(id!=='dashboard-activity')return series;
    return series.filter(s=>document.querySelector(`[data-chart-series="${s.label.toLowerCase()}"]`)?.getAttribute('aria-pressed')!=='false');
  }
  function renderTemporal(target,id,model,dataset,type){
    const dashboard = id==='dashboard-activity';
    const rating = model.kind==='ratings';
    const W=660,H=dashboard?155:184;
    const svg=add(target,'svg',{viewBox:`0 0 ${W} ${H}`,preserveAspectRatio:'xMidYMid meet',role:'img','aria-label':`${id.replace(/-/g,' ')}: sample values; ${type} chart`});
    const labels=dataset.labels||[];
    const all=dataset.series||[];
    const series=getVisible(id,all);
    if(!labels.length||!series.length){add(svg,'text',{x:W/2,y:H/2,'text-anchor':'middle'},'Select a series to show');return;}
    if(rating&&type==='bar'){
      const entries=dataset.series[0].values;
      const max=Math.max(1,...entries);
      labels.forEach((label,i)=>{
        const y=15+i*32, x=66, width=(W-134)*entries[i]/max;
        add(svg,'text',{x:48,y:y+11,'text-anchor':'end'},label);
        add(svg,'rect',{x,y,width:W-134,height:15,rx:7.5,fill:'#e4ece0'});
        const bar=add(svg,'rect',{x,y,width:Math.max(3,width),height:15,rx:7.5,fill:i===labels.length-1?'#0b5633':'#a7bc9b'});
        described(bar,`${label}: ${fmt(entries[i])} reviews`);
        add(svg,'text',{x:W-49,y:y+11,'text-anchor':'start'},fmt(entries[i]));
      });
      return;
    }
    const plot={left:54,right:W-16,top:10,bottom:H-31};
    const w=plot.right-plot.left,h=plot.bottom-plot.top,n=labels.length,cell=w/n;
    const values=series.flatMap(s=>s.values);
    const ymax=maxAxis(values);
    const x=i=>plot.left+(i+.5)*cell;
    const y=v=>plot.bottom-(v/ymax)*h;
    for(let t=0;t<=4;t++){
      const value=ymax*t/4,cy=y(value);
      add(svg,'line',{class:'chart-grid-line',x1:plot.left,y1:cy,x2:plot.right,y2:cy});
      add(svg,'text',{x:plot.left-9,y:cy+4,'text-anchor':'end'},fmt(value));
    }
    labels.forEach((lab,i)=>add(svg,'text',{x:x(i),y:H-10,'text-anchor':'middle'},lab));
    const drawBar=(s,index,seriesCount)=>s.values.forEach((v,i)=>{
      const groupWidth=Math.min(cell*.76,40),bw=groupWidth/seriesCount;
      const bx=x(i)-groupWidth/2+bw*index,by=y(v);
      const shape=add(svg,'rect',{x:bx,y:by,width:Math.max(2,bw-2),height:Math.max(0,plot.bottom-by),rx:2,fill:s.color||'#0b5633',opacity:seriesCount>1?0.95:1});
      described(shape,`${labels[i]} · ${s.label}: ${fmt(v)} (sample)`);
    });
    const drawLine=(s,makeArea)=>{
      const color=s.color||'#0b5633';
      const pts=s.values.map((v,i)=>[x(i),y(v)]);
      if(makeArea){
        const points=`${pts[0][0]},${plot.bottom} ${pts.map(p=>p.join(',')).join(' ')} ${pts[pts.length-1][0]},${plot.bottom}`;
        add(svg,'polygon',{points,fill:color,'fill-opacity':series.length>1?.12:.22});
      }
      add(svg,'polyline',{points:pts.map(p=>p.join(',')).join(' '),stroke:color,'stroke-width':2.5,'stroke-linejoin':'round','stroke-linecap':'round',fill:'none'});
      pts.forEach(([cx,cy],i)=>{
        const p=add(svg,'circle',{cx,cy,r:4,fill:color,stroke:'#f9f8f1','stroke-width':1.4});
        described(p,`${labels[i]} · ${s.label}: ${fmt(s.values[i])} (sample)`);
      });
    };
    if(type==='mixed'){
      const bars=series.filter(s=>s.label.toLowerCase()==='purchases');
      bars.forEach((s,i)=>drawBar(s,i,bars.length));
      series.filter(s=>s.label.toLowerCase()!=='purchases').forEach(s=>drawLine(s,false));
    }else if(type==='bar')series.forEach((s,i)=>drawBar(s,i,series.length));
    else series.forEach(s=>drawLine(s,type==='area'));
    if(dashboard){
      const tooltip=document.getElementById('activity-tooltip');
      const chart=document.getElementById('activity-chart');
      if(tooltip&&chart)labels.forEach((label,i)=>{
        const hit=add(svg,'rect',{x:x(i)-cell/2,y:plot.top,width:cell,height:plot.bottom-plot.top+14,fill:'transparent',tabindex:0,role:'button','aria-label':`${label}: ${all.map(s=>`${s.label} ${fmt(s.values[i])}`).join('; ')}`});
        const show=()=>{
          tooltip.replaceChildren();
          const bold=document.createElement('strong');bold.textContent=label;tooltip.append(bold);
          all.forEach(s=>{const el=document.createElement('div');el.textContent=`${s.label}: ${fmt(s.values[i])}`;tooltip.append(el)});
          tooltip.hidden=false;
          tooltip.style.left=`${Math.max(70,Math.min(chart.clientWidth-70,x(i)/W*chart.clientWidth))}px`;
        };
        hit.addEventListener('mouseenter',show);hit.addEventListener('focus',show);
        hit.addEventListener('click',show);hit.addEventListener('mouseleave',()=>tooltip.hidden=true);hit.addEventListener('blur',()=>tooltip.hidden=true);
      });
    }
  }
  function polar(cx,cy,r,deg){const radians=(deg-90)*Math.PI/180;return [cx+r*Math.cos(radians),cy+r*Math.sin(radians)];}
  function wedge(cx,cy,r,start,end,inner){
    const a=polar(cx,cy,r,start),b=polar(cx,cy,r,end),large=end-start>180?1:0;
    if(!inner)return `M ${cx} ${cy} L ${a[0]} ${a[1]} A ${r} ${r} 0 ${large} 1 ${b[0]} ${b[1]} Z`;
    const c=polar(cx,cy,inner,end),d=polar(cx,cy,inner,start);
    return `M ${a[0]} ${a[1]} A ${r} ${r} 0 ${large} 1 ${b[0]} ${b[1]} L ${c[0]} ${c[1]} A ${inner} ${inner} 0 ${large} 0 ${d[0]} ${d[1]} Z`;
  }
  function renderMix(target,id,dataset,type){
    const values=dataset.values||[], labels=dataset.labels||[];
    const total=values.reduce((a,b)=>a+b,0)||1;
    const percentages=values.map(v=>v/total*100);
    target.classList.toggle('is-bars',type==='bars');
    const svg=add(target,'svg',{viewBox:type==='bars'?'0 0 210 155':'0 0 160 160',role:'img','aria-label':`${labels.map((lab,i)=>`${lab} ${percentages[i].toFixed(1)} percent`).join(', ')} (sample)`});
    if(type==='bars'){
      values.forEach((value,i)=>{
        const y=11+i*(Math.min(27,142/values.length)),percent=percentages[i];
        add(svg,'text',{x:2,y:y+8,fill:'#4f6d59','font-size':10},labels[i].length>17?labels[i].slice(0,16)+'…':labels[i]);
        add(svg,'rect',{x:2,y:y+12,width:170,height:7,rx:3.5,fill:'#e4ecde'});
        const bar=add(svg,'rect',{x:2,y:y+12,width:170*percent/100,height:7,rx:3.5,fill:colors[i%colors.length]});
        described(bar,`${labels[i]}: ${Math.round(percent)}%`);
        add(svg,'text',{x:207,y:y+19,'text-anchor':'end',fill:'#42634d','font-size':10},`${Math.round(percent)}%`);
      });
    }else{
      const r=75,inner=type==='donut'?47:0;
      let start=0;
      percentages.forEach((percent,i)=>{
        if(percent<.01)return;
        const end=start+percent*3.6;
        const path=add(svg,'path',{d:wedge(80,80,r,start,Math.min(end,359.999),inner),fill:colors[i%colors.length],stroke:'#f7f5ec','stroke-width':.9});
        described(path,`${labels[i]}: ${Math.round(percent)}%`);
        start=end;
      });
      if(type==='donut'){
        const top=dataset.total!==undefined?fmt(dataset.total):`${Math.round(percentages[0])}%`;
        add(svg,'text',{x:80,y:78,'text-anchor':'middle',fill:'#0d4f34','font-weight':700,'font-size':dataset.total!==undefined?24:23},top);
        if(dataset.total!==undefined)add(svg,'text',{x:80,y:94,'text-anchor':'middle',fill:'#5f7765','font-size':11},dataset.unit||'total');
      }
    }
    const legend=document.querySelector(`[data-chart-legend="${id}"]`);
    if(legend){
      legend.replaceChildren();
      if(id==='dashboard-rewards'){
        const title=document.createElement('div');title.className='redemption-breakdown-title';title.textContent='REDEMPTION MIX';legend.append(title);
        labels.forEach((lab,i)=>{
          const row=document.createElement('div');row.className='redemption-breakdown-row';
          const swatch=document.createElement('i');swatch.style.setProperty('--tone',colors[i%colors.length]);
          const name=document.createElement('span');name.textContent=lab;
          const pct=document.createElement('b');pct.textContent=`${Math.round(percentages[i])}%`;
          row.append(swatch,name,pct);legend.append(row);
        });
      }else labels.forEach((lab,i)=>{
        const row=document.createElement('div'),box=document.createElement('span');
        const swatch=document.createElement('i');swatch.className=`legend-dot legend-${i}`;swatch.style.background=colors[i%colors.length];
        box.append(swatch,document.createTextNode(lab));
        const value=document.createElement('b');value.textContent=`${Math.round(percentages[i])}%`;
        row.append(box,value);legend.append(row);
      });
    }
  }
  function render(id){
    const target=document.querySelector(`[data-cj-chart="${id}"]`);
    const model=sampleData[id],data=currentData(id);
    if(!target||!model||!data)return;
    target.replaceChildren();
    target.setAttribute('aria-label',`${id.replace(/-/g,' ')} — illustrative sample data`);
    const type=currentType(id);
    if(model.kind==='mix')renderMix(target,id,data,type);
    else renderTemporal(target,id,model,data,type);
  }
  const renderAll=()=>document.querySelectorAll('[data-cj-chart]').forEach(el=>render(el.dataset.cjChart));
  document.querySelectorAll('[data-chart-type]').forEach(el=>el.addEventListener('change',()=>render(el.dataset.chartType)));
  document.querySelectorAll('[data-chart-period]').forEach(el=>el.addEventListener('change',()=>render(el.dataset.chartPeriod)));
  document.querySelectorAll('[data-report-period]').forEach(el=>el.addEventListener('change',renderAll));
  document.querySelectorAll('[data-chart-series]').forEach(el=>el.addEventListener('click',()=>{
    el.setAttribute('aria-pressed',String(el.getAttribute('aria-pressed')!=='true'));
    render('dashboard-activity');
  }));
  document.addEventListener('click',event=>{
    if(!event.target.closest('.activity-chart')){
      const tooltip=document.getElementById('activity-tooltip');if(tooltip)tooltip.hidden=true;
    }
  });
  window.CafeJuanaCharts={
    datasets:sampleData,
    render,renderAll,
    setData(id,period,data){
      if(!sampleData[id])throw new Error(`Unknown chart: ${id}`);
      if(!data||!Array.isArray(data.labels||data.values))throw new TypeError('Chart data needs labels or values arrays');
      sampleData[id][period]=data;
      render(id);
    },
    setType(id,type){
      const select=document.querySelector(`[data-chart-type="${id}"]`);
      if(!select)throw new Error(`No chart selector for ${id}`);
      if(!Array.from(select.options).some(o=>o.value===type))throw new Error(`Unsupported chart type: ${type}`);
      select.value=type;render(id);
    }
  };
  renderAll();
})();
