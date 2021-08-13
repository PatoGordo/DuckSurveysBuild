const utils = {
  GenerateId(len: number, base?: string) {
    base =
      base || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var randomString = "";
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * base.length);
      randomString += base.substring(randomPoz, randomPoz + 1);
    }

    return randomString;
  },
};

const textOpinionFeedback =
  document.querySelectorAll<HTMLElement>("[dks-opinion-form]");

textOpinionFeedback.forEach((item) => {
  item.addEventListener("submit", (e) => {
    e.preventDefault();
    let opinionTextInput = "";

    const validChilds = ["INPUT", "TEXTAREA"];

    Array.from(item.children).forEach((child) => {
      opinionTextInput = (child as HTMLInputElement).value;

      if (!opinionTextInput || opinionTextInput.trim() === "") {
        return;
      }

      if (child.hasAttribute("dks-opinion-input")) {
        if (!validChilds.includes(child.tagName)) {
          throw new Error(
            "Invalid tag! dks-opinion-input can only be <input> and <textarea>"
          );
        }

        if (item.hasAttribute("dks-callback")) {
          const stringCallback = item.getAttribute("dks-callback");

          var callback = new Function("e", "return " + stringCallback + "(e)");
          return callback(opinionTextInput);
        }

        console.log(opinionTextInput);
      }
    });
  });
});

const starRatingSurvey = document.querySelectorAll<HTMLElement>(
  "dks-star-rating-survey"
);

starRatingSurvey.forEach(async (item) => {
  const titleElement = document.createElement("h2");
  const starsElement = document.createElement("div");
  const buttonSubmitElement = document.createElement("button");
  const feedbackView = document.createElement("div");
  const loadingView = document.createElement("div");
  const loadingViewLoader = document.createElement("span");
  const afterSubmitView = document.createElement("div");
  const afterSubmitText = document.createElement("h2");
  const afterSubmitButton = document.createElement("button");

  feedbackView.classList.add("DKS_STAR_RATING_VIEW");
  afterSubmitView.classList.add("DKS_STAR_RATING_VIEW");
  loadingView.classList.add("DKS_STAR_RATING_VIEW");
  starsElement.classList.add("DKS_STAR_RATING_STARS");
  buttonSubmitElement.classList.add("DKS_STAR_RATING_BUTTON");
  afterSubmitButton.classList.add("DKS_STAR_RATING_BUTTON");
  loadingViewLoader.classList.add("DKS_LOADING_ELEMENT");

  loadingView.appendChild(loadingViewLoader);
  item.appendChild(loadingView);

  loadingView.style.display = "flex";
  feedbackView.style.display = "none";
  afterSubmitView.style.display = "none";

  const surveyId = item.getAttribute("survey-id") || null;

  if (surveyId) {
    const res = await fetch(
      `https://feedback-api.vercel.app/star-rating/get/${surveyId}`
    );
    const data = await res.json();
    var survey = data.survey;
  }

  loadingView.style.display = "none";
  feedbackView.style.display = "flex";

  const title = survey ? survey.surveyTitle : item.getAttribute("title");
  const textAfterSubmit =
    item.getAttribute("text-after-submit") || "Thanks for the feedback!";
  const icon = survey ? survey.icon : item.getAttribute("icon");
  const maxCount = survey ? survey.maxCount : item.getAttribute("max-count");
  const closeButtonAfterSubmit =
    item.getAttribute("close-button-after-submit") || false;

  const surveyID = `DKS_STAR_RATING_${
    survey ? survey._id : utils.GenerateId(24)
  }`;

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
  afterSubmitButton.appendChild(document.createTextNode("Close"));
  afterSubmitView.style.display = "none";

  // Button submit
  buttonSubmitElement.addEventListener("click", async () => {
    let starFeedbackCount = 0;

    stars.map((star) => {
      if (star.getAttributeNames().includes("dks-checked")) {
        starFeedbackCount++;
      }
    });

    loadingView.style.display = "flex";
    feedbackView.style.display = "none";

    console.log(starFeedbackCount);

    // Add evaluation to api
    if (survey) {
      const res = await fetch(
        `https://feedback-api.vercel.app/star-rating/get/${surveyId}`
      );
      const data = await res.json();
    }

    if (item.hasAttribute("dks-callback")) {
      const stringCallback = item.getAttribute("dks-callback");

      var callback = new Function("e", "return " + stringCallback + "(e)");
      callback(starFeedbackCount);
    }

    feedbackView.style.display = "none";
    loadingView.style.display = "none";
    afterSubmitView.style.display = "flex";
  });

  // Close button after submit
  afterSubmitButton.addEventListener("click", () => {
    item.style.display = "none";
  });

  afterSubmitText.appendChild(document.createTextNode(textAfterSubmit));
  afterSubmitView.appendChild(afterSubmitText);

  if (closeButtonAfterSubmit) {
    afterSubmitView.appendChild(afterSubmitButton);
  }

  item.appendChild(feedbackView);
  item.appendChild(afterSubmitView);
  item.id += surveyID;
});
