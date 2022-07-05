import { useState } from "react";
import axios from "axios";

const Form = ({ setCliccato, setRisultati }) => {
  const [fileCaricato, setFileCaricato] = useState();
  const [numeroDigitato, setNumeroDigitato] = useState("");

  const prendiFile = (e) => {
    const mioFile = e.target.files[0];
    setFileCaricato(mioFile);
    //console.log(fileCaricato);
  };

  const prendiNumero = (e) => {
    // if (e.charCode == 8 || e.charCode == 0) {
    //   return 1;
    // }
    const numero = e.target.value;
    setNumeroDigitato(numero);
  };

  const inviaFile = async () => {
    var formData = new FormData();
    formData.append("file", fileCaricato);
    formData.append("numero", numeroDigitato);

    // console.log("questo è ", formData);

    // const res = await axios.post("http://localhost:4000/upload", formData);
    // console.log(res.data.files, res.data.form, res.data.headers);

    setRisultati({});
    axios
      .post("http://localhost:4000/upload", formData, { //per Node
        headers: { "Content-Type": "multipart/form-data"},  //per Node
        // data: formData,
        params: numeroDigitato,
      })
      .then((res) => {
        if (res.data){
          console.log('pippo', res.data)
          setRisultati(res.data)
        }
      });
  };

  const setBottoneCliccato = () => {
    setCliccato(true);
  };

  return (
    <div className="form-container" onSubmit={(e) => e.preventDefault()}>
      <form method="POST" encType="multipart/form-data">
        <label htmlFor="numero">Quante parole deve contenere la frase?</label>
        <input
          type="number"
          // type="text"
          id="numero"
          placeholder="numero"
          onChange={prendiNumero}
          pattern="[1-9]"
          min="1"
          step="1"
        />
        <input
          className="input-ristretto"
          type="file"
          name="file"
          onChange={prendiFile}
        />
        <input
          type="button"
          value="Cerca"
          onClick={(setBottoneCliccato, inviaFile)}
        />
      </form>
    </div>
  );
};

export default Form;
