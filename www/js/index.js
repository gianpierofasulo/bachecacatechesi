/*
 GIANPIERO FASULO
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	
       
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    	var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // PUSHBOTS
        window.plugins.PushbotsPlugin.initialize("57fa4cac4a9efa3f578b4568", {"android":{"sender_id":"586343067969"}});

        // Should be called once the device is registered successfully with Apple or Google servers
        window.plugins.PushbotsPlugin.on("registered", function(token){
        	console.log(token);
        });

        //Get device token
        window.plugins.PushbotsPlugin.getRegistrationId(function(token){
            console.log("Registration Id:" + token);
        });
      
		
    } // END RECEIVE ENVENT
};



app.initialize();

//FUNZIONE CHE RECUPERA I PARAMETO DALLA URL
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	return vars;
	}
/* ----------------------------------------- */
	
		//-------------------------------------------------
		// PAGINA LOGIN CONTROLLO ACCESSO
		//-------------------------------------------------
		function controlla_accesso(e) {
                
				var numero_di_cellulare =  $("#cellulare").val();
				var vedi_password =  $("#password").val();
				$.ajax(
						{
							url   : 'http://www.gfasulo.it/bacheca/file_app/verifica_numero.php',
							data: {cellulare : numero_di_cellulare, password: vedi_password},
							type: "POST",
							async: false,
							dataType: 'json',
							success:function(data)
							{
									// se dati ritornati da autenticazione server = OK inserisci i dati in tabella
									if (data.testo_messaggio_server=='OK'){
										// alert (data.id_utente + 'OKOKOK');
										// se è selezionata la checbox ricorda salva il numero per un prossimo accesso
										if ($('#check-ricorda').is(':checked')) {
											localStorage.setItem("cellulare", numero_di_cellulare);
											localStorage.setItem("password", vedi_password);

										}
										// IMPORTANTE METTERE LE DOPPIE VIRGOLETTE ALLA FINE PER CHIUDERE URL
										window.location.href = "lista_gruppi.html?id=" + data.id_utente + "";
									}
									else
									{
										//alert ('NUMERO ERRATO') cancello l'eventuale numero memorizzato errato
										$("#notifica").show();
										localStorage.removeItem("cellulare");
										localStorage.removeItem("password");
										$("#check-ricorda").prop('checked', false);
									}
								
							}
						});


}	//---------------------------------------------------- END FUNZIONE PAGINA CONTOLLO LOGIN



/* ---------------------------------------------
  FUNZIONE CARICA I GRUPPI AI QUALI SEI ISCRITTO
---------------------------------------------- */
function carica_gruppi(e) {
	
			// id utente passato dalla URL dopo il login
			var vedi_id_utente = getUrlVars()["id"];
			
			
			$.ajax(
						{
							url   : 'http://www.gfasulo.it/bacheca/file_app/carica_pagina_lista_categorie_json.php',
							data: {id_utente : vedi_id_utente},
							type: "POST",
							async: false,
							dataType: 'json',
							success:function(data)
							{
								
								
									// se dati ritornati da autenticazione server = OK inserisci i dati in tabella
									for (var i=0, len=data.length; i < len; i++) {
									// ALTRE CATEGORIE
                                        $("#lista_gruppi").append(
										"<div class='thumb-layout thumb-layout-page'>"
										+ "<a href='vedi_post_singolo_gruppo.html?id_cat=" + data[i].id_cat + "' style='padding-bottom: 20px;'>"
										+	"<img class='preload-image' data-original='http://www.gfasulo.it/bacheca/pdf/" + data[i].icona + "'>"
										+	"<strong>" + data[i].descrizione + "</strong>"
										+	"<em>" + data[i].descrizione_estesa + "</em>"
										+ "<i class='fa fa-angle-right' style='float: right;'></i></a>"    
										+ "</div>"
										);
									 }
								
								
							}
						});
			
}	// ------------------------ END FUNZIONE CARICA GRUPPI ABILITATI

/* ---------------------------------------------
  FUNZIONE CARICA SINGOLO POST
---------------------------------------------- */
function carica_post_categoria_scelta(e) {
	
			// id post dalla URL 
			var vedi_id_categoria = getUrlVars()["id_cat"];
			
			
			$.ajax(
						{
							url   : 'http://www.gfasulo.it/bacheca/file_app/carica_lista_post_gruppo_scelto_json.php',
							data: {id_categoria : vedi_id_categoria},
							type: "POST",
							async: false,
							dataType: 'json',
							success:function(data)
							{
								$("#nome_gruppo").text(data[0].descrizione);
									for (var i=0, len=data.length; i < len; i++) {
										
                                        $("#posts").append(
										"<div class='pageapp-timeline-2'>"
										+	"<div class='timeline-decoration'></div>"
										+	"<div class='timeline-item'>"
										+		"<div class='timeline-icon'>"
										+			"<i class='fa fa-pencil bg-hover-green-dark'></i>"
										+		"</div>"
										+		"<div class='timeline-text'>"
										+			"<h3 class='title'>"+ data[i].titolo + "</h3>"
										+			"<em class='subtitle'><strong  style='color: green'>Inizia il: " + data[i].data_inizio + "</strong>&nbsp;&nbsp;termina il: <strong>" + data[i].data_fine + "</strong></em>"
										+			"<p>" + data[i].testo + "</p>"
										+		"</div>"
										+	"</div>");
										
										// carico immagine se esiste
										if (data[i].foto) {
										$("#posts").append(	
											"<div class='timeline-item'>"
										+		"<div class='timeline-icon'>"
										+			"<i class='fa fa-camera bg-hover-blue-dark'></i>"
										+		"</div>"
										+		"<div class='timeline-text'>"
										+			"<h3 class='title'>Immmagine</h3>"
										+			"<img data-original='http://www.gfasulo.it/bacheca/pdf/" + data[i].foto + "' id='immagine' class='preload-image responsive-image half-bottom'>"
										+			"<p></p>"
										+		"</div>"
										+	"</div>")
										};
										
										// CARICO AUDIO SE ESISTE
										if (data[i].audio) {
										$("#posts").append(	
											"<div class='timeline-item'>"
										+		"<div class='timeline-icon'>"
										+			"<i class='fa fa-youtube-play bg-hover-red-dark'></i>"
										+		"</div>"
										+		"<div class='timeline-text'>"
										+			"<h3 class='title'>Audio</h3>"
										+			"<em class='subtitle'>audio del post</em>"
										+			"<div class='full-bottom'>"
										+				"<audio controls><source src='http://www.gfasulo.it/bacheca/pdf/" + data[i].audio + "' type='audio/mpeg'>Audio non supportato</audio>"
										+			"</div>"
										+			"<p></p>"
										+		"</div>"
										+	"</div>")
										};
										
										// CARICO PDF SE ESISTE
										if (data[i].file_pdf) {
										$("#posts").append(	
											"<div class='timeline-item'>"
										+		"<div class='timeline-icon'>"
										+			"<i class='fa fa-paperclip bg-hover-red-dark'></i>"
										+		"</div>"
										+		"<div class='timeline-text'>"
										+			"<h3 class='title'>File</h3>"
										+			"<em class='subtitle'>Allegato</em>"
										+			"<div class='full-bottom'>"
										+				"<a href='http://www.gfasulo.it/bacheca/pdf/" + data[i].file_pdf + "'>SCARICA</a>"
										+			"</div>"
										+			"<p></p>"
										+		"</div>"
										+	"</div>")
										};
										 
										$("#posts").append("<div class='decoration'></div>"); 
										$("#posts").append("<div class='decoration'></div>"); 
										
									 } // END FOR
									 
									
								//	 $("#posts").append(	
								//			"<a href='pageapp-timeline-2.html' class='button button-green button-fullscreen full-bottom'>"
								//		+	"Carica altri post</a>"
								//		+	"</div>"
								//		);
										
							
								
							}
						});
			
}	// ------------------------ END FUNZIONE CARICA SINGOLO POST

/*-------------------------- FORM CONTATTATI VECCHIO 
function Contattaci() {
		var $ = jQuery;
	
		var formData = $("#formContatti").serialize();
		
			$.ajax({
				type: "POST",
				url: "http://www.gfasulo.it/file_app/invia_email_registrazione.php",
				data: formData,
				success: function(response) 
				{
				
						if (response.testo_messaggio_server === 'OK') { 
							alert('Grazie per averci contattato.', 'Messaggio inviato!');
							
							// Rimando alla INDEX
							// setTimeout(function(){ window.location = "index.html"; }, 2000);
							
						} else {
							alert('Grazie per averci contattato.', 'Messaggio inviato!');
						}
				
				}
			}); // end chiamata ajax
			//alert ("SISISISIS");
	return false;
	}
	
----------------------------------------------------*/




