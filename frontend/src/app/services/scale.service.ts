import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScaleService {
  public setScaleFactor(): void {
    const referenceHeight: number = 800;
    const heightRatio: number = window.innerHeight / referenceHeight;
    const widthRatio: number = window.innerWidth / referenceHeight;
    const smallerRatio: number = Math.min(heightRatio, widthRatio);
    const scaleFactor: number = Math.max(0.5, Math.min(1.2, smallerRatio));

    document.documentElement.style.setProperty(
      '--vh-scale-factor',
      scaleFactor.toString()
    );
  }
}
