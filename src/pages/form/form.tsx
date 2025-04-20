/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import CaptchaModal from "./captcha";
import { useNavigate } from "react-router";

export default function FormPage() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    street: "",
    zip: "",
    birth: "",
  });
  const [errors, setErrors] = useState({} as any);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    const err = {} as any;
    if (!data.firstName) err.firstName = "Obrigatório";
    if (!data.lastName) err.lastName = "Obrigatório";
    if (!data.email) err.email = "Obrigatório";
    if (!data.password) err.password = "Obrigatório";
    if (data.password.length < 10) err.password = "Mínimo 10 caracteres";
    if (!/[A-Z]/.test(data.password))
      err.password = "Necessita 1 letra maiúscula";
    if (!/[0-9]/.test(data.password)) err.password = "Necessita 1 número";
    if (data.password !== data.confirmPassword)
      err.confirmPassword = "Senhas diferentes";

    if (!data.street) err.street = "Obrigatório";
    if (!data.zip) err.zip = "Obrigatório";
    if (!data.birth) err.birth = "Obrigatório";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!validate()) return;

    setOpen(true);
  };

  const handleSuccess = () => {
    alert("Captcha verificado com sucesso!");

    navigate("/profile", { state: { data } });
  };

  return (
    <main className="form-wrapper">
      <h2>Cadastro de Usuário</h2>

      <label>
        Nome*
        <input
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
          placeholder="Nome"
          autoComplete="given-name"
          type="text"
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </label>

      <label>
        Sobrenome*
        <input
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          placeholder="Sobrenome"
          autoComplete="family-name"
          type="text"
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </label>

      <label>
        E-mail*
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </label>

      <label>
        Endereço*
        <input
          name="street"
          value={data.street}
          onChange={handleChange}
          placeholder="Rua, Avenida, etc."
          autoComplete="address-line1"
          type="text"
        />
        {errors.street && <span className="error">{errors.street}</span>}
      </label>

      <label>
        CEP*
        <input
          name="zip"
          value={data.zip}
          onChange={handleChange}
          placeholder="CEP"
          autoComplete="postal-code"
          type="text"
        />
        {errors.zip && <span className="error">{errors.zip}</span>}
      </label>

      <label>
        Data de nascimento*
        <input
          type="date"
          name="birth"
          value={data.birth}
          onChange={handleChange}
          placeholder="Data de nascimento"
          autoComplete="bday"
          min="1900-01-01"
        />
        {errors.birth && <span className="error">{errors.birth}</span>}
      </label>

      <label>
        Senha*
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>

      <label>
        Confirmar senha*
        <input
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </label>

      <p className="hint" style={{ marginTop: "-0.25rem", fontSize: "0.8rem" }}>
        A senha deve ter pelo menos 10 caracteres, 1 letra maiúscula e 1 número.
      </p>

      <div className="nav-buttons">
        <button onClick={submit}>Enviar</button>
      </div>

      <CaptchaModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
