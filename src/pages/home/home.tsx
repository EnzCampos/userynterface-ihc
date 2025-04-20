import { Link } from "react-router";

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <p>
          Olá e bem-vindo ao <strong>User Inyerface</strong>,<br /> uma
          exploração divertida de padrões de interação e design.
        </p>
        <p>
          Para jogar, simplesmente preencha o formulário
          <br /> o mais rápido e preciso possível.
        </p>
        <Link to="/form" className="start-btn">
          COMEÇAR
        </Link>
      </div>
    </div>
  );
}
