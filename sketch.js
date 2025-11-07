let jogo;
let fundo = [];
let spriteSheet;
let spriteData;
let frames = [];
let plataformasFundo = [];
let fase1;
let assetsCarregados = false;
let imagensCarregadas = 0;
let totalImagens = 0;

function preload() {

  loadJSON("fase1.json", (json) => {
    fase1 = json;

    // Contar total de imagens a carregar
    totalImagens = fase1.Fundo.length + fase1.Plataforma.length;

    // Carregar fundo
    for (let f of fase1.Fundo) {
      let img = loadImage(f.img,
        () => {
          console.log(`Download: ${f.img}`);
          imagensCarregadas++;
          verificarCarregamento();
        },
        () => console.error(`Falha no download: ${f.img}`)
      );
      fundo.push(new Fundo(f.x, f.y, f.largura, f.altura, img));
    }

    // Carregar plataformas visuais
    for (let p of fase1.Plataforma) {
      let img = loadImage(p.img,
        () => {
          console.log(`Plataforma carregada: ${p.img}`);
          imagensCarregadas++;
          verificarCarregamento();
        },
        () => console.error(`Falha no carregamento da Plataforma: ${p.img}`)
      );
      plataformasFundo.push(new Fundo(p.x, p.y, p.largura, p.altura || 50, img));
    }
  });

  // carrega personagem
  spriteSheet = loadImage("/perso/celaena.png",
    () => console.log("SpriteSheet loaded"),
    () => console.error("Failed to load spritesheet")
  );
  spriteData = loadJSON("/perso/celaena.json");
}

function verificarCarregamento() {
  if (imagensCarregadas === totalImagens && totalImagens > 0) {
    assetsCarregados = true;
    console.log("Todos os assets carregados!");
    inicializarJogo();
  }
}

function setup() {
  createCanvas(400, 400);

  // Processar frames do spritesheet
  if (spriteData && spriteData.frames) {
    let frameNames = Object.keys(spriteData.frames).sort();
    for (let frameName of frameNames) {
      let frame = spriteData.frames[frameName].frame;
      frames.push(frame);
    }
    console.log(`Loaded ${frames.length} frames from spritesheet`);
  }

  // Se já carregou tudo, inicializar jogo
  if (assetsCarregados) {
    inicializarJogo();
  }
}

function inicializarJogo() {
  jogo = new Jogo();

  // Atualizar o personagem com o spritesheet e frames
  jogo.personagem.spriteSheet = spriteSheet;
  jogo.personagem.frames = frames;

  // Conectar o callback de morte
  jogo.personagem.onMorrer = () => {
    jogo.estado = 'gameover';
    console.log("Game Over - Personagem caiu!");
  };

  // Criar plataformas de colisão a partir do JSON
  if (fase1 && fase1.Plataforma) {
    jogo.plataformas = [];

    for (let p of fase1.Plataforma) {
      let platImgFundo = plataformasFundo.find(f =>
        Math.abs(f.x - p.x) < 10 && Math.abs(f.y - p.y) < 10
      );

      let plataforma = new Plataforma(p.x, p.y, p.largura, p.altura || 50, platImgFundo);
      plataforma.velocidade = 3;
      jogo.plataformas.push(plataforma);
    }
  }

  // Posicionar personagem em cima da primeira plataforma
  if (jogo.plataformas.length > 0) {
    let primeiraPlataforma = jogo.plataformas[0];
    jogo.personagem.y = primeiraPlataforma.y - jogo.personagem.altura;
    jogo.personagem.x = 50;
    jogo.personagem.noChao = true;
  }

  console.log("Jogo inicializado!");
}

function draw() {
  // Limpar tela
  background(220);

  // Desenhar fundo primeiro (se carregado)
  if (assetsCarregados) {
    for (let f of fundo) {
      f.mostrar();
    }
  } else {
    // Mostrar loading screen
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Carregando... " + imagensCarregadas + "/" + totalImagens, width / 2, height / 2);
  }

  // Atualizar e desenhar jogo (se inicializado)
  if (jogo) {
    jogo.atualizar();
    jogo.desenhar();
  }
}

function keyPressed() {
  if (!jogo) return false;

  if (key === 'ArrowUp' || key === ' ') {
    jogo.pularPersonagem();
  }
  if (key === 'Enter') {
    jogo.iniciar();
  }
  if (key === 'r' || key === 'R') {
    jogo.reiniciar();
  }
  if (key === 'ArrowDown') {
    jogo.deslizarPersonagem();
  }
  return false;
}
