var myTheme = {
	init : function(){
		// Special links
		var sLcounter = 0;
		var nTw = $("#nodeTitle");
		var nT = nTw.html();
		var nav = $("#siteNav");
		$("li",nav).each(function(i){
			var replaceTitle = false;
			var t = $(this).text();
			var last = t.substring(t.length-1,t.length);
			if (last==" ") t = t.substring(0,t.length-1); /* IE 7 requires this */
			if (t.indexOf("- ")==0 && t.indexOf(" -")==(t.length-2) && $("li",this).length==0) {
				if (nT==t) replaceTitle = true;
				t = t.substring(2);
				t = t.substring(0,t.length-2);
				if (replaceTitle) {
					// Replace the document title
					document.title = document.title.replace(nT,t);
					nTw.html(t);
				}
				$("a",this).text(t).addClass("package-link package-link-"+sLcounter);
				if (sLcounter==0 && navigator.onLine) {
					// Get the previous first level LI
					var prevLi = $(this).prev("li");
					$("a",prevLi).addClass("last-content-link");
				}
				sLcounter ++;
			}
		});
		// Check if it's an old IE
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;
		setTimeout(function(){
			$(window).resize(function() {
				myTheme.toggleMenu();
			});
		},1000);
		var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
		var navToggler = '<p id="header-options">';
				navToggler += '<a href="#" onclick="myTheme.toggleMenu(this);return false" class="hide-nav" id="toggle-nav" title="'+tit+'">';
					navToggler += '<span>'+$exe_i18n.menu+'</span>';
				navToggler += '</a>';				
			navToggler += '</p>';
		var l = $(navToggler);
		nav.before(l);
		this.positionToggler();
		$(window).resize(function(){
			myTheme.positionToggler();
		});
		var url = window.location.href;
		url = url.split("?");
		if (url.length>1){
			if (url[1].indexOf("nav=false")!=-1) {
				myTheme.hideMenu();
			}
		}
		var toTop = $("#siteNav").offset().top;
		$(window).bind('scroll', function () {
			var nav = $('#siteNav');
			if ($(window).scrollTop() > toTop) {
				var navH = nav.height();
				if (navH<$(window).height() && navH<$("#main").height()) {
					nav.addClass('fixed');
				}
			} else {
				nav.removeClass('fixed');
			}
		});
	},
	rftTitle : function(){
		var isWebSite = $("body").hasClass("exe-web-site");
		var h = $("#headerContent");
		var t = h.text();
		t = t.split(" | ");
		if (t.length==2) {
			if (isWebSite) h.html("<span>"+t[1]+"<span class='sep'> | </span></span><a href='./index.html'>"+t[0]+"</a>");
			else h.html("<span>"+t[1]+"<span class='sep'> | </span></span>"+t[0]);
		} else {
			if (isWebSite) h.html("<a href='./index.html'>"+h.text()+"</a>");
		}
	},
	hideMenu : function(){
		$("#siteNav").hide();
		$(document.body).addClass("no-nav");
		myTheme.params("add");
		var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
		$("#toggle-nav").attr("class","show-nav").attr("title",tit);
	},
	positionToggler : function(){
		var header = $("#header");
		if (header.length==1) $("#header-options").css("top",(header.height()+61)+"px")
	},	
	toggleMenu : function(e){
		if (typeof(myTheme.isToggling)=='undefined') myTheme.isToggling = false;
		if (myTheme.isToggling) return false;
		
		var l = $("#toggle-nav");
		
		if (!e && $(window).width()<900 && l.css("display")!='none') return false; // No reset in mobile view
		if (!e) {
			var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
			l.attr("class","show-nav").attr("title",tit); // Reset
		}
		
		myTheme.isToggling = true;
		
		if (l.attr("class")=='hide-nav') {  
			var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
			l.attr("class","show-nav").attr("title",tit);
			$("#siteFooter").hide();
			$("#siteNav").slideUp(400,function(){
				$(document.body).addClass("no-nav");
				$("#siteFooter").show();
				myTheme.isToggling = false;
			}); 
			myTheme.params("add");
		} else {
			var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
			l.attr("class","hide-nav").attr("title",tit);
			$(document.body).removeClass("no-nav");
			$("#siteNav").slideDown(400,function(){
				myTheme.isToggling = false;
			});
			myTheme.params("delete");			
		}
		
	},
	param : function(e,act) {
		if (act=="add") {
			var ref = e.href;
			var con = "?";
			if (ref.indexOf(".html?")!=-1) con = "&";
			var param = "nav=false";
			if (ref.indexOf(param)==-1) {
				ref += con+param;
				e.href = ref;					
			}			
		} else {
			// This will remove all params
			var ref = e.href;
			ref = ref.split("?");
			e.href = ref[0];
		}
	},
	params : function(act){
		$("A",".pagination").each(function(){
			myTheme.param(this,act);
		});
	},
	launchWindow : function(objAnchor, objEvent) {
		// Code origin: https://www.w3.org/TR/WCAG20-TECHS/SCR24.html
		var iKeyCode, bSuccess=false;
		if (objEvent && objEvent.type == 'keypress') {
			if (objEvent.keyCode) iKeyCode = objEvent.keyCode;
			else if (objEvent.which) iKeyCode = objEvent.which;
			if (iKeyCode != 13 && iKeyCode != 32) return true;
		}
		bSuccess = window.open(objAnchor.href);
		if (!bSuccess) return true;
		return false;
	},
	common : {
		init : function(){
			if ($("body").hasClass("exe-single-page")) {
				// Open definition lists
				$('.exe-dl-toggler').each(function(){
					$("a",this).eq(0).trigger("click");
				});
			}			
			myTheme.rftTitle();
			$(".iDevice_wrapper").each(function(i){
				if (i==0 && this.className.indexOf("FreeTextIdevice")!=-1) {
					$(".iDevice",this).css("margin-top",0);
				}
			});
			// Replace the node title
			if (!$("body").hasClass("exe-web-site")) {
				var n = $("#nodeTitle");
				if ($("body").hasClass("exe-single-page")) n = $(".nodeTitle");
				n.each(function(){
					var e = $(this);
					var t = e.text();
					if (t.indexOf("- ")==0 && t.substring(t.length-2,t.length)==" -") {
						t = t.substring(2);
						t = t.substring(0,t.length-2);
						e.text(t);
					}
				});
			}
			// External links
			$("a[rel^=external]").each(function(){
				var e = $(this);
				var html = e.html();
				if (e.text()==html && html.indexOf("ventana nueva")==-1 && (!this.title || this.title.indexOf("ventana nueva")==-1)) {
					var src = "_cedec_external_link.png";
					if (typeof(exe_style)!='undefined') src = exe_style.replace("content.css","") + src;
					// Add a title (not required)
					if (!this.title) this.title = "Se abre en ventana nueva";
					else this.title += " (se abre en ventana nueva)";
					this.innerHTML += '<span class="exe-hidden-accessible"> (se abre en ventana nueva) </span><img src="'+src+'" class="external-link-img" alt="Ventana nueva" width="12" height="12" />';
					this.onclick = function(event){ return myTheme.launchWindow(this, event) }
					this.onkeypress = function(event){ return myTheme.launchWindow(this, event) }
				}
			});
		}
	}
}

$(function(){
	myTheme.common.init();
	if ($("body").hasClass("exe-web-site")) myTheme.init();
});

// BatexeGo v3 Juan José de Haro 

// Define los textos que se ven en pantalla. Reemplazar el texto entre comillas

  // Textos del menú desplegable
    const defaultText = 'Parámetros por defecto:'; //Descripción de la opción por defecto
    const standardText = 'Fuente estándar'; // Fuente original del documento
    
    const dyslexicDesc = 'Dislexia:'; // Descripción de la opción OpenDyslexic  
    const dyslexicText = 'OpenDyslexic'; 
    
    const hyperlegibleDesc = 'Deficiencias visuales:'; // Descripción de la opción Atkinson Hyperlegible
    const hyperlegibleText = 'Atkinson Hyperlegible'; 
    
    const highLegibilityDesc = 'Alta legibilidad:'; // Descripción de las opciones de alta legibilidad
    const opensansText = 'OpenSans'; 
    const robotoText = 'Roboto'; 
    const latoText = 'Lato'; 
    const montserratText = 'Montserrat'; 
    const escolarText='Escolar'

  // Botones aumentar y disminuir fuente
    const increaseFontText = 'A+'; // Botón para incrementar la fuente
    const increaseFontTitle = 'Incrementa la fuente'; // Texto emergente al pasar el ratón
    
    const decreaseFontText = 'A-'; // Botón para reducir la fuente
    const decreaseFontTitle = 'Reduce la fuente'; // Texto emergente al pasar el ratón

  // Botón para traducir
    const translateText = '🌐'; // Texto para el botón de traducción de Google
    const translateTitle = 'Traduce la página'; // Texto emergente al pasar el ratón

  // Botón para leer / detener la lectura en voz alta
    let readText = 'Leer'; // Botón para leer en voz alta el contenido de la página
    const readTextTitle ='Lee en voz alta la selección o la página entera'; // Texto emergente al pasar el ratón
    
    const stopText = 'Detener'; // Texto del botón para detener la lectura
    const stopTextTitle = 'Detiene la lectura'; // Texto emergente al pasar el ratón
  
  // Botones para que los botones estén siempre visibles
    let floatingFix = 'Fijar'; // Texto del botón flotante cuando está sobre el texto
    let floatingFixTitle = 'Fija la barra de botones en la parte superior'; // Texto emergente al pasar el ratón
    
    let floatingFloat = 'Flotar'; //Texto del botón flotante cuando está fijo en la parte superior
    let floatingFloatTitle = 'La barra permanecerá siempre visible';
  
  
  // Enlace +Info
    const infoText = '+Info'; // Texto del enlace +Info
    const infoTextLink = 'https://batexego.bilateria.org'; // Destino del enlace de +Info

// Fin 
  

  readText = `${readText} (${document.documentElement.lang})`; //Se añade el idioma al botón Leer
  

  let originalFont;
  let currentFontSize;
  let originalFontSize;
  let isReading = false;
  let utterance = new SpeechSynthesisUtterance();
  let googleTranslateWidgetVisible = localStorage.getItem('googleTranslateWidgetVisible');

  function setFont(font) {
  document.body.style.fontFamily = font;
  localStorage.setItem('font', font);
  }

  function setFontSize(size) {
  currentFontSize = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'));
  currentFontSize += size;
  document.body.style.fontSize = currentFontSize + 'px';
  localStorage.setItem('fontSize', currentFontSize + 'px');
  }
  
  

function toggleGoogleTranslateWidget() {
  if (!googleTranslateWidgetVisible) {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.id = 'google-translate-script';
    document.head.appendChild(script);
    
    const googleTranslateElement = document.createElement('div');
    googleTranslateElement.id = 'google_translate_element';
    googleTranslateElement.style.position = 'fixed';
    googleTranslateElement.style.top = '0';
    googleTranslateElement.style.right = '0';
    googleTranslateElement.style.zIndex = '1000';
    document.body.appendChild(googleTranslateElement);

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({pageLanguage: 'auto', layout: google.translate.TranslateElement.FloatPosition.TOP_RIGHT}, 'google_translate_element');
    };

    googleTranslateWidgetVisible = true;
    
  } else {
    const script = document.getElementById('google-translate-script');
    script.remove();
    
    const googleTranslateElement = document.getElementById('google_translate_element');
    googleTranslateElement.remove();

    googleTranslateWidgetVisible = false;
  }
  localStorage.setItem('googleTranslateWidgetVisible',googleTranslateWidgetVisible);
}




  document.addEventListener('DOMContentLoaded', () => {

    googleTranslateWidgetVisible = JSON.parse(localStorage.getItem('googleTranslateWidgetVisible'));
  if(googleTranslateWidgetVisible) {
    googleTranslateWidgetVisible = false;
    toggleGoogleTranslateWidget();
  }

    
  
    originalFont = window.getComputedStyle(document.body).getPropertyValue('font-family');
    localStorage.setItem('originalFont', originalFont);
    let font = localStorage.getItem('font');
    if (!font) {
    font = originalFont;
    }
    document.body.style.fontFamily = font;

    let fontSize = localStorage.getItem('fontSize');
    originalFontSize = window.getComputedStyle(document.body).getPropertyValue('font-size');
    localStorage.setItem('originalFontSize', originalFontSize);
    if (!fontSize) {
    fontSize = originalFontSize
    localStorage.setItem('fontSize', fontSize);
    }
    document.body.style.fontSize = fontSize;

    const fontButtonContainer = document.createElement('div');
    fontButtonContainer.classList.add('fontButtonContainer'); 
    
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('select-container');
    const select = document.createElement('select');
    select.classList.add('z-index');
    const standardOption = document.createElement('option');
    standardOption.value = 'standard';
    standardOption.text = standardText;

    const defaultFontOptGroup = document.createElement('optgroup');
    defaultFontOptGroup.label = defaultText;
    defaultFontOptGroup.appendChild(standardOption);

    select.appendChild(defaultFontOptGroup);


    const dyslexicOption = document.createElement('option');
    dyslexicOption.value = 'dyslexic';
    dyslexicOption.text = dyslexicText;
    select.add(dyslexicOption);

    const dyslexicOptGroup = document.createElement('optgroup');
    dyslexicOptGroup.label = dyslexicDesc;
    dyslexicOptGroup.appendChild(dyslexicOption);
    select.appendChild(dyslexicOptGroup);

    const hyperlegibleOption = document.createElement('option');
    hyperlegibleOption.value = 'hyperlegible';
    hyperlegibleOption.text = hyperlegibleText;
    select.add(hyperlegibleOption);

    const hyperlegibleOptGroup = document.createElement('optgroup');
    hyperlegibleOptGroup.label = hyperlegibleDesc;
    hyperlegibleOptGroup.appendChild(hyperlegibleOption);
    select.appendChild(hyperlegibleOptGroup);

    const opensansOption = document.createElement('option');
    opensansOption.value = 'Open Sans';
    opensansOption.text = opensansText;
    select.add(opensansOption);

    const robotoOption = document.createElement('option');
    robotoOption.value = 'Roboto';
    robotoOption.text = robotoText;
    select.add(robotoOption);

    const latoOption = document.createElement('option');
    latoOption.value = 'Lato';
    latoOption.text = latoText;
    select.add(latoOption);

    const montserratOption = document.createElement('option');
    montserratOption.value = 'Montserrat';
    montserratOption.text = montserratText;
    select.add(montserratOption);  
    

    const escolarOption = document.createElement('option');
    escolarOption.value = 'Escolar';
    escolarOption.text = escolarText;
    select.add(escolarOption);  

    const highLegibilityOptGroup = document.createElement('optgroup');
    highLegibilityOptGroup.label = highLegibilityDesc;
    highLegibilityOptGroup.appendChild(latoOption);
    highLegibilityOptGroup.appendChild(montserratOption);
    highLegibilityOptGroup.appendChild(opensansOption);
    highLegibilityOptGroup.appendChild(robotoOption);
    highLegibilityOptGroup.appendChild(escolarOption);
    
    
    
    select.appendChild(highLegibilityOptGroup);

    // Seleccionar la opción correspondiente al cargar la página
    if (font === originalFont) { // Nueva condición
    select.selectedIndex = 0; // Nueva línea
    } else if (font === 'OpenDyslexic') {
    select.selectedIndex = 1;
    } else if (font === 'Atkinson Hyperlegible') {
    select.selectedIndex = 2;
    } else if (font === 'Roboto') {
    select.selectedIndex = 6;
    } else if (font === 'Lato') {
    select.selectedIndex = 3;
    } else if (font === 'Open Sans') {
    select.selectedIndex = 5;
    } else if (font === 'Escolar') {
    select.selectedIndex = 7;
    } else if (font === 'Montserrat') {
    select.selectedIndex = 4;
    } 

    select.addEventListener('change', () => {
    const font = select.value;
    if (font === 'standard') {
    setFont(originalFont);
    fontSize = originalFontSize;
    localStorage.setItem('fontSize', fontSize);
    document.body.style.fontSize = localStorage.getItem('originalFontSize');
    } else if (font === 'dyslexic') {
    setFont('OpenDyslexic');
    } else if (font === 'hyperlegible') {
    setFont('Atkinson Hyperlegible');
    } else if (font === 'Open Sans') {
    setFont('Open Sans');
    } else if (font === 'Roboto') {
    setFont('Roboto');
    } else if (font === 'Lato') {
    setFont('Lato');
    }  else if (font === 'Montserrat') {
    setFont('Montserrat');
    } else if (font === 'Escolar') {
      setFont('Escolar');
    }
    });

    selectContainer.appendChild(select);
    fontButtonContainer.appendChild(selectContainer);
    

    const increaseFontButton = document.createElement('button');
    increaseFontButton.classList.add('font-button');
    increaseFontButton.textContent = increaseFontText;
    increaseFontButton.setAttribute('title', increaseFontTitle);
    increaseFontButton.addEventListener('click', () => setFontSize(1));
    fontButtonContainer.appendChild(increaseFontButton);

    const decreaseFontButton = document.createElement('button');
    decreaseFontButton.classList.add('font-button');
    decreaseFontButton.textContent = decreaseFontText;
    decreaseFontButton.setAttribute('title', decreaseFontTitle);
    decreaseFontButton.addEventListener('click', () => setFontSize(-1));
    fontButtonContainer.appendChild(decreaseFontButton);
    
    const translateButton = document.createElement('button');
    translateButton.classList.add('font-button');
    translateButton.textContent = translateText;
    translateButton.setAttribute('title', translateTitle);
    translateButton.addEventListener('click', toggleGoogleTranslateWidget);
    fontButtonContainer.appendChild(translateButton);

  // Botón para leer en voz alta
    const readButton = document.createElement('button');
    readButton.classList.add('font-button');
    readButton.textContent = readText;
    readButton.setAttribute('title', readTextTitle);
    
    readButton.addEventListener('click', () => {
    let selectedText = window.getSelection().toString();
    let text = '';
    let lang = document.documentElement.lang;
    if (selectedText !== '') {
      text = selectedText;
      let selectedNode = window.getSelection().anchorNode;
      while (selectedNode && selectedNode.nodeType !== Node.ELEMENT_NODE) {
        selectedNode = selectedNode.parentNode;
      }
      if (selectedNode) {
        const selectedLang = selectedNode.getAttribute('lang');
        if (selectedLang) {
          lang = selectedLang;
        }
      }
    } else {
      text = document.body.innerText;
      const bodyLang = document.body.getAttribute('lang');
      if (bodyLang) {
        lang = bodyLang;
      }
    }

    utterance.lang = lang;
    utterance.text = text;

    if (!isReading) {
      isReading = true;
      readButton.textContent = `${stopText} (${lang})`;
      readButton.setAttribute('title', stopTextTitle);
      speechSynthesis.speak(utterance);
    } else {
      isReading = false;
      readButton.textContent = readText;
      readButton.setAttribute('title', readTextTitle);
      speechSynthesis.cancel();
    }

    utterance.addEventListener('end', () => {
      isReading = false;
      readButton.textContent = readText;
      readButton.setAttribute('title', readTextTitle);
    });
  });  
    
    fontButtonContainer.appendChild(readButton);
    
  // Botón para que la barra esté siempre visible
    const floatingButton = document.createElement('button');
    floatingButton.classList.add('font-button');
    floatingButton.textContent = floatingFloat;
    floatingButton.setAttribute('title', floatingFloatTitle);
    floatingButton.addEventListener('click', () => {
    if (floatingButton.textContent === floatingFix) {
      fontButtonContainer.style.position = 'static';
      floatingButton.textContent = floatingFloat;
      floatingButton.setAttribute('title', floatingFloatTitle);
      localStorage.setItem('floatState', 'static');
    } else {
      fontButtonContainer.style.position = 'fixed';
      floatingButton.textContent = floatingFix;
      floatingButton.setAttribute('title', floatingFixTitle);
      localStorage.setItem('floatState', 'fixed');
    }
  });

    

    let floatState = localStorage.getItem('floatState');
    if (!floatState) {
      floatState = 'static';
      floatingButton.textContent = floatingFix;
      floatingButton.setAttribute('title', floatingFixTitle);
    }
    if (floatState === 'fixed') {
      fontButtonContainer.style.position = 'fixed';
      floatingButton.textContent = floatingFix;
      floatingButton.setAttribute('title', floatingFixTitle);
    } else {
      fontButtonContainer.style.position = 'static';
      floatingButton.textContent = floatingFloat;
      floatingButton.setAttribute('title', floatingFloatTitle);
    }
    
    localStorage.setItem('floatState', floatState);
    
  fontButtonContainer.appendChild(floatingButton);


    const infoLink = document.createElement('a');
    infoLink.textContent = infoText;
    infoLink.href = infoTextLink;
    infoLink.target = '_blank';
    infoLink.style.marginLeft = '8px';
    infoLink.style.fontSize = '12px';
    fontButtonContainer.appendChild(infoLink);

    
    infoLink.classList.add('z-index');

    document.body.insertBefore(fontButtonContainer, document.body.firstChild);
   
  });
  