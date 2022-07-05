/*Funzionamento dell'applicazione: 
1) c'è un testo in txt.
2) un buffer deve leggerlo, togliere tutta la punteggiatura e mandare il testo, parola per parola, in un array inizialmente vuoto: 
3) questo array vuoto si riempirà del testo suddiviso parola per parola: a ogni posizione corrisponde una parola. 
4) Ora subentra una nuova variabile globale: concatenazioni. 
5) Deve avvenire un ciclo sull'array di parole, da inizio a fine.
6) All'interno di questo ciclo devono essere prese le prime X parole  (X è il numero delle concatenazioni)
7) Queste X parole inizialmente saranno quelle in posizione 0, 1, 2, 3 . Poi al ciclo successivo saranno quelle in posizione 1, 2, 3, 4;   poi saranno quelle in 2, 3, 4, 5 eccetera... compiranno un passo in avanti ma sempre rimanendo dello stesso numero.
8) queste X parole rappresentano una variabile, un array. Ogni array verrà stringato e sarà una chiave, e ha un valore. Il valore è il numero di volte che questa stessa frase viene trovata nel testo, ai cicli successivi.
Quindi la struttura che deve accogliere questa X frase e il suo valore è un oggetto.
9) Serve un oggetto, inizialmente vuoto, tale per cui  per ciascuna proprietà al suo interno (for in) se la chiave non esiste, la si crea  (è l'array di X parole) e le do un valore di 1. Perché è presente 1 volta, per cominciare, nell'oggetto.
Se viene trovata un'altra volta, aumento il valore della chiave: valore++ ovni volta.
10) Eliminare tutti i valori con chiave 1 (non servono) dall'oggetto
11) ordinare tutti i valori dal più numeroso al meno e mostrare i risultati
*/

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var formidable = require("formidable");
var fs = require("fs");

/********** Fix ai Cors ************/
const cors = require("cors");
app.use(cors());

const axios = require("axios");
axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
};

/***********************************/

//var nomeDelFile = "";

http.listen(4000, function() {
    // app.get("/prova", function (request, result) {
    //   result.render("App");
    // });

    app.post("/upload", function(request, result) {
        result.header("Access-Control-Allow-Origin", "*");
        var formData = new formidable.IncomingForm();
        let numeroDigitato = request.query[0].trim(); // !!!!! i params lato FE tocca prenderli così... !!!!!

        if (numeroDigitato < 1) {
            console.log("numero invalido");
            result.status(400).send({ errore: "numero invalido" });
            return;
        }

        formData.parse(request, function(error, fileds, files) {
            // var extension = files.file.name.substr(files.file.name.lastIndexOf("."));
            // var newPath = "uploads/" + files.file.name //+ extension;
            if (!files.file) {
                result.status(400).send({ errore: "il file non esiste" });
                return;
            }
            const testoParolaPerParola = [];

            let chiaveInOggetto = false;
            let oggetto = {};
            let concatenazioni = numeroDigitato; //> 0 ? numeroDigitato : 1;

            var buf = fs.readFileSync(files.file.path); //il file ha il nome del path
            let bufferStringato = buf.toString();
            bufferStringato = bufferStringato
                .replace(/[&\/\\#,+()$~%.'":*?<>{}«»\-]/g, " ")
                .toLowerCase();
            bufferStringato = bufferStringato.replace(/(\r\n\t|\n|\r|\t)/gm, " ");

            //console.log(bufferStringato);

            bufferStringato.split(" ").forEach(function(parola) {
                parola = parola.trim();

                if (parola != "") {
                    testoParolaPerParola.push(parola);
                }
            });

            for (var i = 0; i < testoParolaPerParola.length; i++) {
                let contatore = i;
                let fraseInesame = []; //questa variabile deve stare nel ciclo, se è globale non viene aggiornata dal secondo ciclo in poi!

                while (
                    fraseInesame.length < concatenazioni &&
                    concatenazioni < testoParolaPerParola.length &&
                    concatenazioni > 0
                ) {
                    fraseInesame.push(testoParolaPerParola[contatore++]);
                }

                let fraseStringata = fraseInesame.toString();
                // fraseStringata = fraseStringata.split(",");

                // let fraseStringata = fraseInesame;
                // console.log(fraseStringata);

                //FOR IN... non ottimizzato!
                // for (const chiave in oggetto){
                //     if (chiave == fraseStringata){
                //         oggetto[chiave]++;
                //         chiaveInOggetto = true;
                //         break;
                //     }
                // }

                //NOTA: per cercare una chiave in un oggetto non serve fare il ciclo, ma solo chiedere se è definita; a quel punto avviene un ciclo automatico, che è ottimizzato e impiega pochissimi istanti - contro un for in che impiega secondi!
                var valore = oggetto[fraseStringata];
                if (valore != undefined) {
                    ++oggetto[fraseStringata];
                    chiaveInOggetto = true;
                } else oggetto[fraseStringata] = 1;

                if (!chiaveInOggetto) {
                    oggetto[fraseStringata] = 1;
                }
            }

            const oggettoOrdinato = Object.fromEntries(
                Object.entries(oggetto).sort((a, b) => b[1] - a[1])
            ); //ordino l'oggettone dalla frase più presente alla meno presente

            let oggettoFinale = {};

            for (const chiave in oggettoOrdinato) {
                if (oggettoOrdinato[chiave] > 1) {
                    //console.log(chiave, oggettoOrdinato[chiave]) //stampo l'oggettone ordinato

                    oggettoFinale[chiave] = oggettoOrdinato[chiave];
                    // .toString()
                    // .replace(",", " ");
                }
            }

            // se l'oggetto è {"": 2} non mando niente...
            if (oggettoFinale[""]) {
                result.send(oggettoFinale = {})

            } else {
                console.log(oggettoFinale);
                result.send(oggettoFinale);
            }

        });
    });
});