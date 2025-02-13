import { ILoadingScreen, Engine } from "@babylonjs/core";

export class LoadingScreen implements ILoadingScreen {
  public loadingUIBackgroundColor: string;
  public loadingUIText: string;

  private engine: Engine;
  private loadingDiv: HTMLDivElement;
  private progressBar: HTMLDivElement;
  private progressText: HTMLDivElement;

  constructor(engine: Engine) {
    this.engine = engine;
    this.loadingUIBackgroundColor = "#18181b";
    this.loadingUIText = "Loading...";

    engine.loadingScreen = this;

    this.loadingDiv = document.createElement("div");
    this.loadingDiv.className =
      "fixed inset-0 flex flex-col items-center justify-center bg-zinc-900 z-[1000]";

    const text = document.createElement("div");
    text.className = "text-white text-lg mb-2 font-medium";
    text.textContent = this.loadingUIText;

    const progressContainer = document.createElement("div");
    progressContainer.className =
      "w-64 h-6 bg-zinc-700 rounded-full overflow-hidden relative";

    this.progressBar = document.createElement("div");
    this.progressBar.className =
      "h-full bg-blue-500 transition-all duration-300 ease-out";
    this.progressBar.style.width = "0%";

    this.progressText = document.createElement("div");
    this.progressText.className =
      "text-white text-sm font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    this.progressText.textContent = "0%";

    progressContainer.appendChild(this.progressBar);
    progressContainer.appendChild(this.progressText);
    this.loadingDiv.append(text, progressContainer);
    document.body.appendChild(this.loadingDiv);
  }

  public displayLoadingUI(): void {
    this.loadingDiv.style.display = "flex";
    this.engine.getRenderingCanvas()!.style.visibility = "hidden";
  }

  public hideLoadingUI(): void {
    this.loadingDiv.style.opacity = "0";
    setTimeout(() => {
      this.loadingDiv.remove();
      this.engine.getRenderingCanvas()!.style.visibility = "visible";
    }, 300);
  }

  public updateProgress(progress: number): void {
    const percent = Math.floor(progress * 100);
    this.progressBar.style.width = `${percent}%`;
    this.progressText.textContent = `${percent}%`;
  }
}
