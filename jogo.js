class Jogo {
  constructor() {
    this.constantes = {
      alturaPlataforma: 20,
      alturaPersonagem: 50,
      alturaObstaculoNormal: 50,
      alturaObstaculoAlto: 80,
      larguraObstaculo: 50,
    };

    this.velocidadeObstaculo = 5;
    this.estado = 'inicio';

    this.inicializarObjetos();
  }

  inicializarObjetos() {
    const c = this.constantes;

    this.plataformas = [];
    this.obstaculos = [];

    this.personagem = new Personagem(
      50,
      0,
      40,
      60
    );
    
    // Configurar callback para quando o personagem morrer
    this.personagem.onMorrer = () => {
      this.estado = 'gameover';
    };
  }

 atualizar() {
  if (this.estado !== 'jogando') return;

  // Mover plataformas
  for (let plataforma of this.plataformas) {
    plataforma.mover();
  }

  // Atualizar personagem
  this.personagem.atualizar(this.plataformas);

  // Verificação EXTRA: se personagem está sem plataforma e caindo
  if (!this.personagem.noChao && this.personagem.vy > 0) {
    let personagemNaPlataforma = false;
    
    for (let plataforma of this.plataformas) {
      let dentroX = this.personagem.x + this.personagem.largura > plataforma.x &&
                    this.personagem.x < plataforma.x + plataforma.w;
      
      let acimaDaPlataforma = this.personagem.y + this.personagem.altura <= plataforma.y &&
                              this.personagem.y + this.personagem.altura + 5 >= plataforma.y;
      
      if (dentroX && acimaDaPlataforma) {
        personagemNaPlataforma = true;
        break;
      }
    }
    
    // Se não está em nenhuma plataforma e está caindo, continua caindo
    if (!personagemNaPlataforma) {
      // A gravidade já está sendo aplicada, só garantir que continua
    }
  }

  // Verificar se personagem caiu completamente da tela
  if (this.personagem.y > height + 100) {
    this.estado = 'gameover';
  }

  // Atualizar obstáculos
  for (let obstaculo of this.obstaculos) {
    obstaculo.mover(this.velocidadeObstaculo);
    if (this.personagem.colideCom(obstaculo)) {
      this.estado = 'gameover';
    }
  }
}

  desenhar() {
    // O fundo já foi desenhado no sketch.draw()
    
    // Desenhar plataformas de colisão
    for (let plataforma of this.plataformas) {
      plataforma.mostrar();
    }

    // Desenhar personagem
    this.personagem.mostrar();

    // Desenhar obstáculos
    for (let obstaculo of this.obstaculos) {
      obstaculo.mostrar();
    }

    // Desenhar UI (início/game over)
    if (this.estado === 'inicio') {
      this.mostrarTelaInicio();
    } else if (this.estado === 'gameover') {
      this.mostrarGameOver();
    }
  }

  // ADICIONE ESTA FUNÇÃO AQUI
  iniciar() {
    if (this.estado === 'inicio') {
      this.estado = 'jogando';
      console.log("Jogo iniciado!");
    }
  }

  pularPersonagem() {
    if (this.estado === 'jogando') {
      this.personagem.pular();
    }
  }

  deslizarPersonagem() {
    if (this.estado === 'jogando') {
      this.personagem.deslizar();
    }
  }

reiniciar() {
  this.estado = 'inicio';
  this.obstaculos = [];
  
  // Resetar personagem
  this.personagem.x = 50;
  this.personagem.velocidadeX = 0;
  this.personagem.vy = 0;
  this.personagem.deslizando = false;
  this.personagem.altura = this.personagem.alturaNormal;
  
  // Reposicionar nas plataformas
  if (this.plataformas.length > 0) {
    let primeiraPlataforma = this.plataformas[0];
    this.personagem.y = primeiraPlataforma.y - this.personagem.altura;
    this.personagem.noChao = true;
    
    // Resetar posição das plataformas
    for (let i = 0; i < this.plataformas.length; i++) {
      if (fase1 && fase1.Plataforma[i]) {
        this.plataformas[i].x = fase1.Plataforma[i].x;
      }
    }
  }
}

  mostrarTelaInicio() {
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('Pressione ENTER para jogar', width / 2, height / 2);
  }

  mostrarGameOver() {
    fill(255, 0, 0, 200);
    rect(0, 0, width, height);
    
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2 - 30);
    textSize(16);
    text('Pressione R para reiniciar', width / 2, height / 2 + 10);
  }
}
