import { Container, Sprite, Assets } from 'pixi.js';

export class UiLayer extends Container {
    constructor(appWidth) {
        super();

        this.playoffPanel = new Sprite(Assets.get('playoff'));
        this.addChild(this.playoffPanel);

        // Базовый скейл
        this.baseScale = 1.9;
        this.baseScaleVert = 3.5;
        this.playoffPanel.scale.set(this.baseScale);

        // Запоминаем "эталонную" ширину панели
        this.basePanelWidth = this.playoffPanel.width;
    }

    resize(appWidth, appHeight) {
       console.log('appWidth', appWidth);
        console.log('appHeight', appHeight);
       

        // масштабируем по ширине рендера
        const scaleByWidth = appWidth / this.basePanelWidth;

        if (appWidth > appHeight) {
              this.playoffPanel.scale.set(this.baseScale * scaleByWidth);
        } else {
             this.playoffPanel.scale.set( this.baseScaleVert * scaleByWidth);
        };
      

        // нижний левый угол
        this.playoffPanel.x = 0;
        this.playoffPanel.y = appHeight - this.playoffPanel.height;
    }
}
