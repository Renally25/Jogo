class Fundo {
    constructor(x, y, largura, altura, img){
    this.x =x;
    this.y =y;
    this.largura=largura;
    this.altura=altura;
    this.img = img;
  }

  mostrar() {
  image(this.img, this.x, this.y, this.largura, this.altura)
  }
}