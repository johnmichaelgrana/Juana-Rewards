/* Cafe Juana — data-driven dashboard visualization.
 * Demo records are maintained as regular JavaScript arrays below. Replace the
 * sample datasets with your API/Loyverse aggregation when backend is connected.
 */
(() => {
  'use strict';
  const svg = document.getElementById('activity-svg');
  const range = document.getElementById('activity-period');
  const chart = document.getElementById('activity-chart');
  const tooltip = document.getElementById('activity-tooltip');
  if (!svg || !range || !chart || !tooltip) return;

  // All figures are illustrative until connected to a real customer database/POS.
  const activityData = {
    '7m': {
      labels:['Apr','May','Jun','Jul','Aug','Sep','Oct'],
      customers:[880,1030,1140,1290,1400,1570,1790],
      purchases:[460,560,670,780,890,1010,1220]
    },
    '30d': {
      labels:['Oct 6','Oct 12','Oct 18','Oct 24','Oct 30','Nov 5'],
      customers:[230,270,310,285,355,390],
      purchases:[160,215,245,229,300,340]
    },
    '12m': {
      labels:['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],
      customers:[420,470,525,560,630,730,850,970,1130,1380,1540,1790],
      purchases:[240,300,335,380,440,500,610,690,810,920,1090,1220]
    }
  };
  const visible = {purchases:true,customers:true};
  const ns = 'http://www.w3.org/2000/svg';
  const add = (tag,props,txt) => {
    const el = document.createElementNS(ns,tag);
    for(const [k,v] of Object.entries(props||{})) el.setAttribute(k,String(v));
    if(txt !== undefined) el.textContent=String(txt);
    svg.append(el);
    return el;
  };
  const pretty = n => Number(n).toLocaleString('en-US');
  const maxTick = n => n<=400?100:n<=800?200:n<=1600?400:n<=2400?500:Math.ceil(n/4/250)*250;
  let redraw = () => {};
  function render(){
    svg.replaceChildren();
    const data=activityData[range.value] || activityData['7m'];
    const {labels,customers,purchases}=data;
    const n=labels.length, W=660, H=155, plot={left:51,right:645,top:9,bottom:121};
    const maxValue=Math.max(...(visible.customers?customers:[]),...(visible.purchases?purchases:[]),1);
    const step=maxTick(maxValue);
    const upper=Math.ceil(maxValue/step)*step;
    const yVal=v=>plot.bottom-(v/upper)*(plot.bottom-plot.top);
    const cell=(plot.right-plot.left)/n;
    const xVal=i=>plot.left+(i+.5)*cell;

    for(let tick=0;tick<=4;tick++){
      const v=Math.round(upper*tick/4), y=yVal(v);
      add('line',{x1:plot.left,y1:y,x2:plot.right,y2:y,class:'chart-grid-line'});
      add('text',{x:42,y:y+4,'text-anchor':'end'},pretty(v));
    }
    labels.forEach((label,i)=>add('text',{x:xVal(i),y:plot.bottom+15,'text-anchor':'middle'},label));

    if(visible.purchases){
      purchases.forEach((v,i)=>{
        const x=xVal(i), y=yVal(v), width=Math.min(35,cell*.43);
        add('rect',{class:'activity-bar',x:x-width/2,y,width,height:Math.max(0,plot.bottom-y),rx:2});
      });
    }
    if(visible.customers){
      const coords=customers.map((v,i)=>`${xVal(i)},${yVal(v)}`).join(' ');
      add('polyline',{class:'activity-line',points:coords});
      customers.forEach((v,i)=>add('circle',{class:'activity-point',cx:xVal(i),cy:yVal(v),r:3.6}));
    }
    // Full-height hit areas make values discoverable with mouse, touch, and keyboard.
    labels.forEach((label,i)=>{
      const area=add('rect',{class:'activity-hotspot',x:xVal(i)-cell/2,y:plot.top,width:cell,height:plot.bottom-plot.top+19,tabindex:0,role:'button','aria-label':`${label}: ${pretty(customers[i])} customers and ${pretty(purchases[i])} purchases`});
      const show=()=>{
        tooltip.hidden=false;
        tooltip.innerHTML=`<strong>${label}</strong><div>Customers: ${pretty(customers[i])}</div><div>Purchases: ${pretty(purchases[i])}</div>`;
        // Use chart's actual on-screen width; not the fixed SVG coordinate width.
        tooltip.style.left=`${Math.max(68,Math.min(chart.clientWidth-68,(xVal(i)/W)*chart.clientWidth))}px`;
      };
      area.addEventListener('mouseenter',show);
      area.addEventListener('focus',show);
      area.addEventListener('click',show);
      area.addEventListener('mouseleave',()=>{tooltip.hidden=true;});
      area.addEventListener('blur',()=>{tooltip.hidden=true;});
    });
    const state=Object.entries(visible).filter(([,on])=>on).map(([key])=>key).join(' and ') || 'no selected series';
    svg.setAttribute('aria-label',`Cafe Juana ${range.options[range.selectedIndex].text} sample activity: ${state}`);
  }
  redraw=render;
  range.value='7m';
  range.addEventListener('change',()=>{tooltip.hidden=true;redraw();});
  document.querySelectorAll('[data-chart-series]').forEach(button=>{
    button.addEventListener('click',()=>{
      const key=button.dataset.chartSeries;
      visible[key]=!visible[key];
      button.setAttribute('aria-pressed',String(visible[key]));
      tooltip.hidden=true;redraw();
    });
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.activity-chart'))tooltip.hidden=true;});
  window.addEventListener('resize',()=>{tooltip.hidden=true;});
  render();
})();
