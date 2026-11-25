/* NodeX: photo-referenced eight-GPU chassis. Authored SVG; no external assets. */
(function () {
  'use strict';
  var sequence = 0;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var bg = {
    'INSIDE A NODEX SERVER': 'ВЪТРЕ В СЪРВЪРА',
    'Photo-based layout': 'По реална конфигурация',
    'Interactive eight-GPU server': 'Интерактивен сървър с осем видеокарти',
    'Explore the components': 'Разгледайте компонентите',
    'Overview': 'Общ изглед', 'Cooling': 'Охлаждане', 'CPU + RAM': 'CPU + RAM',
    'One chassis. Three connected zones.': 'Едно шаси. Три свързани зони.',
    'Eight GPUs, a central fan wall and a dual-processor motherboard.': 'Осем GPU, централен ред вентилатори и двупроцесорна дънна платка.',
    '8 × RTX PRO 6000': '8 × RTX PRO 6000',
    'Eight cards sit side by side in a dedicated bay, with cabling along the chassis edge.': 'Осем карти една до друга в отделна зона, с окабеляване по края на шасито.',
    'Three central fan modules': 'Три централни вентилаторни модула',
    'The transverse fan wall separates the GPU bay from the motherboard.': 'Напречният ред вентилатори разделя GPU зоната от дънната платка.',
    'Two CPU coolers. DIMM banks.': 'Два CPU охладителя. RAM банки.',
    'Two tower heatsinks and the surrounding memory occupy the motherboard section.': 'Двата кулови охладителя и паметта около тях са в зоната на дънната платка.',
    'Rack chassis, closed': 'Затворено rack шаси',
    'A metal lid, black ventilated face and rack mounting ears enclose the system.': 'Метален капак, черен перфориран панел и монтажни уши оформят шасито.',
    'Close lid': 'Затвори капака', 'Open chassis': 'Отвори шасито',
    'Based on our server photos.': 'По снимки на наш сървър.',
    'Illustration; configurations vary.': 'Илюстрация; конфигурациите се различават.',
    'Open chassis. All components remain in their installed positions.': 'Отворено шаси. Всички компоненти остават на монтажните си места.',
    'Chassis lid closed.': 'Капакът на шасито е затворен.'
  };
  var de = {
    'INSIDE A NODEX SERVER': 'IM INNEREN EINES NODEX-SERVERS',
    'Photo-based layout': 'Nach realer Konfiguration',
    'Interactive eight-GPU server': 'Interaktiver Server mit acht GPUs',
    'Explore the components': 'Komponenten ansehen',
    'Overview': 'Übersicht', '8 × GPU': '8 × GPU', 'Cooling': 'Kühlung', 'CPU + RAM': 'CPU + RAM',
    'One chassis. Three connected zones.': 'Ein Gehäuse. Drei verbundene Zonen.',
    'Eight GPUs, a central fan wall and a dual-processor motherboard.': 'Acht GPUs, eine zentrale Lüfterwand und ein Mainboard mit zwei Prozessoren.',
    '8 × RTX PRO 6000': '8 × RTX PRO 6000',
    'Eight cards sit side by side in a dedicated bay, with cabling along the chassis edge.': 'Acht Karten sitzen nebeneinander in einem eigenen Bereich, die Verkabelung läuft am Gehäuserand entlang.',
    'Three central fan modules': 'Drei zentrale Lüftermodule',
    'The transverse fan wall separates the GPU bay from the motherboard.': 'Die quer verlaufende Lüfterwand trennt den GPU-Bereich vom Mainboard.',
    'Two CPU coolers. DIMM banks.': 'Zwei CPU-Kühler. DIMM-Bänke.',
    'Two tower heatsinks and the surrounding memory occupy the motherboard section.': 'Zwei Tower-Kühler und der Arbeitsspeicher daneben belegen den Mainboard-Bereich.',
    'Rack chassis, closed': 'Rack-Gehäuse, geschlossen',
    'A metal lid, black ventilated face and rack mounting ears enclose the system.': 'Ein Metalldeckel, eine schwarze belüftete Front und Rack-Montagewinkel umschließen das System.',
    'Close lid': 'Deckel schließen', 'Open chassis': 'Gehäuse öffnen',
    'Based on our server photos.': 'Nach Fotos unseres Servers.',
    'Illustration; configurations vary.': 'Illustration; Konfigurationen variieren.',
    'Open chassis. All components remain in their installed positions.': 'Gehäuse geöffnet. Alle Komponenten bleiben an ihrem Einbauort.',
    'Chassis lid closed.': 'Gehäusedeckel geschlossen.'
  };
  function t(s) {
    var lang = document.documentElement.lang;
    if (/^bg(?:-|$)/i.test(lang)) return bg[s] || (window.NodeXSceneTranslations || {})[s] || s;
    if (/^de(?:-|$)/i.test(lang)) return de[s] || (window.NodeXSceneTranslations || {})[s] || s;
    return s;
  }
  // Axonometric coordinates: x = chassis width, y = length, z = height.
  // Component locations follow the supplied open-chassis photograph, not an exploded stack.
  function p(x, y, z) { return [300 + x - .45 * y, 88 + .28 * x + .60 * y - z]; }
  function point(v) { return p(v[0], v[1], v[2]).map(function (n) { return n.toFixed(2); }).join(','); }
  function poly(a, fill, extra) { return '<polygon points="' + a.map(point).join(' ') + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function top(x, y, w, d, z, fill, extra) { return poly([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],fill,extra); }
  function line(a, b, color, width, extra) { return '<path d="M' + point(a) + 'L' + point(b) + '" fill="none" stroke="' + color + '" stroke-width="' + (width || 1) + '" ' + (extra || '') + '/>'; }
  function box(x,y,z,w,d,h,colors,extra) {
    return '<g ' + (extra || '') + '>' +
      poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],colors[1]) +
      poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],colors[2]) +
      top(x,y,w,d,z+h,colors[0]) + '</g>';
  }
  function plane(x,y,z,contents) {
    var a=p(x,y,z); return '<g transform="matrix(1 .28 -.45 .6 '+a[0]+' '+a[1]+')">'+contents+'</g>';
  }
  function face(x,y,z,contents) {
    var a=p(x,y,z); return '<g transform="matrix(1 .28 0 1 '+a[0]+' '+a[1]+')">'+contents+'</g>';
  }
  function fan(x,y,z,r,color) {
    var a=p(x,y,z), blades='';
    for(var i=0;i<7;i++) blades+='<path d="M2-3C5-16 15-18 15-8C14-1 7 2 3 2Z" transform="rotate('+i*360/7+')"/>';
    return '<g transform="matrix(1 .28 0 1 '+a[0]+' '+a[1]+')"><circle r="'+r+'" fill="#071519" stroke="'+color+'" stroke-width="2"/>'+
      '<g transform="scale('+(r/23)+')"><g class="nx-photo-rotor" fill="#46575a">'+blades+'</g></g>'+
      '<circle r="'+(r*.72)+'" fill="none" stroke="'+color+'" stroke-width="1.5"/><circle r="'+(r*.4)+'" fill="none" stroke="'+color+'"/>'+
      '<path d="M-'+r+' 0H'+r+'M0-'+r+'V'+r+'" stroke="'+color+'" stroke-width="1.4"/><circle r="'+r*.20+'" fill="#192e33" stroke="'+color+'"/></g>';
  }
  function model(id) {
    var s='<svg class="nx-photo-svg" viewBox="30 -12 620 500" aria-hidden="true" focusable="false"><defs>'+
      '<linearGradient id="'+id+'-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c4cbd0"/><stop offset=".35" stop-color="#7d8a91"/><stop offset=".65" stop-color="#a3aeb2"/><stop offset="1" stop-color="#596770"/></linearGradient>'+
      '<linearGradient id="'+id+'-gold"><stop stop-color="#977445"/><stop offset=".35" stop-color="#dfc08a"/><stop offset=".74" stop-color="#bb9b65"/><stop offset="1" stop-color="#efd6a5"/></linearGradient>'+
      '<pattern id="'+id+'-holes" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#273239"/><circle cx="2.5" cy="2.5" r="1.25" fill="#060d12"/></pattern>'+
      '<pattern id="'+id+'-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#8c999e"/><circle cx="2.5" cy="2.5" r="1.4" fill="#283b43"/></pattern>'+
      '</defs><g class="nx-photo-machine">';
    var metal='url(#'+id+'-metal)',gold='url(#'+id+'-gold)';
    // Floor, inner walls and perforated end panel.
    s+=top(-10,-8,322,505,-14,'#000','opacity=".34"');
    s+=box(0,0,0,300,480,7,['#475b62','#77848b','#3b474f']);
    s+=poly([[0,0,7],[0,480,7],[0,480,68],[0,0,68]],'#76858b');
    s+=poly([[0,0,7],[300,0,7],[300,0,68],[0,0,68]],'#a7b2b5');
    s+=face(8,1,62,'<rect width="284" height="43" fill="url(#'+id+'-mesh)"/><rect y="-5" width="284" height="5" fill="#d4dadd"/>');
    for(var b=0;b<3;b++) s+=box(60+b*88,-4,66,10,8,5,['#2d80ab','#205473','#325c7b']);
    // Dedicated GPU board and eight parallel, upright gold/black cards.
    s+='<g class="nx-photo-zone" data-zone="gpu">'+top(22,15,266,216,10,'#183f32');
    for(var g=0;g<8;g++){
      var x=45+g*30;
      s+=box(x,19,13,25,201,47,[gold,'#101519','#10191e'],'class="nx-photo-gpu"');
      for(var f=1;f<12;f++) s+=line([x+f*2,23,60],[x+f*2,205,60],'#79613f',.46);
      s+=top(x,182,25,26,60.3,'#131b1e');
      s+=plane(x+5,186,60.6,'<text font-size="4.5" fill="#d4d8d1" font-family="Arial,sans-serif">RTX PRO</text>');
      s+=top(x+3,214,17,4,61,'#d9ccb1');
      s+=line([x+11,220,44],[x+11,232,13],'#141b1e',3);
    }
    s+='</g>';
    // Visible black cable loops in the side corridor, with a restrained gold wire accent.
    for(var c=0;c<6;c++){
      s+=line([13+c*3,30,23+c],[13+c*3,205,19+c],'#0c141b',2.4);
      s+=line([13+c*3,287,13+c],[13+c*3,449,14+c],c%3===0?'#b19954':'#151d24',2);
      s+=line([281+c*2,298,17+c],[281+c*2,450,17+c],c%3===0?'#c2a756':'#111c23',1.7);
    }
    // Three turquoise hot-swap fan cassettes across the middle, never lifted out of place.
    s+='<g class="nx-photo-zone" data-zone="cooling">';
    for(var q=0;q<3;q++){
      var fx=20+q*88;
      s+=box(fx,236,10,81,44,57,['#1eaa97','#17665f','#248a80'],'class="nx-photo-fan-module"');
      s+=top(fx+17,242,47,22,68,'#152f31');
      s+=top(fx+20,245,41,4,69,'#405856');
      s+=plane(fx+32,258,69,'<path d="M0 0H12M6-4L12 0 6 4" fill="none" stroke="#8caaa5" stroke-width="1.6"/>');
      s+=fan(fx+40,281,38,26,'#46c9ae');
    }
    s+=box(6,227,62,288,8,5,[metal,'#627577','#879995']);
    s+=top(35,228,29,6,68,'#d4b34d');s+=top(232,228,25,6,68,'#d4b34d');
    s+='</g>';
    // Motherboard, routing, chips, memory banks. The near section is painted after the central fan wall.
    s+='<g class="nx-photo-zone" data-zone="host">'+box(28,287,8,242,168,3,['#245544','#163a31','#193e30']);
    for(var tr=0;tr<9;tr++){
      s+=line([36+tr*24,292,11.5],[36+tr*24,449,11.5],'#759070',.55);
      s+=line([32,299+tr*17,11.5],[266,299+tr*17,11.5],'#637f63',.5);
    }
    for(var chip=0;chip<7;chip++) s+=box(45+chip*29,423,12,16,13,3,['#142b28','#101c1c','#102522']);
    s+=box(125,415,12,36,29,10,['#9eacaa','#3b5a54','#607e70']);
    for(var sink=0;sink<9;sink++) s+=line([128+sink*3.6,416,22],[128+sink*3.6,443,22],'#364d45',1);
    [37,128,151,244].forEach(function(start){
      for(var m=0;m<4;m++){
        var mx=start+m*5.3;
        s+=box(mx,318,12,2.8,86,20,['#91a179','#173329','#0c211d'],'class="nx-photo-dimm"');
        for(var mc=0;mc<5;mc++) s+=poly([[mx+2.85,323+mc*14,15],[mx+2.85,333+mc*14,15],[mx+2.85,333+mc*14,28],[mx+2.85,323+mc*14,28]],'#101b1a');
        s+=top(mx-1,315,5,5,15,'#83b7cb');s+=top(mx-1,404,5,5,15,'#83b7cb');
      }
    });
    [65,178].forEach(function(cx){
      s+=box(cx,314,12,51,75,45,['#c9cebf','#6e7c77','#465a55'],'class="nx-photo-cpu"');
      for(var fin=0;fin<17;fin++) s+=line([cx+3,318+fin*3.8,57.2],[cx+48,318+fin*3.8,57.2],fin%2?'#748580':'#e0e1ce',1.1);
      for(var pin=0;pin<4;pin++){
        s+=top(cx+1,320+pin*17,3,3,58,'#bd8063');s+=top(cx+47,320+pin*17,3,3,58,'#bd8063');
      }
      s+=face(cx-1,391,59,'<rect width="53" height="48" rx="3" fill="#111d22" stroke="#43524e"/>');
      s+=fan(cx+25,392,36,21,'#455251');
    });
    s+='</g>';
    // Thin silver side rails, near black fascia, modular bays and rack ears.
    s+=poly([[300,0,0],[300,480,0],[300,480,68],[300,0,68]],metal);
    s+=top(295,0,6,480,68,'#c8d1d0');
    s+=top(0,0,6,480,68,'#bbc5c6');
    s+=line([300,8,12],[300,470,12],'#475b64',1.4);
    s+=face(0,480,68,'<rect width="300" height="68" rx="2" fill="#10191f" stroke="#77878d"/>'+
      '<rect x="10" y="7" width="280" height="23" fill="url(#'+id+'-holes)"/><path d="M10 34H289" stroke="#53626a"/>');
    for(var bay=0;bay<4;bay++){
      s+=face(16+bay*66,481,29,'<rect width="59" height="25" rx="1" fill="#202e35" stroke="#52626a"/><rect x="5" y="3" width="25" height="17" fill="#080f14"/>'+
        '<path d="M34 6H52V21H34Z" fill="none" stroke="#82908e" stroke-width="2"/><rect x="2" y="2" width="2" height="3" fill="#74b28c"/>');
    }
    [ -10, 301 ].forEach(function(ex){s+=face(ex,481,71,'<rect width="9" height="76" rx="2" fill="#95a2a7"/><rect x="2" y="5" width="4" height="9" rx="2" fill="#17262d"/><rect x="2" y="58" width="4" height="10" rx="2" fill="#17262d"/>');});
    s+=face(287,482,28,'<rect width="7" height="7" fill="#25799b"/><rect y="12" width="7" height="6" fill="#25799b"/>');
    for(var screw=0;screw<7;screw++){
      var a=p(298,20+screw*69,69);s+='<circle cx="'+a[0]+'" cy="'+a[1]+'" r="1.5" fill="#354d55"/>';
    }
    // Real lid: a single sliding/lifting panel; closed lid fully occludes the internals.
    s+='<g class="nx-photo-lid">'+box(-1,0,70,302,480,3,[metal,'#596c74','#b7c3c7']);
    s+=top(5,7,290,465,73.3,'none','stroke="#c1ccce" stroke-width=".7"');
    s+=plane(33,355,74,'<rect width="10" height="35" rx="4" fill="#14242b"/><rect x="1" y="23" width="8" height="12" rx="2" fill="#071219"/>');
    s+=plane(257,355,74,'<rect width="10" height="35" rx="4" fill="#14242b"/><rect x="1" y="23" width="8" height="12" rx="2" fill="#071219"/>');
    s+=plane(25,402,74,'<rect width="250" height="53" fill="#cdd2cf" opacity=".85"/><rect x="4" y="4" width="242" height="5" fill="#805a54"/>'+
      '<path d="M7 15H244M7 20H244M7 25H244M7 30H244M7 35H244M7 40H244M60 13V48M122 13V48M183 13V48" stroke="#81908f" stroke-width="1"/>');
    s+=plane(106,346,74,'<rect width="81" height="36" fill="#cfd5d0"/><text x="9" y="15" fill="#324850" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="2">NODEX</text><path d="M9 22H72M9 27H56" stroke="#83918e" stroke-width="2"/>');
    s+='</g></g></svg>';
    return s;
  }
  var details={
    all:['One chassis. Three connected zones.','Eight GPUs, a central fan wall and a dual-processor motherboard.'],
    gpu:['8 × RTX PRO 6000','Eight cards sit side by side in a dedicated bay, with cabling along the chassis edge.'],
    cooling:['Three central fan modules','The transverse fan wall separates the GPU bay from the motherboard.'],
    host:['Two CPU coolers. DIMM banks.','Two tower heatsinks and the surrounding memory occupy the motherboard section.'],
    closed:['Rack chassis, closed','A metal lid, black ventilated face and rack mounting ears enclose the system.']
  };
  function mount(container){
    if(container.getAttribute('data-nx-scene-ready')==='photo-v1')return;
    container.setAttribute('data-nx-scene-ready','photo-v1');
    container.classList.add('nx-server-scene');
    container.setAttribute('role','group');container.setAttribute('aria-label',t('Interactive eight-GPU server'));
    var id='nx-photo-'+(++sequence);
    container.innerHTML='<div class="nx-photo-scene is-open" data-focus="all">'+
      '<div class="nx-photo-header"><span class="nx-photo-eyebrow"><i></i>'+t('INSIDE A NODEX SERVER')+'</span><span class="nx-photo-model-label">8 × RTX PRO 6000</span></div>'+
      '<div class="nx-photo-stage">'+model(id)+'</div>'+
      '<div class="nx-photo-select" role="group" aria-label="'+t('Explore the components')+'">'+
      [['all','Overview'],['gpu','8 × GPU'],['cooling','Cooling'],['host','CPU + RAM']].map(function(v,i){return '<button type="button" data-component="'+v[0]+'" aria-pressed="'+(i===0?'true':'false')+'" aria-controls="'+id+'-detail"><i aria-hidden="true">0'+i+'</i>'+t(v[1])+'</button>';}).join('')+'</div>'+
      '<div class="nx-photo-detail" id="'+id+'-detail" role="status" aria-live="polite" aria-atomic="true"><strong>'+t(details.all[0])+'</strong><p>'+t(details.all[1])+'</p></div>'+
      '<div class="nx-photo-footer"><p>'+t('Based on our server photos.')+'<span>'+t('Illustration; configurations vary.')+'</span></p><button type="button" class="nx-photo-toggle" aria-controls="'+id+'-detail"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 7 7-4 7 4-7 4-7-4Zm0 5 7 4 7-4"/></svg><span>'+t('Close lid')+'</span></button></div></div>';
    var scene=container.querySelector('.nx-photo-scene'), button=container.querySelector('.nx-photo-toggle');
    var title=container.querySelector('.nx-photo-detail strong'), description=container.querySelector('.nx-photo-detail p');
    var controls=container.querySelectorAll('[data-component]');
    var opened=true, focus='all', visible=true, frame=0, x=0, y=0;
    function show(){
      scene.classList.toggle('is-open',opened);scene.setAttribute('data-focus',opened?focus:'all');
      var current=details[opened?focus:'closed'];title.textContent=t(current[0]);description.textContent=t(current[1]);
      button.querySelector('span').textContent=t(opened?'Close lid':'Open chassis');
      controls.forEach(function(control){control.setAttribute('aria-pressed',String(opened&&control.getAttribute('data-component')===focus));});
    }
    button.addEventListener('click',function(){opened=!opened;show();});
    controls.forEach(function(control){control.addEventListener('click',function(){focus=control.getAttribute('data-component');opened=true;show();});});
    function drawTilt(){frame=0;scene.style.setProperty('--nx-photo-x',x.toFixed(2)+'px');scene.style.setProperty('--nx-photo-y',y.toFixed(2)+'px');}
    function reset(){x=0;y=0;if(!frame)frame=window.requestAnimationFrame(drawTilt);}
    function syncMotion(){scene.classList.toggle('is-paused',motion.matches||!visible||document.hidden);reset();}
    container.addEventListener('pointermove',function(e){
      if(motion.matches||!finePointer.matches||e.pointerType!=='mouse')return;
      var r=container.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*5;y=((e.clientY-r.top)/r.height-.5)*3;
      if(!frame)frame=window.requestAnimationFrame(drawTilt);
    },{passive:true});
    container.addEventListener('pointerleave',reset,{passive:true});
    container.addEventListener('pointercancel',reset,{passive:true});
    if(motion.addEventListener)motion.addEventListener('change',syncMotion);else if(motion.addListener)motion.addListener(syncMotion);
    document.addEventListener('visibilitychange',syncMotion);
    if('IntersectionObserver' in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;syncMotion();},{threshold:.05}).observe(container);}
    syncMotion();
  }
  function init(scope){var root=scope&&scope.querySelectorAll?scope:document;if(root.matches&&root.matches('[data-nx-scene]'))mount(root);root.querySelectorAll('[data-nx-scene]').forEach(mount);}
  window.NodeXScene={init:init};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){init(document);},{once:true});else init(document);
})();
