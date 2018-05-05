export default class CreateImateToJson {
  constructor() {
    // -------------------
    // 設定値
    // -------------------
    // パーティクルの数
    this.particleCount = 3000
    this.particles = []
    // 間引くpxel
    this.cull = 12

    // 画像のサイズ
    // this.stageWidth = 638
    // this.stageHeight = 1020
    this.stageWidth = 1024
    this.stageHeight = 736

    // Json化する画像
    // （配列としているが、一枚ずつセットしダウンロードするものとする）
    this.imgArray =[
      // "/assets/images/common/marilyn.jpg",
      "/assets/images/common/horse2.jpg",
    ]


    // -------------------
    // 初期値
    // -------------------
    this.counter
    this.pixeldata
    this.ctx
    this.stage
    this.countHuman = 0;
    this.bitmapArray = new Array();
    let c = document.getElementById('canv')
    this.ctx = c.getContext('2d')
    this.stage = new createjs.Stage(c);
    this.init()
    this.resize()
    createjs.Ticker.setFPS(10);
    createjs.Ticker.addEventListener("tick", ()=> {
      this.tick()
    });

  }
  tick() {
    this.drowImage()
    this.stage.update();

  }
  init() {
    // ダウンロード
    document.getElementById('download').addEventListener('click', ()=> {
      console.log('click')
      this.handleDownload()
    })

    // キャッシュ化
    for(let i = 0; i < this.imgArray.length; i++) {
      let img = new createjs.Bitmap(this.imgArray[i])
      img.w = this.stageWidth
      img.h = this.stageHeight
      img.x = 0
      img.y = 0
      this.bitmapArray.push(img)
    }

    // パーティクル設定
    for(var i = 0; i < this.particleCount; i++){
      var color = "rgba("+this.randomNum(64)+","+this.randomNum(32,192)+",255,1)";
      var particle = new createjs.Text(0,"10px Arial","#FF0000");
      this.particles.push(particle);
      this.stage.addChild(particle);
    }
  }

  drowImage() {
    this.stage.compositeOperation = "default";
    if(this.countHuman >= this.bitmapArray.length) {
      this.countHuman = 0
    }

    // パーティクルを隠す
    var rect = new createjs.Shape();
    rect.graphics.beginFill("#000");
    rect.graphics.drawRect(0,0,this.stageWidth,this.stageHeight);
    this.stage.compositeOperation = "default";

    // ヒューマン表示
    this.stage.addChild(rect)
    let img = this.bitmapArray[this.countHuman]

    this.stage.addChild(img)
    this.countHuman++
    this.stage.update()

    // ピクセルデータ取得
    let pixels = this.ctx.getImageData(img.x,img.y,img.w,img.h)
    this.pixeldata = pixels.data

    // ヒューマン削除
    this.stage.removeChild(img)
    this.stage.update()
    this.stage.compositeOperation = "lighter"

    let i = 0
    for(let w = 0; w < img.w; w += this.cull){
      for(let h = 0; h < img.h; h += this.cull){
        if(pixels.data[(w+img.w*h)*4] !== 255 && i < this.particles.length) {
          var particle = this.particles[i];
          // particle.graphics.beginFill("#ffff00")
          particle.x = img.x+w;
          particle.y = img.y+h;
          particle.color = `rgba(255,0,0,${Math.random()+0.5}`
          i++;
        }
      }
    }
    while( i < this.particles.length) {
      var particle = this.particles[i];
      particle.color = `rgba(255,0,0,0.1}`
      i++;
    }
    this.stage.update()


  }

  resize() {
    document.getElementById('canv').setAttribute('width', this.stageWidth + 'px');
    document.getElementById('canv').setAttribute('height', this.stageHeight + 'px');
  }
  randomNum(min,max) {
    return min + Math.floor(Math.random() * (max - min + 1))
  }

  handleDownload() {
    let outputData = []
    // PC
    // let img_w = 1265;
    // let img_h = 1672;
    // SP
    let img_w = this.stageWidth
    let img_h = this.stageHeight

    for(let i = 0; i < this.pixeldata.length; i += 4){
      outputData.push(this.pixeldata[i])
    }

    console.log(outputData)
      var blob = new Blob([ outputData ], { "type" : "text/plain" });

      if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, "test.txt");

          // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
          window.navigator.msSaveOrOpenBlob(blob, "test.txt");
      } else {
          document.getElementById("download").href = window.URL.createObjectURL(blob);
      }
  }


}
