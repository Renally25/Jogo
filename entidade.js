class Entidade {
    constructor(x, y, largura = 50, altura = 50) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }

    mostrar(cor = [255]) {
        fill(...cor);
        noStroke();
        rect(this.x, this.y, this.largura, this.altura);
    }

    colideCom(outra) {
        return (this.x < outra.x + outra.largura &&
                this.x + this.largura > outra.x &&
                this.y < outra.y + outra.altura &&
                this.y + this.altura > outra.y);
    }
}