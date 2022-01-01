import axios from "axios";
import { useEffect, useState } from "react";

const Risultati = ({ cliccato, risultati }) => {
  useEffect(() => {
    console.log(risultati);
  }, [cliccato, risultati]);

  return (
    <div className="risultati-container">
      {Object.keys(risultati) && (
        <ul>
          {Object.keys(risultati).map((risultato, i) => (
            <li key={i}>
              "{risultato.replaceAll(",", " ")}" è stata trovata:{" "}
              {risultati[risultato] + " volte"}
            </li>
          ))}
        </ul>
      )}
      {Object.keys(risultati) < 1 && (
        <p className="absolute">Nessun risultato trovato</p>
      )}
    </div>
  );
};

export default Risultati;
