

$(document).ready(function () {
    class Carte{
        constructor(p_signe, p_nombre){
            this.signe = p_signe;
            this.nombre = p_nombre;
            this.nom = p_nombre + p_signe;
        }

        static comparerCartes(p_nomCartePrecedente, p_nomCarteSuivante){
            let nombrePrecedent = "";
            let signePrecedent = "";
            let nombreSuivant = "";
            let signeSuivant = "";
            if(p_nomCartePrecedente.length == 2){    
                nombrePrecedent = p_nomCartePrecedente.substring(0,1);
                signePrecedent = p_nomCartePrecedente.substring(1,2);
            }else{
                nombrePrecedent = p_nomCartePrecedente.substring(0,2);
                signePrecedent = p_nomCartePrecedente.substring(2,3);
            }

            if(p_nomCarteSuivante.length == 2){
                nombreSuivant = p_nomCarteSuivante.substring(0,1);
                signeSuivant = p_nomCarteSuivante.substring(1,2);
            }else{  
                nombreSuivant = p_nomCarteSuivante.substring(0,2);
                signeSuivant = p_nomCarteSuivante.substring(2,3);
            }

            //si le nombre ou le signe de la carte precedente est égal à la suivante alors on retourne vrai
            if(nombrePrecedent == nombreSuivant || signePrecedent == signeSuivant) return true;
            else return false;
        }

        static initAll(){
            let lettres = "CDHS";
            let tabCartes = new Array();
            for(let i = 0; i < 4; i++){
                let lettre = lettres.charAt(i);
                for(let j = 1; j <= 13; j++){
                    switch(j){
                        case 1:
                            tabCartes.push(new Carte(lettre, "A"));
                            break;
                        case 11:
                            tabCartes.push(new Carte(lettre, "J"));
                            break;
                        case 12:
                            tabCartes.push(new Carte(lettre, "Q"));
                            break;
                        case 13:
                            tabCartes.push(new Carte(lettre, "K"));
                            break;
                        default:
                            tabCartes.push(new Carte(lettre, j));
                            break;
                    }
                }
            }
            return tabCartes;
        }
    }

    var nbCartesTotal = 52;
    var tabMouvements = new Array();
    var tabAnnulations = new Array();
    var tabCartes = Carte.initAll();    
    

    $("#bt_aide").click(function (e) { 
        e.preventDefault();
        let cartesSorties = [];
        $("#cartesSorties").find("img").each(function(){ 
            cartesSorties.push(this.id); 
        });

        for(i = 1; i < cartesSorties.length - 1; i++){
            nomCartePrecedente = $('#cartesSorties img').eq(i - 1)[0].id;
            nomCarteSuivante = $('#cartesSorties img').eq(i + 1)[0].id;
            //si le nombre ou le signe de la carte precedente est égal à la suivante alors on change le background pour donner l'indication a l'utilisateur
            if(Carte.comparerCartes(nomCartePrecedente, nomCarteSuivante)){
                $("#cartesSorties img").eq(i).css("background-color", "rgba(201, 232, 255, 0.5)");
                break;
            }
        }
    });

    $("#bt_annuler").click(function (e) { 
        e.preventDefault();
        if(tabMouvements.length > 0){
            //on recupere le dernier mouvement fait
            dernierMouvement = tabMouvements[tabMouvements.length - 1];
            premiereCarte = dernierMouvement.split("/")[0]; // carte toujours la 
            deuxiemeCarte = dernierMouvement.split("/")[1]; // carte remplacée
            
            //affichage
            content = '<img class="cartes" id="'+deuxiemeCarte+'" src="Sprites/'+deuxiemeCarte+'.png" alt="card">';
            $("#" + premiereCarte).before(content);
            
            tabMouvements.splice(-1,1); // on enleve le dernier element du tableau des mouvement
            tabAnnulations.push(premiereCarte + "/" + deuxiemeCarte); // on ajoute le mouvement au tableau des annulations            
        }
       
    });

    $("#bt_refaire").click(function (e) { 
        e.preventDefault();

        if(tabAnnulations.length > 0){
            dernierMouvement = tabAnnulations[tabAnnulations.length - 1];
            premiereCarte = dernierMouvement.split("/")[0];
            deuxiemeCarte = dernierMouvement.split("/")[1]; //carte a enlever
            $("#" + deuxiemeCarte).remove(); 
            tabMouvements.push(premiereCarte + "/"+ deuxiemeCarte);
        }
    });

    $("#bt_rejouer").click(function (e) { 
        e.preventDefault();
        //On remet tout a 0
        $("#cardsBack").css("display", "inline-block");
        nbCartesTotal = 52;
        tabCartes = Carte.initAll();
        $("#cartesSorties").empty();
        $("#infosNbCartes").text("Nombre de cartes retournées : 0 | Nombre de cartes restantes : " + nbCartesTotal);
    });
    
    $("#cardsBack").click(function (e) {
        e.preventDefault();
       
        //on choisi une carte au hasard
        let index = Math.floor(Math.random() * tabCartes.length);
        let maCarte = tabCartes[index];

        //on retire la carte tiré du tableau
        tabCartes = jQuery.grep(tabCartes, function(value){
            return value != maCarte;
        });
        
        nbCartesTotal--;
        //on update le nombre de cartes tirées / restantes
        $("#infosNbCartes").text("Nombre de cartes retournées : "+(52 - nbCartesTotal)+" | Nombre de cartes restantes : " + nbCartesTotal);
        //on ajoute l'image de la carte à l'écran
        content = '<img class="cartes" id="'+maCarte.nom+'" src="Sprites/'+maCarte.nom+'.png" alt="card">';
        $("#cartesSorties").append(content);      
        
        //si il n'y a plus de cartes dans le tableau on fait disparaitre la pioche
        if(jQuery.isEmptyObject(tabCartes)){
            $(this).css("display", "none");
        }
    });

    $('#cartesSorties').on('click', '.cartes', function(){
        let indexCarteClique = $('#cartesSorties img').index(this);
        let nomCartePrecedente = $('#cartesSorties img').eq(indexCarteClique - 1)[0].id;
        let nomCarteSuivante = $('#cartesSorties img').eq(indexCarteClique + 1)[0].id;

        if(indexCarteClique > 0 && indexCarteClique < $('#cartesSorties img').length - 1){
            if(Carte.comparerCartes(nomCartePrecedente, nomCarteSuivante)){
                $("#cartesSorties img").css("background-color", "white");
                $("#" + nomCartePrecedente).remove();
                tabMouvements.push(this.id + "/" + nomCartePrecedente);
            }
        }
    });    
});

