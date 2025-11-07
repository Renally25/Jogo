class Personagem extends Entidade {
  constructor(x, y, largura, altura, spriteSheet = null, frames = []) {
    super(x, y, largura, altura);
    this.vy = 0;
    this.gravidade = 1;
    this.forcaDoPulo = -15;
    this.noChao = false;
    this.velocidadeX = 0;
    this.velocidadeMovimento = 5;

    this.spriteSheet = spriteSheet;
    this.frames = frames;
    this.frameIndex = 0;
    this.velocidadeAnimacao = 10;
    
    // Adicionar propriedades para deslizar
    this.deslizando = false;
    this.alturaNormal = altura;
    this.alturaSlide = altura * 0.5;
    this.timerDeslize = 0;
    
    console.log(`Personagem criado com ${frames.length} frames`);
  }

  atualizar(plataformas) {
    // Aplicar movimento horizontal
    this.x += this.velocidadeX;
    
    // Limitar personagem dentro da tela
    this.x = constrain(this.x, 0, width - this.largura);

    // Lógica de deslize
    if (this.deslizando) {
      this.timerDeslize--;
      if (this.timerDeslize <= 0) {
        this.deslizando = false;
        this.altura = this.alturaNormal;
        this.y -= (this.alturaNormal - this.alturaSlide);
      }
    }

    // Verificar colisão com plataformas
    this.verificarPlataformas(plataformas);

    // Animação - apenas se tiver frames
    if (this.frames.length > 0 && frameCount % this.velocidadeAnimacao === 0) {
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
  }

  mover(direcao) {
    this.velocidadeX = direcao * this.velocidadeMovimento;
  }

  parar() {
    this.velocidadeX = 0;
  }

  mostrar() {
    // Debug: mostrar informações do frame atual
    if (this.frames.length > 0 && this.frameIndex < this.frames.length) {
      let frame = this.frames[this.frameIndex];
      
      // Verificar se o spritesheet está carregado
      if (this.spriteSheet && this.spriteSheet.width > 0) {
        image(
          this.spriteSheet,
          this.x, this.y, this.largura, this.altura,
          frame.x, frame.y, frame.w, frame.h
        );
      } else {
        // Spritesheet não carregado ainda
        fill(255, 0, 0);
        rect(this.x, this.y, this.largura, this.altura);
        fill(255);
        text("Carregando...", this.x, this.y - 10);
      }
    } else {
      // Fallback: retângulo colorido
      fill(255, 0, 0);
      rect(this.x, this.y, this.largura, this.altura);
      
      // Mostrar número de frames para debug
      fill(255);
      text(`Frames: ${this.frames.length}`, this.x, this.y - 10);
    }
  }

verificarPlataformas(plataformas) {
  // Aplicar gravidade
  this.vy += this.gravidade;
  this.noChao = false;

  // Aplicar movimento vertical primeiro
  this.y += this.vy;

  // Verificar colisão com cada plataforma
  for (let plataforma of plataformas) {
    // Verificar se está dentro da plataforma no eixo X
    let dentroX = this.x + this.largura > plataforma.x &&
                  this.x < plataforma.x + plataforma.w;
    
    // Verificar se está colidindo no eixo Y (pés do personagem com topo da plataforma)
    let colidindoY = this.y + this.altura > plataforma.y &&
                     this.y < plataforma.y + plataforma.h;

    if (dentroX && colidindoY) {
      // Se estava caindo e colidiu com o topo da plataforma
      if (this.vy > 0 && this.y + this.altura - this.vy <= plataforma.y) {
        // Ajustar posição para ficar em cima da plataforma
        this.y = plataforma.y - this.altura;
        this.vy = 0;
        this.noChao = true;
        break;
      }
      // Se estava subindo e colidiu com o fundo da plataforma
      else if (this.vy < 0 && this.y - this.vy >= plataforma.y + plataforma.h) {
        this.y = plataforma.y + plataforma.h;
        this.vy = 0;
      }
    }
  }

  // Verificar se caiu da tela (morreu)
  if (this.y > height) {
    this.morrer();
    return;
  }

  // Verificar se está muito abaixo da plataforma mais baixa
  let plataformaMaisBaixa = 0;
  for (let plataforma of plataformas) {
    if (plataforma.y > plataformaMaisBaixa) {
      plataformaMaisBaixa = plataforma.y;
    }
  }
  
  // Se estiver muito abaixo da plataforma mais baixa, morre
  if (this.y > plataformaMaisBaixa + 200) {
    this.morrer();
  }
}

// Adicione esta função para morrer
morrer() {
  console.log("Personagem morreu - caiu da plataforma");
  // Você pode adicionar efeitos visuais/sonoros aqui
  
  // Disparar evento de game over
  if (typeof this.onMorrer === 'function') {
    this.onMorrer();
  }
}

  pular() {
    if (this.noChao && !this.deslizando) {
      this.vy = this.forcaDoPulo;
      this.noChao = false;
    }
  }

  deslizar() {
    if (!this.deslizando && this.noChao) {
      this.deslizando = true;
      this.timerDeslize = 30;
      this.altura = this.alturaSlide;
      this.y += this.alturaNormal - this.alturaSlide;
    }
  }
}