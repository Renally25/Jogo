class Plataforma {
  constructor(x, y, w, h, imgFundo = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.imgFundo = imgFundo;
    this.velocidade = 2; // Velocidade padrão
  }
  
  mostrar() {
    if (this.imgFundo && this.imgFundo.img) {
      // Usar a imagem do fundo para desenhar
      image(this.imgFundo.img, this.x, this.y, this.w, this.h);
    } else {
      // Fallback: plataforma colorida para debug
      fill(100, 200, 100, 150);
      rect(this.x, this.y, this.w, this.h);
    }
  }
  
  colideCom(personagem) {
    return personagem.x < this.x + this.w &&
           personagem.x + personagem.largura > this.x &&
           personagem.y < this.y + this.h &&
           personagem.y + personagem.altura > this.y;
  }

  mover() {
    this.x -= this.velocidade;
    
    // Se sair da tela, reposiciona à direita
    if (this.x + this.w < 0) {
      this.x = width;
    }
  }
}