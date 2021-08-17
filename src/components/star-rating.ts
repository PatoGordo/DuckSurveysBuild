export default class StarRating extends HTMLElement {
  private shadow: ShadowRoot;
  private stars: HTMLSpanElement[];

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.stars = this.createStars();
    this.build();
  }

  private build() {
    this.shadow.appendChild(this.styles());

    const starsDiv = document.createElement("div");
    starsDiv.classList.add("stars");

    this.stars.map((star) => {
      starsDiv.appendChild(star);
    });

    const text = document.createElement("h2");
    text.id = "star-rating-text";

    this.shadow.appendChild(starsDiv);
  }

  private createStars() {
    const createStar = (_: any, index: number) => {
      const star = document.createElement("span");

      star.innerHTML = `&#9733;`;
      star.setAttribute("data-value", `${Number(index) + 1}`);
      star.classList.add("star");
      star.addEventListener("mouseover", this.setRating.bind(this));
      star.addEventListener("click", this.addToServer.bind(this));
      return star;
    };

    return Array.from({ length: 5 }, createStar);
  }

  private setRating(e: MouseEvent) {
    const star = e.target as HTMLSpanElement;
    const item = this.stars.indexOf(star);

    const allItemsBeforeStar = item > -1 ? this.stars.slice(0, item) : [];
    const allItemsAfterStar = this.stars.slice(item + 1);

    allItemsAfterStar.forEach((item) => {
      item.removeAttribute("checked");
    });

    allItemsBeforeStar.forEach((item) => {
      item.setAttribute("checked", "true");
    });

    star.setAttribute("checked", "true");
  }

  private async addToServer(e: MouseEvent) {
    const star = e.target as HTMLSpanElement;

    const value = Number(star.getAttribute("data-value"));
    console.log(value);
  }

  private styles() {
    const style = document.createElement("style");

    style.textContent = `
      star-rating {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .star {
        color: gray;
        font-size: 2rem;
        cursor: pointer;
        transition: filter .2s;
      }
      .star[checked="true"] {
        color: orange;
      }
      .star:hover {
        filter: brightness(0.9);
      }
    `;

    return style;
  }
}
