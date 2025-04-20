import React, { useState, useEffect, CSSProperties } from "react";

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CaptchaModal: React.FC<CaptchaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // --------------------- STATE ---------------------
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    if (isOpen) {
      generateChallenge();
      setAnswer("");
      setError(null);
    }
  }, [isOpen]);

  const generateChallenge = (): void => {
    setA(Math.floor(Math.random() * 9) + 1);
    setB(Math.floor(Math.random() * 9) + 1);
  };

  const handleVerify = (): void => {
    if (Number(answer) === a + b) {
      onSuccess();
      onClose();
    } else {
      setError("Resposta incorreta. Tente novamente.");
      generateChallenge();
      setAnswer("");
    }
  };

  const overlayStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 9999,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: "24rem",
    borderRadius: "1rem",
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
  };

  const headingStyle: CSSProperties = {
    marginBottom: "1rem",
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#111827",
  };

  const textStyle: CSSProperties = {
    marginBottom: "0.5rem",
    color: "#374151",
    fontSize: "0.95rem",
  };

  const challengeStyle: CSSProperties = {
    marginBottom: "1rem",
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#111827",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    fontSize: "1rem",
    color: "#111827",
    marginBottom: error ? "0.25rem" : "1rem",
  };

  const errorStyle: CSSProperties = {
    marginBottom: "0.75rem",
    fontSize: "0.875rem",
    color: "#dc2626",
  };

  // button base
  const buttonBase: CSSProperties = {
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  };

  const cancelBtn: CSSProperties = {
    ...buttonBase,
    backgroundColor: "#e5e7eb",
    color: "#374151",
    marginRight: "0.5rem",
  };

  const verifyBtn: CSSProperties = {
    ...buttonBase,
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    opacity: answer.trim() === "" ? 0.6 : 1,
  };

  if (!isOpen) return null; // Don’t render if closed

  // --------------------- RENDER ---------------------
  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <h2 style={headingStyle}>Verificação de Segurança</h2>
        <p style={textStyle}>Para continuar, resolva a seguinte soma:</p>
        <p style={challengeStyle}>{`${a} + ${b} = ?`}</p>

        <label htmlFor="captcha-answer" className="sr-only">
          Resultado da soma
        </label>
        <input
          id="captcha-answer"
          type="number"
          inputMode="numeric"
          style={inputStyle}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Digite o resultado"
          aria-invalid={!!error}
        />

        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" style={cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            style={verifyBtn}
            onClick={handleVerify}
            disabled={answer.trim() === ""}
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptchaModal;
