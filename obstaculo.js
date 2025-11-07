class Obstaculo extends Entidade {
  constructor(x, y, tipo = 'normal') {
    let largura = 50;
    let altura = 50;

    if (tipo === 'alto') {
      altura = 100;
      y = y - 50; // ajusta o y para que fique "grudado" no chão
    }

    super(x, y, largura, altura);
    this.tipo = tipo;
  }

  mover(velocidade) {
    this.x -= velocidade;
    if (this.x < -this.largura) {
      this.x = width + random(100, 300);
    }
  }

  mostrar() {
    if (this.tipo === 'alto') {
      super.mostrar([255, 0, 0]); // vermelho para obstáculo alto
      //o super é pra vir a função da classe pai
    } else {
      super.mostrar([255, 255, 0]); // amarelo para normal
    }
  }

  colideCom(personagem) {
    if (this.tipo === 'alto') {
      if (personagem.deslizando) {
        // personagem deslizando passa por baixo
        return false;
      } else {
        return super.colideCom(personagem);
      }
    } else {
      return super.colideCom(personagem);
    }
  }
}