function GenerateId(len: number, base?: string) {
  base =
    base || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * base.length);
    randomString += base.substring(randomPoz, randomPoz + 1);
  }

  return randomString;
}

const starRatingSurvey =
  document.querySelectorAll<HTMLElement>("star-rating-survey");

starRatingSurvey.forEach((item) => {
  const title = item.getAttribute("title") || "Unnamed survey";
  const textAfterSubmit =
    item.getAttribute("text-after-submit") || "Thanks for the feedback!";
  const icon = item.getAttribute("icon") || "star";
  const maxCount = Number(item.getAttribute("max-count")) || 5;

  const surveyID = `DKS_STAR_RATING_${GenerateId(8)}`;

  const titleElement = document.createElement("h2");
  const starsElement = document.createElement("div");
  const buttonSubmitElement = document.createElement("button");
  const feedbackView = document.createElement("div");
  const afterSubmitView = document.createElement("div");
  const afterSubmitText = document.createElement("h2");
  const afterSubmitButton = document.createElement("button");

  feedbackView.classList.add("DKS_STAR_RATING_VIEW");
  afterSubmitView.classList.add("DKS_STAR_RATING_VIEW");
  starsElement.classList.add("DKS_STAR_RATING_STARS");
  buttonSubmitElement.classList.add("DKS_STAR_RATING_BUTTON");
  afterSubmitButton.classList.add("DKS_STAR_RATING_BUTTON");

  const stars: HTMLElement[] = [];

  for (let i = 0; i < maxCount; i++) {
    const star = document.createElement("span");
    star.classList.add("fa");
    star.classList.add(`fa-${icon}`);

    if (i === 0) {
      star.setAttribute("dks-checked", "");
    }

    star.addEventListener("click", () => {
      const item = stars.indexOf(star);

      const allItemsBeforeStar = item > -1 ? stars.slice(0, item) : [];
      const allItemsAfterStar = stars.slice(item + 1);

      allItemsAfterStar.forEach((item) => {
        item.removeAttribute("dks-checked");
      });

      allItemsBeforeStar.forEach((item) => {
        item.setAttribute("dks-checked", "");
      });

      star.setAttribute("dks-checked", "");
    });

    star.classList.add("DKS_STAR_RATING_STAR_ITEM");
    stars.push(star);
  }

  stars.forEach((item) => {
    starsElement.appendChild(item);
  });

  buttonSubmitElement.appendChild(document.createTextNode("Submit feedback"));
  titleElement.appendChild(document.createTextNode(title));

  feedbackView.appendChild(titleElement);
  feedbackView.appendChild(starsElement);
  feedbackView.appendChild(buttonSubmitElement);
  afterSubmitView.style.display = "none";

  afterSubmitButton.appendChild(document.createTextNode("Close"));

  // Button submit
  buttonSubmitElement.addEventListener("click", () => {
    let starFeedbackCount = 0;

    stars.map((star) => {
      if (star.getAttributeNames().includes("dks-checked")) {
        starFeedbackCount++;
      }
    });

    console.log(starFeedbackCount);

    feedbackView.style.display = "none";
    afterSubmitView.style.display = "block";
  });

  // Close button after submit
  afterSubmitButton.addEventListener("click", () => {
    item.style.display = "none";
  });

  afterSubmitText.appendChild(document.createTextNode(textAfterSubmit));
  afterSubmitView.appendChild(afterSubmitText);
  afterSubmitView.appendChild(afterSubmitButton);

  item.appendChild(feedbackView);
  item.appendChild(afterSubmitView);
  item.id += surveyID;
});
