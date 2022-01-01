import "./App.css";
import Form from "./Form";
import Risultati from "./Risultati";
import { useState } from "react";

const App = () => {
  let [cliccato, setCliccato] = useState(false);
  let [risultati, setRisultati] = useState({});

  console.log(cliccato);

  return (
    <div className="App">
      <Form setCliccato={setCliccato} setRisultati={setRisultati} />
      <Risultati cliccato={cliccato} risultati={risultati}></Risultati>
    </div>
  );
};

export default App;
