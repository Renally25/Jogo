class Plataforma {
  constructor(x, y, w, h, imgFundo = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.imgFundo = imgFundo;
    this.velocidade = 3;
  }
  
  mostrar() {
    if (this.imgFundo && this.imgFundo.img) {
      image(this.imgFundo.img, this.x, this.y, this.w, this.h);
    } else {
      fill(100, 200, 100);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  mover() {
    this.x -= this.velocidade;
    
    // Se sair completamente da tela, pode ser reposicionada
    if (this.x + this.w < -100) {
      // Aqui você pode adicionar lógica para reposicionar a plataforma
      // this.x = width + random(100, 300);
    }
  }
  
  colideCom(personagem) {
    return personagem.x < this.x + this.w &&
           personagem.x + personagem.largura > this.x &&
           personagem.y < this.y + this.h &&
           personagem.y + personagem.altura > this.y;
  }
}
