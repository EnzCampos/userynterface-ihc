import { useState, useRef } from "react";

const interests = [
  "Ponies",
  "Polo",
  "Dough",
  "Snails",
  "Balls",
  "Post-its",
  "Faucets",
  "Enveloppes",
  "Cables",
  "Questions",
  "Squares",
  "Purple",
  "Cotton",
  "Dry-wall",
  "Closets",
  "Tires",
  "Windows",
  "Mullets",
  "Cinnamon",
];

export default function UserProfile() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleInterest = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const submit = () => {
    if (selected.length < 3) {
      setError("Escolha no mínimo 3 interesses.");
      return;
    }
    setError("");
    alert("Perfil salvo com sucesso!");
  };

  return (
    <div className="form-wrapper">
      <h2>Perfil do Usuário</h2>

      <div className="avatar-section">
        <div
          className="avatar-preview"
          onClick={() => fileRef.current?.click()}
        >
          {avatar ? (
            <img src={avatar} alt="Avatar" />
          ) : (
            <span>Clique para enviar foto</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>

      <fieldset className="interests-field">
        <legend>Escolha no mínimo 3 interesses</legend>
        <div className="interests-grid">
          {interests.map((int) => (
            <label key={int} className="checkbox">
              <input
                type="checkbox"
                checked={selected.includes(int)}
                onChange={() => toggleInterest(int)}
              />
              {int}
            </label>
          ))}
        </div>
        {error && <span className="error">{error}</span>}
      </fieldset>

      <div className="nav-buttons">
        <button onClick={submit}>Salvar</button>
      </div>
    </div>
  );
}
